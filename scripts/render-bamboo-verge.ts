import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { bambooVergeSceneArt, vergeActor, vergeBody } from './bamboo-verge-scene-art.ts';
import { BAMBOO_GROUND_SVG, BAMBOO_CANOPY_SVG } from '../src/art/bambooArt.ts';
import { bagtasSpriteSvg } from '../src/art/bagtasArt.ts';
import { wrapSvg } from '../src/art/pixelArt.ts';
import { getMap } from '../src/game/world.ts';
import { canStand, nearbyInteraction, parseSave } from '../src/game/engine.ts';
import { BAMBOO_START } from '../src/game/model.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { linesFor } from '../src/game/dialogue.ts';
import { cameraTarget, sceneViewport } from '../src/game/camera.ts';
import type { Point, Progress } from '../src/game/model.ts';

await mkdir('artifacts', { recursive: true });
const initial = replayCheckpoint('chapter2').progress;
const met = { ...initial, chapterTwo: { ...initial.chapterTwo, arrivalSeen: true, metBagtas: true } };
const verified = replayCheckpoint('bambooDebrief').progress;
const debrief = { ...verified, chapterTwo: { ...verified.chapterTwo, debriefSeen: true } };
const states: Record<string, Progress> = { initial, met, verified, debrief };
const png = (source: string, path: string) => sharp(Buffer.from(wrapSvg(source, 640, 480))).resize(1280, 960, { kernel: 'nearest' }).png().toFile(path);
for (const [name, progress] of Object.entries(states)) await png(bambooVergeSceneArt(progress), `artifacts/bamboo-verge-${name}-art-preview.png`);
const whole = wrapSvg(bambooVergeSceneArt(met), 640, 480);
await sharp(Buffer.from(whole)).resize(1280, 960, { kernel: 'nearest' }).png().toFile('artifacts/chapter-02-bamboo-verge.png');
await writeFile('artifacts/chapter-02-bamboo-verge.svg', whole);
function framed(source: string, player: Point, width = 844, height = 390) {
  const view = sceneViewport(width, height), camera = cameraTarget({ x: player.x, y: player.y - 24 }, { width: 640, height: 480 }, view);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${Math.round(camera.x)} ${Math.round(camera.y)} ${view.vw} ${view.vh}" shape-rendering="crispEdges">${source}</svg>`;
}
const intro = linesFor('bagtas', initial, 'bamboo');
const reactions = [intro.find(line => line.speaker === 'Rae Jacob' && line.emotion === 'surprised'), intro.find(line => line.speaker === 'Bagtas' && line.emotion === 'warm'), intro.find(line => line.speaker === 'Bagtas' && line.text.includes('TURNING PATHS'))];
if (reactions.some(line => !line)) throw new Error('The encounter review must use the real introduction and path directions.');
const storyboard: { input: Buffer; left: number; top: number }[] = [];
for (const [index, line] of reactions.entries()) {
  const scene = framed(bambooVergeSceneArt(initial, { x: 400, y: 268 }, 3, { line }), { x: 400, y: 268 });
  storyboard.push({ input: await sharp(Buffer.from(scene)).png().toBuffer(), left: index * 844, top: 0 });
  if (index === 1) await sharp(Buffer.from(scene)).png().toFile('artifacts/bamboo-verge-bagtas-scene.png');
}
await sharp({ create: { width: 2532, height: 390, channels: 4, background: '#1e3e35' } }).composite(storyboard).png().toFile('artifacts/bamboo-verge-introduction-storyboard.png');
await sharp(Buffer.from(framed(bambooVergeSceneArt(initial, BAMBOO_START), BAMBOO_START))).png().toFile('artifacts/bamboo-verge-arrival-scene.png');
await sharp(Buffer.from(framed(bambooVergeSceneArt(met, { x: 553, y: 246 }), { x: 553, y: 246 }))).png().toFile('artifacts/bamboo-verge-entry-scene.png');
await sharp(Buffer.from(framed(bambooVergeSceneArt(debrief), { x: 400, y: 268 }))).png().toFile('artifacts/bamboo-verge-debrief-scene.png');
const native = await sharp(Buffer.from(whole)).png().toBuffer();
const legacy = await sharp(Buffer.from(wrapSvg(vergeBody(BAMBOO_GROUND_SVG) + `<svg x="383" y="170" width="34" height="68" viewBox="0 0 32 64">${vergeBody(bagtasSpriteSvg())}</svg>` + vergeActor('rae', { x: 400, y: 268 }) + vergeBody(BAMBOO_CANOPY_SVG), 640, 480))).png().toBuffer();
await sharp({ create: { width: 1280, height: 480, channels: 4, background: '#1e3e35' } }).composite([{ input: legacy, left: 0, top: 0 }, { input: native, left: 640, top: 0 }]).png().toFile('artifacts/bamboo-verge-before-after.png');
for (const [name, left, top, width, height] of [['bamboo-shelter-detail', 368, 87, 180, 167], ['bamboo-entry-detail', 479, 145, 131, 121], ['bamboo-cups-detail', 412, 257, 104, 73], ['bamboo-rain-detail', 493, 370, 110, 79]] as const) await sharp(native).extract({ left, top, width, height }).resize(width * 3, height * 3, { kernel: 'nearest' }).png().toFile(`artifacts/${name}.png`);
let marks = bambooVergeSceneArt(met);
for (const collider of getMap('bamboo', met).colliders) marks += `<rect x="${collider.x}" y="${collider.y}" width="${collider.width}" height="${collider.height}" fill="#ef536d" fill-opacity=".18" stroke="#f9a7b9" stroke-width=".6"/>`;
for (const target of getMap('bamboo', met).interactions) marks += `<circle cx="${target.point.x}" cy="${target.point.y}" r="3" fill="#fff7ad" stroke="#345e65" stroke-width=".7"/>`;
await png(marks, 'artifacts/bamboo-verge-alignment-review.png');
for (const [name, progress] of Object.entries(states)) {
  const map = getMap('bamboo', progress), queue: Point[] = [{ ...BAMBOO_START }], seen = new Set([`${BAMBOO_START.x},${BAMBOO_START.y}`]);
  for (let index = 0; index < queue.length; index++) for (const [dx, dy] of [[4, 0], [-4, 0], [0, 4], [0, -4]]) {
    const next = { x: queue[index].x + dx, y: queue[index].y + dy }, key = `${next.x},${next.y}`;
    if (!seen.has(key) && canStand(next, map.colliders, 'bamboo')) { seen.add(key); queue.push(next); }
  }
  for (const target of map.interactions.filter(item => item.id !== 'tala')) if (!queue.some(point => nearbyInteraction(point, target.id, 'bamboo', undefined, progress)?.id === target.id)) throw new Error(`${name}: unreachable ${target.id}`);
}
// Existing v2 saves inside the adjusted cup-table footprint recover to valid ground.
const recovered = parseSave(JSON.stringify({ ...replayCheckpoint('chapter2'), player: { ...BAMBOO_START, x: 430, y: 280 } }));
if (!recovered || !canStand(recovered.player, getMap('bamboo', recovered.progress).colliders, 'bamboo')) throw new Error('Cup-table alignment must retain safe save recovery.');
for (const [index, [x, y]] of [[136, 364], [323, 268], [130, 349], [200, 338], [447, 299], [400, 265]].entries()) {
  if (!canStand({ x, y }, getMap('bamboo', met).colliders, 'bamboo')) throw new Error(`Blocked depth position ${x},${y}`);
  const frame = await sharp(Buffer.from(wrapSvg(bambooVergeSceneArt(met, { x, y }), 640, 480))).png().toBuffer();
  await sharp(frame).extract({ left: Math.max(0, Math.min(460, x - 90)), top: Math.max(0, Math.min(340, y - 80)), width: 180, height: 140 }).resize(540, 420, { kernel: 'nearest' }).png().toFile(`artifacts/bamboo-verge-depth-${index + 1}.png`);
}
const phonePanels: { input: Buffer; left: number; top: number }[] = [];
for (const [index, [width, height]] of [[960, 320], [844, 390], [1024, 768]].entries()) {
  const player = { x: 400, y: 268 }, view = sceneViewport(width, height), camera = cameraTarget({ x: player.x, y: player.y - 24 }, { width: 640, height: 480 }, view);
  if (camera.y > 172 || camera.y + view.vh < 284 || camera.x > 379 || camera.x + view.vw < 417) throw new Error('The encounter must frame both children and Bagtas.');
  phonePanels.push({ input: await sharp(Buffer.from(framed(bambooVergeSceneArt(met), player, width, height))).resize(480, 360, { fit: 'contain', background: '#1e3e35' }).png().toBuffer(), left: index * 480, top: 0 });
}
await sharp({ create: { width: 1440, height: 360, channels: 4, background: '#1e3e35' } }).composite(phonePanels).png().toFile('artifacts/bamboo-verge-phone-framing.png');
const frames: Buffer[] = [];
for (let frame = 0; frame < 12; frame++) {
  const player = { x: 553, y: 246 }, scene = framed(bambooVergeSceneArt(met, player, frame * .25), player, 600, 320);
  frames.push(await sharp(Buffer.from(scene)).ensureAlpha().raw().toBuffer());
}
await sharp(Buffer.concat(frames), { raw: { width: 600, height: frames.length * 320, channels: 4, pageHeight: 320 } }).gif({ loop: 0, delay: Array(frames.length).fill(250) }).toFile('artifacts/bamboo-verge-weather-preview.gif');
console.log('Rendered four verge states, arrival/introduction/entry/debrief scenes, material details, three screen sizes, six depth views and weather animation. All interactions are reachable and older saves recover safely around the aligned cup table. Source-art renders only.');
