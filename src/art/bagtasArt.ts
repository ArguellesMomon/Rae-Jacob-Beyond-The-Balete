import type { Direction, Emotion } from '../game/model.ts';

// Independent primitives avoid the pixelArt / characterArt initialization cycle.
const r = (x: number, y: number, width: number, height: number, fill: string) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"/>`;
const p = (d: string, fill: string) => `<path d="${d}" fill="${fill}"/>`;
const svg = (body: string, width: number, height: number, viewWidth = width, viewHeight = height) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${viewWidth} ${viewHeight}" shape-rendering="crispEdges">${body}</svg>`;
const ink = '#24322d', mane = '#28372f', strand = '#4d6251', rim = '#9aa874';
const skin = '#98714b', light = '#c09b65', shine = '#dfbd7d', shade = '#6b533c', deep = '#4f4434';
const cache = new Map<string, string>();

/** Canonical horse head: shared markings, ears and expressions in both views. */
function head(emotion: Emotion, blink: boolean, mouth: number) {
  let s = p('M13 16V1h5v4h4v12h13V0h5v5h4v14h4v12h5v15h-5v8H28v-5H17v-7h-5V24h-3v-8z', ink);
  s += p('M14 15V4h3v5h3v11h16V4h3v5h3v13h4v13h5v10h-6v6H29v-5H20V34h-5V23h-3v-6z', skin);
  s += r(15, 9, 2, 9, '#d7ac79') + r(38, 9, 2, 10, '#d7ac79');
  s += p('M21 18h13v4h6v10h-7v9h-5v-9h-7z', light) + r(24, 20, 4, 9, shine);
  s += p('M16 24h5v9h5v8h-6v-5h-4z M41 23h4v14h-6v-5h2z', shade);
  s += p('M22 31h4v2h-4z M20 35h3v4h-3z M34 20h2v7h-2z M43 28h2v3h-2z', '#b18c5e');
  // A lifted chin, long angular muzzle and a lopsided, self-satisfied smile.
  s += p('M29 32h14v4h8v10h-5v5H29v-4h-6v-9h6z', light);
  s += p('M30 34h12v3h6v3H30z', '#d5b07a') + p('M24 41h5v6h15v3H29v-3h-5z', shade);
  s += r(29, 40, 3, 3, deep) + r(45, 39, 3, 3, deep) + r(30, 39, 2, 1, shine);
  const ey = emotion === 'surprised' ? 24 : emotion === 'wistful' ? 28 : 26;
  const closed = blink || emotion === 'delighted';
  s += r(19, ey, 8, closed ? 1 : emotion === 'surprised' ? 4 : 3, ink) + r(36, ey - 1, 7, closed ? 1 : 3, ink);
  if (!closed) s += r(23, ey, 2, 2, '#f1d393') + r(38, ey - 1, 2, 2, '#f1d393');
  const brow = emotion === 'determined' ? 25 : emotion === 'worried' ? 20 : emotion === 'curious' ? 19 : emotion === 'surprised' ? 18 : 22;
  s += p(`M18 ${brow}h6v1h4v2H18z`, mane) + r(35, emotion === 'wry' ? 18 : brow - 1, 9, 2, mane);
  const my = emotion === 'wistful' ? 46 : 45;
  s += r(32, my, 13, mouth || emotion === 'surprised' ? 3 : 1, deep);
  if (emotion === 'warm' || emotion === 'delighted') s += r(30, 44, 2, 2, deep) + r(45, 43, 2, 3, deep);
  else if (emotion === 'wry' || emotion === 'neutral') s += r(44, 43, 3, 2, deep) + r(34, 46, 10, 1, '#d5af74');
  s += p('M9 16h8v7h-3v12h-3v9H7V28h2z M17 15h15v3H20v3h-3z M43 18h4v15h-3z', mane);
  s += p('M11 21h2v12h-2v7H9V29h2z M19 16h9v1h-9z M44 20h1v9h-1z', strand) + r(11, 23, 1, 8, rim);
  s += p('M8 34h1v6H8z M14 18h1v6h-1z M16 16h7v1h-7z M46 24h1v6h-1z', '#6b7d5e');
  return s;
}

