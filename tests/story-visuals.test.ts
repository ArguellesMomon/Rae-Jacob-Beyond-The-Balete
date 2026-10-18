import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { turningStateSvg } from '../src/art/bambooArt.ts';
import { VERGE_WAYFINDING_SVG } from '../src/art/bambooEnvironmentArt.ts';
import { worksStateSvg, worksWheelFrame, worksWheelSvg } from '../src/art/waterworksEnvironmentArt.ts';
import { WORLD_PROPS } from '../src/art/worldPropArt.ts';
import { yardLaundrySvg } from '../src/art/yardArt.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { canStand, nearbyInteraction, travelRoute } from '../src/game/engine.ts';
import { getMap } from '../src/game/world.ts';

async function pixels(source: string, box?: { left: number; top: number; width: number; height: number }) {
  const image = sharp(Buffer.from(source));
  return (box ? image.extract(box) : image).ensureAlpha().raw().toBuffer();
}
const visible = (buffer: Buffer) => { let count = 0; for (let i = 3; i < buffer.length; i += 4) if (buffer[i] > 90) count++; return count; };

test('all three fork pictures are visible and change at every stage, with study sketches and the verse present', async () => {
  const p = replayCheckpoint('bambooPuzzle').progress;
  for (const [x, y] of [[110, 230], [320, 108], [528, 230]]) {
    const pictures = await Promise.all([0, 1, 2].map(trailStep => pixels(turningStateSvg({ ...p, chapterTwo: { ...p.chapterTwo, trailStep } }), { left: x - 10, top: y - 33, width: 20, height: 17 })));
    assert.ok(pictures.every(b => visible(b) > 100), 'A playable fork must have a visible sign picture.');
    assert.equal(new Set(pictures.map(b => b.toString('base64'))).size, 3, 'Pictures must follow the changing fork stage.');
  }
  for (const [x, y] of [[151, 290], [423, 290], [370, 191]]) assert.ok(visible(await pixels(turningStateSvg(p), { left: x - 11, top: y - 16, width: 22, height: 16 })) > 100);
  assert.ok(visible(await pixels(VERGE_WAYFINDING_SVG, { left: 489, top: 196, width: 26, height: 25 })) > 8);
});

test('the wheel visibly moves, stops when diverted, respects Still, and the painted flow diagram has ink', async () => {
  const p = replayCheckpoint('works').progress, diverted = { ...p, flowDiverted: true }, repaired = { ...p, waterRestored: true };
  for (const t of [0, .17, .52, 1, 2.3]) {
    assert.equal(worksWheelFrame(diverted, t), 0);
    assert.equal(worksWheelFrame(repaired, t, false), 0);
  }
  assert.notEqual(worksWheelFrame(repaired, 0), worksWheelFrame(repaired, .12));
  const first = await pixels(worksWheelSvg(0)), next = await pixels(worksWheelSvg(22.5));
  assert.ok(visible(first) > 600, 'The story mechanism cannot be an empty sprite.');
  assert.notDeepEqual(first, next);
  assert.ok(visible(await pixels(worksWheelSvg(0), { left: 32, top: 31, width: 12, height: 12 })) < 100, 'Open spokes should show the canal, not a solid disc.');
  assert.ok(visible(await pixels(worksStateSvg(p), { left: 309, top: 155, width: 26, height: 22 })) > 30, 'The splitter diagram explains the east/west choice.');
});

test('the painted spring hollow and cradle exist before the seal reveal', async () => {
  // Fixed referents are now painted into the map, instead of flat sticker overlays.
  assert.equal(visible(await pixels(WORLD_PROPS.spring)), 0);
  for (const box of [{ left: 1016, top: 418, width: 56, height: 70 }, { left: 796, top: 548, width: 38, height: 10 }]) {
    const painted = await sharp('assets/maps/quiet-spring-v2.png').extract(box).raw().toBuffer();
    const before = await sharp('assets/maps/quiet-spring-v1.png').extract(box).raw().toBuffer();
    assert.notDeepEqual(painted, before, 'The fixed story referent must remain in the terrain.');
  }

});

test('the clothesline contains visible clothes with distinct gentle animation frames', async () => {
  const frames = await Promise.all([0, 1, 2, 3].map(f => pixels(yardLaundrySvg(f), { left: 353, top: 213, width: 98, height: 45 })));
  assert.ok(frames.every(b => visible(b) > 1000));
  assert.equal(new Set(frames.map(b => b.toString('base64'))).size, 3, 'The return sway may repeat the resting frame.');
});

test('baked story objects have reachable matching interactions and the Rainlit sign is readable before travel unlocks', () => {
  const p = replayCheckpoint('springPuzzle').progress;
  for (const [id, x, y] of [['basketRack', 376, 239]] as const) {
    assert.ok(canStand({ x, y }, getMap('hamlet', p).colliders, 'hamlet'));
    assert.equal(nearbyInteraction({ x, y }, undefined, 'hamlet', undefined, p)?.id, id);
  }
  const early = replayCheckpoint('chapter2').progress;
  assert.equal(getMap('bamboo', early).interactions.find(i => i.id === 'rainroadEntry')?.action, 'Inspect');
  assert.equal(travelRoute(early, 'toRainroad'), null);
  assert.equal(getMap('bamboo', p).interactions.find(i => i.id === 'rainroadEntry')?.action, 'Travel');
});
