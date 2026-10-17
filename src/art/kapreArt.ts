import type { Emotion } from '../game/model.ts';

// Independent of pixelArt: portraits and the world sprite share this same face.
const r = (x: number, y: number, width: number, height: number, fill: string, opacity = 1) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" opacity="${opacity}"/>`;
const p = (d: string, fill: string) => `<path d="${d}" fill="${fill}"/>`;
const svg = (s: string, w: number, h: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${s}</svg>`;
const ink = '#202b2a', hair = '#303a34', silver = '#969b82', skin = '#654a38', light = '#96704b', shade = '#403b30';
const cache = new Map<string, string>();
function grain(x: number, y: number, w: number, h: number, seed: number, a: string, b: string) {
  let s = '';
  for (let i = 0; i < Math.floor(w * h / 7); i++) {
    const gx = (i * 17 + seed * 7) % w, gy = (i * 11 + Math.floor(i / 3) * 5 + seed) % h;
    s += r(x + gx, y + gy, i % 4 ? 1 : 2, 1, i % 3 ? a : b, .26);
  }
  return s;
}

function kapreHead(emotion: Emotion, blink: boolean, mouth: number) {
  let s = p('M17 5h12V1h22v4h12v7h7v10h5v32h-5v13h-9v8H22v-6H12V58H6V26h5V13h6z', ink);
  s += p('M18 10h11V5h22v5h11v9h5v41h-7v9H22v-8H13V26h5z', hair);
  // A low, broad face, deep temple planes and a heavy, square jaw.
  s += p('M23 19h30v5h9v11h3v17h-7v9H26v-6H17V32h6z', skin);
  s += p('M23 26h9v6h-5v14h5v8h-9v-5h-4V35h4z', light);
  s += p('M53 24h6v10h4v16h-7v9h-8v-9h5z', shade);
  s += grain(25, 20, 27, 7, 3, '#ac865a', '#342e26') + grain(23, 38, 10, 13, 7, '#ba925f', '#302e26') + grain(51, 37, 7, 12, 5, '#998456', '#302e26');
  s += p('M12 33h7v17h-6v-4h-4v-8h3z M62 32h6v4h4v10h-4v4h-6z', skin);
  s += r(12, 36, 3, 8, '#9a7953') + r(65, 37, 3, 7, '#80714c');
  s += p('M19 17h10v7h-6v10h-6v19h-5V28h4v-8h3z M52 13h8v8h6v37h-6V32h-5V21h-3z', '#727b66');
  s += p('M25 8h12v3H25z M20 13h6v8h-4v10h-3V20h1z M15 37h3v19h-3z M57 16h3v10h-3z M63 29h3v28h-3z', silver);
  s += p('M32 5h5v3h-5z M43 9h12v3H43z M20 52h3v10h4v5h-6v-5h-3V50h2z M59 53h4v11h-5v6h-5v-4h3V56h3z', '#b0ad90');
  // Brow ridges carry weight, rather than glowing monster eyes or fangs.
  const lift = emotion === 'surprised' ? -4 : emotion === 'worried' ? -2 : emotion === 'curious' ? -1 : emotion === 'determined' ? 2 : 0;
  const rightLift = emotion === 'wry' ? -3 : emotion === 'wistful' ? 1 : lift;
  s += r(25, 30, 12, 9, '#332f27') + r(46, 30, 13, 9, '#332f27');
  s += p(`M21 ${27 + lift}h12v2h7v6H27v-3h-6z M44 ${29 + rightLift}h13v-3h6v6h-4v4H44z`, '#302e27');
  s += r(24, 27 + lift, 9, 2, '#9c9477') + r(47, 29 + rightLift, 10, 1, '#8e947b');
  const shut = blink || emotion === 'delighted';
  s += r(27, 35, 9, shut ? 1 : emotion === 'surprised' ? 4 : 2, '#b59b61') + r(47, 35, 9, shut ? 1 : 2, '#b59b61');
  if (!shut) s += r(31, 35, 3, 2, ink) + r(49, 35, 3, 2, ink) + r(30, 35, 1, 1, '#eee0ae') + r(48, 35, 1, 1, '#eee0ae');
  s += p('M38 32h5v10h5v6H33v-5h5z', light) + r(34, 46, 5, 2, '#403329') + r(43, 46, 5, 2, '#403329');
  s += p('M24 42h9v2h-9z M50 42h8v2h-8z M25 48h5v2h-5z M52 47h5v2h-5z', '#a58257');
  s += p('M31 22h8v1h-8z M43 22h10v1H43z M34 24h12v1H34z M21 37h3v3h-3z M55 38h4v2h-4z', '#806447');
  s += p('M29 45h3v2h-3z M50 44h2v3h-2z M24 51h3v2h-3z M54 50h3v2h-3z', '#493f30');
  // Coarse beard clusters echo the balete bark without turning the face into bark.
  s += p('M20 50h6v5h9v4h16v-4h7v-6h4v13h-6v7h-9v6H31v-5h-8v-8h-3z', '#535b49');
  s += p('M26 56h4v8h6v6h-6v-4h-4z M52 57h4v7h-5v7h-6v-4h4v-5h3z M36 67h5v7h-3v-4h-2z', '#91927a');
  s += p('M23 54h2v6h-2z M28 61h2v5h-2z M33 64h2v4h-2z M43 68h2v4h-2z M50 61h2v5h-2z M58 52h2v7h-2z', '#b0ad90');
  s += r(32, 54, 20, mouth ? 5 : 2, '#2e2b24') + r(36, mouth ? 59 : 57, 13, 2, '#a08860');
  if (emotion === 'warm' || emotion === 'delighted') s += r(31, 52, 2, 3, '#302d25') + r(52, 52, 2, 3, '#302d25');
  if (emotion === 'wistful') s += r(34, 52, 15, 1, '#c0a57a');
  // A thick, rolled tobacco cigar, held at the corner of his mouth.
  s += p('M51 52h23v2h4v7H54v-2h-3z', '#302c24') + r(54, 53, 19, 6, '#765035') + r(55, 53, 17, 2, '#af8050');
  for (let x = 57; x < 72; x += 5) s += r(x, 55, 1, 4, '#4d3929');
  s += r(73, 54, 4, 6, '#b3743f') + r(75, 54, 3, 5, '#dad0a2') + r(75, 56, 2, 2, '#e5994f') + r(76, 56, 1, 1, '#ffe1a0');
  return s;
}

export function kapreSpriteSvg(blink = false, portrait = false, acting: { emotion?: Emotion; mouth?: number; hand?: number } = {}) {
  const { emotion = 'neutral', mouth = 0, hand = 0 } = acting;
  const key = `s:${blink}:${portrait}:${emotion}:${mouth}:${hand}`, old = cache.get(key); if (old) return old;
  let s = p('M24 57h63v6h13v14h5v27h-8v14H13v-11H5V79h6V65h13z', ink);
  // Sloping giant shoulders, bare chest and an open, weathered woven mantle.
  s += p('M25 60h59v6h13v31H13V71h12z', '#4e4b37') + p('M36 61h35v8h8v29H30V73h6z', skin);
  s += p('M40 67h8v6h16v-6h7v13h-8v7H45v-5h-8v-9h3z', '#776043');
  s += p('M50 76h3v17h-3z M61 79h3v13h-3z M34 88h12v2H34z M65 87h11v2H65z', shade);
  s += grain(38, 73, 35, 19, 2, '#aa8757', '#313b2c');
  s += p('M24 62h13v10h-7v25h-9V79h-5v-9h8z M75 63h10v6h8v10h-7v19h-9V73h-2z', '#657059');
  s += p('M25 66h5v6h-5v19h-3V72h3z M80 68h3v10h-3v13h-2V73h2z', '#a39e71');
  for (let i = 0; i < 36; i++) s += r((i % 2 ? 77 : 23) + i * 7 % 7, 75 + i * 11 % 21, i % 3 ? 1 : 3, 1, i % 2 ? '#313c30' : '#a09f73', .6);
  // Huge forearms and resting knuckles; the offering hand keeps its old anchor.
  s += p('M12 73h11v18h9v18H13v-5H7V86h5z M88 74h10v14h6v20H83V92h5z', skin);
  s += p('M12 79h5v16h6v7H12z M91 80h4v15h-4z', light);
  s += p('M10 75h3v7h-3z M18 74h3v12h-3z M19 88h3v6h-3z M87 73h3v13h-3z M96 79h3v9h-3z M90 96h3v4h-3z', hair);
  s += p('M14 80h1v7h-1z M20 76h1v6h-1z M91 76h1v8h-1z M97 83h1v6h-1z', '#929075');
  s += p('M9 94h4v8h10v4H11v-4H9z M97 91h4v13h-6v-5h2z', shade);
  s += grain(12, 85, 10, 15, 1, '#b49a66', '#302f26') + grain(89, 86, 9, 14, 5, '#a88e5a', '#302f26');
  for (const [x, y] of [[17, 86], [21, 94], [90, 89], [94, 97], [40, 72], [64, 72]]) s += p(`M${x} ${y}h2v4h-2v3h-1v-5h1z`, '#ac9060');
  s += p('M19 103h72v17H78v24H58v-26H44v26H21v-22H13v-12h6z', '#303d33');
  s += p('M24 113h20v7H30v20h-6z M64 113h18v7H70v21h-6z', '#566049');
  s += grain(25, 119, 14, 19, 5, '#89906a', '#1e302b') + grain(64, 119, 13, 19, 2, '#89906a', '#1e302b');
  s += r(22, 104, 64, 5, '#a18b56') + r(24, 105, 60, 1, '#d1bb7a') + p('M50 105h8v6h-3v17h-4v-17h-1z', '#bdab71');
  for (let x = 28; x < 82; x += 7) s += r(x, 105, 2, 4, '#655d3d');
  s += p('M20 137h23v11h-6v6H4v-8h10v-5h6z M73 137h19v6h11v4h5v7H72z', shade);
  s += p('M20 139h19v6h-6v6H8v-4h11z M76 140h12v6h13v5H76z', skin) + r(11, 147, 22, 2, light) + r(78, 147, 22, 2, light);
  for (const x of [12, 18, 24, 30, 81, 87, 93, 99]) s += r(x, 150, 2, 4, '#30352b');
  s += r(11, 101, 23, 11, skin) + r(13, 102, 18, 3, light);
  for (let x = 14; x < 32; x += 5) s += r(x, 108, 2, 5, shade);
  s += `<g transform="translate(0 ${hand})">` + p('M82 99h12v3h8v10H79v-8h3z', skin) + r(83, 101, 11, 3, '#b29465');
  for (let x = 82; x < 101; x += 5) s += r(x, 108, 2, 5, shade);
  s += '</g><g transform="translate(16 -1)">' + kapreHead(emotion, blink, mouth) + '</g>';
  const result = portrait ? `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="64" viewBox="16 0 80 64" shape-rendering="crispEdges">${s}</svg>` : svg(s, 112, 156);
  if (cache.size > 200) cache.clear(); cache.set(key, result); return result;
}

export function kaprePortraitSvg(emotion: Emotion = 'neutral', blink = false, mouth = 0) {
  const key = `p:${emotion}:${blink}:${mouth}`, old = cache.get(key); if (old) return old;
  let s = r(0, 0, 80, 96, '#253e3d') + p('M0 10h8v86H0z M71 0h9v96h-9z', '#334a43');
  s += p('M0 77h8v-9h14v-8h35v8h15v9h8v19H0z', ink) + p('M4 80h12v-8h13v-7h25v8h13v8h9v15H4z', skin);
  s += p('M13 75h12v12h-5v9H5V83h8z M57 75h11v8h7v13H60V85h-3z', '#657059') + r(16, 79, 3, 17, '#9b9c70') + r(63, 84, 2, 12, '#9b9c70');
  s += p('M28 78h7v8h14v-8h6v13H28z', '#89704b') + r(39, 88, 3, 8, '#473f30');
  s += '<g transform="translate(-1 1)">' + kapreHead(emotion, blink, mouth) + '</g>';
  // Portrait smoke stays at the cigar tip; world smoke animates in groveLightSvg.
  s += p('M74 50h4v-5h-5v-6h-4v-7h3v6h5v5h3v9h-6z', '#85978a') + r(70, 30, 3, 3, '#546f64');
  const result = svg(s, 80, 96); cache.set(key, result); return result;
}
