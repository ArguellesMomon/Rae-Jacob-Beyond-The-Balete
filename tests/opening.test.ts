import test from 'node:test';
import assert from 'node:assert/strict';
import { crossingFrame } from '../src/game/crossing.ts';
import { linesFor } from '../src/game/dialogue.ts';
import { completeInteraction, freshSave, parseSave } from '../src/game/engine.ts';

test('the crossing reaches full black before the root journey and reveals its landing without a flash', () => {
  assert.equal(crossingFrame(0).phase, 'yard');
  assert.equal(crossingFrame(0).darkness, 0);
  for (const t of [.32, .36, .43, .44]) assert.equal(crossingFrame(t).darkness, 1);
  assert.equal(crossingFrame(.36).phase, 'blackout');
  assert.equal(crossingFrame(.6).phase, 'roots');
  assert.equal(crossingFrame(.6).darkness, 0);
  assert.equal(crossingFrame(.88).darkness, 1);
  assert.equal(crossingFrame(1).phase, 'arrival');
  assert.equal(crossingFrame(1).darkness, 0);
  for (let n = -10; n <= 110; n++) {
    const frame = crossingFrame(n / 100);
    assert.ok(frame.darkness >= 0 && frame.darkness <= 1);
    assert.ok(frame.slide >= 0 && frame.slide <= 1);
  }
});

test('the opening explains an accidental damaged crossing and gives Rae time to react without identifying the voice', () => {
  const p = { ...freshSave().progress, talkedToLola: true };
  const opening = linesFor('balete', p), arrival = linesFor('arrival', p);
  assert.ok(opening.length >= 25);
  assert.ok(opening.filter(line => line.speaker === 'Someone?').length >= 10);
  assert.ok(opening.some(line => line.text.includes('waybell')));
  assert.ok(opening.some(line => line.text.includes('I did not call you by name')));
  assert.ok(opening.some(line => line.text.includes('Step away')));
  assert.ok(arrival.length >= 15);
  assert.equal(completeInteraction(freshSave().progress, 'balete').foundTree, false);
});

test('new yard memories save individually and never become crossing or puzzle prerequisites', () => {
  const save = freshSave(); let p = save.progress;
  for (const id of ['yardCat', 'calamansi', 'herbBed', 'sungka', 'rainJar'] as const) {
    assert.ok(linesFor(id, p).length >= 5);
    p = completeInteraction(p, id); p = completeInteraction(p, id);
  }
  assert.equal(p.discoveries.length, 5);
  assert.deepEqual({ ...p, discoveries: [] }, save.progress);
  assert.deepEqual(parseSave(JSON.stringify({ ...save, progress: p }))?.progress.discoveries, p.discoveries);
  const direct = completeInteraction(completeInteraction(save.progress, 'lola'), 'balete');
  assert.equal(direct.foundTree, true);
  assert.deepEqual(direct.discoveries, []);
});
