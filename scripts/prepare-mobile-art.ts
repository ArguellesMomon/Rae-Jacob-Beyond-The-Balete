import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { characterSpriteSvg } from '../src/art/characterArt.ts';
import { TRAVELER_DIRECTIONS, travelerWalkCell } from '../src/game/travelerAtlas.ts';

// Prepare the existing V1 materials as continuous world plates. The original
// six PNGs stay untouched. One decoded pixel per world pixel bounds phone memory.
for(const stage of ['stone','wind','water'])for(const surface of ['floor','forest']){
  const size=256,overlap=32,period=size-overlap;
  const original=await sharp(`assets/maps/maze-${stage}-${surface}-v1.png`).resize(size,size,{kernel:'nearest'}).removeAlpha().raw().toBuffer();
  const tile=Buffer.alloc(period*period*3),blend=(n:number)=>n<overlap?(1+Math.cos(n/overlap*Math.PI))/2:0;
  for(let y=0;y<period;y++)for(let x=0;x<period;x++)for(let c=0;c<3;c++){
    const wx=blend(x),wy=blend(y),sample=(sx:number,sy:number)=>original[(sy*size+sx)*3+c];
    const top=sample(x,y)*(1-wx)+sample(x+(wx?period:0),y)*wx;
    const bottom=sample(x,y+(wy?period:0))*(1-wx)+sample(x+(wx?period:0),y+(wy?period:0))*wx;
    tile[(y*period+x)*3+c]=Math.round(top*(1-wy)+bottom*wy);
  }
  const width=1536,height=1152,plate=Buffer.alloc(width*height*3);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const from=((y%period)*period+x%period)*3,to=(y*width+x)*3;
    tile.copy(plate,to,from,from+3);
  }
  await sharp(plate,{raw:{width,height,channels:3}}).png({palette:true,colours:256}).toFile(`assets/maps/maze-${stage}-${surface}-mobile-v1.png`);
}

// The same authored walk artwork is compiled to textures for native movement.
// Dialogue and special poses continue to use the expressive vector originals.
await mkdir('assets/characters',{recursive:true});
for(const id of ['rae','tala'] as const){
  const layers:{input:Buffer;left:number;top:number}[]=[];
  for(const direction of TRAVELER_DIRECTIONS)for(const blink of [false,true])for(const variant of [0,1])for(let frame=0;frame<8;frame++){
    const emotion=id==='rae'&&variant===1?'curious':'neutral',gesture=id==='tala'&&variant===1?'guardMap':'idle';
    const cell=travelerWalkCell(id,direction,frame,blink,emotion,gesture);
    const input=await sharp(Buffer.from(characterSpriteSvg(id,direction,frame,gesture,emotion,blink))).resize(cell.cellWidth,cell.cellHeight,{kernel:'nearest'}).png().toBuffer();
    layers.push({input,left:cell.column*cell.cellWidth,top:cell.row*cell.cellHeight});
  }
  const cell=travelerWalkCell(id,'down',0,false,'neutral','idle');
  await sharp({create:{width:cell.cellWidth*8,height:cell.cellHeight*16,channels:4,background:'#00000000'}}).composite(layers).png().toFile(`assets/characters/${id}-walk-mobile.png`);
}
await writeFile('artifacts/mobile-art-preparation.txt','Prepared six continuous V1 material plates at 1536x1152 and two transparent traveler walk atlases from the existing authored sprites. Original sources are unchanged.\n');
console.log('Prepared mobile V1 surfaces and traveler walk atlases.');
await import('./prepare-traveler-atlas.ts');
