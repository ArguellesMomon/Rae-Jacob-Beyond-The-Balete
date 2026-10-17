import { characterSpriteSvg } from './characterArt.ts';
import type { Direction } from '../game/model.ts';
import { pixelCanopy, pixelNoise as noise, pixelPath as path, pixelRect as rect, wrapSvg } from './pixelArt.ts';

function crown(x: number, y: number, rx: number, ry: number, seed: number) {
  return pixelCanopy(x, y, rx, ry, seed, true)
    .replaceAll('#294b37', '#233942').replaceAll('#365b3d', '#2e4850')
    .replaceAll('#496d42', '#3d5d5d').replaceAll('#658348', '#52776b').replaceAll('#7d9550', '#76907a');
}
function lantern(x: number, y: number) {
  return rect(x - 10, y - 8, 20, 20, '#f6bf66', 0.035) + rect(x - 6, y - 4, 12, 12, '#f6bf66', 0.08)
    + rect(x - 1, y - 9, 1, 6, '#a39165') + rect(x - 4, y - 3, 8, 8, '#b28549')
    + rect(x - 3, y - 2, 6, 6, '#eab86a') + rect(x - 1, y - 2, 2, 6, '#ffdfa0')
    + rect(x - 4, y + 5, 8, 2, '#6f6547');
}
function rootHome(x: number, y: number, width: number, roof: string) {
  let out = path(`M${x - 6} ${y + 6}h${width + 12}v24h-8v5H${x - 3}v-5h-3z`, '#253e40')
    + rect(x, y, width, 28, '#72634d') + rect(x + 1, y + 2, width - 2, 24, '#887257');
  for (let i = 4; i < width; i += 7) out += rect(x + i, y + 4, 1, 23, '#5c5747');
  out += path(`M${x - 4} ${y + 3}v-5h7v-5h${width - 6}v5h7v7H${x - 4}z`, roof);
  out += rect(x + 6, y + 8, 9, 10, '#493f38') + rect(x + 7, y + 9, 7, 8, '#f4c780') + rect(x + 10, y + 9, 1, 8, '#9e7c4d');
  out += rect(x + width - 17, y + 11, 11, 17, '#3b3b34') + rect(x + width - 15, y + 13, 7, 15, '#b28b52') + rect(x + width - 10, y + 22, 1, 1, '#efc87d');
  out += rect(x + width - 19, y + 28, 16, 3, '#ac9465') + rect(x + width - 21, y + 31, 20, 2, '#756950');
  out += rect(x + 4, y + 28, 2, 3, '#bd9d6a') + rect(x + 8, y + 28, 2, 3, '#bd9d6a');
  return out + lantern(x + width - 3, y + 4);
}

