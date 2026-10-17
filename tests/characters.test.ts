import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { characterPortraitSvg, characterSpriteSvg } from '../src/art/characterArt.ts';
import { completeInteraction, freshSave, parseSave } from '../src/game/engine.ts';
import { linesFor } from '../src/game/dialogue.ts';
import { CONVERSATION_TOPICS } from '../src/game/conversations.ts';
import { knownCharacters, relationshipNote } from '../src/game/characters.ts';
import type { CharacterId, Emotion, Progress } from '../src/game/model.ts';

test('every optional conversation is repeatable, records only its own topic and remains outside puzzle requirements', () => {
  let p = freshSave().progress;
  for (const [person, topics] of Object.entries(CONVERSATION_TOPICS)) for (const topic of topics) {
    const speech = linesFor(topic.id, p, person === 'lola' ? 'yard' : 'grove');
    assert.ok(speech.length >= 1 && speech.length < 20);
    assert.ok(speech.every(line => line.text.length < 290 && line.emotion && line.gesture));
    p = completeInteraction(p, topic.id);
    assert.deepEqual(completeInteraction(p, topic.id), p);
  }
  assert.equal(p.talaTopics.length, 6); assert.equal(p.mangTopics.length, 6);
  assert.equal(p.lolaTopics.length, 3); assert.equal(p.mindaTopics.length, 3);
  assert.equal(p.bellRecovered, false); assert.equal(p.bellRung, false); assert.equal(p.chapterComplete, false);
  assert.equal(p.discoveries.length, 0);
});
test('earlier saves gain empty personal topics and new character memories survive a round trip', () => {
  const old = freshSave();
  delete (old.progress as Partial<Progress>).lolaTopics;
  delete (old.progress as Partial<Progress>).mindaTopics;
  assert.deepEqual(parseSave(JSON.stringify(old))!.progress.lolaTopics, []);
  const p = ['lolaString', 'talaMaps', 'mindaNeighbors', 'mangMemory'].reduce((p, id) => completeInteraction(p, id as Parameters<typeof completeInteraction>[1]), freshSave().progress);
  const saved = parseSave(JSON.stringify({ ...freshSave(), progress: p }))!.progress;
  assert.deepEqual(saved.lolaTopics, ['string']); assert.deepEqual(saved.mindaTopics, ['neighbors']);
  assert.deepEqual(saved.talaTopics, ['maps']); assert.deepEqual(saved.mangTopics, ['memory']);
});
test('journal entries unlock with actual meetings and relationship notes acknowledge the restored crossing', () => {
  const before = freshSave().progress;
  assert.deepEqual(knownCharacters(before), ['rae', 'lola']);
  const after = { ...before, metTala: true, heardMinda: true, metMang: true, bellRung: true, chapterComplete: true };
  assert.equal(knownCharacters(after).length, 5);
  assert.match(relationshipNote('tala', after), /friend/);
  assert.match(relationshipNote('uban', after), /folded leaf/);
  assert.notEqual(relationshipNote('rae', before), relationshipNote('rae', after));
});
test('the revised ending carries its audio cue with the authored line rather than a line number', () => {
  const speech = linesFor('rootSeal', { ...freshSave().progress, bellRung: true }, 'waterworks');
  const cues = speech.filter(line => line.cue === 'hooves');
  assert.equal(cues.length, 1); assert.match(cues[0].text, /hoofbeat/i);
  assert.notEqual(speech.indexOf(cues[0]), 4);
  assert.ok(speech.some(line => line.beat && line.emotion === 'worried'));
});
test('the visual set has distinct expressions, directions and eight genuine traveler walk frames', async () => {
  const expressions: Emotion[] = ['neutral', 'warm', 'delighted', 'curious', 'worried', 'determined', 'wistful', 'surprised', 'wry'];
  for (const id of ['rae', 'lola', 'tala', 'minda', 'uban'] as CharacterId[]) {
    const frames = expressions.map(emotion => characterPortraitSvg(id, emotion));
    assert.equal(new Set(frames).size, expressions.length, `${id} expression set`);
    for (const frame of frames) {
      const metadata = await sharp(Buffer.from(frame)).metadata(); assert.equal(metadata.width, 80); assert.equal(metadata.height, 96);
    }
  }
  const walking = Array.from({ length: 8 }, (_, f) => characterSpriteSvg('rae', 'down', f));
  assert.equal(new Set(walking).size, 8);
  assert.notEqual(characterSpriteSvg('rae', 'left'), characterSpriteSvg('rae', 'right'));
  assert.notEqual(characterSpriteSvg('lola', 'down', -3, 'wave'), characterSpriteSvg('lola', 'down', -4, 'wave'));
  assert.notEqual(characterSpriteSvg('tala', 'down', -1, 'map'), characterSpriteSvg('tala', 'down', -1, 'idle'));
  for (const frame of walking) {
    const { data, info } = await sharp(Buffer.from(frame)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(info.width, 32); assert.equal(info.height, 48);
    assert.ok(data.some((n, i) => i % 4 === 3 && n === 255));
  }
});
