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

const label = (x: number, y: number, text: string, size = 5, color = '#eddfb2') => `<text x="${x}" y="${y}" text-anchor="middle" font-family="monospace" font-size="${size}" fill="${color}">${text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</text>`;
/** Mutable puzzle art stays independent from the generated environment. */
export function worksStateSvg(progress: Progress) {
  let s = '';
  // The lever, float and board remain legible even when their scenery is richly textured.
  s += r(306, 154, 32, 23, '#d8c393') + r(307, 155, 30, 1, '#f1dfb0') + r(307, 176, 30, 1, '#99835c');
  for (let i = 0; i < 23; i++) s += r(308 + i * 7 % 28, 156 + i * 5 % 19, 2, 1, i % 2 ? '#9b835b' : '#f7e5b9', .3);
  s += p('M321 156h3v5h10v9h-3v-6h-7v3h-3v-3h-7v6h-3v-9h10z', '#376d70');
  s += label(312, 175, 'W', 5, '#36534f') + label(332, 175, 'E', 5, '#36534f');
  s += r(316, 196, 10, 10, '#494c3b') + r(317, 196, 8, 3, '#bc9c60');
  s += p(progress.flowDiverted ? 'M320 198l-14-16h-5l17 20z' : 'M320 198l14-16h5l-17 20z', '#6e5133');
  s += p(progress.flowDiverted ? 'M319 197l-14-15h-3l17 18z' : 'M321 197l14-15h3l-17 18z', '#d0ac6c');
  s += r(progress.flowDiverted ? 299 : 332, 179, 9, 5, '#a75f3e') + r(progress.flowDiverted ? 300 : 333, 179, 7, 1, '#e0ac6b');
  s += r(254, 113, 7, 18, '#6f6547') + r(255, 114, 2, 16, '#ceb16e');
  for (const y of [115, 121, 127]) s += r(253, y, 10, 1, '#f0d79d');
  s += r(257, progress.flowDiverted ? 114 : 123, 6, 3, '#b86646');
  s += p(progress.flowDiverted ? 'M351 109h-10v4h10z' : 'M354 109h11v4h-11z', '#f0d28b');
  const bx = progress.branchMoved ? 255 : 198, by = progress.branchMoved ? 245 : 265;
  s += p(`M${bx} ${by + 2}h43v3h10v5h-26v4h-9v-5h-18z`, '#172c28', .7);
  s += p(`M${bx} ${by}h44v5h9v5h-26v4h-9v-7h-18z`, '#60462e') + r(bx + 3, by + 1, 38, 2, '#ae8350') + r(bx + 26, by - 6, 4, 8, '#84623a');
  for (let i = 0; i < 12; i++) s += r(bx + 3 + i * 3, by + 3 + i % 3, 2, 1, i % 2 ? '#c4a56a' : '#382d23');
  s += r(bx + 35, by + 1, 2, 6, '#4c6447') + r(bx + 19, by - 1, 4, 1, '#8c9c5b');
  if (!progress.waterRestored) {
    const fill = progress.flowDiverted ? '#3d686b' : '#2c6b80';
    s += p('M363 346h41v16h-19v7h-30v-14h8z M83 406h66v15H83z', fill, .68);
    for (let i = 0; i < 23; i++) {
      s += r(359 + i * 4 % 40, 351 + i * 3 % 10, 3, 1, '#a6c4b2', .4);
      s += r(85 + i * 7 % 59, 408 + i * 3 % 10, 2 + i % 3, 1, '#9cc6bb', .4);
    }
  }
  if (!progress.bellRung) {
    s += r(411, 366, 42, 22, '#b7c7b4', .2) + p('M416 370h13v3h-7v5h10v3h-16v-3h3v-5h-3z M439 370h8v11h-8z', '#d7dfc4', .75);
  } else {
    s += r(408, 352, 48, 10, '#513e2c') + r(409, 352, 46, 1, '#d2b17c');
    s += label(432, 356, 'BAMBOO', 3.4) + label(432, 360, 'CROSSING', 3.4);
  }
  for (const [x, y, text] of [[83, 312, 'GROVE <'], [117, 393, 'CLEARING'], [626, 271, 'BAMBOO >']] as const) {
    const w = text === 'BAMBOO >' ? 44 : 39;
    s += r(x - w / 2, y - 7, w, 9, '#795733') + r(x - w / 2 + 1, y - 7, w - 2, 1, '#d5ac70') + label(x, y - 1, text, 4.5);
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

/** Stepped timber rim and rasterized spokes keep the moving wheel on the native pixel grid. */
export function worksWheelSvg(angle: number) {
  let s = p('M17 0h22v3h9v5h4v9h4v22h-4v9h-5v4h-9v4H17v-4H8v-5H4v-8H0V17h4V8h5V4h8z', '#18342f');
  const buckets = new Map<string, string>();
  const radians = angle * Math.PI / 180;
  for (let y = 2; y < 54; y++) for (let x = 2; x < 54; x++) {
    const dx = x - 27.5, dy = y - 27.5, distance = Math.hypot(dx, dy), theta = Math.atan2(dy, dx) - radians;
    const spoke = Math.abs(Math.sin(theta * 4)) * distance / 4 < 2.2;
    if (distance > 25.5 || (distance < 19.5 && !spoke && distance > 6)) continue;
    const grain = (x * 7 + y * 3) % 17, edge = distance > 24 || (distance > 18.5 && distance < 20.5);
    const c = edge ? '#d2b178' : grain < 3 ? '#60442a' : grain < 6 ? '#a27a48' : y < 26 ? '#b89357' : '#8b663c';
    buckets.set(c, (buckets.get(c) ?? '') + `M${x} ${y}h1v1h-1z`);
  }
  s += [...buckets].map(([color, pixels]) => p(pixels, color)).join('');
  s += p('M23 21h10v2h2v10h-2v2H23v-2h-2V23h2z', '#d6b77b') + r(25, 25, 6, 6, '#50625a') + r(26, 26, 3, 2, '#9ca98b');
  return wrapSvg(s, 56, 56);
}
