import { springPortraitSvg, springSpriteSvg } from './springCharacterArt.ts';
import { lolaPortraitSvg, lolaSpriteSvg } from './lolaArt.ts';
import { duwendePortraitSvg, duwendeSpriteSvg } from './duwendeArt.ts';
import { bagtasSpriteSvg, bagtasPortraitSvg } from './bagtasArt.ts';
import { kaprePortraitSvg } from './kapreArt.ts';
import { travelerPortraitSvg, travelerSpriteSvg } from './travelerArt.ts';
import { dalisaySvg, tigmamanukanSvg, trailCreaturePortraitSvg } from './trailCreatureArt.ts';
import type { CharacterId, Direction, Emotion, Gesture } from '../game/model.ts';

// Original integer-grid character art. Larger source canvases add detail while
// the game keeps its source-pixel anchors and small, readable silhouettes.
const r = (x: number, y: number, w: number, h: number, c: string) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
const p = (d: string, c: string) => `<path d="${d}" fill="${c}"/>`;
const svg = (body: string, w: number, h: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${body}</svg>`;
const palettes = {
  bagtas: { skin: '#8d7663', light: '#b3a083', shade: '#62564a', hair: '#303a34', shine: '#555849', cloth: '#596c57', fold: '#354f42', trim: '#baa06e' },
  rae: { skin: '#bc8056', light: '#dfa67b', shade: '#925d43', hair: '#292321', shine: '#514033', cloth: '#f5eedc', fold: '#cfc9b5', trim: '#3d7776' },
  lola: { skin: '#b98562', light: '#dbad86', shade: '#905d46', hair: '#a6a393', shine: '#ded3bd', cloth: '#829277', fold: '#5a715b', trim: '#a98b68' },
  tala: { skin: '#ad754e', light: '#d59c70', shade: '#82523e', hair: '#2f3029', shine: '#5b5340', cloth: '#75885c', fold: '#4d694d', trim: '#d6ad5d' },
  minda: { skin: '#af7b58', light: '#d5a17c', shade: '#835641', hair: '#a7aca0', shine: '#d3d0ba', cloth: '#73949a', fold: '#456b77', trim: '#d5be8d' },
  uban: { skin: '#80583f', light: '#b08a60', shade: '#563c31', hair: '#343a33', shine: '#a6a18a', cloth: '#68705a', fold: '#414f42', trim: '#b6a279' },
};

function eyes(x: number, y: number, emotion: Emotion, blink: boolean, large = false, mouth = 0, face: keyof typeof palettes = 'rae') {
  const unit = large ? 2 : 1, gap = large ? face === 'uban' ? 23 : face === 'rae' ? 20 : 18 : 8, eyeW = large ? face === 'uban' ? 9 : face === 'rae' ? 8 : 7 : 3;
  const ink = '#332e28', warm = '#f0d8ac';
  let out = '';
  for (let i = 0; i < 2; i++) {
    const xx = x + i * gap;
    if (blink || emotion === 'delighted') out += r(xx, y + unit, eyeW, unit, ink) + (emotion === 'delighted' ? r(xx + unit, y, eyeW - unit * 2, unit, ink) : '');
    else out += r(xx, y, eyeW, large && face === 'rae' ? 5 : unit * 2, ink) + r(xx + unit, y, unit, unit, warm);
    if (!blink && emotion === 'wistful') out += r(xx, y, eyeW, unit, palettes[face].skin);
    const browY = y - (emotion === 'surprised' ? unit * 4 : unit * 2);
    out += r(xx - (large ? 1 : 0), browY + (emotion === 'curious' && i === 0 ? -unit : 0), eyeW, unit, ink);
    if (emotion === 'worried' || emotion === 'wistful') out += r(xx + (i ? 0 : eyeW - unit), browY - unit, unit, unit, ink);
    if (emotion === 'determined' || emotion === 'wry') out += r(xx + (i ? 0 : eyeW - unit), browY + unit, unit, unit, ink);
  }
  const mx = x + gap / 2 + eyeW / 2 - unit, my = y + (large ? face === 'rae' ? 15 : face === 'uban' ? 21 : 18 : 7);
  if (mouth > 0 || emotion === 'surprised') out += r(mx - unit, my, unit * 4, unit * (emotion === 'surprised' ? 4 : 3), '#784b3c') + r(mx, my + unit * 2, unit * 2, unit, '#cd987b');
  else if (emotion === 'warm' || emotion === 'delighted') out += r(mx - unit * 2, my, unit, unit, ink) + r(mx + unit * 2, my, unit, unit, ink) + r(mx - unit, my + unit, unit * 3, unit, ink);
  else if (emotion === 'worried' || emotion === 'wistful') out += r(mx - unit, my, unit * 3, unit, '#7b5140') + r(mx - unit * 2, my + unit, unit, unit, '#7b5140');
  else out += r(mx - unit, my + (emotion === 'wry' ? unit : 0), unit * 3, unit, '#77513d');
  return out;
}

const frameCache = new Map<string, string>();
export function characterSpriteSvg(id: Exclude<CharacterId, 'uban'>, direction: Direction = 'down', frame = 0, gesture: Gesture = 'idle', emotion: Emotion = 'neutral', blink = false, mouth = 0): string {
  if(id==='tigmamanukan')return tigmamanukanSvg(direction,frame>=0?frame%3:0,blink,mouth>0);
  if(id==='dalisay')return dalisaySvg(direction,blink,mouth,frame===-2?1:0);
  if (id === 'lola') return lolaSpriteSvg(direction, frame, gesture, emotion, blink, mouth);
  if (id === 'minda' || id === 'luning') return duwendeSpriteSvg(id, direction, frame, gesture, emotion, blink, mouth);
  if (id === 'mayumi') return springSpriteSvg(id, blink, mouth, emotion, frame < 0 ? Math.abs(frame) : frame);
  if (id === 'rae' || id === 'tala') return travelerSpriteSvg(id, direction, frame, gesture, emotion, blink, mouth);
  return supportingSpriteSvg(id, direction, frame, gesture, emotion, blink, mouth);
}

// Preserve the supporting cast's established poses while the travelers use their own rig.
function supportingSpriteSvg(id: Exclude<keyof typeof palettes, 'uban'>, direction: Direction, frame: number, gesture: Gesture, emotion: Emotion, blink: boolean, mouth: number): string {
  if (id === 'bagtas') return bagtasSpriteSvg(blink, mouth, emotion, frame === -3 ? 1 : 0, direction);
  const key = `${id}:${direction}:${frame}:${gesture}:${emotion}:${blink}:${mouth}`;
  const cached = frameCache.get(key); if (cached) return cached;
  const c = palettes[id], small = id === 'tala' || id === 'minda', h = small ? 40 : 48;
  const side = direction === 'left' || direction === 'right', back = direction === 'up';
  const walking = frame >= 0, phase = Math.max(0, frame) % 6;
  const posePhase = frame === -3 ? 1 : 0;
  const legs = walking ? [[-1, 2], [0, 1], [1, 0], [2, -1], [1, 0], [0, 1]][phase] : [0, 0];
  const breath = !walking && gesture === 'idle' && frame === -2 ? 1 : 0;
  const torsoY = small ? 21 : 25, hipY = small ? 31 : 35;
  let s = '';
  // Visible flip-flop soles and opposite leg motion; no feet are clipped from the canvas.
  for (let i = 0; i < 2; i++) {
    const lx = (side ? 11 : 8) + i * (side ? 6 : 11), ly = hipY + legs[i];
    s += r(lx, ly, 5, h - ly - 4, c.skin) + r(lx + 1, ly, 2, h - ly - 5, c.light);
    s += r(lx - 1, h - 4 + Math.min(0, legs[i]), 7, 3, '#634635') + r(lx, h - 5 + Math.min(0, legs[i]), 5, 2, id === 'rae' ? '#ae5941' : '#a48358');
    s += r(lx + 1, h - 5 + Math.min(0, legs[i]), 1, 2, '#e0b48b');
  }
  s += `<g transform="translate(0 ${breath})">`;
  // Arms move opposite the legs; the NPC work/wave poses have distinct silhouettes.
  const armStep = walking ? phase < 3 ? -1 : 1 : 0;
  const leftY = gesture === 'wave' || gesture === 'celebrate' ? torsoY - 8 - posePhase : gesture === 'reach' || gesture === 'pull' ? torsoY + 2 - posePhase : torsoY + armStep;
  const rightY = gesture === 'celebrate' ? torsoY - 8 - posePhase : gesture === 'think' || gesture === 'listen' ? torsoY - 4 : gesture === 'brush' ? torsoY + 7 - posePhase * 2 : gesture === 'work' ? torsoY + 4 + posePhase : gesture === 'talk' ? torsoY - mouth * 2 : torsoY - armStep;
  const leftX = gesture === 'wave' || gesture === 'celebrate' ? 2 : 5, rightX = gesture === 'celebrate' ? 26 : 23;
  s += r(leftX, leftY, 5, 12, c.skin) + r(leftX, leftY, 2, 8, c.light);
  s += r(rightX, rightY, 5, 11, c.shade) + r(rightX + 1, rightY + 1, 3, 8, c.skin);
  if (gesture === 'wave') s += r(posePhase, leftY - 3, 6, 5, c.light) + r(posePhase, leftY - 5, 1, 3, c.light) + r(3 + posePhase, leftY - 6, 1, 3, c.light);
  s += p(`M10 ${torsoY - 2}h12v3h3v${small ? 10 : 12}H7v-${small ? 10 : 12}h3z`, c.cloth);
  s += r(8, torsoY + 7, 16, 3, c.fold) + r(11, torsoY + 1, 2, 6, id === 'rae' ? '#fff9e9' : c.trim);
  if (id === 'rae') {
    s += r(11, torsoY - 3, 10, 4, c.skin) + r(10, torsoY - 2, 2, 7, c.cloth) + r(21, torsoY - 2, 2, 7, c.cloth);
    s += r(8, hipY - 2, 17, 7, c.trim) + r(16, hipY, 2, 6, '#2a5b5b') + r(21, hipY, 3, 3, '#61918a') + r(10, hipY + 3, 4, 1, '#254f51');
    s += r(23, torsoY + 9, 3, 2, '#c5a376'); // The spare string at his shorts pocket.
  } else if (id === 'lola') {
    s += p(`M9 ${hipY - 3}h15l3 11H6z`, '#a88e70');
    for (const [x, y] of [[10, hipY], [20, hipY + 3], [13, hipY + 6], [23, hipY + 7]]) s += r(x, y, 2, 2, '#d4b393') + r(x - 1, y + 1, 4, 1, '#ceba96');
    s += r(9, hipY - 2, 16, 1, '#795f4c');
  } else if (id === 'tala') {
    s += p(`M10 ${torsoY - 2}h12v4h-5v4h-3v-4h-4z`, '#d7af62');
    s += p(`M10 ${torsoY + 1}h2v3h3v3h3v3h3v3h-3v-3h-3v-3h-3v-3h-2z`, '#b59a68') + r(18, torsoY + 6, 8, 7, '#a18150') + r(19, torsoY + 7, 6, 3, '#d7bd82');
    if (gesture === 'map') s += r(3, torsoY + 3, 26, 9, '#ebd9a6') + p(`M8 ${torsoY + 4}h10v2h-5v3h-2v-4H8z`, '#7b9475') + r(25, torsoY + 1 + mouth, 2, 10, '#65513d');
    else if (gesture === 'guardMap') { /* Folded map and arms are drawn in front of the torso below. */ }
    else s += r(28, torsoY - 7, 2, 17, '#e0bd75') + r(28, torsoY - 9, 2, 3, '#564b37') + r(28, torsoY - 2, 2, 2, '#ac8554');
  } else {
    s += r(10, torsoY, 2, 12, '#d5c7a1') + r(21, torsoY, 2, 12, '#d5c7a1') + r(10, torsoY + 7, 13, 9, '#466f7b');
    s += r(12, torsoY + 10, 8, 4, '#668993') + r(18, torsoY + 8, 2, 6, '#c2b58b') + r(23, torsoY + 8, 3, 6, '#847c60');
    if (gesture === 'work') s += r(25, torsoY + 9 + mouth, 6, 2, '#cad0b5') + r(28, torsoY + 5 + mouth, 2, 7, '#cad0b5');
  }
  s += '</g>';
  // Heads have independent blink/turn and straight nape-length hair for Rae.
  const headSway = walking && (phase === 2 || phase === 5) ? phase === 2 ? -1 : 1 : 0;
  s += `<g transform="translate(${headSway} ${gesture === 'bow' ? 2 : 0})">`;
  const headY = small ? 1 : 0, headBottom = torsoY + 1;
  s += p(side ? `M9 ${headY + 2}h12v2h4v7h-4v${headBottom - 11}H8v-3H5V${headY + 8}h2V${headY + 4}h2z` : `M9 ${headY + 2}h13v2h4v4h2v${headBottom - 8}h-4v3H8v-3H4V${headY + 8}h2V${headY + 4}h3z`, c.hair);
  if (id === 'lola' || id === 'minda') s += r(side ? 3 : 22, headY + 4, 7, 8, c.hair) + r(side ? 3 : 24, headY + 4, 4, 3, c.shine);
  if (side) {
    // A single profile head: never layer a second face over the front-facing head.
    // Keep every facial feature in this same sway/bow group.
    s += p(`M11 ${headY + 7}h11v3h4v5h2v3h-2v5h-5v3h-8v-3h-3V${headY + 12}h1z`, c.skin);
    s += r(13, headY + 13, 3, 8, c.light) + r(21, headY + 21, 4, 2, c.shade);
    s += p(`M8 ${headY + 5}h15v3h3v5h-5v-3h-4v5h-4v7H8z`, c.hair);
    s += r(9, headY + 6, 9, 2, c.shine) + r(7, headY + 12, 2, 8, c.shine);
    s += r(15, headY + 16, 4, 5, c.skin) + r(16, headY + 17, 1, 3, c.shade);
    s += r(23, headY + 14, 2, blink ? 1 : 2, '#302d25');
    if (!blink) s += r(24, headY + 14, 1, 1, '#f0d8ac');
    s += r(22, headY + (emotion === 'surprised' ? 10 : 12), 3, 1, c.hair);
    s += r(24, headY + 21, 2, mouth ? 2 : 1, '#80543d');
    if (id === 'rae') s += r(7, headY + 18, 5, 7, c.hair) + r(8, headY + 18, 1, 4, c.shine);
    if (id === 'tala') s += r(8, headY + 10, 3, 2, '#b7ae6d');
  } else if (!back) {
    s += p(`M10 ${headY + 9}h13v3h3v${small ? 7 : 9}h-3v4H11v-3H7V${headY + 12}h3z`, c.skin);
    s += r(10, headY + 11, 3, small ? 9 : 11, c.light) + r(23, headY + 14, 2, 5, c.shade);
    s += eyes(11, headY + 14, emotion, blink, false, mouth, id);
    s += p(`M8 ${headY + 7}h17v3h-5v3h-3v-3h-5v4H8z`, c.hair) + r(8, headY + 5, 9, 2, c.shine) + r(6, headY + 10, 2, 9, c.shine);
    if (id === 'rae') s += r(5, headY + 11, 2, 12, c.hair) + r(24, headY + 10, 2, 14, c.hair) + r(7, headY + 21, 2, 4, c.hair);
    if (id === 'lola') s += r(10, headY + 18, 3, 1, c.shade) + r(21, headY + 18, 3, 1, c.shade);
    if (id === 'minda') s += r(11, headY + 11, 4, 1, c.shade) + r(19, headY + 11, 4, 1, c.shade);
  } else {
    s += r(9, headY + 6, 2, headBottom - 7, c.shine) + r(19, headY + 3, 2, headBottom - 4, c.shine) + r(13, headBottom - 4, 8, 3, c.hair);
    if (id === 'tala') s += r(22, headY + 9, 4, 4, '#b7ae6d');
  }
  s += '</g>';
  if (gesture === 'think') s += r(23, headBottom - 2, 5, 4, c.light);
  if (gesture === 'listen') s += r(24, headY + 15, 4, 5, c.light);
  if (gesture === 'brush') s += r(20 - posePhase * 2, hipY - 3, 6, 3, c.skin) + r(20 - posePhase * 2, hipY - 3, 2, 1, c.light);
  if (!back) {
    // Keep the nape at the sides, never a dark band across the chin or sando.
    s += r(11, torsoY + (small ? 2 : -1), 12, small ? 3 : 4, c.skin) + r(8, torsoY + (small ? 5 : 3), 17, 3, c.cloth);
    if (id === 'rae') s += r(11, torsoY + 2, 10, 2, c.skin);
  }
  if (gesture === 'reach' || gesture === 'pull') s += r(10, torsoY + 9 + mouth, 14, 4, c.skin) + r(15, torsoY + 8 + mouth, 5, 4, c.light);
  if (gesture === 'celebrate') s += r(0, leftY - 3, 5, 5, c.light) + r(27, rightY - 3, 5, 5, c.light);
  if (id === 'tala' && gesture === 'guardMap' && !back) s += r(11, torsoY + 2, 13, 9, '#e3d09c') + r(17, torsoY + 3, 1, 7, '#b99f6c') + r(8, torsoY + 8, 15, 3, c.skin) + r(11, torsoY + 8, 5, 1, c.light);
  const out = svg(direction === 'left' ? `<g transform="translate(32 0) scale(-1 1)">${s}</g>` : s, 32, h);
  if (frameCache.size > 900) frameCache.clear(); frameCache.set(key, out); return out;
}

const portraitCache = new Map<string, string>();
export function characterPortraitSvg(id: CharacterId, emotion: Emotion = 'neutral', blink = false, mouth = 0): string {
  if(id==='tigmamanukan'||id==='dalisay')return trailCreaturePortraitSvg(id,emotion,blink,mouth);
  if (id === 'lola') return lolaPortraitSvg(emotion, blink, mouth);
  if (id === 'minda' || id === 'luning') return duwendePortraitSvg(id, emotion, blink, mouth);
  if (id === 'mayumi') return springPortraitSvg(id, emotion, blink, mouth);
  if (id === 'rae' || id === 'tala') return travelerPortraitSvg(id, emotion, blink, mouth);
  return supportingPortraitSvg(id, emotion, blink, mouth);
}

function supportingPortraitSvg(id: keyof typeof palettes, emotion: Emotion, blink: boolean, mouth: number): string {
  if (id === 'bagtas') return bagtasPortraitSvg(emotion, blink, mouth);
  if (id === 'uban') return kaprePortraitSvg(emotion, blink, mouth);
  const key = `${id}:${emotion}:${blink}:${mouth}`, cached = portraitCache.get(key); if (cached) return cached;
  const c = palettes[id];
  let s = r(0, 0, 80, 96, id === 'rae' || id === 'lola' ? '#d5c99e' : '#6b8274');
  s += p('M0 65h9v-9h8v-8h47v7h9v9h7v32H0z', id === 'rae' || id === 'lola' ? '#b6b98b' : '#4b6b61');
  for (let i = 0; i < 20; i++) s += r(3 + i * 17 % 73, 5 + i * 13 % 86, 1, 1, '#e5d4a3');
  // Tailored shoulders and profession details, separate from the face silhouette.
  s += p('M25 66h31v4h11v6h6v20H7V78h6v-7h12z', c.shade) + p('M27 67h27v6h12v23H13V77h14z', c.cloth);
  s += r(21, 80, 3, 16, c.fold) + r(58, 80, 4, 16, c.fold);
  s += r(30, 55, 22, 19, c.shade) + r(32, 56, 15, 18, c.skin);
  if (id === 'rae') {
    s += p('M22 72h7v9h24v-9h7v24H20V76h2z', '#f8f0dc') + r(24, 84, 3, 12, '#fff8e8') + r(53, 83, 4, 13, '#d6d0bb');
    s += r(12, 79, 7, 17, c.skin) + r(62, 80, 6, 16, c.skin);
  } else if (id === 'tala') {
    s += p('M25 69h30v8H43v11h-5V77H25z', '#d6b268') + p('M21 74h5v5h5v5h5v5h6v7h-6v-5h-6v-5h-5v-5h-4z', '#bea273');
    s += r(61, 72, 4, 24, '#e4c17b') + p('M61 72l2-9 2 9z', '#5b4b35') + r(62, 79, 1, 15, '#fae0a1');
    s += r(7, 89, 23, 7, '#e6d6a4') + r(10, 91, 15, 1, '#8da17b');
  } else if (id === 'minda') {
    s += r(25, 73, 5, 23, '#d3c6a1') + r(51, 73, 5, 23, '#d3c6a1') + r(26, 82, 29, 14, '#426b77') + r(33, 87, 13, 9, '#678c94');
    s += r(42, 84, 3, 12, '#bfc8b2') + r(41, 83, 5, 3, '#bfc8b2');
  } else if (id === 'lola') {
    s += r(37, 73, 2, 23, '#556d54') + r(39, 75, 2, 2, '#dfcea1') + r(39, 83, 2, 2, '#dfcea1') + r(39, 91, 2, 2, '#dfcea1');
    s += p('M25 70h8v7h-6z M48 70h8l-2 7h-6z', '#a4ae88');
  } else s += r(24, 74, 3, 22, '#9b9774') + r(55, 74, 3, 22, '#9b9774') + p('M27 88h27v3H27z M29 92h23v2H29z', '#53624d');
  // Hair volume frames an asymmetrical, individually shaded face.
  s += p('M24 6h30v3h8v5h5v10h3v31h-5v11H15V55h-5V25h3V15h5V9h6z', c.hair);
  if (id === 'lola') s += p('M61 29h10v4h4v12h-4v6H60V40h-3z', c.hair) + r(65, 32, 6, 3, c.shine);
  if (id === 'minda') s += p('M59 10h11v4h5v10h-5v7H60V23h-3z', c.hair) + r(63, 13, 6, 3, c.shine);
  s += p(id === 'rae' ? 'M24 23h32v5h6v23h-5v6h-8v5H31v-5h-8v-6h-4V31h5z' : 'M26 22h28v5h6v25h-4v7h-7v6H31v-5h-7v-7h-4V31h6z', c.skin);
  s += p('M26 28h5v24h5v8h-5v-5h-5z', c.light) + r(52, 32, 6, 20, c.shade);
  s += r(16, 35, 6, 13, c.skin) + r(59, 35, 6, 13, c.shade) + r(18, 39, 3, 5, c.light);
  s += p(id === 'lola' || id === 'minda' ? 'M22 16h36v5h5v9h-7v-5H31v3h-6v9h-5V22h2z' : id === 'tala' ? 'M22 16h36v6h5v9H48v-5h-6v6h-6v-7h-7v11h-7z' : 'M22 16h36v6h5v9H49v-5h-8v8h-6v-8h-7v10h-6z', c.hair);
  s += p('M20 18h4v10h-4z M25 12h23v3H25z M52 17h5v8h-5z', c.shine);
  if (id === 'rae') s += p('M14 30h5v26h5v11h-8v-8h-3z M61 27h5v34h-5v7h-5V55h5z', c.hair) + r(16, 30, 2, 21, c.shine) + r(62, 36, 2, 19, c.shine);
  if (id === 'tala') s += r(14, 33, 5, 3, '#c9b46a') + r(15, 32, 2, 6, '#8a9a64') + r(20, 46, 3, 6, c.light);
  if (id === 'lola' || id === 'minda') s += p('M28 17h26v2H28z M24 22h4v8h-2v10h-2z M55 24h3v14h-2V29h-1z', c.shine);
  s += eyes(id === 'rae' ? 24 : 26, id === 'rae' ? 37 : 38, emotion, blink, true, mouth, id);
  s += r(39, 43, 3, id === 'rae' ? 6 : 9, c.light) + r(37, id === 'rae' ? 48 : 50, 7, 2, c.shade);
  if (id === 'rae') s += r(22, 47, 5, 2, '#d99c76') + r(51, 47, 4, 2, '#ca8d67');
  if (id === 'lola' || id === 'minda') s += r(23, 46, 5, 1, c.shade) + r(51, 46, 5, 1, c.shade) + r(31, 62, 16, 1, c.shade);
  const out = svg(s, 80, 96); portraitCache.set(key, out); return out;
}
