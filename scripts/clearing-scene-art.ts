import { readFile } from 'node:fs/promises';
import { characterSpriteSvg } from '../src/art/characterArt.ts';
import { residentSpriteSvg } from '../src/art/worldDetails.ts';
import { clearingForegroundMarkup, clearingLightSvg, clearingRasterDefs, clearingRecoverySvg, clearingStateSvg } from '../src/art/clearingEnvironmentArt.ts';
import { BELL_SVG } from '../src/art/waterworksArt.ts';
import { RESIDENTS, residentsIn } from '../src/game/residents.ts';
import type { CharacterId, Direction, Point, Progress } from '../src/game/model.ts';
export const svgBody = (s: string) => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
export const clearingImageUri = `data:image/png;base64,${(await readFile('assets/maps/lantern-clearing-v2.png')).toString('base64')}`;
export function clearingActor(id: Exclude<CharacterId, 'uban' | 'bagtas'>, x: number, y: number, direction: Direction = 'down') {
  const small = id === 'tala' || id === 'minda', w = small ? 18 : 20, h = small ? 22 : 30;
  return `<rect x="${x - w / 2 + 2}" y="${y - 1}" width="${w - 4}" height="3" fill="#142e2b" opacity=".28"/><svg x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" viewBox="0 0 32 ${small ? 40 : 48}">${svgBody(characterSpriteSvg(id, direction, -1, id === 'tala' ? 'map' : 'idle'))}</svg>`;
}
export function clearingSceneArt(progress: Progress, player: Point = { x: 174, y: 313 }, clock = 3, companion: Point = { x: 188, y: 286 }) {
  const minda = progress.bellReturned ? { x: 411, y: 337 } : { x: 408, y: 227 };
  let s = clearingRasterDefs(clearingImageUri) + '<use href="#clearing-preview-map"/>' + svgBody(clearingStateSvg(progress));
  s += svgBody(clearingLightSvg(progress, clock, 'ground')) + svgBody(clearingRecoverySvg(progress, clock));
  if (progress.bellHung) s += `<svg x="375" y="302" width="15" height="16" viewBox="0 0 23 24">${svgBody(BELL_SVG)}</svg>`;
  const actors = [
    ...residentsIn('clearing').map(id => { const person = RESIDENTS[id]; return { y: person.y - 8, s: `<rect x="${person.x - 6}" y="${person.y - 9}" width="12" height="2" fill="#183b35" opacity=".35"/><svg x="${person.x - 9}" y="${person.y - 30}" width="18" height="22" viewBox="0 0 32 40">${svgBody(residentSpriteSvg(id, clock))}</svg>` }; }),
    { y: player.y, s: clearingActor('rae', player.x, player.y, 'up') },
    { y: companion.y, s: clearingActor('tala', companion.x, companion.y) },
    { y: minda.y, s: clearingActor('minda', minda.x, minda.y) },
  ].sort((a, b) => a.y - b.y);
  s += actors.map(a => a.s).join('') + clearingForegroundMarkup(player) + svgBody(clearingLightSvg(progress, clock));
  return s;
}
