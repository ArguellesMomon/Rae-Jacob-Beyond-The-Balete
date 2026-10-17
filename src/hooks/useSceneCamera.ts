import { useRef } from 'react';
import { cameraTarget, followCamera, sceneViewport } from '../game/camera';
import type { Point } from '../game/model';

export function useSceneCamera(width: number, height: number, world: { width: number; height: number }, center: Point, clock: number, gentle: boolean, overview?: { width: number; height: number }, cinematic = false) {
  const view = sceneViewport(width, height, overview);
  const target = cameraTarget(center, world, view);
  const previous = useRef<{ point: Point; clock: number; width: number; height: number } | null>(null);
  const last = previous.current;
  const reset = !last || last.width !== width || last.height !== height || overview || cinematic;
  const point = followCamera(reset ? null : last.point, target, last ? clock - last.clock : 0, gentle);
  previous.current = { point, clock, width, height };
  return { ...view, cameraX: Math.round(point.x), cameraY: Math.round(point.y) };
}
