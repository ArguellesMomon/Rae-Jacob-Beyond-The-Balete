import { SPRING_RILL } from '../game/springScene.ts';

export const SPRING_WET_BOUNDS = { x: 432, y: 202, width: 160, height: 72 };
export const SPRING_SEAL_BOUNDS = { x: 504, y: 205, width: 36, height: 44 };
export const rillPath = 'M' + SPRING_RILL.map(p => p.join(' ')).join('L');
const length = SPRING_RILL.slice(1).reduce((n, [x, y], i) => n + Math.hypot(x - SPRING_RILL[i][0], y - SPRING_RILL[i][1]), 0);
export function springWaterMaskSvg(reveal = 1) {
  const front = Math.min(1, Math.max(0, reveal));
  if (front === 0) return '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"/>';
  const widths = [3.5, 4, 4.5, 5, 5.5, 6.5, 6, 6.5, 6, 5.5, 4.5, 4];
  let travelled = 0, shapes = '';
  for (let i = 1; i < SPRING_RILL.length; i++) {
    const [ax, ay] = SPRING_RILL[i - 1], [bx, by] = SPRING_RILL[i], segment = Math.hypot(bx - ax, by - ay);
    const amount = Math.min(1, Math.max(0, (front * length - travelled) / segment));
    travelled += segment;
    if (amount <= 0) continue;
    const d = `M${ax} ${ay}L${ax + (bx - ax) * amount} ${ay + (by - ay) * amount}`, width = widths[i - 1];
    const path = (w: number, opacity: number) => `<path d="${d}" fill="none" stroke="white" stroke-width="${w}" stroke-linecap="round" opacity="${opacity}"/>`;
    shapes += path(width + 2.5, .18) + path(width + 1, .55) + path(width, 1);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">${shapes}</svg>`;
}
export function springWetMarkup(uri: string, reveal = 1, prefix = 'spring-surface') {
  const box = SPRING_WET_BOUNDS, mask = springWaterMaskSvg(reveal).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  return `<defs><mask id="${prefix}" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="480">${mask}</mask></defs><image href="${uri}" x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" preserveAspectRatio="none" mask="url(#${prefix})"/>`;
}
export function springSealMarkup(uri: string, reveal = 1) {
  const box = SPRING_SEAL_BOUNDS;
  return `<image href="${uri}" x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" preserveAspectRatio="none" opacity="${Math.min(1, Math.max(0, reveal))}"/>`;
}
