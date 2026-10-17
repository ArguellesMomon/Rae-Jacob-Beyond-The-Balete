import { clearingSceneArt } from './clearing-scene-art.ts';
import { groveSceneArt } from './grove-scene-art.ts';
import { waterworksSceneArt } from './waterworks-scene-art.ts';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { raeSvg, wrapSvg } from '../src/art/pixelArt.ts';
import { yardRasterDefs, yardForegroundMarkup, yardLightSvg, yardLaundrySvg } from '../src/art/yardArt.ts';
import { duwendeSvg } from '../src/art/clearingArt.ts';
import { EMPTY_PROGRESS } from '../src/game/model.ts';
import type { CharacterId, Direction } from '../src/game/model.ts';
import { characterPortraitSvg, characterSpriteSvg } from '../src/art/characterArt.ts';

await mkdir('artifacts', { recursive: true });
await mkdir('assets', { recursive: true });
const body = (svg: string) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const actor = (id: Exclude<CharacterId, 'uban'>, x: number, y: number, direction: Direction = 'down') => {
  const small = id === 'tala' || id === 'minda', w = small ? 18 : 20, h = small ? 22 : 30;
  return `<svg x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" viewBox="0 0 32 ${small ? 40 : 48}">${body(characterSpriteSvg(id, direction, -1, id === 'tala' ? 'map' : 'idle'))}</svg>`;
};
const yardImage = `data:image/png;base64,${(await readFile('assets/maps/lolas-yard-v2.png')).toString('base64')}`;
const scene = wrapSvg(yardRasterDefs(yardImage) + '<use href="#yard-preview-map"/>' + body(yardLightSvg(3, 'ground')) + body(yardLaundrySvg(0)) + actor('lola', 203, 186) + actor('rae', 270, 252) + yardForegroundMarkup({ x: 270, y: 252 }) + body(yardLightSvg(3)));
await sharp(Buffer.from(scene)).resize(1280, 896, { kernel: 'nearest' }).png().toFile('artifacts/lolas-yard-art-preview.png');
await writeFile('artifacts/lolas-yard-art-preview.svg', scene);
const clearing = wrapSvg(clearingSceneArt(EMPTY_PROGRESS), 576, 448);
await sharp(Buffer.from(clearing)).resize(1152, 896, { kernel: 'nearest' }).png().toFile('artifacts/lantern-clearing-art-preview.png');
await writeFile('artifacts/lantern-clearing-art-preview.svg', clearing);
const grove = wrapSvg(groveSceneArt(EMPTY_PROGRESS, { x: 224, y: 324 }, 3, { companion: { x: 206, y: 334 } }), 480, 512);
await sharp(Buffer.from(grove)).resize(960, 1024, { kernel: 'nearest' }).png().toFile('artifacts/old-balete-grove-art-preview.png');
await writeFile('artifacts/old-balete-grove-art-preview.svg', grove);
for (const [name, p] of Object.entries({ initial: EMPTY_PROGRESS, diverted: { ...EMPTY_PROGRESS, branchMoved: true, flowDiverted: true }, restored: { ...EMPTY_PROGRESS, branchMoved: true, bellRecovered: true, waterRestored: true, bellReturned: true, bellHung: true, bellRung: true } })) {
  const works = wrapSvg(waterworksSceneArt(p), 704, 480);
  await sharp(Buffer.from(works)).resize(1408, 960, { kernel: 'nearest' }).png().toFile(`artifacts/rootwater-${name}-art-preview.png`);
  await writeFile(`artifacts/rootwater-${name}-art-preview.svg`, works);
  if (name === 'restored') {
    const repaired = wrapSvg(clearingSceneArt(p, { x: 382, y: 350 }), 576, 448);
    await sharp(Buffer.from(repaired)).resize(1152, 896, { kernel: 'nearest' }).png().toFile('artifacts/clearing-restored-art-preview.png');
  }
}
await sharp(Buffer.from(characterPortraitSvg('uban', 'wry'))).resize(400, 480, { kernel: 'nearest' }).png().toFile('artifacts/mang-uban-portrait.png');
const companions = wrapSvg('<rect width="92" height="34" fill="#e9ddbd"/>' + `<g transform="translate(7 8)">${duwendeSvg('tala')}</g><g transform="translate(31 8)">${duwendeSvg('tala', 'up')}</g><g transform="translate(62 8)">${duwendeSvg('minda')}</g>`, 92, 34);
await sharp(Buffer.from(companions)).resize(736, 272, { kernel: 'nearest' }).png().toFile('artifacts/tala-minda-preview.png');
const directions = ['down', 'right', 'up', 'left'] as const;
const sheet = wrapSvg('<rect width="104" height="40" fill="#e9ddbd"/>' + directions.map((d, i) => `<g transform="translate(${8 + i * 24} 6)">${raeSvg(d)}</g>`).join(''), 104, 40);
await sharp(Buffer.from(sheet)).resize(832, 320, { kernel: 'nearest' }).png().toFile('artifacts/rae-direction-preview.png');
const icon = wrapSvg('<rect width="256" height="256" fill="#294b3b"/><path d="M16 32V16h16m192 16V16h-16M16 224v16h16m192-16v16h-16" stroke="#c9b376" stroke-width="3" fill="none"/>' + `<g transform="translate(88 52) scale(5)">${raeSvg()}</g>` + '<path d="M102 202h52v3h-52z" fill="#c9b376"/>', 256, 256);
await sharp(Buffer.from(icon)).resize(1024, 1024, { kernel: 'nearest' }).png().toFile('assets/icon.png');
await sharp(Buffer.from(icon)).resize(64, 64, { kernel: 'nearest' }).png().toFile('assets/favicon.png');
console.log('Rendered all four maps, three waterworks states, the restored clearing, character sheets, app icon, and favicon.');
