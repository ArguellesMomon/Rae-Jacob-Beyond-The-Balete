import type { Point } from '../game/model.ts';
import { pixelPath as p, pixelRect as r, wrapSvg } from './pixelArt.ts';

export const TURNING_ART = { width: 640, height: 480, imageWidth: 1280, imageHeight: 960 };
export const TURNING_DEPTH = [
  { id: 'crown', path: 'M0 0h640v36h-44v7h-35V31h-57v11h-43V30h-48v13h-39V32h-46v10h-45V31h-40v12h-46V34h-45v14h-43V36H48v20H0z' },
  { id: 'leftEdge', path: 'M0 102h31v49h14v93H31v77H0z' },
  { id: 'rightEdge', path: 'M610 98h30v231h-23v-67h-13v-94h6z' },
  { id: 'innerWest', path: 'M211 173h58v98h-58z' },
  { id: 'innerEast', path: 'M378 219h48v54h-48z' },
  { id: 'near', path: 'M0 405h31v22h34v17h42v17h45v19H0z M487 480v-18h37v-20h42v-19h36v-26h38v83z' },
] as const;
export function turningDepthOpacity(id: string, player?: Point) {
  if (!player) return 1;
  if (id === 'crown') return player.y < 106 ? .35 : 1;
  if (id === 'innerWest') return player.y >= 276 ? 0 : player.x < 297 ? .38 : 1;
  if (id === 'innerEast') return player.y >= 278 ? 0 : player.x > 350 ? .38 : 1;
  return 1;
}
export function turningRasterDefs(uri: string, prefix = 'turning-preview') {
  return `<defs><image id="${prefix}-map" href="${uri}" width="640" height="480" preserveAspectRatio="none" image-rendering="pixelated"/>${TURNING_DEPTH.map(region => `<clipPath id="${prefix}-${region.id}"><path d="${region.path}"/></clipPath>`).join('')}</defs>`;
}
export function turningForegroundMarkup(player?: Point, prefix = 'turning-preview') {
  return TURNING_DEPTH.map(region => `<use href="#${prefix}-map" clip-path="url(#${prefix}-${region.id})" opacity="${turningDepthOpacity(region.id, player)}"/>`).join('');
}

export const TURNING_CLUE_BOARDS_SVG = wrapSvg('', 640, 480);

const cache = new Map<string, string>();
export function turningWeatherSvg(clock: number, layer: 'ground' | 'air' = 'air') {
  const frame = ((Math.floor(clock * 3) % 180) + 180) % 180, time = frame / 3, key = `${layer}:${frame}`;
  const old = cache.get(key); if (old) return old;
  let s = '';
  if (layer === 'ground') {
    s += p('M417 24h12L300 337h-26z M471 17h7L338 310h-13z', '#d2ddae', .025);
    for (const [index, [x, y]] of [[314, 159], [332, 231], [211, 295], [444, 300], [310, 371], [323, 420]].entries()) {
      const offset = Math.round(Math.sin(time * Math.PI / 30 + index) * 2);
      s += p(`M${x + offset} ${y}h9v2h6v3h-8v2h-9v-3h-4v-2h6z`, '#f0e1a6', .045);
    }
    for (const [index, [x, y]] of [[158, 173], [489, 173]].entries()) {
      const phase = (time * .55 + index * .3) % 1, radius = 2 + Math.floor(phase * 4);
      s += p(`M${x - radius} ${y}h2v-1h${radius * 2 - 4}v1h2v1h-2v1h-${radius * 2 - 4}v-1h-2z`, '#c0d9c9', (1 - phase) * .3);
    }
  } else {
    for (let i = 0; i < 20; i++) {
      const x = 63 + (i * 89 + Math.floor(time * 2)) % 519, y = 92 + (i * 61 + Math.floor(time * 17)) % 331;
      // Leave route labels and glyph panels clean.
      if ((x > 65 && x < 155 || x > 483 && x < 573) && y > 170 && y < 222) continue;
      s += r(x, y, 1, 3, '#d1dfcf', .13);
    }
    for (let i = 0; i < 3; i++) {
      const x = Math.round(301 + Math.sin(time * Math.PI / 30 + i * 2) * 9), y = 142 + Math.floor((time * 4 + i * 87) % 246);
      s += p(`M${x} ${y}h3v1h-1v1h-2z`, '#d2be82', .5);
    }
    s += p('M157 331h50v-2h28v2h33v2h-55v2h-56z M408 386h39v-2h35v2h28v2h-46v2h-56z', '#a9c4b5', .027);
  }
  const result = wrapSvg(s, 640, 480);
  if (cache.size > 180) cache.clear(); cache.set(key, result); return result;
}
