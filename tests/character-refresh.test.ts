import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { mayumiAuraSvg } from '../src/art/mayumiArt.ts';
import { freshSave, completeInteraction, parseSave } from '../src/game/engine.ts';
import { getMap } from '../src/game/world.ts';
import { linesFor } from '../src/game/dialogue.ts';

test('Mayumi has a subtle translucent aura with gentle motion and a fixed Still frame', async () => {
  assert.equal(mayumiAuraSvg(0, false), mayumiAuraSvg(9, false));
  const frames = await Promise.all([0, 3, 6].map(async clock => sharp(Buffer.from(mayumiAuraSvg(clock))).ensureAlpha().raw().toBuffer()));
  assert.equal(new Set(frames.map(b => b.toString('base64'))).size, 3);
  for (const data of frames) {
    let visible = 0, maximum = 0, bright = 0;
    for (let i = 3; i < data.length; i += 4) { if (data[i] > 12) visible++; if (data[i] > 150) bright++; maximum = Math.max(maximum, data[i]); }
    assert.ok(visible > 500);
    assert.ok(maximum < 220 && bright < 50, 'Only tiny motes may be bright; the surrounding glow stays translucent.');
    assert.equal(data[3], 0);
  }
});

test('Mingming keeps the existing cat discovery across saves, first greeting and repeat visits', () => {
  const save = freshSave(), item = getMap('yard', save.progress).interactions.find(i => i.id === 'yardCat')!;
  assert.match(item.name, /Mingming/); assert.match(item.note!, /Mingming/);
  const first = linesFor('yardCat', save.progress, 'yard').map(l => l.text).join(' ');
  const next = completeInteraction(save.progress, 'yardCat');
  const resumed = parseSave(JSON.stringify({ ...save, progress: next }))!;
  const repeat = linesFor('yardCat', resumed.progress, 'yard').map(l => l.text).join(' ');
  assert.match(first, /Mingming/); assert.match(repeat, /Mingming/);
  assert.ok(!first.includes('Muning') && !repeat.includes('Muning'));
  assert.ok(resumed.progress.discoveries.includes('yardCat'));
  assert.equal(resumed.progress.crossed, false);
});
