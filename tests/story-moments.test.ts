import test from 'node:test';
import assert from 'node:assert/strict';
import { completeInteraction, freshSave, parseSave, travelRoute } from '../src/game/engine.ts';
import { linesFor } from '../src/game/dialogue.ts';
import { REPLY_TONES, STORY_CHOICES, chooseStoryReply } from '../src/game/storyChoices.ts';
import { journeyRecap } from '../src/game/recap.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { relationshipNote } from '../src/game/characters.ts';
import type { DiscoveryId, InteractionId, MapId } from '../src/game/model.ts';

test('every reply has a distinct exchange, persists, reconstructs without a prompt and leaves quest flags alone', () => {
  for (const id of ['firstTrust', 'mapMistake'] as const) {
    const exchanges = new Set<string>();
    for (const tone of REPLY_TONES) {
      const p = freshSave().progress, chosen = chooseStoryReply(p, id, tone);
      assert.deepEqual({ ...chosen, storyChoices: {} }, p);
      assert.equal(p.storyChoices[id], undefined);
      assert.equal(chooseStoryReply(chosen, id, 'playful'), chosen, 'a later tap cannot replace a committed reply');
      assert.equal(parseSave(JSON.stringify({ ...freshSave(), progress: chosen }))!.progress.storyChoices[id], tone);
      const lines = linesFor(id === 'firstTrust' ? 'tala' : 'waterworksArrival', chosen, id === 'firstTrust' ? 'clearing' : 'waterworks');
      assert.equal(lines.some(line => line.choice === id), false);
      assert.ok(lines.some(line => line.text === STORY_CHOICES[id].replies[tone].lines[0].text));
      exchanges.add(STORY_CHOICES[id].replies[tone].lines.map(line => line.text).join(' '));
    }
    assert.equal(exchanges.size, 3);
  }
});

test('old and malformed saves gain safe story defaults without inventing a friendship scene', () => {
  const base = freshSave(), { storyChoices: _choices, talaMapHelped: _map, afterBellSeen: _bell, ...old } = base.progress;
  const migrated = parseSave(JSON.stringify({ ...base, progress: old }))!;
  assert.deepEqual(migrated.progress.storyChoices, {});
  assert.equal(migrated.progress.talaMapHelped, false); assert.equal(migrated.progress.afterBellSeen, false);
  const malformed = parseSave(JSON.stringify({ ...base, progress: { ...old, storyChoices: { firstTrust: 'good', mapMistake: 'cautious', fake: 'playful' }, talaMapHelped: true, afterBellSeen: true } }))!;
  assert.deepEqual(malformed.progress.storyChoices, { mapMistake: 'cautious' });
  assert.equal(malformed.progress.talaMapHelped, false); assert.equal(malformed.progress.afterBellSeen, false);
});

test('yard memories add recognition to later clues while both explored and unexplored routes remain solvable', () => {
  const links: [DiscoveryId, InteractionId, MapId, string][] = [
    ['clothesline', 'dryingRack', 'clearing', 'Our clean sheets'], ['rainJar', 'rainCup', 'grove', 'Roof, jar'],
    ['rainJar', 'splitter', 'waterworks', 'Like the gutter'], ['herbBed', 'branch', 'waterworks', 'Careful hands'],
    ['basin', 'stringBell', 'waterworks', 'Dry fingers'], ['sungka', 'talaMaps', 'clearing', 'sungka board'],
    ['calamansi', 'mangMemory', 'grove', 'calamansi tree'],
  ];
  for (const [discovery, id, map, text] of links) {
    const p = { ...freshSave().progress, metTala: true };
    assert.ok(!linesFor(id, p, map).some(line => line.text.includes(text)), id);
    assert.ok(linesFor(id, { ...p, discoveries: [discovery] }, map).some(line => line.text.includes(text)), id);
  }
  for (const discoveries of [[], links.map(link => link[0])] as DiscoveryId[][]) {
    for (const tone of REPLY_TONES) {
      let p = { ...freshSave().progress, discoveries, visitedWaterworks: true, metTala: true, waterworksLead: true };
      p = chooseStoryReply(p, 'mapMistake', tone);
      for (const id of ['branch', 'lever', 'stringBell', 'lever', 'minda', 'bellArch', 'bellArch', 'rootSeal'] as const) p = completeInteraction(p, id);
      assert.equal(p.chapterComplete, true); assert.equal(p.afterBellSeen, false, 'the quiet scene is not a bridge or ending gate');
      assert.ok(travelRoute(p, 'toClearingFromWorks'));
    }
  }
});

