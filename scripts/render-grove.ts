import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { groveSceneArt, groveActor, groveSvgBody } from './grove-scene-art.ts';
import { groveShot } from '../src/art/groveEnvironmentArt.ts';
import { GROVE_CANOPY_SVG, GROVE_GROUND_SVG, mangUbanSvg } from '../src/art/groveArt.ts';
import { GROVE_DETAILS_SVG } from '../src/art/worldDetails.ts';
import { wrapSvg } from '../src/art/pixelArt.ts';
import { getMap } from '../src/game/world.ts';
import { canStand, nearbyInteraction } from '../src/game/engine.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { GROVE_START } from '../src/game/model.ts';
import { linesFor } from '../src/game/dialogue.ts';
import { cameraTarget, sceneViewport } from '../src/game/camera.ts';
import type { Progress } from '../src/game/model.ts';

await mkdir('artifacts', { recursive: true });
const initial = replayCheckpoint('grove').progress;
const met = { ...initial, groveRevealed: true, metMang: true };
const quiet = { ...met, flowDiverted: true };
const gift = replayCheckpoint('restored').progress;
const received = { ...gift, ubanGiftReceived: true };
const giftLine = linesFor('mangGift', gift, 'grove').find(line => line.prop === 'seed' && line.speaker === 'Mang Uban')!;
if (!giftLine) throw new Error('The real gift scene must include Mang Uban presenting the seed.');
const states: Record<string, Progress> = { initial, met, quiet, gift, received };
const png = async (source: string, path: string) => sharp(Buffer.from(wrapSvg(source, 480, 512))).resize(960, 1024, { kernel: 'nearest' }).png().toFile(path);
for (const [name, progress] of Object.entries(states)) {
  const source = groveSceneArt(progress, name === 'initial' ? GROVE_START : { x: 232, y: 302 });
  await png(source, `artifacts/grove-${name}-art-preview.png`);
}
const whole = wrapSvg(groveSceneArt(met), 480, 512);
await sharp(Buffer.from(whole)).resize(960, 1024, { kernel: 'nearest' }).png().toFile('artifacts/old-balete-grove-art-preview.png');
await writeFile('artifacts/old-balete-grove-art-preview.svg', whole);

function framed(source: string, width: number, height: number, player: { x: number; y: number }, options: Parameters<typeof groveShot>[3] = {}) {
  const shot = groveShot(player, width, height, options), view = sceneViewport(width, height, shot.view, { width: 480, height: 512 });
  const camera = cameraTarget(shot.center, { width: 480, height: 512 }, view);
  const marginX = 0, marginY = 0;
  if (camera.x < -marginX - .01 || camera.y < -marginY - .01 || camera.x + view.vw > 480 + marginX + .01 || camera.y + view.vh > 512 + marginY + .01) throw new Error('The scene view must stay inside its painted forest backdrop.');
  if (options.giftScene && (camera.y > 108 || camera.y + view.vh < player.y)) throw new Error('The gift must frame Mang Uban\'s head and Rae\'s feet.');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${Math.round(camera.x)} ${Math.round(camera.y)} ${view.vw} ${view.vh}" shape-rendering="crispEdges">${source}</svg>`;
}
const panels: { input: Buffer; left: number; top: number }[] = [];
for (const [index, reveal] of [0, .3, .7, 1].entries()) {
  const source = groveSceneArt(initial, { x: 232, y: 350 });
  const frame = framed(source, 844, 390, { x: 232, y: 350 }, { focusMang: true, reveal });
  panels.push({ input: await sharp(Buffer.from(frame)).png().toBuffer(), left: index % 2 * 844, top: Math.floor(index / 2) * 390 });
}
await sharp({ create: { width: 1688, height: 780, channels: 4, background: '#17313c' } }).composite(panels).png().toFile('artifacts/grove-reveal-storyboard.png');
await sharp(Buffer.from(framed(groveSceneArt(met), 844, 390, { x: 232, y: 302 }, { focusMang: true }))).png().toFile('artifacts/grove-conversation-scene.png');
const offering = groveSceneArt(gift, { x: 232, y: 302 }, 3, { line: giftLine, seedProgress: .6 });
await sharp(Buffer.from(framed(offering, 844, 390, { x: 232, y: 302 }, { giftScene: true }))).png().toFile('artifacts/mang-uban-gift-preview.png');
await sharp(Buffer.from(framed(groveSceneArt(initial, GROVE_START), 844, 390, GROVE_START))).png().toFile('artifacts/grove-phone-framing.png');
for (const [name, w, h] of [['desktop', 1914, 994], ['ultrawide', 2560, 1080], ['portrait', 390, 844]] as const) await sharp(Buffer.from(framed(groveSceneArt(met, { x: 331, y: 342 }), w, h, { x: 331, y: 342 }))).png().toFile(`artifacts/grove-${name}-framing.png`);
for (const [width, height] of [[960, 320], [844, 390], [1024, 768], [390, 844]]) for (const y of [286, 302, 326]) framed(offering, width, height, { x: 232, y }, { giftScene: true });

