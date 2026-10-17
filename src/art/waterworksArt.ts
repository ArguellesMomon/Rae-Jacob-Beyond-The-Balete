import { pixelCanopy, pixelNoise, pixelPath as path, pixelRect as rect, wrapSvg } from './pixelArt.ts';
import type { Progress } from '../game/model.ts';

const label = (x: number, y: number, text: string, color = '#e2d3a6', size = 5) => `<text x="${x}" y="${y}" font-family="monospace" font-size="${size}" fill="${color}" text-anchor="middle">${text}</text>`;
function lamp(x: number, y: number) {
  return rect(x - 9, y - 8, 18, 18, '#e2bb72', .05) + rect(x - 1, y - 10, 2, 9, '#9b8c61') + rect(x - 3, y - 2, 6, 7, '#be9758') + rect(x - 2, y - 1, 4, 4, '#f4d591');
}
function ground() {
  let s = rect(0, 0, 704, 480, '#2c4849');
  s += path('M40 320h80v31h54v57h80v-93h11V200h23v-67h73v97h25v109h27v26h70v-27h39V234h35v-31h47v90h61v40h-39v78H463v19H119v-41H69z', '#566c5c');
  s += path('M69 334h54v34h61v55h114V243h18v-48h18v48h35v120h30v34h90v-31h38V255h44v-27h30v84h61v12h-56v59h-42v30H309v19H115v-56H69z', '#77816a');
  for (let i = 0; i < 1250; i++) s += rect(Math.floor(pixelNoise(i, 54, 19) * 704), Math.floor(pixelNoise(i, 74, 11) * 480), i % 7 ? 1 : 3, 1, i % 2 ? '#b8b08b' : '#193b41', .24);
  // Both channels rejoin below the machinery. Rae never enters either water bed.
  s += rect(204, 92, 252, 38, '#777b60') + rect(208, 96, 244, 30, '#3a6871');
  s += rect(204, 126, 40, 286, '#68765e') + rect(208, 126, 32, 282, '#454f48');
  s += rect(408, 0, 48, 480, '#66765e') + rect(412, 0, 40, 480, '#345f6b');
  s += path('M208 402h32v40h212v30H218v-13h-10z', '#315563') + path('M215 405h17v45h209v12H223v-14h-8z', '#48777b');
  s += rect(196, 412, 57, 25, '#374f45');
  for (let x = 198; x < 252; x += 6) s += rect(x, 414, 5, 21, '#aa9569') + rect(x, 414, 4, 1, '#cfb783');
  s += rect(195, 412, 59, 2, '#c2ae7a') + rect(195, 436, 59, 2, '#72644b');
  // Diagram shelter and tiny waterkeeper tools.
  s += rect(303, 150, 38, 34, '#665d46') + rect(305, 152, 34, 24, '#d0bf8c') + rect(301, 147, 42, 5, '#a18a5e');
  s += path('M322 154v7h-9v8h-3v-11h9v-4z M322 161h11v10h-3v-7h-8z', '#4c7775');
  s += label(312, 174, 'W', '#58634b', 5) + label(332, 174, 'E', '#58634b', 5);
  s += rect(309, 178, 3, 9, '#807554') + rect(333, 178, 3, 9, '#807554');
  s += rect(313, 196, 18, 9, '#45594e') + rect(316, 195, 9, 9, '#a28c60') + rect(316, 203, 9, 3, '#534f3e');
  s += '<path d="M321 195V136H352V112" stroke="#9c9a69" stroke-width="2" fill="none"/>';
  s += rect(347, 96, 10, 30, '#a7915e') + rect(349, 98, 6, 26, '#c4b77d');
  // Branch recess, safe grating, and a ladder that is decorative rather than a route into water.
  s += path('M248 240h39v22h-8v8h-32z', '#3e5149') + path('M251 244h32v15h-8v7h-24z', '#8b8566');
  s += rect(376, 286, 32, 49, '#53695e');
  for (let x = 378; x < 408; x += 5) s += rect(x, 288, 2, 45, '#b0ac8d');
  for (const y of [291, 310, 330]) s += rect(376, y, 32, 2, '#7c8b78');
  s += rect(374, 284, 34, 3, '#d2bb83');
  s += path('M360 260v-42h-5v42h-9v5h17v-5z', '#9c9a64') + rect(345, 258, 4, 10, '#475c50') + rect(358, 224, 1, 31, '#d1bb7c');
  // Footbridge planks are broad enough for Rae and Tala. The name, not the physical planks, is missing.
  s += rect(382, 362, 96, 31, '#344d44');
  for (let x = 384; x < 478; x += 7) s += rect(x, 365, 6, 24, '#a58c60') + rect(x + 1, 366, 4, 2, '#c9b47e');
  s += rect(382, 362, 96, 3, '#ceb87e') + rect(382, 389, 96, 3, '#695b43');
  for (const x of [383, 404, 454, 475]) s += rect(x, 352, 3, 13, '#a59162');
  // Smooth cut across a separate, dark side passage. The road bends to its right.
  s += rect(566, 103, 61, 54, '#1a353d') + path('M550 146h86v15h13v22h-14v9h-82v-14h-10v-18h7z', '#555b49');
  s += path('M555 149h75v7h-75z M555 164h81v5h-81z M561 179h69v5h-69z', '#8c8562');
  s += rect(575, 152, 24, 35, '#aaa583') + rect(578, 153, 17, 33, '#c0bba0');
  s += path('M581 158h11v3h3v14h-3v4h-11v-4h-3v-14h3z', '#e2e5c9') + path('M583 162h7v2h2v8h-2v3h-7v-3h-2v-8h2z', '#899c8b') + rect(585, 165, 3, 7, '#e7e8cf');
  // Trail signs and home-like details help orient the player.
  s += rect(81, 306, 3, 27, '#8a7d55') + rect(65, 305, 36, 10, '#a99567') + label(83, 312, 'GROVE ‹', '#394c42');
  s += rect(113, 390, 3, 16, '#8a7d55') + rect(97, 386, 40, 10, '#a99567') + label(117, 393, 'CLEARING', '#394c42');
  s += rect(624, 266, 3, 22, '#9a8b63') + rect(602, 263, 47, 12, '#b2a574') + label(626, 271, 'BAMBOO ›', '#3b5144');
  s += rect(65, 172, 34, 58, '#4a5145') + path('M68 171h7v55h-7z M83 178h4v54h-4z', '#737357');
  s += rect(610, 349, 20, 47, '#4a5447') + rect(615, 350, 4, 43, '#7a7e59');
  for (const [x, y] of [[119, 346], [277, 183], [369, 249], [481, 358], [547, 227], [652, 311]]) s += lamp(x, y);
  // Reeds, ferns, mossy stones and bamboo soften the engineered channels.
  for (const [x, y] of [[174, 157], [173, 286], [267, 121], [269, 364], [365, 139], [476, 118], [494, 304], [644, 231], [542, 397]]) {
    s += path(`M${x} ${y}h17v4h4v7h-23v-8h2z`, '#4e6659') + rect(x + 3, y + 1, 11, 3, '#89917a') + rect(x + 1, y - 2, 6, 4, '#668364');
    s += path(`M${x - 5} ${y + 8}v-9h-3v-4h3v3h3v13z M${x - 4} ${y + 2}h-6v-3h4v-3h2z`, '#8a9a6f');
  }
  for (const [x, y] of [[121, 100], [155, 245], [496, 53], [635, 76], [658, 345]]) for (let j = 0; j < 3; j++) {
    const bx = x + j * 9, by = y + j % 2 * 12;
    s += rect(bx, by, 4, 57, '#4c725c') + rect(bx + 1, by, 1, 57, '#88a477');
    for (let k = 8; k < 55; k += 13) s += rect(bx - 1, by + k, 6, 2, '#a1a77b');
    s += path(`M${bx} ${by + 14}h-8v-3h-6v-3h10v3h4z M${bx + 3} ${by + 29}h8v-3h6v-3h-10v3h-4z`, '#70946b');
  }
  for (let i = 0; i < 36; i++) { const x = 40 + Math.floor(pixelNoise(i, 83, 5) * 620), y = 442 + i % 3 * 5; s += rect(x, y, 2, 4, '#b7b68e') + rect(x - 2, y - 2, 6, 3, i % 2 ? '#719787' : '#b4976f'); }
  return s;
}
export const WATERWORKS_GROUND_SVG = wrapSvg(ground(), 704, 480);
export const WATERWORKS_CANOPY_SVG = wrapSvg(
  [[22, 26, 84, 55], [142, 23, 90, 43], [331, 15, 79, 42], [546, 17, 96, 48], [692, 96, 32, 99], [16, 232, 40, 103], [45, 472, 86, 26], [657, 470, 63, 22]].map(([x, y, rx, ry], i) => pixelCanopy(x, y, rx, ry, i + 62, true)).join('')
    + path('M12 56h2v81h-2z M157 37h1v47h-1z M655 27h2v116h-2z', '#97a380', .5), 704, 480);

