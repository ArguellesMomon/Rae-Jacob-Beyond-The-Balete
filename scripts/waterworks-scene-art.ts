import { readFileSync } from 'node:fs';
import { worksRasterDefs, worksFlowBedMarkup, worksForegroundMarkup, worksBridgeMarkup, worksMotionSvg, worksPickupY, worksStateSvg, worksWheelSvg } from '../src/art/waterworksEnvironmentArt.ts';
import { BELL_SVG } from '../src/art/waterworksArt.ts';
import { flowSurgeSvg } from '../src/art/flowArt.ts';
import { flowPresentation } from '../src/game/flowFeedback.ts';
import { characterSpriteSvg } from '../src/art/characterArt.ts';
import { residentSpriteSvg } from '../src/art/worldDetails.ts';
import { RESIDENTS } from '../src/game/residents.ts';
import type { Point, Progress } from '../src/game/model.ts';

const uri = `data:image/png;base64,${readFileSync('assets/maps/rootwater-works-v2.png').toString('base64')}`;
export const worksBody = (svg: string) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
export function worksActor(id: 'rae' | 'tala', point: Point, pose: 'idle' | 'reach' | 'pull' = 'idle') {
  const w = id === 'rae' ? 20 : 18, h = id === 'rae' ? 30 : 22;
  return `<ellipse cx="${point.x}" cy="${point.y - 1}" rx="${w / 2 - 2}" ry="2" fill="#172b26" opacity=".42"/><svg x="${point.x - w / 2}" y="${point.y - h}" width="${w}" height="${h}" viewBox="0 0 32 ${id === 'rae' ? 48 : 40}">${worksBody(characterSpriteSvg(id, 'up', -1, pose))}</svg>`;
}
const wheels = Array.from({ length: 16 }, (_, index) => worksWheelSvg(index * 22.5));
export function waterworksSceneArt(progress: Progress, player: Point = { x: 366, y: 330 }, clock = 3, options: { companion?: Point; retrieving?: number; focusRoot?: boolean; flow?: ReturnType<typeof flowPresentation>; still?: boolean } = {}) {
  const companion = options.companion ?? { x: player.x - 22, y: player.y + 14 }, envClock = options.still ? 1 : clock;
  const wheelFrame = progress.flowDiverted ? 0 : progress.waterRestored ? Math.floor(clock * 9) % 16 : Math.sin(clock * 6) > 0 ? 0 : 1;
  let s = worksRasterDefs(uri) + '<use href="#works-preview-map"/>' + worksFlowBedMarkup(progress) + worksBody(worksStateSvg(progress)) + worksBody(worksMotionSvg(progress, envClock, 'water'));
  if (options.flow?.active) s += worksBody(flowSurgeSvg(options.flow));
  s += `<g transform="translate(406 278)">${worksBody(wheels[wheelFrame])}</g>`;
  if (!progress.bellRecovered && options.retrieving === undefined) s += `<svg x="420" y="${321 + (!progress.flowDiverted ? Math.round(Math.sin(clock * 6) * 2) : 0)}" width="15" height="16" viewBox="0 0 23 24">${worksBody(BELL_SVG)}</svg>`;
  if (!progress.bellRecovered && !progress.flowDiverted && clock % 6 < 1.3) s += '<rect x="362" y="255" width="41" height="11" fill="#d8d1ab"/><text x="382" y="262.5" text-anchor="middle" font-size="5" fill="#445f56">CLANG...</text>';
  const pilo = RESIDENTS.pilo;
  const actors = [
    { y: player.y, art: worksActor('rae', player, options.retrieving === undefined ? 'idle' : options.retrieving < .5 ? 'reach' : 'pull') },
    { y: companion.y, art: worksActor('tala', companion) },
    { y: pilo.y, art: `<svg x="${pilo.x - 9}" y="${pilo.y - 30}" width="18" height="22" viewBox="0 0 32 40">${worksBody(residentSpriteSvg('pilo', clock))}</svg>` },
  ];
  s += actors.sort((a, b) => a.y - b.y).map(actor => actor.art).join('');
  if (options.retrieving !== undefined) {
    const pickup = worksPickupY(options.retrieving);
    s += `<path d="M${player.x + 5} ${player.y - 12}L427 ${pickup}M424 ${pickup}h7v5h-7z" fill="none" stroke="#e9d9a9" stroke-width="1"/><svg x="420" y="${pickup + 2}" width="16" height="17" viewBox="0 0 23 24">${worksBody(BELL_SVG)}</svg>`;
  }
  s += worksForegroundMarkup(player) + worksBridgeMarkup(player) + worksBody(worksMotionSvg(progress, envClock));
  if (options.focusRoot) s += '<rect x="575" y="153" width="24" height="34" fill="#e4ebd5" opacity=".06"/><path d="M568 162h-4v17h4M605 162h4v17h-4" fill="none" stroke="#c0d5bf" stroke-width="1" opacity=".3"/>';
  return s;
}
