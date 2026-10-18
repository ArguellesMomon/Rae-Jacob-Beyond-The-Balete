import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { cameraTarget, sceneViewport } from '../src/game/camera.ts';
import { MAP_GROUND } from '../src/game/walkable.ts';
import { groveShot, groveBaseMarkup } from '../src/art/groveEnvironmentArt.ts';
import { WORLD_PROPS } from '../src/art/worldPropArt.ts';
import { worksStateSvg } from '../src/art/waterworksEnvironmentArt.ts';
import { clearingStateSvg } from '../src/art/clearingEnvironmentArt.ts';
import { replayCheckpoint } from '../src/game/replay.ts';

test('normal cameras fill desktop, phone and ultrawide screens without exceeding the real map or changing pixel proportions', () => {
  for (const world of Object.values(MAP_GROUND)) for (const [width, height] of [[1914, 994], [2560, 1080], [3440, 1440], [844, 390], [390, 844], [1024, 768]]) {
    const view = sceneViewport(width, height, undefined, world);
    assert.ok(view.vw <= world.width + 1e-7 && view.vh <= world.height + 1e-7);
    assert.ok(Math.abs(width / view.vw - height / view.vh) < 1e-7, 'Horizontal and vertical scale must match.');
    for (const point of [{ x: 0, y: 0 }, { x: world.width, y: world.height }, { x: world.width / 2, y: world.height / 2 }]) {
      const camera = cameraTarget(point, world, view);
      assert.ok(Math.round(camera.x) >= 0 && Math.round(camera.y) >= 0);
      assert.ok(Math.round(camera.x) + view.vw <= world.width + 1e-7);
      assert.ok(Math.round(camera.y) + view.vh <= world.height + 1e-7);
    }
  }
});

test('grove desktop framing includes the near-perch actors and gift shots stay inside the painting', () => {
  const world = { width: 480, height: 512 }, player = { x: 331, y: 342 };
  const shot = groveShot(player, 1914, 994), view = sceneViewport(1914, 994, shot.view, world), camera = cameraTarget(shot.center, world, view);
  assert.ok(camera.x >= 0 && camera.x + view.vw <= 480 + 1e-7);
  assert.ok(camera.y <= 110 && camera.y + view.vh >= player.y + 12, 'Keep the giant and Rae in the desktop clearing shot.');
  for (const [w, h] of [[960, 320], [844, 390], [1914, 994], [390, 844]]) for (const y of [286, 302, 326]) {
    const gift = groveShot({ x: 232, y }, w, h, { giftScene: true });
    const frame = sceneViewport(w, h, gift.view, world), center = cameraTarget(gift.center, world, frame);
    assert.ok(center.x >= 0 && center.x + frame.vw <= 480 + 1e-7);
    assert.ok(center.y >= 0 && center.y <= 108);
    assert.ok(center.y + frame.vh >= y && center.y + frame.vh <= 512 + 1e-7);
  }
  assert.doesNotMatch(groveBaseMarkup(), /scale\(2\)|opacity|translate/);
});

async function opaque(source: string, box?: { left: number; top: number; width: number; height: number }) {
  const image = sharp(Buffer.from(source));
  const pixels = await (box ? image.extract(box) : image).ensureAlpha().raw().toBuffer();
  let count = 0; for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) count++;
  return count;
}

test('listed duplicate marker, tube, cord, basket and home-window graphics remain removed', async () => {
  for (const id of ['grove', 'bamboo', 'hamlet'] as const) assert.equal(await opaque(WORLD_PROPS[id]), 0, id + ': use the painted scenery');
  for (const checkpoint of ['arrival', 'restored'] as const) {
    const p = replayCheckpoint(checkpoint).progress;
    assert.equal(await opaque(clearingStateSvg(p), { left: 82, top: 135, width: 14, height: 18 }), 0, 'The roots-home window must use its map artwork.');
    assert.equal(await opaque(worksStateSvg(p), { left: 353, top: 251, width: 10, height: 8 }), 0, 'No second mouth over the painted waterkeeper tube.');
  }
});