/** 2x internal pixel grid; the public 32x64 footprint and foot anchors stay fixed. */
export function bagtasSpriteSvg(blink = false, mouth = 0, emotion: Emotion = 'neutral', phase = 0, direction: Direction = 'down') {
  const motion = phase ? 1 : 0;
  const key = `s:${blink}:${mouth}:${emotion}:${motion}:${direction}`, old = cache.get(key); if (old) return old;
  let s = '';
  // Hip-length mane sits behind the arms, moving separately from his planted feet.
  s += p(`M17 21h27v15h5v15h${motion ? 5 : 3}v21h-4v10h-8v-9H18v8h-8V66H7V42h5V28h5z`, ink);
  s += p('M14 35h5v27h-4v13h-4V49h3z M43 32h3v17h4v18h-4v8h-3V56h-3V41h3z', mane);
  s += p(`M12 ${47 + motion}h2v18h-2z M45 ${40 + motion}h2v20h-2z M16 29h2v15h-2z`, strand);
  // Long powerful legs, hocks and broad, divided hooves.
  s += p('M17 84h14v15h-5v13h-3v10H12v-12h3V96h2z M35 84h13v14h3v12h-4v12H36v-13h-3V96h2z', ink);
  s += p('M19 86h10v12h-5v14h-4v9h-6v-10h3V97h2z', skin) + p('M37 86h9v13h3v8h-4v14h-7v-14h-3V97h2z', shade);
  s += p('M20 90h4v8h-3v11h-3V98h2z M39 90h4v10h-3v9h-3v-9h2z', light);
  s += p('M12 118h13v8H9v-5h3z M35 118h13v3h5v5H35z', ink) + r(11, 120, 12, 2, '#777353') + r(37, 120, 11, 2, '#6f7654') + r(17, 123, 2, 3, '#14271f') + r(44, 123, 2, 3, '#14271f');
  // Wide deltoids taper to a narrow waist. Arms are held away in a proud stance.
  s += p('M20 49h23v4h9v5h5v13h-5v10h-8v8H20v-7h-9V71H5V59h6v-5h9z', ink);
  s += p('M21 51h20v5h9v7h-5v15h-5v9H22V77h-5V63h-5v-6h9z', skin);
  s += p('M11 57h8v8h-4v12h-4v9H4V73h2V62h5z', skin) + p('M46 57h7v6h4v12h3v11h-7V75h-5v-9h-2z', shade);
  s += p('M10 61h4v9h-3v8H7v-7h3z M49 61h3v10h-3z', light);
  s += p('M10 62h2v4h-2z M7 73h2v4H7z M49 63h1v5h-1z M52 77h2v3h-2z', shine);
  s += p('M4 82h6v4h7v7h-5v-3H4z M53 82h6v9h-9v-7h3z', skin);
  s += r(6, 84, 3, 3, shine) + r(53, 84, 3, 2, light) + r(10, 89, 5, 1, deep) + r(53, 89, 5, 1, deep);
  // Pectoral planes, central sternum and three pairs of abdominal muscles.
  s += p('M20 58h10v4h-1v8H18v-6h2z M33 59h10v5h3v6H34z', light);
  s += r(21, 59, 8, 2, shine) + r(34, 60, 7, 1, '#d3ad73') + r(30, 59, 3, 12, shade);
  s += p('M18 69h11v2H18z M34 69h11v2H34z M21 73h3v10h-2z M40 73h3v9h-2z', deep);
  for (let row = 0; row < 3; row++) {
    const y = 72 + row * 5;
    s += r(25, y, 5, 4, light) + r(33, y, 5, 4, '#ae8859') + r(26, y, 4, 1, '#d0aa70') + r(34, y, 3, 1, light);
  }
  // Woven waist wrap and a survey cord, rather than a shirt hiding his physique.
  s += p('M17 86h29v8h4v7H34v-5H20v5h-7V91h4z', '#435c46') + r(18, 86, 28, 4, '#b29a60') + r(19, 86, 25, 1, '#e1c787');
  s += p('M29 87h6v4h-3v13h-4v-9h-2v-4h3z', '#d3b478') + p('M19 92h5v6h-5z M37 92h8v2h-8v6h-2v-6h2z', '#76916a');
  for (let x = 20; x < 45; x += 5) s += r(x, 88, 2, 1, '#5d583c');
  s += r(44, 87, 2, 11, '#d2bc7e') + r(43, 94, 4, 2, '#e0cd91') + r(44, 99, 3, 2, '#a18e58');
  if (direction === 'up') {
    s += p('M19 57h25v16h-5v12H23V73h-4z', skin) + p('M23 65h6v13h-4v5h-2z M34 65h6v18h-3v-5h-3z', light) + r(30, 64, 3, 20, shade);
    s += p('M16 18V1h5v5h4v12h13V0h5v6h4v13h3v12H12V18z', ink) + r(18, 6, 3, 12, shade) + r(40, 5, 3, 12, light);
    s += p('M15 17h29v10h5v25h-4v13h-8v9h-9V60h-9v11h-7V48H9V27h6z', mane) + p('M17 24h3v25h-3v13h-2V38h2z M39 22h3v31h-3v12h-3V47h3z M27 22h3v28h-3z', strand) + r(17, 29, 1, 16, rim);
  } else s += `<g transform="translate(3 ${motion})">${head(emotion, blink, mouth)}</g>`;
  const facing = direction === 'left' ? `<g transform="translate(64 0) scale(-1 1)">${s}</g>` : s;
  const result = svg(`<g transform="scale(.5)">${facing}</g>`, 32, 64);
  if (cache.size > 200) cache.clear(); cache.set(key, result); return result;
}

