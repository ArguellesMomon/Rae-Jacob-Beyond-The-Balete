import { pixelPath as p, pixelRect as r, wrapSvg } from './pixelArt.ts';
import { RESIDENTS } from '../game/residents.ts';
import type { ResidentId } from '../game/model.ts';

function mat(x: number, y: number, w: number) {
  let s = r(x, y, w, 10, '#aa9467') + r(x, y, w, 1, '#d3b989');
  for (let i = 3; i < w; i += 4) s += r(x + i, y + 1, 1, 8, '#786d4d');
  return s + r(x + 1, y + 5, w - 2, 1, '#cfb58a');
}
function pot(x: number, y: number) { return p(`M${x} ${y}h10v3h-1v7h-8v-7h-1z`, '#a77954') + p(`M${x + 4} ${y}v-7h2v3h4v2h-4v2z M${x + 3} ${y - 2}h-4v-3h4z`, '#8d9e6c'); }
let clearing = '';
clearing += r(338, 178, 20, 4, '#a58d62') + r(339, 182, 2, 7, '#665f45') + r(355, 182, 2, 7, '#665f45');
clearing += r(345, 165, 7, 11, '#c3a265') + r(347, 167, 3, 7, '#efd9a1') + r(343, 176, 11, 2, '#706043') + r(354, 173, 2, 4, '#ded3aa');
clearing += r(267, 177, 23, 19, '#8c7955') + r(269, 179, 19, 15, '#594f3e') + r(270, 195, 2, 6, '#746746') + r(285, 195, 2, 6, '#746746');
for (const [x, y] of [[271, 181], [280, 183], [274, 188]]) clearing += r(x, y, 6, 5, '#ddd0a1') + r(x + 1, y + 1, 3, 1, '#8b946c');
clearing += r(141, 164, 1, 18, '#aa9668') + r(164, 164, 1, 18, '#aa9668') + r(141, 166, 24, 1, '#c8b080') + r(147, 167, 7, 9, '#c39e8d') + r(157, 175, 3, 4, '#bda777') + r(151, 175, 3, 4, '#bda777');
clearing += mat(299, 268, 27) + r(309, 264, 12, 9, '#9e7c58') + r(311, 263, 8, 1, '#d7ba84') + r(315, 265, 1, 7, '#d0ad79');
clearing += pot(73, 183) + pot(207, 151) + pot(352, 340);
for (const [x, y] of [[120, 214], [231, 253], [329, 235], [367, 322]]) clearing += p(`M${x} ${y}h13v2h3v3h-15v-2h-1z`, '#9a9f80') + r(x + 2, y, 8, 1, '#b5b69a');
clearing += r(121, 208, 14, 3, '#b79b6b') + r(124, 205, 8, 3, '#c7ad79');
for (const [x, y] of [[269, 329], [346, 276], [156, 228]]) clearing += r(x, y, 3, 3, '#b29f75') + r(x + 3, y + 2, 5, 1, '#6a8262');
export const CLEARING_DETAILS_SVG = wrapSvg(clearing, 576, 448);

let grove = '';
grove += mat(105, 398, 32);
for (let i = 0; i < 5; i++) grove += r(108 + i * 6, 400, 4, 5, '#6c6549') + r(109 + i * 6, 401, 2, 2, '#cfb78a');
grove += p('M337 275h17v3h-2v7h-13v-7h-2z', '#71916a') + r(340, 279, 10, 2, '#b8c6a1') + r(344, 274, 1, 9, '#c2c28e') + r(336, 285, 20, 3, '#7a8064');
grove += p('M300 414h21v2h5v5h-27v-3h-3v-2h4z', '#777e68') + r(302, 414, 17, 2, '#a2a58a') + p('M299 417h8v2h-8z M316 418h8v3h-8z', '#6b8a66');
grove += pot(117, 290) + r(125, 293, 14, 4, '#8d805c');
for (const [x, y] of [[161, 311], [285, 406], [337, 321], [194, 466]]) grove += r(x, y, 10, 3, '#566753') + r(x + 2, y, 5, 1, '#b9aa7d');
// Exposed roots, lichen and small fungal shelves remain clear of the approach.
grove += p('M65 261h4v24h11v3H65z M348 239h3v27h12v3h-15z M306 441h23v3h-11v16h-3v-16h-9z', '#7c7959');
for (const [x, y] of [[179, 204], [288, 222], [57, 178], [373, 184]]) grove += r(x, y, 7, 2, '#bbb58b') + r(x + 2, y + 2, 3, 3, '#8f9c76');
export const GROVE_DETAILS_SVG = wrapSvg(grove, 480, 512);