const native = await sharp(Buffer.from(whole)).png().toBuffer();
const legacy = await sharp(Buffer.from(wrapSvg(groveSvgBody(GROVE_GROUND_SVG) + groveSvgBody(GROVE_DETAILS_SVG) + `<g transform="translate(182 108)">${groveSvgBody(mangUbanSvg())}</g>` + groveActor('rae', 232, 302) + groveActor('tala', 211, 320) + groveSvgBody(GROVE_CANOPY_SVG), 480, 512))).png().toBuffer();
await sharp({ create: { width: 960, height: 512, channels: 4, background: '#17313c' } }).composite([{ input: legacy, left: 0, top: 0 }, { input: native, left: 480, top: 0 }]).png().toFile('artifacts/grove-before-after.png');
for (const [name, left, top, width, height] of [['balete-bark-detail', 145, 68, 190, 218], ['grove-bamboo-detail', 282, 237, 173, 145], ['doro-plot-detail', 75, 332, 125, 108]] as const) await sharp(native).extract({ left, top, width, height }).resize(width * 3, height * 3, { kernel: 'nearest' }).png().toFile(`artifacts/${name}.png`);
let marks = groveSceneArt(met);
for (const c of getMap('grove', met).colliders) marks += `<rect x="${c.x}" y="${c.y}" width="${c.width}" height="${c.height}" fill="#ef536d" fill-opacity=".18" stroke="#f9a7b9" stroke-width=".6"/>`;
for (const target of getMap('grove', met).interactions) marks += `<circle cx="${target.point.x}" cy="${target.point.y}" r="3" fill="#fff7ad" stroke="#345e65" stroke-width=".7"/>`;
await png(marks, 'artifacts/grove-alignment-review.png');

for (const [name, progress] of Object.entries(states)) {
  const map = getMap('grove', progress), queue = [{ ...GROVE_START }], visited = new Set([`${GROVE_START.x},${GROVE_START.y}`]);
  for (let i = 0; i < queue.length; i++) for (const [dx, dy] of [[4, 0], [-4, 0], [0, 4], [0, -4]]) {
    const next = { ...queue[i], x: queue[i].x + dx, y: queue[i].y + dy }, key = `${next.x},${next.y}`;
    if (!visited.has(key) && canStand(next, map.colliders, 'grove')) { visited.add(key); queue.push(next); }
  }
  for (const target of map.interactions) if (!queue.some(point => nearbyInteraction(point, target.id, 'grove', undefined, progress)?.id === target.id)) throw new Error(`${name}: unreachable ${target.id}`);
}
const positions = [[109, 324], [359, 312], [120, 400], [355, 418], [331, 342], [224, 471]];
for (const [index, [x, y]] of positions.entries()) {
  if (!canStand({ x, y }, getMap('grove', met).colliders, 'grove')) throw new Error(`Blocked depth position ${x},${y}`);
  const frame = await sharp(Buffer.from(wrapSvg(groveSceneArt(met, { x, y }), 480, 512))).png().toBuffer();
  const left = Math.max(0, Math.min(300, x - 90)), top = Math.max(0, Math.min(372, y - 80));
  await sharp(frame).extract({ left, top, width: 180, height: 140 }).resize(540, 420, { kernel: 'nearest' }).png().toFile(`artifacts/grove-depth-${index + 1}.png`);
}
const frames: Buffer[] = [];
for (let frame = 0; frame < 16; frame++) {
  const scene = groveSceneArt(gift, { x: 232, y: 302 }, 3 + frame / 10, { line: giftLine, seedProgress: frame / 14 });
  frames.push(await sharp(Buffer.from(wrapSvg(scene, 480, 512))).extract({ left: 214, top: 190, width: 95, height: 125 }).resize(380, 500, { kernel: 'nearest' }).ensureAlpha().raw().toBuffer());
}
await sharp(Buffer.concat(frames), { raw: { width: 380, height: 500 * frames.length, channels: 4, pageHeight: 500 } }).gif({ loop: 0, delay: Array(frames.length).fill(100) }).toFile('artifacts/grove-seed-offering.gif');
console.log('Rendered five grove states, the reveal/conversation/gift scenes, material close-ups, phone framing, six depth views and seed animation. All interactions are reachable; gift/title framing stays within the actual map, with both participants framed. Source-art renders only.');
