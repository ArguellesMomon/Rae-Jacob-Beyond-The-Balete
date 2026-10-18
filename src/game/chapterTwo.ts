import { isRainlitMap, rainlitHint, rainlitObjective } from './rainlit.ts';
import type { BagtasTopic, BambooForkId, ChapterTwoProgress, InteractionId, Progress } from './model.ts';
import { freshChapterTwo } from './model.ts';
export const isChapterTwoMap = (id: string) => id === 'bamboo' || id === 'turning' || isRainlitMap(id);
export const FORKS: BambooForkId[] = ['forkWest', 'forkNorth', 'forkEast'];
export const LANDMARKS = ['Split stone', 'Bent bamboo', 'Running water'] as const;
export type Landmark = typeof LANDMARKS[number];
/** The sketches move between forks; the next landmark stays on the page. */
export function forkOrder(step: number): number { return [0, 2, 1][Math.min(2, Math.max(0, step))]; }
export function landmarkAt(id: BambooForkId, step: number): Landmark {
  return LANDMARKS[(FORKS.indexOf(id) + forkOrder(step)) % 3];
}
export function followsRoute(p: Progress, id: BambooForkId) {
  return landmarkAt(id, p.chapterTwo.trailStep) === LANDMARKS[Math.min(2, p.chapterTwo.trailStep)];
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
    trailStep: step, routeVerified, debriefSeen, loops: typeof p.loops === 'number' && Number.isFinite(p.loops) ? Math.min(9999, Math.max(0, Math.floor(p.loops))) : 0,
    topics: [...new Set((Array.isArray(p.topics) ? p.topics : []).filter(t => ['paths', 'stories', 'seals'].includes(t)))] };
}
export function chapterTwoAction(p: Progress, id: InteractionId): Progress | null {
  const c = p.chapterTwo;
  if (id === 'bambooArrival') return { ...p, chapterTwo: { ...c, arrivalSeen: true } };
  if (id === 'bagtas') return { ...p, chapterTwo: { ...c, metBagtas: true } };
  if (id === 'turningArrival') return { ...p, chapterTwo: { ...c, turningSeen: true } };
  if (id === 'bagtasDebrief') return c.routeVerified ? { ...p, chapterTwo: { ...c, debriefSeen: true } } : p;
  const topic: BagtasTopic | null = id === 'bagtasPaths' ? 'paths' : id === 'bagtasStories' ? 'stories' : id === 'bagtasSeals' ? 'seals' : null;
  if (topic) return { ...p, chapterTwo: { ...c, topics: [...new Set([...c.topics, topic])] } };
  if (FORKS.includes(id as BambooForkId)) {
    if (!c.metBagtas || !c.turningSeen || c.routeVerified) return p;
    const correct = followsRoute(p, id as BambooForkId), step = c.trailStep + (correct ? 1 : 0);
    return { ...p, chapterTwo: { ...c, trailStep: step, routeVerified: step === 3, loops: Math.min(9999, c.loops + (correct ? 0 : 1)) } };
  }
  if (['bambooDeparture', 'turningEntry', 'bambooReturn', 'turningReturn'].includes(id)) return p;
  return null;
}
export function chapterTwoObjective(p: Progress, map: string) {
  const c = p.chapterTwo;
  if (c.debriefSeen) return rainlitObjective(p, map);
  if (!c.metBagtas) return 'Find the owner of those hoofbeats. Speak to Bagtas.';
  if (!c.routeVerified) return map === 'turning' ? `Read the path signs. Follow ${LANDMARKS[c.trailStep].toLowerCase()} next. (${c.trailStep}/3)` : 'Enter Turning Paths: the gold-arrow arch to the right of Bagtas.';
  return c.debriefSeen ? 'A route verified together. Explore, or revisit the restored clearing.' : 'Return to Bagtas. Show him the route you checked together.';
}
export function chapterTwoHint(p: Progress, level: number) {
  if (p.chapterTwo.debriefSeen) return rainlitHint(p, level);
  if (!p.chapterTwo.metBagtas) return 'The tall traveler stands by the shelter in Bamboo Verge. He knows who called from the bamboo.';
  if (p.chapterTwo.routeVerified) return p.chapterTwo.debriefSeen ? 'This first Chapter 2 route is complete. The clearing and both bamboo maps remain open to explore.' : 'Bagtas is waiting by the Bamboo Verge shelter. Tell him what stayed true in the turning paths.';
  return level < 2 ? 'In Bamboo Verge, go right of Bagtas to the TURNING PATHS arch and choose Travel. Inside, read the left, top and right path signs: split stone, bent bamboo, running water, in that order.' : `The next landmark is ${LANDMARKS[p.chapterTwo.trailStep].toLowerCase()}. Walk close to the path sign showing that sketch and choose Travel. A loop keeps the route steps you already checked.`;
}
