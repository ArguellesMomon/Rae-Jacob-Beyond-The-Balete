import test from 'node:test';
import assert from 'node:assert/strict';
import { REPLAY_SCENES, replayCheckpoint } from '../src/game/replay.ts';
import { canStand, parseSave, freshSave } from '../src/game/engine.ts';
import { getMap } from '../src/game/world.ts';
import { HISTORY_LIMIT, parseHistory, rememberLine, searchHistory } from '../src/game/history.ts';
import { clearApproach } from '../src/game/interaction.ts';
import { actingGesture, idleActing } from '../src/game/acting.ts';
import { framePacing } from '../src/game/framePacing.ts';
import { linesFor } from '../src/game/dialogue.ts';

test('every replay scene starts at a safe, coherent checkpoint with its own empty history', () => {
  for (const scene of REPLAY_SCENES) {
    const save = replayCheckpoint(scene.id), map = getMap(save.mapId, save.progress);
    assert.ok(canStand(save.player, map.colliders, save.mapId), scene.id);
    const parsed = parseSave(JSON.stringify(save))!;
    assert.deepEqual(parsed.progress, save.progress, scene.id);
    assert.deepEqual(parsed.history, []);
    assert.deepEqual(save.progress.discoveries, []);
    assert.equal(save.progress.chapterComplete, ['chapter2', 'bambooPuzzle', 'bambooDebrief', 'rainroad', 'springMeeting', 'springPuzzle', 'springEnding'].includes(scene.id));
  }
  const first = replayCheckpoint('works'), second = replayCheckpoint('works');
  first.progress.talaTopics.push('home');
  assert.deepEqual(second.progress.talaTopics, []);
});

test('dialogue history records only the current spoken line, sanitizes old data, stays bounded and searches all words', () => {
  const dialogue = { id: 'lola' as const, index: 0, lines: [{ speaker: 'Lola Selya' as const, text: 'The blue kite string is on the porch.' }, { speaker: 'Rae Jacob' as const, text: 'A future line, not yet read.' }] };
  let history = rememberLine([], dialogue, 'yard');
  assert.equal(history.length, 1);
  assert.equal(searchHistory(history, 'future').length, 0);
  assert.equal(searchHistory(history, 'lola STRING').length, 1);
  assert.equal(searchHistory(history, 'kite', 'grove').length, 0);
  for (let n = 0; n < HISTORY_LIMIT + 4; n++) history = rememberLine(history, dialogue, 'yard');
  assert.equal(history.length, HISTORY_LIMIT);
  assert.ok(history.at(-1)!.seq > HISTORY_LIMIT);
  const clean = parseHistory([{ speaker: 'fake', text: 'bad', mapId: 'yard' }, { speaker: 'Tala', mapId: 'clearing', text: 'x'.repeat(5000), beat: 'y'.repeat(900) }]);
  assert.equal(clean.length, 1); assert.equal(clean[0].text.length, 1800); assert.equal(clean[0].beat?.length, 500);
  assert.deepEqual(parseSave(JSON.stringify(freshSave()))?.history, []);
});

test('targeting rejects intervening walls but permits an object’s own small footing', () => {
  const item = { id: 'lola' as const, name: 'Lola', action: 'Talk' as const, point: { x: 20, y: 20 } };
  assert.equal(clearApproach({ x: 0, y: 20 }, item, []), true);
  assert.equal(clearApproach({ x: 0, y: 20 }, item, [{ x: 7, y: 0, width: 2, height: 80 }]), false);
  assert.equal(clearApproach({ x: 0, y: 20 }, item, [{ x: 17, y: 17, width: 6, height: 6 }]), true);
});

test('character acting distinguishes Rae’s idle habits and Tala’s care for her map near water', () => {
  const player = freshSave().player;
  assert.equal(idleActing('rae', .4).gesture, 'brush');
  assert.equal(idleActing('rae', 9, 'clearing').gesture, 'listen');
  assert.equal(actingGesture('tala', { ...player, moving: true, facing: 'right' }, 1, false, undefined, 'waterworks'), 'guardMap');
  assert.equal(actingGesture('tala', { ...player, moving: true, facing: 'up' }, 1, false, undefined, 'waterworks'), 'idle');
  assert.equal(actingGesture('rae', player, 1, true, { speaker: 'Rae Jacob', text: 'Hello', gesture: 'wave' }), 'wave');
});

test('the story keeps unintroduced companions out of scenery dialogue and gives the bell celebration a clear source', () => {
  const p = freshSave().progress;
  for (const id of ['rootHomes', 'bellArch', 'waterPath', 'grovePath'] as const) {
    const lines = linesFor(id, p, 'clearing'); assert.ok(lines.length); assert.equal(lines.some(l => l.speaker === 'Tala'), false);
  }
  const bell = linesFor('bellArch', { ...p, metTala: true, bellReturned: true, bellHung: true }, 'clearing');
  assert.equal(bell.filter(line => line.beat?.includes('down from the grove')).length, 1);
  assert.ok(bell.some(line => line.gesture === 'celebrate'));
  const ending = linesFor('rootSeal', { ...p, metTala: true, bellRung: true }, 'waterworks');
  assert.match(ending.at(-1)!.text, /One crossing closer/);
  assert.equal(ending.filter(line => line.cue === 'hooves').length, 1);
});

test('replay pacing statistics include genuine stalls and reject invalid intervals', () => {
  assert.equal(framePacing(Array(60).fill(1000 / 60)).hz, 60);
  assert.deepEqual(framePacing([NaN, -1, 0]), { hz: 0, late: 0, worst: 0 });
  const delayed = framePacing([16, 16, 130, 900]);
  assert.equal(delayed.late, 2); assert.equal(delayed.worst, 900); assert.ok(delayed.hz < 10);
});
