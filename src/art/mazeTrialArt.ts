import { landmarkGlyph } from './bambooArt.ts';
import { plank } from './propMaterials.ts';
import { currentMaze, mazePoint, mazeGuideNext, MAZE_TRIALS } from '../game/mazeTrials.ts';
import type { Point, Progress, Rect } from '../game/model.ts';
import { mazeTerrain, MAZE_TINTS } from './mazeTerrain.ts';
import { mazeWayfinding } from '../game/mazeWayfinding.ts';
import { mazeVisibleRegion, mazeViewportTerrain } from './mazeViewport.ts';
const r=(x:number,y:number,w:number,h:number,c:string,opacity=1)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" opacity="${opacity}"/>`;
export function runeGlyph(rune:number,x:number,y:number,size=1) {
  let s='';
  if(rune===0)s=`<path d="M-3-3h6v6h-6zM-1-6h2v2h-2zM-1 4h2v2h-2zM-6-1h2v2h-2zM4-1h2v2H4z" fill="#efce82"/>`;
  if(rune===1)s='<path d="M0-5h4v2H1v6h3v2H0V3h-2v-6h2z" fill="#e4d7ad"/>';
  if(rune===2)s='<path d="M-4 2v-4h3v-3h5v5H1v3h-3v2h-2z" fill="#bfce91"/>';
  if(rune===3)s='<path d="M0-6h1v3h2v3h2v4H3v2h-5V4h-2V0h2v-3h2z" fill="#a6d5ca"/>';
  return `<g transform="translate(${x} ${y}) scale(${size})">${s}</g>`;
}
const cache=new Map<string,string>();
export function mazeMarkersSvg(p:Progress) {
  const plan=currentMaze(p), key=plan.id;
  const old=cache.get(key);if(old)return old;
  let s='<g transform="translate(10 0)">';
  const {x,y}=plan.goal.point;
  s+=`<g id="trial-destination"><ellipse cx="${x}" cy="${y-3}" rx="16" ry="4" fill="#152e23" opacity=".5"/>`;
  s+=plank(x-14,y-29,28,23,'trial-destination','wood')+r(x-12,y-27,24,2,'#e7c16f');
  s+=landmarkGlyph((['Split stone','Bent bamboo','Running water'] as const)[plan.stage],x,y-18);
  for(let i=0;i<=plan.stage;i++)s+=r(x-(plan.stage*2)+i*4,y-10,2,3,'#f4d793');
  s+='</g>';
  if(plan.stage===2)s+=`<path d="M${x+17} ${y-2}v-30m4 30v-28m4 28v-32" stroke="#6b8250" stroke-width="2"/>`;
  s+=plank(plan.spawn.x-12,plan.spawn.y+3,24,10,'maze-return')+`<path d="M${plan.spawn.x-5} ${plan.spawn.y+8}l5-4 5 4h-2v4h-6v-4z" fill="#b2c4b1"/>`+r(plan.spawn.x-1,plan.spawn.y+9,2,3,'#40594a');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${plan.width}" height="${plan.height}" viewBox="0 0 ${plan.width} ${plan.height}" shape-rendering="crispEdges">${s}</g></svg>`;
  if(cache.size>32)cache.clear();cache.set(key,svg);return svg;
}
/** Small, widely spaced carvings and natural clues replace the arrow carpet. */
const guideCache=new Map<string,string>();
export function mazeGuidesSvg(p:Progress){
  const plan=currentMaze(p),old=guideCache.get(plan.id);if(old)return old;
  const way=mazeWayfinding(plan);let s='';
  const angle={right:0,down:90,left:180,up:-90};
  for(const mark of way.arrows)s+=`<g id="trail-arrow-${mark.node}" transform="translate(${mark.point.x} ${mark.point.y}) rotate(${angle[mark.facing]})"><path d="M-4-1h4v-2l3 3-3 3V1h-4z" fill="#c4b383" opacity=".62"/><path d="M-3 1h3v1h-3zM1-1h1v1H1z" fill="#5b573b" opacity=".35"/></g>`;
  for(const clue of way.clues){
    let body='';
    if(clue.kind==='petals')for(const [x,y]of [[-8,1],[-5,-2],[-1,2],[3,-1],[7,1]])body+=r(x,y,1.5,1,'#f1ead1',.8)+r(x+.5,y+1,.8,.6,'#847b4b',.35);
    body+=`<g transform="translate(0 3) scale(.5)"><path d="M-6 5h9v1h-9z" fill="#7f6d43" opacity=".65"/><path d="M-1 4h1V2h2V1h1v3H1v2h-2zM0 5h2v1h2v2H1V7H0z" fill="#8d9c5f"/><path d="M-1 4v3" stroke="#c9b68a" stroke-width="1"/></g>`;
    s+=`<g id="trail-${clue.kind}-${clue.node}" transform="translate(${clue.point.x} ${clue.point.y}) rotate(${angle[clue.facing]})">${body}</g>`;
  }
  const result=`<svg xmlns="http://www.w3.org/2000/svg" width="${plan.width}" height="${plan.height}" shape-rendering="crispEdges">${s}</svg>`;
  if(guideCache.size>=16)guideCache.delete(guideCache.keys().next().value!);guideCache.set(plan.id,result);return result;
}
export function mazeFloorPath(p:Progress) {
  return mazeTerrain(p).path;
}
export function mazeTerrainMarkup(p:Progress,textures:readonly string[],prefix='trial',view?:Rect) {
  const plan=currentMaze(p),terrain=mazeTerrain(p),tint=MAZE_TINTS[plan.stage];
  const plate=(uri:string)=>`<image href="${uri}" width="${plan.width}" height="${plan.height}" preserveAspectRatio="xMidYMid slice" image-rendering="pixelated"/>`;
  const visible=view?mazeViewportTerrain(p,mazeVisibleRegion(view)):null;
  const plants=(visible?.plants??terrain.plants).map(plant=>`<ellipse cx="${plant.x+plant.width/2}" cy="${plant.y+plant.height-2}" rx="${plant.width*.4}" ry="2" fill="#122b22" opacity=".35"/><image href="${textures[2+plant.sprite]}" x="${plant.x}" y="${plant.y}" width="${plant.width}" height="${plant.height}"/>`).join('');
  if(visible){
    const chunks=visible.chunks.map((chunk,i)=>`<defs><clipPath id="${prefix}-tile-${i}"><rect x="${chunk.x}" y="${chunk.y}" width="${chunk.width}" height="${chunk.height}"/></clipPath><clipPath id="${prefix}-floor-${i}"><path d="${chunk.path}"/></clipPath></defs><g clip-path="url(#${prefix}-tile-${i})"><g clip-path="url(#${prefix}-floor-${i})">${plate(textures[0])}</g>${chunk.fringe}</g>`).join('');
    return `${plate(textures[1])}${chunks}${plants}<rect width="${plan.width}" height="${plan.height}" fill="${tint.color}" opacity="${tint.opacity}"/>`;
  }
  return `<defs><mask id="${prefix}-ground" maskUnits="userSpaceOnUse" x="0" y="0" width="${plan.width}" height="${plan.height}"><path d="${terrain.path}" fill="white" stroke="white" stroke-width="6" stroke-opacity=".08"/><path d="${terrain.path}" fill="white" stroke="white" stroke-width="2" stroke-opacity=".22"/></mask></defs>${plate(textures[1])}<g mask="url(#${prefix}-ground)">${plate(textures[0])}</g>${terrain.fringe}${plants}<rect width="${plan.width}" height="${plan.height}" fill="${tint.color}" opacity="${tint.opacity}"/>`;
}
export function mazeWitnessRecord(p:Progress) {
  return MAZE_TRIALS.map((trial,i)=>{
    if(i>p.chapterTwo.trailStep)return `${trial.name}: not entered.`;
    return `${trial.name}: ${i<p.chapterTwo.trailStep?'sign reached — trial complete.':`one sign to find. ${trial.rule}`} Worn arrows appear occasionally. Fallen white petals and leaf ties confirm the turns. Watch the Tigmamanukan or ask Aling Dalisay for the next branch; their help is optional.`;
  }).join('\n\n');
}
export function mazeGlamourSvg(p:Progress,clock:number,motion=true) {
  const plan=currentMaze(p),t=motion?Math.floor(clock*3)/3:1;
  let s='';
  for(const [i,gate] of [plan.goal].entries()) {
    const x=gate.point.x-14,y=gate.point.y+11,opacity=p.chapterTwo.glamourBroken?.05:.12+(Math.sin(t+i)+1)*.08;
    s+=`<path d="M${x} ${y}h3v4h-1v-3h-1v3h-1zM${x+12} ${y+6}h3v4h-1v-3h-1v3h-1z" fill="#daebcc" opacity="${opacity}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${plan.width}" height="${plan.height}">${s}</svg>`;
}
/** Restricts peripheral sight, never conceals Rae, Tala or the interaction immediately ahead. */
export const mazeSightRadius=(_stage:number)=>260;
