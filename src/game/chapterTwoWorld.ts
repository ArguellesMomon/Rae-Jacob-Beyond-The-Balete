import type { Interaction, Progress, Rect } from './model.ts';
import { BAMBOO_START, TURNING_START } from './model.ts';
import { landmarkAt } from './chapterTwo.ts';
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
  { id: 'hoofMarks', name: 'Hoofprints in damp earth', action: 'Inspect', point: { x: 238, y: 355 }, note: 'Hoofprints return to the shelter. Bagtas has been checking the same path, not chasing strangers.' },
  { id: 'rainLeaves', name: 'Rain on sunlit leaves', action: 'Inspect', point: { x: 535, y: 190 }, note: 'Rain and a shaft of light share the bamboo. A story may explain a sight; looking tells us what is here.' },
  { id: 'trailVerse', name: 'The wayfinder verse', action: 'Inspect', point: { x: 496, y: 240 }, note: 'First the stone with a seam; then the crown that bends; then the water that runs. Follow landmarks, not the direction a post happens to face.' },
  { id: 'turningEntry', name: 'Into the turning paths', action: 'Travel', point: { x: 553, y: 246 } },
  { id: 'bambooReturn', name: 'Return to Rootwater Works', action: 'Travel', point: { x: 84, y: 420 } },
];
export const TURNING_COLLIDERS: readonly Rect[] = [
  { x: 35, y: 55, width: 215, height: 102 }, { x: 389, y: 55, width: 215, height: 102 },
  { x: 35, y: 310, width: 160, height: 110 }, { x: 449, y: 310, width: 155, height: 110 },
  { x: 211, y: 182, width: 58, height: 64 }, { x: 378, y: 235, width: 48, height: 36 },
  { x: 141, y: 278, width: 21, height: 12 }, { x: 414, y: 277, width: 17, height: 12 },
  { x: 360, y: 178, width: 20, height: 13 },
];
export const TURNING_INTERACTIONS: readonly Interaction[] = [
  { id: 'forkWest', name: 'Western fork', action: 'Travel', point: { x: 110, y: 230 } },
  { id: 'forkNorth', name: 'Northern fork', action: 'Travel', point: { x: 320, y: 108 } },
  { id: 'forkEast', name: 'Eastern fork', action: 'Travel', point: { x: 528, y: 230 } },
  { id: 'pathStone', name: 'Stone with a seam', action: 'Inspect', point: { x: 151, y: 303 }, note: 'A pale seam splits this sketch of a stone. It is the first landmark in the trail verse.' },
  { id: 'pathWind', name: 'Bending bamboo sketch', action: 'Inspect', point: { x: 423, y: 303 }, note: 'Three leaves bow over one bent stalk. The second landmark is recognized by its shape, not its compass direction.' },
  { id: 'pathWater', name: 'Running-water sketch', action: 'Inspect', point: { x: 370, y: 205 }, note: 'Three ripples run past a small reed. Water comes last in the remembered route.' },
  { id: 'turningReturn', name: 'Return to Bagtas', action: 'Travel', point: { x: 320, y: 434 } },
  { id: 'tala', name: 'Tala', action: 'Talk', point: { x: 302, y: 390 } },
];
export function chapterTwoMap(id: 'bamboo' | 'turning', p: Progress) {
  return id === 'bamboo' ? { ...BAMBOO_WORLD, name: 'Bamboo Verge', spawn: BAMBOO_START, colliders: BAMBOO_COLLIDERS, interactions: BAMBOO_INTERACTIONS.map(item => item.id === 'turningEntry' && !p.chapterTwo.metBagtas ? { ...item, action: 'Inspect' as const } : item) }
    : { ...BAMBOO_WORLD, name: 'Turning Paths', spawn: TURNING_START, colliders: TURNING_COLLIDERS, interactions: TURNING_INTERACTIONS.map(item => item.id === 'forkWest' || item.id === 'forkNorth' || item.id === 'forkEast' ? { ...item, name: p.chapterTwo.routeVerified ? 'Checked route to Bagtas' : `${item.id === 'forkWest' ? 'Left path' : item.id === 'forkNorth' ? 'Top path' : 'Right path'} · ${landmarkAt(item.id, p.chapterTwo.trailStep)}` } : item) };
}
