import type { BambooForkId, Point, Progress, Rect } from './model.ts';

export const MAZE_SIZE = { width: 1536, height: 1152 };
export const MAZE_CAMERA_ZOOM = 1.35;
export const MAZE_COLS = 23, MAZE_ROWS = 17, MAZE_CELL = 64;
export const MAZE_FORK_IDS: readonly BambooForkId[] = ['forkWest', 'forkNorth', 'forkEast', 'forkMoss', 'forkMist', 'forkShade', 'forkReed'];
export const RUNES = ['sun', 'moon', 'leaf', 'drop'] as const;
export const MAZE_TRIALS = [
  { id: 'stone', name: 'The Divided Stone', proof: 'pathStone', rule: 'Read the split-stone sign. Look for petals, leaf ties and occasional worn arrows.' },
  { id: 'wind', name: 'The Backward Wind', proof: 'pathWind', rule: 'Read the bowed-bamboo sign. Watch the omen bird, or ask Aling Dalisay for the next turn.' },
  { id: 'water', name: 'The Borrowed Current', proof: 'pathWater', rule: 'Read the running-water sign. Fallen white petals confirm the correct branches.' },
] as const;
export const trialIndex = (p: Progress) => Math.min(2, Math.max(0, p.chapterTwo.trailStep));
export function mazeRandom(seed: number) {
  let value = seed >>> 0;
  return () => { value += 0x6D2B79F5; let t = value; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export const newMazeSeed = () => (Math.floor(Math.random() * 4294967295) >>> 0) || 1;
export const mazePoint = (node: number): Point => ({ x: 64 + node % MAZE_COLS * MAZE_CELL, y: 64 + Math.floor(node / MAZE_COLS) * MAZE_CELL });
const key = (a: number, b: number) => a < b ? `${a}:${b}` : `${b}:${a}`;
export type MazePlan = {
  seed: number; stage: number; id: string; name: string; width: number; height: number;
  links: readonly (readonly number[])[]; edges: readonly (readonly [number, number])[];
  spawn: Point; entryNode: number; proof: Point; witnesses: readonly [Point, Point]; charm: Point;
  gates: readonly { id: BambooForkId; point: Point; node: number }[];
  goal: { id:BambooForkId; point:Point; node:number }; goalDistances:readonly number[];
  floor: readonly Rect[]; colliders: readonly Rect[]; witnessRunes: readonly [number, number];
  rest: { node:number; next:number; routeIndex:number; point:Point; clearing:Rect; footing:Rect };
};
const cache = new Map<string, MazePlan>();
export function mazeDistances(links: readonly (readonly number[])[], start: number) {
  const distances = Array(links.length).fill(-1) as number[], queue = [start]; distances[start] = 0;
  for (let i = 0; i < queue.length; i++) for (const next of links[queue[i]]) if (distances[next] < 0) { distances[next] = distances[queue[i]] + 1; queue.push(next); }
  return distances;
}
export function mazePlan(seed = 0, stage = 0): MazePlan {
  stage = Math.min(2, Math.max(0, Math.floor(stage))); seed >>>= 0;
  const id = `${seed}:${stage}:guided`, cached = cache.get(id); if (cached) return cached;
  const random = mazeRandom((seed ^ Math.imul(stage + 1, 0x9e3779b9)) >>> 0);
  const count = MAZE_COLS * MAZE_ROWS, links: number[][] = Array.from({ length: count }, () => []), edges: [number, number][] = [], connected = new Set<string>();
  const neighbors = (node: number) => [node % MAZE_COLS > 0 ? node - 1 : -1, node % MAZE_COLS < MAZE_COLS - 1 ? node + 1 : -1, node >= MAZE_COLS ? node - MAZE_COLS : -1, node < count - MAZE_COLS ? node + MAZE_COLS : -1].filter(n => n >= 0);
  const connect = (a: number, b: number) => { if (connected.has(key(a,b))) return; connected.add(key(a,b)); links[a].push(b); links[b].push(a); edges.push([a,b]); };
  const entryNode = stage === 0 ? (MAZE_ROWS - 1) * MAZE_COLS + 11 : stage === 1 ? 8 * MAZE_COLS : 11;
  const stack = [entryNode], seen = new Set(stack);
  while (stack.length) {
    const node = stack[stack.length - 1], options = neighbors(node).filter(n => !seen.has(n));
    if (!options.length) { stack.pop(); continue; }
    const next = options[Math.floor(random() * options.length)]; connect(node, next); seen.add(next); stack.push(next);
  }
  // A handful of cycles create alternative routes without dissolving the maze.
  for (let i = 0; i < 8 + stage * 5; i++) {
    const node = Math.floor(random() * count), choices = neighbors(node).filter(n => !connected.has(key(node,n)));
    if (choices.length) connect(node, choices[Math.floor(random() * choices.length)]);
  }
  const chosen = [entryNode], fields = [mazeDistances(links, entryNode)];
  const chooseRemote = () => {
    let best = -1, score = -1;
    for (let node = 0; node < count; node++) {
      if (chosen.includes(node)) continue;
      const nearest = Math.min(...fields.map(d => d[node]));
      const value = nearest * 3 + fields[0][node] * .12 + (links[node].length === 1 ? 5 : 0) + random();
      if (value > score) { score = value; best = node; }
    }
    chosen.push(best); fields.push(mazeDistances(links,best)); return best;
  };
  const proofNode = chooseRemote(), witnessA = chooseRemote(), witnessB = chooseRemote(), charmNode = chooseRemote();
  const gates = MAZE_FORK_IDS.map(id => { const node = chooseRemote(); return { id, node, point: mazePoint(node) }; });
  // Keep the existing seeded forest and save positions, but put the sole active
  // destination a short, bounded walk away instead of at the graph's remote end.
  const distances=fields[0],minimum=12+stage*2,maximum=16+stage*2;
  let options=distances.map((distance,node)=>({distance,node})).filter(v=>v.distance>=minimum&&v.distance<=maximum);
  const ends=options.filter(v=>links[v.node].length===1);if(ends.length)options=ends;
  const goalRandom=mazeRandom(seed^Math.imul(stage+1,238977));
  const goalNode=options[Math.floor(goalRandom()*options.length)].node;
  const goal={id:MAZE_FORK_IDS[stage],node:goalNode,point:mazePoint(goalNode)};
  if(!chosen.includes(goalNode))chosen.push(goalNode);
  const route=mazeNodeRoute({links},entryNode,goalNode),middle=Math.floor((route.length-1)*.6);
  // A side clearing stays within the gap between grid roads. It cannot join two
  // unconnected corridors, and a seated giantess never occupies the walking core.
  const candidates=route.slice(3,-2).map((_,i)=>i+3).sort((a,b)=>Math.abs(a-middle)-Math.abs(b-middle));
  const restIndex=candidates.find(i=>mazePoint(route[i]).x===mazePoint(route[i+1]).x)??middle;
  const ra=mazePoint(route[restIndex]),rb=mazePoint(route[restIndex+1]);
  const center={x:(ra.x+rb.x)/2,y:(ra.y+rb.y)/2},vertical=ra.x===rb.x;
  const restPoint={x:center.x+(vertical?26:0),y:center.y+(vertical?0:26)};
  const rest={node:route[restIndex],next:route[restIndex+1],routeIndex:restIndex,point:restPoint,
    clearing:vertical?{x:center.x-16,y:center.y-24,width:56,height:48}:{x:center.x-24,y:center.y-16,width:48,height:56},
    footing:{x:restPoint.x-13,y:restPoint.y-6,width:26,height:6}};
  const floor: Rect[] = [];
  for (let node = 0; node < count; node++) { const {x,y} = mazePoint(node); floor.push({x:x-16,y:y-16,width:32,height:32}); }
  for (const [a,b] of edges) {
    const p = mazePoint(a), q = mazePoint(b);
    floor.push({ x:Math.min(p.x,q.x)-16,y:Math.min(p.y,q.y)-16,width:Math.abs(p.x-q.x)+32,height:Math.abs(p.y-q.y)+32 });
  }
  // Clearings support close inspection, turning and a companion beside each clue.
  for (const node of chosen) { const {x,y} = mazePoint(node); floor.push({x:x-24,y:y-24,width:48,height:48}); }
  floor.push(rest.clearing);
  const tilesWide = MAZE_SIZE.width / 8, tilesHigh = MAZE_SIZE.height / 8, ground = new Uint8Array(tilesWide * tilesHigh);
  for (const r of floor) for (let y = r.y/8; y < (r.y+r.height)/8; y++) for (let x=r.x/8; x < (r.x+r.width)/8; x++) ground[y*tilesWide+x]=1;
  const colliders: Rect[] = [], previous = new Map<string,Rect>();
  for (let y = 0; y < tilesHigh; y++) {
    const active = new Map<string,Rect>();
    for (let x = 0; x < tilesWide;) {
      if (ground[y*tilesWide+x]) {x++;continue;}
      const start=x; while(x<tilesWide&&!ground[y*tilesWide+x]) x++;
      const signature=`${start}:${x}`, above=previous.get(signature);
      if(above&&above.y+above.height===y*8){above.height+=8;active.set(signature,above);}
      else {const r={x:start*8,y:y*8,width:(x-start)*8,height:8};colliders.push(r);active.set(signature,r);}
    }
    previous.clear(); for(const [k,v] of active) previous.set(k,v);
  }
  // Footprints match the visible clue slabs, leaving their southern inspection edge open.
  colliders.push({x:goal.point.x+8,y:goal.point.y-9,width:4,height:4});
  const spawn = mazePoint(entryNode), first = Math.floor(random()*4), second=(first+1+Math.floor(random()*3))%4;
  const result: MazePlan = { ...MAZE_SIZE, seed,stage,id,name:MAZE_TRIALS[stage].name,links,edges,spawn,entryNode,proof:mazePoint(proofNode),witnesses:[mazePoint(witnessA),mazePoint(witnessB)],charm:mazePoint(charmNode),gates,goal,goalDistances:mazeDistances(links,goalNode),floor,colliders,rest,witnessRunes:[first,second] };
  if(cache.size>=16)cache.delete(cache.keys().next().value!); cache.set(id,result); return result;
}
export const currentMaze = (p: Progress) => mazePlan(p.chapterTwo.mazeSeed,trialIndex(p));
/** Every marker points along an actual corridor and strictly closer to the sign. */
export function mazeGuideNext(plan:MazePlan,node:number):number|null {
  if(node===plan.goal.node)return null;
  return plan.links[node].find(next=>plan.goalDistances[next]===plan.goalDistances[node]-1)??null;
}
export function mazeRuneAnswer(plan: MazePlan): readonly [number,number] {
  const [a,b]=plan.witnessRunes;
  return plan.stage===0?[a,b]:plan.stage===1?[b,a]:[(a+1)%4,(b+1)%4];
}
/** Gate positions stay learnable; only their invitations shuffle after a failed turn. */
export function mazeGateCodes(p: Progress) {
  return mazeCodes(p.chapterTwo.mazeSeed,trialIndex(p),p.chapterTwo.loops);
}
export function mazeCodes(seed: number, stage: number, loops = 0) {
  const plan=mazePlan(seed,stage), random=mazeRandom((plan.seed ^ Math.imul(plan.stage+1,197933) ^ Math.imul(loops+1,83492791))>>>0);
  const order=[...MAZE_FORK_IDS]; for(let i=order.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
  const answer=mazeRuneAnswer(plan), marks=['Split stone','Bent bamboo','Running water','Hollow stone','Still water','Severed reed','Forked shadow'] as const;
  return order.map((id,i)=>({id,mark:i<2?marks[plan.stage]:marks[(plan.stage+i)%7],runes:i===0?answer:i===1?[answer[0],(answer[1]+1)%4] as const:[Math.floor(random()*4),Math.floor(random()*4)] as const,correct:i===0}));
}
/** Node path for reviews and guided hints; gameplay movement still uses real collisions. */
export function mazeNodeRoute(plan: Pick<MazePlan,'links'>, start: number, goal: number): number[] {
  const queue=[start], parent=Array(plan.links.length).fill(-1) as number[]; parent[start]=start;
  for(let i=0;i<queue.length&&parent[goal]<0;i++)for(const next of plan.links[queue[i]])if(parent[next]<0){parent[next]=queue[i];queue.push(next);}
  const route=[goal];while(route[route.length-1]!==start)route.push(parent[route[route.length-1]]);return route.reverse();
}
