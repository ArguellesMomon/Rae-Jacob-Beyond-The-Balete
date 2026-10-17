import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { characterPortraitSvg, characterSpriteSvg } from '../src/art/characterArt.ts';
import { yardRasterDefs, yardForegroundMarkup, yardLightSvg, yardLaundrySvg } from '../src/art/yardArt.ts';
import { clearingSceneArt } from './clearing-scene-art.ts';
import { groveSceneArt } from './grove-scene-art.ts';
import { waterworksSceneArt } from './waterworks-scene-art.ts';
import { bambooVergeSceneArt } from './bamboo-verge-scene-art.ts';
import { turningSceneArt } from './turning-scene-art.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import type { Direction, Gesture } from '../src/game/model.ts';

await mkdir('artifacts', { recursive: true });
const svg = (s: string, w: number, h: number, view = `0 0 ${w} ${h}`) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${view}" shape-rendering="crispEdges">${s}</svg>`;
const body = (s: string) => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const label = (x: number, y: number, text: string, size = 7) => `<text x="${x}" y="${y}" font-family="monospace" font-size="${size}" fill="#e9ddb4">${text.replaceAll('&', '&amp;').replaceAll('<', '&lt;')}</text>`;
const directions: Direction[] = ['down', 'right', 'up', 'left'];
const png = async (s: string, path: string, scale = 1) => sharp(Buffer.from(s)).resize({ width: Number(s.match(/width="(\d+)"/)![1]) * scale, kernel: 'nearest' }).png().toFile(`artifacts/${path}`);

let design = '<rect width="504" height="258" fill="#293e34"/>';
for (const [row, id] of (['rae', 'tala'] as const).entries()) {
  design += label(8, row * 126 + 13, id === 'rae' ? 'RAE JACOB / SHORT HAIR, SANDO & SLIPPERS' : 'TALA / DUWENDE MAPMAKER', 8);
  design += `<g transform="translate(8 ${row * 126 + 20})">${characterPortraitSvg(id, 'warm')}</g>`;
  for (const [col, direction] of directions.entries()) {
    const h = id === 'rae' ? 96 : 80, y = row * 126 + 116 - h;
    design += `<svg x="${118 + col * 94}" y="${y}" width="64" height="${h}" viewBox="0 0 32 ${h / 2}">${body(characterSpriteSvg(id, direction, -1))}</svg>`;
    design += label(118 + col * 94, row * 126 + 122, direction);
  }
  await png(characterPortraitSvg(id, 'warm'), `${id}-portrait.png`, 5);
  let sheet = '<rect width="408" height="230" fill="#293e34"/>';
  for (const [rowIndex, direction] of directions.entries()) {
    sheet += label(3, 13 + rowIndex * 57, direction, 5);
    for (let f = 0; f < 8; f++) sheet += `<g transform="translate(${29 + f * 47} ${4 + rowIndex * 57})">${characterSpriteSvg(id, direction, f)}</g>`;
  }
  await png(svg(sheet, 408, 230), `${id}-eight-frame-review.png`, 4);
}
await png(svg(design, 504, 258), 'travelers-design-review.png', 3);
await writeFile('artifacts/travelers-design-review.svg', svg(design, 504, 258));

