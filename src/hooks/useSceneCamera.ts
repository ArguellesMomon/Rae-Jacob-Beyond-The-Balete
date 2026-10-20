import { useRef } from 'react';
import { cameraTarget, followCamera, sceneViewport } from '../game/camera';
import type { Point } from '../game/model';

export function useSceneCamera(width: number, height: number, world: { width: number; height: number }, center: Point, clock: number, gentle: boolean, overview?: { width: number; height: number }, cinematic = false, zoom = 1) {
  const normal = sceneViewport(width, height, overview, world);
  const view = {vw:normal.vw/zoom,vh:normal.vh/zoom};
  const target = cameraTarget(center, world, view);
  const previous = useRef<{ point: Point; clock: number; width: number; height: number; worldWidth:number; worldHeight:number } | null>(null);
  const last = previous.current;
  const reset = !last || last.width !== width || last.height !== height || last.worldWidth!==world.width || last.worldHeight!==world.height || overview || cinematic;
  const point = followCamera(reset ? null : last.point, target, last ? clock - last.clock : 0, gentle);
  previous.current = { point, clock, width, height, worldWidth:world.width,worldHeight:world.height };
  return { ...view, cameraX: Math.round(point.x), cameraY: Math.round(point.y) };
}
