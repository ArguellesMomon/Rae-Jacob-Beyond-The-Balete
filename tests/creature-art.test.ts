import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { bagtasSpriteSvg } from '../src/art/bagtasArt.ts';
import { mangUbanSvg } from '../src/art/groveArt.ts';
import { characterPortraitSvg } from '../src/art/characterArt.ts';
import type { Emotion } from '../src/game/model.ts';

const raster = (source: string) => sharp(Buffer.from(source)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
test('redesigned creatures keep genuine facial acting and fixed feet across their idle and offering poses', async () => {
  for (const [id, frame] of [
    ['uban', (blink: boolean, mouth: number, phase: number) => mangUbanSvg(blink, false, { mouth, hand: phase ? -2 : 0 })],
    ['bagtas', (blink: boolean, mouth: number, phase: number) => bagtasSpriteSvg(blink, mouth, 'wry', phase)],
  ] as const) {
    const idle = await raster(frame(false, 0, 0));
    const blink = await raster(frame(true, 0, 0)), talk = await raster(frame(false, 1, 0)), gesture = await raster(frame(false, 0, 1));
    assert.deepEqual([idle.info.width, idle.info.height], id === 'uban' ? [112, 156] : [32, 64]);
    assert.notDeepEqual(blink.data, idle.data, `${id}: blinking changes visible pixels`);
    assert.notDeepEqual(talk.data, idle.data, `${id}: speech changes visible pixels`);
    assert.notDeepEqual(gesture.data, idle.data, `${id}: the idle or offering pose moves`);
    const footRows = idle.info.width * 4 * (id === 'uban' ? 17 : 9);
    assert.deepEqual(gesture.data.subarray(-footRows), idle.data.subarray(-footRows), `${id}: feet stay planted`);
  }
});

test('both redesigned portraits have nine visibly different expressions and retain the dialogue frame size', async () => {
  const emotions: Emotion[] = ['neutral', 'warm', 'delighted', 'curious', 'worried', 'determined', 'wistful', 'surprised', 'wry'];
  for (const id of ['uban', 'bagtas'] as const) {
    const seen = new Set<string>();
    for (const emotion of emotions) {
      const { data, info } = await raster(characterPortraitSvg(id, emotion));
      assert.deepEqual([info.width, info.height], [80, 96]);
      seen.add(data.toString('base64'));
    }
    assert.equal(seen.size, emotions.length, `${id}: expressions must differ after rasterization`);
  }
});
