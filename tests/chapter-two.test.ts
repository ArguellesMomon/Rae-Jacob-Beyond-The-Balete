import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { canStand, completeInteraction, freshSave, nearbyInteraction, parseSave, travelRoute } from '../src/game/engine.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { getMap } from '../src/game/world.ts';
import { FORKS, followsRoute, LANDMARKS, landmarkAt } from '../src/game/chapterTwo.ts';
import { linesFor } from '../src/game/dialogue.ts';
import { chooseStoryReply } from '../src/game/storyChoices.ts';
import { knownCharacters } from '../src/game/characters.ts';
import { characterPortraitSvg } from '../src/art/characterArt.ts';
import { bagtasSpriteSvg } from '../src/art/bagtasArt.ts';
import { BAMBOO_GROUND_SVG, TURNING_GROUND_SVG, turningStateSvg } from '../src/art/bambooArt.ts';
import type { Emotion, MapId } from '../src/game/model.ts';

test('Chapter 2 requires the completed first chapter and migrates old saves without losing the keepsake or memories', () => {
  const old = freshSave();
  assert.equal(travelRoute(old.progress, 'toBamboo'), null);
  assert.equal(parseSave(JSON.stringify({ ...old, mapId: 'bamboo' })), null);
  const ready = replayCheckpoint('chapter2');
  const restored = parseSave(JSON.stringify({ ...ready, progress: { ...ready.progress, chapterTwo: undefined, ubanGiftReceived: true, discoveries: ['sungka'], storyChoices: { firstTrust: 'playful' } } }))!;
  assert.equal(restored.mapId, 'bamboo'); assert.equal(restored.progress.chapterTwo.visited, true);
  assert.equal(restored.progress.chapterTwo.metBagtas, false); assert.equal(restored.progress.chapterTwo.trailStep, 0);
  assert.equal(restored.progress.ubanGiftReceived, true); assert.deepEqual(restored.progress.discoveries, ['sungka']);
  assert.equal(restored.progress.storyChoices.firstTrust, 'playful'); assert.equal(restored.progress.bellRung, true);
  assert.equal(travelRoute(restored.progress, 'toTurning'), null);
});

test('one sign per trial earns passage without witnesses, rune matching or a prior gift', () => {
  for(const gift of [false,true]){
    let p=completeInteraction({...replayCheckpoint('bambooPuzzle').progress,ubanGiftReceived:gift},'turningArrival');
    for(let stage=0;stage<3;stage++){
      const map=getMap('turning',p),signs=map.interactions.filter(i=>FORKS.includes(i.id as typeof FORKS[number]));
      assert.equal(signs.length,1);assert.equal(followsRoute(p,signs[0].id as typeof FORKS[number]),true);
      p=completeInteraction(p,signs[0].id);assert.equal(p.chapterTwo.trailStep,stage+1);
      assert.equal(p.chapterTwo.loops,0);
      assert.deepEqual(parseSave(JSON.stringify({...replayCheckpoint('bambooPuzzle'),progress:p}))!.progress.chapterTwo,p.chapterTwo);
    }
    assert.equal(p.chapterTwo.routeVerified,true);assert.equal(p.ubanGiftReceived,gift);
    assert.deepEqual(p.discoveries,['pathStone','pathWind','pathWater']);
    const done=completeInteraction(p,'bagtasDebrief');assert.equal(done.chapterTwo.debriefSeen,true);
    assert.deepEqual(completeInteraction(done,'bagtasDebrief'),done);
    assert.equal(travelRoute(done,'backToBamboo')?.mapId,'bamboo');
  }
});

test('all new scenery, forks and NPC approaches are reachable with real target selection at every stage', () => {
  for (const mapId of ['bamboo', 'turning'] as MapId[]) for (let stage = 0; stage < (mapId === 'turning' ? 3 : 1); stage++) {
    const p = replayCheckpoint(mapId === 'turning' ? 'bambooPuzzle' : 'chapter2').progress;
    p.chapterTwo.trailStep = stage;
    const map = getMap(mapId, p), queue = [{ ...map.spawn }], seen = new Set([`${map.spawn.x},${map.spawn.y}`]);
    for (let i = 0; i < queue.length; i++) for (const [dx, dy] of [[4, 0], [-4, 0], [0, 4], [0, -4]]) {
      const next = { ...queue[i], x: queue[i].x + dx, y: queue[i].y + dy }, key = `${next.x},${next.y}`;
      if (!seen.has(key) && canStand(next, map.colliders, mapId)) { seen.add(key); queue.push(next); }
    }
    for (const item of map.interactions.filter(item => item.id !== 'tala')) {
      assert.ok(queue.some(point => Math.hypot(point.x - item.point.x, point.y - item.point.y) < 27 && nearbyInteraction(point, item.id, mapId, undefined, p)?.id === item.id), `${mapId}: ${item.id}, stage ${stage}`);
    }
  }
});

