import { currentMaze } from '../game/mazeTrials.ts';
import type { Progress, Rect } from '../game/model.ts';
import { mazePlants } from './mazeVegetation.ts';

export const TERRAIN_CHUNK_SIZE=256;
export type TerrainChunk=Rect&{id:string;path:string;fringe:string};
const cache=new Map<string,TerrainChunk>();
const intersects=(a:Rect,b:Rect)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;

export function mazeVisibleRegion(view:Rect){
  const size=TERRAIN_CHUNK_SIZE,margin=32;
  return {left:Math.max(0,Math.floor((view.x-margin)/size)),top:Math.max(0,Math.floor((view.y-margin)/size)),
    right:Math.floor((view.x+view.width+margin)/size),bottom:Math.floor((view.y+view.height+margin)/size)};
}

export function mazeRegionBounds(plan:{width:number;height:number},region:ReturnType<typeof mazeVisibleRegion>):Rect{
  const x=region.left*TERRAIN_CHUNK_SIZE,y=region.top*TERRAIN_CHUNK_SIZE;
  return {x,y,width:Math.min(plan.width,(region.right+1)*TERRAIN_CHUNK_SIZE)-x,height:Math.min(plan.height,(region.bottom+1)*TERRAIN_CHUNK_SIZE)-y};
}

/** Trace small joined regions once. Native frames never draw the whole forest's contour. */
export function mazeTerrainChunk(p:Progress,column:number,row:number):TerrainChunk {
  const plan=currentMaze(p),size=TERRAIN_CHUNK_SIZE,id=`${plan.id}:${column}:${row}`,old=cache.get(id);if(old)return old;
  const x=column*size,y=row*size,width=Math.min(size,plan.width-x),height=Math.min(size,plan.height-y);
  const cell=4,ox=x-cell,oy=y-cell,cols=width/cell+2,rows=height/cell+2,stride=cols+1;
  const ground=new Uint8Array(cols*rows),bounds={x:ox,y:oy,width:width+8,height:height+8};
  for(const rect of plan.floor){
    if(!intersects({...rect,x:rect.x-4,y:rect.y-4,width:rect.width+8,height:rect.height+8},bounds))continue;
    for(let gy=Math.max(0,Math.floor((rect.y-4-oy)/cell));gy<Math.min(rows,Math.ceil((rect.y+rect.height+4-oy)/cell));gy++)
      for(let gx=Math.max(0,Math.floor((rect.x-4-ox)/cell));gx<Math.min(cols,Math.ceil((rect.x+rect.width+4-ox)/cell));gx++)ground[gy*cols+gx]=1;
  }
  const has=(gx:number,gy:number)=>gx>=0&&gy>=0&&gx<cols&&gy<rows&&ground[gy*cols+gx]===1;
  type Edge={a:number;b:number;direction:number;used?:boolean};
  const outgoing=new Map<number,Edge[]>(),edges:Edge[]=[];
  const add=(ax:number,ay:number,bx:number,by:number,direction:number)=>{
    const edge={a:ay*stride+ax,b:by*stride+bx,direction};edges.push(edge);
    const list=outgoing.get(edge.a)??[];list.push(edge);outgoing.set(edge.a,list);
  };
  for(let gy=0;gy<rows;gy++)for(let gx=0;gx<cols;gx++)if(has(gx,gy)){
    if(!has(gx,gy-1))add(gx,gy,gx+1,gy,0);
    if(!has(gx+1,gy))add(gx+1,gy,gx+1,gy+1,1);
    if(!has(gx,gy+1))add(gx+1,gy+1,gx,gy+1,2);
    if(!has(gx-1,gy))add(gx,gy+1,gx,gy,3);
  }
  let path='',fringe='';
  // Coordinate-based flecks match at neighboring chunk boundaries.
  const hash=(px:number,py:number)=>((Math.imul(px+plan.seed,374761393)^Math.imul(py+plan.stage,668265263))>>>0);
  for(const first of edges){
    if(first.used)continue;
    const loop:number[]=[];let edge=first;
    do{
      edge.used=true;loop.push(edge.a);
      const next=(outgoing.get(edge.b)??[]).filter(e=>!e.used);
      next.sort((a,b)=>[1,0,3,2].indexOf((a.direction-edge.direction+4)%4)-[1,0,3,2].indexOf((b.direction-edge.direction+4)%4));
      if(!next.length)break;edge=next[0];
    }while(!edge.used);
    if(loop.length<3)continue;
    const points=loop.map(v=>({x:ox+v%stride*cell,y:oy+Math.floor(v/stride)*cell}));
    const corners=points.filter((v,i)=>{
      const a=points[(i+points.length-1)%points.length],b=points[(i+1)%points.length];
      return i%3===0||(v.x-a.x)*(b.y-v.y)!==(v.y-a.y)*(b.x-v.x);
    });
    const last=corners[corners.length-1],start=corners[0];
    path+=`M${(last.x+start.x)/2} ${(last.y+start.y)/2}`;
    for(let i=0;i<corners.length;i++){
      const a=corners[i],b=corners[(i+1)%corners.length];path+=`Q${a.x} ${a.y} ${(a.x+b.x)/2} ${(a.y+b.y)/2}`;
    }
    path+='Z';
    for(const point of corners){
      const n=hash(point.x,point.y);if(n%7>1)continue;
      fringe+=`<path d="M${point.x-1} ${point.y}h${1+n%3}v2h-2z" fill="${['#617340','#788449','#a59c58','#3e5935'][n%4]}" opacity="0.45"/>`;
    }
  }
  const chunk={id,x,y,width,height,path,fringe};
  if(cache.size>=192)cache.delete(cache.keys().next().value!);cache.set(id,chunk);return chunk;
}

export function mazeViewportTerrain(p:Progress,region:ReturnType<typeof mazeVisibleRegion>){
  const plan=currentMaze(p),chunks:TerrainChunk[]=[];
  for(let row=region.top;row<=region.bottom&&row*TERRAIN_CHUNK_SIZE<plan.height;row++)
    for(let column=region.left;column<=region.right&&column*TERRAIN_CHUNK_SIZE<plan.width;column++)chunks.push(mazeTerrainChunk(p,column,row));
  const bounds={x:region.left*TERRAIN_CHUNK_SIZE,y:region.top*TERRAIN_CHUNK_SIZE,width:(region.right-region.left+1)*TERRAIN_CHUNK_SIZE,height:(region.bottom-region.top+1)*TERRAIN_CHUNK_SIZE};
  return {chunks,plants:mazePlants(p).filter(plant=>intersects(plant,bounds))};
}
