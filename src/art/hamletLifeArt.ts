import { duwendeSpriteSvg } from './duwendeArt.ts';
import { hamletNeighbors } from '../game/hamletLife.ts';
import type { Progress } from '../game/model.ts';
const r = (x: number, y: number, w: number, h: number, color: string, opacity = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" opacity="${opacity}"/>`;
export function hamletLifeActors(p: Progress, clock: number, motion = true) {
  return hamletNeighbors(p).map(n => {
    const phase = motion ? Math.floor(clock * 2 + n.x) % 2 : 0;
    const gesture = n.task === 'wash' ? 'work' : n.task === 'cup' ? 'reach' : 'idle';
    const body = duwendeSpriteSvg(n.look, n.task === 'wash' ? 'left' : 'down', phase ? -3 : -4, gesture, 'warm');
    let s = `<ellipse cx="9" cy="23" rx="7" ry="1.6" fill="#19372d" opacity=".28"/><svg width="18" height="22.5" viewBox="0 0 32 40">${body.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</svg>`;
    if (n.task === 'cup') s += r(8, 12 - phase, 5, 4, '#d6cfaa') + r(9, 12 - phase, 3, 1, '#6baba7') + r(13, 13 - phase, 1, 2, '#b3bba5');
    if (n.task === 'wash') s += r(0, 18, 8, 4, '#795a3f') + r(1, 18, 6, 2, '#6ca7a5') + r(2 + phase, 17, 3, 2, '#d9cfaa');
    if (n.task === 'carry') s += r(2, 14, 4, 7, '#9d7951') + r(3, 15, 2, 1, '#c7af7a') + r(12, 14, 4, 7, '#9d7951') + r(13, 15, 2, 1, '#7eaaa2');
    return { ...n, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="25" viewBox="0 0 18 25" shape-rendering="crispEdges">${s}</svg>` };
  });
}
