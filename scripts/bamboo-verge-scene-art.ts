import { WORLD_PROPS, PROP_MOTION } from '../src/art/worldPropArt.ts';
import { readFileSync } from 'node:fs';
import { VERGE_WAYFINDING_SVG, vergeRasterDefs, vergeForegroundMarkup, vergeWeatherSvg } from '../src/art/bambooEnvironmentArt.ts';
import { bagtasSpriteSvg } from '../src/art/bagtasArt.ts';
import { characterSpriteSvg } from '../src/art/characterArt.ts';
import type { DialogueLine, Point, Progress } from '../src/game/model.ts';

const uri = `data:image/png;base64,${readFileSync('assets/maps/bamboo-verge-v3.png').toString('base64')}`;
export const vergeBody = (svg: string) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
export function vergeActor(id: 'rae' | 'tala', point: Point, clock = 3, line?: DialogueLine) {
  const w = id === 'rae' ? 20 : 18, h = id === 'rae' ? 30 : 22, speaking = line?.speaker === (id === 'rae' ? 'Rae Jacob' : 'Tala');
  const sprite = characterSpriteSvg(id, 'up', -1, speaking ? line.gesture ?? 'talk' : id === 'tala' ? 'map' : 'idle', speaking ? line.emotion : 'neutral', (clock + (id === 'rae' ? 0 : 1.3)) % 5.7 < .14, speaking && Math.floor(clock * 6) % 3 === 0 ? 1 : 0);
  return `<rect x="${point.x - w / 2 + 2}" y="${point.y - 1}" width="${w - 4}" height="3" fill="#142e2b" opacity=".28"/><svg x="${point.x - w / 2}" y="${point.y - h}" width="${w}" height="${h}" viewBox="0 0 32 ${id === 'rae' ? 48 : 40}">${vergeBody(sprite)}</svg>`;
}
export function bambooVergeSceneArt(progress: Progress, player: Point = { x: 400, y: 268 }, clock = 3, options: { companion?: Point; line?: DialogueLine; still?: boolean } = {}) {
  const companion = options.companion ?? { x: player.x - 21, y: player.y + 14 }, time = options.still ? 1 : clock;
  const speaking = options.line?.speaker === 'Bagtas';
  let s = vergeRasterDefs(uri) + '<use href="#verge-preview-map"/>' + vergeBody(WORLD_PROPS.bamboo) + vergeBody(PROP_MOTION.bamboo[2]) + vergeBody(VERGE_WAYFINDING_SVG) + vergeBody(vergeWeatherSvg(time, 'ground'));
  const actors = [
    { y: player.y, art: vergeActor('rae', player, clock, options.line) },
    { y: companion.y, art: vergeActor('tala', companion, clock, options.line) },
    { y: 238, art: '<rect x="386" y="236" width="29" height="3" fill="#1b3732" opacity=".4"/>' + `<svg x="383" y="170" width="34" height="68" viewBox="0 0 32 64">${vergeBody(bagtasSpriteSvg((clock + 2.1) % 6 < .15, speaking && Math.floor(clock * 6) % 3 === 0 ? 1 : 0, speaking ? options.line?.emotion : 'neutral', Math.floor(clock * .65) % 2))}</svg>` },
  ];
  s += actors.sort((a, b) => a.y - b.y).map(actor => actor.art).join('');
  s += vergeForegroundMarkup(player) + vergeBody(vergeWeatherSvg(time));
  return s;
}
