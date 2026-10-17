import type { Point, Progress } from '../game/model.ts';
import { pixelPath as p, pixelRect as r, wrapSvg } from './pixelArt.ts';
import { pixelLettering } from './pixelLettering.ts';

export const CLEARING_ART = { width: 576, height: 448, imageWidth: 1152, imageHeight: 896 };
export const CLEARING_LAMPS = [[80, 241], [130, 253], [181, 246], [232, 223], [282, 215], [332, 229], [386, 213], [92, 325], [262, 112], [447, 262]] as const;
export const CLEARING_DEPTH = [
  { id: 'rootRidge', path: 'M0 0H255V88h-24v16h-29v-9h-26v16h-33v10h-29v-10H88v19H61v29H32v24H0z' },
  { id: 'homeRoofs', path: 'M73 134v-9h10v-7h31v7h14v12H73z M147 115v-9h10v-7h33v7h14v12h-57z M218 150v-10h11v-7h28v6h16v13h-55z' },
  { id: 'leftRoots', path: 'M0 178h29v24h13v43h-8v37h-13v20H0z' },
  { id: 'rightCrown', path: 'M517 0h59v252h-15v-39h-14v-47h-10v-38h-20z' },
  { id: 'arch', path: 'M362 286h43v9h-43z M365 296h5v20h-5z M395 296h5v20h-5z' },
  { id: 'bridgeEdge', path: 'M164 308h52v3h-52z' },
  { id: 'foreground', path: 'M0 389h35v9h45v11h37v19h39v20H0z M332 448v-20h24v-14h37v-13h43v-11h36v-17h30v-14h22v-15h52v104z' },
] as const;

export function clearingDepthOpacity(id: string, player?: Point) {
  if (!player) return 1;
  if (id === 'arch') return player.y < 333 ? 1 : 0;
  if (id === 'bridgeEdge') return player.y < 312 ? 1 : 0;
  if (id === 'rootRidge' && player.y < 145) return .38;
  if (id === 'homeRoofs' && player.y < 163) return .38;
  if (id === 'leftRoots' && player.x < 69) return .38;
  if (id === 'rightCrown' && player.x > 507) return .38;
  if (id === 'foreground' && player.y > 380) return .48;
  return 1;
}
export function clearingRasterDefs(uri: string, prefix = 'clearing-preview') {
  return `<defs><image id="${prefix}-map" href="${uri}" width="576" height="448" preserveAspectRatio="none" image-rendering="pixelated"/>${CLEARING_DEPTH.map(region => `<clipPath id="${prefix}-${region.id}"><path d="${region.path}"/></clipPath>`).join('')}</defs>`;
}
export function clearingForegroundMarkup(player?: Point, prefix = 'clearing-preview') {
  return CLEARING_DEPTH.map(region => `<use href="#${prefix}-map" clip-path="url(#${prefix}-${region.id})" opacity="${clearingDepthOpacity(region.id, player)}"/>`).join('');
}

const stateCache = new Map<string, string>();
export function clearingStateSvg(progress: Progress) {
  const key = `${progress.waterRestored}:${progress.bellHung}:${progress.bellRung}`;
  const old = stateCache.get(key); if (old) return old;
  let s = '';
  if (!progress.waterRestored) {
    // The base depicts a clear bank. The closed barrier is an independent, removable object.
    s += p('M461 288h25l7 5h-25z', '#182f32', .42);
    for (const x of [461, 482]) {
      s += r(x, 266, 4, 24, '#604a30') + r(x, 266, 1, 23, '#b69a63') + r(x + 2, 267, 1, 21, '#877047');
      s += r(x - 1, 265, 6, 2, '#c4aa72') + r(x + 1, 270, 2, 1, '#e1c38b');
    }
    s += r(461, 275, 25, 6, '#d2ae67') + r(461, 280, 25, 2, '#745637');
    for (const x of [463, 472, 481]) s += p(`M${x} 275h4l-3 6h-4z`, '#4b5343');
    s += r(461, 274, 25, 1, '#f1d79a') + r(464, 277, 1, 1, '#f7e0a1') + r(482, 277, 1, 1, '#f7e0a1');
    // Closed wooden leaves cover the light until the waterkeeper's repair is complete.
    s += r(82, 135, 14, 18, '#543f2d');
    for (let i = 0; i < 6; i++) s += r(83 + i * 2, 136, 1, 16, i % 2 ? '#987044' : '#795836');
    s += r(82, 135, 14, 1, '#ba925c') + r(82, 152, 14, 1, '#342f28') + r(88, 136, 1, 16, '#3e3427');
    s += r(83, 140, 5, 1, '#c39a62') + r(89, 147, 6, 1, '#b58c56') + r(86, 143, 1, 2, '#dfbb7b');
  } else {
    s += r(111, 166, 3, 2, '#d4b98b') + r(116, 167, 3, 2, '#b08764');
  }
  if (progress.bellHung) {
    // A tidy new cord replaces the painted snapped end, drawn over the detailed scene.
    s += p('M381 295h3v14h-3z', '#354738') + r(382, 295, 1, 10, '#e7ce98') + r(381, 299, 3, 1, '#b79a69');
  }
  if (progress.bellRung) {
    s += r(365, 317, 36, 15, '#694c30') + r(365, 317, 36, 1, '#dbbb7e') + r(366, 318, 34, 13, '#b38c54');
    s += r(367, 319, 32, 10, '#c1a16a') + r(366, 330, 34, 1, '#473c2c');
    for (let i = 0; i < 16; i++) s += r(368 + i * 7 % 29, 319 + i * 3 % 11, 2 + i % 4, 1, i % 2 ? '#d2b77f' : '#a58250', .32);
    s += r(366, 319, 1, 1, '#ecd7a3') + r(399, 319, 1, 1, '#ecd7a3');
    s += pixelLettering('BAMBOO', 383, 319, '#354d3c') + pixelLettering('CROSSING', 383, 325, '#354d3c');
  }
  const result = wrapSvg(s, 576, 448); stateCache.set(key, result); return result;
}

