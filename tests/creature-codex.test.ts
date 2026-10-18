import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { encounteredCreatures, creatureEncounters, creatureMemory, CREATURES } from '../src/game/creatureCodex.ts';
import { celebrationNeighbors } from '../src/game/celebration.ts';
import { celebrantSvg } from '../src/art/celebrationArt.ts';
import { duwendePortraitSvg, duwendeSpriteSvg } from '../src/art/duwendeArt.ts';
import { freshSave, parseSave, canStand, completeInteraction } from '../src/game/engine.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { getMap } from '../src/game/world.ts';
import { RESIDENT_IDS } from '../src/game/residents.ts';

test('codex follows encounters, rather than visiting maps or reading a creature name', () => {
  const p = freshSave().progress;
  p.crossed = p.visitedGrove = p.chapterTwo.visited = p.rainlit.visited = true;
  assert.deepEqual(encounteredCreatures(p), []);
  p.metTala = true;
  assert.deepEqual(encounteredCreatures(p).map(e => e.id), ['duwende']);
  assert.deepEqual(creatureEncounters('duwende', p), ['Tala']);
  p.heardMinda = true; p.residentChats.nilo = 1;
  assert.deepEqual(creatureEncounters('duwende', p), ['Tala', 'Minda', 'Nilo']);
  p.metMang = true; p.chapterTwo.metBagtas = true; p.rainlit.metMayumi = true;
  assert.deepEqual(encounteredCreatures(p).map(e => e.id), ['duwende', 'kapre', 'tikbalang', 'diwata']);
  assert.ok(!creatureEncounters('duwende', p).includes('Luning'));
  p.rainlit.metLuning = true;
  assert.ok(creatureEncounters('duwende', p).includes('Luning'));
});

test('existing saves unlock the codex without a new quest or migration flag, and replay does not leak entries', () => {
  const save = replayCheckpoint('springPuzzle'), restored = parseSave(JSON.stringify(save))!;
  assert.equal(encounteredCreatures(restored.progress).length, 4);
  assert.deepEqual(encounteredCreatures(freshSave().progress), []);
  assert.ok(!creatureMemory('kapre', save.progress).includes('Listening Seed'));
  assert.ok(creatureMemory('kapre', { ...save.progress, ubanGiftReceived: true }).includes('Listening Seed'));
  for (const entry of CREATURES) {
    assert.ok(entry.sources.length > 0);
    assert.ok(entry.sources.every(s => new URL(s.url).protocol === 'https:'));
    assert.ok(entry.inSilong.includes('original') || entry.inSilong.includes('authored'));
  }
  assert.match(CREATURES.find(e => e.id === 'diwata')!.subtitle, /Mayumi.*Diwata ng Bukal/);
});

test('returning and ringing the bell produce two persistent crowd stages on walkable ground', () => {
  const ready = replayCheckpoint('bellReturn'), gathering = completeInteraction(ready.progress, 'minda');
  const party = replayCheckpoint('restored').progress;
  assert.equal(celebrationNeighbors(ready.progress).length, 0);
  assert.equal(celebrationNeighbors(gathering).length, 4);
  assert.equal(celebrationNeighbors(party).length, 12);
  const resumed = parseSave(JSON.stringify({ ...ready, progress: party }))!;
  assert.equal(celebrationNeighbors(resumed.progress).length, 12);
  const before = getMap('clearing', ready.progress), after = getMap('clearing', party);
  for (const guest of celebrationNeighbors(party)) {
    assert.ok(canStand(guest, before.colliders, 'clearing'), `${guest.id} must stand on ground`);
    assert.equal(canStand(guest, after.colliders, 'clearing'), false, `${guest.id} must have a physical footing`);
  }
  // Critical arch approach and return/replay spawns remain clear.
  for (const point of [{ x: 382, y: 337 }, { x: 382, y: 350 }, { x: 408, y: 239 }, { x: 292, y: 137 }]) assert.ok(canStand(point, after.colliders, 'clearing'));
});

test('celebration poses animate visibly and freeze under Still without hiding neighbors', async () => {
  const party = replayCheckpoint('restored').progress;
  for (const activity of ['clap', 'dance', 'lantern']) {
    const n = celebrationNeighbors(party).find(n => n.activity === activity)!;
    const rendered = await Promise.all([0, .34].map(t => sharp(Buffer.from(celebrantSvg(n, t, true))).raw().toBuffer()));
    assert.notDeepEqual(rendered[0], rendered[1], `${activity} must visibly animate`);
    assert.equal(celebrantSvg(n, 0, true, false), celebrantSvg(n, 27, true, false));
  }
});

test('all village duwende have readable ear silhouettes and distinct textured portraits', async () => {
  const looks = ['minda', 'luning', ...RESIDENT_IDS] as const;
  const portraits: string[] = [];
  for (const id of looks) {
    const source = duwendeSpriteSvg(id), raster = await sharp(Buffer.from(source)).resize(64, 80, { kernel: 'nearest' }).ensureAlpha().raw().toBuffer();
    for (const [x, y] of [[10, 25], [53, 25]]) assert.ok(raster[(y * 64 + x) * 4 + 3] > 200, `${id} tapered ears must remain visible`);
    const portrait = duwendePortraitSvg(id);
    portraits.push(portrait);
    assert.notEqual(duwendeSpriteSvg(id, 'left'), duwendeSpriteSvg(id, 'right'));
    const metadata = await sharp(Buffer.from(portrait)).metadata();
    assert.equal(metadata.width, 80); assert.equal(metadata.height, 96);
  }
  assert.equal(new Set(portraits).size, looks.length);
});
