import type { Emotion } from '../game/model.ts';
const r = (x: number, y: number, w: number, h: number, fill: string, opacity = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" opacity="${opacity}"/>`;
const p = (d: string, fill: string) => `<path d="${d}" fill="${fill}"/>`;
const svg = (s: string, w: number, h: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${s}</svg>`;
const c = { ink: '#23374a', skin: '#b67f59', light: '#ddb087', shade: '#85583f', rim: '#edcaa0', hair: '#172d3b', strand: '#36556a', white: '#f0f0e4', pearl: '#fff8e7', ice: '#c5dfe8', fold: '#8bb4ce', blue: '#5899bf', deep: '#365b83', silver: '#dfd8b5' };
function head(emotion: Emotion, blink: boolean, mouth: number) {
  let s = p('M22 8h20v3h5v12h-3v14h-4v6H25v-5h-5V23h-3V13h5z', c.hair);
  s += p('M24 15h17v3h3v14h-3v7h-5v3H28v-4h-4v-5h-3V21h3z', c.skin) + r(24, 21, 4, 12, c.light) + r(41, 24, 2, 9, c.shade);
  s += r(19, 25, 3, 7, c.skin) + r(43, 25, 3, 7, c.shade) + r(20, 31, 1, 4, c.silver) + r(44, 31, 1, 4, c.silver);
  for (const [i, x] of [25, 37].entries()) {
    const ey = emotion === 'surprised' ? 24 : 26, closed = blink || emotion === 'delighted';
    s += r(x, ey, 4, closed ? 1 : emotion === 'surprised' ? 4 : 3, c.ink);
    if (!closed) s += r(x + 1, ey, 1, 1, '#fff0cf') + r(x + 2, ey + 1, 1, 1, '#7f947e');
    s += r(x + (i ? 3 : -1), ey - 1, 1, 1, c.ink);
    const brow = emotion === 'surprised' ? 20 : emotion === 'curious' && i === 0 ? 21 : 23;
    s += r(x, brow, 4, .65, '#4a3c36');
    if (emotion === 'worried' || emotion === 'wistful') s += r(x + (i ? 0 : 3), brow - 1, 1, 1, '#4a3c36');
    if (emotion === 'determined' || emotion === 'wry') s += r(x + (i ? 0 : 3), brow + 1, 1, 1, '#4a3c36');
  }
  s += r(31, 28, 2, 6, c.light) + r(32, 34, 3, 1, c.shade) + r(25, 33, 3, 1, '#c99171') + r(38, 33, 3, 1, '#bc886a');
  s += r(27, 20, 9, .5, '#e5bb91', .55) + r(24, 29, .6, 3, c.rim, .7) + r(40, 30, .6, 3, c.rim, .5) + r(29, 40, 7, .5, '#d9a47d', .7);
  const smile = ['warm', 'delighted', 'wry'].includes(emotion);
  s += r(30, 38, 7, mouth || emotion === 'surprised' ? 2 : .7, '#95675d');
  if (smile) s += r(28, 37, 2, .7, '#95675d') + r(37, emotion === 'wry' ? 36 : 37, 1, 1, '#95675d');
  if (emotion === 'wistful') s += r(29, 39, 1, 1, '#95675d');
  s += p('M21 11h20v3h5v10h-4v-5h-5v-5h-5v4h-6v7h-6V17h1z', c.hair) + r(25, 11, 10, 1, c.strand) + r(20, 19, 1, 12, '#4e7587') + r(43, 20, 1, 12, '#416c81');
  s += r(26, 12, 5, .5, '#608395', .65) + r(37, 16, 4, .5, '#456b80', .8) + r(21, 21, .5, 10, '#81a6b4', .5);
  s += p('M18 12h4v3h-3v3h-3v-3h2zM20 11h5v2h-3v2h-2z', c.ice) + r(19, 13, 2, 2, c.pearl) + r(18, 18, 1, 4, c.silver);
  return s;
}

const sprites = new Map<string, string>(), portraits = new Map<string, string>();
export function mayumiSpriteSvg(blink = false, mouth = 0, emotion: Emotion = 'neutral', frame = 0) {
  const phase = Math.abs(frame) % 2, key = `${blink}:${mouth}:${emotion}:${phase}`, cached = sprites.get(key); if (cached) return cached;
  let s = p('M20 10h23v6h5v27h3v27h-5v17H17V70h-3V31h3V17h3z', c.hair) + r(18, 24, 2, 47, c.strand) + r(45, 23, 2, 43, '#29485f');
  s += p('M17 30h1v23h2v17h-1V56h-2zM47 32h1v19h2v17h-1V53h-2z', '#4b7188');
  for (let i = 0; i < 16; i++) s += r(i % 2 ? 18.5 : 46.5, 30 + i * 3, .5, 1.5, '#7399a8', .35);
  s += r(26, 103, 6, 7, c.skin) + r(38, 103, 6, 7, c.skin) + r(24, 109, 9, 2, '#b9c8cb') + r(37, 109, 10, 2, '#b9c8cb');
  s += p('M24 43h18v9h4v17h3v14h3v16h3v7H13v-9h3V83h3V67h3V50h2z', c.deep);
  s += p('M25 45h16v15h3v17h4v22h3v5H18V87h3V67h2V51h2z', c.white);
  s += p('M27 60h9v18h-3v25H22V87h3V69h2z', c.pearl) + p('M38 62h5v15h4v22h4v5H35V86h3z', c.ice);
  s += p('M42 57h4v20h4v20h4v7H42V84h-3V70h3z', c.blue) + r(46, 84, 2, 18, c.deep) + r(42, 78, 1, 24, '#a7d5e7');
  s += p('M23 61h5v13h-3v14h-3v14h-5V88h3V73h3z', '#8ebfd7') + p('M25 66h1v12h-2v16h-2v8h-2V88h2V75h3z', '#d4e8e9');
  s += p('M34 71h1v13h-2v18h-1V84h2zM39 86h1v16h-1z', '#a8c9d8');
  for (let i = 0; i < 9; i++) s += r(26 + i * 2, 99 + i % 2, 1, .5, '#799fb7', .65) + r(26 + i * 2, 101 + i % 2, .5, 1, '#d3e8e9');
  for (let i = 0; i < 27; i++) s += r(23 + i * 11 % 19, 70 + i * 7 % 31, .7, 1, i % 2 ? c.ice : '#d3d7ce', .72);
  s += r(18, 102, 33, 1, '#96bed3') + r(17, 105, 37, 1, c.pearl);
  s += r(28, 38, 10, 8, c.shade) + r(29, 39, 7, 7, c.light);
  s += p('M21 45h8l11 9h7v6h-9L20 51z', c.white) + p('M20 50l18 8h9v3h-9L20 53z', c.fold) + r(24, 58, 19, 2, c.silver);
  s += p('M28 60h8v3h-3v9h-3v-9h-2z', c.ice) + r(31, 61, 1, 8, c.pearl);
  const sway = phase;
  s += p(`M18 48h6v17h-3v8h-6V58h3z`, c.skin) + r(19, 51, 3, 16, c.light);
  s += p(`M16 54h4v20h-2v13h-${3 + sway}V68h1z`, c.white) + r(16 - sway, 75, 1, 9, c.ice);
  s += p('M44 48h5v11h4v7h-6v-6h-3z', c.skin) + r(45, 50, 2, 10, c.light);
  s += p(`M48 53h3v17h2v${14 + sway}h-4V68h-2V57h1z`, c.ice) + r(49, 72, 1, 11, c.pearl);
  s += p(`M44 ${64 - phase}h14v5h-3v4H47v-4h-3z`, '#567f73') + r(46, 64 - phase, 10, 1, '#c2dcc2') + r(48, 66 - phase, 6, 1, '#9fd6dd');
  s += head(emotion, blink, mouth);
  const result = svg(s, 64, 112); sprites.set(key, result); return result;
}

export function mayumiPortraitSvg(emotion: Emotion = 'neutral', blink = false, mouth = 0) {
  const key = `${emotion}:${blink}:${mouth}`, cached = portraits.get(key); if (cached) return cached;
  let s = '<defs><radialGradient id="mayumi-portrait-light"><stop stop-color="#cadfe0"/><stop offset="1" stop-color="#395e78"/></radialGradient></defs>' + r(0, 0, 80, 96, 'url(#mayumi-portrait-light)');
  for (let i = 0; i < 18; i++) s += r(i * 23 % 78, i * 17 % 95, 1, 1, '#e0eee7', .65);
  s += p('M18 24h5V12h29v10h9v19h5v55H12V42h6z', c.hair) + r(16, 35, 3, 48, c.strand) + r(59, 34, 3, 49, '#325a75');
  s += p('M23 68h34v7h10v8h5v13H8V84h8v-9h7z', c.deep) + p('M24 72h32v7h8v17H15V82h9z', c.white);
  s += p('M21 73h14l20 14h16v9H51L18 81z', c.ice) + p('M21 73h10l22 13h18v4H53z', c.pearl) + r(48, 90, 21, 2, c.blue);
  s += `<g transform="translate(-8 1) scale(1.5 1.6)">${head(emotion, blink, mouth)}</g>`;
  const result = svg(s, 80, 96); portraits.set(key, result); return result;
}

const auras = new Map<number, string>();
export function mayumiAuraSvg(clock = 0, motion = true) {
  const frame = motion ? Math.floor(clock * 2) % 24 : 0, cached = auras.get(frame); if (cached) return cached;
  const t = frame / 24 * Math.PI * 2, breath = .84 + Math.sin(t) * .1;
  let s = '<defs><radialGradient id="mayumi-aura-light"><stop stop-color="#e8f6ee" stop-opacity=".36"/><stop offset=".5" stop-color="#a5d8ee" stop-opacity=".2"/><stop offset="1" stop-color="#82bfe5" stop-opacity="0"/></radialGradient></defs>';
  s += `<ellipse cx="48" cy="64" rx="45" ry="60" fill="url(#mayumi-aura-light)" opacity="${breath}"/><ellipse cx="48" cy="124" rx="28" ry="4" fill="url(#mayumi-aura-light)"/>`;
  for (let i = 0; i < 6; i++) {
    const x = Math.round(17 + i * 13 % 64 + Math.sin(t + i) * 2), y = Math.round(24 + i * 19 % 86 + Math.cos(t + i * 2) * 3);
    s += r(x, y, 1, 2, '#d9f0ed', .32 + (Math.sin(t + i) + 1) * .15);
  }
  const result = svg(s, 96, 132); auras.set(frame, result); return result;
}
