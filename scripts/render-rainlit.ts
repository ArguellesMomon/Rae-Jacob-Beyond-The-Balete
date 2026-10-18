import { springPuzzleMarkup, springWaterSurfaceMarkup, springSealSurfaceMarkup } from './spring-puzzle-scene-art.ts';
import { WORLD_PROPS, PROP_MOTION } from '../src/art/worldPropArt.ts';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { replayCheckpoint } from '../src/game/replay.ts';
import { completeInteraction } from '../src/game/engine.ts';
import { RAINLIT_DECOR, rainlitWeatherSvg, springRepairSvg, springSealSvg, springWaterSvg } from '../src/art/rainlitArt.ts';
import { springPortraitSvg, springSpriteSvg } from '../src/art/springCharacterArt.ts';
import { characterSpriteSvg } from '../src/art/characterArt.ts';
import { bagtasSpriteSvg } from '../src/art/bagtasArt.ts';
import type { Emotion, RainlitMapId } from '../src/game/model.ts';
await mkdir('artifacts', { recursive: true });
const svg = (body: string, w = 640, h = 480) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${body}</svg>`;
const body = (s: string) => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const sprite = (s: string, x: number, y: number, w: number, h: number) => `<svg x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" viewBox="${s.match(/viewBox="([^"]+)/)![1]}">${body(s)}</svg>`;
const images = { rainroad: 'rainlit-road-v1.png', hamlet: 'riverside-hamlet-v3.png', spring: 'quiet-spring-v2.png' };
const p = replayCheckpoint('springPuzzle').progress;
const states = [p, completeInteraction(completeInteraction(p, 'springChannel'), 'springBrace'), { ...replayCheckpoint('springEnding').progress, rainlit: { ...replayCheckpoint('springEnding').progress.rainlit, sealSeen: true } }];
const sheets: { input: Buffer; left: number; top: number }[] = [];
for (const [index, map] of (['rainroad', 'hamlet', 'spring'] as RainlitMapId[]).entries()) {
  const image = (await readFile(`assets/maps/${images[map]}`)).toString('base64');
  const draw = (state: typeof p) => {
    let s = `<image href="data:image/png;base64,${image}" width="640" height="480"/>${body(RAINLIT_DECOR[map])}${body(WORLD_PROPS[map])}${body(PROP_MOTION[map][2])}`;

    if (map === 'spring') s += (state.rainlit.restored ? springWaterSurfaceMarkup() : '') + body(springWaterSvg(state.rainlit.restored, 3)) + springPuzzleMarkup(state) + (state.rainlit.sealSeen ? springSealSurfaceMarkup() : '');
    if (map === 'spring') s += sprite(springSpriteSvg('mayumi', false, 0, 'warm'), 282, 263, 26, 45.5) + sprite(bagtasSpriteSvg(), 374, 294, 34, 68);
    else s += sprite(bagtasSpriteSvg(), map === 'hamlet' ? 330 : 338, map === 'hamlet' ? 266 : 267, 34, 68);
    if (map === 'hamlet') s += sprite(springSpriteSvg('luning'), 300, 250, 20, 25);
    s += sprite(characterSpriteSvg('tala', 'up', -1, 'map'), map === 'spring' ? 313 : 249, 297, 18, 22) + sprite(characterSpriteSvg('rae', 'up', -1), map === 'spring' ? 330 : 271, 298, 20, 30);
    return s + body(rainlitWeatherSvg(map, 3));
  };
  const buffer = await sharp(Buffer.from(svg(draw(states[2])))).resize(1280, 960, { kernel: 'nearest' }).png().toBuffer();
  await writeFile(`artifacts/${map}-scene-review.png`, buffer);
  sheets.push({ input: await sharp(buffer).resize(640, 480).png().toBuffer(), left: index * 640, top: 0 });
  if (map === 'spring') for (const [i, state] of states.entries()) await sharp(Buffer.from(svg(draw(state)))).resize(1280, 960, { kernel: 'nearest' }).png().toFile(`artifacts/spring-repair-${i}-review.png`);
}
await sharp({ create: { width: 1920, height: 480, channels: 4, background: '#213d34' } }).composite(sheets).png().toFile('artifacts/rainlit-scenes-review.png');
const emotions: Emotion[] = ['neutral', 'warm', 'delighted', 'curious', 'worried', 'determined', 'wistful', 'surprised', 'wry'];
let cast = '<rect width="880" height="256" fill="#294339"/>';
for (const [row, id] of (['mayumi', 'luning'] as const).entries()) {
  cast += `<text x="8" y="${14 + row * 128}" font-size="9" fill="#f5e6bb" font-family="monospace">${id.toUpperCase()} / ORIGINAL SILONG CHARACTER</text>`;
  cast += sprite(springSpriteSvg(id), 35, 125 + row * 128, id === 'mayumi' ? 52 : 64, id === 'mayumi' ? 91 : 80);
  for (const [col, emotion] of emotions.entries()) cast += `<g transform="translate(${86 + col * 88} ${24 + row * 128})">${springPortraitSvg(id, emotion)}</g><text x="${86 + col * 88}" y="${125 + row * 128}" font-size="7" fill="#e8d5ac">${emotion}</text>`;
}
await sharp(Buffer.from(svg(cast, 880, 256))).resize(1760, 512, { kernel: 'nearest' }).png().toFile('artifacts/spring-cast-review.png');
console.log('Rendered three maps with the live source art, three spring repair states, and Mayumi/Luning expressions. These are source-art reviews, not device screenshots.');
