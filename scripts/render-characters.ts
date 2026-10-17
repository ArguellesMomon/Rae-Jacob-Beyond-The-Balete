import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { characterPortraitSvg, characterSpriteSvg } from '../src/art/characterArt.ts';
import { mangUbanSvg } from '../src/art/groveArt.ts';
import { CHARACTERS, CHARACTER_ORDER } from '../src/game/characters.ts';
import type { CharacterId, Emotion, Gesture } from '../src/game/model.ts';
import { idleActing } from '../src/game/acting.ts';

await mkdir('artifacts', { recursive: true });
const svg = (body: string, w: number, h: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${body}</svg>`;
const label = (x: number, y: number, text: string, size = 6) => `<text x="${x}" y="${y}" font-family="monospace" font-size="${size}" fill="#ecdfba">${text}</text>`;
const emotions: Emotion[] = ['neutral', 'warm', 'delighted', 'curious', 'worried', 'determined', 'wistful', 'surprised', 'wry'];
const expressionHeight = CHARACTER_ORDER.length * 122 + 10;
let expressions = `<rect width="836" height="${expressionHeight}" fill="#213f35"/>`;
CHARACTER_ORDER.forEach((id, row) => {
  expressions += label(8, row * 122 + 13, CHARACTERS[id].name, 8);
  emotions.forEach((emotion, col) => expressions += `<g transform="translate(${8 + col * 92} ${row * 122 + 18})">${characterPortraitSvg(id, emotion)}</g>` + label(9 + col * 92, row * 122 + 121, emotion));
});
await sharp(Buffer.from(svg(expressions, 836, expressionHeight))).resize(1672, expressionHeight * 2, { kernel: 'nearest' }).png().toFile('artifacts/character-expression-sheet.png');
await writeFile('artifacts/character-expression-sheet.svg', svg(expressions, 836, expressionHeight));

let walking = '<rect width="396" height="232" fill="#d9d1ad"/>';
(['down', 'right', 'up', 'left'] as const).forEach((direction, row) => {
  for (let f = 0; f < 8; f++) walking += `<g transform="translate(${12 + f * 48} ${6 + row * 57})">${characterSpriteSvg('rae', direction, f)}</g>`;
});
await sharp(Buffer.from(svg(walking, 396, 232))).resize(1584, 928, { kernel: 'nearest' }).png().toFile('artifacts/rae-animation-sheet.png');

const poses: Gesture[] = ['idle', 'wave', 'think', 'map', 'work', 'pull', 'brush', 'guardMap', 'listen', 'celebrate'];
let gestures = '<rect width="580" height="244" fill="#213f35"/>';
(['rae', 'lola', 'tala', 'minda'] as const).forEach((id, row) => {
  poses.forEach((pose, col) => gestures += `<g transform="translate(${10 + col * 58} ${6 + row * 60})">${characterSpriteSvg(id, 'down', -1, pose, 'warm', false, col % 2)}</g>` + label(6 + col * 58, row * 60 + 58, pose));
});
await sharp(Buffer.from(svg(gestures, 590, 244))).resize(1770, 732, { kernel: 'nearest' }).png().toFile('artifacts/character-gesture-sheet.png');
for (const id of CHARACTER_ORDER) await sharp(Buffer.from(characterPortraitSvg(id, id === 'uban' ? 'wry' : 'warm'))).resize(400, 480, { kernel: 'nearest' }).png().toFile(`artifacts/${id}-portrait.png`);

// Contact animation is rendered from the exact frame functions used in the app.
const width = CHARACTER_ORDER.length * 120, height = 172, frames = 24;
const inputs: { input: Buffer; top: number; left: number }[] = [];
for (let f = 0; f < frames; f++) {
  let body = `<rect width="${width}" height="172" fill="#29483b"/>`;
  CHARACTER_ORDER.forEach((id: CharacterId, i) => {
    const emotion = emotions[Math.floor(f / 3) % emotions.length];
    body += `<g transform="translate(${i * 120 + 5} 17)">${characterPortraitSvg(id, emotion, f === 11, f % 3 === 0 ? 1 : 0)}</g>` + label(i * 120 + 6, 12, CHARACTERS[id].name, 8);
    if (id === 'uban') body += `<svg x="${i * 120 + 88}" y="65" width="30" height="60" viewBox="0 0 112 156">${mangUbanSvg(f === 11, false, { emotion, mouth: f % 3 === 0 ? 1 : 0, hand: f % 6 < 3 ? -2 : 0 }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</svg>`;
    else if (id === 'bagtas') body += `<svg x="${i * 120 + 86}" y="65" width="30" height="60" viewBox="0 0 32 64">${characterSpriteSvg(id, 'down', f % 2 ? -3 : -4, 'talk', emotion, f === 11, f % 3 === 0 ? 1 : 0).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</svg>`;
    else body += `<g transform="translate(${i * 120 + 87} 77)">${characterSpriteSvg(id, 'down', id === 'rae' ? f % 8 : f % 2 ? -3 : -4, id === 'tala' ? f % 12 < 6 ? 'map' : 'talk' : id === 'minda' ? 'work' : id === 'lola' ? 'wave' : 'idle', emotion, f === 11, f % 3 === 0 ? 1 : 0)}</g>`;
    body += label(i * 120 + 6, 133, emotion, 7);
  });
  body += label(6, 159, 'Original source art / expressive portraits, eight-frame traveler walk, map and work gestures', 6);
  inputs.push({ input: await sharp(Buffer.from(svg(body, width, height))).png().toBuffer(), top: f * height, left: 0 });
}
const raw = await sharp({ create: { width, height: height * frames, channels: 4, background: '#29483b' } }).composite(inputs).raw().toBuffer();
await sharp(raw, { raw: { width, height: height * frames, channels: 4, pageHeight: height } }).gif({ loop: 0, delay: Array(frames).fill(140) }).toFile('artifacts/character-animation-preview.gif');
const actingFrames: Buffer[] = [];
const actingExamples = [
  { id: 'rae', map: 'yard', label: 'Rae / dust and curiosity' },
  { id: 'rae', map: 'clearing', label: 'Rae / listening' },
  { id: 'tala', map: 'clearing', label: 'Tala / map and listening' },
  { id: 'tala', map: 'waterworks', label: 'Tala / protecting her map' },
  { id: 'minda', map: 'clearing', label: 'Minda / repairs' },
] as const;
for (let f = 0; f < 40; f++) {
  let art = '<rect width="600" height="100" fill="#29483b"/>';
  actingExamples.forEach(({ id, map, label: caption }, i) => {
    const acting = idleActing(id, f / 3, map);
    art += label(i * 120 + 4, 12, caption, 6) + `<g transform="translate(${i * 120 + 43} 24)">${characterSpriteSvg(id, 'down', f % 2 ? -3 : -4, acting.gesture, acting.emotion)}</g>` + label(i * 120 + 4, 88, acting.gesture, 7);
  });
  actingFrames.push(await sharp(Buffer.from(svg(art, 600, 100))).resize(1200, 200, { kernel: 'nearest' }).ensureAlpha().raw().toBuffer());
}
await sharp(Buffer.concat(actingFrames), { raw: { width: 1200, height: 200 * 40, channels: 4, pageHeight: 200 } }).gif({ loop: 0, delay: Array(40).fill(333) }).toFile('artifacts/character-idle-preview.gif');
console.log('Rendered six portraits, nine expressions each, Rae’s full walk cycle, gesture sheet and animated contact sheet.');
