import test from 'node:test';
import assert from 'node:assert/strict';
import { canStand, completeInteraction as finish, freshSave, parseSave, puzzleHint, stepPlayer, travelRoute } from '../src/game/engine.ts';
import { getMap } from '../src/game/world.ts';
import { EMPTY_PROGRESS, WATERWORKS_START } from '../src/game/model.ts';
import type { Progress } from '../src/game/model.ts';

const initial: Progress = { ...EMPTY_PROGRESS, talkedToLola: true, foundTree: true, crossed: true, arrivalSeen: true, metTala: true, waterworksLead: true, visitedWaterworks: true };
const solve = () => ['branch', 'lever', 'stringBell', 'lever', 'minda', 'bellArch', 'bellArch'].reduce((p, id) => finish(p, id as Parameters<typeof finish>[1]), initial);

test('the bypass safety float, stopped-wheel requirement, and reversible lever protect every puzzle step', () => {
  let p = finish(initial, 'lever');
  assert.equal(p.flowDiverted, false);
  assert.equal(finish(p, 'stringBell').bellRecovered, false);
  p = finish(p, 'branch'); p = finish(p, 'lever');
  assert.equal(p.flowDiverted, true);
  p = finish(p, 'lever');
  assert.equal(p.waterRestored, false, 'turning water back on before retrieval does not solve the puzzle');
  p = finish(p, 'lever'); p = finish(p, 'stringBell');
  assert.equal(p.bellRecovered, true);
  assert.deepEqual(finish(p, 'stringBell'), p, 'retrieval cannot duplicate a bell');
  p = finish(p, 'lever');
  assert.equal(p.waterRestored, true); assert.equal(p.flowDiverted, false);
  assert.deepEqual(finish(p, 'lever'), p, 'completed works stay repaired');
  assert.equal(finish(initial, 'minda').bellReturned, false);
});

test('returning, rehanging and ringing are separate durable actions; the root scene requires the named crossing', () => {
  const p = solve();
  assert.ok(p.waterRestored && p.bellReturned && p.bellHung && p.bellRung);
  assert.equal(p.chapterComplete, false);
  assert.equal(finish(initial, 'rootSeal').chapterComplete, false);
  assert.equal(finish(p, 'rootSeal').chapterComplete, true);
  assert.equal(travelRoute(initial, 'toClearingFromWorks'), null);
  assert.equal(travelRoute(p, 'toClearingFromWorks')?.mapId, 'clearing');
  assert.equal(travelRoute(p, 'toWorksFromClearing')?.mapId, 'waterworks');
});

test('every puzzle control is reachable before repair and the eastern bank opens only after the waybell rings', () => {
  for (const p of [initial, finish(finish(initial, 'branch'), 'lever'), solve()]) {
    const map = getMap('waterworks', p), queue = [{ x: 84, y: 344 }], seen = new Set(['84,344']);
    for (let i = 0; i < queue.length; i++) for (const [dx, dy] of [[4, 0], [-4, 0], [0, 4], [0, -4]]) {
      const next = { x: queue[i].x + dx, y: queue[i].y + dy }, key = `${next.x},${next.y}`;
      if (!seen.has(key) && canStand(next, map.colliders, 'waterworks')) { seen.add(key); queue.push(next); }
    }
    for (const item of map.interactions.filter(item => item.id !== 'rootSeal' && item.id !== 'tala')) assert.ok(queue.some(q => Math.hypot(q.x - item.point.x, q.y - item.point.y) < 27), `${item.id} reachable at bellRung=${p.bellRung}`);
    assert.equal(queue.some(q => q.x > 456), p.bellRung);
    assert.equal(queue.some(q => Math.hypot(q.x - 584, q.y - 214) < 27), p.bellRung);
  }
  const blocked = stepPlayer({ ...WATERWORKS_START, x: 406, y: 378 }, { x: 1, y: 0 }, .05, 'waterworks', initial);
  const open = stepPlayer({ ...WATERWORKS_START, x: 406, y: 378 }, { x: 1, y: 0 }, .05, 'waterworks', solve());
  assert.ok(blocked.x <= 407); assert.ok(open.x > 407);
});

test('each saved puzzle checkpoint resumes safely, including old v2 saves and inconsistent flags', () => {
  let p = initial;
  for (const id of ['branch', 'lever', 'stringBell', 'lever', 'minda', 'bellArch', 'bellArch', 'rootSeal'] as const) {
    p = finish(p, id);
    const save = parseSave(JSON.stringify({ version: 2, mapId: 'waterworks', player: WATERWORKS_START, progress: p }))!;
    assert.equal(save.progress.bellRecovered, p.bellRecovered);
    assert.equal(save.progress.waterRestored, p.waterRestored);
    assert.equal(save.progress.bellRung, p.bellRung);
    assert.equal(save.progress.chapterComplete, p.chapterComplete);
    assert.ok(canStand(save.player, getMap(save.mapId, save.progress).colliders, save.mapId));
  }
  const old = freshSave();
  for (const key of Object.keys(EMPTY_PROGRESS).slice(16)) delete (old.progress as unknown as Record<string, unknown>)[key];
  assert.ok(parseSave(JSON.stringify(old)));
  const corrupt = parseSave(JSON.stringify({ version: 2, mapId: 'waterworks', player: { ...WATERWORKS_START, x: 580, y: 230 }, progress: { ...initial, flowDiverted: true } }))!;
  assert.equal(corrupt.progress.flowDiverted, false);
  assert.deepEqual(corrupt.player, WATERWORKS_START);
  const completed = parseSave(JSON.stringify({ version: 2, mapId: 'waterworks', player: WATERWORKS_START, progress: { ...initial, chapterComplete: true } }))!;
  assert.ok(completed.progress.bellRung && completed.progress.waterRestored && completed.progress.branchMoved);
});

test('hints follow the current step without changing progress or requiring optional notebook discoveries', () => {
  assert.match(puzzleHint(initial, 1), /other channel/);
  assert.match(puzzleHint(initial, 3), /Push the branch/);
  assert.match(puzzleHint(finish(finish(initial, 'branch'), 'lever'), 3), /kite string/);
  assert.match(puzzleHint(solve(), 1), /pale circle/);
  assert.equal(initial.branchMoved, false);
});
