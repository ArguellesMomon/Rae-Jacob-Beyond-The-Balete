import test from 'node:test';
import assert from 'node:assert/strict';
import { mazePlan, mazePoint, mazeDistances, mazeCodes, currentMaze, MAZE_TRIALS, mazeRuneAnswer, MAZE_FORK_IDS, mazeGuideNext, MAZE_CAMERA_ZOOM } from '../src/game/mazeTrials.ts';
import { canStand, completeInteraction, parseSave, travelRoute } from '../src/game/engine.ts';
import { getMap } from '../src/game/world.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { followsRoute, routeReady } from '../src/game/chapterTwo.ts';
import { cameraTarget, sceneViewport } from '../src/game/camera.ts';
import { mazeWitnessRecord } from '../src/art/mazeTrialArt.ts';

test('ninety seeded layouts retain connected paths and have one destination a short walk from the entrance', () => {
  const shapes=new Set<string>();
  for(let seed=1;seed<=30;seed++)for(let stage=0;stage<3;stage++){
    const p=replayCheckpoint('bambooPuzzle').progress;p.chapterTwo.mazeSeed=seed*138721;p.chapterTwo.trailStep=stage;
    const plan=currentMaze(p),distances=mazeDistances(plan.links,plan.entryNode),map=getMap('turning',p);
    assert.ok(distances.every(n=>n>=0));
    assert.ok(distances[plan.goal.node]>=12+stage*2&&distances[plan.goal.node]<=16+stage*2,'the required destination is bounded, never the farthest maze cell');
    assert.equal(map.interactions.filter(i=>MAZE_FORK_IDS.includes(i.id as typeof MAZE_FORK_IDS[number])).length,1);
    assert.ok(!map.interactions.some(i=>['mazeWitnessA','mazeWitnessB','turningCharm','pathStone','pathWind','pathWater'].includes(i.id)));
    assert.ok(canStand(plan.goal.point,plan.colliders,'turning'));
    for(const [a,b]of plan.edges){const from=mazePoint(a),to=mazePoint(b);for(let n=0;n<=8;n++)assert.ok(canStand({x:from.x+(to.x-from.x)*n/8,y:from.y+(to.y-from.y)*n/8},map.colliders,'turning'),'creature footprints must leave every corridor open');}
    const a=mazePoint(plan.rest.node),b=mazePoint(plan.rest.next),middle={x:(a.x+b.x)/2,y:(a.y+b.y)/2};
    const gap=a.x===b.x?{x:middle.x+44,y:middle.y}:{x:middle.x,y:middle.y+44};
    assert.equal(canStand(gap,map.colliders,'turning'),false,'the side clearing cannot punch through into an adjacent road');
    shapes.add(JSON.stringify(plan.edges));
  }assert.equal(shapes.size,90);
});

test('every gold arrow follows a real corridor closer to the goal, including from old saved positions and dead ends',()=>{
  for(let seed=0;seed<20;seed++)for(let stage=0;stage<3;stage++){
    const plan=mazePlan(seed,stage);
    for(let node=0;node<plan.links.length;node++){
      const next=mazeGuideNext(plan,node);
      if(node===plan.goal.node){assert.equal(next,null);continue;}
      assert.notEqual(next,null);assert.ok(plan.links[node].includes(next!));
      assert.equal(plan.goalDistances[next!],plan.goalDistances[node]-1,'following arrows cannot loop or lead farther away');
    }
    let node=plan.entryNode,walk=0;while(node!==plan.goal.node){node=mazeGuideNext(plan,node)!;walk++;assert.ok(walk<=20);}
  }
});

test('one sign completes each trial with no witnesses or rune prerequisites and completed signs cannot be earned twice',()=>{
  const save=replayCheckpoint('bambooPuzzle');let p=completeInteraction(save.progress,'turningArrival');p.chapterTwo.mazeSeed=90210;
  for(let stage=0;stage<3;stage++){
    const plan=currentMaze(p),before=JSON.stringify(plan.edges);assert.equal(routeReady(p),true);
    const loaded=parseSave(JSON.stringify({...save,player:{...save.player,...plan.spawn},progress:p}))!;
    assert.deepEqual(loaded.progress.chapterTwo,p.chapterTwo);assert.equal(JSON.stringify(currentMaze(loaded.progress).edges),before);
    assert.deepEqual(p.chapterTwo.mazeWitnesses,[0,0,0]);
    p=completeInteraction(p,plan.goal.id);assert.equal(p.chapterTwo.trailStep,stage+1);assert.equal(p.chapterTwo.loops,0);
    assert.deepEqual(completeInteraction(p,plan.goal.id),p,'a double interaction cannot complete another trial');
    assert.ok(p.discoveries.includes(MAZE_TRIALS[stage].proof));
    if(stage<2){const next=travelRoute(p,'bambooLoop')!;assert.deepEqual({x:next.player.x,y:next.player.y},currentMaze(p).spawn);}
  }
  assert.equal(p.chapterTwo.routeVerified,true);assert.equal(p.chapterTwo.glamourBroken,true);assert.equal(p.ubanGiftReceived,false);
  assert.match(mazeWitnessRecord(p),/trial complete/);
});
test('the close camera cannot expose the entire labyrinth and keeps its frame inside the painted ground at every edge', () => {
  const plan=mazePlan(9,2);
  for(const [width,height] of [[844,390],[390,844],[1920,1080]]){
    const original=sceneViewport(width,height,undefined,plan),view={vw:original.vw/MAZE_CAMERA_ZOOM,vh:original.vh/MAZE_CAMERA_ZOOM};
    assert.ok(view.vw<plan.width/2);assert.ok(view.vh<plan.height*2/3);
    assert.ok(30*height/view.vh>30*height/original.vh,'Rae is visibly larger');
    for(const point of [plan.spawn,plan.proof,...plan.gates.map(g=>g.point)]){
      const camera=cameraTarget(point,plan,view);assert.ok(camera.x>=0&&camera.y>=0);assert.ok(camera.x+view.vw<=plan.width&&camera.y+view.vh<=plan.height);
    }
  }
});

test('malformed seeds and witness masks normalize safely without losing already completed trials', () => {
  const save=replayCheckpoint('bambooWater');
  const bad=JSON.parse(JSON.stringify(save));bad.progress.chapterTwo.mazeSeed=-1;bad.progress.chapterTwo.mazeWitnesses=[999,'three',null];
  const loaded=parseSave(JSON.stringify(bad))!;assert.equal(loaded.progress.chapterTwo.mazeSeed,0);assert.deepEqual(loaded.progress.chapterTwo.mazeWitnesses,[0,0,0]);assert.equal(loaded.progress.chapterTwo.trailStep,2);
  assert.ok(canStand(loaded.player,getMap('turning',loaded.progress).colliders,'turning'));
  const legacy=replayCheckpoint('bambooPuzzle').progress;
  legacy.chapterTwo.mazeWitnesses[0]=3;
  assert.deepEqual(completeInteraction(legacy,'bagtas').chapterTwo,legacy.chapterTwo,'revisiting Bagtas cannot reseed an already started legacy trial');
});
