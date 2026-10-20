import type { Interaction, Progress, Rect } from './model.ts';
import { BAMBOO_START, TURNING_START } from './model.ts';
import { landmarkAt } from './chapterTwo.ts';
import { MAZE_FORKS, MAZE_CLUES } from './turningMaze.ts';
import { currentMaze, mazeGateCodes, MAZE_TRIALS, RUNES } from './mazeTrials.ts';
import { mazeWayfinding } from './mazeWayfinding.ts';
export const BAMBOO_WORLD = { width: 640, height: 480 };
export const BAGTAS_POINT = { x: 400, y: 246 };
export const BAMBOO_COLLIDERS: readonly Rect[] = [
  { x: 35, y: 70, width: 142, height: 184 }, { x: 190, y: 55, width: 104, height: 150 },
  { x: 400, y: 128, width: 120, height: 42 }, { x: 392, y: 219, width: 16, height: 19 },
  { x: 426, y: 274, width: 64, height: 12 }, { x: 548, y: 315, width: 54, height: 100 },
  { x: 210, y: 400, width: 170, height: 40 }, { x: 51, y: 300, width: 28, height: 46 },
];
export const BAMBOO_INTERACTIONS: readonly Interaction[] = [
  { id: 'tala', name: 'Tala', action: 'Talk', point: { x: 102, y: 391 } },
  { id: 'bagtas', name: 'Bagtas', action: 'Talk', point: BAGTAS_POINT },
  { id: 'bambooCord', name: 'Knotted route cord', action: 'Inspect', point: { x: 330, y: 286 }, note: 'Old survey knots mark checked distances. Bagtas keeps room for a new knot when the road changes.' },
  { id: 'bambooCup', name: 'Covered traveler cups', action: 'Inspect', point: { x: 447, y: 299 }, note: 'One large cup, one small cup. Leave the covers on; the bamboo drops leaves into everything.' },
  { id: 'hoofMarks', name: 'Hoofprints in damp earth', action: 'Inspect', point: { x: 238, y: 355 }, note: 'One set of hooves crosses its own trail. Bagtas can make a convincing chase without ever leaving his shelter.' },
  { id: 'rainLeaves', name: 'Rain on sunlit leaves', action: 'Inspect', point: { x: 535, y: 190 }, note: 'Rain and a shaft of light share the bamboo. A story may explain a sight; looking tells us what is here.' },
  { id: 'trailVerse', name: 'The wayfinder verse', action: 'Inspect', point: { x: 496, y: 240 }, note: 'First the stone with a seam; then the crown that bends; then the water that runs. Follow landmarks, not the direction a post happens to face.' },
  { id: 'turningEntry', name: 'Into the turning paths', action: 'Travel', point: { x: 553, y: 246 } },
  { id: 'rainroadEntry', name: 'Rainlit Road', action: 'Travel', point: { x: 392, y: 185 } },
  { id: 'bambooReturn', name: 'Return to Rootwater Works', action: 'Travel', point: { x: 84, y: 420 } },
];
export const TURNING_COLLIDERS: readonly Rect[] = [];
export const TURNING_INTERACTIONS: readonly Interaction[] = [
  ...MAZE_FORKS.map(fork => ({ id: fork.id, name: fork.label, action: 'Travel' as const, point: fork.point })),
  ...MAZE_CLUES.map(clue => ({ ...clue, name: clue.id === 'pathStone' ? 'Proof: the split stone' : clue.id === 'pathWind' ? 'Proof: the bowed bamboo' : 'Proof: the running seep', action: 'Inspect' as const,
    note: clue.id === 'pathStone' ? 'A seam divides the stone from top to bottom. A round hollow is a false mark.' : clue.id === 'pathWind' ? 'A bent living stalk has three leaves. Lola’s remedy: turn clothing inside out when a misleading road repeats.' : 'A floating leaf passes the reed. The running-water sign has broken ripples; a closed ring means still water.' })),
  { id: 'turningCharm', name: 'Turn the sando inside out', action: 'Use', point: { x: 350, y: 230 } },
  { id: 'turningReturn', name: 'Return to Bagtas', action: 'Travel', point: { x: 320, y: 434 } },
  { id: 'tala', name: 'Tala', action: 'Talk', point: { x: 302, y: 390 } },
];
const trialMaps = new Map<string, {width:number;height:number;name:string;spawn:typeof TURNING_START;colliders:readonly Rect[];interactions:Interaction[]}>();
export function chapterTwoMap(id: 'bamboo' | 'turning', p: Progress) {
  if (id === 'turning') {
    const plan = currentMaze(p), trial = MAZE_TRIALS[plan.stage], key=`${plan.id}:${p.chapterTwo.loops}:${p.chapterTwo.glamourBroken}:${p.chapterTwo.routeVerified}`;
    const cached=trialMaps.get(key); if(cached)return cached;
    const way=mazeWayfinding(plan);
    const interactions: Interaction[] = [
      {id:plan.goal.id,name:`Read the trial ${plan.stage+1} destination sign`,action:'Inspect',point:plan.goal.point,note:'The only destination in this trial. Read this sign to continue.'},
      {id:'turningReturn',name:'Leave this trial · return to Bagtas',action:'Travel',point:{x:plan.spawn.x,y:plan.spawn.y+16}},
      {id:'tala',name:'Tala',action:'Talk',point:plan.spawn},
      ...way.helpers.map(helper=>({id:helper.id,name:helper.id==='tigmamanukan'?'Watch the Tigmamanukan':'Aling Dalisay · resting giantess',action:helper.id==='tigmamanukan'?'Inspect' as const:'Talk' as const,point:helper.point})),
      {id:'trailVerse',name:'Fallen petals and a leaf tie',action:'Inspect',point:way.inspect.point,note:'Fresh white petals continue into the safe branch. The neighbors leave quiet clues between their waymarks.'},
    ];
    const colliders=[...plan.colliders,...way.helpers.map(helper=>helper.footing)];
    const result={width:plan.width,height:plan.height,name:plan.name,spawn:{...TURNING_START,...plan.spawn},colliders,interactions};
    if(trialMaps.size>=32)trialMaps.delete(trialMaps.keys().next().value!);trialMaps.set(key,result);return result;
  }
  return { ...BAMBOO_WORLD, name: 'Bamboo Verge', spawn: BAMBOO_START, colliders: BAMBOO_COLLIDERS, interactions: BAMBOO_INTERACTIONS.map(item => item.id === 'rainroadEntry' && !p.chapterTwo.debriefSeen ? { ...item, action: 'Inspect' as const } : item.id === 'turningEntry' && !p.chapterTwo.metBagtas ? { ...item, action: 'Inspect' as const } : item) };
}
