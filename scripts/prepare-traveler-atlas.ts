import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';
import { characterSpriteSvg } from '../src/art/characterArt.ts';
import { TRAVELER_ATLAS_POSES, TRAVELER_DIRECTIONS, travelerFrameCell } from '../src/game/travelerAtlas.ts';

await mkdir('assets/characters',{recursive:true});
for(const id of ['rae','tala'] as const){
  const layers:{input:Buffer;left:number;top:number}[]=[];
  for(const pose of TRAVELER_ATLAS_POSES[id])for(const facing of TRAVELER_DIRECTIONS)for(const blink of [false,true])for(const frame of pose.frames){
    const cell=travelerFrameCell(id,facing,frame,blink,pose.emotion,pose.gesture)!;
    const input=await sharp(Buffer.from(characterSpriteSvg(id,facing,frame,pose.gesture,pose.emotion,blink))).resize(cell.cellWidth,cell.cellHeight,{kernel:'nearest'}).png().toBuffer();
    layers.push({input,left:cell.column*cell.cellWidth,top:cell.row*cell.cellHeight});
  }
  const cell=travelerFrameCell(id,'down',0,false,'neutral','idle')!;
  await sharp({create:{width:cell.cellWidth*cell.columns,height:cell.cellHeight*cell.rows,channels:4,background:'#00000000'}}).composite(layers).png().toFile(`assets/characters/${id}-frames-mobile-v2.png`);
}
console.log('Prepared persistent walking, blinking and idle traveler atlases.');
