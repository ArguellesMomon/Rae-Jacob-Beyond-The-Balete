import { WORLD_PROPS, PROP_MOTION } from '../src/art/worldPropArt.ts';
import { readFile } from 'node:fs/promises';
import { groveBaseMarkup, groveForegroundMarkup, groveLightSvg, grovePerchMarkup, groveRasterDefs, groveSeedPosition } from '../src/art/groveEnvironmentArt.ts';
import { mangUbanSvg } from '../src/art/groveArt.ts';
import { characterSpriteSvg } from '../src/art/characterArt.ts';
import { LISTENING_SEED_SVG, residentSpriteSvg } from '../src/art/worldDetails.ts';
import type { DialogueLine, Point, Progress } from '../src/game/model.ts';
export const groveSvgBody = (s: string) => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
export const groveImageUri = `data:image/png;base64,${(await readFile('assets/maps/old-balete-grove-v2.png')).toString('base64')}`;
export function groveActor(id: 'rae' | 'tala', x: number, y: number) {
  const w = id === 'rae' ? 20 : 18, h = id === 'rae' ? 30 : 22;
  return `<rect x="${x - w / 2 + 2}" y="${y - 1}" width="${w - 4}" height="3" fill="#142e2b" opacity=".28"/><svg x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" viewBox="0 0 32 ${id === 'rae' ? 48 : 40}">${groveSvgBody(characterSpriteSvg(id, 'up', -1, id === 'tala' ? 'map' : 'idle'))}</svg>`;
}
export function groveSceneArt(progress: Progress, player: Point = { x: 232, y: 302 }, clock = 3, { companion = { x: 211, y: 320 }, line, seedProgress = 1 }: { companion?: Point; line?: DialogueLine; seedProgress?: number } = {}) {
  const speaking = line?.speaker === 'Mang Uban';
  let s = groveRasterDefs(groveImageUri) + groveBaseMarkup() + groveSvgBody(WORLD_PROPS.grove) + groveSvgBody(PROP_MOTION.grove[2]) + groveSvgBody(groveLightSvg(progress, clock, 'ground'));
  s += `<g transform="translate(182 108)">${groveSvgBody(mangUbanSvg(clock % 6.2 < .18, false, { emotion: speaking ? line?.emotion : 'neutral', mouth: speaking && Math.floor(clock * 4) % 3 === 0 ? 1 : 0, hand: speaking && Math.floor(clock * 1.2) % 2 ? -2 : 0 }))}</g>`;
  s += grovePerchMarkup();
  const actors = [
    { y: 301, s: `<rect x="126" y="300" width="12" height="2" fill="#183b35" opacity=".35"/><svg x="123" y="279" width="18" height="22" viewBox="0 0 32 40">${groveSvgBody(residentSpriteSvg('doro', clock, line?.speaker === 'Doro'))}</svg>` },
    { y: player.y, s: groveActor('rae', player.x, player.y) },
    { y: companion.y, s: groveActor('tala', companion.x, companion.y) },
  ].sort((a, b) => a.y - b.y);
  s += actors.map(actor => actor.s).join('');
  if (line?.prop === 'seed') {
    const point = groveSeedPosition(player, line.speaker === 'Mang Uban' ? seedProgress : 1);
    s += `<rect x="${Math.round(point.x) - 2}" y="${Math.round(point.y) - 2}" width="16" height="15" fill="#e5dfaa" opacity=".12"/><svg x="${Math.round(point.x)}" y="${Math.round(point.y)}" width="12" height="11" viewBox="0 0 24 22">${groveSvgBody(LISTENING_SEED_SVG)}</svg>`;
  }
  s += groveForegroundMarkup(player) + groveSvgBody(groveLightSvg(progress, clock));
  return s;
}
