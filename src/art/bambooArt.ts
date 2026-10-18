import { bamboo, plank } from './propMaterials.ts';
import { pixelPath as p, pixelRect as r, wrapSvg } from './pixelArt.ts';
import type { Progress } from '../game/model.ts';
import { landmarkAt, type Landmark } from '../game/chapterTwo.ts';
import { pixelLettering } from './pixelLettering.ts';
const vergeTrail = 'M55 446h98V364h85v-38h186v-52h168V174h-70v53H376v44H224v43H118v50H55z';
const turningTrail = 'M274 466h92V320h185V192h-46v83H365V75h-86v200H135v-83H87v128h187z';
function fern(x: number, y: number, light = '#8b9e6e') {
  return p(`M${x} ${y}h2v-17h-2z M${x - 12} ${y - 11}h8v3h4v3h-6v-3h-6z M${x + 2} ${y - 11}h7v-3h6v3h-5v3h-8z M${x - 8} ${y - 3}h7v-3h-4v-2h-5z M${x + 2} ${y - 5}h9v-3h-5v1h-4z`, light);
}
function mossRock(x: number, y: number, width: number) {
  return p(`M${x} ${y}h${width}v-7h-3v-5h-${width - 8}v4h-5z`, '#546c62') + r(x + 4, y - 10, width - 10, 3, '#8e9a7c') + r(x + 2, y - 3, width - 4, 3, '#3b594d') + r(x + 4, y - 11, 9, 2, '#809763');
}
function rainPool(x: number, y: number, width: number) {
  return r(x, y, width, 13, '#243f40') + r(x + 3, y + 2, width - 6, 8, '#567e74') + r(x + 8, y + 4, width - 17, 1, '#b2bf99') + r(x + width - 13, y + 9, 6, 1, '#829f87');
}
export function bambooClump(x: number, y: number, count = 5, tall = 100) {
  let s = '';
  for (let i = 0; i < count; i++) {
    const bx = x + i * 9, top = y - tall + i * 17 % 28;
    s += r(bx, top, 5, y - top, i % 2 ? '#456c54' : '#5d7f59') + r(bx + 1, top, 1, y - top, '#859669');
    for (let yy = y - 12; yy > top; yy -= 21) s += r(bx - 1, yy, 7, 2, '#9eaa77') + r(bx, yy + 2, 5, 1, '#2f5949');
    s += p(`M${bx + 2} ${top + 8}h-13v-3h-9v-3h15v3h7z M${bx + 3} ${top + 18}h12v-3h11v-3h-15v3h-8z`, '#416c50');
    s += p(`M${bx} ${top + 5}h-12v-3h-10v-2h14v2h8z M${bx + 4} ${top + 15}h14v-3h8v-2h-14v3h-8z`, '#759066');
  }
  return s;
}
function base(turning: boolean) {
  let s = r(0, 0, 640, 480, turning ? '#293f43' : '#314b45');
  for (let i = 0; i < 120; i++) {
    const x = i * 113 % 640, y = i * 67 % 480, w = 14 + i % 5 * 6;
    s += r(x, y, w, 9, i % 2 ? '#507155' : '#1d3735', .22) + r(x + 4, y - 3, w - 9, 15, '#4d6b51', .17);
  }
  for (let i = 0; i < 500; i++) s += r(i * 73 % 640, i * 47 % 480, i % 3 + 1, 1, i % 2 ? '#426052' : '#3d574d', .48);
  const trail = turning ? turningTrail : vergeTrail;
  s += `<path d="${trail}" fill="none" stroke="#1e3837" stroke-width="9" opacity=".4"/>`;
  s += turning ? p(turningTrail, '#829078') + p('M295 450h53V300h183v-91h-14v76H346V86h-45v199H123v-76H99v91h196z', '#9a9e7e')
    : p(vergeTrail, '#849278') + p('M74 435h62v-88h91v-38h184v-51h166v-65h-40v48H391v46H213v40h-90v53H74z', '#a2a283');
  // Texture follows the walking trail, keeping its silhouette easy to read.
  s += `<defs><clipPath id="trail-texture"><path d="${trail}"/></clipPath></defs><g clip-path="url(#trail-texture)">`;
  for (let i = 0; i < 210; i++) {
    const x = i * 83 % 630, y = i * 59 % 470;
    s += r(x, y, 3 + i % 5, 1, i % 3 ? '#d0c59a' : '#68785e', .4);
    if (i % 5 === 0) s += r(x + 2, y + 2, 2, 1, '#e1d4aa', .45);
  }
  s += '</g>';
  for (let i = 0; i < 100; i++) s += r(65 + i * 61 % 510, 85 + i * 43 % 340, 2 + i % 4, 1, '#c3be94', .24);
  // Low ferns and leaf litter stay walkable; the tall clumps have matching colliders.
  for (const [x, y] of [[53, 275], [184, 281], [200, 368], [286, 265], [351, 190], [450, 349], [539, 294], [385, 431], [135, 445], [550, 443], [325, 72]]) {
    s += p(`M${x} ${y}h2v-10h-2z M${x - 8} ${y - 7}h7v3h-4v-1h-3z M${x + 2} ${y - 6}h7v2h-5v2h-2z`, '#7e9468', .8);
    s += r(x - 4, y + 5, 7, 2, '#b1a477', .5) + r(x + 6, y + 2, 3, 1, '#c7bb8b', .45);
  }
  for (const [x, y] of [[184, 340], [362, 388], [455, 257], [538, 171]]) s += p(`M${x} ${y}h17v2h6v6h-9v2h-17v-5h3z`, '#557d72', .55) + r(x + 2, y + 3, 9, 1, '#a5bba0', .6);
  // Fine growth at the margins; low foliage can be walked over.
  for (let i = 0; i < 48; i++) {
    const x = 20 + i * 97 % 600, y = 170 + i * 53 % 285;
    s += p(`M${x} ${y}v-6h2v4h2v-7h1v9z`, i % 2 ? '#6d895e' : '#55794f', .7);
    if (i % 6 === 0) s += r(x + 3, y - 8, 3, 2, '#c0ac85') + r(x + 4, y - 9, 1, 1, '#e1cd9c');
  }
  for (const [x, y] of [[185, 263], [270, 378], [467, 432], [523, 174], [70, 452]]) s += fern(x, y);
  return s;
}
let verge = base(false);
for (const [x, y, n, h] of [[45, 250, 13, 180], [197, 205, 9, 155], [550, 412, 6, 105], [216, 441, 18, 55], [38, 344, 4, 96]]) verge += bambooClump(x, y, n, h);
// A shelter built for travelers of different sizes; broad eaves and an accessible low bench.
verge += r(394, 161, 135, 12, '#475e4b') + r(398, 109, 5, 62, '#a5976b') + r(517, 109, 5, 62, '#95865d');
verge += p('M389 103h141v8h10v8H378v-8h11z', '#a79e72') + r(389, 102, 141, 3, '#d1c18d') + r(380, 118, 158, 4, '#647253');
for (let i = 0; i < 16; i++) verge += r(389 + i * 9, 105, 2, 11, '#c1b27e');
for (let row = 0; row < 3; row++) for (let col = 0; col < 20; col++) verge += r(386 + col * 7 + row % 2 * 3, 105 + row * 4, 5, 1, row % 2 ? '#877f59' : '#d1bf88', .65);
verge += r(403, 145, 112, 4, '#b2a477') + r(411, 149, 4, 17, '#7a805a') + r(503, 149, 4, 17, '#7a805a');
verge += r(409, 123, 102, 14, '#566f55') + r(413, 126, 94, 1, '#899775') + r(413, 131, 94, 1, '#758565');
for (let i = 0; i < 9; i++) verge += r(415 + i * 10, 123, 1, 14, '#a4a074');
verge += r(425, 137, 5, 16, '#d3bf8c') + r(423, 141, 9, 3, '#c2a977') + r(482, 139, 11, 9, '#aa9569') + r(483, 137, 9, 2, '#ccba87');
verge += r(462, 144, 14, 17, '#8d7859') + r(460, 143, 18, 3, '#c4ad7e') + r(465, 140, 8, 3, '#b8aa7b');
for (let i = 0; i < 4; i++) verge += r(463, 148 + i * 3, 12, 1, '#b99c6e');
verge += r(444, 151, 12, 8, '#698073') + r(446, 149, 8, 2, '#c4bb91') + r(448, 153, 4, 1, '#a1b2a0');
verge += mossRock(202, 180, 36) + fern(249, 197) + mossRock(557, 399, 32);
verge += rainPool(512, 385, 30) + rainPool(535, 424, 33);
for (let i = 0; i < 8; i++) verge += r(562 + i % 3 * 7, 322 + i * 10, 2, 7, '#9caa77');
verge += r(440, 283, 64, 5, '#c2ad7f') + r(443, 288, 4, 10, '#7b7957') + r(495, 288, 4, 10, '#7b7957');
verge += r(450, 275, 9, 8, '#b9c4a0') + r(449, 274, 11, 2, '#e5dab4') + r(473, 278, 5, 5, '#8daca0') + r(472, 277, 7, 2, '#d7d2a7');
verge += r(325, 256, 2, 27, '#d5bb81') + r(320, 254, 13, 2, '#8c8d61');
for (let i = 0; i < 5; i++) verge += r(323 - i % 2, 259 + i * 4, 6, 2, '#c4a871');
for (let i = 0; i < 9; i++) verge += p(`M${230 + i * 15} ${350 - i * 12}h4v3h-1v2h-3z`, '#61735c', .7);
verge += r(490, 204, 18, 20, '#b3a376') + r(488, 201, 22, 3, '#d7c493') + r(498, 223, 3, 17, '#857c56');
for (let i = 0; i < 4; i++) verge += r(493, 207 + i * 4, 11 - i % 2 * 3, 1, '#65765a');
// The named entrance and bright threshold share the real Travel target (553, 246).
verge += r(524, 184, 5, 59, '#9a8a5f') + r(579, 184, 5, 59, '#9a8a5f') + r(523, 181, 62, 6, '#d0b77c');
for (const x of [524, 579]) for (const y of [196, 217, 237]) verge += r(x - 1, y, 7, 2, '#d9c28d');
verge += r(496, 163, 108, 16, '#243f39') + r(496, 162, 108, 2, '#e6ca8b') + r(496, 178, 108, 2, '#a58b59');
verge += pixelLettering('TURNING PATHS', 550, 165, '#f7e3ac', 2);
verge += r(530, 244, 48, 3, '#e5cb91') + r(530, 248, 48, 2, '#637655');
verge += p('M540 234h15v-5l10 9-10 9v-5h-15z', '#f2d490');
verge += r(519, 199, 2, 9, '#ead6a0') + r(518, 202, 5, 3, '#bd9c6b') + r(579, 200, 2, 10, '#ead6a0');
export const BAMBOO_GROUND_SVG = wrapSvg(verge, 640, 480);
let turning = base(true);
for (const [x, y, n, h] of [[37, 158, 24, 108], [392, 158, 24, 108], [37, 421, 17, 110], [455, 421, 17, 110], [214, 246, 6, 64], [380, 270, 5, 36]]) turning += bambooClump(x, y, n, h);
for (const [x, y] of [[151, 290], [423, 290], [370, 191]]) turning += r(x - 10, y - 14, 20, 13, '#a9a17b') + r(x - 8, y - 12, 16, 9, '#d2c497') + r(x - 1, y, 3, 9, '#73785a');
// Pools and stones remain within the existing blocked groves.
turning += rainPool(162, 170, 35) + fern(183, 191) + mossRock(186, 160, 31);
turning += rainPool(457, 170, 40) + mossRock(548, 161, 34) + fern(456, 190);
turning += mossRock(65, 428, 44) + fern(123, 431) + mossRock(491, 427, 38) + fern(542, 433);
// Old low bamboo laid beside the paths, bound with weathered survey thread.
for (const [x, y] of [[173, 347], [451, 363]]) {
  turning += r(x, y, 38, 4, '#8a9062') + r(x + 2, y, 34, 1, '#bbc18b');
  for (let i = 0; i < 4; i++) turning += r(x + i * 10, y - 1, 2, 6, '#525f49');
}
export const TURNING_GROUND_SVG = wrapSvg(turning, 640, 480);
let canopy = '';
for (let i = 0; i < 24; i++) canopy += p(`M${i * 29 - 10} ${i % 3 * 9}h30v5h13v4h-26v-4h-17z`, i % 2 ? '#6e8a64' : '#456d55', .9);
canopy += bambooClump(604, 300, 4, 160) + bambooClump(8, 275, 3, 160);
export const BAMBOO_CANOPY_SVG = wrapSvg(canopy, 640, 480);

