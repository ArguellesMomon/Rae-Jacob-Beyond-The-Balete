import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';
import { duwendeSpriteSvg, duwendePortraitSvg } from '../src/art/duwendeArt.ts';
import { travelerSpriteSvg } from '../src/art/travelerArt.ts';
import { clearingSceneArt } from './clearing-scene-art.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { completeInteraction } from '../src/game/engine.ts';

await mkdir('artifacts', { recursive: true });
const svg = (body: string, w: number, h: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${body}</svg>`;
const nested = (xml: string, x: number, y: number, w: number, h: number) => xml.replace('<svg ', `<svg x="${x}" y="${y}" `).replace(/width="[^"]*" height="[^"]*"/, `width="${w}" height="${h}"`);
const looks = ['minda', 'luning', 'nilo', 'sela', 'doro', 'pilo'] as const;
let sheet = '<rect width="1000" height="560" fill="#293e32"/>';
sheet += '<text x="24" y="27" fill="#e0cf9a" font-family="monospace" font-size="16">DUWENDE NEIGHBORS / TALA REFERENCE / CELEBRATION POSES</text>';
sheet += nested(travelerSpriteSvg('tala', 'down', -1), 26, 65, 96, 120);
sheet += '<text x="25" y="210" fill="#d3c597" font-family="monospace">Tala</text>';
for (const [i, id] of looks.entries()) {
  const x = 150 + i * 140;
  sheet += nested(duwendeSpriteSvg(id), x, 65, 96, 120);
  sheet += `<text x="${x}" y="210" fill="#d3c597" font-family="monospace">${id}</text>`;
  sheet += nested(duwendePortraitSvg(id, 'warm'), x, 235, 100, 120);
  sheet += nested(duwendeSpriteSvg(id, 'down', -3, 'celebrate', 'delighted'), x, 390, 64, 80);
  sheet += nested(duwendeSpriteSvg(id, 'down', -4, 'celebrate', 'delighted'), x + 64, 390, 64, 80);
}
await sharp(Buffer.from(svg(sheet, 1000, 560))).png().toFile('artifacts/duwende-neighbors-review.png');
const ready = replayCheckpoint('bellReturn').progress;
const gathering = completeInteraction(ready, 'minda');
const party = replayCheckpoint('restored').progress;
for (const [name, p] of Object.entries({ before: ready, gathering, celebrating: party })) {
  await sharp(Buffer.from(svg(clearingSceneArt(p, { x: 382, y: 350 }, 3, { x: 365, y: 350 }), 576, 448))).resize(1152, 896, { kernel: 'nearest' }).png().toFile(`artifacts/clearing-${name}-review.png`);
}
console.log('Rendered the duwende cast and three celebration stages from shared runtime art.');
