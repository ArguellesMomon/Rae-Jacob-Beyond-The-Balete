import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { worksLeverAngle, worksPuzzleItems, WORKS_PROP_FILES } from '../src/game/worksProps.ts';
import { worksPropMarkup } from '../src/art/worksPropArt.ts';
import { springSealMarkup, springWetMarkup } from '../src/art/springSurfaceArt.ts';
import { replayCheckpoint } from '../src/game/replay.ts';

const uri = async (file: string) => `data:image/png;base64,${(await readFile('assets/props/' + file)).toString('base64')}`;
const svg = (s: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="704" height="480" viewBox="0 0 704 480">${s}</svg>`;
const visible = (data: Buffer) => { let n = 0; for (let i = 3; i < data.length; i += 4) if (data[i] > 40) n++; return n; };

test('generated wooden pieces have transparent backgrounds and the lever rotates around its fixed socket', async () => {
  const p = replayCheckpoint('works').progress;
  for (const file of Object.values(WORKS_PROP_FILES)) {
    const { data, info } = await sharp('assets/props/' + file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.ok(visible(data) > info.width * info.height * .2);
    assert.equal(data[3], 0);
  }
  const texture = await uri(WORKS_PROP_FILES.lever), frames: Buffer[] = [];
  for (const age of [0, .2, .45]) {
    const item = worksPuzzleItems({ ...p, flowDiverted: true }, { age, motion: true })[0];
    const raster = await sharp(Buffer.from(svg(worksPropMarkup(item, texture)))).extract({ left: 290, top: 170, width: 60, height: 40 }).ensureAlpha().raw().toBuffer();
    assert.ok(visible(raster) > 100, 'The lever must be present at every angle.');
    frames.push(raster);
  }
  assert.equal(new Set(frames.map(b => b.toString('base64'))).size, 3);
  assert.equal(worksLeverAngle(true, 0), 0); assert.equal(worksLeverAngle(true, .45), -78);
  assert.equal(worksLeverAngle(false, 0), -78); assert.equal(worksLeverAngle(false, .45), 0);
  assert.equal(worksLeverAngle(true), -78, 'Saved poses do not replay a turn.');
  assert.equal(worksLeverAngle(true, .1, false), -78, 'Still uses the final pose.');
  assert.equal(worksPuzzleItems({ ...p, branchMoved: true })[1].x, 255);
});

test('the generated spring surface fills downstream inside the bed and stays clear outside it', async () => {
  const texture = await uri('spring-wet-bed-v1.png'), counts: number[] = [];
  for (const reveal of [0, .2, .6, 1]) {
    const { data, info } = await sharp(Buffer.from(svg(springWetMarkup(texture, reveal)))).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    counts.push(visible(data));
    assert.equal(data[(227 * info.width + 520) * 4 + 3], 0, 'The water texture must never paint over the hollow.');
    assert.equal(data[(285 * info.width + 450) * 4 + 3], 0, 'The bank remains clear.');
  }
  assert.equal(counts[0], 0);
  assert.ok(counts[1] < counts[2] && counts[2] < counts[3]);
  assert.ok(counts[3] > 500 && counts[3] < 2000);
});

test('the bark seal is visible only in its revealed state and retains the dark hollow', async () => {
  const texture = await uri('spring-bark-seal-v1.png');
  const absent = await sharp(Buffer.from(svg(springSealMarkup(texture, 0)))).ensureAlpha().raw().toBuffer();
  const { data, info } = await sharp(Buffer.from(svg(springSealMarkup(texture)))).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(visible(absent), 0); assert.ok(visible(data) > 600);
  const center = (226 * info.width + 521) * 4;
  assert.ok(data[center] + data[center + 1] + data[center + 2] < 180, 'The mark belongs on the rim, rather than across the hollow.');
  assert.equal(data[(245 * info.width + 500) * 4 + 3], 0);
});
