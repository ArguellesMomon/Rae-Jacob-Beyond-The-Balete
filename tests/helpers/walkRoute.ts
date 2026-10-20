import assert from 'node:assert/strict';
import { canStand } from '../../src/game/engine.ts';
import { getMap } from '../../src/game/world.ts';
import type { MapId, Point, Progress } from '../../src/game/model.ts';
import { currentMaze, MAZE_CELL, MAZE_COLS, MAZE_ROWS, mazeNodeRoute, mazePoint } from '../../src/game/mazeTrials.ts';

/** Plan test input along real floor instead of driving straight through background art. */
export function walkRoute(start: Point, goal: Point, mapId: MapId, progress: Progress): Point[] {
  const map = getMap(mapId, progress);
  assert.ok(canStand(start, map.colliders, mapId), `${mapId}: route starts on ground`);
  assert.ok(canStand(goal, map.colliders, mapId), `${mapId}: target ${goal.x},${goal.y} is ground`);
  const clear = (a: Point, b: Point) => {
    const length = Math.hypot(b.x - a.x, b.y - a.y), steps = Math.ceil(length);
    for (let i = 1; i <= steps; i++) if (!canStand({ x: a.x + (b.x - a.x) * i / steps, y: a.y + (b.y - a.y) * i / steps }, map.colliders, mapId)) return false;
    return true;
  };
  if(mapId==='turning') {
    const plan=currentMaze(progress),node=(point:Point)=>Math.max(0,Math.min(MAZE_ROWS-1,Math.round((point.y-64)/MAZE_CELL)))*MAZE_COLS+Math.max(0,Math.min(MAZE_COLS-1,Math.round((point.x-64)/MAZE_CELL)));
    const points=[start,...mazeNodeRoute(plan,node(start),node(goal)).map(mazePoint),goal];
    const distinct=points.filter((point,i)=>i===0||Math.hypot(point.x-points[i-1].x,point.y-points[i-1].y)>.01);
    if(distinct.slice(1).every((p,i)=>clear(distinct[i],p)))return distinct.slice(1);
  }
  const nodes = [{ point: start, parent: -1 }], seen = new Set(['0,0']);
  let end = -1;
  for (let i = 0; i < nodes.length; i++) {
    const point = nodes[i].point;
    if (Math.hypot(point.x - goal.x, point.y - goal.y) < 4 && clear(point, goal)) { end = i; break; }
    for (const [dx, dy] of [[4, 0], [-4, 0], [0, 4], [0, -4]]) {
      const next = { x: point.x + dx, y: point.y + dy }, key = `${Math.round((next.x - start.x) / 4)},${Math.round((next.y - start.y) / 4)}`;
      if (!seen.has(key) && clear(point, next)) { seen.add(key); nodes.push({ point: next, parent: i }); }
    }
  }
  assert.notEqual(end, -1, `${mapId}: reachable route to ${goal.x},${goal.y}`);
  const route = [goal];
  for (let i = end; i >= 0; i = nodes[i].parent) route.push(nodes[i].point);
  route.reverse();
  // Retain corners, compress only straight sections of the checked path.
  return route.filter((point, index) => {
    if (index === 0 || index === route.length - 1) return true;
    const previous = route[index - 1], next = route[index + 1];
    return (point.x - previous.x) * (next.y - point.y) !== (point.y - previous.y) * (next.x - point.x);
  }).slice(1);
}
