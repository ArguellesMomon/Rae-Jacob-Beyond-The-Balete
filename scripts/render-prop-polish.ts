import { springPuzzleMarkup, springWaterSurfaceMarkup, springSealSurfaceMarkup } from './spring-puzzle-scene-art.ts';
import { mkdir, readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { WORLD_PROPS, PROP_MOTION, PROP_SIZES } from '../src/art/worldPropArt.ts';
import { clearingSceneArt } from './clearing-scene-art.ts';
import { groveSceneArt } from './grove-scene-art.ts';
import { waterworksSceneArt } from './waterworks-scene-art.ts';
import { bambooVergeSceneArt } from './bamboo-verge-scene-art.ts';
import { turningSceneArt } from './turning-scene-art.ts';
import { yardLaundrySvg } from '../src/art/yardArt.ts';
import { RAINLIT_DECOR, springRepairSvg, springSealSvg, springWaterSvg, ONWARD_SIGN } from '../src/art/rainlitArt.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { characterSpriteSvg } from '../src/art/characterArt.ts';
import { springSpriteSvg } from '../src/art/springCharacterArt.ts';
import { bagtasSpriteSvg } from '../src/art/bagtasArt.ts';
import type { MapId } from '../src/game/model.ts';
await mkdir('artifacts', { recursive: true });
const body = (s: string) => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const svg = (body: string, w: number, h: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${body}</svg>`;
const image = async (file: string, w: number, h: number) => `<image href="data:image/png;base64,${(await readFile('assets/maps/' + file)).toString('base64')}" width="${w}" height="${h}"/>`;
const actor = (s: string, x: number, y: number, w: number, h: number) => `<svg x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" viewBox="${s.match(/viewBox="([^"]+)/)![1]}">${body(s)}</svg>`;
const p = replayCheckpoint('springPuzzle').progress;
const done = replayCheckpoint('springEnding').progress;
const scenes: Record<MapId, string> = {
  yard: await image('lolas-yard-v2.png', 640, 448) + body(WORLD_PROPS.yard) + body(PROP_MOTION.yard[2]) + body(yardLaundrySvg(1)) + actor(characterSpriteSvg('rae', 'up', -1), 262, 200, 20, 30) + actor(characterSpriteSvg('lola', 'down', -1), 203, 186, 20, 30),
  clearing: clearingSceneArt(replayCheckpoint('bellReturn').progress),
  grove: groveSceneArt(replayCheckpoint('grove').progress),
  waterworks: waterworksSceneArt(replayCheckpoint('works').progress),
  bamboo: bambooVergeSceneArt(replayCheckpoint('rainroad').progress) + body(ONWARD_SIGN),
  turning: turningSceneArt(replayCheckpoint('chapter2').progress),
  rainroad: '', hamlet: '', spring: '',
};
for (const [map, file] of [['rainroad', 'rainlit-road-v1.png'], ['hamlet', 'riverside-hamlet-v3.png'], ['spring', 'quiet-spring-v2.png']] as const) {
  scenes[map] = await image(file, 640, 480) + body(RAINLIT_DECOR[map]) + body(WORLD_PROPS[map]) + body(PROP_MOTION[map][2]);
  if (map === 'hamlet') scenes[map] += actor(springSpriteSvg('luning'), 300, 250, 20, 25);
  if (map === 'spring') scenes[map] += body(springWaterSvg(false, 2)) + springPuzzleMarkup(p) + actor(springSpriteSvg('mayumi'), 282, 263, 26, 45.5);
  const point = map === 'rainroad' ? [338, 267] : map === 'hamlet' ? [330, 266] : [374, 294];
  scenes[map] += actor(bagtasSpriteSvg(), point[0], point[1], 34, 68) + actor(characterSpriteSvg('rae', 'up', -1), map === 'spring' ? 450 : 255, map === 'spring' ? 280 : 285, 20, 30) + actor(characterSpriteSvg('tala', 'up', -1), map === 'spring' ? 430 : 235, map === 'spring' ? 288 : 298, 18, 22);
}
const panels: { input: Buffer; left: number; top: number }[] = [], raw = {} as Record<MapId, Buffer>;
for (const [index, map] of (Object.keys(scenes) as MapId[]).entries()) {
  raw[map] = await sharp(Buffer.from(svg(scenes[map], ...PROP_SIZES[map]))).png().toBuffer();
  await sharp(raw[map]).resize(PROP_SIZES[map][0] * 2, PROP_SIZES[map][1] * 2, { kernel: 'nearest' }).png().toFile(`artifacts/props-${map}-review.png`);
  panels.push({ input: await sharp(raw[map]).resize(640, 480, { fit: 'contain', background: '#223c31', kernel: 'nearest' }).png().toBuffer(), left: index % 3 * 640, top: Math.floor(index / 3) * 480 });
}
await sharp({ create: { width: 1920, height: 1440, channels: 4, background: '#223c31' } }).composite(panels).png().toFile('artifacts/props-all-maps-review.png');
const crops: [MapId, number, number, number, number][] = [['yard', 90, 280, 130, 65], ['clearing', 253, 157, 105, 55], ['clearing', 353, 288, 60, 63], ['grove', 289, 273, 75, 66], ['waterworks', 294, 148, 65, 62], ['waterworks', 258, 356, 55, 48], ['bamboo', 484, 156, 126, 95], ['turning', 66, 168, 89, 63], ['rainroad', 186, 235, 49, 40], ['hamlet', 319, 201, 63, 56], ['hamlet', 405, 203, 54, 48], ['spring', 390, 207, 155, 89]];
const closeups = await Promise.all(crops.map(async ([map, left, top, width, height], index) => ({ input: await sharp(raw[map]).extract({ left, top, width, height }).resize(480, 300, { fit: 'contain', background: '#223c31', kernel: 'nearest' }).png().toBuffer(), left: index % 3 * 480, top: Math.floor(index / 3) * 300 })));
await sharp({ create: { width: 1440, height: 1200, channels: 4, background: '#223c31' } }).composite(closeups).png().toFile('artifacts/props-material-closeups.png');
// Compare unrepaired, braced, and restored root/basket art at native scene coordinates.
const springBase = await image('quiet-spring-v2.png', 640, 480) + body(WORLD_PROPS.spring);
const states = [p, { ...p, rainlit: { ...p.rainlit, rootBraced: true } }, done];
const repair = await Promise.all(states.map(async (state, index) => ({ input: await sharp(Buffer.from(svg(springBase + (state.rainlit.restored ? springWaterSurfaceMarkup() : '') + body(springWaterSvg(state.rainlit.restored, 2)) + springPuzzleMarkup(state) + (state.rainlit.sealSeen ? springSealSurfaceMarkup() : ''), 640, 480))).extract({ left: 380, top: 202, width: 220, height: 100 }).resize(660, 300, { kernel: 'nearest' }).png().toBuffer(), left: index * 660, top: 0 })));
await sharp({ create: { width: 1980, height: 300, channels: 4, background: '#223c31' } }).composite(repair).png().toFile('artifacts/props-spring-states.png');
console.log('Rendered nine integrated source-art maps, twelve material closeups, and three spring repair states. Not device screenshots.');
