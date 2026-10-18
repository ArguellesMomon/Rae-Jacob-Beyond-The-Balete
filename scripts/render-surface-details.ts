import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { springWaterSurfaceMarkup, springSealSurfaceMarkup, springPuzzleMarkup } from './spring-puzzle-scene-art.ts';
import { springWaterSvg } from '../src/art/rainlitArt.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { waterworksSceneArt } from './waterworks-scene-art.ts';

// Render at display density before cropping, preserving detail in generated textures.
const wrap = (s: string, w: number, h: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w * 4}" height="${h * 4}" viewBox="0 0 ${w} ${h}">${s}</svg>`;
const body = (s: string) => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const spring = replayCheckpoint('springEnding').progress;
const map = (await readFile('assets/maps/quiet-spring-v2.png')).toString('base64');
const scene = `<image href="data:image/png;base64,${map}" width="640" height="480"/>` + springWaterSurfaceMarkup() + body(springWaterSvg(true, 4)) + springPuzzleMarkup(spring) + springSealSurfaceMarkup();
await sharp(Buffer.from(wrap(scene, 640, 480))).extract({ left: 426 * 4, top: 202 * 4, width: 170 * 4, height: 86 * 4 }).png().toFile('artifacts/spring-surface-final-review.png');
const works = replayCheckpoint('works').progress, tiles: { input: Buffer; left: number; top: number }[] = [];
for (const [i, flowDiverted] of [false, true].entries()) {
  const art = waterworksSceneArt({ ...works, branchMoved: flowDiverted, flowDiverted });
  const input = await sharp(Buffer.from(wrap(art, 704, 480))).extract({ left: 190 * 4, top: 146 * 4, width: 160 * 4, height: 143 * 4 }).png().toBuffer();
  tiles.push({ input, left: i * 640, top: 0 });
}
await sharp({ create: { width: 1280, height: 572, channels: 4, background: '#263f33' } }).composite(tiles).png().toFile('artifacts/works-props-final-review.png');
console.log('Rendered final spring surface and both lever/branch states at display density.');