const walkFrames: Buffer[] = [], actingFrames: Buffer[] = [];
const poses: Gesture[] = ['idle', 'map', 'guardMap', 'wave', 'think', 'listen', 'reach', 'pull', 'brush', 'celebrate'];
for (let f = 0; f < 24; f++) {
  let s = '<rect width="368" height="248" fill="#293e34"/>';
  for (const [row, id] of (['rae', 'tala'] as const).entries()) for (const [col, direction] of directions.entries()) {
    const base = row * 118 + 111, h = id === 'rae' ? 96 : 80;
    s += label(6 + col * 92, row * 118 + 11, `${id} / ${direction}`, 6) + `<rect x="${20 + col * 92}" y="${base - 1}" width="36" height="3" fill="#1b2e29"/>`;
    s += `<svg x="${8 + col * 92}" y="${base - h}" width="64" height="${h}" viewBox="0 0 32 ${h / 2}">${body(characterSpriteSvg(id, direction, f % 8))}</svg>`;
  }
  walkFrames.push(await sharp(Buffer.from(svg(s, 368, 248))).resize(736, 496, { kernel: 'nearest' }).ensureAlpha().raw().toBuffer());
}
await sharp(Buffer.concat(walkFrames), { raw: { width: 736, height: 496 * walkFrames.length, channels: 4, pageHeight: 496 } }).gif({ loop: 0, delay: Array(walkFrames.length).fill(100) }).toFile('artifacts/travelers-four-direction-walk.gif');
for (let f = 0; f < 20; f++) {
  const gesture = poses[Math.floor(f / 2)];
  let s = '<rect width="368" height="248" fill="#293e34"/>';
  for (const [row, id] of (['rae', 'tala'] as const).entries()) for (const [col, direction] of directions.entries()) {
    const h = id === 'rae' ? 96 : 80;
    s += label(6 + col * 92, row * 118 + 11, `${id} / ${direction}`, 6);
    s += `<svg x="${8 + col * 92}" y="${row * 118 + 111 - h}" width="64" height="${h}" viewBox="0 0 32 ${h / 2}">${body(characterSpriteSvg(id, direction, f % 2 ? -3 : -4, gesture, 'curious', f === 12, f % 2))}</svg>`;
  }
  s += label(5, 244, gesture);
  actingFrames.push(await sharp(Buffer.from(svg(s, 368, 248))).resize(736, 496, { kernel: 'nearest' }).ensureAlpha().raw().toBuffer());
}
await sharp(Buffer.concat(actingFrames), { raw: { width: 736, height: 496 * actingFrames.length, channels: 4, pageHeight: 496 } }).gif({ loop: 0, delay: Array(actingFrames.length).fill(450) }).toFile('artifacts/travelers-directional-acting.gif');

const yardUri = `data:image/png;base64,${(await readFile('assets/maps/lolas-yard-v2.png')).toString('base64')}`;
const rae = '<rect x="262" y="251" width="16" height="3" fill="#142e2b" opacity=".28"/><svg x="260" y="222" width="20" height="30" viewBox="0 0 32 48">' + body(characterSpriteSvg('rae', 'down', -1)) + '</svg>';
const yard = yardRasterDefs(yardUri) + '<use href="#yard-preview-map"/>' + body(yardLightSvg(3, 'ground')) + body(yardLaundrySvg(0)) + rae + yardForegroundMarkup({ x: 270, y: 252 }) + body(yardLightSvg(3));
const scenes = [
  { name: 'yard', title: 'LOLA\'S YARD / WARM DAYLIGHT', source: yard, view: '180 170 230 115' },
  { name: 'clearing', title: 'LANTERN CLEARING / TWO TRAVELERS', source: clearingSceneArt(replayCheckpoint('arrival').progress), view: '80 230 230 115' },
  { name: 'grove', title: 'BALETE GROVE / COOL SHADE', source: groveSceneArt(replayCheckpoint('grove').progress), view: '135 255 230 115' },
  { name: 'works', title: 'ROOTWATER WORKS / WATER & STONE', source: waterworksSceneArt(replayCheckpoint('works').progress), view: '250 245 230 115' },
  { name: 'bamboo', title: 'BAMBOO VERGE / DAPPLED LIGHT', source: bambooVergeSceneArt(replayCheckpoint('chapter2').progress), view: '285 180 230 115' },
  { name: 'turning', title: 'TURNING PATHS / DEEP BAMBOO', source: turningSceneArt(replayCheckpoint('bambooPuzzle').progress), view: '205 280 230 115' },
];
const panels: { input: Buffer; left: number; top: number }[] = [];
for (const [i, scene] of scenes.entries()) {
  const scenePng = await sharp(Buffer.from(svg(scene.source, 690, 345, scene.view))).png().toBuffer();
  await writeFile(`artifacts/travelers-${scene.name}-scene.png`, scenePng);
  const panel = await sharp({ create: { width: 690, height: 375, channels: 4, background: '#293e34' } }).composite([
    { input: Buffer.from(svg(label(10, 19, scene.title, 9), 690, 30)), left: 0, top: 0 }, { input: scenePng, left: 0, top: 30 },
  ]).png().toBuffer();
  panels.push({ input: panel, left: i % 2 * 690, top: Math.floor(i / 2) * 375 });
}
await sharp({ create: { width: 1380, height: 1125, channels: 4, background: '#293e34' } }).composite(panels).png().toFile('artifacts/travelers-scene-review.png');
console.log('Rendered Rae and Tala: matching portraits, eight frames in four directions, directional gestures, and all six environment palettes. Source-art renders, not running-app screenshots.');
