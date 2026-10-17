import test from 'node:test';
import assert from 'node:assert/strict';
import { canStand, completeInteraction, freshSave, nearbyInteraction, objective, parseSave, travelRoute } from '../src/game/engine.ts';
import { CLEARING_GROVE_RETURN, GROVE_START } from '../src/game/model.ts';
import { getMap } from '../src/game/world.ts';
import { linesFor } from '../src/game/dialogue.ts';

function recruited() {
  return { ...freshSave().progress, talkedToLola: true, foundTree: true, crossed: true, arrivalSeen: true, metTala: true };
}

test('grove travel checkpoints preserve clues, questions, and a safe route back to the clearing', () => {
  assert.equal(travelRoute(freshSave().progress, 'toGrove'), null);
  const before = completeInteraction(completeInteraction(recruited(), 'basin'), 'talaHome');
  const entered = travelRoute(before, 'toGrove')!;
  assert.equal(entered.mapId, 'grove');
  assert.equal(entered.progress.visitedGrove, true);
  assert.deepEqual(entered.player, GROVE_START);
  assert.deepEqual(entered.progress.discoveries, ['basin']);
  assert.deepEqual(entered.progress.talaTopics, ['home']);
  const returned = travelRoute(completeInteraction(entered.progress, 'speakingTube'), 'toClearing')!;
  assert.deepEqual(returned.player, CLEARING_GROVE_RETURN);
  assert.equal(returned.progress.visitedGrove, true);
  assert.ok(returned.progress.discoveries.includes('speakingTube'));
  assert.equal(canStand(returned.player, getMap('clearing').colliders, 'clearing'), true);
});

test('all grove interactions are reachable around the giant tree', () => {
  const map = getMap('grove'), queue = [{ x: GROVE_START.x, y: GROVE_START.y }];
  const visited = new Set([`${GROVE_START.x},${GROVE_START.y}`]), found = new Set<string>();
  for (let index = 0; index < queue.length && found.size < map.interactions.length; index++) {
    const point = queue[index], item = nearbyInteraction(point, undefined, 'grove');
    if (item) found.add(item.id);
    for (const [dx, dy] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) {
      const next = { x: point.x + dx, y: point.y + dy }, key = `${next.x},${next.y}`;
      if (!visited.has(key) && canStand(next, map.colliders, 'grove')) { visited.add(key); queue.push(next); }
    }
  }
  assert.deepEqual([...found].sort(), map.interactions.map(item => item.id).sort());
  assert.equal(canStand({ x: 232, y: 200 }, map.colliders, 'grove'), false);
  assert.equal(canStand({ x: 232, y: 314 }, map.colliders, 'grove'), true);
});

test('Mang questions are optional, repeatable, and preserve clues discovered before his introduction', () => {
  const before = completeInteraction(travelRoute(recruited(), 'toGrove')!.progress, 'speakingTube');
  assert.ok(linesFor('mang', before, 'grove').some(line => /found the bamboo tube/i.test(line.text)));
  let next = completeInteraction(before, 'mang');
  next = completeInteraction(next, 'mangRinging');
  next = completeInteraction(next, 'mangForest');
  next = completeInteraction(next, 'mangHome');
  next = completeInteraction(next, 'mangRinging');
  assert.deepEqual(next.mangTopics, ['ringing', 'forest', 'home']);
  assert.equal(next.groveRevealed, true);
  assert.equal(next.metMang, true);
  assert.deepEqual(next.discoveries, ['speakingTube']);
  assert.match(objective(next, 'grove'), /Rootwater Works/);
  assert.match(linesFor('talaWhere', next, 'grove')[0].text, /Old Balete Grove/);
  assert.match(linesFor('talaHome', next, 'grove')[0].text, /Heart Balete/);
});

test('the maintenance trail can be understood through the tube clue or Mang, in either order', () => {
  const p = travelRoute(recruited(), 'toGrove')!.progress;
  assert.equal(completeInteraction(p, 'waterworksPath').waterworksLead, false);
  assert.equal(completeInteraction(completeInteraction(p, 'speakingTube'), 'waterworksPath').waterworksLead, true);
  assert.equal(completeInteraction(completeInteraction(p, 'mang'), 'waterworksPath').waterworksLead, true);
});

test('second-milestone saves remain compatible and grove saves recover blocked positions', () => {
  const old = { version: 2, mapId: 'clearing', player: { ...CLEARING_GROVE_RETURN }, progress: { talkedToLola: true, foundTree: true, crossed: true, arrivalSeen: true, metTala: true, talaTopics: ['home'], heardMinda: true, groveLead: true, discoveries: ['bellArch'] } };
  const migrated = parseSave(JSON.stringify(old))!;
  assert.equal(migrated.progress.visitedGrove, false);
  assert.equal(migrated.progress.metMang, false);
  assert.deepEqual(migrated.progress.mangTopics, []);
  assert.deepEqual(migrated.progress.discoveries, ['bellArch']);
  const grove = travelRoute(migrated.progress, 'toGrove')!;
  grove.progress = completeInteraction(completeInteraction(grove.progress, 'mang'), 'mangHome');
  grove.player = { ...GROVE_START, x: 232, y: 200 };
  const recovered = parseSave(JSON.stringify(grove))!;
  assert.deepEqual(recovered.player, GROVE_START);
  assert.deepEqual(recovered.progress.mangTopics, ['home']);
  assert.equal(recovered.progress.metMang, true);
});
