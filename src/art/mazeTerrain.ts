import { currentMaze, mazeRandom } from '../game/mazeTrials.ts';
import type { Progress } from '../game/model.ts';
import { mazePlants } from './mazeVegetation.ts';
import type { MazePlant } from './mazeVegetation.ts';

export type { MazePlant } from './mazeVegetation.ts';
export type MazeTerrain = { path:string; fringe:string; plants:readonly MazePlant[] };
const cache = new Map<string,MazeTerrain>();
const CELL=4;

/** One continuous ground painting, cut with a united organic trail boundary.
 * Art never defines movement: the painted margin surrounds the unchanged foot surface. */
export function mazeTerrain(p:Progress):MazeTerrain {
  const plan=currentMaze(p),old=cache.get(plan.id);if(old)return old;
  const width=plan.width/CELL,height=plan.height/CELL,stride=width+1;
  const ground=new Uint8Array(width*height);
  for(const rect of plan.floor){
    // Four pixels of safe margin leaves room for the rounded boundary and tiny jitter.
    for(let y=Math.max(0,Math.floor((rect.y-4)/CELL));y<Math.min(height,Math.ceil((rect.y+rect.height+4)/CELL));y++)
      for(let x=Math.max(0,Math.floor((rect.x-4)/CELL));x<Math.min(width,Math.ceil((rect.x+rect.width+4)/CELL));x++)ground[y*width+x]=1;
  }
  const has=(x:number,y:number)=>x>=0&&y>=0&&x<width&&y<height&&ground[y*width+x]===1;
  type Edge={a:number;b:number;direction:number;used?:boolean};
  const outgoing=new Map<number,Edge[]>(),edges:Edge[]=[];
  const add=(ax:number,ay:number,bx:number,by:number,direction:number)=>{
    const edge={a:ay*stride+ax,b:by*stride+bx,direction};edges.push(edge);
    const list=outgoing.get(edge.a)||[];list.push(edge);outgoing.set(edge.a,list);
  };
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(has(x,y)){
    if(!has(x,y-1))add(x,y,x+1,y,0);
    if(!has(x+1,y))add(x+1,y,x+1,y+1,1);
    if(!has(x,y+1))add(x+1,y+1,x,y+1,2);
    if(!has(x-1,y))add(x,y+1,x,y,3);
  }
  const random=mazeRandom(plan.seed^Math.imul(plan.stage+1,73471)),loops:number[][]=[];
  for(const first of edges){
    if(first.used)continue;
    const loop:number[]=[];let edge=first;
    do{
      edge.used=true;loop.push(edge.a);
      const next=(outgoing.get(edge.b)||[]).filter(e=>!e.used);
      // At diagonal contact, follow the right-hand boundary rather than crossing contours.
      next.sort((a,b)=>[1,0,3,2].indexOf((a.direction-edge.direction+4)%4)-[1,0,3,2].indexOf((b.direction-edge.direction+4)%4));
      if(!next.length)break;edge=next[0];
    }while(edge!==first&&!edge.used);
    if(loop.length>2)loops.push(loop);
  }
  let path='',fringe='';
  for(const loop of loops){
    const points=loop.map(v=>({x:v%stride*CELL,y:Math.floor(v/stride)*CELL}));
    // Keep corners and periodic intermediate points; no rectangle overlaps remain.
    const points2=points.filter((v,i)=>{
      const before=points[(i+points.length-1)%points.length],after=points[(i+1)%points.length];
      return i%3===0||(v.x-before.x)*(after.y-v.y)!==(v.y-before.y)*(after.x-v.x);
    }).map(v=>({x:v.x+(random()-.5)*2,y:v.y+(random()-.5)*2}));
    const f=(n:number)=>n.toFixed(1);
    const last=points2[points2.length-1],first=points2[0];
    path+=`M${f((last.x+first.x)/2)} ${f((last.y+first.y)/2)}`;
    for(let i=0;i<points2.length;i++){
      const v=points2[i],next=points2[(i+1)%points2.length];
      path+=`Q${f(v.x)} ${f(v.y)} ${f((v.x+next.x)/2)} ${f((v.y+next.y)/2)}`;
    }
    path+='Z';
    // Leaf-sized irregular fringes replace a hard, unbroken outline at the soil edge.
    for(let i=0;i<points.length;i+=3){
      if(random()>.42)continue;
      const v=points[i],size=1+Math.floor(random()*3);
      fringe+=`<path d="M${v.x-1} ${v.y}h${size}v1h1v${size-1}h-${size}z" fill="${['#617340','#788449','#a59c58','#3e5935'][Math.floor(random()*4)]}" opacity=".45"/>`;
    }
  }
  const plants=mazePlants(p);
  const result={path,fringe,plants};if(cache.size>=16)cache.delete(cache.keys().next().value!);cache.set(plan.id,result);return result;
}

export const MAZE_TINTS=[{color:'#294c42',opacity:.10},{color:'#a78d36',opacity:.08},{color:'#244f55',opacity:.18}] as const;
