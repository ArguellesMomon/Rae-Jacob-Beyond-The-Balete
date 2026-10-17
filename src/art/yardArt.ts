import type { Point } from '../game/model.ts';
import { pixelPath as p, pixelRect as r, wrapSvg } from './pixelArt.ts';

export const YARD_ART = { width: 640, height: 448, imageWidth: 1280, imageHeight: 896 };
// These silhouettes redraw the SAME map pixels in front of the actors: no mismatched tree art.
export const YARD_DEPTH = [
  { id: 'roof', path: 'M59 109l27-43h204l31 43v6H59z' },
  { id: 'calamansi', path: 'M369 40h78v12h14v31h-13v14h-20v12h-38v-8h-19V82h-11V58h9z' },
  { id: 'balete', path: 'M477 0H640V80h-20v-7h-17v19h-22v-9h-21v13h-18V84h-23V70h-22V51h-20z' },
  { id: 'foreground', path: 'M0 405h30v-12h18v15h32v9h37v31H0z M497 448v-22h22v-13h30v-18h26v-16h19v-22h46v91z' },
] as const;
export function yardDepthOpacity(id: string, player?: Point) {
  if (!player) return 1;
  if (id === 'roof' && player.x > 48 && player.x < 332 && player.y < 118) return .38;
  if (id === 'calamansi' && player.x > 351 && player.x < 471 && player.y < 132) return .38;
  if (id === 'balete' && player.x > 463 && player.y < 122) return .38;
  return 1;
}
export function yardRasterDefs(dataUri: string, prefix = 'yard-preview') {
  return `<defs><image id="${prefix}-map" href="${dataUri}" width="640" height="448" preserveAspectRatio="none" image-rendering="pixelated"/>${YARD_DEPTH.map(region => `<clipPath id="${prefix}-${region.id}"><path d="${region.path}"/></clipPath>`).join('')}</defs>`;
}
export function yardForegroundMarkup(player?: Point, prefix = 'yard-preview') {
  return YARD_DEPTH.map(region => `<use href="#${prefix}-map" clip-path="url(#${prefix}-${region.id})" opacity="${yardDepthOpacity(region.id, player)}"/>`).join('');
}

const laundryFrames: string[] = [];
export function yardLaundrySvg(frame: number) {
  const step = ((Math.floor(frame) % 4) + 4) % 4;
  if (laundryFrames[step]) return laundryFrames[step];
  const sway = [0, 1, 0, -1][step], lift = step === 1 ? -1 : 0;
  const shirt = 'M369 216h9v4h5v12h-5v12h-15v-12h-5v-12h6v-4z';
  const blue = 'M399 216h12v5h5v8h-4v14h-16v-14h-4v-8h7z';
  let s = p('M361 244h18l17 12h-19z M397 243h16l15 11h-15z M431 245h16l12 9h-16z', '#684d32', .12);
  s += `<g transform="translate(${sway} ${lift})"><defs><clipPath id="yard-shirt"><path d="${shirt}"/></clipPath><clipPath id="yard-blue"><path d="${blue}"/></clipPath></defs>`;
  s += p(shirt, '#f3e6b6') + `<g clip-path="url(#yard-shirt)">`;
  s += r(363, 217, 3, 27, '#cbbd91') + r(366, 218, 2, 24, '#fff3cf') + r(375, 219, 3, 25, '#d3c69c');
  s += p('M369 216v4h7v-4z M361 228h3v2h-3z M366 241h10v2h-10z', '#b8ac83');
  for (let i = 0; i < 18; i++) s += r(361 + i * 7 % 20, 222 + i * 5 % 20, 1, 1, '#c4b588', .48);
  s += '</g>' + p(blue, '#839c99') + '<g clip-path="url(#yard-blue)">';
  s += r(396, 217, 3, 26, '#657f7c') + r(400, 219, 3, 24, '#acbab0') + r(409, 217, 4, 26, '#718b88');
  s += p('M401 216v4h7v-4z M399 240h10v2h-10z', '#526d69') + r(404, 224, 4, 1, '#c6c9b2') + '</g>';
  s += r(430, 216, 17, 29, '#bc9779') + r(431, 217, 3, 27, '#dcc3a0') + r(443, 217, 3, 27, '#8d715d');
  for (let i = 0; i < 6; i++) s += r(434, 219 + i * 4, 9, 1, '#dfc8a9', .6);
  s += r(436, 217, 2, 28, '#a8856b') + r(441, 216, 1, 29, '#ead5b1');
  s += r(365, 215, 2, 4, '#9b7348') + r(399, 215, 2, 4, '#9b7348') + r(433, 215, 2, 4, '#9b7348') + '</g>';
  laundryFrames[step] = wrapSvg(s); return laundryFrames[step];
}

const lightFrames = new Map<string, string>();
export function yardLightSvg(clock: number, layer: 'ground' | 'air' = 'air') {
  // Three updates/second, a bounded minute-long loop, and an exact Still frame.
  const frame = ((Math.floor(clock * 3) % 180) + 180) % 180, key = `${layer}:${frame}`;
  const old = lightFrames.get(key); if (old) return old;
  const t = frame / 3;
  let s = '';
  if (layer === 'ground') {
    const drift = Math.round(Math.sin(t * Math.PI / 30) * 2);
    for (const [x, y] of [[143, 229], [174, 246], [216, 298], [242, 321], [286, 284], [305, 341], [448, 279], [482, 302], [517, 256]]) {
      s += p(`M${x + drift} ${y}h10v3h6v4h-9v2h-10v-4h-5v-3h8z`, '#596a44', .055);
      s += r(x + drift + 11, y - 2, 5, 2, '#fff1bb', .09);
    }
    // Small highlights connect the basin to the surrounding afternoon light.
    const glint = frame % 4;
    s += r(108 + glint * 3, 311, 9, 1, '#def1db', .36) + r(120 - glint, 314, 6, 1, '#c4e4da', .25);
  } else {
    for (let i = 0; i < 12; i++) {
      const phase = t * Math.PI / 30 + i * 2.4;
      const x = Math.round(130 + i * 29 + Math.sin(phase) * 13), y = Math.round(193 + i * 31 % 142 + Math.cos(phase) * 6);
      s += r(x, y, 1, 1, '#fff0bd', .15 + (Math.sin(phase) + 1) * .09);
    }
    for (let i = 0; i < 2; i++) {
      const phase = t * Math.PI / 15 + i * 3, x = Math.round(95 + i * 363 + Math.sin(phase) * 18), y = Math.round(337 - i * 180 + Math.cos(phase) * 8);
      s += r(x - 1, y, 2, 3, '#4c6248');
      s += p(frame % 2 ? `M${x - 1} ${y}h-3v-2h-2v4h2v2h3z M${x + 1} ${y}h3v-2h2v4h-2v2h-3z` : `M${x - 2} ${y - 2}h2v5h-2z M${x + 1} ${y - 2}h2v5h-2z`, i ? '#e3be72' : '#e7d6b0');
    }
  }
  const svg = wrapSvg(s); lightFrames.set(key, svg); return svg;
}