let works = mat(271, 385, 32);
for (const x of [277, 286, 295]) works += r(x, 386, 2, 7, '#c2cbb3') + r(x - 1, 386, 4, 2, '#8f9f91');
works += r(256, 112, 4, 20, '#9e8f68') + r(257, 113, 1, 16, '#dbcca0');
for (const y of [115, 120, 125]) works += r(253, y, 8, 1, '#e9d9ad');
works += r(249, 128, 16, 3, '#8f9f80') + r(250, 126, 4, 3, '#c7cca5');
works += r(161, 355, 2, 25, '#a69668') + r(159, 354, 19, 2, '#c1ad7a');
for (const [x, h] of [[165, 12], [170, 17], [175, 13]]) works += r(x, 357, 2, h, '#b7c39a') + r(x, 361, 2, 1, '#6c8978');
works += r(269, 338, 25, 5, '#8a7953') + r(271, 343, 2, 7, '#5b6047') + r(291, 343, 2, 7, '#5b6047') + r(276, 334, 9, 4, '#c2b18a');
for (const [x, y] of [[248, 174], [359, 349], [174, 414], [469, 402], [519, 212]]) works += r(x, y, 13, 3, '#819782') + r(x + 2, y, 7, 1, '#bcc6a1');
works += p('M117 281h22v2h-22z M118 286h20v2h-20z M120 291h18v2h-18z', '#798668') + r(126, 278, 2, 17, '#a99a6d');
works += r(385, 146, 10, 5, '#b4a074') + r(387, 143, 6, 4, '#d5bd89') + r(390, 142, 1, 2, '#eee0ad');
export const WORKS_DETAILS_SVG = wrapSvg(works, 704, 480);

export function residentSpriteSvg(id: ResidentId, clock = 1, speaking = false) {
  const person = RESIDENTS[id], blink = (clock + id.length) % 5.7 < .15, mouth = speaking && Math.floor(clock * 5) % 3 === 0;
  const skin = id === 'sela' ? '#ba875e' : id === 'doro' ? '#9d7451' : '#b47f54';
  let s = r(8, 31, 5, 6, skin) + r(20, 31, 5, 6, skin) + r(7, 37, 7, 2, '#725039') + r(19, 37, 7, 2, '#725039');
  s += p('M10 22h13v3h4v10H6V25h4z', person.tint) + r(10, 31, 13, 3, '#62745a') + r(7, 25, 3, 8, skin) + r(24, 24 + Math.floor(clock * 2) % 2, 3, 8, skin);
  s += p('M9 2h13v3h4v17h-4v3H9v-3H5V8h4z', id === 'sela' ? '#938f7f' : id === 'doro' ? '#ada58a' : '#393a2c');
  s += p('M10 9h13v3h2v8h-4v4H11v-3H8V12h2z', skin) + r(10, 12, 2, 8, '#d6a67c');
  s += r(11, 14, 3, blink ? 1 : 2, '#343428') + r(19, 14, 3, blink ? 1 : 2, '#343428') + r(15, 21, 4, mouth ? 2 : 1, '#76503b');
  s += p('M8 6h16v5h-5v2h-4v-3H8z', id === 'sela' ? '#b4ae92' : '#454735');
  s += r(10, 24, 13, 3, person.trim);
  if (id === 'nilo') s += r(24, 29, 6, 8, '#b19a5f') + r(26, 30, 2, 5, '#ffe1a1') + r(25, 28, 4, 1, '#d1bf89') + r(7, 6, 3, 8, '#a0a189');
  if (id === 'sela') s += r(4, 8, 4, 8, '#b4ae92') + r(11, 29, 12, 7, '#a3865c') + r(12, 30, 10, 1, '#dcc38d') + r(17, 31, 1, 4, '#d1b47d');
  if (id === 'doro') s += r(12, 22, 10, 2, '#b5ab8c') + r(13, 29, 9, 7, '#90734f') + r(14, 28, 7, 1, '#cdb689') + r(17, 25, 1, 4, '#c5d09a');
  if (id === 'pilo') s += r(12, 28, 12, 7, '#e0d1a0') + r(14, 30, 7, 1, '#6b8a79') + r(18, 29, 1, 4, '#6b8a79');
  const work = Math.floor(clock * 2) % 2;
  if (id === 'nilo') s += r(24, 29 - work, 3, 2, skin) + r(26, 30 - work, 2, 2, '#ffe7a6');
  if (id === 'sela') s += r(11 + work * 7, 29, 4, 2, skin) + r(12 + work * 7, 30, 2, 1, '#dfbc85');
  if (id === 'doro') s += r(17 + work * 2, 28, 3, 2, '#d6bb83') + r(24, 28 + work, 3, 3, skin);
  if (id === 'pilo') s += r(20 - work * 4, 29, 4, 2, skin) + r(18 - work * 4, 31, 4, 1, '#6b8a79');
  return wrapSvg(s, 32, 40);
}

export const LISTENING_SEED_SVG = wrapSvg(p('M3 6h18v3h3v12H0V9h3z', '#806440') + r(2, 10, 20, 9, '#b08a53') + r(4, 12, 16, 1, '#dfbe7b') + p('M9 1h6v2h3v6h-3v2H9V9H6V3h3z', '#9ca76f') + r(11, 2, 2, 7, '#f0dfac') + r(9, 3, 1, 4, '#d0ce8d'), 24, 22);
