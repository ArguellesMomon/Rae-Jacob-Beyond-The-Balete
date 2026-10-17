import { characterSpriteSvg } from './characterArt.ts';
import type { Direction } from '../game/model.ts';

// Original, code-native pixel artwork. Shared by the native scene and art QA renders.
const rect = (x: number, y: number, w: number, h: number, color: string, opacity = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" opacity="${opacity}"/>`;
const path = (d: string, fill: string, opacity = 1) => `<path d="${d}" fill="${fill}" opacity="${opacity}"/>`;
export const wrapSvg = (body: string, width = 640, height = 448) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">${body}</svg>`;
const noise = (x: number, y: number, seed = 0) => ((Math.imul(x + seed + 47, 374761393) ^ Math.imul(y + 83, 668265263)) >>> 0) % 1000 / 1000;

export { rect as pixelRect, path as pixelPath, noise as pixelNoise, canopy as pixelCanopy };

function canopy(cx: number, cy: number, rx: number, ry: number, seed: number, dark = false) {
  const colors = dark ? ['#294b37', '#365b3d', '#496d42', '#658348', '#7d9550'] : ['#3b613b', '#52753e', '#6f8d46', '#91a352', '#b0b665'];
  const buckets = colors.map(() => '');
  for (let y = -ry; y <= ry; y += 4) {
    for (let x = -rx; x <= rx; x += 4) {
      const n = noise(x, y, seed);
      if ((x * x / (rx * rx) + y * y / (ry * ry)) > 0.86 + n * 0.23) continue;
      const light = -y / ry * 0.75 + n * 2.1 + 1.25;
      const index = Math.max(0, Math.min(4, Math.floor(light)));
      buckets[index] += `M${cx + x} ${cy + y}h4v4h-4z`;
    }
  }
  return buckets.map((d, i) => path(d, colors[i])).join('');
}

function fence(x: number, y: number, length: number, vertical = false) {
  let result = vertical ? rect(x + 3, y, 3, length, '#704d33') + rect(x + 1, y, 2, length, '#c29c62') : rect(x, y + 6, length, 3, '#815739') + rect(x, y + 13, length, 2, '#8d6140');
  for (let i = 0; i < length; i += 10) {
    const px = x + (vertical ? 0 : i), py = y + (vertical ? i : 0);
    result += rect(px + 1, py - 3, 5, 22, '#654b33') + rect(px, py - 4, 4, 21, '#b2915a') + rect(px, py - 4, 1, 20, '#dfbd78') + rect(px, py + 3, 4, 1, '#775738');
  }
  return result;
}

function pot(x: number, y: number, flower: string) {
  return rect(x - 6, y - 5, 14, 5, '#945e40') + rect(x - 5, y, 12, 8, '#ad6e47') + rect(x - 3, y + 6, 8, 3, '#84563b') + rect(x - 5, y, 3, 6, '#c18a5b') +
    path(`M${x - 1} ${y - 15}h3v10h-3z M${x - 7} ${y - 10}h6v4h-6z M${x + 2} ${y - 12}h7v5h-7z`, '#456b3c') +
    rect(x - 7, y - 13, 5, 4, flower) + rect(x + 3, y - 17, 5, 5, flower) + rect(x - 2, y - 21, 4, 4, flower) + rect(x + 4, y - 16, 2, 2, '#eed49a');
}

function house() {
  let out = path('M78 112h228v90H94v-12H78z', '#6d5639', 0.23);
  out += rect(76, 109, 228, 65, '#805438');
  for (let x = 80; x < 302; x += 9) out += rect(x, 113, 1, 60, '#5f432e') + rect(x + 2, 113, 1, 60, '#a27147');
  out += rect(81, 167, 216, 25, '#ab7e4e');
  for (let y = 171; y < 191; y += 5) out += rect(82, y, 213, 1, '#795336');
  // Two capiz-style window banks.
  for (const x of [91, 238]) {
    out += rect(x - 3, 124, 45, 35, '#503c2a') + rect(x, 126, 39, 29, '#e1c78f');
    for (let i = 0; i < 6; i++) out += rect(x + i * 7, 126, 1, 30, '#8d7047');
    for (let i = 0; i < 4; i++) out += rect(x, 126 + i * 8, 39, 1, '#8d7047');
    out += rect(x + 3, 129, 10, 5, '#f1ddb1', 0.6);
  }
  // Open doorway and timber bench.
  out += rect(175, 123, 37, 48, '#4c3c2b') + rect(179, 125, 29, 44, '#3d3327') + rect(180, 145, 9, 21, '#59432b');
  out += rect(141, 157, 29, 5, '#c29661') + rect(143, 162, 3, 9, '#5c412c') + rect(164, 162, 3, 9, '#5c412c') + rect(142, 147, 27, 3, '#b38854');
  // Roof silhouette and corrugation.
  out += path('M62 115l24-39h203l29 39z', '#533e2e');
  out += path('M59 108l28-39h201l33 39v6H59z', '#977d5c');
  const roofColors = ['#a98764', '#a38667', '#ad8060', '#8b826b', '#b18d68'];
  for (let x = 70; x < 314; x += 8) {
    const top = Math.max(69, 108 - (x < 87 ? (x - 59) * 1.4 : x > 287 ? (321 - x) * 1.2 : 39));
    out += rect(x, top, 5, 108 - top, roofColors[Math.floor((x - 70) / 8) % roofColors.length]);
    out += rect(x + 5, top, 1, 108 - top, '#d2b28b');
    if (x % 3 === 0) out += rect(x, top + 8, 5, 12, '#a45f42', 0.7);
  }
  out += rect(87, 68, 202, 3, '#cab38a') + rect(60, 109, 259, 5, '#58432e') + rect(61, 109, 257, 2, '#bc9663');
  // Porch rail with a clear opening over the stairs.
  for (const [x, width] of [[81, 98], [226, 70]]) {
    out += rect(x, 178, width, 3, '#c29862') + rect(x, 190, width, 4, '#725034');
    for (let i = 2; i < width; i += 10) out += rect(x + i, 180, 3, 11, '#9b754b');
  }
  for (const x of [82, 176, 225, 292]) out += rect(x, 111, 4, 83, '#65472e') + rect(x, 113, 1, 78, '#c29459');
  out += rect(180, 193, 44, 4, '#b99a6b') + rect(177, 197, 49, 4, '#947448') + rect(174, 201, 55, 4, '#b99a6b') + rect(174, 205, 55, 2, '#765a3c');
  // Merienda table, plate, pandesal, enamel pitcher.
  out += rect(249, 180, 3, 9, '#67492f') + rect(273, 180, 3, 9, '#67492f') + rect(245, 172, 35, 9, '#a47848') + rect(245, 171, 35, 3, '#c9a46c');
  out += rect(260, 168, 15, 3, '#e6d7ac') + rect(262, 165, 5, 4, '#d2a25b') + rect(268, 165, 5, 4, '#d9af6e') + rect(250, 160, 6, 11, '#e4ddc5') + rect(249, 159, 8, 2, '#668184') + rect(255, 161, 4, 4, '#668184') + rect(251, 162, 1, 7, '#fff1d3');
  // Slippers, walis, and hanging basket.
  out += rect(166, 192, 3, 6, '#8c5d42') + rect(161, 193, 3, 6, '#8c5d42') + path('M286 165l5-19h2l-5 20z', '#cba76a') + path('M282 170l3-8h5l2 8z', '#9d7f46');
  out += rect(223, 126, 1, 10, '#bd9c69') + rect(216, 136, 15, 10, '#ae8752') + rect(219, 133, 9, 16, '#ae8752') + rect(221, 136, 1, 10, '#dfbf7e');
  return out;
}

function yardDetails() {
  let out = '';
  // A worn path between gate and porch, with stones set into the packed earth.
  for (const [x, y, w] of [[266, 372, 17], [251, 344, 20], [245, 313, 17], [228, 282, 19], [216, 251, 15], [202, 218, 18]]) {
    out += path(`M${x} ${y}h${w}v2h3v4h-4v2h-${w - 3}v-2h-3z`, '#ad9b78') + rect(x + 2, y + 1, w - 3, 1, '#d3c3a0');
    out += rect(x + 5, y + 5, 4, 1, '#7e7f5c');
  }
  // Family objects on the porch: woven mat, watering can and a repaired basket.
  out += rect(135, 175, 26, 10, '#9b7853') + rect(136, 176, 24, 8, '#be9a67');
  for (let i = 0; i < 6; i++) out += rect(138 + i * 4, 176, 1, 8, '#8b7450');
  out += rect(137, 179, 22, 1, '#e0bd85') + rect(137, 182, 22, 1, '#e0bd85');
  out += path('M292 172h9v8h-9z M301 174h5v2h-5z M295 169h6v2h-6z', '#76948b') + rect(294, 173, 2, 5, '#aec0a2');
  out += rect(92, 161, 12, 10, '#a98454') + rect(91, 160, 14, 2, '#d6b57d') + rect(95, 157, 6, 2, '#876c44');
  // Chimes and a small hanging fern under the eaves, away from the walkway.
  out += rect(161, 117, 1, 7, '#ba9b62') + rect(154, 124, 15, 2, '#a28559');
  for (const [x, length] of [[155, 12], [160, 17], [166, 13]]) out += rect(x, 126, 1, length, '#d6c59a') + rect(x - 1, 127, 3, length - 2, '#919d8a');
  out += rect(278, 116, 1, 13, '#b6a16a') + path('M271 129h15l-3 8h-9z', '#b08250');
  out += path('M275 128v-5h2v4h3v-5h2v6h4v3h-5v4h-2v-5h-3v6h-2v-7z', '#52794a');
  // Old sungka board: two rows of small hollows and a larger well at each end.
  out += path('M174 325h36v1h3v4h-3v1h-36v-1h-3v-4h3z', '#785133') + rect(175, 325, 34, 1, '#d1a46c');
  out += rect(174, 327, 3, 2, '#3f3b2a') + rect(207, 327, 3, 2, '#3f3b2a');
  for (let i = 0; i < 7; i++) out += rect(179 + i * 4, 326, 2, 1, '#473c2b') + rect(179 + i * 4, 329, 2, 1, '#473c2b');
  out += rect(180, 326, 1, 1, '#e6d3a5') + rect(196, 329, 1, 1, '#e6d3a5');
  // A covered earthen rain jar and its low stand; the foot collider matches the base.
  out += path('M333 284h13v4h4v17h-3v7h-15v-7h-3v-17h4z', '#986344');
  out += rect(332, 288, 4, 16, '#bb875b') + rect(345, 289, 3, 15, '#795239') + rect(331, 283, 17, 3, '#c19d67') + rect(335, 280, 9, 3, '#a98b5a');
  out += rect(332, 312, 16, 2, '#624d33') + rect(335, 293, 2, 6, '#d1a97a');
  // Labels and mulch make the kitchen bed feel cared for rather than decorative.
  for (const x of [77, 101, 125]) out += rect(x, 363, 1, 9, '#a78c5b') + rect(x - 4, 361, 10, 4, '#d7c393') + rect(x - 2, 362, 5, 1, '#7a8054');
  for (let i = 0; i < 24; i++) out += rect(68 + i * 13 % 65, 351 + i * 7 % 15, 2, 1, '#b49668');
  out += path('M396 132h31v4h-31z M401 136h24v3h-24z', '#9a8652', .55);
  // The house has been maintained across many rainy seasons.
  out += rect(99, 114, 17, 2, '#bc9566') + rect(281, 145, 12, 2, '#5d4834');
  for (const [x, y] of [[91, 124], [172, 148], [236, 123], [291, 159]]) out += rect(x, y, 1, 1, '#e4c69b');
  return out;
}

function ground() {
  let out = rect(0, 0, 640, 448, '#71864c');
  out += path('M44 214h36v-17h225v19h40v17h87v-19h53v-22h39v-37h38v49h-24v28h-35v26h-52v31h-20v47h-43v29h-57v30H241v-14H125v-18H78v-41H43z', '#c59c67');
  out += path('M78 223h217v15h96v19h42v51h-28v37H263v20H126v-22H91v-46H62v-41h16z', '#d0ac75');
  out += path('M253 350h67v98h-67z', '#c49c67');
  // Low grass tufts on the lawn; keep the central packed-earth play space clear.
  for (let i = 0; i < 460; i++) {
    const x = Math.floor(noise(i, 17, 90) * 636), y = Math.floor(noise(i, 33, 52) * 443);
    if ((x > 58 && x < 447 && y > 198 && y < 366) || (x > 485 && x < 571 && y > 160 && y < 252) || (x > 250 && x < 325 && y > 355)) continue;
    out += path(`M${x} ${y}v-3h1v2h2v-4h1v4h2v-2h1v4z`, i % 3 ? '#627d45' : '#9da662', 0.65);
  }
  for (let i = 0; i < 1200; i++) {
    const x = Math.floor(noise(i, 4, 12) * 638), y = Math.floor(noise(i, 77, 28) * 446);
    const inYard = x > 76 && x < 438 && y > 216 && y < 354;
    out += rect(x, y, i % 6 === 0 ? 3 : 1, 1, inYard ? i % 3 ? '#bd935f' : '#dfbd83' : i % 3 ? '#647b45' : '#8d995a', 0.65);
  }
  // Dappled canopy shadows, with stepped edges.
  out += path('M28 186h29v11h13v28H58v18H38v-13H28z M42 276h20v12h18v15H62v16H38z M450 329h47v-14h37v26h28v22h-27v22h-43v-18h-42z', '#3d593b', 0.17);
  out += house();
  // Small garden bed and kitchen herbs sit below the washing area.
  out += rect(65, 346, 72, 24, '#886944') + rect(65, 346, 72, 2, '#b29564') + rect(65, 368, 72, 2, '#5d5b36');
  for (let row = 0; row < 2; row++) for (let col = 0; col < 7; col++) {
    const x = 72 + col * 9, y = 354 + row * 10;
    out += path(`M${x} ${y}h2v-3h2v3h3v2h-3v3h-2v-3h-2z`, '#577443') + rect(x + 2, y - 2, 2, 2, '#91a15c');
  }
  out += fence(26, 71, 318, true) + fence(31, 391, 218) + fence(321, 391, 294) + fence(615, 178, 214, true);
  out += fence(349, 156, 144) + fence(580, 156, 40);
  // Calamansi trunk.
  out += path('M407 91h10v35h7v4h-24v-4h7z', '#735238') + rect(409, 90, 3, 36, '#a27b49');
  // Balete trunk and roots; hollow faces the south approach.
  out += path('M528 61h36v67h6v28h13v8h-16v-8h-8v17h-8v-12h-12v14h-9v-12h-13v-7h13v-23h-5z', '#645036');
  out += path('M539 74h5v71h-5z M552 69h4v80h-4z M530 96h4v38h-4z', '#937547');
  out += path('M541 138h13v6h4v19h-22v-19h5z', '#302f25') + rect(540, 157, 13, 4, '#45402b');
  // Laundry; cloth is in the ambient overlay, posts are grounded here.
  out += rect(352, 214, 4, 38, '#7c5d36') + rect(460, 214, 4, 38, '#7c5d36') + rect(352, 214, 112, 1, '#766047');
  out += rect(354, 213, 2, 33, '#c6a16a') + rect(460, 213, 1, 33, '#c6a16a');
  // Washing basin and low bench.
  out += rect(100, 308, 39, 16, '#858574') + rect(98, 306, 43, 4, '#b6b19a') + rect(104, 309, 31, 7, '#576f68') + rect(106, 309, 26, 3, '#89a49a') + rect(102, 320, 35, 4, '#71735e');
  out += rect(145, 297, 11, 19, '#9e7551') + rect(146, 298, 9, 3, '#c4a273') + rect(148, 301, 1, 12, '#d5bd89');
  out += rect(169, 324, 44, 6, '#9c7747') + rect(173, 330, 4, 9, '#674d31') + rect(205, 330, 4, 9, '#674d31') + rect(170, 324, 42, 2, '#c2a069');
  out += pot(64, 208, '#e0846c') + pot(87, 215, '#ecc77d') + pot(307, 202, '#de7869') + pot(326, 213, '#f0c36e') + pot(71, 292, '#df896c');
  // More plants along the margins leave the playable center open.
  for (const [x, y] of [[32, 260], [42, 340], [104, 370], [360, 376], [477, 350], [587, 269], [598, 330], [592, 379]]) {
    out += canopy(x, y, 16, 10, x) + rect(x - 2, y - 8, 3, 3, '#d8b473');
  }
  // Fallen leaves, flat stones, and a small sleeping cat on the porch.
  out += path('M242 284h4v2h-4z M307 320h3v2h-3z M382 194h4v2h-4z', '#9b7746');
  out += rect(132, 346, 7, 3, '#a99976') + rect(475, 277, 5, 3, '#a99976');
  out += rect(112, 178, 14, 5, '#e4d3a9') + rect(110, 175, 5, 6, '#f3e4c5') + rect(110, 173, 2, 3, '#ba895e') + rect(114, 174, 2, 3, '#ba895e') + rect(119, 176, 4, 3, '#bd8c5c');
  out += yardDetails();
  return out;
}

export const GROUND_SVG = wrapSvg(ground());
export const CANOPY_SVG = wrapSvg(
  canopy(173, 27, 65, 28, 66) +
  canopy(412, 76, 45, 35, 79) +
  Array.from({ length: 15 }, (_, i) => {
    const x = 380 + Math.floor(noise(i, 1, 7) * 65), y = 58 + Math.floor(noise(i, 3, 7) * 40);
    return rect(x, y, 3, 3, '#dcb557') + rect(x, y, 2, 1, '#f0cd69');
  }).join('') +
  canopy(548, 59, 70, 55, 36, true) +
  path('M503 74h2v53h-2z M517 85h2v32h-2z M579 82h2v46h-2z M596 71h2v38h-2z', '#6a7145') +
  canopy(30, 38, 63, 42, 124) + canopy(20, 139, 34, 43, 22) + canopy(615, 427, 65, 42, 65) + canopy(27, 429, 49, 32, 44) +
  // Banana leaves frame the right fence rather than hiding the walkable path.
  path('M622 204h4v80h-4z', '#817845') +
  path('M623 217h-8v-4h-10v-5h-8v-5h-10v-4h-9v-5h19v4h12v5h8v6h6z', '#507b47') +
  path('M624 219h8v-5h8v-6h10v-6h-17v5h-9z M621 225h-10v4h-9v6h-6v7h-8v6h12v-6h9v-6h8v-6h4z', '#6f914e') +
  path('M624 232h8v7h8v8h6v10h-7v-7h-8v-9h-7z', '#416b41')
);

export function raeSvg(direction: Direction = 'down', frame = 0): string {
  return characterSpriteSvg('rae', direction, frame ? frame * 2 : -1).replace('width="32" height="48"', 'width="16" height="26"');
}

export const LOLA_SVG = characterSpriteSvg('lola', 'down', -1).replace('width="32" height="48"', 'width="16" height="26"');

export function laundrySvg(frame: number) {
  const offset = frame % 2;
  return wrapSvg(
    `<g transform="translate(0 ${offset})">` +
    path('M369 216h9v4h5v12h-5v12h-15v-12h-5v-12h6v-4z', '#ece1b9') +
    path('M399 216h12v5h5v8h-4v14h-16v-14h-4v-8h7z', '#7a9290') +
    rect(430, 216, 17, 29, '#c29679') + rect(433, 216, 2, 29, '#e2c4a1') + rect(443, 216, 1, 29, '#e2c4a1') +
    rect(365, 215, 2, 4, '#a47f4c') + rect(399, 215, 2, 4, '#a47f4c') + rect(433, 215, 2, 4, '#a47f4c') + '</g>'
  );
}

export const KITE_SVG = wrapSvg(
  path('M565 93l-11 15 16 9 9-15z', '#e6cc92') + path('M565 93l3 13-14 2z', '#7da29b') + path('M565 93l14 9-11 4z', '#db9568') + path('M568 106l2 11 9-15z', '#c16c52') +
  '<path d="M570 117l4 8-7 8 5 8" fill="none" stroke="#b3986d" stroke-width="1"/>' + rect(570, 125, 5, 2, '#d29c67') + rect(566, 133, 5, 2, '#779693')
);
