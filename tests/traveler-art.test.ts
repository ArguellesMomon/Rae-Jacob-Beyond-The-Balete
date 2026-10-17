import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { characterPortraitSvg, characterSpriteSvg } from '../src/art/characterArt.ts';
import { walkFrame } from '../src/game/acting.ts';
import type { Direction, Emotion, Gesture } from '../src/game/model.ts';

const directions: Direction[] = ['down', 'right', 'up', 'left'];
const gestures: Gesture[] = ['idle', 'talk', 'wave', 'map', 'think', 'work', 'reach', 'pull', 'bow', 'brush', 'guardMap', 'listen', 'celebrate'];
const emotions: Emotion[] = ['neutral', 'warm', 'delighted', 'curious', 'worried', 'determined', 'wistful', 'surprised', 'wry'];
const raster = (s: string) => sharp(Buffer.from(s), { density: 144 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
function eyePixels(data: Buffer, width: number) {
  const found: [number, number][] = [];
  for (let y = 0; y < 42; y++) for (let x = 0; x < width; x++) {
    const at = (y * width + x) * 4;
    if (data[at] === 48 && data[at + 1] === 45 && data[at + 2] === 37 && data[at + 3] === 255) found.push([x, y]);
  }
  return found;
}
function components(points: [number, number][]) {
  const remaining = new Set(points.map(([x, y]) => `${x},${y}`)), groups: [number, number][][] = [];
  while (remaining.size) {
    const start = remaining.values().next().value!; remaining.delete(start);
    const group: [number, number][] = [start.split(',').map(Number) as [number, number]];
    for (let i = 0; i < group.length; i++) for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const [x, y] = group[i], key = `${x + dx},${y + dy}`;
      if (remaining.delete(key)) group.push([x + dx, y + dy]);
    }
    groups.push(group);
  }
  return groups;
}

test('travelers show two front eyes, one attached profile eye and no back-facing facial features through every stride', async () => {
  for (const id of ['rae', 'tala'] as const) for (const direction of directions) for (let frame = 0; frame < 8; frame++) {
    const { data, info } = await raster(characterSpriteSvg(id, direction, frame));
    const eyes = components(eyePixels(data, info.width));
    assert.equal(eyes.length, direction === 'up' ? 0 : direction === 'down' ? 2 : 1, `${id}/${direction}/${frame}`);
    if (direction === 'left' || direction === 'right') {
      const xs = eyes[0].map(([x]) => x), ys = eyes[0].map(([, y]) => y);
      assert.ok(direction === 'right' ? Math.min(...xs) > 32 : Math.max(...xs) < 32);
      // Skin must surround the eye; catch a feature drifting beyond the face edge.
      for (const [x, y] of [[Math.min(...xs) - 1, Math.max(...ys)], [Math.max(...xs) + 1, Math.max(...ys)], [xs[0], Math.max(...ys) + 1]]) {
        assert.equal(data[(y * info.width + x) * 4 + 3], 255, `${id}: profile eye needs a solid face around it`);
      }
    }
  }
});

test('all eight walk frames remain distinct at world display size in all directions, with at least one planted foot', async () => {
  for (const id of ['rae', 'tala'] as const) for (const direction of directions) {
    const seen = new Set<string>();
    for (let frame = 0; frame < 8; frame++) {
      const source = characterSpriteSvg(id, direction, frame), { data, info } = await raster(source);
      assert.deepEqual([info.width, info.height], [64, id === 'rae' ? 96 : 80]);
      const rows = [info.height - 3, info.height - 2];
      assert.ok(rows.some(y => Array.from({ length: info.width }, (_, x) => data[(y * info.width + x) * 4 + 3]).some(alpha => alpha === 255)), `${id}/${direction}/${frame}: planted foot`);
      const visible = await sharp(Buffer.from(source)).resize(id === 'rae' ? 20 : 18, id === 'rae' ? 30 : 22, { kernel: 'nearest' }).raw().toBuffer();
      seen.add(visible.toString('base64'));
    }
    assert.equal(seen.size, 8, `${id}/${direction}: genuine live-sized animation`);
  }
});

test('walk and story poses fit inside their canvases at every angle without cutting off hands, ears, maps or shoes', async () => {
  for (const id of ['rae', 'tala'] as const) for (const direction of directions) for (const gesture of gestures) for (const frame of [-4, -3]) {
    const { data, info } = await raster(characterSpriteSvg(id, direction, frame, gesture, 'surprised', false, 1));
    assert.equal(components(eyePixels(data, info.width)).length, direction === 'up' ? 0 : direction === 'down' ? 2 : 1, `${id}/${direction}/${gesture}: the pose must not add or erase a face`);
    for (let x = 0; x < info.width; x++) {
      assert.equal(data[x * 4 + 3], 0, `${id}/${direction}/${gesture}: top edge`);
      assert.equal(data[((info.height - 1) * info.width + x) * 4 + 3], 0, `${id}/${direction}/${gesture}: shoe edge`);
    }
    for (let y = 0; y < info.height; y++) for (const x of [0, info.width - 1]) assert.equal(data[(y * info.width + x) * 4 + 3], 0, `${id}/${direction}/${gesture}: side edge`);
  }
});

test('traveler portraits preserve visible expression, blink and speech changes at the existing dialogue size', async () => {
  for (const id of ['rae', 'tala'] as const) {
    const seen = new Set<string>();
    for (const emotion of emotions) {
      const { data, info } = await sharp(Buffer.from(characterPortraitSvg(id, emotion))).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      assert.deepEqual([info.width, info.height], [80, 96]); seen.add(data.toString('base64'));
    }
    assert.equal(seen.size, 9);
    const normal = (await raster(characterPortraitSvg(id))).data;
    assert.notDeepEqual((await raster(characterPortraitSvg(id, 'neutral', true))).data, normal);
    assert.notDeepEqual((await raster(characterPortraitSvg(id, 'neutral', false, 1))).data, normal);
  }
});

test('Tala keeps the satchel on the same anatomical hip instead of mirroring it through a turn', async () => {
  for (let frame = 0; frame < 8; frame++) for (const direction of directions) {
    const { data, info } = await raster(characterSpriteSvg('tala', direction, frame));
    const claspX: number[] = [];
    for (let y = 42; y < info.height; y++) for (let x = 0; x < info.width; x++) {
      const at = (y * info.width + x) * 4;
      if (data[at] === 224 && data[at + 1] === 204 && data[at + 2] === 142 && data[at + 3] === 255) claspX.push(x);
    }
    if (direction === 'left') assert.equal(claspX.length, 0, 'far-side clasp is hidden by the body');
    else {
      assert.ok(claspX.length > 0, `${direction}: visible clasp`);
      assert.ok(direction === 'down' ? Math.min(...claspX) > 32 : Math.max(...claspX) < 32, `${direction}: the bag stays on Tala\'s left hip`);
    }
  }
});

test('distance-driven walk cycles use eight traveler frames and keep the existing supporting-cast timing', () => {
  for (const [id, distance] of [['rae', 4], ['tala', 3]] as const) {
    assert.deepEqual(Array.from({ length: 8 }, (_, n) => walkFrame(id, n * distance)), [0, 1, 2, 3, 4, 5, 6, 7]);
    assert.equal(walkFrame(id, 8 * distance), 0);
    for (const value of [-5, NaN, Infinity]) assert.equal(walkFrame(id, value), 0);
  }
  assert.equal(walkFrame('minda', 25), 5); assert.equal(walkFrame('lola', 30), 0);
});
