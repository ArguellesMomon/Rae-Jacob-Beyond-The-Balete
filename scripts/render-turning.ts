import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { turningSceneArt } from './turning-scene-art.ts';
import { vergeActor, vergeBody } from './bamboo-verge-scene-art.ts';
import { TURNING_GROUND_SVG, BAMBOO_CANOPY_SVG, turningStateSvg } from '../src/art/bambooArt.ts';
import { wrapSvg } from '../src/art/pixelArt.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { getMap } from '../src/game/world.ts';
import { canStand, nearbyInteraction } from '../src/game/engine.ts';
import { cameraTarget, sceneViewport } from '../src/game/camera.ts';
import { FORKS, LANDMARKS, followsRoute, landmarkAt } from '../src/game/chapterTwo.ts';
import type { Point, Progress } from '../src/game/model.ts';

await mkdir('artifacts/turning-maze-v3', { recursive: true });
const initial = replayCheckpoint('bambooPuzzle').progress;
// Buffer writes avoid native PNG file-handle conflicts with open Windows previews.
const png = (source: string, path: string) => sharp(Buffer.from(wrapSvg(source, 640, 480))).resize(1280, 960, { kernel: 'nearest' }).png().toBuffer().then(buffer => writeFile(path, buffer));
const stages: Progress[] = [];
for (let step = 0; step < 4; step++) {
  const progress = { ...initial, chapterTwo: { ...initial.chapterTwo, turningSeen: true, trailStep: step, routeVerified: step === 3 } };
  stages.push(progress);
  const source = turningSceneArt(progress);
  await png(source, `artifacts/turning-maze-v3/chapter-02-turning-${step + 1}.png`);
  await writeFile(`artifacts/turning-maze-v3/chapter-02-turning-${step + 1}.svg`, wrapSvg(source, 640, 480));
  const map = getMap('turning', progress), queue: Point[] = [{ ...map.spawn }], seen = new Set([`${map.spawn.x},${map.spawn.y}`]);
  for (let i = 0; i < queue.length; i++) for (const [dx, dy] of [[4, 0], [-4, 0], [0, 4], [0, -4]]) {
    const next = { x: queue[i].x + dx, y: queue[i].y + dy }, key = `${next.x},${next.y}`;
    if (!seen.has(key) && canStand(next, map.colliders, 'turning')) { seen.add(key); queue.push(next); }
  }
  for (const target of map.interactions.filter(item => item.id !== 'tala')) if (!queue.some(point => nearbyInteraction(point, target.id, 'turning', undefined, progress)?.id === target.id)) throw new Error(`Stage ${step}: unreachable ${target.id}`);
  if (step < 3 && (new Set(FORKS.map(id => landmarkAt(id, step))).size !== 5 || FORKS.filter(id => followsRoute(progress, id)).length !== 1)) throw new Error('Each stage must retain its distinct sketches and one correct landmark.');
}
const whole = wrapSvg(turningSceneArt(initial), 640, 480), native = await sharp(Buffer.from(whole)).png().toBuffer();
await png(turningSceneArt(initial), 'artifacts/turning-maze-v3/turning-maze-final-review.png');
function framed(source: string, player: Point, width = 844, height = 390) {
  const view = sceneViewport(width, height), camera = cameraTarget({ x: player.x, y: player.y - 24 }, { width: 640, height: 480 }, view);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${Math.round(camera.x)} ${Math.round(camera.y)} ${view.vw} ${view.vh}" shape-rendering="crispEdges">${source}</svg>`;
}
for (const [name, x, y] of [['arrival', 320, 390], ['left-fork', 60, 180], ['top-fork', 320, 108], ['right-fork', 580, 180], ['return', 320, 434]] as const) {
  const point = { x, y }, source = turningSceneArt(initial, point, 3, { companion: name === 'left-fork' || name === 'right-fork' ? { x, y: y + 18 } : { x: x - 18, y: y + 14 } });
  await sharp(Buffer.from(framed(source, point))).png().toBuffer().then(buffer => writeFile(`artifacts/turning-maze-v3/turning-${name}-scene.png`, buffer));
}
const legacy = await sharp(Buffer.from(wrapSvg(vergeBody(TURNING_GROUND_SVG) + vergeBody(turningStateSvg(initial)) + vergeActor('rae', { x: 320, y: 366 }) + vergeBody(BAMBOO_CANOPY_SVG), 640, 480))).png().toBuffer();
await sharp({ create: { width: 1280, height: 480, channels: 4, background: '#17372e' } }).composite([{ input: legacy, left: 0, top: 0 }, { input: native, left: 640, top: 0 }]).png().toBuffer().then(buffer => writeFile('artifacts/turning-maze-v3/turning-before-after.png', buffer));
for (const [name, left, top, width, height] of [['turning-junction-detail', 250, 236, 145, 121], ['turning-fork-detail', 66, 167, 98, 106], ['turning-bamboo-detail', 194, 169, 100, 120]] as const) await sharp(native).extract({ left, top, width, height }).resize(width * 3, height * 3, { kernel: 'nearest' }).png().toBuffer().then(buffer => writeFile(`artifacts/turning-maze-v3/${name}.png`, buffer));
const depthPositions = [[60, 220], [580, 220], [320, 108], [220, 300], [420, 300], [320, 434]];
for (const [index, [x, y]] of depthPositions.entries()) {
  if (!canStand({ x, y }, getMap('turning', initial).colliders, 'turning')) throw new Error(`Invalid depth point ${x},${y}`);
  const frame = await sharp(Buffer.from(wrapSvg(turningSceneArt(initial, { x, y }), 640, 480))).png().toBuffer();
  await sharp(frame).extract({ left: Math.max(0, Math.min(460, x - 90)), top: Math.max(0, Math.min(340, y - 80)), width: 180, height: 140 }).resize(540, 420, { kernel: 'nearest' }).png().toBuffer().then(buffer => writeFile(`artifacts/turning-maze-v3/turning-depth-${index + 1}.png`, buffer));
}
const panels: { input: Buffer; left: number; top: number }[] = [];
for (const [index, [width, height]] of [[960, 320], [844, 390], [1024, 768]].entries()) {
  const player = { x: 320, y: 108 }, view = sceneViewport(width, height), camera = cameraTarget({ x: 320, y: 84 }, { width: 640, height: 480 }, view);
  if (camera.y > 51 || camera.y + view.vh < 130 || camera.x > 277 || camera.x + view.vw < 363) throw new Error('North-fork label, sketch and party must fit in the screen.');
  panels.push({ input: await sharp(Buffer.from(framed(turningSceneArt(initial, player), player, width, height))).resize(480, 360, { fit: 'contain', background: '#17372e' }).png().toBuffer(), left: index * 480, top: 0 });
}
await sharp({ create: { width: 1440, height: 360, channels: 4, background: '#17372e' } }).composite(panels).png().toBuffer().then(buffer => writeFile('artifacts/turning-maze-v3/turning-phone-framing.png', buffer));
const storyboard: { input: Buffer; left: number; top: number }[] = [];
for (let index = 0; index < 4; index++) {
  const player = { x: 320, y: 390 }, progress = stages[Math.min(index, 2)], source = turningSceneArt(progress, player) + `<rect width="640" height="480" fill="#1d3434" opacity="${1 - index / 3}"/>`;
  storyboard.push({ input: await sharp(Buffer.from(framed(source, player))).png().toBuffer(), left: index % 2 * 844, top: Math.floor(index / 2) * 390 });
}
await sharp({ create: { width: 1688, height: 780, channels: 4, background: '#17372e' } }).composite(storyboard).png().toBuffer().then(buffer => writeFile('artifacts/turning-maze-v3/turning-transition-storyboard.png', buffer));
const frames: Buffer[] = [];
for (let i = 0; i < 12; i++) {
  const player = { x: 320, y: 400 };
  frames.push(await sharp(Buffer.from(framed(turningSceneArt(initial, player, i / 3), player, 600, 320))).ensureAlpha().raw().toBuffer());
}
await sharp(Buffer.concat(frames), { raw: { width: 600, height: frames.length * 320, channels: 4, pageHeight: 320 } }).gif({ loop: 0, delay: Array(frames.length).fill(333) }).toBuffer().then(buffer => writeFile('artifacts/turning-maze-v3/turning-weather-preview.gif', buffer));
console.log('Rendered four puzzle states, five route scenes, depth/material views, phone framing, transition storyboard and weather animation. All targets remain reachable, the three stages keep distinct landmark sketches, and every arch and proof remains reachable on the new maze ground. Source-art renders only.');
