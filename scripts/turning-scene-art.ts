import { WORLD_PROPS, PROP_MOTION } from '../src/art/worldPropArt.ts';
import { readFileSync } from 'node:fs';
import { turningGlamourSvg, turningRasterDefs, turningForegroundMarkup, turningWeatherSvg, TURNING_CLUE_BOARDS_SVG } from '../src/art/turningEnvironmentArt.ts';
import { turningStateSvg } from '../src/art/bambooArt.ts';
import { vergeActor, vergeBody } from './bamboo-verge-scene-art.ts';
import { companionSpawn } from '../src/game/engine.ts';
import type { DialogueLine, Point, Progress } from '../src/game/model.ts';

const uri = `data:image/png;base64,${readFileSync('assets/maps/turning-paths-v3.png').toString('base64')}`;
export function turningSceneArt(progress: Progress, player: Point = { x: 320, y: 400 }, clock = 3, options: { companion?: Point; line?: DialogueLine; still?: boolean } = {}) {
  const companion = options.companion ?? companionSpawn({ ...player, facing: 'up', moving: false, stride: 0 }, 'turning', progress), time = options.still ? 1 : clock;
  let s = turningRasterDefs(uri) + '<use href="#turning-preview-map"/>' + vergeBody(WORLD_PROPS.turning) + vergeBody(PROP_MOTION.turning[2]) + vergeBody(TURNING_CLUE_BOARDS_SVG) + vergeBody(turningWeatherSvg(time, 'ground')) + vergeBody(turningStateSvg(progress)) + vergeBody(turningGlamourSvg(progress.chapterTwo.trailStep, clock, progress.chapterTwo.glamourBroken, !options.still));
  s += [{ point: player, id: 'rae' as const }, { point: companion, id: 'tala' as const }].sort((a, b) => a.point.y - b.point.y).map(actor => vergeActor(actor.id, actor.point, clock, options.line)).join('');
  s += turningForegroundMarkup(player) + vergeBody(turningWeatherSvg(time));
  return s;
}
