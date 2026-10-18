import { duwendeSpriteSvg } from './duwendeArt.ts';
import type { Celebrant } from '../game/celebration.ts';
const r = (x: number, y: number, w: number, h: number, fill: string, opacity = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" opacity="${opacity}"/>`;
const cache = new Map<string, string>();
export function celebrantSvg(n: Celebrant, clock: number, cheering: boolean, motion = true) {
  const phase = motion ? Math.floor(clock * 3 + n.x) % 2 : 0;
  const key = `${n.id}:${cheering}:${phase}`, cached = cache.get(key); if (cached) return cached;
  const dancing = cheering && n.activity === 'dance', bob = dancing ? phase : 0;
  const gesture = cheering && n.activity === 'clap' ? 'reach' : cheering && n.activity === 'dance' ? 'celebrate' : 'wave';
  const body = duwendeSpriteSvg(n.look, 'down', phase ? -3 : -4, gesture, cheering ? 'delighted' : 'warm');
  let s = r(2, 21, 14, 2, '#19372d', .3);
  s += `<g transform="translate(0 ${-bob})"><svg width="18" height="22.5" viewBox="0 0 32 40">${body.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</svg>`;
  if (n.activity === 'lantern') s += r(13, 9, 1, 7, '#dbb975') + r(11, 14, 5, 6, '#635039') + r(12, 15, 3, 4, '#f6d48e') + r(13, 16, 1, 2, '#fff1c0');
  // Clappers have a second pose with hands meeting in front; dancers lift both arms.
  if (cheering && n.activity === 'clap' && phase) s += r(5, 13, 4, 2, '#c9976c') + r(9, 13, 4, 2, '#ddb17b');
  s += '</g>';
  const result = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24" shape-rendering="crispEdges">${s}</svg>`;
  cache.set(key, result); return result;
}
