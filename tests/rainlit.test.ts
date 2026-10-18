import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { completeInteraction, freshSave, parseSave, travelRoute, objective } from '../src/game/engine.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { linesFor } from '../src/game/dialogue.ts';
import { knownCharacters, CHARACTERS } from '../src/game/characters.ts';
import { freshRainlit } from '../src/game/model.ts';
import type { Emotion, InteractionId } from '../src/game/model.ts';
import { springPortraitSvg, springSpriteSvg } from '../src/art/springCharacterArt.ts';
import { rainlitWeatherSvg, springRepairSvg, springSealSvg, springWaterSvg } from '../src/art/rainlitArt.ts';
import { parseHistory } from '../src/game/history.ts';

test('the rainlit continuation preserves old journeys and requires the checked Bagtas debrief', () => {
  const old = replayCheckpoint('bambooDebrief');
  const legacy = JSON.parse(JSON.stringify(old)); delete legacy.progress.rainlit;
  const loaded = parseSave(JSON.stringify(legacy))!;
  assert.deepEqual(loaded.progress.rainlit, freshRainlit());
  assert.equal(travelRoute(loaded.progress, 'toRainroad'), null);
  const ready = completeInteraction(loaded.progress, 'bagtasDebrief');
  assert.match(objective(ready, 'bamboo'), /RAINLIT ROAD/);
  const road = travelRoute(ready, 'toRainroad')!;
  assert.equal(road.mapId, 'rainroad'); assert.equal(road.progress.rainlit.visited, true);
  assert.equal(road.progress.rainlit.roadSeen, false);
  assert.equal(travelRoute(road.progress, 'toHamlet'), null, 'arrival dialogue is a recoverable checkpoint');
  assert.ok(travelRoute(completeInteraction(road.progress, 'rainroadArrival'), 'toHamlet'));
  assert.equal(travelRoute(freshSave().progress, 'toSpring'), null);
});

test('the spring repair respects prerequisites, needs no optional discovery or seed, and survives each save', () => {
  let save = replayCheckpoint('springPuzzle'), p = save.progress;
  const later: InteractionId[] = ['springBrace', 'springBasket', 'springSettle', 'springSeal'];
  for (const id of later) assert.deepEqual(completeInteraction(p, id), p, `early ${id} must do nothing`);
  assert.deepEqual(p.discoveries, []); assert.equal(p.ubanGiftReceived, false);
  for (const [index, id] of (['springChannel', 'springBrace', 'springBasket', 'springSettle'] as InteractionId[]).entries()) {
    p = completeInteraction(p, id);
    assert.equal(p.rainlit.restored, index === 3);
    const next = parseSave(JSON.stringify({ ...save, progress: p }))!; assert.ok(next);
    assert.deepEqual(next.progress.rainlit, p.rainlit); p = next.progress;
    assert.deepEqual(completeInteraction(p, id), p, `${id} is idempotent`);
  }
  assert.equal(p.rainlit.complete, false, 'repair is not the chapter ending');
  assert.equal(completeInteraction(p, 'springSeal').rainlit.complete, false, 'unwitnessed seal cannot finish chapter');
  p = { ...p, rainlit: { ...p.rainlit, sealSeen: true } };
  p = completeInteraction(p, 'springSeal'); assert.equal(p.rainlit.complete, true);
  assert.equal(p.ubanGiftReceived, false); assert.deepEqual(p.discoveries, []);
  assert.equal(completeInteraction(p, 'luning').rainlit.basketReturned, true);
});

test('returning the basket before lowering the root does not invent a completed repair, and Tala answers the current journey', () => {
  let p = replayCheckpoint('springPuzzle').progress;
  for (const id of ['springChannel', 'springBrace', 'springBasket'] as InteractionId[]) p = completeInteraction(p, id);
  const spoken = linesFor('luning', p, 'hamlet').map(l => l.text).join(' ');
  assert.match(spoken, /still resting on its forked support/);
  assert.doesNotMatch(spoken, /checked the outlet after lowering/);
  const returned = completeInteraction(p, 'luning');
  assert.equal(returned.rainlit.basketReturned, true); assert.equal(returned.rainlit.restored, false);
  assert.match(linesFor('talaWhere', p, 'hamlet').map(l => l.text).join(' '), /Riverside Hamlet/);
  assert.match(linesFor('talaHome', p, 'spring').map(l => l.text).join(' '), /Heart Balete/);
  assert.ok(linesFor('talaJourney', p, 'spring').length >= 5);
});

