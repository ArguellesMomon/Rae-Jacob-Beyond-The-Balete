import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { wrapSvg } from '../src/art/pixelArt.ts';
import { groveSceneArt } from './grove-scene-art.ts';
import { groveShot } from '../src/art/groveEnvironmentArt.ts';
import { waterworksSceneArt } from './waterworks-scene-art.ts';
import { LISTENING_SEED_SVG, residentSpriteSvg } from '../src/art/worldDetails.ts';
import { flowPresentation } from '../src/game/flowFeedback.ts';
import { cameraTarget, sceneViewport } from '../src/game/camera.ts';
import { EMPTY_PROGRESS } from '../src/game/model.ts';
import { RESIDENTS, RESIDENT_IDS } from '../src/game/residents.ts';
import { linesFor } from '../src/game/dialogue.ts';
import { replayCheckpoint } from '../src/game/replay.ts';

await mkdir('artifacts', { recursive: true });
const place = (s: string, x: number, y: number) => `<g transform="translate(${x} ${y})">${s}</g>`;

let gallery = '<rect width="256" height="65" fill="#d6cfaa"/>';
for (const [i, id] of RESIDENT_IDS.entries()) gallery += place(residentSpriteSvg(id, 1, false), 13 + i * 63, 4) + `<text x="${28 + i * 63}" y="58" text-anchor="middle" font-family="monospace" font-size="8" fill="#465e43">${RESIDENTS[id].name}</text>`;
await sharp(Buffer.from(wrapSvg(gallery, 256, 65))).resize(1280, 325, { kernel: 'nearest' }).png().toFile('artifacts/residents-preview.png');

const giftProgress = replayCheckpoint('restored').progress;
const giftLine = linesFor('mangGift', giftProgress, 'grove').find(line => line.prop === 'seed' && line.speaker === 'Mang Uban');
const giftBody = groveSceneArt(giftProgress, { x: 232, y: 302 }, 3, { line: giftLine, seedProgress: .6 });
const giftShot = groveShot({ x: 232, y: 302 }, 700, 520, { giftScene: true });
const giftView = sceneViewport(700, 520, giftShot.view), giftCamera = cameraTarget(giftShot.center, { width: 480, height: 512 }, giftView);
const gift = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="520" viewBox="${giftCamera.x} ${giftCamera.y} ${giftView.vw} ${giftView.vh}" shape-rendering="crispEdges">${giftBody}</svg>`;
await sharp(Buffer.from(gift)).png().toFile('artifacts/mang-uban-gift-preview.png');
await sharp(Buffer.from(LISTENING_SEED_SVG)).resize(240, 220, { kernel: 'nearest' }).png().toFile('artifacts/listening-seed.png');

const frames: Buffer[] = [], width = 600, height = 320, view = sceneViewport(width, height), player = { x: 322, y: 219 };
for (let clip = 0; clip < 2; clip++) for (let f = 0; f < 29; f++) {
  const age = f * .125, diverted = clip === 0;
  const p = { ...EMPTY_PROGRESS, branchMoved: true, flowDiverted: diverted, bellRecovered: !diverted, waterRestored: !diverted };
  const flow = flowPresentation({ at: 0, toDiverted: diverted }, age, player);
  const camera = cameraTarget(flow.center, { width: 704, height: 480 }, view);
  const cx = Math.round(camera.x + flow.shakeX), cy = Math.round(camera.y + flow.shakeY);
  let art = waterworksSceneArt(p, player, age, { companion: { x: 300, y: 234 }, flow });
  art += `<rect x="${cx + 50}" y="${cy + 10}" width="${view.vw - 100}" height="18" fill="#243f3c"/><text x="${cx + view.vw / 2}" y="${cy + 22}" text-anchor="middle" font-family="monospace" font-size="8" fill="#f1e1b4">${flow.caption}</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${cx} ${cy} ${view.vw} ${view.vh}" shape-rendering="crispEdges">${art}</svg>`;
  frames.push(await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer());
  if (clip === 0 && f === 14) await sharp(Buffer.from(svg)).png().toFile('artifacts/water-flow-preview.png');
}
await sharp(Buffer.concat(frames), { raw: { width, height: height * frames.length, channels: 4, pageHeight: height } }).gif({ loop: 0, delay: Array(frames.length).fill(125) }).toFile('artifacts/water-flow-preview.gif');

let script = '# World additions — Dialogue review\n\nGenerated from playable dialogue with `npm.cmd run world:preview`. Residents have four ambient variants and changing repair-state remarks; these show first visits. The Listening Seed is original Silong fantasy worldbuilding, reserved for a later chapter.\n\n';
for (const id of [...RESIDENT_IDS, 'lampShelf', 'messageBoard', 'dryingRack', 'seedTray', 'rainCup', 'listeningStone', 'toolRoll', 'floatGauge', 'reedChimes', 'mangGift', 'listeningSeed'] as const) {
  const p = { ...EMPTY_PROGRESS, metTala: true, bellRung: id === 'mangGift' || id === 'listeningSeed', ubanGiftReceived: id === 'listeningSeed' };
  const lines = linesFor(id, p);
  script += `## ${id}\n\n` + lines.map(l => `${l.beat ? `*${l.beat}*\n\n` : ''}**${l.speaker}:** ${l.text}`).join('\n\n') + '\n\n';
}
await writeFile('docs/world-dialogue-review.md', script);
console.log('Rendered four residents, Listening Seed, gift scene art and a two-direction animated water-flow source preview.');