export function landmarkGlyph(name: Landmark, x: number, y: number) {
  if (name === 'Split stone') return p(`M${x - 7} ${y - 4}h3v-3h8v3h4v9h-15z`, '#d9d0a3') + p(`M${x} ${y - 7}h2v5h-2v4h2v3h-2v-5h-2v-4h2z`, '#5e7864');
  if (name === 'Bent bamboo') return p(`M${x - 3} ${y + 6}h2v-8h3v-4h5v-2H${x + 1}v2h-3v5h-1z`, '#d6c78b') + r(x - 8, y - 4, 8, 2, '#a8bb86') + r(x + 2, y - 2, 8, 2, '#a8bb86');
  return p(`M${x - 8} ${y - 4}h6v2h7v-2h5v2h-5v2h-7v-2h-6z M${x - 8} ${y + 2}h6v2h7v-2h5v2h-5v2h-7v-2h-6z`, '#b6d1ba');
}
export function turningStateSvg(progress: Progress) {
  let s = '';
  for (const [id, x, y] of [['forkWest', 110, 230], ['forkNorth', 320, 108], ['forkEast', 528, 230]] as const) {
    s += bamboo(x - 1.5, y - 16, 12, 'story-fork-post-' + id, 3) + plank(x - 12, y - 34, 24, 19, 'story-fork-' + id);
    s += landmarkGlyph(landmarkAt(id, progress.chapterTwo.trailStep), x, y - 25);
  }
  for (const [name, x, y] of [['Split stone', 151, 290], ['Bent bamboo', 423, 290], ['Running water', 370, 191]] as const) {
    s += bamboo(x - 1, y - 1, 9, 'story-study-post-' + x, 3) + plank(x - 11, y - 16, 22, 16, 'story-study-' + x) + landmarkGlyph(name, x, y - 8);
  }
  return wrapSvg(s, 640, 480);
}
export function bambooAirSvg(clock: number) {
  const t = Math.floor(clock * 4) / 4;
  let s = p('M285 25h38l140 268h-63z M403 10h17l103 219h-26z', '#e4ddaa', .045);
  for (let i = 0; i < 22; i++) { const x = (i * 43 + Math.floor(t * 3)) % 610, y = 45 + (i * 71 + Math.floor(t * 17)) % 365;
    s += r(x, y, 1, 3, '#d4dcca', .15);
  }
  s += r(173 + Math.floor(Math.sin(t * .6) * 4), 75 + Math.floor(t * 7) % 200, 3, 1, '#c9bb83', .6);
  return wrapSvg(s, 640, 480);
}
