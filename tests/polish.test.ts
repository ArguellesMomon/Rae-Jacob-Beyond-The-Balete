import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cameraTarget, followCamera, sceneViewport } from '../src/game/camera.ts';
import { DEFAULT_PREFERENCES, parsePreferences } from '../src/game/preferences.ts';
import { movementSpeed, objective } from '../src/game/engine.ts';
import { EMPTY_PROGRESS } from '../src/game/model.ts';
import { linesFor } from '../src/game/dialogue.ts';

test('walking and jogging join continuously while preserving fine movement and the dead zone', () => {
  assert.equal(movementSpeed(.17), 0);
  assert.ok(movementSpeed(.2) > 0 && movementSpeed(.2) < 5);
  assert.ok(movementSpeed(.18001) < .001);
  assert.ok(Math.abs(movementSpeed(.31999) - movementSpeed(.32001)) < .01);
  assert.ok(Math.abs(movementSpeed(.80001) - movementSpeed(.79999)) < .01);
  assert.equal(movementSpeed(1), 72); assert.equal(movementSpeed(2), 72);
  assert.equal(movementSpeed(Infinity), 0);
  for (let n = 18; n < 100; n++) assert.ok(movementSpeed(n / 100) <= movementSpeed((n + 1) / 100));
});
test('the gentle camera converges without overshoot and has the same response at different frame rates', () => {
  const target = { x: 100, y: 80 };
  let fast = { x: 0, y: 0 }, slow = { ...fast };
  for (let i = 0; i < 30; i++) fast = followCamera(fast, target, 1 / 60);
  for (let i = 0; i < 15; i++) slow = followCamera(slow, target, 1 / 30);
  assert.ok(Math.abs(fast.x - slow.x) < .01);
  assert.ok(fast.x > 99 && fast.x <= 100 && fast.y <= 80);
  assert.deepEqual(followCamera(fast, target, .03, false), target);
  assert.deepEqual(followCamera({ x: 0, y: 0 }, { x: 300, y: 200 }, .03), { x: 300, y: 200 });
});
test('short landscape screens retain enough vertical world space; oversized views center the map', () => {
  assert.ok(sceneViewport(960, 320).vh >= 178);
  assert.ok(sceneViewport(844, 390).vw > 460);
  assert.deepEqual(cameraTarget({ x: 300, y: 200 }, { width: 480, height: 448 }, { vw: 600, vh: 500 }), { x: -60, y: -26 });
  assert.deepEqual(cameraTarget({ x: 10, y: 10 }, { width: 640, height: 448 }, { vw: 465, vh: 220 }), { x: 0, y: 0 });
});
test('preferences recover malformed storage and preserve an intentional mute', () => {
  assert.deepEqual(parsePreferences('not json'), DEFAULT_PREFERENCES);
  assert.deepEqual(parsePreferences('null'), DEFAULT_PREFERENCES);
  assert.deepEqual(parsePreferences('{"music":0,"effects":9,"gentleCamera":false}'), { music: 0, effects: 1, gentleCamera: false, waterMotion: true, ambientMotion: true, largeText: false });
  assert.equal(parsePreferences('{"music":"loud"}').music, .3);
});
test('restored NPCs stop requesting completed work, and objectives honor the tube-first route', () => {
  const repaired = { ...EMPTY_PROGRESS, waterRestored: true, bellRecovered: true, bellReturned: true, bellHung: true, bellRung: true, metMang: true };
  assert.match(linesFor('worksTube', repaired, 'waterworks')[0].text, /Safe travels/);
  assert.match(linesFor('mangHome', repaired, 'grove')[0].text, /first road is mended/);
  assert.match(linesFor('talaHome', repaired)[0].text, /remembers its name/);
  assert.match(linesFor('talaWhere', repaired, 'waterworks')[0].text, /dry low trail/);
  assert.match(linesFor('speakingTube', { ...EMPTY_PROGRESS, flowDiverted: true }, 'grove')[0].text, /stopped the wheel/);
  assert.match(objective(repaired, 'clearing'), /maintenance trail/);
  assert.match(objective({ ...EMPTY_PROGRESS, crossed: true, metTala: true, visitedGrove: true, discoveries: ['speakingTube'] }, 'grove'), /Rootwater Works/);
});
test('every bundled audio asset is valid mono PCM with headroom, finite duration and a quiet loop seam', () => {
  const manifest = JSON.parse(readFileSync(new URL('../assets/audio/manifest.json', import.meta.url), 'utf8'));
  assert.equal(Object.keys(manifest.assets).length, 15);
  for (const [name, entry] of Object.entries(manifest.assets) as [string, { bytes: number; seconds: number }][]) {
    const wav = readFileSync(new URL(`../assets/audio/${name}.wav`, import.meta.url));
    assert.equal(wav.toString('ascii', 0, 4), 'RIFF'); assert.equal(wav.toString('ascii', 8, 12), 'WAVE');
    assert.equal(wav.readUInt16LE(20), 1); assert.equal(wav.readUInt16LE(22), 1); assert.equal(wav.readUInt32LE(24), 22050); assert.equal(wav.readUInt16LE(34), 16);
    assert.equal(wav.length, entry.bytes); assert.ok(entry.seconds > .1 && entry.seconds < 24);
    let peak = 0;
    for (let i = 44; i < wav.length; i += 2) peak = Math.max(peak, Math.abs(wav.readInt16LE(i)));
    assert.ok(peak > 100 && peak < 25000, `${name}: audible signal with headroom`);
    if (['afternoon', 'silong', 'garden', 'forest', 'water'].includes(name)) assert.ok(Math.abs(wav.readInt16LE(44) - wav.readInt16LE(wav.length - 2)) < 50, `${name}: no discontinuity at the seam`);
  }
});
