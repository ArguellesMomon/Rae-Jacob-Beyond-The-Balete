import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { clearingActor, clearingSceneArt, svgBody } from './clearing-scene-art.ts';
import { CLEARING_CANOPY_SVG, CLEARING_GROUND_SVG } from '../src/art/clearingArt.ts';
import { CLEARING_DETAILS_SVG } from '../src/art/worldDetails.ts';
import { wrapSvg } from '../src/art/pixelArt.ts';
import { CLEARING_START, TALA_START, EMPTY_PROGRESS } from '../src/game/model.ts';
import { getMap } from '../src/game/world.ts';
import { canStand, nearbyInteraction } from '../src/game/engine.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { sceneViewport, cameraTarget } from '../src/game/camera.ts';
import { crossingFrame } from '../src/game/crossing.ts';
import { yardRasterDefs, yardForegroundMarkup } from '../src/art/yardArt.ts';
import type { Progress } from '../src/game/model.ts';

await mkdir('artifacts', { recursive: true });
const initial = replayCheckpoint('arrival').progress;
initial.arrivalSeen = true;
const repaired = replayCheckpoint('bellReturn').progress;
const hung = { ...repaired, bellReturned: true, bellHung: true };
const restored = replayCheckpoint('restored').progress;
const states: Record<string, Progress> = { initial, repaired, hung, restored };
const png = async (source: string, path: string, scale = 2) => sharp(Buffer.from(wrapSvg(source, 576, 448))).resize(576 * scale, 448 * scale, { kernel: 'nearest' }).png().toFile(path);
for (const [stage, progress] of Object.entries(states)) {
  const scene = clearingSceneArt(progress, stage === 'restored' ? { x: 382, y: 350 } : { x: 174, y: 313 });
  await png(scene, `artifacts/clearing-${stage}-art-preview.png`);
  if (stage === 'initial') {
    await png(scene, 'artifacts/lantern-clearing-art-preview.png');
    await writeFile('artifacts/lantern-clearing-art-preview.svg', wrapSvg(scene, 576, 448));
  }
}
await png(clearingSceneArt(initial, CLEARING_START), 'artifacts/clearing-arrival-scene.png');
await png(clearingSceneArt(initial, { x: 188, y: 318 }), 'artifacts/clearing-tala-scene.png');
await png(clearingSceneArt(repaired, { x: 408, y: 239 }), 'artifacts/clearing-minda-scene.png');
await png(clearingSceneArt(restored, { x: 382, y: 350 }, 4, { x: 358, y: 348 }), 'artifacts/clearing-after-bell-scene.png');

