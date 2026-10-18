import type { Direction, Emotion, Gesture } from '../game/model.ts';
const r = (x: number, y: number, w: number, h: number, fill: string, opacity = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" opacity="${opacity}"/>`;
const p = (d: string, fill: string) => `<path d="${d}" fill="${fill}"/>`;
const svg = (s: string, w: number, h: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${s}</svg>`;
const c = { skin: '#b88360', light: '#d8ad83', shade: '#8b604a', rim: '#e4c09b', hair: '#9b9e96', silver: '#d6d5c2', darkHair: '#69766c', cloth: '#899b7d', fold: '#536c58', skirt: '#775969', hem: '#453f4b', ink: '#454035' };

function head(direction: Direction, emotion: Emotion, blink: boolean, mouth: number) {
  const side = direction === 'left' || direction === 'right', back = direction === 'up';
  let s = p('M22 7h20v3h6v9h4v15h-6v7H23v-4h-6V17h2v-6h3z', c.darkHair);
  s += p('M45 16h8v3h4v9h-3v4h-9v-5h-3z', c.hair) + r(49, 18, 4, 2, c.silver) + r(52, 22, 2, 5, '#b7bbb0');
  if (back) {
    s += p('M22 9h21v4h4v22h-5v6H24v-5h-5V17h3z', c.hair) + r(23, 13, 3, 21, c.silver) + r(30, 10, 11, 2, c.silver) + r(39, 16, 2, 18, '#b9bdb1');
    s += p('M32 27h11v3h4v8h-4v4H31v-3h-3v-8h4z', c.darkHair) + r(32, 29, 10, 3, c.silver) + r(30, 33, 2, 5, c.hair);
  } else if (side) {
    s += p('M28 16h15v5h3v5h4v4h-4v7h-5v5H29v-5h-6V23h5z', c.skin) + r(29, 21, 5, 14, c.light) + r(40, 34, 4, 3, c.shade);
    s += p('M22 10h20v3h5v9h-6v-5h-5v6h-5v7h-7V17h-3z', c.hair) + r(26, 12, 12, 2, c.silver) + r(23, 18, 3, 10, c.silver);
    s += r(30, 28, 4, 7, c.skin) + r(31, 29, 1, 3, c.shade) + r(43, 27, 3, blink ? 1 : 2, c.ink) + r(41, 23, 5, 1, c.darkHair);
    s += `<path d="M40 25h7v6h-7zM34 27h6" fill="none" stroke="#978c68" stroke-width=".7"/>`;
    s += r(43, 37, 3, mouth ? 2 : 1, '#805645') + r(40, 34, 2, 1, c.shade);
  } else {
    s += p('M23 17h19v3h4v13h-3v6h-5v4H28v-4h-5v-5h-3V21h3z', c.skin) + r(23, 21, 4, 13, c.light) + r(40, 25, 4, 9, c.shade);
    s += r(18, 26, 4, 8, c.skin) + r(44, 26, 4, 8, c.shade) + r(19, 28, 2, 4, c.light) + r(20, 34, 1, 2, '#d2bb78') + r(45, 34, 1, 2, '#d2bb78');
    s += p('M21 12h22v3h4v7h-5v-4h-6v-3h-5v4h-7v6h-4V17h1z', c.hair) + r(25, 11, 13, 2, c.silver) + r(21, 17, 2, 8, c.silver);
    const raised = emotion === 'surprised', warm = emotion === 'warm' || emotion === 'delighted';
    for (const [i, x] of [25, 37].entries()) {
      s += r(x, raised ? 23 : 25, 4, blink || emotion === 'delighted' ? 1 : raised ? 3 : 2, c.ink);
      if (!blink && emotion !== 'delighted') s += r(x + 1, raised ? 23 : 25, 1, 1, '#efe4bf');
      const brow = raised ? 19 : emotion === 'curious' && i === 0 ? 20 : 22;
      s += r(x - 1, brow, 5, 1, c.darkHair);
      if (emotion === 'worried' || emotion === 'wistful') s += r(x + (i ? 0 : 3), brow - 1, 2, 1, c.darkHair);
      if (emotion === 'determined' || emotion === 'wry') s += r(x + (i ? 0 : 3), brow + 1, 2, 1, c.darkHair);
    }
    s += `<path d="M23 24h8v6h-8zM35 24h8v6h-8zM31 26h4M19 25l4 1M43 26l3-1" fill="none" stroke="#9e946e" stroke-width=".7"/>`;
    s += r(31, 28, 3, 6, c.light) + r(31, 34, 5, 1, c.shade);
    // Forehead creases, crow's feet, nasolabial folds and a softly shaded chin.
    s += r(28, 19, 10, .5, c.shade, .48) + r(29, 21, 8, .5, c.shade, .34) + r(21, 29, 3, .5, c.shade, .6) + r(42, 29, 3, .5, c.shade, .6);
    s += r(26, 34, 1, 4, c.shade, .55) + r(39, 34, 1, 4, c.shade, .55) + r(29, 41, 8, .5, c.shade, .5);
    const my = emotion === 'wistful' ? 39 : 38;
    s += r(29, my, 9, mouth || raised ? 2 : 1, '#825345');
    if (warm || emotion === 'wry') s += r(27, my - 1, 2, 1, '#825345') + r(38, my - (emotion === 'wry' ? 2 : 1), 2, 1, '#825345');
    if (emotion === 'neutral') s += r(28, my - 1, 1, 1, '#9a6a50');
    if (emotion === 'delighted') s += r(31, my, 5, 1, '#f1dfbd');
  }
  return direction === 'left' ? `<g transform="translate(64 0) scale(-1 1)">${s}</g>` : s;
}

export function lolaSpriteSvg(direction: Direction = 'down', frame = -1, gesture: Gesture = 'idle', emotion: Emotion = 'neutral', blink = false, mouth = 0) {
  const pose = Math.abs(frame) % 2, breath = gesture === 'idle' && frame === -2 ? 1 : 0;
  const side = direction === 'left' || direction === 'right', back = direction === 'up';
  let s = r(22, 82, 7, 10, c.skin) + r(37, 82, 7, 10, c.shade) + r(20, 91, 11, 4, '#4b5749') + r(36, 91, 11, 4, '#4b5749') + r(23, 91, 6, 1, '#c6b391') + r(38, 91, 6, 1, '#c6b391');
  s += `<g transform="translate(0 ${breath})">`;
  s += p(side ? 'M25 43h17v5h5v19H22V49h3z' : 'M23 43h20v4h6v22H16V48h7z', c.fold) + r(side ? 25 : 21, 48, side ? 17 : 23, 20, c.cloth);
  for (let i = 0; i < 24; i++) s += r(23 + i * 7 % 19, 49 + i * 5 % 17, 1, 1, i % 2 ? '#b6b99b' : '#6a8067');
  s += p('M22 65h23l5 22H15l5-19z', c.hem) + p('M23 66h20l4 18H19z', c.skirt) + r(24, 69, 2, 14, '#a17e88') + r(39, 69, 2, 14, '#634954');
  for (const [x, y] of [[24, 71], [36, 69], [42, 78], [29, 80], [20, 77]]) s += r(x, y, 3, 1, '#c3a3a0') + r(x + 1, y - 1, 1, 3, '#d6b9ab') + r(x - 1, y + 2, 2, 1, '#829574');
  s += r(19, 84, 28, 1, '#c4a9a4') + r(20, 65, 25, 1, '#bec6a3');
  if (!back) s += p('M22 46h8v5l-6 7h-5V48zM37 46h7l4 4v8h-5l-6-7z', '#c9c7a7') + r(31, 49, 1, 17, c.fold) + r(32, 52, 1, 1, '#e4d2a5') + r(32, 59, 1, 1, '#e4d2a5');
  const wave = gesture === 'wave' || gesture === 'celebrate';
  s += r(wave ? 12 : 15, wave ? 30 - pose * 2 : 49, 6, wave ? 22 : 14, c.cloth) + r(wave ? 11 : 16, wave ? 27 - pose * 2 : 60, 6, 6, c.skin) + r(wave ? 12 : 17, wave ? 28 - pose * 2 : 60, 2, 4, c.light);
  s += r(45, 49, 6, 14, c.fold) + r(42, 62, 8, 5, c.skin) + r(42, 62, 4, 1, c.light);
  if (!wave && !back) s += r(21, 63, 16, 4, c.light) + r(29, 63, 12, 4, c.skin) + r(28, 64, 1, 2, c.shade);
  s += '</g>' + head(direction, emotion, blink, mouth);
  return svg(`<g transform="scale(.5)">${s}</g>`, 32, 48);
}

export function lolaPortraitSvg(emotion: Emotion = 'neutral', blink = false, mouth = 0) {
  let s = r(0, 0, 80, 96, '#b5b28e') + p('M0 70h12V56h13v-9h32v12h13v11h10v26H0z', '#949e7b');
  for (let i = 0; i < 24; i++) s += r(i * 17 % 78, i * 13 % 93, 1, 2, '#d9cfaa', .6);
  s += p('M25 65h30v7h11v9h7v15H7V82h8v-8h10z', c.fold) + p('M26 68h27v7h10v21H16V80h10z', c.cloth);
  s += p('M24 72h12v7L23 90h-9V80zM45 72h12l10 9v10h-9L45 79z', '#cec9aa') + r(37, 77, 2, 19, '#5e775e');
  for (let i = 0; i < 18; i++) s += r(20 + i * 13 % 40, 82 + i * 5 % 13, 1, 1, '#b6bea0');
  s += r(40, 83, 2, 2, '#e2d3ad') + r(40, 91, 2, 2, '#e2d3ad');
  s += `<g transform="translate(-4 3) scale(1.4 1.55)">${head('down', emotion, blink, mouth)}</g>`;
  return svg(s, 80, 96);
}
