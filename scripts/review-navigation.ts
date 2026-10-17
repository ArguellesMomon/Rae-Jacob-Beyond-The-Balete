import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { MAP_GROUND } from '../src/game/walkable.ts';
import { canStand, nearbyInteraction } from '../src/game/engine.ts';
import { getMap } from '../src/game/world.ts';
import { REPLAY_SCENES, replayCheckpoint } from '../src/game/replay.ts';
import { EMPTY_PROGRESS } from '../src/game/model.ts';
import type { MapId, Point, Progress } from '../src/game/model.ts';
import { wrapSvg } from '../src/art/pixelArt.ts';

await mkdir('artifacts', { recursive: true });
const ready = replayCheckpoint('chapter2').progress, works = replayCheckpoint('works').progress;
const maps: MapId[] = ['yard', 'clearing', 'grove', 'waterworks', 'bamboo', 'turning'];
const baseProgress = (id: MapId) => id === 'yard' ? EMPTY_PROGRESS : id === 'waterworks' ? works : ready;
const images: Record<MapId, string> = { yard: 'lolas-yard-v2.png', clearing: 'lantern-clearing-v2.png', grove: 'old-balete-grove-v2.png', waterworks: 'rootwater-works-v2.png', bamboo: 'bamboo-verge-v2.png', turning: 'turning-paths-v2.png' };
function reach(id: MapId, progress: Progress) {
  const map = getMap(id, progress), queue: Point[] = [{ ...map.spawn }], seen = new Set([`${map.spawn.x},${map.spawn.y}`]);
  for (let i = 0; i < queue.length; i++) for (const [dx, dy] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) {
    const next = { x: queue[i].x + dx, y: queue[i].y + dy }, key = `${next.x},${next.y}`;
    if (!seen.has(key) && canStand(next, map.colliders, id) && canStand({ x: queue[i].x + dx / 2, y: queue[i].y + dy / 2 }, map.colliders, id)) { seen.add(key); queue.push(next); }
  }
  const expected = map.interactions.filter(item => item.id !== 'tala' && (id !== 'waterworks' || progress.bellRung || !['rootSeal', 'bambooDeparture'].includes(item.id)));
  for (const target of expected) if (!queue.some(point => nearbyInteraction(point, target.id, id, undefined, progress)?.id === target.id)) throw new Error(`${id}: unreachable ${target.id}`);
  return { map, queue, seen, targets: expected.length };
}
const review = ['# Movement boundary review', '', 'Generated with `npm.cmd run navigation:review`. These overlays review source geometry against map artwork, not a running-phone capture. Green shows reachable foot positions, amber shows ground on the locked eastern bank, and red outlines solid objects. All other background space is unavailable.', '', '| Map / state | Reachable sample positions | Expected interactions reached |', '| --- | ---: | ---: |'];
const sheets: { input: Buffer; left: number; top: number }[] = [];
for (const [index, id] of maps.entries()) {
  const progress = baseProgress(id), { map, queue, targets } = reach(id, progress), geometry = MAP_GROUND[id];
  const raw = Buffer.alloc(map.width * map.height * 4);
  for (const point of queue) for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
    const pixel = ((point.y + dy) * map.width + point.x + dx) * 4;
    raw[pixel] = 73; raw[pixel + 1] = 230; raw[pixel + 2] = 167; raw[pixel + 3] = 85;
  }
  if (id === 'waterworks') for (let y = 52; y < map.height - 28; y++) for (let x = 458; x < map.width - 29; x++) if (canStand({ x, y }, map.colliders, id)) {
    const pixel = (y * map.width + x) * 4; raw[pixel] = 245; raw[pixel + 1] = 189; raw[pixel + 2] = 70; raw[pixel + 3] = 85;
  }
  const mask = await sharp(raw, { raw: { width: map.width, height: map.height, channels: 4 } }).png().toBuffer();
  const outlines = geometry.regions.map(region => `<polygon points="${region.map(point => point.join(',')).join(' ')}" fill="none" stroke="#b5f4dd" stroke-width=".7"/>`).join('')
    + map.colliders.map(collider => `<rect x="${collider.x}" y="${collider.y}" width="${collider.width}" height="${collider.height}" fill="none" stroke="#ff6e8f" stroke-width=".7"/>`).join('')
    + map.interactions.filter(item => item.id !== 'tala').map(item => `<circle cx="${item.point.x}" cy="${item.point.y}" r="2" fill="#fff2a7"/>`).join('');
  const background = await sharp(`assets/maps/${images[id]}`).resize(map.width, map.height, { kernel: 'nearest' }).png().toBuffer();
  const combined = await sharp(background).composite([{ input: mask }, { input: Buffer.from(wrapSvg(outlines, map.width, map.height)) }]).png().toBuffer();
  await sharp(combined).resize(map.width * 2, map.height * 2, { kernel: 'nearest' }).png().toFile(`artifacts/navigation-${id}-review.png`);
  const panel = await sharp(combined).resize(480, 360, { fit: 'contain', background: '#17352f' }).png().toBuffer();
  sheets.push({ input: panel, left: index % 3 * 480, top: Math.floor(index / 3) * 360 });
  review.push(`| ${map.name} | ${queue.length} | ${targets} |`);
}
const checks: [string, MapId, Progress][] = [
  ['Clearing before repairs', 'clearing', replayCheckpoint('arrival').progress],
  ['Clearing after bell return', 'clearing', replayCheckpoint('bellReturn').progress],
  ['Works bypass diverted', 'waterworks', { ...works, branchMoved: true, flowDiverted: true }],
  ['Works bell retrieved', 'waterworks', { ...works, branchMoved: true, flowDiverted: true, bellRecovered: true }],
  ['Works water restored', 'waterworks', { ...works, branchMoved: true, bellRecovered: true, waterRestored: true }],
  ['Works named crossing', 'waterworks', ready],
  ['Verge before Bagtas', 'bamboo', replayCheckpoint('chapter2').progress],
  ...[0, 1, 2].map(step => [`Turning Paths ${step + 1}`, 'turning', { ...ready, chapterTwo: { ...ready.chapterTwo, trailStep: step } }] as [string, MapId, Progress]),
];
for (const [name, id, progress] of checks) { const result = reach(id, progress); review.push(`| ${name} | ${result.queue.length} | ${result.targets} |`); }
for (const scene of REPLAY_SCENES) { const save = replayCheckpoint(scene.id); if (!canStand(save.player, getMap(save.mapId, save.progress).colliders, save.mapId)) throw new Error(`Invalid replay ${scene.title}`); }
await sharp({ create: { width: 1440, height: 720, channels: 4, background: '#17352f' } }).composite(sheets).png().toFile('artifacts/navigation-all-maps-review.png');
review.push('', 'All expected targets remain reachable in every reviewed state. Waterworks requires the named bridge for its eastern bank. Every replay starts on safe ground. Regression tests also drive Rae/Tala through real paths, test held/diagonal input and delayed frames, check old-save recovery, and verify bridge/corner foot support.', '', 'Physical-phone touch/performance review remains pending.');
await writeFile('docs/movement-boundary-review.md', review.join('\n') + '\n');
console.log('Reviewed all six map surfaces, 16 map/state reachability checks and every replay spawn. Wrote six alignment overlays and a contact sheet. Source geometry review only.');
