import type { BambooForkId, Point } from './model.ts';

/** Ground paths are shared by the collision surface, art guide and route review. */
export const MAZE_PATHS: readonly (readonly (readonly [number, number])[])[] = [
  [[320, 458], [320, 380], [120, 380], [120, 314], [60, 314], [60, 180], [160, 180]],
  [[320, 380], [520, 380], [520, 314], [580, 314], [580, 180], [480, 180]],
  [[120, 314], [220, 314], [220, 230], [420, 230], [420, 314], [520, 314]],
  [[160, 180], [160, 64]], [[160, 100], [260, 100], [260, 180], [380, 180], [380, 100], [480, 100]],
  [[320, 230], [320, 64]], [[480, 180], [480, 64]],
  [[220, 314], [220, 360]], [[420, 314], [420, 360]],
];
export const MAZE_PATH_WIDTH = 28;
export const MAZE_FORKS: readonly { id: BambooForkId; point: Point; label: string }[] = [
  { id: 'forkWest', point: { x: 60, y: 180 }, label: 'Western arch' },
  { id: 'forkNorth', point: { x: 320, y: 108 }, label: 'High arch' },
  { id: 'forkEast', point: { x: 580, y: 180 }, label: 'Eastern arch' },
  { id: 'forkMoss', point: { x: 160, y: 108 }, label: 'Moss arch' },
  { id: 'forkMist', point: { x: 480, y: 108 }, label: 'Mist arch' },
];
export const MAZE_CLUES = [
  { id: 'pathStone', point: { x: 220, y: 360 } },
  { id: 'pathWind', point: { x: 320, y: 230 } },
  { id: 'pathWater', point: { x: 420, y: 360 } },
] as const;
export function mazeGroundRegions(): readonly (readonly (readonly [number, number])[])[] {
  const half = MAZE_PATH_WIDTH / 2;
  return MAZE_PATHS.flatMap(path => path.slice(1).map(([x, y], i) => {
    const [ax, ay] = path[i];
    return [[Math.min(ax, x) - half, Math.min(ay, y) - half], [Math.max(ax, x) + half, Math.min(ay, y) - half],
      [Math.max(ax, x) + half, Math.max(ay, y) + half], [Math.min(ax, x) - half, Math.max(ay, y) + half]] as const;
  }));
}