test('inconsistent future flags cannot skip Mayumi, fabricate a seed memory, or place an early save upstream', () => {
  const old = replayCheckpoint('rainroad');
  old.progress.rainlit = { ...freshRainlit(), visited: true, complete: true, restored: true, sealSeen: true, topics: ['water'], seedMemory: true };
  const loaded = parseSave(JSON.stringify(old))!;
  assert.equal(loaded.progress.rainlit.complete, false);
  assert.equal(loaded.progress.rainlit.metMayumi, false);
  assert.equal(loaded.progress.rainlit.seedMemory, false);
  assert.deepEqual(loaded.progress.rainlit.topics, []);
  assert.equal(parseSave(JSON.stringify({ ...old, mapId: 'spring' })), null);
  const noSeed = replayCheckpoint('springPuzzle');
  assert.deepEqual(completeInteraction(noSeed.progress, 'springSeed'), noSeed.progress);
  assert.equal(knownCharacters(noSeed.progress).includes('mayumi'), true);
  assert.equal(knownCharacters(replayCheckpoint('springMeeting').progress).includes('mayumi'), false);
});

test('personal questions, recorded traditions and vocabulary remain outside the repair and acknowledge local contexts', () => {
  const save = replayCheckpoint('springPuzzle'), p = save.progress;
  for (const [id, topic] of [['mayumiWater', 'water'], ['mayumiStories', 'stories'], ['mayumiRoads', 'roads']] as const) {
    const next = completeInteraction(p, id); assert.deepEqual(next.rainlit.topics, [topic]);
    assert.equal(next.rainlit.channelRead, false); assert.equal(next.rainlit.restored, false);
    assert.ok(linesFor(id, p, 'spring').length >= 5);
  }
  assert.match(CHARACTERS.mayumi.roots, /original fiction/);
  assert.match(CHARACTERS.mayumi.roots, /Santa Ana/); assert.match(CHARACTERS.mayumi.roots, /central Panay/);
  assert.ok(linesFor('mayumi', { ...p, rainlit: { ...p.rainlit, metMayumi: false } }, 'spring').length >= 20);
  assert.equal(linesFor('listeningSeed', { ...p, ubanGiftReceived: true }, 'rainroad').some(l => l.speaker === 'Mayumi'), false);
  const retained = parseHistory([{ mapId: 'spring', speaker: 'Mayumi', text: 'The dry bank is safe.' }, { mapId: 'hamlet', speaker: 'Luning', text: 'A patch is a record.' }]);
  assert.equal(retained.length, 2);
});

test('new pixel cast rasterizes with distinct expressions, blink, speech and bounded source canvases', async () => {
  const emotions: Emotion[] = ['neutral', 'warm', 'delighted', 'curious', 'worried', 'determined', 'wistful', 'surprised', 'wry'];
  for (const id of ['mayumi', 'luning'] as const) {
    const hashes = new Set<string>();
    for (const emotion of emotions) {
      const image = await sharp(Buffer.from(springPortraitSvg(id, emotion))).png().toBuffer(); hashes.add(image.toString('base64'));
    }
    assert.ok(hashes.size >= 5, 'portrait expressions stay visibly different');
    const a = await sharp(Buffer.from(springSpriteSvg(id))).raw().toBuffer();
    const blink = await sharp(Buffer.from(springSpriteSvg(id, true))).raw().toBuffer();
    const mouth = await sharp(Buffer.from(springSpriteSvg(id, false, 1))).raw().toBuffer();
    assert.notDeepEqual(a, blink); assert.notDeepEqual(a, mouth);
    for (const frame of [0, 1]) {
      const { data, info } = await sharp(Buffer.from(springSpriteSvg(id, false, 0, 'neutral', frame))).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      for (let y = 0; y < info.height; y++) assert.equal(data[(y * info.width) * 4 + 3] + data[(y * info.width + info.width - 1) * 4 + 3], 0, 'hands and ears fit inside the source');
    }
  }
});

test('spring repair, flowing water and forming seal have genuinely different raster states; three map assets decode', async () => {
  const before = replayCheckpoint('springPuzzle').progress, braced = completeInteraction(completeInteraction(before, 'springChannel'), 'springBrace');
  const restored = replayCheckpoint('springEnding').progress;
  assert.notEqual(springRepairSvg(before), springRepairSvg(braced));
  assert.notEqual(springRepairSvg(braced), springRepairSvg(restored));
  assert.notEqual(springWaterSvg(false, 0), springWaterSvg(true, 0));
  assert.notEqual(springSealSvg(.2), springSealSvg(1));
  for (const art of [springWaterSvg(true, 4), springRepairSvg(restored), springSealSvg(1), rainlitWeatherSvg('spring', 3)]) await sharp(Buffer.from(art)).png().toBuffer();
  for (const name of ['rainlit-road', 'riverside-hamlet', 'quiet-spring']) {
    const meta = await sharp(await readFile(`assets/maps/${name}-v1.png`)).metadata();
    assert.equal(meta.width, 1280); assert.equal(meta.height, 960);
  }
});
