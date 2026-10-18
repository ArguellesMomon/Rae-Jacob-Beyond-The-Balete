import test from 'node:test';
import assert from 'node:assert/strict';
import { canStand, completeInteraction, crossToClearing, followTrail, freshSave, nearbyInteraction, objective, parseSave, stepPlayer } from '../src/game/engine.ts';
import type { TrailPoint } from '../src/game/engine.ts';
import { CLEARING_START, START, TALA_START } from '../src/game/model.ts';
import { getMap } from '../src/game/world.ts';

test('old yard saves migrate without losing completed discoveries or the tree encounter', () => {
  const raw = JSON.stringify({ version: 1, player: { ...START, x: 548, y: 193 }, progress: { talkedToLola: true, discoveries: ['basin', 'clothesline'], foundTree: true } });
  const migrated = parseSave(raw)!;
  assert.equal(migrated.version, 2);
  assert.equal(migrated.mapId, 'yard');
  assert.equal(migrated.progress.foundTree, true);
  assert.equal(migrated.progress.crossed, false);
  assert.deepEqual(migrated.progress.discoveries, ['basin', 'clothesline']);
  assert.deepEqual(migrated.progress.talaTopics, []);
  assert.equal(migrated.player.x, 548);
});

test('crossing commits a recoverable arrival checkpoint before its animation', () => {
  const before = completeInteraction(completeInteraction(freshSave().progress, 'basin'), 'lola');
  const crossed = crossToClearing(before);
  assert.equal(before.crossed, false);
  assert.equal(crossed.mapId, 'clearing');
  assert.deepEqual(crossed.player, CLEARING_START);
  assert.equal(crossed.progress.arrivalSeen, false);
  assert.deepEqual(crossed.progress.discoveries, ['basin']);
  const resumed = parseSave(JSON.stringify(crossed))!;
  assert.equal(resumed.progress.crossed, true);
  assert.equal(resumed.progress.arrivalSeen, false);
  assert.equal(completeInteraction(resumed.progress, 'arrival').arrivalSeen, true);
  assert.equal(canStand(resumed.player, getMap('clearing').colliders, 'clearing'), true);
});

test('every clearing interaction is reachable from the arrival point', () => {
  const map = getMap('clearing');
  const queue = [{ x: CLEARING_START.x, y: CLEARING_START.y }];
  const visited = new Set([`${CLEARING_START.x},${CLEARING_START.y}`]);
  const found = new Set<string>();
  for (let index = 0; index < queue.length && found.size < map.interactions.length; index++) {
    const point = queue[index], item = nearbyInteraction(point, undefined, 'clearing');
    if (item) found.add(item.id);
    for (const [dx, dy] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) {
      const next = { x: point.x + dx, y: point.y + dy }, key = `${next.x},${next.y}`;
      if (!visited.has(key) && canStand(next, map.colliders, 'clearing')) { visited.add(key); queue.push(next); }
    }
  }
  assert.deepEqual([...found].sort(), map.interactions.map(item => item.id).sort());
});

test('Tala questions work in any order, deduplicate, and update the way-home objective', () => {
  const base = completeInteraction(crossToClearing(freshSave().progress).progress, 'tala');
  assert.match(objective(base), /Ask Tala/);
  let next = completeInteraction(base, 'talaRinging');
  next = completeInteraction(next, 'talaHome');
  next = completeInteraction(next, 'talaWhere');
  next = completeInteraction(next, 'talaHome');
  assert.deepEqual(next.talaTopics, ['ringing', 'home', 'where']);
  assert.match(objective(next), /grove/);
  assert.deepEqual(base.talaTopics, []);
  assert.equal(completeInteraction(base, 'grovePath').groveLead, true);
  assert.equal(completeInteraction(freshSave().progress, 'grovePath').groveLead, false);
});

test('clearing saves recover a changed collision position without resetting story progress', () => {
  const save = crossToClearing(freshSave().progress);
  save.progress = completeInteraction(completeInteraction(save.progress, 'tala'), 'minda');
  save.player = { ...CLEARING_START, x: 500, y: 250 };
  const restored = parseSave(JSON.stringify(save))!;
  assert.deepEqual(restored.player, CLEARING_START);
  assert.equal(restored.progress.metTala, true);
  assert.equal(restored.progress.heardMinda, true);
  assert.equal(parseSave(JSON.stringify({ ...save, mapId: 'not-a-map' })), null);
});

