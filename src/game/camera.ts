import type { Point } from './model.ts';

export function sceneViewport(width: number, height: number, overview?: { width: number; height: number }, world?: { width: number; height: number }) {
  const scale = overview ? Math.min(width / overview.width, height / overview.height) : Math.max(1, Math.min(3.2, width / 465, height / 178));
  if (!world) return { vw: width / scale, vh: height / scale };
  const boundedScale = Math.max(scale, width / world.width, height / world.height);
  const vw = width / boundedScale, vh = height / boundedScale;
  // Normal play fills the screen without seeing beyond the painting. A story shot
  // can retain its required composition; SVG's uniform fit supplies a plain matte
  // on extreme aspect ratios instead of stretching or repeating the map.
  return {
    vw: overview ? Math.max(vw, Math.min(world.width, overview.width)) : vw,
    vh: overview ? Math.max(vh, Math.min(world.height, overview.height)) : vh,
  };
}
export function cameraTarget(center: Point, world: { width: number; height: number }, view: { vw: number; vh: number }): Point {
  const axis = (point: number, size: number, span: number) => span >= size ? (size - span) / 2 : Math.max(0, Math.min(Math.floor(size - span), point - span / 2));
  return { x: axis(center.x, world.width, view.vw), y: axis(center.y, world.height, view.vh) };
}
export function followCamera(previous: Point | null, target: Point, seconds: number, gentle = true): Point {
  if (!previous || !gentle || Math.hypot(target.x - previous.x, target.y - previous.y) > 140) return { ...target };
  const amount = 1 - Math.exp(-12 * Math.max(0, Math.min(.1, seconds)));
  const axis = (before: number, after: number) => Math.abs(after - before) <= .15 ? after : before + (after - before) * amount;
  return { x: axis(previous.x, target.x), y: axis(previous.y, target.y) };
}
