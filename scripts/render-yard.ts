import { WORLD_PROPS, PROP_MOTION } from '../src/art/worldPropArt.ts';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { characterSpriteSvg } from '../src/art/characterArt.ts';
import { yardForegroundMarkup, yardLaundrySvg, yardLightSvg, yardRasterDefs } from '../src/art/yardArt.ts';
import { CANOPY_SVG, GROUND_SVG, KITE_SVG, laundrySvg, wrapSvg } from '../src/art/pixelArt.ts';
import { COLLIDERS, INTERACTIONS } from '../src/game/world.ts';
import { cameraTarget, sceneViewport } from '../src/game/camera.ts';
import { canStand, nearbyInteraction } from '../src/game/engine.ts';

await mkdir('artifacts', { recursive: true });
const body = (s: string) => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const uri = `data:image/png;base64,${(await readFile('assets/maps/lolas-yard-v2.png')).toString('base64')}`;
const defs = yardRasterDefs(uri);
const actor = (id: 'rae' | 'lola', x: number, y: number) => `<rect x="${x - 8}" y="${y - 1}" width="16" height="3" fill="#142e2b" opacity=".28"/><svg x="${x - 10}" y="${y - 30}" width="20" height="30" viewBox="0 0 32 48">${body(characterSpriteSvg(id, 'down', -1, id === 'lola' ? 'wave' : 'idle'))}</svg>`;
function scene(x = 270, y = 252, clock = 3, guide = false) {
  let s = defs + '<use href="#yard-preview-map"/>' + body(WORLD_PROPS.yard) + body(PROP_MOTION.yard[2]) + body(yardLightSvg(clock, 'ground'));
  const laundry = body(yardLaundrySvg(Math.floor(clock * 1.3)));
  if (y >= 249) s += laundry;
  s += actor('lola', 203, 186) + `<path d="M${x - 6} ${y - 1}h11l14 9h-11z" fill="#5b4430" opacity=".18"/>` + actor('rae', x, y);
  if (y < 249) s += laundry;
  s += yardForegroundMarkup({ x, y }) + body(yardLightSvg(clock));
  if (guide) {
    for (const c of COLLIDERS) s += `<rect x="${c.x}" y="${c.y}" width="${c.width}" height="${c.height}" fill="#d54353" fill-opacity=".2" stroke="#fb7c88" stroke-width=".6"/>`;
    for (const t of INTERACTIONS) s += `<circle cx="${t.point.x}" cy="${t.point.y}" r="3" fill="#fff9ca" stroke="#385865" stroke-width="1"/>`;
  }
  return s;
}
const full = wrapSvg(scene());
await sharp(Buffer.from(full)).resize(1280, 896, { kernel: 'nearest' }).png().toFile('artifacts/lolas-yard-art-preview.png');
await writeFile('artifacts/lolas-yard-art-preview.svg', full);
await sharp(Buffer.from(wrapSvg(scene(270, 252, 3, true)))).resize(1280, 896, { kernel: 'nearest' }).png().toFile('artifacts/lolas-yard-alignment-review.png');
const native = await sharp(Buffer.from(full)).png().toBuffer();
for (const [name, left, top, width, height] of [
  ['lolas-house-detail', 59, 67, 263, 142],
  ['balete-garden-detail', 360, 0, 280, 190],
  ['kitchen-garden-detail', 57, 278, 295, 100],
] as const) await sharp(native).extract({ left, top, width, height }).resize(width * 3, height * 3, { kernel: 'nearest' }).png().toFile(`artifacts/${name}.png`);

const view = sceneViewport(844, 390), camera = cameraTarget({ x: 270, y: 228 }, { width: 640, height: 448 }, view);
await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="844" height="390" viewBox="${Math.round(camera.x)} ${Math.round(camera.y)} ${view.vw} ${view.vh}" shape-rendering="crispEdges">${scene()}</svg>`)).png().toFile('artifacts/lolas-yard-phone-framing.png');
const legacy = wrapSvg(body(GROUND_SVG) + body(laundrySvg(0)) + actor('lola', 203, 186) + actor('rae', 270, 252) + body(CANOPY_SVG) + body(KITE_SVG));
const old = await sharp(Buffer.from(legacy)).png().toBuffer();
await sharp({ create: { width: 1280, height: 448, channels: 4, background: '#23392b' } }).composite([{ input: old, left: 0, top: 0 }, { input: native, left: 640, top: 0 }]).png().toFile('artifacts/lolas-yard-before-after.png');

// Contact views exercise actual walkable positions on both sides of the laundry and tree crowns.
const positions = [[412, 147], [510, 180], [410, 231], [410, 267], [548, 182], [150, 177]];
for (const [i, [x, y]] of positions.entries()) {
  if (!canStand({ x, y })) throw new Error(`The depth-review position ${x},${y} is blocked.`);
  const source = await sharp(Buffer.from(wrapSvg(scene(x, y)))).png().toBuffer();
  const left = Math.max(0, Math.min(440, x - 100)), top = Math.max(0, Math.min(308, y - 80));
  await sharp(source).extract({ left, top, width: 200, height: 140 }).resize(600, 420, { kernel: 'nearest' }).png().toFile(`artifacts/yard-depth-${i + 1}.png`);
}
for (const [id, x, y] of [['lola', 203, 207], ['merienda', 262, 203], ['clothesline', 410, 264], ['basin', 120, 339], ['balete', 548, 193]] as const) {
  if (!canStand({ x, y }) || nearbyInteraction({ x, y })?.id !== id) throw new Error(`Yard approach changed: ${id}`);
}
const frames: Buffer[] = [];
for (let frame = 0; frame < 16; frame++) {
  frames.push(await sharp(Buffer.from(wrapSvg(scene(270, 252, frame / 4)))).extract({ left: 346, top: 209, width: 124, height: 60 }).resize(496, 240, { kernel: 'nearest' }).ensureAlpha().raw().toBuffer());
}
await sharp(Buffer.concat(frames), { raw: { width: 496, height: 240 * frames.length, channels: 4, pageHeight: 240 } }).gif({ loop: 0, delay: Array(frames.length).fill(250) }).toFile('artifacts/yard-laundry-depth.gif');
console.log('Rendered the integrated yard, material details, phone framing, before/after, collision alignment, six depth checks and laundry animation. These are source-art renders, not app screenshots.');
