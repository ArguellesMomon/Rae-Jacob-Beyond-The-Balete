import { lettering } from './propMaterials.ts';
import type { Point, Progress } from '../game/model.ts';
import { pixelPath as p, pixelRect as r, wrapSvg } from './pixelArt.ts';

export const WORKS_ART = { width: 704, height: 480, imageWidth: 1408, imageHeight: 960 };
export const WORKS_DEPTH = [
  { id: 'crown', path: 'M0 0h408v43h-26v-7h-54v15h-51V37h-44v19h-47V42h-37v26h-35V55H83v27H42v21H0z M456 0h248v109h-32V86h-37V61h-46V48h-53v11h-43V40h-37z' },
  { id: 'left', path: 'M0 95h31v42h17v39h-9v52h14v45H39v48H21v58H0z' },
  { id: 'right', path: 'M674 98h30v302h-23v-48h-17v-54h18v-62h-14v-71h6z' },
  { id: 'near', path: 'M0 404h30v17h30v18h29v19h30v22H0z M510 480v-14h38v-15h43v-19h40v-20h35v-28h38v96z' },
] as const;
export const WORKS_BRIDGE_LIP = 'M382 360h96v5h-96z M195 410h59v4h-59z';
export const WORKS_FLOW_BEDS = [
  { id: 'west-water', x: 209, y: 127, width: 30, height: 274, transform: `matrix(${30 / 38} 0 0 ${274 / 235} ${209 - 413 * 30 / 38} ${127 - 126 * 274 / 235})` },
  { id: 'east-dry', x: 413, y: 126, width: 38, height: 235, transform: `matrix(${38 / 30} 0 0 ${235 / 274} ${413 - 209 * 38 / 30} ${126 - 127 * 235 / 274})` },
] as const;
export function worksDepthOpacity(id: string, player?: Point) {
  if (!player) return 1;
  if (id === 'crown' && player.y < 110) return .35;
  if (id === 'left' && player.x < 66) return .4;
  if (id === 'right' && player.x > 649) return .4;
  if (id === 'near' && player.y > 405 && (player.x < 143 || player.x > 505)) return .4;
  return 1;
}
export function worksRasterDefs(uri: string, prefix = 'works-preview') {
  return `<defs><image id="${prefix}-map" href="${uri}" width="704" height="480" preserveAspectRatio="none" image-rendering="pixelated"/>${WORKS_DEPTH.map(region => `<clipPath id="${prefix}-${region.id}"><path d="${region.path}"/></clipPath>`).join('')}<clipPath id="${prefix}-bridge"><path d="${WORKS_BRIDGE_LIP}"/></clipPath>${WORKS_FLOW_BEDS.map(bed => `<clipPath id="${prefix}-${bed.id}"><rect x="${bed.x}" y="${bed.y}" width="${bed.width}" height="${bed.height}"/></clipPath>`).join('')}</defs>`;
}
export function worksFlowBedMarkup(progress: Progress, prefix = 'works-preview') {
  return progress.flowDiverted ? WORKS_FLOW_BEDS.map(bed => `<g clip-path="url(#${prefix}-${bed.id})"><use href="#${prefix}-map" transform="${bed.transform}"/></g>`).join('') : '';
}
export function worksForegroundMarkup(player?: Point, prefix = 'works-preview') {
  return WORKS_DEPTH.map(region => `<use href="#${prefix}-map" clip-path="url(#${prefix}-${region.id})" opacity="${worksDepthOpacity(region.id, player)}"/>`).join('');
}
export function worksBridgeMarkup(player: Point, prefix = 'works-preview') {
  return player.y < 366 || player.y > 392 ? `<use href="#${prefix}-map" clip-path="url(#${prefix}-bridge)"/>` : '';
}
export function worksShot(player: Point, { focusRoot = false, reveal = 1, retrieving, flowCenter }: { focusRoot?: boolean; reveal?: number; retrieving?: number; flowCenter?: Point } = {}) {
  const t = Math.max(0, Math.min(1, reveal / .75)), ease = t * t * (3 - 2 * t);
  return {
    x: focusRoot ? player.x + (586 - player.x) * ease : retrieving !== undefined ? 397 : flowCenter ? flowCenter.x : player.x,
    y: focusRoot ? player.y - 24 + (177 - player.y + 24) * ease : retrieving !== undefined ? 301 : flowCenter ? flowCenter.y : player.y - 24,
  };
}
export function worksPickupY(retrieving: number) {
  return retrieving < .5 ? 324 + retrieving * 40 : 344 - (retrieving - .5) * 105;
}

/** Mutable puzzle art stays independent from the generated environment. */
export function worksStateSvg(progress: Progress) {
  // Ink on the existing painted splitter board, rather than a second board.
  let s = p('M321 156h2v5h9v8h-2v-6h-7v3h-2v-3h-7v6h-2v-8h9z', '#447d76');
  s += lettering('W', 313, 171, 4, '#385b4c', .55) + lettering('E', 332, 171, 4, '#385b4c', .55);
  s += r(257, progress.flowDiverted ? 115 : 124, 4, 2, '#c49c64');
  // Generated lever and fallen branch are independent, depth-sorted sprites.
  if (!progress.waterRestored) {
    const fill = progress.flowDiverted ? '#3d686b' : '#2c6b80';
    s += p('M363 346h41v16h-19v7h-30v-14h8z M83 406h66v15H83z', fill, .68);
    for (let i = 0; i < 23; i++) {
      s += r(359 + i * 4 % 40, 351 + i * 3 % 10, 3, 1, '#a6c4b2', .4);
      s += r(85 + i * 7 % 59, 408 + i * 3 % 10, 2 + i % 3, 1, '#9cc6bb', .4);
    }
  }
  return wrapSvg(s, 704, 480);
}

