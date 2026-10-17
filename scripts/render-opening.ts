import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { pixelFrameSvg, JOYSTICK_MARKS } from '../src/art/interfaceArt.ts';
import { characterSpriteSvg } from '../src/art/characterArt.ts';
import { linesFor } from '../src/game/dialogue.ts';
import { EMPTY_PROGRESS } from '../src/game/model.ts';
import type { InteractionId } from '../src/game/model.ts';

await mkdir('artifacts', { recursive: true });
const body = (s: string) => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const svg = (s: string, w: number, h: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${s}</svg>`;
const label = (x: number, y: number, text: string, color = '#f1e7c8') => `<text x="${x}" y="${y}" fill="${color}" font-family="monospace" font-size="9">${text}</text>`;
const panel = (x: number, y: number, w: number, h: number, fill: string, cut = 4) => `<g transform="translate(${x} ${y})">${body(pixelFrameSvg(w, h, fill, '#a5aa7b', '#fff5d6', cut))}</g>`;
let ui = '<rect width="420" height="218" fill="#314d3b"/>';
ui += label(16, 20, 'SOURCE ART · PIXEL CONTROLS');
ui += panel(20, 43, 108, 108, '#253e2a55', 9) + `<g transform="translate(20 43)"><path d="${JOYSTICK_MARKS}" fill="#fff1cb99"/><rect x="30" y="52" width="48" height="3" fill="#efe0b522"/><rect x="52" y="30" width="3" height="48" fill="#efe0b522"/></g>`;
ui += panel(48, 71, 52, 52, '#f7ecc8d9', 6) + '<rect x="70" y="93" width="8" height="8" fill="#71825c"/>';
ui += panel(168, 43, 78, 78, '#f6e9c5ef', 9) + '<path d="M198 72h6v-8h3v8h3v-6h3v8h3v-4h3v15h-3v5h-15v-5h-3z" fill="#536b49"/>';
ui += panel(282, 43, 47, 47, '#263e30e8') + '<path d="M297 58h5v17h-5z M309 58h5v17h-5z" fill="#f5ecd6"/>';
ui += panel(347, 43, 47, 47, '#263e30e8') + '<path d="M359 58h9l3 3 3-3h9v19h-10l-2 2-2-2h-10z" fill="#e1d2a3"/>';
ui += label(34, 169, 'WANDER A LITTLE') + label(183, 139, 'INSPECT');
ui += panel(168, 161, 226, 43, '#f1e4bd') + label(191, 187, 'Continue your journey  >', '#344332');
await sharp(Buffer.from(svg(ui, 420, 218))).resize(1260, 654, { kernel: 'nearest' }).png().toFile('artifacts/pixel-controls-preview.png');

const frames: Buffer[] = [];
for (let f = 0; f < 8; f++) {
  let art = '<rect width="128" height="118" fill="#d9d1ad"/>';
  for (const [row, id] of (['rae', 'tala'] as const).entries()) for (const [col, direction] of (['left', 'right'] as const).entries()) {
    art += `<g transform="translate(${14 + col * 62} ${4 + row * 57})">${characterSpriteSvg(id, direction, f)}</g>`;
  }
  art += label(14, 113, 'RAE / TALA', '#4a5f43');
  const raw = await sharp(Buffer.from(svg(art, 128, 118))).resize(512, 472, { kernel: 'nearest' }).ensureAlpha().raw().toBuffer();
  frames.push(raw);
  if (f === 0) await sharp(raw, { raw: { width: 512, height: 472, channels: 4 } }).png().toFile('artifacts/profile-fix-preview.png');
}
await sharp(Buffer.concat(frames), { raw: { width: 512, height: 472 * 8, channels: 4, pageHeight: 472 } }).gif({ loop: 0, delay: Array(8).fill(110) }).toFile('artifacts/profile-walk-preview.gif');

const ids: InteractionId[] = ['lola', 'merienda', 'yardCat', 'calamansi', 'herbBed', 'sungka', 'rainJar', 'basin', 'clothesline', 'lolaStories', 'lolaString', 'lolaWaiting', 'balete', 'arrival', 'tala', 'talaWhere', 'talaHome', 'talaRinging', 'talaMaps', 'talaCourtesy', 'talaJourney', 'minda', 'mindaWater', 'mindaNeighbors', 'mindaWaybell', 'mang', 'mangHome', 'mangRinging', 'mangForest', 'mangKapre', 'mangMemory', 'mangBagtas', 'rootSeal'];
let script = '# Chapter 1 — Dialogue review copy\n\nGenerated from the playable dialogue with `npm.cmd run opening:preview`. This is a review copy, not a replacement for the source. Introductions use their first-meeting states; repeat visits and repaired-state replies can differ. The unknown opening voice and the ending voice remain unidentified, and Rae notices they sound different. Crossing magic is original Silong worldbuilding.\n\n';
for (const id of ids) {
  const p = { ...EMPTY_PROGRESS, talkedToLola: id !== 'lola' };
  const lines = linesFor(id, p, ['mang', 'mangHome', 'mangRinging', 'mangForest', 'mangKapre', 'mangMemory', 'mangBagtas'].includes(id) ? 'grove' : id === 'rootSeal' ? 'waterworks' : id.startsWith('tala') || id.startsWith('minda') ? 'clearing' : 'yard');
  script += `## ${id} · ${lines.length} lines\n\n` + lines.map(line => `${line.beat ? `*${line.beat}*\n\n` : ''}**${line.speaker === 'Someone?' ? '???' : line.speaker}:** ${line.text}`).join('\n\n') + '\n\n';
}
await writeFile('docs/chapter-01-dialogue-review.md', script);
console.log('Rendered pixel controls and mirrored profile walk preview; exported the playable dialogue review copy.');
