import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { completeInteraction, parseSave, canStand, nearbyInteraction } from '../src/game/engine.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { FORKS, followsRoute, routeReady } from '../src/game/chapterTwo.ts';
import { currentMaze, MAZE_TRIALS } from '../src/game/mazeTrials.ts';
import { mazeGlamourSvg } from '../src/art/mazeTrialArt.ts';
import { hamletLifeActors } from '../src/art/hamletLifeArt.ts';
import { HAMLET_NEIGHBORS } from '../src/game/hamletLife.ts';
import { getMap } from '../src/game/world.ts';
import { linesFor } from '../src/game/dialogue.ts';
import { walkRoute } from './helpers/walkRoute.ts';

test('one sign is sufficient in each trial; existing completed trials and old saves remain earned', () => {
  const checkpoint=replayCheckpoint('bambooPuzzle');let p=completeInteraction(checkpoint.progress,'turningArrival');
  for(let stage=0;stage<3;stage++){
    const plan=currentMaze(p);assert.equal(routeReady(p),true);
    assert.match(linesFor(plan.goal.id,p,'turning').map(l=>l.text).join(' '),/complete/);
    p=completeInteraction(p,plan.goal.id);assert.equal(p.chapterTwo.trailStep,stage+1);
    const saved=parseSave(JSON.stringify({...checkpoint,progress:p}))!;assert.deepEqual(saved.progress.chapterTwo,p.chapterTwo);
  }
  assert.equal(p.chapterTwo.routeVerified,true);assert.equal(p.chapterTwo.glamourBroken,true);
  const old=JSON.parse(JSON.stringify({...checkpoint,progress:p}));delete old.progress.chapterTwo.glamourBroken;
  assert.equal(parseSave(JSON.stringify(old))!.progress.chapterTwo.routeVerified,true);
});

test('each trial has one reachable destination sign, a companion and a safe return', () => {
  for(let stage=0;stage<3;stage++){
    const save=replayCheckpoint('bambooPuzzle');save.progress.chapterTwo.trailStep=stage;
    const plan=currentMaze(save.progress),map=getMap('turning',save.progress);
    assert.equal(map.interactions.length,6);assert.ok(canStand(plan.goal.point,map.colliders,'turning'));
    assert.ok(walkRoute(map.spawn,plan.goal.point,'turning',save.progress).length>0);
  }
});

test('glamour and household activity freeze under Still while remaining visually distinct after the repair', async () => {
  assert.notEqual(mazeGlamourSvg(replayCheckpoint('bambooPuzzle').progress, 1), mazeGlamourSvg(replayCheckpoint('bambooPuzzle').progress, 4));
  assert.equal(mazeGlamourSvg(replayCheckpoint('bambooPuzzle').progress, 1, false), mazeGlamourSvg(replayCheckpoint('bambooPuzzle').progress, 4, false));
  assert.notEqual(mazeGlamourSvg(replayCheckpoint('bambooPuzzle').progress, 1), mazeGlamourSvg({...replayCheckpoint('bambooPuzzle').progress,chapterTwo:{...replayCheckpoint('bambooPuzzle').progress.chapterTwo,glamourBroken:true}}, 1));
  const before = replayCheckpoint('springPuzzle').progress, after = replayCheckpoint('springEnding').progress;
  assert.equal(hamletLifeActors(before, 1).length, 0);
  const neighbors = hamletLifeActors(after, 1); assert.equal(neighbors.length, 5);
  assert.deepEqual(hamletLifeActors(after, 1, false), hamletLifeActors(after, 3, false));
  assert.notDeepEqual(hamletLifeActors(after, 1), hamletLifeActors(after, 1.5));
  for (const actor of neighbors) await sharp(Buffer.from(actor.svg)).png().toBuffer();
  for (const actor of HAMLET_NEIGHBORS) assert.ok(canStand(actor, getMap('hamlet', before).colliders, 'hamlet'), `${actor.id} has real dry ground`);
  const map = getMap('hamlet', after), route = walkRoute(map.spawn, { x: 585, y: 240 }, 'hamlet', after);
  assert.ok(route.length > 0, 'the living hamlet still permits access to its bridge');
  assert.ok(route.some(point => nearbyInteraction(point, 'luning', 'hamlet', undefined, after)?.id === 'luning') || walkRoute(map.spawn, { x: 300, y: 270 }, 'hamlet', after).length > 0);
});

test('the hamlet coda happens once, survives saves and cannot be invented before the chapter resolves', () => {
  const save = replayCheckpoint('springEnding');
  assert.equal(completeInteraction(save.progress, 'luning').rainlit.homecomingSeen, false);
  const p = completeInteraction({ ...save.progress, rainlit: { ...save.progress.rainlit, sealSeen: true } }, 'springSeal');
  assert.equal(p.rainlit.complete, true);
  const text = linesFor('luning', p, 'hamlet').map(l => l.text).join(' ');
  assert.match(text, /afternoon back/); assert.match(text, /expected for supper/);
  const home = completeInteraction(p, 'luning'); assert.equal(home.rainlit.homecomingSeen, true); assert.equal(home.rainlit.basketReturned, true);
  const loaded = parseSave(JSON.stringify({ ...save, mapId: 'hamlet', player: getMap('hamlet', home).spawn, progress: home }))!;
  assert.equal(loaded.progress.rainlit.homecomingSeen, true);
  assert.doesNotMatch(linesFor('luning', loaded.progress, 'hamlet').map(l => l.text).join(' '), /expected for supper/);
  const invalid = parseSave(JSON.stringify({ ...save, progress: { ...save.progress, rainlit: { ...save.progress.rainlit, homecomingSeen: true } } }))!;
  assert.equal(invalid.progress.rainlit.homecomingSeen, false);
});
