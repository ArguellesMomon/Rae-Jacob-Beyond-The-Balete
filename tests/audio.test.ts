import test from 'node:test';
import assert from 'node:assert/strict';
import { SoundDirector } from '../src/audio/director.ts';
import type { PlaybackPort, SoundSnapshot } from '../src/audio/director.ts';
import { DEFAULT_PREFERENCES } from '../src/game/preferences.ts';
import { EMPTY_PROGRESS, START } from '../src/game/model.ts';

function harness() {
  const events: unknown[][] = [];
  const port: PlaybackPort = { loop: (...args) => events.push(['loop', ...args]), cue: (...args) => events.push(['cue', ...args]), stop: () => { events.push(['stop']); }, silenceEffects: () => { events.push(['mute']); }, unlock: () => { events.push(['unlock']); }, dispose: () => { events.push(['dispose']); } };
  const director = new SoundDirector(port);
  const base: SoundSnapshot = { mode: 'playing', mapId: 'waterworks', progress: { ...EMPTY_PROGRESS }, player: { ...START }, clock: 1, dialogue: null, focused: true };
  return { director, events, base, update: (patch: Partial<SoundSnapshot> = {}, settings = DEFAULT_PREFERENCES) => director.update({ ...base, ...patch }, settings) };
}
test('music and effects mute independently, dialogue ducks the mix, and pause or background stops all voices', () => {
  const h = harness(); h.update();
  assert.ok(h.events.some(event => event[0] === 'loop' && event[2] === 'silong' && event[3] === .3));
  h.events.length = 0; h.update({}, { ...DEFAULT_PREFERENCES, music: 0 });
  assert.deepEqual(h.events[0], ['loop', 'music', null, 0]);
  assert.ok(h.events.some(event => event[0] === 'loop' && event[2] === 'water'));
  h.update({}, { ...DEFAULT_PREFERENCES, effects: 0 }); assert.ok(h.events.some(event => event[0] === 'mute'));
  h.events.length = 0;
  h.update({ dialogue: { id: 'lever', index: 0, lines: [{ speaker: 'Tala', text: 'Testing.' }] } });
  assert.ok((h.events[0][3] as number) < .3);
  h.update({ mode: 'paused' }); assert.equal(h.events.at(-1)?.[0], 'stop');
  h.update(); h.update({ focused: false }); assert.equal(h.events.at(-1)?.[0], 'stop');
  h.update({ mapId: 'grove' });
  assert.ok((h.events.findLast(event => event[1] === 'music')![3] as number) < .3, 'the grove has a quieter musical bed');
  h.update({ player: { ...START, x: 432, y: 333 } });
  const near = h.events.findLast(event => event[1] === 'ambience')![3] as number;
  h.update({ player: { ...START, x: 70, y: 400 } });
  assert.ok((h.events.findLast(event => event[1] === 'ambience')![3] as number) < near, 'water softens with distance from the active channel');
});
test('resuming a completed save does not replay rewards; ringing and hoofbeats each fire once on their actual story event', () => {
  const h = harness(), completed = { ...EMPTY_PROGRESS, bellRung: true, chapterComplete: true };
  h.update({ mode: 'title' }); h.update({ progress: completed });
  assert.equal(h.events.filter(event => event[0] === 'cue').length, 0);
  h.update({ progress: EMPTY_PROGRESS }); h.events.length = 0;
  h.update({ progress: { ...EMPTY_PROGRESS, bellRung: true } });
  h.update({ progress: { ...EMPTY_PROGRESS, bellRung: true }, clock: 1.5 });
  assert.equal(h.events.filter(event => event[1] === 'bell').length, 1);
  const dialogue = { id: 'rootSeal' as const, index: 1, lines: [{ speaker: 'Tala' as const, text: 'Listen.' }, { speaker: 'Rae Jacob' as const, text: 'Hoofbeats.', cue: 'hooves' as const }] };
  h.update({ dialogue, clock: 5 }); h.update({ dialogue, clock: 5.1 });
  assert.equal(h.events.filter(event => event[1] === 'hooves').length, 1);
});
test('the distant clang stops once the bell is recovered or the water is diverted; footsteps require real movement', () => {
  const h = harness(); h.update(); h.update({ clock: 4 });
  assert.equal(h.events.filter(event => event[1] === 'clang').length, 1);
  h.events.length = 0;
  h.update({ clock: 20, progress: { ...EMPTY_PROGRESS, bellRecovered: true } });
  h.update({ clock: 30, progress: { ...EMPTY_PROGRESS, flowDiverted: true } });
  assert.equal(h.events.filter(event => event[1] === 'clang').length, 0);
  h.update({ player: { ...START, stride: 20, moving: false }, clock: 31 });
  assert.equal(h.events.filter(event => event[1] === 'step').length, 0);
  h.update({ player: { ...START, stride: 22, moving: true }, clock: 32 });
  assert.equal(h.events.filter(event => event[1] === 'step').length, 1);
  h.events.length = 0;
  h.update({ mapId: 'grove', clock: 40, progress: { ...EMPTY_PROGRESS, flowDiverted: true } });
  h.update({ mapId: 'grove', clock: 50, progress: { ...EMPTY_PROGRESS, flowDiverted: true } });
  assert.equal(h.events.filter(event => event[1] === 'clang').length, 0, 'a stopped wheel stays quiet when Rae returns to the grove');
});
test('settings preview survives menu frames, can be muted, and is stopped immediately on lifecycle suspension', () => {
  const h = harness(); h.update(); h.update({ mode: 'settings' }); h.events.length = 0;
  h.director.preview(); h.update({ mode: 'settings', clock: 1.1 });
  assert.ok(h.events.some(event => event[1] === 'bell'));
  assert.equal(h.events.filter(event => event[0] === 'stop').length, 0);
  h.update({ mode: 'settings' }, { ...DEFAULT_PREFERENCES, effects: 0 }); assert.equal(h.events.at(-1)?.[0], 'mute');
  h.director.suspend(); assert.equal(h.events.at(-1)?.[0], 'stop');
  h.director.dispose(); assert.equal(h.events.at(-1)?.[0], 'dispose');
});

test('reply choices keep a ducked mix and the quiet village shot does not replay the earned bell', () => {
  const h = harness(), progress = { ...EMPTY_PROGRESS, bellRecovered: true, bellRung: true };
  h.update({ mode: 'watching', progress, mapId: 'clearing' });
  assert.ok(h.events.some(e => e[0] === 'loop' && e[1] === 'music' && (e[3] as number) < .3));
  assert.equal(h.events.filter(e => e[1] === 'bell').length, 0);
  h.update({ mode: 'reply', dialogue: { id: 'tala', index: 0, lines: [{ speaker: 'Tala', text: 'Walk together?', choice: 'firstTrust' }] } });
  assert.ok((h.events.findLast(e => e[1] === 'music')![3] as number) < .3);
  h.update({ mode: 'history' }); assert.equal(h.events.at(-1)?.[0], 'stop');
});
