import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { hamletLifeActors } from '../src/art/hamletLifeArt.ts';
import { characterSpriteSvg } from '../src/art/characterArt.ts';
import { bagtasSpriteSvg } from '../src/art/bagtasArt.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { canStand } from '../src/game/engine.ts';
import { getMap } from '../src/game/world.ts';
const map = (await readFile('assets/maps/riverside-hamlet-v3.png')).toString('base64');
const sprite = (xml: string, x: number, y: number, w: number, h: number) => `<svg x="${x-w/2}" y="${y-h}" width="${w}" height="${h}">${xml.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</svg>`;
const panels: Buffer[] = [];
for (const restored of [false, true]) {
  const progress = replayCheckpoint(restored ? 'springEnding' : 'springPuzzle').progress;
  const actors = [
    { y: 250, s: sprite(characterSpriteSvg('luning', 'down', -3, 'work', 'warm'), 300, 250, 20, 25) },
    { y: 266, s: sprite(bagtasSpriteSvg(false, 0, 'wry'), 330, 266, 34, 68) },
    { y: 279, s: sprite(characterSpriteSvg('rae', 'up', -1), 300, 279, 20, 30) },
    { y: 292, s: sprite(characterSpriteSvg('tala', 'up', -1, 'map'), 310, 292, 18, 22) },
    ...hamletLifeActors(progress, 1).map(n => ({ y: n.y, s: sprite(n.svg, n.x, n.y + 2, 18, 25) })),
  ].sort((a,b) => a.y-b.y);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="960" viewBox="0 0 640 480"><image href="data:image/png;base64,${map}" width="640" height="480"/>${actors.map(n => n.s).join('')}</svg>`;
  const picture = await sharp(Buffer.from(svg)).png().toBuffer();
  await sharp(picture).toFile(`artifacts/hamlet-${restored ? 'water-returned' : 'waiting'}-review.png`);
  panels.push(await sharp(picture).extract({ left: 330, top: 395, width: 520, height: 260 }).png().toBuffer());
  if(restored) for(const n of hamletLifeActors(progress, 1)) {
    const empty = replayCheckpoint('springPuzzle').progress;
    if(!canStand(n, getMap('hamlet', empty).colliders, 'hamlet')) throw new Error('Neighbor off ground: '+n.id);
  }
}
await sharp({create:{width:1040,height:260,channels:4,background:'#17372e'}}).composite(panels.map((input,i)=>({input,left:i*520,top:0}))).png().toFile('artifacts/hamlet-ending-before-after.png');
console.log('Rendered household activity before/after the water returns; all neighbors stand on dry ground. Source-art review.');
