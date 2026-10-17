import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayback as nativePlayback } from '../src/audio/playback.ts';
import { createPlayback as webPlayback } from '../src/audio/playback.web.ts';
import { modes, players } from './mocks/audio.ts';

test('native audio uses four reusable voices, stays silent before a gesture, and never restarts a finished cue on unlock', async () => {
  players.length = 0; modes.length = 0;
  const port = nativePlayback(() => {});
  await Promise.resolve();
  try {
    assert.equal(players.length, 4); assert.equal(modes[0].allowsRecording, false); assert.equal(modes[0].shouldPlayInBackground, false);
    port.loop('music', 'afternoon', .3); assert.equal(players[0].plays, 0);
    port.unlock(); assert.equal(players[0].plays, 1);
    for (let i = 0; i < 60; i++) port.loop('music', 'afternoon', .3);
    assert.equal(players[0].replacements, 1); assert.equal(players[0].plays, 1);
    port.cue('bell', .6); const plays = players[2].plays;
    players[2].finish(); port.unlock(); assert.equal(players[2].plays, plays);
    port.loop('music', 'silong', .3); assert.equal(players[0].source, 'silong');
    port.stop(); assert.ok(players.every(player => !player.playing));
  } finally { port.dispose(); }
  assert.ok(players.every(player => player.released === 1 && player.listeners.size === 0));
});
test('a delayed native replay seek cannot restart an effect after mute or suspension', async () => {
  players.length = 0;
  const port = nativePlayback(() => {}); await Promise.resolve(); port.unlock();
  try {
    port.cue('step', .1); port.cue('step', .1);
    const step = players[3], plays = step.plays;
    port.silenceEffects(); step.resolveSeek?.(); await Promise.resolve();
    assert.equal(step.plays, plays); assert.equal(step.playing, false);
    port.cue('bell', .6); port.cue('bell', .6);
    const effect = players[2], effectPlays = effect.plays;
    port.stop(); effect.resolveSeek?.(); await Promise.resolve();
    assert.equal(effect.plays, effectPlays); assert.equal(effect.playing, false);
  } finally { port.dispose(); }
});

const media: MockAudio[] = [];
class MockAudio {
  src: string; volume = 0; loop = false; preload = ''; currentTime = 0; paused = true; plays = 0; fail = false;
  onended: (() => void) | null = null;
  constructor(src: string) { this.src = src; media.push(this); }
  play() { this.plays++; if (this.fail) return Promise.reject({ name: 'NotAllowedError' }); this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
  removeAttribute() { this.src = ''; }
  load() {}
  finish() { this.paused = true; this.onended?.(); }
}
globalThis.Audio = MockAudio as unknown as typeof Audio;
test('web audio catches autoplay rejection, retries on a gesture, and keeps ended cues quiet', async () => {
  media.length = 0; const issues: boolean[] = [];
  const port = webPlayback(failed => issues.push(failed));
  try {
    port.loop('music', 'silong', .3);
    assert.equal(media[0].plays, 0);
    media[0].fail = true; port.unlock(); await Promise.resolve();
    assert.equal(issues.at(-1), true);
    media[0].fail = false; port.unlock(); await Promise.resolve();
    assert.equal(media[0].paused, false); assert.equal(issues.at(-1), false);
    port.cue('bell', .6); media[2].finish(); const played = media[2].plays;
    port.unlock(); await Promise.resolve(); assert.equal(media[2].plays, played);
    port.stop(); assert.ok(media.every(player => player.paused));
  } finally { port.dispose(); }
  assert.ok(media.every(player => player.src === '' && player.paused));
});
