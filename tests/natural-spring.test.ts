import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { SPRING_PROP_FILES, SPRING_RILL, springPuzzleItems } from '../src/game/springScene.ts';
import { springWaterSvg } from '../src/art/rainlitArt.ts';
import { springWaterMaskSvg } from '../src/art/springSurfaceArt.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { getMap } from '../src/game/world.ts';
import { canStand } from '../src/game/engine.ts';

test('generated spring props have real transparent silhouettes and puzzle states retain all required pieces', async () => {
  for (const file of Object.values(SPRING_PROP_FILES)) {
    const { data, info } = await sharp('assets/props/' + file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let clear = 0, solid = 0;
    for (let i = 3; i < data.length; i += 4) { if (data[i] === 0) clear++; if (data[i] > 180) solid++; }
    assert.ok(clear > info.width * info.height * .1, `${file} must not have a rectangular background`);
    assert.ok(solid > info.width * info.height * .2, `${file} must remain visible`);
  }
  const p = replayCheckpoint('springPuzzle').progress;
  const braced = { ...p, rainlit: { ...p.rainlit, rootBraced: true } };
  assert.deepEqual(springPuzzleItems(p).map(i => i.id), ['basket', 'root']);
  assert.deepEqual(springPuzzleItems(braced).map(i => i.id), ['brace', 'basket', 'root']);
  const rootY = (q: typeof p, settling = 1) => springPuzzleItems(q, settling).find(i => i.id === 'root')!.y;
  assert.equal(rootY(braced), rootY(p) - 8);
  const done = { ...braced, rainlit: { ...braced.rainlit, basketFreed: true, restored: true } };
  assert.ok(springPuzzleItems(done, .2).some(i => i.id === 'brace'));
  assert.deepEqual(springPuzzleItems(done).map(i => i.id), ['root']);
  assert.ok(rootY(done, .2) < rootY(done, .7));
  assert.equal(rootY(done), rootY(p) + 2);
});

test('spring terrain replacement leaves the rest of the existing map pixel-for-pixel intact', async () => {
  const before = await sharp('assets/maps/quiet-spring-v1.png').removeAlpha().raw().toBuffer();
  const { data: after, info } = await sharp('assets/maps/quiet-spring-v2.png').removeAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1280); assert.equal(info.height, 960);
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (x >= 887 && x < 1253 && y >= 386 && y < 566 || x >= 796 && x < 834 && y >= 548 && y < 558) continue;
    const i = (y * info.width + x) * 3;
    assert.ok(before[i] === after[i] && before[i + 1] === after[i + 1] && before[i + 2] === after[i + 2], `Unrelated map pixel changed: ${x}, ${y}`);
  }
});

test('the natural rill remains a ground boundary and water reveals downstream without painting a tube', async () => {
  const p = replayCheckpoint('springPuzzle').progress;
  for (const [x, y] of SPRING_RILL) assert.equal(canStand({ x, y }, getMap('spring', p).colliders, 'spring'), false);
  const count = async (restored: boolean, frame = 0, reveal = 1) => {
    const b = await sharp(Buffer.from(restored ? springWaterMaskSvg(reveal) : springWaterSvg(false, frame))).ensureAlpha().raw().toBuffer();
    let n = 0; for (let i = 3; i < b.length; i += 4) if (b[i] > 40) n++;
    return n;
  };
  assert.ok(await count(false) < 10, 'Dry terrain needs no thick vector bank overlay.');
  const first = await count(true, 0, .1), middle = await count(true, 0, .5), full = await count(true);
  assert.ok(first < middle && middle < full);
  assert.ok(full > 100 && full < 2000, 'The generated water stays within the shallow streambed mask.');
  assert.notEqual(springWaterSvg(true, 0), springWaterSvg(true, 1));
});
