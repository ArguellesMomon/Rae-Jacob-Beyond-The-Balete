import type { Point } from '../game/model.ts';
import { pixelPath as p, pixelRect as r, wrapSvg } from './pixelArt.ts';
import { pixelLettering } from './pixelLettering.ts';
import { landmarkGlyph } from './bambooArt.ts';

export const VERGE_ART = { width: 640, height: 480, imageWidth: 1280, imageHeight: 960 };
export const VERGE_DEPTH = [
  { id: 'crown', path: 'M0 0h640v45h-34v14h-38V41h-43v15h-39V43h-43v17h-36V45h-43v14h-39V44h-41v15h-42V47h-38v17h-43V49h-38v22H59V55H29v33H0z', foot: 106, left: 0, right: 640 },
  { id: 'westBamboo', path: 'M35 72h142v182H35z', foot: 254, left: 35, right: 177 },
  { id: 'upperBamboo', path: 'M190 60h104v145H190z', foot: 205, left: 190, right: 294 },
  { id: 'shelterRoof', path: 'M378 96h162v27H378z', foot: 174, left: 378, right: 540 },
  { id: 'westStump', path: 'M36 254h44v93H36z', foot: 347, left: 36, right: 80 },
  { id: 'eastBamboo', path: 'M546 304h57v111h-57z', foot: 415, left: 546, right: 603 },
  { id: 'southBamboo', path: 'M207 364h173v81H207z', foot: 445, left: 207, right: 380 },
  { id: 'near', path: 'M0 383h23v21h22v23h34v22h34v31H0z M483 480v-16h36v-20h39v-13h37v-27h22v-29h23v105z', foot: 500, left: 0, right: 640 },
] as const;
export function vergeDepthOpacity(id: string, player?: Point) {
  if (!player) return 1;
  if (id === 'near') return player.y > 410 && (player.x < 134 || player.x > 493) ? .4 : 1;
  const region = VERGE_DEPTH.find(region => region.id === id);
  if (!region || player.y >= region.foot) return 0;
  return player.x > region.left - 18 && player.x < region.right + 18 && player.y > region.foot - 70 ? .36 : 1;
}
export function vergeRasterDefs(uri: string, prefix = 'verge-preview') {
  return `<defs><image id="${prefix}-map" href="${uri}" width="640" height="480" preserveAspectRatio="none" image-rendering="pixelated"/>${VERGE_DEPTH.map(region => `<clipPath id="${prefix}-${region.id}"><path d="${region.path}"/></clipPath>`).join('')}</defs>`;
}
export function vergeForegroundMarkup(player?: Point, prefix = 'verge-preview') {
  return VERGE_DEPTH.map(region => `<use href="#${prefix}-map" clip-path="url(#${prefix}-${region.id})" opacity="${vergeDepthOpacity(region.id, player)}"/>`).join('');
}

let wayfinding = p('M497 162h106v16H497z', '#183329', .82);
wayfinding += r(498, 162, 104, 1, '#ddbd7c', .85) + r(498, 178, 104, 1, '#c5a868', .8);
wayfinding += pixelLettering('TURNING PATHS', 550, 165, '#f8e6b0', 2);
wayfinding += p('M540 234h15v-5l10 9-10 9v-5h-15z', '#192f28', .7) + p('M540 233h15v-5l10 9-10 9v-5h-15z', '#f0d69a');
wayfinding += r(531, 247, 45, 1, '#d9c28a', .7);
// Small sketches remain on the existing verse board; the readable verse is in dialogue.
for (const [index, glyph] of ['Split stone', 'Bent bamboo', 'Running water'].entries()) {
  wayfinding += `<g transform="translate(493 ${201 + index * 6}) scale(.38)">${landmarkGlyph(glyph as Parameters<typeof landmarkGlyph>[0], 0, 0)}</g>`;
}
export const VERGE_WAYFINDING_SVG = wrapSvg(wayfinding, 640, 480);

const cache = new Map<string, string>();
export function vergeWeatherSvg(clock: number, layer: 'ground' | 'air' = 'air') {
  const frame = ((Math.floor(clock * 4) % 240) + 240) % 240, time = frame / 4, key = `${layer}:${frame}`;
  const old = cache.get(key); if (old) return old;
  let s = '';
  if (layer === 'ground') {
    s += p('M498 37h12L398 300h-29z M539 24h6L464 264h-12z', '#f1e1a2', .022);
    for (const [index, [x, y]] of [[249, 340], [322, 300], [398, 266], [458, 249], [100, 402], [202, 343]].entries()) {
      const offset = Math.round(Math.sin(time * Math.PI / 30 + index) * 2);
      s += p(`M${x + offset} ${y}h9v2h7v3h-8v2h-10v-3h-4v-2h6z`, '#f9e7ae', .05);
    }
    for (const [index, [x, y]] of [[516, 390], [549, 434]].entries()) {
      const phase = (time * .65 + index * .4) % 1, radius = 2 + Math.floor(phase * 5), alpha = (1 - phase) * .38;
      s += p(`M${x - radius} ${y - 1}h2v-1h${radius * 2 - 4}v1h2v2h-2v1h-${radius * 2 - 4}v-1h-2z`, '#c8ddd0', alpha);
      s += r(x - 7 + Math.round(Math.sin(time + index) * 2), y + 3, 5, 1, '#d7e2cb', .25);
    }
  } else {
    // Small, sparse rain marks protect faces and essential direction labels.
    for (let i = 0; i < 28; i++) {
      const x = 52 + (i * 79 + Math.floor(time * 3)) % 538, y = 60 + (i * 47 + Math.floor(time * 22)) % 373;
      if ((x > 373 && x < 427 && y > 153 && y < 244) || (x > 490 && y > 153 && y < 181)) continue;
      s += p(`M${x} ${y}h1v2h1v2h-1v-2h-1z`, '#d1e5d0', .16);
    }
    for (let i = 0; i < 4; i++) {
      const x = Math.round(150 + i * 101 + Math.sin(time * Math.PI / 30 + i) * 13), y = 167 + Math.floor((time * 3 + i * 53) % 211);
      s += p(`M${x} ${y}h4v1h-1v1h-3z`, i % 2 ? '#b7ba74' : '#d6c48c', .48);
    }
    s += p('M156 373h53v-2h31v2h34v2h-60v2h-58z M402 344h48v-2h39v2h27v2h-53v2h-61z', '#b3d0ac', .028);
  }
  const result = wrapSvg(s, 640, 480);
  if (cache.size > 180) cache.clear(); cache.set(key, result); return result;
}
