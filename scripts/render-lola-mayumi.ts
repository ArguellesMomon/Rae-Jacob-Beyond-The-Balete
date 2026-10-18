import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { lolaPortraitSvg, lolaSpriteSvg } from '../src/art/lolaArt.ts';
import { mayumiAuraSvg, mayumiPortraitSvg, mayumiSpriteSvg } from '../src/art/mayumiArt.ts';
import type { Emotion } from '../src/game/model.ts';

const nested = (s: string, x: number, y: number, w: number, h: number) => s.replace('<svg ', `<svg x="${x}" y="${y}" `).replace(/width="[^"]*" height="[^"]*"/, `width="${w}" height="${h}"`);
const wrap = (s: string, w: number, h: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${s}</svg>`;
const emotions: Emotion[] = ['neutral', 'warm', 'delighted', 'curious', 'worried', 'determined', 'wistful', 'surprised', 'wry'];
let sheet = '<rect width="1240" height="580" fill="#253e37"/><text x="20" y="26" fill="#e4d6b1" font-family="monospace" font-size="17">LOLA / MAYUMI · WORLD SPRITES &amp; EXPRESSIONS</text>';
sheet += nested(lolaSpriteSvg('down', -1, 'idle', 'warm'), 32, 55, 96, 144) + nested(lolaSpriteSvg('down', -3, 'wave', 'warm'), 143, 55, 96, 144);
sheet += nested(mayumiAuraSvg(2), 266, 36, 144, 198) + nested(mayumiSpriteSvg(false, 0, 'warm'), 294, 57, 78, 136.5);
for (const [i, emotion] of emotions.entries()) {
  sheet += nested(lolaPortraitSvg(emotion), 24 + i * 134, 260, 100, 120) + nested(mayumiPortraitSvg(emotion), 24 + i * 134, 410, 100, 120);
  sheet += `<text x="${24 + i * 134}" y="246" fill="#d3c79e" font-family="monospace" font-size="12">${emotion}</text>`;
}
await sharp(Buffer.from(wrap(sheet, 1240, 580))).png().toFile('artifacts/lola-mayumi-cast-review.png');
const yard = (await readFile('assets/maps/lolas-yard-v2.png')).toString('base64');
const spring = (await readFile('assets/maps/quiet-spring-v2.png')).toString('base64');
const yardScene = `<image href="data:image/png;base64,${yard}" width="640" height="448"/>` + nested(lolaSpriteSvg('down', -3, 'wave', 'warm'), 193, 156, 20, 30);
const springScene = `<image href="data:image/png;base64,${spring}" width="640" height="480"/>` + nested(mayumiAuraSvg(2), 258, 202, 48, 66) + nested(mayumiSpriteSvg(false, 0, 'warm'), 269, 217.5, 26, 45.5);
for (const [name, scene, left, top, height] of [['lola-yard', yardScene, 155, 110, 100], ['mayumi-spring', springScene, 235, 185, 100]] as const) {
  const source = wrap(scene, 640, name === 'lola-yard' ? 448 : 480).replace('width="640" height=', 'width="2560" height=').replace(`height="${name === 'lola-yard' ? 448 : 480}"`, `height="${(name === 'lola-yard' ? 448 : 480) * 4}"`);
  await sharp(Buffer.from(source)).extract({ left: left * 4, top: top * 4, width: 110 * 4, height: height * 4 }).png().toFile(`artifacts/${name}-character-review.png`);
}
console.log('Rendered Lola and Mayumi expressions, source poses and scene detail crops.');