const motionCache = new Map<string, string>();
export function worksMotionSvg(progress: Progress, clock: number, layer: 'water' | 'air' = 'air') {
  const frame = ((Math.floor(clock * 6) % 360) + 360) % 360, time = frame / 6;
  const key = `${layer}:${frame}:${progress.flowDiverted}:${progress.bellRecovered}:${progress.waterRestored}`;
  const cached = motionCache.get(key); if (cached) return cached;
  let s = '';
  if (layer === 'water') {
    const x = progress.flowDiverted ? 212 : 417, span = progress.flowDiverted ? 20 : 29;
    for (let i = 0; i < 23; i++) {
      const y = 130 + Math.floor((time * 23 + i * 31) % 224), px = x + i * 7 % (span - 7);
      s += p(`M${px} ${y}h5v1h3v1h-5v-1h-3z`, '#b2d9ce', .2 + i % 3 * .1);
    }
    for (let i = 0; i < 14; i++) {
      const px = 213 + Math.floor((time * 26 + i * 17) % 224);
      s += r(px, 106 + i * 7 % 15, 4 + i % 4, 1, '#a5d4c9', .32);
      s += r(px, 451 + i % 3 * 4, 5, 1, '#9cc7bd', .36);
    }
    for (let i = 0; i < 10; i++) s += r(418 + i * 9 % 28, 18 + Math.floor((time * 23 + i * 41) % 74), 4, 1, '#b3d6c6', .35);
    if (!progress.flowDiverted) for (let i = 0; i < 13; i++) {
      const phase = (time * 3 + i * .67) % 2, px = 415 + i * 7 % 31, y = 330 + Math.round(phase * 5);
      s += r(px, y, i % 2 ? 2 : 1, 1, '#d0e2c6', .65 * (1 - phase / 2));
    }
  } else {
    for (let i = 0; i < 12; i++) {
      const phase = time * Math.PI / 30 + i * 1.9, x = Math.round(64 + i * 67 % 590 + Math.sin(phase) * 4), y = Math.round(229 + i * 31 % 172 + Math.cos(phase) * 4);
      s += r(x, y, 1, 1, '#ece4b4', .23 + (Math.sin(phase * 2) + 1) * .16);
    }
    s += p('M44 430h49v-2h33v2h29v2h-54v2H44z M511 412h62v-2h36v2h37v2h-62v2h-73z', '#aaccc2', .035);
  }
  const result = wrapSvg(s, 704, 480);
  if (motionCache.size > 240) motionCache.clear(); motionCache.set(key, result); return result;
}

/** Open spokes show the real canal through the wheel. Fine timber grain uses the map's half-pixel grid. */
export function worksWheelSvg(angle: number) {
  const buckets = new Map<string, string>(), radians = angle * Math.PI / 180;
  for (let y = 1; y < 55; y += .5) for (let x = 1; x < 55; x += .5) {
    const dx = x - 28, dy = y - 28, distance = Math.hypot(dx, dy), theta = Math.atan2(dy, dx) - radians;
    const spoke = Math.abs(Math.sin(theta * 4)) * distance / 4 < 1.1;
    if (distance > 25.5 || (distance < 20.5 && !spoke && distance > 4)) continue;
    const grain = (Math.round(x * 2) * 7 + Math.round(y * 2) * 13) % 23;
    const edge = distance > 24.7 || (distance > 20.5 && distance < 21.2);
    const color = edge ? y < 28 ? '#b09a64' : '#384d3a' : grain < 5 ? '#4b4b31' : grain < 9 ? '#9f8750' : x + y < 56 ? '#8c7847' : '#655b38';
    buckets.set(color, (buckets.get(color) ?? '') + `M${x} ${y}h.5v.5h-.5z`);
  }
  let s = [...buckets].map(([color, pixels]) => p(pixels, color)).join('');
  for (let i = 0; i < 8; i++) {
    const t = radians + i * Math.PI / 4, x = Math.round(28 + Math.cos(t) * 23), y = Math.round(28 + Math.sin(t) * 23);
    s += r(x, y, 1.5, 1.5, '#364c3e') + r(x, y, .5, .5, '#a4b18a');
  }
  s += p('M25 24h6v1h1v6h-1v1h-6v-1h-1v-6h1z', '#415747') + r(26, 25, 3, 2, '#b7b58a');
  return wrapSvg(s, 56, 56);
}
export function worksWheelFrame(progress: Progress, clock: number, motion = true) {
  if (!motion || progress.flowDiverted) return 0;
  return progress.waterRestored ? Math.floor(clock * 9) % 16 : Math.floor(clock * 6) % 2;
}