const atmosphereCache = new Map<string, string>();
export function clearingLightSvg(progress: Progress, clock: number, layer: 'ground' | 'air' = 'air') {
  const frame = ((Math.floor(clock * 3) % 180) + 180) % 180, t = frame / 3;
  const key = `${frame}:${layer}:${progress.bellRung}:${progress.waterRestored}`;
  const old = atmosphereCache.get(key); if (old) return old;
  let s = '';
  if (layer === 'ground') {
    for (const [i, [x, y]] of CLEARING_LAMPS.entries()) {
      const pulse = progress.bellRung ? .055 : .028 + (Math.sin(t * Math.PI / 5 + i) + 1) * .009;
      s += p(`M${x - 12} ${y + 8}h24v3h7v5h-5v3h-28v-3h-5v-5h7z`, '#ffd58e', pulse);
      s += r(x - 5, y + 11, 10, 3, '#ffeab8', pulse * .7);
    }
    // Restrained water marks follow the real channel, including the saved Still preference.
    const speed = progress.waterRestored ? 9 : 18;
    for (let i = 0; i < 12; i++) {
      const x = 489 + i * 7 % 22, y = 178 + (i * 31 + Math.floor(t * speed)) % 203;
      s += r(x, y, 3 + i % 3, 1, i % 3 ? '#78b0c4' : '#e4d9b4', progress.waterRestored ? .33 : .48);
    }
    s += r(149 + frame % 4 * 2, 301, 7, 1, '#7bb2ba', .32) + r(224 - frame % 5, 303, 5, 1, '#9dc8c0', .3);
  } else {
    for (let i = 0; i < 14; i++) {
      const phase = t * Math.PI / 30 + i * 2.4;
      const x = Math.round(58 + i * 67 % 453 + Math.sin(phase) * 7), y = Math.round(129 + i * 43 % 253 + Math.cos(phase) * 5);
      const alpha = .25 + (Math.sin(phase * 2) + 1) * .22;
      s += r(x - 1, y - 1, 3, 3, '#f4d58b', alpha * .08) + r(x, y, 1, 1, '#fff0b2', alpha);
    }
    for (const [x, y] of CLEARING_LAMPS) s += r(x - 1, y - 1, 2, 2, '#ffe5a4', progress.bellRung ? .2 : .12);
    const drift = Math.round(Math.sin(t * Math.PI / 30) * 6);
    s += p(`M${17 + drift} 377h66v-2h54v3h58v2h-37v2H52v-2H17z`, '#9ab9b5', .025);
  }
  const result = wrapSvg(s, 576, 448);
  if (atmosphereCache.size > 240) atmosphereCache.clear(); atmosphereCache.set(key, result); return result;
}

export function clearingRecoverySvg(progress: Progress, clock: number) {
  if (!progress.waterRestored) return wrapSvg('', 576, 448);
  let s = '';
  if (progress.bellRung) {
    s += r(115, 169, 8, 4, '#a27d4b') + r(116, 168, 6, 1, '#e2be7f');
    // Existing background neighbor returns home with a basket during the quiet aftermath.
    const phase = (((Math.floor(clock * 3) / 3) % 18) + 18) % 18 / 18;
    if (phase < .42) {
      const t = phase / .42, x = Math.round(148 - t * 30), y = Math.round(183 - t * 13), bob = Math.floor(t * 18) % 2;
      s += r(x, y, 2, 2, '#71533a') + r(x + 4, y - bob, 2, 2, '#71533a');
      s += r(x - 1, y - 6, 8, 6, '#8b9d76') + r(x, y - 12, 6, 6, '#bd8b5e') + r(x - 1, y - 13, 8, 3, '#464d37');
      s += r(x + 1, y - 9, 1, 1, '#303c30') + r(x + 4, y - 9, 1, 1, '#303c30') + r(x - 3, y - 4, 6, 4, '#ba9a65');
    }
  }
  return wrapSvg(s, 576, 448);
}
