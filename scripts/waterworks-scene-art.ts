import { worksPropMarkup } from '../src/art/worksPropArt.ts';
import { WORKS_PROP_FILES, worksPuzzleItems } from '../src/game/worksProps.ts';
import { WORLD_PROPS, PROP_MOTION } from '../src/art/worldPropArt.ts';
import { readFileSync } from 'node:fs';
import { worksRasterDefs, worksFlowBedMarkup, worksForegroundMarkup, worksBridgeMarkup, worksMotionSvg, worksPickupY, worksStateSvg, worksWheelSvg, worksWheelFrame } from '../src/art/waterworksEnvironmentArt.ts';
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
const propUris = Object.fromEntries(Object.entries(WORKS_PROP_FILES).map(([id, file]) => [id, 'data:image/png;base64,' + readFileSync('assets/props/' + file).toString('base64')]));
const wheels = Array.from({ length: 16 }, (_, index) => worksWheelSvg(index * 22.5));
export function waterworksSceneArt(progress: Progress, player: Point = { x: 366, y: 330 }, clock = 3, options: { companion?: Point; retrieving?: number; focusRoot?: boolean; flow?: ReturnType<typeof flowPresentation>; still?: boolean } = {}) {
  const companion = options.companion ?? { x: player.x - 22, y: player.y + 14 }, envClock = options.still ? 1 : clock;
  let s = worksRasterDefs(uri) + '<use href="#works-preview-map"/>' + worksBody(WORLD_PROPS.waterworks) + worksBody(PROP_MOTION.waterworks[2]) + worksFlowBedMarkup(progress) + worksBody(worksStateSvg(progress)) + worksBody(worksMotionSvg(progress, envClock, 'water'));
  if (options.flow?.active) s += worksBody(flowSurgeSvg(options.flow));
  s += `<g transform="translate(406 278)">${worksBody(wheels[worksWheelFrame(progress, clock, !options.still)])}</g>`;
  if (!progress.bellRecovered && options.retrieving === undefined) s += `<svg x="420" y="${321 + (!progress.flowDiverted ? Math.round(Math.sin(clock * 6) * 2) : 0)}" width="15" height="16" viewBox="0 0 23 24">${worksBody(BELL_SVG)}</svg>`;
  const pilo = RESIDENTS.pilo;
  const actors = [
    ...worksPuzzleItems(progress, options.flow?.active ? { age: options.flow.age, motion: !options.still } : undefined).map(item => ({ y: item.depth, art: worksPropMarkup(item, propUris[item.id]) })),
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
  return s;
}
