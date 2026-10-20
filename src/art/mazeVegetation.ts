import { currentMaze, mazeRandom } from '../game/mazeTrials.ts';
import type { Progress } from '../game/model.ts';
export type MazePlant={x:number;y:number;width:number;height:number;sprite:number};
const cache=new Map<string,readonly MazePlant[]>();

/** Independent from contour tracing, so phones need not build off-screen paths to place plants. */
export function mazePlants(p:Progress):readonly MazePlant[]{
  const plan=currentMaze(p),old=cache.get(plan.id);if(old)return old;
  const random=mazeRandom(plan.seed^Math.imul(plan.stage+1,87463)),plants:MazePlant[]=[];
  for(let y=32;y<plan.height-20;y+=32)for(let x=32;x<plan.width-20;x+=32){
    const px=x+Math.floor(random()*5)-2,py=y+12+Math.floor(random()*5)-2;
    if(random()>.55)continue;
    const width=21+Math.floor(random()*7),height=width;
    const box={x:px-width/2-2,y:py-height-2,width:width+4,height:height+4};
    if(plan.floor.some(r=>box.x<r.x+r.width&&box.x+box.width>r.x&&box.y<r.y+r.height&&box.y+box.height>r.y))continue;
    plants.push({x:px-width/2,y:py-height,width,height,sprite:Math.floor(random()*8)});
  }
  if(cache.size>=6)cache.delete(cache.keys().next().value!);cache.set(plan.id,plants);return plants;
}
