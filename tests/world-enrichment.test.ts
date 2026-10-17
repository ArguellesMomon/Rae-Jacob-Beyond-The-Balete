import test from 'node:test';
import assert from 'node:assert/strict';
import { act, create } from 'react-test-renderer';
import { createElement } from 'react';
import { completeInteraction, canStand, freshSave, nearbyInteraction, parseSave } from '../src/game/engine.ts';
import { linesFor } from '../src/game/dialogue.ts';
import { getMap } from '../src/game/world.ts';
import { RESIDENT_IDS, ambientIndex, residentLines } from '../src/game/residents.ts';
import { FLOW_BEAT_DURATION, flowPresentation } from '../src/game/flowFeedback.ts';
import { useFlowChange } from '../src/hooks/useFlowChange.ts';
import type { MapId, SceneryId } from '../src/game/model.ts';

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const scenery: SceneryId[] = ['lampShelf', 'messageBoard', 'dryingRack', 'seedTray', 'rainCup', 'listeningStone', 'toolRoll', 'floatGauge', 'reedChimes'];

test('resident banter rotates without adjacent repeats, survives saves and never repairs the quest', () => {
  const start = freshSave(); let p = start.progress;
  for (const id of RESIDENT_IDS) {
    for (let n = 0; n < 16; n++) {
      if (n) assert.notEqual(ambientIndex(id, n), ambientIndex(id, n - 1));
      assert.ok(residentLines(id, p).length > 0);
      p = completeInteraction(p, id);
    }
    assert.equal(p.residentChats[id], 16);
  }
  assert.deepEqual({ ...p, residentChats: {} }, start.progress);
  assert.deepEqual(parseSave(JSON.stringify({ ...start, progress: p }))?.progress.residentChats, p.residentChats);
  assert.match(residentLines('nilo', { ...p, bellRung: true, residentChats: {} }).map(l => l.text).join(' '), /steady lamp/);
});

test('all nine optional scenery memories deduplicate and migrate without advancing puzzles', () => {
  const start = freshSave(); let p = start.progress;
  for (const id of scenery) {
    assert.ok(linesFor(id, p).length >= 2);
    assert.equal(linesFor(id, p).some(line => line.speaker === 'Tala'), false);
    assert.ok(linesFor(id, { ...p, metTala: true }).some(line => line.speaker === 'Tala'));
    p = completeInteraction(completeInteraction(p, id), id);
  }
  assert.equal(p.discoveries.length, 9);
  assert.deepEqual({ ...p, discoveries: [] }, start.progress);
  assert.deepEqual(parseSave(JSON.stringify({ ...start, progress: p }))?.progress.discoveries, p.discoveries);
});

test('the Listening Seed is earned once after the rung waybell and cannot be fabricated by an earlier save', () => {
  const start = freshSave();
  assert.equal(completeInteraction(start.progress, 'mangGift').ubanGiftReceived, false);
  const earned = completeInteraction({ ...start.progress, bellRung: true }, 'mangGift');
  assert.equal(earned.ubanGiftReceived, true);
  assert.deepEqual(completeInteraction(earned, 'mangGift'), earned);
  assert.deepEqual(completeInteraction(earned, 'listeningSeed'), earned);
  assert.equal(parseSave(JSON.stringify({ ...start, progress: { ...start.progress, ubanGiftReceived: true } }))?.progress.ubanGiftReceived, false);
  const restored = parseSave(JSON.stringify({ ...start, mapId: 'grove', player: { ...start.player, x: 232, y: 302 }, progress: earned }))!;
  assert.equal(restored.progress.ubanGiftReceived, true);
  assert.ok(linesFor('mangGift', start.progress).length < linesFor('mangGift', { ...start.progress, bellRung: true }).length);
  assert.ok(linesFor('listeningSeed', earned).some(line => line.prop === 'seed'));
});

test('new residents and props have reachable approaches before and after repairs on all three maps', () => {
  for (const mapId of ['clearing', 'grove', 'waterworks'] as MapId[]) for (const repaired of [false, true]) {
    const p = { ...freshSave().progress, bellRung: repaired, waterRestored: repaired, bellReturned: repaired };
    const map = getMap(mapId, p), queue = [{ x: map.spawn.x, y: map.spawn.y }], seen = new Set([`${map.spawn.x},${map.spawn.y}`]), found = new Set<string>();
    const wanted = map.interactions.filter(i => scenery.includes(i.id as SceneryId) || RESIDENT_IDS.includes(i.id as typeof RESIDENT_IDS[number])).map(i => i.id);
    for (let n = 0; n < queue.length && !wanted.every(id => found.has(id)); n++) {
      const point = queue[n], item = nearbyInteraction(point, undefined, mapId, undefined, p);
      if (item) found.add(item.id);
      for (const [dx, dy] of [[3, 0], [-3, 0], [0, 3], [0, -3]]) {
        const next = { x: point.x + dx, y: point.y + dy }, key = `${next.x},${next.y}`;
        if (!seen.has(key) && canStand(next, map.colliders, mapId)) { seen.add(key); queue.push(next); }
      }
    }
    assert.deepEqual(wanted.filter(id => !found.has(id)), [], `${mapId} repaired=${repaired}`);
  }
});

test('flow camera and tremble are bounded and Steady view retains a legible current without moving the camera', () => {
  const player = { x: 322, y: 219 };
  for (const toDiverted of [false, true]) {
    let front = 127;
    for (let age = 0; age <= 4; age += .02) {
      const scene = flowPresentation({ at: 0, toDiverted }, age, player);
      assert.ok(Math.abs(scene.shakeX) <= .65 && Math.abs(scene.shakeY) <= .65);
      assert.ok(scene.frontY >= front); front = scene.frontY;
      const steady = flowPresentation({ at: 0, toDiverted }, age, player, false);
      assert.deepEqual(steady.center, { x: 322, y: 195 });
      assert.equal(steady.shakeX, 0); assert.equal(steady.shakeY, 0);
    }
    assert.equal(flowPresentation({ at: 0, toDiverted }, FLOW_BEAT_DURATION, player).active, false);
    assert.deepEqual(flowPresentation({ at: 0, toDiverted }, 4, player).center, { x: 322, y: 195 });
  }
  assert.ok(flowPresentation({ at: 0, toDiverted: true }, 2, player).center.x < 322);
  assert.ok(flowPresentation({ at: 0, toDiverted: false }, 2, player).center.x > 322);
});

test('flow feedback observes changes once and never replays on initial load or after pause', async () => {
  let result: ReturnType<typeof useFlowChange> = null;
  function Harness({ diverted, active, clock }: { diverted: boolean; active: boolean; clock: number }) { result = useFlowChange(diverted, clock, active); return null; }
  let renderer!: ReturnType<typeof create>;
  const props = { diverted: true, active: true, clock: 5 };
  await act(async () => { renderer = create(createElement(Harness, props)); });
  try {
    assert.equal(result, null);
    await act(async () => renderer.update(createElement(Harness, { ...props, diverted: false, clock: 6 })));
    assert.deepEqual(result, { at: 6, toDiverted: false });
    await act(async () => renderer.update(createElement(Harness, { ...props, diverted: false, clock: 7 })));
    assert.deepEqual(result, { at: 6, toDiverted: false });
    await act(async () => renderer.update(createElement(Harness, { ...props, diverted: false, active: false, clock: 8 })));
    assert.equal(result, null);
    await act(async () => renderer.update(createElement(Harness, { ...props, diverted: false, clock: 9 })));
    assert.equal(result, null);
  } finally { await act(async () => renderer.unmount()); }
});
