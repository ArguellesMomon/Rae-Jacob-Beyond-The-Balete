import type { Point, Progress } from '../game/model.ts';
import { pixelPath as p, pixelRect as r, wrapSvg } from './pixelArt.ts';

export const GROVE_ART = { width: 480, height: 512, imageWidth: 960, imageHeight: 1024 };
export const GROVE_PERCH_EDGE = 'M154 209h172v5h-172z';
export const GROVE_DEPTH = [
  { id: 'crown', path: 'M0 0h480v73h-36v15h-51V74h-57v13h-35V71h-30v17h-57V76h-45v17h-35V79H98v19H66V80H31v23H0z' },
  { id: 'leftBoughs', path: 'M0 78h35v26h21v32h15v42H56v28H37v39H0z' },
  { id: 'rightBoughs', path: 'M422 69h58v188h-22v-32h-22v-43h-14v-42h-10v-35h10z' },
  { id: 'foreground', path: 'M0 368h25v29h24v32h27v28h31v29h40v26H0z M332 512v-22h24v-20h34v-24h29v-29h28v-32h33v127z' },
] as const;

export function groveDepthOpacity(id: string, player?: Point) {
  if (!player) return 1;
  if (id === 'crown' && player.y < 121) return .38;
  if (id === 'leftBoughs' && player.x < 88 && player.y < 276) return .38;
  if (id === 'rightBoughs' && player.x > 397 && player.y < 284) return .38;
  if (id === 'foreground' && player.y > 402 && (player.x < 130 || player.x > 341)) return .45;
  return 1;
}
export function groveRasterDefs(uri: string, prefix = 'grove-preview') {
  return `<defs><image id="${prefix}-map" href="${uri}" width="480" height="512" preserveAspectRatio="none" image-rendering="pixelated"/>${GROVE_DEPTH.map(region => `<clipPath id="${prefix}-${region.id}"><path d="${region.path}"/></clipPath>`).join('')}<clipPath id="${prefix}-perch"><path d="${GROVE_PERCH_EDGE}"/></clipPath></defs>`;
}
export function groveForegroundMarkup(player?: Point, prefix = 'grove-preview') {
  return GROVE_DEPTH.map(region => `<use href="#${prefix}-map" clip-path="url(#${prefix}-${region.id})" opacity="${groveDepthOpacity(region.id, player)}"/>`).join('');
}
export function grovePerchMarkup(prefix = 'grove-preview') {
  return `<use href="#${prefix}-map" clip-path="url(#${prefix}-perch)"/>`;
}
export function groveBaseMarkup(prefix = 'grove-preview') {
  // Decorative forest beyond the map fills wide cinematic views; it has no collision or actors.
  return `<rect x="-240" y="-256" width="960" height="1024" fill="#142d36"/><use href="#${prefix}-map" transform="translate(-240 -256) scale(2)" opacity=".45"/><use href="#${prefix}-map"/>`;
}
export function groveSeedPosition(player: Point, progress: number) {
  const t = Math.max(0, Math.min(1, progress)), ease = t * t * (3 - 2 * t);
  return { x: 270 + (player.x + 7 - 270) * ease, y: 210 + (player.y - 20 - 210) * ease };
}

/** Shared by the live camera and source-art review, including narrow/wide screens. */
export function groveShot(player: Point, width: number, height: number, { overview = false, giftScene = false, focusMang = false, reveal = 1 } = {}) {
  const t = Math.max(0, Math.min(1, reveal / .7)), ease = t * t * (3 - 2 * t);
  const center = {
    x: overview ? 240 : giftScene ? (player.x + 238) / 2 : focusMang ? player.x + (238 - player.x) * ease : player.x,
    y: overview ? 190 : giftScene ? (player.y + 128) / 2 : focusMang ? player.y - 24 + (164 - (player.y - 24)) * ease : player.y - 24,
  };
  // The gift needs vertical room for a seated giant and a child; the forest backdrop fills its sides.
  const view = giftScene ? { width: 440, height: 240 } : overview ? { width: Math.min(480, 512 * width / height), height: Math.min(512, 480 * height / width) } : undefined;
  return { center, view, cinematic: focusMang };
}

const frames = new Map<string, string>();
export function groveLightSvg(progress: Progress, clock: number, layer: 'ground' | 'air' = 'air') {
  const frame = ((Math.floor(clock * 3) % 180) + 180) % 180, time = frame / 3;
  const quiet = progress.flowDiverted || progress.bellRecovered, key = `${layer}:${frame}:${quiet}`;
  const old = frames.get(key); if (old) return old;
  let s = '';
  if (layer === 'ground') {
    s += p('M332 106h13L216 401h-24z M356 99h7L251 380h-11z', '#b2d1d0', .024);
    for (const [i, [x, y]] of [[174, 348], [217, 366], [250, 337], [281, 384], [318, 369], [196, 427]].entries()) {
      const drift = Math.round(Math.sin(time * Math.PI / 30 + i) * 2);
      s += p(`M${x + drift} ${y}h13v2h6v4h-9v2h-14v-4h-4v-2h8z`, '#b3c7a4', .035);
    }
    for (const [x, y] of [[204, 455], [400, 350]]) {
      s += p(`M${x - 10} ${y}h21v3h8v5h-6v3h-25v-3h-5v-5h7z`, '#edc67b', .055);
    }
  } else {
    // Cigar tip is local (93,55) + the giant's (182,108) scene anchor.
    // Large slow curls drift away from his face; Still freezes this entire layer.
    s += r(273, 160, 7, 7, '#e3ad66', .045 + (Math.sin(time * 2) + 1) * .015);
    for (let i = 0; i < 5; i++) {
      const rise = (time * 5 + i * 11) % 55, dx = Math.round(Math.sin(time * .6 + i) * (2 + rise / 9)), y = 160 - Math.floor(rise);
      const x = 274 + Math.floor(rise / 6) + dx, alpha = (1 - rise / 55) * .23;
      s += p(`M${x} ${y}h4v-3h6v3h4v5h-4v3h-7v-3h-3z`, '#bac4ac', alpha);
      s += p(`M${x + 3} ${y - 2}h4v2h-2v4h-3v-2h1z`, '#ded8b8', alpha * .45);
    }
    for (let i = 0; i < 10; i++) {
      const phase = time * Math.PI / 30 + i * 2.3, x = Math.round(74 + i * 41 % 333 + Math.sin(phase) * 5), y = Math.round(280 + i * 31 % 178 + Math.cos(phase) * 4);
      const alpha = .24 + (Math.sin(phase * 2) + 1) * .18;
      s += r(x - 1, y - 1, 3, 3, '#d0d9a5', alpha * .07) + r(x, y, 1, 1, '#e7e1ad', alpha);
    }
    const drift = Math.round(Math.sin(time * Math.PI / 30) * 6);
    s += p(`M${17 + drift} 432h60v-2h45v2h29v2h-37v2H37v-2H17z`, '#adc6c2', .025);
    if (!quiet) {
      const shaking = time % 10 < .7, dx = shaking ? frame % 2 : 0;
      s += r(261 + dx, 280, 2, 1, '#e1c798', shaking ? .7 : .18) + r(278 - dx, 283, 2, 1, '#d8bd8a', shaking ? .65 : .15) + r(267 + dx, 288, 3, 1, '#e3cf9d', shaking ? .6 : .12);
      s += p('M343 310v8h1v-8z M347 307v14h1v-14z', '#d6d8ae', .22 + Math.sin(time * Math.PI / 5) * .1);
    }
  }
  const result = wrapSvg(s, 480, 512);
  if (frames.size > 240) frames.clear(); frames.set(key, result); return result;
}
