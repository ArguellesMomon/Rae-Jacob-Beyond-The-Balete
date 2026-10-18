import { springWetMarkup, springSealMarkup } from '../src/art/springSurfaceArt.ts';
import { readFile } from 'node:fs/promises';
import { springPuzzleItems, SPRING_PROP_FILES } from '../src/game/springScene.ts';
import { springRepairSvg } from '../src/art/rainlitArt.ts';
import type { Progress } from '../src/game/model.ts';

const textures = Object.fromEntries(await Promise.all(Object.entries(SPRING_PROP_FILES).map(async ([id, file]) => [id, `data:image/png;base64,${(await readFile('assets/props/' + file)).toString('base64')}`])));
export function springPuzzleMarkup(p: Progress, settling = 1) {
  return springRepairSvg(p, settling).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') + springPuzzleItems(p, settling).map(item => `<image href="${textures[item.id]}" x="${item.x}" y="${item.y}" width="${item.width}" height="${item.height}" ${item.transform ? `transform="${item.transform}"` : ''} preserveAspectRatio="none"/>`).join('');
}

const wetUri = 'data:image/png;base64,' + (await readFile('assets/props/spring-wet-bed-v1.png')).toString('base64');
const sealUri = 'data:image/png;base64,' + (await readFile('assets/props/spring-bark-seal-v1.png')).toString('base64');
export const springWaterSurfaceMarkup = (reveal = 1) => springWetMarkup(wetUri, reveal);
export const springSealSurfaceMarkup = (reveal = 1) => springSealMarkup(sealUri, reveal);