let alignment = clearingSceneArt(initial);
for (const c of getMap('clearing', initial).colliders) alignment += `<rect x="${c.x}" y="${c.y}" width="${c.width}" height="${c.height}" fill="#ef5267" fill-opacity=".2" stroke="#f5a1ad" stroke-width=".6"/>`;
for (const target of getMap('clearing', initial).interactions) alignment += `<circle cx="${target.point.x}" cy="${target.point.y}" r="3" fill="#fff2b1" stroke="#375b67" stroke-width=".7"/>`;
await png(alignment, 'artifacts/clearing-alignment-review.png');
const current = await sharp(Buffer.from(wrapSvg(clearingSceneArt(initial), 576, 448))).png().toBuffer();
const legacy = await sharp(Buffer.from(wrapSvg(svgBody(CLEARING_GROUND_SVG) + svgBody(CLEARING_DETAILS_SVG) + clearingActor('rae', 174, 313, 'up') + clearingActor('tala', 188, 286) + svgBody(CLEARING_CANOPY_SVG), 576, 448))).png().toBuffer();
await sharp({ create: { width: 1152, height: 448, channels: 4, background: '#142c37' } }).composite([{ input: legacy, left: 0, top: 0 }, { input: current, left: 576, top: 0 }]).png().toFile('artifacts/clearing-before-after.png');
for (const [name, left, top, width, height] of [['root-homes-detail', 67, 100, 214, 103], ['clearing-waterkeeper-detail', 398, 157, 133, 163], ['clearing-bell-detail', 344, 282, 82, 83]] as const) {
  await sharp(current).extract({ left, top, width, height }).resize(width * 3, height * 3, { kernel: 'nearest' }).png().toFile(`artifacts/${name}.png`);
}
const view = sceneViewport(844, 390), camera = cameraTarget({ x: 188, y: 294 }, { width: 576, height: 448 }, view);
await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="844" height="390" viewBox="${Math.round(camera.x)} ${Math.round(camera.y)} ${view.vw} ${view.vh}" shape-rendering="crispEdges">${clearingSceneArt(initial, { x: 188, y: 318 })}</svg>`)).png().toFile('artifacts/clearing-phone-framing.png');

// Check every stage's approaches with real selection and the actual blocking geometry.
for (const [stage, progress] of Object.entries(states)) {
  const map = getMap('clearing', progress), queue = [{ ...CLEARING_START }], seen = new Set([`${CLEARING_START.x},${CLEARING_START.y}`]);
  for (let i = 0; i < queue.length; i++) for (const [dx, dy] of [[4, 0], [-4, 0], [0, 4], [0, -4]]) {
    const next = { ...queue[i], x: queue[i].x + dx, y: queue[i].y + dy }, key = `${next.x},${next.y}`;
    if (!seen.has(key) && canStand(next, map.colliders, 'clearing')) { seen.add(key); queue.push(next); }
  }
  for (const item of map.interactions) {
    if (!queue.some(point => nearbyInteraction(point, item.id, 'clearing', TALA_START, progress)?.id === item.id)) throw new Error(`${stage}: unreachable ${item.id}`);
  }
}
const positions = [[82, 300], [110, 172], [294, 112], [382, 321], [382, 346], [188, 303]];
for (const [index, [x, y]] of positions.entries()) {
  if (!canStand({ x, y }, getMap('clearing', initial).colliders, 'clearing')) throw new Error(`Blocked depth position ${x},${y}`);
  const scene = await sharp(Buffer.from(wrapSvg(clearingSceneArt(initial, { x, y }), 576, 448))).png().toBuffer();
  const left = Math.max(0, Math.min(396, x - 90)), top = Math.max(0, Math.min(308, y - 80));
  await sharp(scene).extract({ left, top, width: 180, height: 140 }).resize(540, 420, { kernel: 'nearest' }).png().toFile(`artifacts/clearing-depth-${index + 1}.png`);
}

// Source-art contact sheet of the existing transition phases; no story timing changes.
const yardUri = `data:image/png;base64,${(await readFile('assets/maps/lolas-yard-v2.png')).toString('base64')}`;
const tunnelUri = `data:image/png;base64,${(await readFile('assets/maps/root-descent-v2.png')).toString('base64')}`;
const panels: { input: Buffer; left: number; top: number }[] = [];
for (const [index, time] of [0, .25, .38, .57, .76, 1].entries()) {
  const frame = crossingFrame(time);
  let viewBox = '0 0 320 180', content = '';
  if (frame.phase === 'yard') { viewBox = '388 90 260 146'; content = yardRasterDefs(yardUri, 'crossing-preview') + '<use href="#crossing-preview-map"/>' + clearingActor('rae', 548, 190) + yardForegroundMarkup(undefined, 'crossing-preview'); }
  else if (frame.phase === 'roots') { const y = 47 + Math.min(1, frame.slide / .8) * 94; content = `<image href="${tunnelUri}" y="${-8 + Math.floor(frame.slide * 8)}" width="320" height="196" preserveAspectRatio="none"/>` + clearingActor('rae', 160, y + 30); }
  else if (frame.phase === 'arrival') { viewBox = '0 236 320 180'; content = clearingSceneArt(initial, CLEARING_START); }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice"><rect x="-1000" y="-1000" width="3000" height="3000" fill="#080f12"/>${content}<rect x="-1000" y="-1000" width="3000" height="3000" fill="#080f12" opacity="${frame.darkness}"/></svg>`;
  panels.push({ input: await sharp(Buffer.from(svg)).png().toBuffer(), left: index % 3 * 640, top: Math.floor(index / 3) * 360 });
}
await sharp({ create: { width: 1920, height: 720, channels: 4, background: '#080f12' } }).composite(panels).png().toFile('artifacts/clearing-crossing-storyboard.png');
console.log('Rendered four repair states, arrival/Tala/Minda/aftermath scenes, material details, phone framing, alignment, six depth views and crossing storyboard. All interactions remain reachable in all four states. Source-art renders only.');
