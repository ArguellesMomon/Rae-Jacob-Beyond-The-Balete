import { bamboo, lash, lettering, plank } from './propMaterials.ts';
import type { Point, Progress } from '../game/model.ts';
import { pixelPath as p, pixelRect as r, wrapSvg } from './pixelArt.ts';

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
    for (const x of [461, 482]) s += bamboo(x, 266, 24, 'barrier-' + x, 4) + lash(x - 1, 273, 6);
    s += plank(461, 275, 25, 7, 'water-path-barrier', 'bamboo');
    for (const x of [463, 472, 481]) s += p(`M${x} 275h4l-3 6h-4z`, '#4b5343');
  }
  if (progress.bellHung) {
    // A tidy new cord replaces the painted snapped end, drawn over the detailed scene.
    s += p('M381 295h3v14h-3z', '#354738') + r(382, 295, 1, 10, '#e7ce98') + r(381, 299, 3, 1, '#b79a69');
  }
  if (progress.bellRung) s += lettering('BAMBOO CROSSING', 382.5, 297, 31, '#d1bd88', .36);
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

export function clearingRecoverySvg(progress: Progress, _clock: number) {
  if (!progress.bellRung) return wrapSvg('', 576, 448);
  // Shared leaf packets on the existing bench. People are depth-sorted in ClearingScene.
  let s = '';
  for (const x of [288, 298, 309, 320]) s += p(`M${x} 349h7v2h2v3h-9v-3z`, '#8c9e68') + r(x + 3, 350, 1, 4, '#dac98b');
  return wrapSvg(s, 576, 448);
}