export const BELL_SVG = wrapSvg(path('M8 2h7v3h3v11h3v3H2v-3h3V5h3z', '#735c39') + path('M9 4h5v3h2v10H7V7h2z', '#d1ae62') + rect(10, 1, 3, 4, '#e5cb8a') + rect(9, 7, 2, 8, '#edcf84') + rect(3, 17, 17, 2, '#ebca7f') + rect(10, 20, 3, 2, '#9d8251'), 23, 24);

export function waterworksStateSvg(p: Progress) {
  let s = '';
  s += rect(209, 127, 30, 274, p.flowDiverted ? '#467880' : '#6d725e');
  for (let y = 134; y < 399; y += 13) s += rect(214, y, 12, 1, p.flowDiverted ? '#92b3a0' : '#85836a', .6);
  s += rect(413, 126, 38, 235, p.flowDiverted ? '#495b55' : '#3e7380');
  for (let y = 137; y < 357; y += 17) s += rect(425, y, 16, 1, p.flowDiverted ? '#6b7864' : '#87b0a2', .6);
  // The branch has exactly one safe destination, rendered on the open recess.
  const bx = p.branchMoved ? 255 : 198, by = p.branchMoved ? 245 : 265;
  s += path(`M${bx} ${by}h44v5h9v5h-26v4h-9v-7h-18z`, '#5b5944') + rect(bx + 3, by + 1, 38, 3, '#a59166') + rect(bx + 26, by - 6, 4, 8, '#827451');
  s += path(p.flowDiverted ? 'M320 197l-12-14h-5l15 17z' : 'M320 197l12-14h5l-15 17z', '#d4b67b') + rect(p.flowDiverted ? 300 : 331, 179, 9, 5, '#986b4c');
  s += path(p.flowDiverted ? 'M351 109h-10v4h10z' : 'M354 109h11v4h-11z', '#f0d28b');
  if (!p.waterRestored) s += path('M363 346h41v16h-19v7h-30v-14h8z M83 406h66v15H83z', p.flowDiverted ? '#546e68' : '#487784');
  if (!p.bellRung) s += rect(410, 365, 44, 24, '#b4bb9c', .22) + path('M416 370h13v3h-7v5h10v3h-16v-3h3v-5h-3z M439 370h8v11h-8z', '#d7d5ae', .7);
  if (p.bellRung) s += lamp(405, 352) + lamp(454, 352) + label(433, 359, 'BAMBOO CROSSING', '#eee1b7', 4);
  return wrapSvg(s, 704, 480);
}

