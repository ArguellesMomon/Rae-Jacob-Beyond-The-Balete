import { pixelCanopy, pixelNoise as noise, pixelPath as path, pixelRect as rect, wrapSvg } from './pixelArt.ts';

function crown(x: number, y: number, rx: number, ry: number, seed: number) {
  return pixelCanopy(x, y, rx, ry, seed, true).replaceAll('#294b37', '#20333e').replaceAll('#365b3d', '#2d4550')
    .replaceAll('#496d42', '#3a565a').replaceAll('#658348', '#4a6a64').replaceAll('#7d9550', '#6f8270');
}
function grove() {
  let out = rect(0, 0, 480, 512, '#2a4248');
  // An open approach, a loop around the roots, and the maintenance trail east.
  out += path('M204 512V430h-25v-25h-41v-16h-43v-32h50v-19h30v-34h20v-31h92v20h28v29h29v22h70v16h66v34H392v-15h-65v15h-56v16h-22v102z', '#56685b');
  out += path('M216 512V427h-16v-45h-35v-24h34v-48h79v20h29v33h77v15h-71v-5h-42v28h-35v111z', '#68765e');
  for (let i = 0; i < 1000; i++) {
    const x = Math.floor(noise(i, 17, 74) * 478), y = Math.floor(noise(i, 35, 36) * 510);
    out += rect(x, y, i % 7 ? 1 : 3, 1, i % 3 ? '#92a387' : '#142f3a', 0.24);
  }
  // The massive trunk is deliberately many times Rae's width.
  out += path('M186 0h98v84h14v104h-9v60h18v20h25v10h-39v-7h-30v-12h-21v25h-20v-25h-26v18h-47v-11h20v-27h11v-75h-12V79h18z', '#484a40');
  out += path('M197 0h9v91h-8v102h-7v42h-9v-93h6V71h9z M266 0h8v118h8v94h-9v-53h-7z M231 10h7v78h-7z', '#756d51');
  out += path('M209 148h6v77h-6z M250 169h6v68h-6z M194 245h8v17h-8z M281 249h7v15h-7z', '#93825c');
  // A broad branch is Mang Uban's seat, not a traversable platform.
  out += path('M154 197h172v11h-18v7H177v-7h-23z', '#5f5843') + rect(165, 197, 153, 3, '#9b8759');
  // Other tree trunks frame the paths while keeping the central approach clear.
  out += path('M47 112h24v85h10v55H51v-60h-4z M368 123h19v67h8v50h-29v-50h2z', '#474d41');
  out += rect(54, 126, 4, 117, '#786e50') + rect(375, 140, 3, 91, '#746d50');
  // The speaking tube passes through the roots and follows the eastern trail.
  out += path('M289 242h4v62h33v4h-37z', '#7b895a') + rect(290, 246, 1, 54, '#b4ae70');
  out += rect(323, 311, 5, 21, '#746544') + rect(325, 306, 17, 7, '#a3aa70') + rect(340, 304, 4, 11, '#c1ba7b') + rect(342, 306, 3, 7, '#3a514b');
  out += path('M340 309h4v37h28v8h34v9h47v4h-52v-8h-35v-8h-26z', '#879064');
  for (const [x, y] of [[341, 325], [354, 348], [379, 355], [422, 365]]) out += rect(x, y, 4, 1, '#c0b477');
  // Old marker: a carved branching tree, with no modern text to read at sprite scale.
  out += rect(92, 342, 18, 23, '#777861') + rect(89, 342, 24, 5, '#9d9976') + rect(94, 347, 3, 16, '#8d8b6c');
  out += path('M100 360v-10h-5v-2h6v-3h2v3h5v2h-5v10h4v2H96v-2z', '#c0b98a');
  // Dust beneath the seated giant; these marks shake while the giant remains still.
  out += path('M257 286h4v1h-4z M265 291h5v1h-5z M279 284h4v1h-4z M285 294h5v1h-5z', '#b7a67c');
  out += rect(148, 392, 40, 8, '#706444') + rect(151, 392, 35, 2, '#968159') + rect(154, 400, 4, 5, '#4b503e');
  // Quiet pools of lamplight at the two exits.
  for (const [x, y] of [[204, 455], [400, 350]]) {
    out += rect(x - 7, y - 5, 18, 20, '#e8c987', 0.06) + rect(x, y - 12, 2, 22, '#887b56') + rect(x - 3, y - 16, 8, 8, '#ccab68') + rect(x - 1, y - 15, 4, 6, '#f4d695');
  }
  out += rect(412, 348, 3, 23, '#8c8058') + rect(403, 347, 31, 9, '#a5986b') + path('M409 351h18l-3-3h3l5 4-5 3h-3l3-3h-18z', '#3b5148');
  // Mushrooms and ferns sit in small groups off the maintained path.
  for (const [x, y] of [[73, 299], [120, 427], [310, 438], [362, 289], [417, 426], [74, 463], [398, 113]]) {
    out += rect(x, y, 2, 5, '#b7bc9d') + rect(x - 2, y - 2, 7, 3, '#9c9f70') + rect(x + 8, y + 2, 2, 4, '#b7bc9d') + rect(x + 6, y, 7, 3, '#7b9b81');
    out += path(`M${x - 9} ${y + 8}v-8h2v4h-6v-2h6v-5h2v6h5v2h-6v3z`, '#54775f');
  }
  return out;
}
export const GROVE_GROUND_SVG = wrapSvg(grove(), 480, 512);
export const GROVE_CANOPY_SVG = wrapSvg(
  crown(233, 22, 162, 77, 66) + crown(25, 62, 78, 55, 54) + crown(454, 66, 78, 64, 31)
  + crown(22, 163, 57, 62, 37) + crown(456, 181, 51, 68, 55)
  + crown(15, 432, 54, 77, 92) + crown(435, 493, 77, 37, 69)
  + path('M102 58h2v108h-2z M128 73h2v76h-2z M325 69h2v93h-2z M348 55h2v72h-2z', '#7d8969', 0.6),
  480, 512
);

// Shared face and materials keep the seated giant and dialogue portrait consistent.
export { kapreSpriteSvg as mangUbanSvg } from './kapreArt.ts';