function clearing() {
  let out = rect(0, 0, 576, 448, '#2f4b4b');
  out += path('M66 325h41v-19h39v-31h24v-53h-9v-28h100v-21h23V73h34v99h24v37h86v21h53v38h-38v57h-39v29H265v-17h-53v-17h-48v25h-35v29H64z', '#5a7465');
  out += path('M99 338h53v-26h50v-39h27v-47h74v19h98v34h-16v53h-68v-12h-84v-20h-49v27h-32v30H99z', '#6b806b');
  out += path('M79 175h63v13h53v-25h73v30h-20v31h-79v-14H79z', '#5a7465');
  for (let i = 0; i < 950; i++) {
    const x = Math.floor(noise(i, 5, 15) * 574), y = Math.floor(noise(i, 91, 53) * 446);
    out += rect(x, y, i % 7 === 0 ? 3 : 1, 1, i % 2 ? '#a4a582' : '#183d43', 0.28);
  }
  // Huge roots cradle the homes without covering the foreground paths.
  out += path('M12 0h67v71h17v35h35v17h38v15h-49v-11H83v-21H64v36H50v74H32v-89H20V66H12z', '#474a40');
  out += path('M28 0h13v89h11v45h-9V98H28z M54 30h7v60h10v21h-8V98h-9z M76 81h7v28h27v6H76z', '#736b4f');
  out += path('M169 0h43v56h20v17h23v37h-17V84h-39v25h-14V65h-16z', '#464d44');
  out += path('M181 12h7v41h12v24h-6V62h-13z M205 47h6v20h15v6h-21z', '#716b52');
  // Arrival hollow has roots visibly sealing its rear.
  out += path('M28 306h9v-12h22v7h11v37H32z', '#545242') + rect(39, 308, 21, 28, '#1c3038');
  out += path('M41 309h4v26h-4z M50 305h3v32h-3z M35 322h27v4H35z M57 314h3v24h-3z', '#7a7151');
  out += path('M31 340h39v5H31z M37 345h38v3H37z', '#948564');
  // A shallow trickle and a tiny plank walkway below Tala's mapping spot.
  out += path('M145 295h21v6h52v-4h21v9h-22v4h-54v-5h-18z', '#294f5b');
  for (let x = 167; x < 213; x += 6) out += rect(x, 294, 5, 14, '#b49a66') + rect(x, 295, 4, 1, '#d5bb80');
  out += rect(164, 293, 52, 2, '#5f5e45') + rect(164, 307, 52, 2, '#5f5e45');
  out += rootHome(80, 133, 46, '#61705a') + rootHome(153, 113, 46, '#7a7959') + rootHome(224, 145, 43, '#576d59');
  // Little domestic details give the clearing the same sense of home as the yard.
  out += rect(112, 190, 35, 1, '#aa9a72') + rect(112, 189, 2, 12, '#756e51') + rect(146, 189, 2, 12, '#756e51');
  out += rect(119, 191, 6, 8, '#d7cbb0') + rect(132, 191, 7, 6, '#b08270');
  out += rect(153, 166, 17, 3, '#a58e65') + rect(155, 169, 2, 5, '#625c43') + rect(166, 169, 2, 5, '#625c43');
  // Minda's station: apron-blue tools and a bamboo speaking tube.
  out += rect(423, 209, 38, 6, '#a48b61') + rect(426, 215, 4, 9, '#5e5c43') + rect(455, 215, 4, 9, '#5e5c43');
  out += rect(430, 205, 7, 4, '#97a49a') + rect(443, 203, 2, 6, '#b9bd9e') + rect(442, 202, 4, 2, '#637b79');
  out += path('M451 195h5v-28h-5z M451 166h18v5h-18z', '#a29c65') + rect(455, 169, 12, 1, '#d2be7b') + rect(468, 165, 3, 7, '#424e43');
  // Channel and work barrier. There is deliberately no walkable bridge here yet.
  out += path('M484 172h36v218h-36z', '#284653') + rect(488, 174, 27, 216, '#38616b');
  for (let y = 179; y < 388; y += 13) out += rect(489, y, 9, 1, '#72988b') + rect(503, y + 5, 10, 1, '#547d79');
  out += rect(481, 171, 4, 220, '#6a755e') + rect(519, 172, 4, 219, '#5a6957');
  out += rect(461, 266, 4, 24, '#846f4a') + rect(482, 266, 4, 24, '#846f4a') + rect(461, 275, 25, 6, '#bca169');
  out += path('M465 275h4l-3 6h-4z M476 275h4l-3 6h-4z', '#566254');
  // The empty arch is the central visual clue.
  out += rect(365, 293, 5, 38, '#927b55') + rect(395, 293, 5, 38, '#927b55') + rect(362, 290, 41, 5, '#b19a69');
  out += rect(367, 294, 1, 34, '#c3ab74') + rect(397, 294, 1, 34, '#c3ab74');
  out += path('M382 295v8h2v3h-2v4h-1v-6h-1v-9z', '#d4c89c');
  out += rect(371, 313, 24, 10, '#605b46') + rect(374, 316, 17, 1, '#918365') + rect(379, 319, 10, 1, '#918365');
  out += path('M393 333h4v1h-4z M402 335h4v1h-4z M414 332h3v1h-3z M427 330h3v1h-3z', '#b4a57c');
  // Grove sign and an inviting route disappearing between roots.
  out += rect(290, 72, 3, 26, '#887a54') + rect(278, 73, 33, 10, '#b09a68') + path('M291 81v-5h-4l6-4 6 4h-4v5z', '#4a5849');
  out += path('M324 91h14v47h12v11h-15v9h-19v-8h11v-30h-3z', '#515a47');
  out += rect(277, 357, 68, 6, '#8a8060') + rect(281, 363, 6, 10, '#454f40') + rect(334, 363, 6, 10, '#454f40');
  // Strings of lamps steer the eye from arrival to the settlement and onward.
  out += '<path d="M79 241L130 253L181 246L232 223L282 215L332 229L386 213" fill="none" stroke="#7b8060" stroke-width="1"/>';
  for (const [x, y] of [[80, 241], [130, 253], [181, 246], [232, 223], [282, 215], [332, 229], [386, 213], [92, 325], [262, 112], [447, 262]]) out += lantern(x, y);
  // Mushrooms and stones are small, readable clusters off the paths.
  for (let i = 0; i < 45; i++) {
    const x = 40 + Math.floor(noise(i, 34, 97) * 450), y = 372 + Math.floor(noise(i, 61, 24) * 52);
    out += rect(x + 1, y, 2, 4, '#b0b69a') + rect(x - 1, y - 2, 6, 3, i % 3 ? '#699785' : '#cfa475');
  }
  out += path('M122 320h6v2h-6z M150 340h7v2h-7z M246 258h5v2h-5z M348 278h6v2h-6z', '#a3a186');
  return out;
}

export const CLEARING_GROUND_SVG = wrapSvg(clearing(), 576, 448);
export const CLEARING_CANOPY_SVG = wrapSvg(
  crown(25, 19, 83, 44, 55) + crown(163, 12, 81, 34, 83) + crown(413, 20, 101, 49, 92) + crown(552, 94, 48, 90, 27)
  + crown(13, 230, 32, 64, 46) + crown(18, 426, 82, 34, 65) + crown(412, 438, 112, 31, 84)
  + path('M29 47h1v76h-1z M58 43h1v49h-1z M393 48h1v63h-1z M431 51h1v52h-1z M531 137h1v58h-1z', '#758576', 0.65),
  576, 448
);

export function duwendeSvg(kind: 'tala' | 'minda', direction: Direction = 'down', frame = 0, mapPose = false) {
  return characterSpriteSvg(kind, direction, frame ? frame * 2 : -1, mapPose ? 'map' : 'idle').replace('width="32" height="40"', 'width="16" height="18"');
}
