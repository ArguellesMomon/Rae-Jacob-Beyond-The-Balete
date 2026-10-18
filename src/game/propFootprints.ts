import type { MapId, Progress, Rect } from './model.ts';

// Extra footprints belong only to visible, changing puzzle objects.
// Painted scenery retains its existing map collision geometry.
export function propFootprints(map: MapId, progress: Progress): readonly Rect[] {
  if (map === 'bamboo') return [{ x: 390, y: 175, width: 4, height: 4 }];

  if (map === 'turning') return [
    { x: 109, y: 222, width: 3, height: 3 }, { x: 319, y: 100, width: 3, height: 3 }, { x: 527, y: 222, width: 3, height: 3 },
    { x: 150, y: 294, width: 3, height: 4 }, { x: 422, y: 294, width: 3, height: 4 }, { x: 369, y: 195, width: 3, height: 4 },
  ];
  if (map !== 'spring') return [];
  const feet: Rect[] = [{ x: 398, y: 276, width: 19, height: 3 }];
  if (!progress.rainlit.basketFreed) feet.push({ x: 477, y: 273, width: 15, height: 4 });
  if (progress.rainlit.rootBraced && !progress.rainlit.restored) feet.push({ x: 394, y: 270, width: 14, height: 4 });
  return feet;
}