test('Tala develops through correction and later callbacks without crediting older saves for an unseen lesson', () => {
  const p = { ...freshSave().progress, metTala: true, visitedWaterworks: true };
  assert.ok(linesFor('talaMaps', p, 'waterworks').some(line => line.choice === 'mapMistake'), 'old journeys can hear the map story through optional questions');
  const helped = completeInteraction(chooseStoryReply(p, 'mapMistake', 'cautious'), 'waterworksArrival');
  assert.equal(helped.talaMapHelped, true); assert.match(relationshipNote('tala', helped), /outdated route/);
  assert.ok(linesFor('lowTrail', { ...helped, waterRestored: true }, 'waterworks').some(line => line.text.includes('second mark')));
  for (const tone of REPLY_TONES) {
    const chosen = chooseStoryReply({ ...helped, bellRung: true }, 'firstTrust', tone);
    const scene = linesFor('afterBell', chosen, 'clearing');
    assert.ok(scene.some(line => line.text.includes('Lola')));
    assert.ok(scene.some(line => line.text.includes(tone === 'playful' ? 'kept its promises' : tone === 'cautious' ? 'keeping it on the map' : 'needed to hear')));
    assert.equal(completeInteraction(chosen, 'afterBell').afterBellSeen, true);
    assert.equal(chosen.afterBellSeen, false);
  }
  assert.equal(completeInteraction(freshSave().progress, 'afterBell').afterBellSeen, false);
});

test('return recaps describe completed events, never future rewards, at each replay and puzzle stage', () => {
  const fresh = freshSave(); assert.match(journeyRecap(fresh.progress, 'yard'), /afternoon/i);
  const works = replayCheckpoint('works'); assert.match(journeyRecap(works.progress, works.mapId), /maintenance trail/);
  assert.doesNotMatch(journeyRecap(works.progress, 'waterworks'), /bell is safe|returned|restored/);
  let p = completeInteraction(works.progress, 'waterworksArrival');
  assert.match(journeyRecap(p, 'waterworks'), /missing bell/);
  p = completeInteraction(p, 'branch'); assert.match(journeyRecap(p, 'waterworks'), /fallen branch/);
  p = completeInteraction(p, 'lever'); assert.match(journeyRecap(p, 'waterworks'), /wheel stopped/);
  p = completeInteraction(p, 'stringBell'); assert.match(journeyRecap(p, 'waterworks'), /safe in my pocket/);
  p = completeInteraction(p, 'lever'); assert.match(journeyRecap(p, 'waterworks'), /low trail/);
  p = completeInteraction(p, 'minda'); assert.match(journeyRecap(p, 'clearing'), /agreed to meet/);
  p = completeInteraction(p, 'bellArch'); assert.match(journeyRecap(p, 'clearing'), /first proper ring/);
  p = completeInteraction(p, 'bellArch'); assert.match(journeyRecap(p, 'clearing'), /name back/);
  p = completeInteraction(p, 'afterBell'); assert.match(journeyRecap(p, 'clearing'), /shared a quiet moment/);
  p = completeInteraction(p, 'rootSeal'); assert.match(journeyRecap(p, 'waterworks'), /Chapter 1 journey/);
});