test('corrupt bamboo checkpoints recover to safe ground and dependent state is normalized', () => {
  const ready = replayCheckpoint('bambooPuzzle');
  const parsed = parseSave(JSON.stringify({ ...ready, player: { ...ready.player, x: 50, y: 80 }, progress: { ...ready.progress, chapterTwo: { trailStep: 500, loops: -2, topics: ['paths', 'paths', 'made-up'] } } }))!;
  assert.equal(parsed.progress.chapterTwo.trailStep, 2); assert.equal(parsed.progress.chapterTwo.routeVerified, false);
  assert.equal(parsed.progress.chapterTwo.metBagtas, true); assert.equal(parsed.progress.chapterTwo.loops, 0);
  assert.deepEqual(parsed.progress.chapterTwo.topics, ['paths']);
  assert.ok(canStand(parsed.player, getMap(parsed.mapId, parsed.progress).colliders, parsed.mapId));
  assert.deepEqual(parsed.player, getMap('turning', parsed.progress).spawn);
  const verified = parseSave(JSON.stringify({ ...ready, progress: { ...ready.progress, chapterTwo: { debriefSeen: true } } }))!;
  assert.equal(verified.progress.chapterTwo.trailStep, 3); assert.equal(verified.progress.chapterTwo.routeVerified, true);
});

test('Bagtas personal replies persist without quest mutation, questions are optional and identity unlocks on meeting him', () => {
  const p = replayCheckpoint('chapter2').progress;
  assert.equal(knownCharacters(p).includes('bagtas'), false);
  assert.ok(linesFor('bagtas', p, 'bamboo').some(line => line.choice === 'bagtasIntent'));
  for (const tone of ['playful', 'cautious', 'thoughtful'] as const) {
    let chosen = chooseStoryReply(p, 'bagtasIntent', tone);
    assert.deepEqual({ ...chosen, storyChoices: {} }, p);
    assert.equal(linesFor('bagtas', chosen, 'bamboo').some(line => line.choice), false);
    chosen = completeInteraction(chosen, 'bagtas'); assert.ok(knownCharacters(chosen).includes('bagtas'));
    for (const id of ['bagtasPaths', 'bagtasStories', 'bagtasSeals'] as const) {
      const next = completeInteraction(chosen, id);
      assert.deepEqual(next.chapterTwo, { ...chosen.chapterTwo, topics: [...new Set([...chosen.chapterTwo.topics, id === 'bagtasPaths' ? 'paths' : id === 'bagtasStories' ? 'stories' : 'seals'])] });
      assert.deepEqual(completeInteraction(next, id), next);
    }
  }
  assert.equal(linesFor('talaHome', p, 'bamboo').some(line => line.text.includes('bell is hanging')), false);
});

test('the original bamboo artwork and Bagtas expressions rasterize, stay distinct and animate without altering Rae profiles', async () => {
  for (const source of [BAMBOO_GROUND_SVG, TURNING_GROUND_SVG, turningStateSvg(replayCheckpoint('bambooPuzzle').progress)]) {
    const { info } = await sharp(Buffer.from(source)).png().toBuffer({ resolveWithObject: true }); assert.equal(info.width, 640); assert.equal(info.height, 480);
  }
  const emotions: Emotion[] = ['neutral', 'warm', 'delighted', 'curious', 'worried', 'determined', 'wistful', 'surprised', 'wry'];
  const portraits = emotions.map(e => characterPortraitSvg('bagtas', e)); assert.equal(new Set(portraits).size, 9);
  for (const source of portraits) { const m = await sharp(Buffer.from(source)).metadata(); assert.equal(m.width, 80); assert.equal(m.height, 96); }
  assert.notEqual(bagtasSpriteSvg(), bagtasSpriteSvg(true)); assert.notEqual(bagtasSpriteSvg(false, 0), bagtasSpriteSvg(false, 1));
});
