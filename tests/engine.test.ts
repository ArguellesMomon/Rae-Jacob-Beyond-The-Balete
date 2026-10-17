import test from 'node:test';
import assert from 'node:assert/strict';
import { canStand, completeInteraction, freshSave, nearbyInteraction, parseSave, stepPlayer } from '../src/game/engine.ts';
import { START } from '../src/game/model.ts';
import { INTERACTIONS } from '../src/game/world.ts';
import { linesFor } from '../src/game/dialogue.ts';

test('diagonal movement is normalized and joystick dead zone stops animation', () => {
  const straight = stepPlayer(START, { x: 1, y: 0 }, 1 / 60);
  const diagonal = stepPlayer(START, { x: 1, y: 1 }, 1 / 60);
  assert.ok(Math.abs(Math.hypot(diagonal.x - START.x, diagonal.y - START.y) - (straight.x - START.x)) < 1e-8);
  assert.equal(stepPlayer(straight, { x: 0.1, y: 0 }, 1 / 60).moving, false);
});

test('house collision stops Rae and allows sliding beside the wall', () => {
  const p = { ...START, x: 150, y: 177 };
  const next = stepPlayer(p, { x: 1, y: -1 }, 0.05);
  assert.equal(next.y, p.y);
  assert.ok(next.x > p.x);
  assert.equal(canStand({ x: 150, y: 150 }), false);
  assert.equal(canStand({ x: 203, y: 202 }), true);
});

test('large frame delay cannot tunnel through the house', () => {
  let p = { ...START, x: 150, y: 185 };
  for (let i = 0; i < 10; i++) p = stepPlayer(p, { x: 0, y: -1 }, 10);
  assert.ok(p.y >= 176);
});

test('every interaction has a reachable approach; targets cannot be selected remotely', () => {
  for (const [id, x, y] of [['lola', 203, 207], ['merienda', 262, 203], ['clothesline', 410, 264], ['basin', 120, 339], ['balete', 548, 193]] as const) {
    assert.equal(canStand({ x, y }), true, id);
    assert.equal(nearbyInteraction({ x, y })?.id, id);
  }
  assert.equal(nearbyInteraction({ x: 300, y: 320 }), null);
  assert.notEqual(nearbyInteraction({ x: 203, y: 174 })?.id, 'lola');
});

test('save validation rejects corrupt values and recovers a blocked v2 position', () => {
  assert.equal(parseSave('{oops'), null);
  assert.equal(parseSave(JSON.stringify({ ...freshSave(), player: { ...START, x: null } })), null);
  assert.deepEqual(parseSave(JSON.stringify({ ...freshSave(), player: { ...START, x: 150, y: 150 } }))?.player, START);
  const save = freshSave();
  save.progress.discoveries = ['basin', 'basin'];
  assert.deepEqual(parseSave(JSON.stringify(save))?.progress.discoveries, ['basin']);
  assert.deepEqual(parseSave(JSON.stringify(save))?.player, START);
});

test('all yard interactions can be reached from spawn without crossing collision', () => {
  const queue = [{ x: START.x, y: START.y }];
  const visited = new Set([`${START.x},${START.y}`]);
  const found = new Set<string>();
  for (let index = 0; index < queue.length && found.size < INTERACTIONS.length; index++) {
    const point = queue[index], item = nearbyInteraction(point);
    if (item) found.add(item.id);
    for (const [dx, dy] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) {
      const next = { x: point.x + dx, y: point.y + dy }, key = `${next.x},${next.y}`;
      if (!visited.has(key) && canStand(next)) { visited.add(key); queue.push(next); }
    }
  }
  assert.deepEqual([...found].sort(), INTERACTIONS.map(item => item.id).sort());
});

test('discoveries can be completed in any order and cannot be duplicated', () => {
  const original = freshSave().progress;
  let next = completeInteraction(original, 'basin');
  next = completeInteraction(next, 'merienda');
  next = completeInteraction(next, 'basin');
  assert.deepEqual(next.discoveries, ['basin', 'merienda']);
  assert.deepEqual(original.discoveries, []);
  const restored = parseSave(JSON.stringify({ ...freshSave(), progress: next }));
  assert.deepEqual(restored?.progress, next);
});

test('the tree ending requires talking to Lola, while discoveries stay optional', () => {
  const original = freshSave().progress;
  assert.equal(completeInteraction(original, 'balete').foundTree, false);
  const afterLola = completeInteraction(original, 'lola');
  const finished = completeInteraction(afterLola, 'balete');
  assert.equal(finished.foundTree, true);
  assert.equal(finished.discoveries.length, 0);
  assert.equal(linesFor('balete', original).some(line => line.speaker === 'Someone?'), false);
  assert.equal(linesFor('balete', afterLola).some(line => line.speaker === 'Someone?'), true);
});
