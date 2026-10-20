import { mazeGuideNext, mazeNodeRoute, mazePoint, mazeRandom } from './mazeTrials.ts';
import type { MazePlan } from './mazeTrials.ts';
import type { Direction, Point, Rect, TrailHelperId } from './model.ts';

export type TrailHelper = { id:TrailHelperId; node:number; next:number; point:Point; facing:Direction; routeIndex:number; footing:Rect };
export type TrailMark = { node:number; next:number; point:Point; facing:Direction };
export type TrailClue = TrailMark & { kind:'petals'|'leaves' };
export type TrailWayfinding = { route:readonly number[]; arrows:readonly TrailMark[]; clues:readonly TrailClue[]; helpers:readonly TrailHelper[]; inspect:TrailClue };
const cache=new Map<string,TrailWayfinding>();
const direction=(from:Point,to:Point):Direction=>to.x>from.x?'right':to.x<from.x?'left':to.y>from.y?'down':'up';
const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
export const trailDirectionWords={up:'north (up the path)',down:'south (down the path)',left:'west (left)',right:'east (right)'} as const;

/** Sparser landmarks share the same shortest-path graph as the destination. No new quest gates. */
export function mazeWayfinding(plan:MazePlan):TrailWayfinding {
  const old=cache.get(plan.id);if(old)return old;
  const route=mazeNodeRoute(plan,plan.entryNode,plan.goal.node),arrows:TrailMark[]=[],clues:TrailClue[]=[];
  const mark=(node:number,next:number):TrailMark=>{
    const a=mazePoint(node),b=mazePoint(next);
    return {node,next,point:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},facing:direction(a,b)};
  };
  const bird=mark(route[1],route[2]),vertical=bird.facing==='up'||bird.facing==='down';
  const perch={x:bird.point.x+(vertical?10:0),y:bird.point.y+(vertical?0:11)};
  const helpers:TrailHelper[]=[
    {...bird,id:'tigmamanukan',point:perch,routeIndex:1,footing:{x:perch.x-3,y:perch.y-3,width:6,height:3}},
    {id:'dalisay',node:plan.rest.node,next:plan.rest.next,point:plan.rest.point,routeIndex:plan.rest.routeIndex,
      facing:direction(mazePoint(plan.rest.node),mazePoint(plan.rest.next)),footing:plan.rest.footing},
  ];
  const addArrow=(node:number)=>{
    const next=mazeGuideNext(plan,node);if(next===null)return;
    const m=mark(node,next);
    if(arrows.some(a=>distance(a.point,m.point)<160)||helpers.some(h=>distance(h.point,m.point)<36))return;
    arrows.push(m);
  };
  // First mark confirms the start. Others occur about every three corridor
  // lengths, with physical separation even when the winding route folds back.
  for(let i=0;i<route.length-1;i+=3)addArrow(route[i]);
  // A handful of distant recovery marks help a wandering player, without
  // carpeting every branch in arrows or implying the other paths are goals.
  const random=mazeRandom(plan.seed^Math.imul(plan.stage+1,88731));
  const candidates=plan.links.map((_,node)=>({node,order:random()})).filter(v=>plan.goalDistances[v.node]%5===0).sort((a,b)=>a.order-b.order);
  for(const {node}of candidates)addArrow(node);
  for(let i=1;i<route.length-1;i++){
    const previous=mazePoint(route[i-1]),here=mazePoint(route[i]),next=mazePoint(route[i+1]);
    const turn=direction(previous,here)!==direction(here,next),junction=plan.links[route[i]].length>2;
    if(turn||junction||i%3===0){
      const m=mark(route[i],route[i+1]);
      // Put a little trail of petals into the correct branch, close enough to
      // see from its junction. These grow neither an obstruction nor a new task.
      clues.push({...m,point:{x:here.x+(next.x-here.x)*.22,y:here.y+(next.y-here.y)*.22},kind:turn||junction?'petals':'leaves'});
    }
  }
  const inspect=clues.find(c=>c.kind==='petals'&&helpers.every(h=>distance(h.point,c.point)>38)&&distance(c.point,plan.goal.point)>40)
    ??{...mark(route[3],route[4]),kind:'petals' as const};
  if(!clues.includes(inspect))clues.push(inspect);
  const result={route,arrows,clues,helpers,inspect};
  if(cache.size>=16)cache.delete(cache.keys().next().value!);cache.set(plan.id,result);return result;
}

/** Exact directions are generated from the current seeded trail, never a fixed compass guess. */
export function helperDirections(plan:MazePlan,id:TrailHelperId) {
  const way=mazeWayfinding(plan),helper=way.helpers.find(h=>h.id===id)!;
  const first=`From here, head ${trailDirectionWords[helper.facing]}.`;
  for(let i=helper.routeIndex+1;i<way.route.length-1;i++){
    const incoming=direction(mazePoint(way.route[i-1]),mazePoint(way.route[i]));
    const outgoing=direction(mazePoint(way.route[i]),mazePoint(way.route[i+1]));
    if(incoming!==outgoing||plan.links[way.route[i]].length>2)return `${first} At the next ${plan.links[way.route[i]].length>2?'junction':'bend'}, take the path ${trailDirectionWords[outgoing]}. The fallen white petals continue into that branch.`;
  }
  return `${first} Keep to this path until the destination sign. You are on the final stretch.`;
}
