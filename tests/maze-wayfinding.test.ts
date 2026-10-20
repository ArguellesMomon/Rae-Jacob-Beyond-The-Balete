import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { currentMaze, mazePlan, mazePoint, MAZE_FORK_IDS } from '../src/game/mazeTrials.ts';
import { mazeWayfinding, helperDirections } from '../src/game/mazeWayfinding.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { getMap } from '../src/game/world.ts';
import { canStand, nearbyInteraction, completeInteraction, parseSave } from '../src/game/engine.ts';
import { linesFor } from '../src/game/dialogue.ts';
import { creatureEncounters } from '../src/game/creatureCodex.ts';
import { mazeHelperActors } from '../src/art/mazeHelperArt.ts';
import { mazeGuidesSvg } from '../src/art/mazeTrialArt.ts';
import { dalisaySvg, tigmamanukanSvg, trailCreaturePortraitSvg } from '../src/art/trailCreatureArt.ts';
import { knownCharacters } from '../src/game/characters.ts';

test('worn arrows are small and widely spaced, while turn clues follow the real route across randomized maps',()=>{
  for(let seed=0;seed<15;seed++)for(let stage=0;stage<3;stage++){
    const plan=mazePlan(seed,stage),way=mazeWayfinding(plan);
    assert.ok(way.arrows.length<plan.links.length/4,'at least three quarters of the former per-cell marks are gone');
    assert.ok(way.arrows.length>0);
    for(let i=0;i<way.arrows.length;i++){
      const a=way.arrows[i];assert.ok(plan.links[a.node].includes(a.next));assert.equal(plan.goalDistances[a.next],plan.goalDistances[a.node]-1);
      for(const b of way.arrows.slice(i+1))assert.ok(Math.hypot(a.point.x-b.point.x,a.point.y-b.point.y)>=160,'nearby folds must not pile arrows together');
    }
    for(const clue of way.clues){assert.ok(way.route.includes(clue.node));assert.equal(plan.goalDistances[clue.next],plan.goalDistances[clue.node]-1);}
    for(let i=1;i<way.route.length-1;i++){
      const before=mazePoint(way.route[i-1]),here=mazePoint(way.route[i]),after=mazePoint(way.route[i+1]);
      const turn=(here.x-before.x)!==(after.x-here.x)||(here.y-before.y)!==(after.y-here.y);
      if(turn||plan.links[way.route[i]].length>2)assert.ok(way.clues.some(c=>c.node===way.route[i]&&c.kind==='petals'),'every required decision has a natural confirmation');
    }
  }
});

test('the omen bird and giantess give seeded directions without blocking paths or adding completion requirements',()=>{
  for(let seed=0;seed<10;seed++)for(let stage=0;stage<3;stage++){
    const save=replayCheckpoint('bambooPuzzle'),p=completeInteraction(save.progress,'turningArrival');p.chapterTwo.mazeSeed=seed;p.chapterTwo.trailStep=stage;
    const plan=currentMaze(p),way=mazeWayfinding(plan),map=getMap('turning',p);
    assert.equal(map.interactions.filter(i=>MAZE_FORK_IDS.includes(i.id as typeof MAZE_FORK_IDS[number])).length,1);
    for(const helper of way.helpers){
      const a=mazePoint(helper.node),b=mazePoint(helper.next),center={x:(a.x+b.x)/2,y:(a.y+b.y)/2};
      assert.ok(canStand(center,map.colliders,'turning'));
      assert.equal(canStand(helper.point,map.colliders,'turning'),false,'the NPC has a physical footing');
      assert.equal(nearbyInteraction(center,undefined,'turning',undefined,p)?.id,helper.id);
      for(let n=0;n<=8;n++)assert.ok(canStand({x:a.x+(b.x-a.x)*n/8,y:a.y+(b.y-a.y)*n/8},map.colliders,'turning'),'the full corridor remains open');
      const dialogue=linesFor(helper.id,p,'turning');assert.ok(dialogue.some(l=>l.text===helperDirections(plan,helper.id)));
      assert.ok(dialogue.some(l=>l.beat?.includes(helper.id==='dalisay'?'points':'flies')));
      const helped=completeInteraction(p,helper.id);
      assert.deepEqual({...helped.chapterTwo,helperChats:p.chapterTwo.helperChats},p.chapterTwo);
      assert.equal(helped.chapterTwo.helperChats[helper.id],(p.chapterTwo.helperChats[helper.id]??0)+1);
      assert.deepEqual(helped.residentChats,p.residentChats,'forest encounters never retcon village duwende');
      const loaded=parseSave(JSON.stringify({...save,player:{...save.player,...plan.spawn},progress:helped}))!;
      assert.ok(creatureEncounters(helper.id==='dalisay'?'giantess':'tigmamanukan',loaded.progress).length>0);
      assert.ok(knownCharacters(loaded.progress).includes(helper.id));
      assert.ok(linesFor(helper.id,loaded.progress,'turning').length<dialogue.length,'repeat guidance is shorter');
      assert.ok(!map.interactions.some(i=>i.id==='nilo'||i.id==='sela'));
    }
    const inspect=way.inspect.point;assert.ok(canStand(inspect,map.colliders,'turning'));
    assert.equal(nearbyInteraction(inspect,undefined,'turning',undefined,p)?.id,'trailVerse');
    assert.deepEqual(completeInteraction(p,'trailVerse').chapterTwo,p.chapterTwo);
    assert.equal(completeInteraction(p,plan.goal.id).chapterTwo.trailStep,stage+1,'all help stays optional');
  }
});

