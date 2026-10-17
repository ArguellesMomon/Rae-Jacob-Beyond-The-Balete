import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { turningSceneArt } from './turning-scene-art.ts';
import { bambooVergeSceneArt } from './bamboo-verge-scene-art.ts';
import { bagtasPortraitSvg, bagtasSpriteSvg } from '../src/art/bagtasArt.ts';
import { wrapSvg } from '../src/art/pixelArt.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { linesFor } from '../src/game/dialogue.ts';
import { REPLY_TONES, STORY_CHOICES } from '../src/game/storyChoices.ts';
import type { DialogueLine, Emotion, InteractionId } from '../src/game/model.ts';
await mkdir('artifacts', { recursive: true });
const body = (s: string) => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const verge = wrapSvg(bambooVergeSceneArt(replayCheckpoint('chapter2').progress), 640, 480);
await sharp(Buffer.from(verge)).resize(1280, 960, { kernel: 'nearest' }).png().toFile('artifacts/chapter-02-bamboo-verge.png');
await writeFile('artifacts/chapter-02-bamboo-verge.svg', verge);
for (let step = 0; step < 3; step++) {
  const p = replayCheckpoint('bambooPuzzle').progress; p.chapterTwo.trailStep = step;
  const scene = wrapSvg(turningSceneArt(p), 640, 480);
  await sharp(Buffer.from(scene)).resize(1280, 960, { kernel: 'nearest' }).png().toFile(`artifacts/chapter-02-turning-${step + 1}.png`);
}
const emotions: Emotion[] = ['neutral', 'warm', 'delighted', 'curious', 'worried', 'determined', 'wistful', 'surprised', 'wry'];
let sheet = '<rect width="828" height="116" fill="#29483b"/>';
for (const [i, emotion] of emotions.entries()) sheet += `<g transform="translate(${i * 92} 2)">${body(bagtasPortraitSvg(emotion))}</g><text x="${i * 92 + 1}" y="110" fill="#e7d8b0" font-family="monospace" font-size="7">${emotion}</text>`;
await sharp(Buffer.from(wrapSvg(sheet, 828, 116))).resize(1656, 232, { kernel: 'nearest' }).png().toFile('artifacts/bagtas-expression-sheet.png');
await sharp(Buffer.from(bagtasPortraitSvg('warm'))).resize(400, 480, { kernel: 'nearest' }).png().toFile('artifacts/bagtas-portrait.png');
const frames: Buffer[] = [];
for (let f = 0; f < 36; f++) {
  const emotion = emotions[Math.floor(f / 4)];
  const frame = wrapSvg(`<rect width="180" height="112" fill="#29483b"/>` + `<g transform="translate(4 4)">${body(bagtasPortraitSvg(emotion, f === 12, f % 3 === 0 ? 1 : 0))}</g>` + `<svg x="112" y="24" width="34" height="68" viewBox="0 0 32 64">${body(bagtasSpriteSvg(f === 12, f % 3 === 0 ? 1 : 0, emotion, f % 2))}</svg>` + `<text x="90" y="105" fill="#e7d8b0" font-family="monospace" font-size="6">${emotion}</text>`, 180, 112);
  frames.push(await sharp(Buffer.from(frame)).resize(720, 448, { kernel: 'nearest' }).ensureAlpha().raw().toBuffer());
}
await sharp(Buffer.concat(frames), { raw: { width: 720, height: 448 * frames.length, channels: 4, pageHeight: 448 } }).gif({ loop: 0, delay: Array(frames.length).fill(160) }).toFile('artifacts/bagtas-animation.gif');
let review = '# Chapter 2 opening - Playable dialogue review\n\nGenerated with `npm.cmd run chapter2:preview`. This is the first playable arc of The Path That Walks Back, not the complete second chapter. Story, route magic and Bagtas are original fiction. Source-art renders are not running-app screenshots.\n\n';
function prose(line: DialogueLine): string {
  let s = `${line.beat ? `*${line.beat}*\n\n` : ''}**${line.speaker}:** ${line.text}\n\n`;
  if (line.choice) for (const tone of REPLY_TONES) s += `### ${tone}\n\n${STORY_CHOICES[line.choice].replies[tone].lines.map(prose).join('')}`;
  return s;
}
for (const id of ['bambooArrival', 'bagtas', 'bagtasPaths', 'bagtasStories', 'bagtasSeals', 'bambooCord', 'bambooCup', 'hoofMarks', 'rainLeaves', 'trailVerse', 'turningArrival', 'pathStone', 'pathWind', 'pathWater', 'bagtasDebrief'] as InteractionId[]) {
  const p = replayCheckpoint(id === 'bagtasDebrief' ? 'bambooDebrief' : 'chapter2').progress;
  review += `## ${id}\n\n` + linesFor(id, p, id.startsWith('path') || id === 'turningArrival' ? 'turning' : 'bamboo').map(prose).join('');
}
for (const tone of REPLY_TONES) {
  const p = replayCheckpoint('bambooDebrief').progress; p.storyChoices.bagtasIntent = tone;
  review += `## Debrief callback: ${tone}\n\n` + linesFor('bagtasDebrief', p, 'bamboo').map(prose).join('');
}
await writeFile('docs/chapter-02-dialogue-review.md', review);
console.log('Rendered both bamboo maps, all three fork layouts, Bagtas expressions/animation and the playable dialogue review.');
