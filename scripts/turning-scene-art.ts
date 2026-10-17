import { readFileSync } from 'node:fs';
import { turningRasterDefs, turningForegroundMarkup, turningWeatherSvg, TURNING_CLUE_BOARDS_SVG } from '../src/art/turningEnvironmentArt.ts';
import { turningStateSvg } from '../src/art/bambooArt.ts';
import { vergeActor, vergeBody } from './bamboo-verge-scene-art.ts';
import type { DialogueLine, Point, Progress } from '../src/game/model.ts';

const uri = `data:image/png;base64,${readFileSync('assets/maps/turning-paths-v2.png').toString('base64')}`;
export function turningSceneArt(progress: Progress, player: Point = { x: 320, y: 366 }, clock = 3, options: { companion?: Point; line?: DialogueLine; still?: boolean } = {}) {
  const companion = options.companion ?? { x: player.x - 18, y: player.y + 14 }, time = options.still ? 1 : clock;
  let s = turningRasterDefs(uri) + '<use href="#turning-preview-map"/>' + vergeBody(TURNING_CLUE_BOARDS_SVG) + vergeBody(turningWeatherSvg(time, 'ground')) + vergeBody(turningStateSvg(progress));
  s += [{ point: player, id: 'rae' as const }, { point: companion, id: 'tala' as const }].sort((a, b) => a.point.y - b.point.y).map(actor => vergeActor(actor.id, actor.point, clock, options.line)).join('');
  s += turningForegroundMarkup(player) + vergeBody(turningWeatherSvg(time));
  return s;
}