test('both creature silhouettes face all four directions and ambient motion freezes in Still mode',async()=>{
  const p=replayCheckpoint('bambooPuzzle').progress;
  for(const id of ['tigmamanukan','dalisay'] as const){
    const directions=[];
    for(const facing of ['up','down','left','right'] as const){
      const source=id==='tigmamanukan'?tigmamanukanSvg(facing):dalisaySvg(facing);
      directions.push(source);
      const {info}=await sharp(Buffer.from(source)).png().toBuffer({resolveWithObject:true});
      assert.equal(info.width,id==='tigmamanukan'?40:64);assert.equal(info.height,id==='tigmamanukan'?40:80);
    }
    assert.equal(new Set(directions).size,4);
    const portrait=await sharp(Buffer.from(trailCreaturePortraitSvg(id))).metadata();assert.equal(portrait.width,80);assert.equal(portrait.height,96);
  }
  assert.notDeepEqual(mazeHelperActors(p,1),mazeHelperActors(p,4));
  assert.deepEqual(mazeHelperActors(p,1,false),mazeHelperActors(p,4,false));
  for(const actor of mazeHelperActors(p,1)){const {info}=await sharp(Buffer.from(actor.svg)).png().toBuffer({resolveWithObject:true});assert.equal(info.width,actor.width);assert.equal(info.height,actor.height);}
  const frames=await Promise.all([1,2.5,3,4].map(t=>sharp(Buffer.from(mazeHelperActors(p,t)[0].svg)).raw().toBuffer()));
  for(let i=1;i<frames.length;i++)assert.notDeepEqual(frames[0],frames[i],'the bird visibly flaps and leaves its perch');
  const guide=mazeGuidesSvg(p);assert.ok(guide.includes('id="trail-petals-'));assert.ok(guide.includes('id="trail-arrow-'));
  assert.ok(!guide.includes('data-trail-'),'custom XML attributes get camel-cased into unsupported renderer props');
});

test('legacy visits do not invent new creatures and malformed helper counts preserve earned trials',()=>{
  const save=replayCheckpoint('bambooWind');save.progress.residentChats={nilo:8,sela:5};
  const raw=JSON.parse(JSON.stringify(save));delete raw.progress.chapterTwo.helperChats;
  const legacy=parseSave(JSON.stringify(raw))!;
  assert.deepEqual(legacy.progress.chapterTwo.helperChats,{});
  assert.deepEqual(creatureEncounters('tigmamanukan',legacy.progress),[]);
  assert.deepEqual(creatureEncounters('giantess',legacy.progress),[]);
  assert.ok(creatureEncounters('duwende',legacy.progress).includes('Nilo'));
  raw.progress.chapterTwo.helperChats={tigmamanukan:-5,dalisay:'yes',nilo:20};
  assert.deepEqual(parseSave(JSON.stringify(raw))!.progress.chapterTwo.helperChats,{});
  raw.progress.chapterTwo.helperChats={tigmamanukan:1.9,dalisay:Infinity};
  const fixed=parseSave(JSON.stringify(raw))!;
  assert.deepEqual(fixed.progress.chapterTwo.helperChats,{tigmamanukan:1});
  assert.equal(fixed.progress.chapterTwo.trailStep,1);
  assert.equal(fixed.progress.chapterTwo.mazeSeed,save.progress.chapterTwo.mazeSeed);
});