export function bagtasPortraitSvg(emotion: Emotion = 'neutral', blink = false, mouth = 0) {
  const key = `p:${emotion}:${blink}:${mouth}`, old = cache.get(key); if (old) return old;
  let s = r(0, 0, 80, 96, '#405c48') + p('M0 5h6v91H0z M70 0h4v96h-4z', '#5b7350');
  // Mane frames the upper body and falls beyond the shoulders.
  s += p('M16 14h41v12h7v28h6v20h5v22H7V77H3V45h6V27h7z', ink);
  s += p('M12 29h7v34h-5v21H8V48h4z M56 30h5v25h6v26h-5V65h-6z', strand) + r(12, 40, 2, 22, rim);
  s += p('M27 48h25v10h9v5h11v9h5v24H3V76h5V64h13v-6h6z', deep);
  s += p('M28 50h21v10h11v5h10v12h5v19H6V75h4v-9h12v-6h6z', skin);
  s += p('M15 67h11v10h-6v13h-8V78h-2v-6h5z M57 66h9v7h6v18h-8V78h-7z', light);
  s += p('M24 65h14v6h-2v9H20v-9h4z M43 65h13v6h5v9H44z', light) + r(26, 66, 10, 2, shine) + r(44, 66, 10, 2, '#d3ad73');
  s += r(38, 65, 4, 16, shade) + r(22, 80, 14, 2, deep) + r(44, 80, 14, 2, deep);
  s += p('M24 68h3v8h-3z M31 76h5v2h-5z M46 69h7v1h-7z M48 77h8v1h-8z M14 70h5v2h-5z M64 73h2v7h-2z', '#cda66d');
  for (let row = 0; row < 3; row++) s += r(30, 82 + row * 5, 8, 4, light) + r(43, 82 + row * 5, 7, 4, '#ad8556') + r(31, 82 + row * 5, 6, 1, shine);
  s += p('M22 84h3v12h-3z M56 84h3v12h-3z', shade);
  s += '<g transform="translate(8 1) scale(1.1 1.1)">' + head(emotion, blink, mouth) + '</g>';
  // A loose foreground lock makes the mane visibly long, not a short head crest.
  s += p('M17 43h5v17h-4v16h-5v15H8V78h3V59h6z M58 38h4v26h5v14h-6V67h-5V50h2z', mane) + p('M17 48h2v12h-3v15h-2V59h3z M59 46h2v16h-2z', strand);
  const result = svg(s, 80, 96); cache.set(key, result); return result;
}
