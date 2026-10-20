import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

// Bake fine generated materials into full-world plates at two source pixels per
// world pixel. Periodic overlap blending removes the source crop's edge seams.
// This is material preparation, not cutting pieces of scene paintings into tiles.
for(const source of ['earth','understory']){
  const size=512,overlap=64,period=size-overlap;
  const original=await sharp(`assets/maps/maze-${source}-source-v2.png`).resize(size,size,{fit:'cover',kernel:'nearest'}).removeAlpha().raw().toBuffer();
  const tile=Buffer.alloc(period*period*3);
  const blend=(n:number)=>n<overlap?(1+Math.cos(n/overlap*Math.PI))/2:0;
  for(let y=0;y<period;y++)for(let x=0;x<period;x++)for(let channel=0;channel<3;channel++){
    const wx=blend(x),wy=blend(y),sample=(sx:number,sy:number)=>original[(sy*size+sx)*3+channel];
    const top=sample(x,y)*(1-wx)+sample(x+period*(wx>0?1:0),y)*wx;
    const bottom=sample(x,y+period*(wy>0?1:0))*(1-wx)+sample(x+period*(wx>0?1:0),y+period*(wy>0?1:0))*wx;
    tile[(y*period+x)*3+channel]=Math.round(top*(1-wy)+bottom*wy);
  }
  const width=3072,height=2304,plate=Buffer.alloc(width*height*3);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const from=((y%period)*period+x%period)*3,to=(y*width+x)*3;
    plate[to]=tile[from];plate[to+1]=tile[from+1];plate[to+2]=tile[from+2];
  }
  await writeFile(`assets/maps/maze-${source}-v2.png`,await sharp(plate,{raw:{width,height,channels:3}}).png({palette:true,colours:256}).toBuffer());
}
const atlas=sharp('assets/maps/maze-foliage-source-v2.png'),metadata=await atlas.metadata();
if(!metadata.hasAlpha)throw Error('Foliage atlas needs real transparency.');
const stats=await atlas.stats();
if(stats.channels[3].min!==0)throw Error('Foliage atlas backdrop is not transparent.');
const w=metadata.width!,h=metadata.height!;
for(let i=0;i<8;i++){
  const x=Math.floor(i%4*w/4),y=Math.floor(Math.floor(i/4)*h/2);
  const crop=await sharp('assets/maps/maze-foliage-source-v2.png').extract({left:x,top:y,width:Math.floor(w/4),height:Math.floor(h/2)}).png().toBuffer();
  await writeFile(`assets/maps/maze-foliage-${i+1}-v2.png`,await sharp(crop).trim({background:'#00000000',threshold:1}).resize(64,64,{fit:'contain',background:'#00000000',kernel:'nearest'}).png().toBuffer());
}
console.log('Prepared two continuous ground plates and eight transparent foliage sprites.');
