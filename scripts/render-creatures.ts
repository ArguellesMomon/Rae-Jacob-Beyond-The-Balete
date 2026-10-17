import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { mangUbanSvg } from '../src/art/groveArt.ts';
import { bagtasSpriteSvg } from '../src/art/bagtasArt.ts';
import { characterPortraitSvg } from '../src/art/characterArt.ts';
import { groveSceneArt } from './grove-scene-art.ts';
import { bambooVergeSceneArt } from './bamboo-verge-scene-art.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { linesFor } from '../src/game/dialogue.ts';
import type { Emotion } from '../src/game/model.ts';

await mkdir('artifacts', { recursive: true });
const svg = (s: string, w: number, h: number, view = `0 0 ${w} ${h}`) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${view}" shape-rendering="crispEdges">${s}</svg>`;
const label = (x: number, y: number, text: string, size = 7) => `<text x="${x}" y="${y}" font-family="monospace" font-size="${size}" fill="#edddb0">${text}</text>`;
const png = (source: string, path: string, scale = 1) => sharp(Buffer.from(source)).resize({ width: Math.round(Number(source.match(/width="(\d+)"/)![1]) * scale), kernel: 'nearest' }).png().toFile(`artifacts/${path}`);
const emotions: Emotion[] = ['neutral', 'warm', 'delighted', 'curious', 'worried', 'determined', 'wistful', 'surprised', 'wry'];
let sheet = '<rect width="536" height="218" fill="#243d35"/>';
sheet += label(12, 16, 'MANG UBAN / THE GROVE WATCHER', 8) + label(284, 16, 'BAGTAS / THE PROUD WAYFINDER', 8);
sheet += `<g transform="translate(12 36)">${characterPortraitSvg('uban', 'neutral')}</g><g transform="translate(137 32)">${mangUbanSvg()}</g>`;
sheet += `<g transform="translate(284 36)">${characterPortraitSvg('bagtas', 'wry')}</g><svg x="412" y="38" width="68" height="136" viewBox="0 0 32 64">${bagtasSpriteSvg(false, 0, 'wry')}</svg>`;
sheet += label(12, 146, 'Heavy brow / silver-threaded beard', 6) + label(12, 158, 'Woven mantle / thick tobacco cigar', 6);
sheet += label(284, 190, 'Long mane / strong chest / six-pack', 6);
sheet += label(12, 206, 'Original animated pixel art / portraits and world sprites from the app', 6);
await png(svg(sheet, 536, 218), 'creature-design-review.png', 3);
await writeFile('artifacts/creature-design-review.svg', svg(sheet, 536, 218));
let expressions = '<rect width="828" height="226" fill="#243d35"/>';
for (const [row, id] of (['uban', 'bagtas'] as const).entries()) for (const [col, emotion] of emotions.entries()) {
  expressions += `<g transform="translate(${col * 92} ${row * 113})">${characterPortraitSvg(id, emotion)}</g>` + label(col * 92 + 2, row * 113 + 106, emotion);
}
await png(svg(expressions, 828, 226), 'creature-expression-review.png', 2);
const frames: Buffer[] = [];
for (let f = 0; f < 24; f++) {
  const emotion = emotions[Math.floor(f / 3) % emotions.length], blink = f === 12, mouth = f % 3 === 0 ? 1 : 0;
  let s = '<rect width="400" height="178" fill="#243d35"/>';
  s += `<g transform="translate(4 20)">${characterPortraitSvg('uban', emotion, blink, mouth)}</g><g transform="translate(91 12)">${mangUbanSvg(blink, false, { emotion, mouth, hand: f % 6 < 3 ? -2 : 0 })}</g>`;
  s += `<g transform="translate(218 20)">${characterPortraitSvg('bagtas', emotion, blink, mouth)}</g><svg x="326" y="27" width="60" height="120" viewBox="0 0 32 64">${bagtasSpriteSvg(blink, mouth, emotion, f % 2)}</svg>`;
  s += label(4, 12, 'Mang Uban') + label(218, 12, 'Bagtas') + label(218, 162, emotion);
  frames.push(await sharp(Buffer.from(svg(s, 400, 178))).resize(800, 356, { kernel: 'nearest' }).ensureAlpha().raw().toBuffer());
}
await sharp(Buffer.concat(frames), { raw: { width: 800, height: 356 * frames.length, channels: 4, pageHeight: 356 } }).gif({ loop: 0, delay: Array(frames.length).fill(200) }).toFile('artifacts/creature-acting-preview.gif');
const grove = replayCheckpoint('grove').progress, bamboo = replayCheckpoint('chapter2').progress;
await png(svg(groveSceneArt(grove, { x: 232, y: 302 }), 844, 480, '112 89 250 235'), 'mang-uban-scene-redesign.png');
await png(svg(bambooVergeSceneArt(bamboo), 844, 480, '300 135 214 122'), 'bagtas-scene-redesign.png');
const smoke: Buffer[] = [];
for (let f = 0; f < 16; f++) smoke.push(await sharp(Buffer.from(svg(groveSceneArt(grove, { x: 232, y: 302 }, f / 3), 420, 390, '180 92 140 130'))).ensureAlpha().raw().toBuffer());
await sharp(Buffer.concat(smoke), { raw: { width: 420, height: 390 * smoke.length, channels: 4, pageHeight: 390 } }).gif({ loop: 0, delay: Array(smoke.length).fill(333) }).toFile('artifacts/mang-uban-smoke-preview.gif');
let review = '# Creature redesign dialogue review\n\nSource-art review; these images are not running-app screenshots. The new appearance and personalities are original character design, not a claim that every folklore account agrees.\n\n';
for (const [id, progress, map] of [ ['mang', grove, 'grove'], ['bagtas', bamboo, 'bamboo'], ['bagtasStories', bamboo, 'bamboo'], ['bagtasDebrief', replayCheckpoint('bambooDebrief').progress, 'bamboo'] ] as const) {
  review += `## ${id}\n\n` + linesFor(id, progress, map).map(line => `${line.beat ? `*${line.beat}*\n\n` : ''}**${line.speaker}:** ${line.text}\n\n`).join('');
}
await writeFile('docs/creature-redesign-review.md', review);
console.log('Rendered both creature designs, nine expressions, acting, integrated scene close-ups and animated cigar smoke. Source-art review only.');
