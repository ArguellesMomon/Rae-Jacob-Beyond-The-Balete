import { isRainlitMap, rainlitHint, rainlitObjective } from './rainlit.ts';
import type { BagtasTopic, BambooForkId, ChapterTwoProgress, InteractionId, Progress } from './model.ts';
import { freshChapterTwo } from './model.ts';
import { currentMaze, mazeCodes, mazeGateCodes, MAZE_FORK_IDS, MAZE_TRIALS, RUNES, newMazeSeed } from './mazeTrials.ts';
export const isChapterTwoMap = (id: string) => id === 'bamboo' || id === 'turning' || isRainlitMap(id);
export const FORKS: BambooForkId[] = [...MAZE_FORK_IDS];
export const LANDMARKS = ['Split stone', 'Bent bamboo', 'Running water'] as const;
export const MAZE_MARKS = [...LANDMARKS, 'Hollow stone', 'Still water', 'Severed reed', 'Forked shadow'] as const;
export type Landmark = typeof MAZE_MARKS[number];
export const PROOF_NOTES = ['pathStone', 'pathWind', 'pathWater'] as const;
/** The sketches move between forks; the next landmark stays on the page. */
export function forkOrder(step: number): number { return [0, 3, 1][Math.min(2, Math.max(0, step))]; }
export function landmarkAt(id: BambooForkId, step: number, seed = 0, loops = 0): Landmark {
  return mazeCodes(seed,Math.min(2,step),loops).find(g=>g.id===id)!.mark;
}
export function routeReady(p: Progress): boolean {
  return p.chapterTwo.metBagtas && p.chapterTwo.turningSeen && !p.chapterTwo.routeVerified;
}
export function followsRoute(p: Progress, id: BambooForkId) {
  return currentMaze(p).goal.id===id;
}
export function parseChapterTwo(value: unknown, eligible: boolean, map: string): ChapterTwoProgress {
  if (!eligible) return freshChapterTwo();
  const p = value && typeof value === 'object' ? value as Partial<ChapterTwoProgress> : {};
  const inBamboo = isChapterTwoMap(map), inTurning = map === 'turning';
  const debriefSeen = p.debriefSeen === true;
  const routeVerified = p.routeVerified === true || debriefSeen;
  const step = routeVerified ? 3 : typeof p.trailStep === 'number' && Number.isFinite(p.trailStep) ? Math.min(2, Math.max(0, Math.floor(p.trailStep))) : 0;
  const turningVisited = p.turningVisited === true || inTurning || routeVerified || step > 0;
  const metBagtas = p.metBagtas === true || turningVisited;
  return { visited: p.visited === true || inBamboo || metBagtas, arrivalSeen: p.arrivalSeen === true || metBagtas,
    metBagtas, turningVisited, turningSeen: p.turningSeen === true || routeVerified || step > 0,
    trailStep: step, routeVerified, debriefSeen, glamourBroken: routeVerified || p.glamourBroken === true,
    mazeSeed: typeof p.mazeSeed === 'number' && Number.isInteger(p.mazeSeed) && p.mazeSeed >= 0 && p.mazeSeed <= 4294967295 ? p.mazeSeed : 0,
    mazeWitnesses: [0,1,2].map(i=>Array.isArray(p.mazeWitnesses)&&Number.isInteger(p.mazeWitnesses[i])&&p.mazeWitnesses[i]>=0&&p.mazeWitnesses[i]<=3?p.mazeWitnesses[i]:0) as [number,number,number],
    helperChats: Object.fromEntries(['tigmamanukan','dalisay'].flatMap(id=>{
      const value=p.helperChats?.[id as keyof ChapterTwoProgress['helperChats']];
      return typeof value==='number'&&Number.isFinite(value)&&value>0?[[id,Math.min(1_000_000,Math.floor(value))]]:[];
    })),
    loops: typeof p.loops === 'number' && Number.isFinite(p.loops) ? Math.min(9999, Math.max(0, Math.floor(p.loops))) : 0,
    topics: [...new Set((Array.isArray(p.topics) ? p.topics : []).filter(t => ['paths', 'stories', 'seals'].includes(t)))] };
}
export function chapterTwoAction(p: Progress, id: InteractionId): Progress | null {
  const c = p.chapterTwo;
  if(id==='tigmamanukan'||id==='dalisay')return c.turningSeen&&c.metBagtas
    ?{...p,chapterTwo:{...c,helperChats:{...c.helperChats,[id]:Math.min(1_000_000,(c.helperChats[id]??0)+1)}}}:p;
  if (id === 'bambooArrival') return { ...p, chapterTwo: { ...c, arrivalSeen: true } };
  if (id === 'bagtas') return { ...p, chapterTwo: { ...c, metBagtas: true, mazeSeed: c.metBagtas ? c.mazeSeed : c.mazeSeed || newMazeSeed() } };
  if (id === 'mazeWitnessA' || id === 'mazeWitnessB') {
    if (!c.turningSeen || c.routeVerified) return p;
    const notes = [...c.mazeWitnesses] as [number,number,number]; notes[Math.min(2,c.trailStep)] |= id==='mazeWitnessA'?1:2;
    return {...p,chapterTwo:{...c,mazeWitnesses:notes}};
  }
  if (id === 'turningArrival') return { ...p, chapterTwo: { ...c, turningSeen: true } };
  if (id === 'turningCharm') return c.turningSeen && c.trailStep === 2 && p.discoveries.includes('pathWater') ? { ...p, chapterTwo: { ...c, glamourBroken: true } } : p;
  if (id === 'bagtasDebrief') return c.routeVerified ? { ...p, chapterTwo: { ...c, debriefSeen: true } } : p;
  const topic: BagtasTopic | null = id === 'bagtasPaths' ? 'paths' : id === 'bagtasStories' ? 'stories' : id === 'bagtasSeals' ? 'seals' : null;
  if (topic) return { ...p, chapterTwo: { ...c, topics: [...new Set([...c.topics, topic])] } };
  if (FORKS.includes(id as BambooForkId)) {
    if (!c.metBagtas || !c.turningSeen || c.routeVerified) return p;
    if(!followsRoute(p,id as BambooForkId)||!routeReady(p))return p;
    const step=c.trailStep+1,proof=PROOF_NOTES[Math.min(2,c.trailStep)];
    return { ...p, discoveries:[...new Set([...p.discoveries,proof])], chapterTwo: { ...c, trailStep: step, routeVerified: step === 3, glamourBroken:c.glamourBroken||step===3 } };
  }
  if (['bambooDeparture', 'turningEntry', 'bambooReturn', 'turningReturn'].includes(id)) return p;
  return null;
}
export function chapterTwoObjective(p: Progress, map: string) {
  const c = p.chapterTwo;
  if (c.debriefSeen) return rainlitObjective(p, map);
  if (!c.metBagtas) return 'Find the owner of those hoofbeats. Speak to Bagtas.';
  if (!c.routeVerified) return map === 'turning' ? `Trial ${c.trailStep+1}/3 · Find one ${LANDMARKS[c.trailStep].toLowerCase()} sign. Watch the bird; follow petals or ask Dalisay.` : 'Enter Turning Paths to continue your current trial.';
  return c.debriefSeen ? 'A route verified together. Explore, or revisit the restored clearing.' : 'Return to Bagtas. Show him the route you checked together.';
}
export function chapterTwoHint(p: Progress, level: number) {
  if (p.chapterTwo.debriefSeen) return rainlitHint(p, level);
  if (!p.chapterTwo.metBagtas) return 'The tall traveler stands by the shelter in Bamboo Verge. He knows who called from the bamboo.';
  if (p.chapterTwo.routeVerified) return p.chapterTwo.debriefSeen ? 'This first Chapter 2 route is complete. The clearing and both bamboo maps remain open to explore.' : 'Bagtas is waiting by the Bamboo Verge shelter. Tell him what stayed true in the turning paths.';
  const plan=currentMaze(p), trial=MAZE_TRIALS[plan.stage];
  if(level<2)return `Only one destination sign is needed. Small worn arrows appear every few stretches. Fallen white petals lead into the right branch, and tied leaves confirm the route. Watch the Tigmamanukan's short flight near the entrance, or ask Aling Dalisay in the side clearing. Their help stays optional.`;
  const describe=(point:{x:number;y:number})=>`${point.y<plan.height/3?'northern':point.y>plan.height*2/3?'southern':'central'} ${point.x<plan.width/3?'western':point.x>plan.width*2/3?'eastern':'middle'} trails`;
  return `The ${LANDMARKS[plan.stage].toLowerCase()} sign is in the ${describe(plan.goal.point)}. The Tigmamanukan perches near the start; Aling Dalisay rests farther along the real route. Inspect the bird or ask her for the next direction. If badly lost, Pause → Return to this trial’s entrance keeps every earned trial. Reading the single sign is all you need.`;
}