export function wheelSvg(angle: number) {
  let s = path('M16 0h24v4h8v8h4v8h4v20h-4v8h-8v4H12v-4H4v-8H0V16h4v-8h8V4h4z', '#354b43');
  s += '<circle cx="28" cy="28" r="23" fill="#796443" stroke="#bea16c" stroke-width="4"/>';
  s += `<g transform="rotate(${angle} 28 28)">`;
  for (let i = 0; i < 8; i++) s += `<g transform="rotate(${i * 45} 28 28)">` + rect(25, 4, 6, 24, '#b99c67') + rect(19, 1, 18, 6, '#d1b779') + rect(20, 6, 16, 2, '#6a593f') + '</g>';
  return wrapSvg(s + '</g>' + rect(22, 22, 12, 12, '#d2b77b') + rect(25, 25, 6, 6, '#5e614b'), 56, 56);
}

export function clearingRepairSvg(p: Progress, includeBell = true) {
  let s = '';
  if (p.waterRestored) s += rect(461, 266, 25, 24, '#5a7465') + path('M462 282h23v3h-23z', '#8b9475') + rect(87, 141, 7, 8, '#f8d88b') + rect(84, 140, 3, 10, '#493f38') + rect(94, 140, 3, 10, '#493f38');
  if (p.bellHung) s += rect(380, 295, 5, 19, '#4d5948') + rect(382, 295, 1, 9, '#dfcd9a') + (includeBell ? `<g transform="translate(375 302) scale(.65)">${BELL_SVG.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>` : '');
  if (p.bellRung) s += rect(371, 319, 24, 12, '#c8b782') + label(383, 324, 'BAMBOO', '#425b47', 3.2) + label(383, 328, 'CROSSING', '#425b47', 3.2) + lamp(472, 268) + path('M353 343h12v3h-12z M356 340h6v8h-6z', '#82926a') + rect(357, 342, 4, 3, '#d1b888');
  return wrapSvg(s, 576, 448);
}
