import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { waterworksSceneArt, worksActor, worksBody } from './waterworks-scene-art.ts';
import { worksShot, worksPickupY } from '../src/art/waterworksEnvironmentArt.ts';
import { WATERWORKS_GROUND_SVG, WATERWORKS_CANOPY_SVG, waterworksStateSvg, wheelSvg } from '../src/art/waterworksArt.ts';
import { WORKS_DETAILS_SVG } from '../src/art/worldDetails.ts';
import { wrapSvg } from '../src/art/pixelArt.ts';
import { flowPresentation } from '../src/game/flowFeedback.ts';
import { cameraTarget, sceneViewport } from '../src/game/camera.ts';
import { getMap } from '../src/game/world.ts';
import { canStand, nearbyInteraction } from '../src/game/engine.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { WATERWORKS_START } from '../src/game/model.ts';
import type { Point, Progress } from '../src/game/model.ts';

await mkdir('artifacts', { recursive: true });
const initial = replayCheckpoint('works').progress;
const cleared = { ...initial, waterworksSeen: true, branchMoved: true };
const diverted = { ...cleared, flowDiverted: true };
const retrieved = { ...diverted, bellRecovered: true };
const restored = { ...retrieved, flowDiverted: false, waterRestored: true };
const named = replayCheckpoint('ending').progress;
const states: Record<string, Progress> = { initial, cleared, diverted, retrieved, restored, named };
const png = async (source: string, path: string) => sharp(Buffer.from(wrapSvg(source, 704, 480))).resize(1408, 960, { kernel: 'nearest' }).png().toFile(path);
for (const [name, progress] of Object.entries(states)) {
  const scene = waterworksSceneArt(progress);
  await png(scene, `artifacts/rootwater-${name}-art-preview.png`);
  await writeFile(`artifacts/rootwater-${name}-art-preview.svg`, wrapSvg(scene, 704, 480));
}
const whole = wrapSvg(waterworksSceneArt(initial), 704, 480);
await png(waterworksSceneArt(initial), 'artifacts/rootwater-works-art-preview.png');
function framed(source: string, player: Point, width = 844, height = 390, options: Parameters<typeof worksShot>[1] = {}, flow?: ReturnType<typeof flowPresentation>) {
  const view = sceneViewport(width, height), camera = cameraTarget(worksShot(player, options), { width: 704, height: 480 }, view);
  const x = Math.round(camera.x + (flow?.shakeX ?? 0)), y = Math.round(camera.y + (flow?.shakeY ?? 0));
  const caption = flow?.active ? `<rect x="${x + view.vw / 2 - 91}" y="${y + 51}" width="182" height="13" fill="#203c3be8"/><text x="${x + view.vw / 2}" y="${y + 60}" text-anchor="middle" font-family="monospace" font-size="7" fill="#f0dfb2">${flow.caption}</text>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${x} ${y} ${view.vw} ${view.vh}" shape-rendering="crispEdges">${source}${caption}</svg>`;
}
await sharp(Buffer.from(framed(waterworksSceneArt(initial, WATERWORKS_START), WATERWORKS_START))).png().toFile('artifacts/waterworks-arrival-scene.png');
await sharp(Buffer.from(framed(waterworksSceneArt(diverted, { x: 385, y: 322 }, 3, { retrieving: .7 }), { x: 385, y: 322 }, 844, 390, { retrieving: .7 }))).png().toFile('artifacts/waterworks-retrieval-scene.png');
await sharp(Buffer.from(framed(waterworksSceneArt(named, { x: 584, y: 214 }, 3, { focusRoot: true }), { x: 584, y: 214 }, 844, 390, { focusRoot: true }))).png().toFile('artifacts/waterworks-root-seal-scene.png');
await sharp(Buffer.from(framed(waterworksSceneArt(named, { x: 444, y: 378 }), { x: 444, y: 378 }))).png().toFile('artifacts/waterworks-crossing-scene.png');
const storyboard: { input: Buffer; left: number; top: number }[] = [];
for (const [index, reveal] of [0, .25, .5, 1].entries()) {
  const player = { x: 490, y: 378 };
  storyboard.push({ input: await sharp(Buffer.from(framed(waterworksSceneArt(named, player, 3, { focusRoot: true }), player, 844, 390, { focusRoot: true, reveal }))).png().toBuffer(), left: index % 2 * 844, top: Math.floor(index / 2) * 390 });
}
await sharp({ create: { width: 1688, height: 780, channels: 4, background: '#163d46' } }).composite(storyboard).png().toFile('artifacts/waterworks-ending-storyboard.png');
const native = await sharp(Buffer.from(whole)).png().toBuffer();
const legacy = await sharp(Buffer.from(wrapSvg(worksBody(WATERWORKS_GROUND_SVG) + worksBody(waterworksStateSvg(initial)) + worksBody(WORKS_DETAILS_SVG) + `<g transform="translate(406 278)">${worksBody(wheelSvg(0))}</g>` + worksActor('rae', { x: 366, y: 330 }) + worksBody(WATERWORKS_CANOPY_SVG), 704, 480))).png().toBuffer();
await sharp({ create: { width: 1408, height: 480, channels: 4, background: '#163d46' } }).composite([{ input: legacy, left: 0, top: 0 }, { input: native, left: 704, top: 0 }]).png().toFile('artifacts/waterworks-before-after.png');
for (const [name, left, top, width, height] of [['waterworks-wheel-detail', 348, 250, 137, 151], ['waterworks-splitter-detail', 245, 96, 137, 146], ['waterworks-seal-detail', 530, 97, 138, 155]] as const) await sharp(native).extract({ left, top, width, height }).resize(width * 3, height * 3, { kernel: 'nearest' }).png().toFile(`artifacts/${name}.png`);
let marks = waterworksSceneArt(initial);
for (const collider of getMap('waterworks', initial).colliders) marks += `<rect x="${collider.x}" y="${collider.y}" width="${collider.width}" height="${collider.height}" fill="#f95577" fill-opacity=".2" stroke="#ff9eac" stroke-width=".6"/>`;
for (const target of getMap('waterworks', named).interactions) marks += `<circle cx="${target.point.x}" cy="${target.point.y}" r="3" fill="#fff7ad" stroke="#345e65" stroke-width=".7"/>`;
await png(marks, 'artifacts/waterworks-alignment-review.png');
for (const [name, progress] of Object.entries(states)) {
  const map = getMap('waterworks', progress), queue: Point[] = [{ ...WATERWORKS_START }], seen = new Set([`${WATERWORKS_START.x},${WATERWORKS_START.y}`]);
  for (let i = 0; i < queue.length; i++) for (const [dx, dy] of [[4, 0], [-4, 0], [0, 4], [0, -4]]) {
    const next = { x: queue[i].x + dx, y: queue[i].y + dy }, key = `${next.x},${next.y}`;
    if (!seen.has(key) && canStand(next, map.colliders, 'waterworks')) { seen.add(key); queue.push(next); }
  }
  for (const target of map.interactions.filter(item => item.id !== 'tala' && (progress.bellRung || !['rootSeal', 'bambooDeparture'].includes(item.id)))) {
    if (!queue.some(point => nearbyInteraction(point, target.id, 'waterworks', undefined, progress)?.id === target.id)) throw new Error(`${name}: unreachable ${target.id}`);
  }
  if (queue.some(point => point.x > 456) !== progress.bellRung) throw new Error(`${name}: eastern bank gate mismatch`);
}
for (const [index, [x, y]] of [[84, 344], [262, 139], [322, 219], [385, 322], [444, 378], [654, 314]].entries()) {
  if (!canStand({ x, y }, getMap('waterworks', named).colliders, 'waterworks')) throw new Error(`Blocked depth review ${x},${y}`);
  const frame = await sharp(Buffer.from(wrapSvg(waterworksSceneArt(named, { x, y }), 704, 480))).png().toBuffer();
  await sharp(frame).extract({ left: Math.max(0, Math.min(524, x - 90)), top: Math.max(0, Math.min(340, y - 80)), width: 180, height: 140 }).resize(540, 420, { kernel: 'nearest' }).png().toFile(`artifacts/waterworks-depth-${index + 1}.png`);
}
const phonePanels: { input: Buffer; left: number; top: number }[] = [];
for (const [index, [width, height]] of [[960, 320], [844, 390], [1024, 768]].entries()) {
  const player = { x: 385, y: 322 }, view = sceneViewport(width, height), camera = cameraTarget(worksShot(player, { retrieving: .7 }), { width: 704, height: 480 }, view);
  const bellY = worksPickupY(.7) + 2;
  if (camera.y > player.y - 30 || camera.y + view.vh < Math.max(334, bellY + 17) || camera.x > player.x - 10 || camera.x + view.vw < 462) throw new Error('The retrieval must frame Rae, wheel and bell.');
  phonePanels.push({ input: await sharp(Buffer.from(framed(waterworksSceneArt(diverted, player, 3, { retrieving: .7 }), player, width, height, { retrieving: .7 }))).resize(480, 360, { fit: 'contain', background: '#163d46' }).png().toBuffer(), left: index * 480, top: 0 });
}
await sharp({ create: { width: 1440, height: 360, channels: 4, background: '#163d46' } }).composite(phonePanels).png().toFile('artifacts/waterworks-phone-framing.png');
const flowFrames: Buffer[] = [], retrieveFrames: Buffer[] = [], flowPlayer = { x: 322, y: 219 };
for (let clip = 0; clip < 2; clip++) for (let frame = 0; frame < 18; frame++) {
  const age = frame * .2, progress = clip === 0 ? diverted : restored, flow = flowPresentation({ at: 0, toDiverted: clip === 0 }, age, flowPlayer);
  const scene = waterworksSceneArt(progress, flowPlayer, age, { flow });
  const svg = framed(scene, flowPlayer, 600, 320, { flowCenter: flow.center }, flow);
  flowFrames.push(await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer());
  if (clip === 0 && frame === 9) await sharp(Buffer.from(svg)).png().toFile('artifacts/water-flow-preview.png');
}
await sharp(Buffer.concat(flowFrames), { raw: { width: 600, height: flowFrames.length * 320, channels: 4, pageHeight: 320 } }).gif({ loop: 0, delay: Array(flowFrames.length).fill(200) }).toFile('artifacts/water-flow-preview.gif');
for (let frame = 0; frame < 13; frame++) {
  const player = { x: 385, y: 322 }, retrieving = frame / 12;
  const svg = framed(waterworksSceneArt(diverted, player, 3, { retrieving }), player, 600, 320, { retrieving });
  retrieveFrames.push(await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer());
}
await sharp(Buffer.concat(retrieveFrames), { raw: { width: 600, height: retrieveFrames.length * 320, channels: 4, pageHeight: 320 } }).gif({ loop: 0, delay: Array(retrieveFrames.length).fill(100) }).toFile('artifacts/waterworks-retrieval-preview.gif');
console.log('Rendered six waterworks states, arrival/retrieval/crossing/root scenes, ending storyboard, material details, phone framing, six depth views and flow/retrieval animations. All expected interactions are reachable and the eastern bank opens only after the bell. Source-art renders only.');
