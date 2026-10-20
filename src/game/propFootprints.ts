import type { MapId, Progress, Rect } from './model.ts';
import { MAZE_CLUES, MAZE_FORKS } from './turningMaze.ts';

// Extra footprints belong only to visible, changing puzzle objects.
// Painted scenery retains its existing map collision geometry.
export function propFootprints(map: MapId, progress: Progress): readonly Rect[] {
  if (map === 'bamboo') return [{ x: 390, y: 175, width: 4, height: 4 }];

  if (map === 'turning') return []; // Trial walls and visible-object feet share a cached plan.
  if (map !== 'spring') return [];
  const feet: Rect[] = [{ x: 398, y: 276, width: 19, height: 3 }];
  if (!progress.rainlit.basketFreed) feet.push({ x: 477, y: 273, width: 15, height: 4 });
  if (progress.rainlit.rootBraced && !progress.rainlit.restored) feet.push({ x: 394, y: 270, width: 14, height: 4 });
  return feet;
}
