import { SPRING_RILL } from '../game/springScene.ts';
import type { Progress, RainlitMapId } from '../game/model.ts';
const r = (x: number, y: number, w: number, h: number, fill: string, opacity = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" opacity="${opacity}"/>`;
const p = (d: string, fill: string, opacity = 1) => `<path d="${d}" fill="${fill}" opacity="${opacity}"/>`;
const svg = (body: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480" shape-rendering="crispEdges">${body}</svg>`;
export const ONWARD_SIGN = svg('');
export const RAINLIT_DECOR: Record<RainlitMapId, string> = { rainroad: svg(''), hamlet: svg(''), spring: svg('') };

export function springWaterSvg(restored: boolean, frame: number, reveal = 1): string {
  // The banks and damp bed are raster terrain. Only shallow water and glints animate.
  const samples: { x: number; y: number; nx: number; ny: number }[] = [];
  for (let i = 1; i < SPRING_RILL.length; i++) {
    const [ax, ay] = SPRING_RILL[i - 1], [bx, by] = SPRING_RILL[i], length = Math.hypot(bx - ax, by - ay);
    for (let j = 0; j < length; j += 1.4) samples.push({ x: ax + (bx - ax) * j / length, y: ay + (by - ay) * j / length, nx: -(by - ay) / length, ny: (bx - ax) / length });
  }
  const front = Math.min(1, Math.max(0, reveal));
  let s = '';
  for (const [i, point] of samples.entries()) {
    if (!restored) {
      if (i < 8 && (i + frame) % 7 === 0) s += r(Math.round(point.x), Math.round(point.y), 1, 1, '#b1d6bd', .6);
      continue;
    }
    if (i / samples.length > front) continue;
    // Water body comes from the generated wet terrain; only broken glints move.
    if ((i + frame) % 13 === 0) s += r(Math.round(point.x), Math.round(point.y), 1.5 + i % 2, .7, i % 2 ? '#c4e2bf' : '#95c4af', .8);
    if (i % 9 === 0) s += r(Math.round(point.x + point.nx * 2), Math.round(point.y + point.ny * 2), 1, 1, '#385e4b', .35);
  }
  return svg(s);
}
export function springRepairSvg(progress: Progress, settling = 1): string {
  // Soft ground contact only. Moving objects are generated transparent PNG sprites.
  const q = progress.rainlit, amount = Math.min(1, Math.max(0, settling));
  const raised = q.rootBraced && (!q.restored || amount < .7);
  let s = '<ellipse cx="430" cy="274" rx="38" ry="2.3" fill="#263629" opacity="' + (raised ? .11 : .23) + '"/>';
  if (!q.basketFreed) s += '<ellipse cx="485" cy="273" rx="8" ry="1.7" fill="#35402a" opacity=".24"/>';
  return svg(s);
}
export function springSealSvg(reveal = 1, clock = 0): string {
  const amount = Math.min(1, Math.max(0, reveal));
  let s = '';
  // The seal itself is a generated bark inlay, not a screen-space dotted icon.
  if (amount > 0 && amount < 1) for (let i = 0; i < 5; i++) {
    const x = 511 + i * 5 % 21, y = 213 + (i * 7 + Math.floor(clock * 3)) % 27;
    s += r(x, y, .5, .8, '#e4ce94', .25 + amount * .15);
  }
  return svg(s);
}
export function rainlitWeatherSvg(map: RainlitMapId, frame: number, water = true): string {
  let s = '';
  for (let i = 0; i < 22; i++) {
    const x = (i * 47 + frame * 3) % 640, y = (i * 71 + frame * 11) % 480;
    s += r(x, y, 1, 3, '#d4ddb7', .18);
  }
  for (let i = 0; i < 11; i++) s += r(35 + (i * 83 + Math.floor(frame / 2)) % 570, 68 + (i * 47) % 310, 1, 1, '#f7d797', .36);
  if (water && map === 'spring') for (let i = 0; i < 12; i++) s += r(306 + (i * 19 + frame * 2) % 220, 95 + i * 8, 3 + i % 4, 1, '#d1e6b9', .3);
  return svg(s);
}