test('Tala follows ground paths across the plank bridge and stays near Rae at the workbench', () => {
  const map = getMap('clearing');
  let leader = { ...CLEARING_START, x: 188, y: 310 };
  let companion = { ...TALA_START };
  const trail: TrailPoint[] = [{ x: leader.x, y: leader.y, distance: 0 }];
  const waypoints = [{ x: 188, y: 320 }, { x: 188, y: 280 }, { x: 300, y: 245 }, { x: 408, y: 243 }, { x: 460, y: 263 }, { x: 408, y: 243 }, { x: 382, y: 250 }];
  for (const target of waypoints) {
    let iterations = 0;
    while (Math.hypot(target.x - leader.x, target.y - leader.y) > 0.1 && iterations++ < 1500) {
      const dx = target.x - leader.x, dy = target.y - leader.y, length = Math.hypot(dx, dy);
      leader = stepPlayer(leader, { x: dx / length, y: dy / length }, Math.min(1 / 60, length / 72), 'clearing');
      companion = followTrail(companion, trail, leader, 1 / 60, 'clearing');
      assert.equal(canStand(companion, map.colliders, 'clearing'), true);
    }
    assert.ok(iterations < 1500, 'The leader must reach each waypoint.');
  }
  for (let i = 0; i < 400; i++) companion = followTrail(companion, trail, leader, 1 / 60, 'clearing');
  assert.ok(Math.hypot(leader.x - companion.x, leader.y - companion.y) <= 25, 'Tala should settle nearby, not get stranded.');
  assert.notEqual(nearbyInteraction({ ...leader, moving: true }, undefined, 'clearing', companion)?.id, 'tala', 'Walking never auto-targets the companion.');
  const dx = companion.x - leader.x, dy = companion.y - leader.y;
  const facing = Math.abs(dx) > Math.abs(dy) ? dx < 0 ? 'left' : 'right' : dy < 0 ? 'up' : 'down';
  assert.equal(nearbyInteraction({ ...leader, moving: false, facing }, undefined, 'clearing', companion)?.id, 'tala', 'Rae can stop and turn to talk.');
});

test('clearing water blocks movement and map interactions never leak between scenes', () => {
  const map = getMap('clearing');
  assert.equal(canStand({ x: 500, y: 250 }, map.colliders, 'clearing'), false);
  let p = { ...CLEARING_START, x: 478, y: 250 };
  for (let i = 0; i < 50; i++) p = stepPlayer(p, { x: 1, y: 0 }, 1 / 60, 'clearing');
  assert.ok(p.x <= 481);
  assert.notEqual(nearbyInteraction({ x: 203, y: 203 }, undefined, 'clearing')?.id, 'lola');
});

test('a following Tala does not monopolize the contextual action button near clues and NPCs', () => {
  assert.equal(nearbyInteraction({ x: 382, y: 350, facing: 'up' }, 'tala', 'clearing', { x: 382, y: 368 })?.id, 'bellArch');
  assert.equal(nearbyInteraction({ x: 408, y: 243, facing: 'up' }, 'tala', 'clearing', { x: 390, y: 243 })?.id, 'minda');
  assert.equal(nearbyInteraction({ x: 280, y: 280, facing: 'left' }, undefined, 'clearing', { x: 262, y: 280 })?.id, 'tala');
});

test('Tala only gets a companion focus when Rae stops close by and faces him', () => {
  const point = { x: 280, y: 280 }, companion = { x: 262, y: 280 };
  assert.equal(nearbyInteraction({ ...point, moving: false, facing: 'left' }, undefined, 'clearing', companion)?.id, 'tala');
  assert.notEqual(nearbyInteraction({ ...point, moving: true, facing: 'left' }, 'tala', 'clearing', companion)?.id, 'tala');
  assert.notEqual(nearbyInteraction({ ...point, moving: false, facing: 'right' }, 'tala', 'clearing', companion)?.id, 'tala');
  assert.notEqual(nearbyInteraction({ x: 287, y: 280, moving: false, facing: 'left' }, 'tala', 'clearing', companion)?.id, 'tala');
  assert.equal(nearbyInteraction({ x: 188, y: 306, moving: true, facing: 'up' }, undefined, 'clearing')?.id, 'tala', 'First meeting remains discoverable.');
});
