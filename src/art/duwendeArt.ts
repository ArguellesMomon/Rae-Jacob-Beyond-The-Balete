import type { Direction, Emotion, Gesture } from '../game/model.ts';

export type DuwendeLook = 'minda' | 'luning' | 'nilo' | 'sela' | 'doro' | 'pilo';
const looks = {
  minda: { skin: '#af7b58', light: '#d5a17c', shade: '#79553e', hair: '#a3ad99', strand: '#d0ceb0', cloth: '#638d8c', fold: '#375c60', trim: '#cfb67d' },
  luning: { skin: '#b87e59', light: '#d8a579', shade: '#89573f', hair: '#4a4537', strand: '#a59b7e', cloth: '#a3624d', fold: '#693f37', trim: '#c5a36a' },
  nilo: { skin: '#b47f54', light: '#d8ac79', shade: '#80583e', hair: '#344336', strand: '#778061', cloth: '#98754d', fold: '#5d563c', trim: '#d9ba72' },
  sela: { skin: '#ba875e', light: '#deb48b', shade: '#8a5d45', hair: '#8b9480', strand: '#c2c0a0', cloth: '#8b7183', fold: '#554e59', trim: '#d9bca0' },
  doro: { skin: '#9d7451', light: '#c8a375', shade: '#6d513a', hair: '#9d9c7d', strand: '#d1c7a0', cloth: '#79865a', fold: '#495c43', trim: '#d5c397' },
  pilo: { skin: '#b27d50', light: '#d7a66e', shade: '#7b563d', hair: '#293d34', strand: '#637452', cloth: '#60858c', fold: '#38565b', trim: '#d6c87e' },
};
const r = (x: number, y: number, w: number, h: number, c: string) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
const p = (d: string, c: string) => `<path d="${d}" fill="${c}"/>`;
const svg = (s: string, w: number, h: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${s}</svg>`;
function head(id: DuwendeLook, direction: Direction, emotion: Emotion, blink: boolean, mouth: number) {
  const c = looks[id], back = direction === 'up', side = direction === 'left' || direction === 'right';
  // Tala's broad, stepped ears are this game's art language, not a claim about every telling.
  let s = p('M14 20H3v5h4v7h6v4h6V24z M49 20h12v5h-4v7h-6v4h-6V24z', '#263e32');
  s += p('M15 22H6v3h4v6h6v3h3V25z M48 22h10v3h-4v6h-6v3h-3V25z', c.skin);
  s += r(10, 25, 6, 3, c.light) + r(48, 25, 6, 3, c.light) + r(14, 29, 2, 3, c.shade) + r(48, 29, 2, 3, c.shade);
  s += p('M19 9h24v4h6v22h-5v6H21v-4h-6V17h4z', '#263e32');
  if (back) {
    s += p('M20 10h23v4h5v22h-5v5H22v-4h-6V18h4z', c.hair) + r(21, 15, 3, 19, c.strand) + r(38, 12, 2, 22, c.strand);
  } else if (side) {
    s += p('M27 17h17v5h5v6h4v5h-5v5h-6v4H29v-4h-7V23h5z', c.skin) + r(31, 23, 5, 12, c.light);
    s += p('M18 12h25v4h5v8h-7v-5h-7v7h-6v10h-9V19h-3v-4h2z', c.hair) + r(20, 14, 11, 2, c.strand);
    s += p('M27 25h-8v-3h-7v5h4v6h6v3h6z', c.shade) + r(19, 26, 5, 5, c.light);
    s += r(43, 26, 3, blink ? 1 : 3, '#26372c') + r(42, emotion === 'curious' ? 20 : 22, 5, 1, c.shade) + r(46, 36, 3, mouth ? 3 : 1, '#744c3a');
  } else {
    s += p('M22 17h20v4h5v12h-4v6H23v-3h-5V22h4z', c.skin) + r(21, 22, 5, 12, c.light) + r(42, 26, 3, 8, c.shade);
    s += r(29, 30, 7, 4, c.light) + r(31, 34, 6, 1, c.shade);
    for (const [i, x] of [22, 38].entries()) {
      const ey = emotion === 'surprised' ? 24 : 26;
      s += r(x, ey, 5, blink || emotion === 'delighted' ? 1 : 3, '#26372c');
      if (!blink && emotion !== 'delighted') s += r(x + 1, ey, 1, 1, '#f5e5bc');
      s += r(x - 1, ey - (emotion === 'curious' && i === 0 ? 6 : 4), 6, 1, c.shade);
      if (emotion === 'worried' || emotion === 'wistful') s += r(x + (i ? 0 : 4), ey - 5, 2, 1, c.shade);
      if (emotion === 'determined' || emotion === 'wry') s += r(x + (i ? 0 : 4), ey - 3, 2, 1, c.shade);
    }
    const smile = ['warm', 'delighted', 'wry'].includes(emotion);
    s += r(29, 37, 8, mouth || emotion === 'surprised' ? 3 : 1, '#744c3a');
    if (smile) s += r(27, 36, 2, 1, '#744c3a') + r(37, 36, 2, 1, '#744c3a');
    if (emotion === 'wistful') s += r(27, 38, 2, 1, '#744c3a');
    s += p('M18 12h25v4h5v7h-8v-6h-7v5h-7v-3h-4v6h-6V17h2z', c.hair) + r(22, 12, 12, 2, c.strand) + r(40, 17, 5, 2, c.strand);
    if (id === 'minda' || id === 'sela') s += p('M44 10h8v4h3v9h-6v-5h-5z', c.hair) + r(48, 13, 4, 2, c.strand);
    if (id === 'doro') s += p('M24 35h4v3h10v-3h4v6h-5v3h-9v-3h-4z', c.hair) + r(29, 39, 8, 1, c.strand);
  }
  if (id === 'pilo' || id === 'nilo') s += p('M16 13h7v3h-3v4h-6v-4h2z', '#9da572') + r(18, 14, 3, 1, '#d5ce90');
  return direction === 'left' ? `<g transform="translate(64 0) scale(-1 1)">${s}</g>` : s;
}

const frames = new Map<string, string>();
export function duwendeSpriteSvg(id: DuwendeLook, direction: Direction = 'down', frame = -1, gesture: Gesture = 'work', emotion: Emotion = 'neutral', blink = false, mouth = 0, pointing?:Direction) {
  const phase = Math.abs(frame) % 2, key = `${id}:${direction}:${phase}:${gesture}:${emotion}:${blink}:${mouth}:${pointing}`;
  const cached = frames.get(key); if (cached) return cached;
  const c = looks[id], celebrant = gesture === 'celebrate', back = direction === 'up';
  let s = r(20, 65, 8, 10, c.fold) + r(37, 65, 8, 10, c.fold) + r(18, 75, 12, 4, '#293c31') + r(36, 75, 12, 4, '#293c31') + r(20, 75, 8, 1, c.trim) + r(38, 75, 8, 1, c.trim);
  s += p('M21 42h22v4h6v21h-4v4H18v-4h-4V47h7z', '#253c31') + r(19, 46, 25, 19, c.cloth) + r(19, 62, 25, 6, c.fold);
  for (let row = 0; row < 5; row++) for (let col = 0; col < 8; col++) s += r(21 + col * 3, 48 + row * 3, 1, 1, (row + col) % 2 ? c.fold : c.trim);
  s += p('M23 43h17v4h-6v5h-5v-5h-6z', c.trim) + r(19, 65, 25, 2, c.trim);
  if (id === 'minda' || id === 'luning' || id === 'sela') s += r(22, 48, 2, 15, c.trim) + r(39, 48, 2, 15, c.trim) + r(22, 59, 19, 11, id === 'minda' ? '#345d64' : '#aa8b58') + r(25, 61, 12, 1, c.trim) + r(28, 63, 1, 5, c.trim);
  const raised = celebrant || gesture === 'wave';
  const handY = raised ? 12 - phase * 3 : gesture === 'talk' && mouth ? 47 : 56 + phase;
  if(pointing==='left')s+=r(3,49+phase,15,5,c.cloth)+r(1,48+phase,8,6,c.skin)+r(0,48+phase,4,2,c.light);
  else s += r(raised ? 7 : 12, raised ? handY + 4 : 48, 6, raised ? 48 - handY : 13, c.cloth) + r(raised ? 4 : 11, handY, 8, 7, c.skin) + r(raised ? 5 : 12, handY, 3, 3, c.light);
  if(pointing==='right')s+=r(46,49+phase,14,5,c.cloth)+r(56,48+phase,7,6,c.skin)+r(60,48+phase,4,2,c.light);
  else if(pointing==='up')s+=r(47,39,6,15,c.cloth)+r(49,33-phase,6,8,c.skin)+r(51,29-phase,2,6,c.light);
  else if(pointing==='down')s+=r(47,49,6,17,c.cloth)+r(48,63+phase,6,8,c.skin)+r(50,70+phase,2,5,c.light);
  else s += r(47, celebrant ? handY + 4 : 48, 6, celebrant ? 48 - handY : 13, c.fold) + r(celebrant ? 51 : 47, celebrant ? handY : 56 - phase, 7, 7, c.skin);
  s += head(id, direction, emotion, blink, mouth);
  if (!back && !celebrant && gesture !== 'reach' && !pointing) {
    if (id === 'nilo') s += p('M45 52h12v18H45z', '#67563a') + r(47, 55, 8, 11, '#c79850') + r(50, 56, 3, 8, '#ffe1a1') + r(48, 49, 6, 2, '#c6ae71');
    else if (id === 'luning' || id === 'sela') {
      s += r(22, 57 + phase, 25, 15, '#664d33') + r(23, 58 + phase, 23, 2, '#d3b47a');
      for (let row = 0; row < 3; row++) for (let col = 0; col < 7; col++) s += r(24 + col * 3, 62 + row * 3 + phase, 2, 1, (row + col) % 2 ? '#d3b47a' : '#9b784b');
      s += r(19, 58, 7, 4, c.light) + r(44, 58 + phase, 7, 4, c.light);
    } else if (id === 'minda') s += r(45, 57 - phase, 11, 3, '#b6bda1') + r(52, 53 - phase, 3, 9, '#d7cdb0') + r(46, 62, 3, 6, '#ad9366');
    else if (id === 'doro') s += r(26, 60, 15, 11, '#8a6e44') + r(25, 59, 17, 2, '#d2b578') + p('M32 59v-9h-5v-3h6v5h4v-7h4v5h-4v9z', '#8fa471');
    else s += r(22, 56, 22, 13, '#dfcf9f') + r(32, 57, 1, 11, '#a18c65') + p(`M25 ${60 + phase}h4v3h8v2h-5v-3h-7z`, '#69866d') + r(47, 54, 2, 16, '#c6ac70');
  }
  if (gesture === 'reach') s += r(18 + phase * 6, 53, 11, 5, c.skin) + r(36 - phase * 6, 53, 11, 5, c.light);
  const out = svg(`<g transform="scale(.5)">${s}</g>`, 32, 40);
  if (frames.size > 600) frames.clear(); frames.set(key, out); return out;
}

export function duwendePortraitSvg(id: DuwendeLook, emotion: Emotion = 'neutral', blink = false, mouth = 0) {
  const c = looks[id];
  let s = r(0, 0, 80, 96, c.fold);
  for (let i = 0; i < 22; i++) s += r(i * 23 % 78, i * 17 % 94, 2, 2, c.cloth);
  s += p('M20 70h40v7h10v19H9V79h11z', c.cloth) + r(25, 78, 30, 18, c.fold) + r(27, 82, 25, 2, c.trim);
  for (let i = 0; i < 9; i++) s += r(15 + i * 6, 89, 2, 1, c.trim);
  s += `<g transform="translate(0 7) scale(1.25 1.55)">${head(id, 'down', emotion, blink, mouth)}</g>`;
  return svg(s, 80, 96);
}
