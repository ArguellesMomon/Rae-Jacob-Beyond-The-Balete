import type { Direction, Emotion, Gesture } from '../game/model.ts';

export type TravelerId = 'rae' | 'tala';
const r = (x: number, y: number, w: number, h: number, fill: string) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
const p = (d: string, fill: string) => `<path d="${d}" fill="${fill}"/>`;
const svg = (s: string, w: number, h: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${s}</svg>`;
const colors = {
  rae: { skin: '#bc8258', light: '#dfa77a', shade: '#8c5d43', rim: '#f0c797', hair: '#292d29', strand: '#4c5140', ink: '#273630', cloth: '#eae7d5', fold: '#a6b4a0', trim: '#456958' },
  tala: { skin: '#ad794f', light: '#d19c69', shade: '#79583f', rim: '#e6c38a', hair: '#2c3c31', strand: '#596746', ink: '#22372f', cloth: '#688064', fold: '#3c594a', trim: '#d1ae60' },
};
const eyeInk = '#302d25';
const frames = new Map<string, string>();

function features(id: TravelerId, direction: 'front' | 'side', emotion: Emotion, blink: boolean, mouth: number) {
  const c = colors[id], side = direction === 'side', closed = blink || emotion === 'delighted';
  const ey = emotion === 'surprised' ? 24 : emotion === 'wistful' ? 27 : 25;
  const positions = side ? [44] : [22, 39];
  let s = '';
  positions.forEach((x, i) => {
    const w = side ? 4 : 6;
    s += r(x, ey, w, closed ? 1 : emotion === 'surprised' ? 5 : 4, eyeInk);
    if (!closed) s += r(x + (side ? 2 : 1), ey, 1, 1, '#f5e5b9') + r(x + (side ? 1 : 3), ey + 1, 1, 2, id === 'tala' ? '#a5ad70' : '#846542');
    let browY = ey - 4;
    if (emotion === 'surprised') browY -= 2;
    if (emotion === 'curious' && i === 0 || emotion === 'wry' && i === positions.length - 1) browY -= 2;
    s += r(x - 1, browY, w + 1, 1, '#534331');
    if (emotion === 'worried' || emotion === 'wistful') s += r(x + (i ? 0 : w - 2), browY - 1, 2, 1, '#534331');
    if (emotion === 'determined') s += r(x + (i ? 0 : w - 2), browY + 1, 2, 1, '#534331');
  });
  if (!side) {
    s += r(31, 29, id === 'tala' ? 6 : 3, 4, c.light) + r(31, 33, id === 'tala' ? 7 : 5, 1, c.shade);
    s += r(20, 31, 4, 2, '#c89565') + r(44, 31, 3, 2, '#ba8458');
    if (id === 'tala') s += r(18, 30, 1, 1, c.rim) + r(21, 33, 1, 1, c.rim) + r(46, 30, 1, 1, c.rim);
  }
  const mx = side ? id === 'rae' ? 46 : 48 : 29, my = 37;
  if (mouth || emotion === 'surprised') s += r(mx, my - 1, side ? 4 : 7, emotion === 'surprised' ? 5 : 3, '#734d3a') + r(mx + 1, my + 1, side ? 2 : 4, 1, '#d6a17a');
  else if (emotion === 'warm' || emotion === 'delighted') s += p(`M${mx - 1} ${my - 1}h2v2h4v-2h2v2h-2v1h-4v-1h-2z`, '#734d3a');
  else if (emotion === 'worried' || emotion === 'wistful') s += r(mx, my, side ? 3 : 6, 1, '#734d3a') + r(mx - 1, my + 1, 1, 1, '#734d3a');
  else s += r(mx, my, side ? 3 : 6, 1, '#734d3a') + (emotion === 'wry' ? r(mx + (side ? 2 : 5), my - 1, 1, 1, '#734d3a') : '');
  return s;
}

/** One face per direction, shared by sprite and portrait; no overlaid front face. */
function head(id: TravelerId, direction: Direction, emotion: Emotion, blink: boolean, mouth: number) {
  const c = colors[id], side = direction === 'right' || direction === 'left', back = direction === 'up';
  let s = '';
  if (id === 'tala') {
    // Broad, softly tapered ears and a compact face distinguish this duwende.
    if (!side) s += p('M15 20H9v-3H3v7h3v6h6v4h7V22z M48 20h7v-3h6v7h-3v6h-6v4h-6V22z', c.ink)
      + p('M15 22H9v-2H6v5h3v4h6v3h3V22z M48 22h7v-2h3v5h-3v4h-6v3h-3V22z', c.skin)
      + p('M9 22h3v3h3v4h-3v-3H9z M52 22h3v4h-3v3h-3v-4h3z', c.light);
    s += p(side ? 'M18 5h24v4h6v8h4v16h-5v8H18v-5h-5V15h5z' : 'M19 3h24v4h7v8h4v19h-6v7H17v-5h-6V16h3V8h5z', c.ink);
  } else {
    s += p(back ? 'M20 5h24v4h7v8h3v15h-6v4H19v-4h-6V18h3v-8h4z' : side ? 'M20 5h23v4h7v9h3v15h-5v7H20v-5h-6V18h2V10h4z' : 'M20 5h24v4h7v8h3v15h-5v9H19v-6h-6V18h3v-8h4z', c.ink);
    if (!side) s += r(12, 24, 7, 10, c.skin) + r(48, 24, 7, 10, c.shade) + r(13, 26, 3, 5, c.light);
  }
  if (back) {
    s += p(id === 'tala' ? 'M20 8h21v3h6v22h-5v7H21v-5h-6V17h5z' : 'M21 9h20v3h7v18h-5v4H21v-4h-4V18h4z', c.hair);
    s += p('M22 12h14v2H22z M19 19h3v10h-3z M42 16h3v12h-3z M27 30h10v2H27z', c.strand);
    s += r(id === 'tala' ? 24 : 23, id === 'tala' ? 39 : 33, 17, id === 'tala' ? 5 : 10, c.skin) + r(26, id === 'tala' ? 39 : 34, 11, 2, c.shade);
    if (id === 'tala') s += p('M17 12h5v4h-3v3h-5v-4h3z', '#9caa73');
    return s;
  }
  if (side) {
    s += p(id === 'rae' ? 'M25 15h18v5h6v7h2v3h2v3h-3v6h-6v4H29v-4h-6V24h2z' : 'M25 15h18v5h6v7h3v3h3v3h-4v6h-7v4H29v-4h-6V24h2z', c.skin);
    s += p('M36 18h7v4h4v10h-4v5h-9v3h-5v-9h5V21h2z', c.light);
    s += p('M26 31h4v8h14v3H29v-3h-3z', c.shade) + r(id === 'rae' ? 50 : 51, 30, id === 'rae' ? 2 : 3, 1, c.rim);
    s += p(id === 'tala' ? 'M18 9h24v4h7v9h-9v-6h-8v5h-7v9h-7V17h-3v-4h3z' : 'M20 9h22v3h7v9h-6v-5h-7v4h-7v7h-6v-2h-6V17h3z', c.hair);
    s += p('M22 10h14v2H22z M19 15h3v5h-3z M37 12h5v2h-5z', c.strand);
    if (id === 'tala') s += p('M24 25h-5v-4h-7v6h3v6h5v3h6v-4h3v-7z', c.ink) + p('M24 26h-5v-2h-4v4h3v4h5v2h2v-7z', c.skin) + r(19, 26, 3, 4, c.light) + r(22, 29, 2, 3, c.shade) + p('M18 16h5v3h-3v3h-5v-3h3z', '#9caa73');
    else s += r(24, 26, 5, 9, c.skin) + r(25, 28, 2, 4, c.shade) + r(24, 26, 3, 1, c.rim);
    s += features(id, 'side', emotion, blink, mouth);
  } else {
    s += p('M21 15h23v5h6v14h-5v6h-8v4H25v-4h-7v-8h-2V22h5z', c.skin);
    s += p('M21 20h6v14h4v6h-6v-4h-5V25h1z', c.light) + p('M45 21h4v12h-4v6h-4v-6h4z', c.shade);
    s += features(id, 'front', emotion, blink, mouth);
    s += p(id === 'tala' ? 'M18 10h25v4h6v7h-8v-5h-6v6h-6v-5h-6v7h-7V16h2z' : 'M20 10h23v3h6v8h-7v-5h-6v5h-6v-4h-6v5h-7V16h3z', c.hair);
    s += p('M22 10h13v2H22z M18 16h3v5h-3z M38 12h5v2h-5z', c.strand) + r(24, 10, 6, 1, '#68705a');
    if (id === 'tala') s += p('M15 15h6v3h-3v4h-5v-4h2z', '#9caa73') + r(16, 17, 3, 1, '#d2cc8b');
  }
  return direction === 'left' ? `<g transform="translate(64 0) scale(-1 1)">${s}</g>` : s;
}

function arm(id: TravelerId, sx: number, sy: number, hx: number, hy: number, far: boolean) {
  const c = colors[id], elbowX = Math.round((sx + hx) / 2), elbowY = Math.round((sy + hy) / 2);
  let s = p(`M${sx} ${sy}h6l${elbowX - sx} ${elbowY - sy} ${hx - elbowX} ${hy - elbowY}v5h-6v-5l${elbowX - hx} ${elbowY - hy}z`, far ? c.shade : c.skin);
  if (!far) s += p(`M${sx + 1} ${sy + 2}h2l${elbowX - sx} ${elbowY - sy} ${hx - elbowX} ${hy - elbowY}v2h-2v-3l${elbowX - hx} ${elbowY - hy}z`, c.light) + r(hx + 1, hy, 3, 2, c.rim);
  if (id === 'tala' && !far) s += r(hx + 2, hy + 2, 1, 2, '#435443') + r(hx + 4, hy + 2, 1, 1, '#435443');
  if (id === 'tala') s += r(sx - 1, sy, 8, 6, far ? c.fold : c.cloth) + r(sx, sy + 5, 6, 1, '#a1ad7d');
  return s;
}

function leg(id: TravelerId, hipX: number, hipY: number, footX: number, footY: number, far: boolean, side: boolean) {
  const c = colors[id], kneeX = Math.round((hipX + footX) / 2), kneeY = Math.round((hipY + footY) / 2), w = id === 'tala' ? 7 : 6;
  let s = p(`M${hipX} ${hipY}h${w}l${kneeX - hipX} ${kneeY - hipY} ${footX - kneeX} ${footY - kneeY}h-${w}l${kneeX - footX} ${kneeY - footY}z`, far ? c.shade : c.skin);
  if (!far) s += p(`M${hipX + 1} ${hipY}h2l${kneeX - hipX} ${kneeY - hipY} ${footX - kneeX} ${footY - kneeY}h-2z`, c.light);
  if (id === 'rae') {
    s += r(footX - 2, footY, side ? 12 : 10, 3, '#353f32') + r(footX - 1, footY - 3, 8, 3, far ? c.skin : c.light);
    s += p(`M${footX} ${footY - 3}h2v1h2v-1h2v2h-2v1h-2v-1h-2z`, '#9f5c3c') + r(footX - 1, footY + 1, 8, 1, '#99835a');
  } else {
    s += p(`M${footX - 1} ${footY - 5}h8v2h3v3h-1v3h-12v-5h2z`, '#343e2f') + r(footX, footY - 4, 7, 3, far ? '#66593c' : '#8e7950') + r(footX + 1, footY - 3, 4, 1, '#c2ad72') + r(footX - 1, footY + 1, 11, 1, '#a69a69');
  }
  return s;
}

function pencil(x: number, y: number) {
  return p(`M${x} ${y}h5v29h-5z`, '#b89c57') + r(x + 1, y, 2, 28, '#f1d78c') + p(`M${x} ${y}l2-7 3 7z`, '#b0a174') + r(x + 2, y - 7, 1, 3, '#354436') + r(x, y + 22, 5, 2, '#807952');
}
function pouch(x: number, y: number) {
  return p(`M${x} ${y}h13v3h2v12h-15v-12h-2v-3z`, '#394b38') + r(x + 1, y + 3, 12, 11, '#907345') + r(x, y, 13, 6, '#b09a60') + r(x + 2, y + 1, 9, 1, '#d7bf7b') + r(x + 5, y + 5, 3, 3, '#e0cc8e') + r(x + 2, y + 11, 8, 1, '#665b3d');
}

export function travelerSpriteSvg(id: TravelerId, direction: Direction = 'down', frame = -1, gesture: Gesture = 'idle', emotion: Emotion = 'neutral', blink = false, mouth = 0) {
  const key = `s:${id}:${direction}:${frame}:${gesture}:${emotion}:${blink}:${mouth}`, old = frames.get(key); if (old) return old;
  const c = colors[id], small = id === 'tala', height = small ? 80 : 96, top = small ? 40 : 44, hip = small ? 62 : 74;
  const side = direction === 'left' || direction === 'right', back = direction === 'up', left = direction === 'left', moving = frame >= 0;
  const phase = moving ? Math.floor(frame) % 8 : 0, pose = frame === -3 ? 1 : 0;
  const swing = moving ? [-5, -3, 0, 3, 5, 3, 0, -3][phase] : 0;
  const lift = [0, 1, 3, 2, 0, 0, 0, 0], bob = moving ? [0, 1, 0, -1, 0, 1, 0, -1][phase] : frame === -2 ? 1 : 0;
  const footY = height - 4, nearLift = moving ? lift[phase] : 0, farLift = moving ? lift[(phase + 4) % 8] : 0;
  let s = '';
  // Far limbs are behind the torso; planted feet never inherit the body bob.
  if (side) s += leg(id, 28, hip, 27 - swing, footY - farLift, true, true) + leg(id, 32, hip, 31 + swing, footY - nearLift, false, true);
  else s += leg(id, 18, hip, 17 + Math.round(swing / 4), footY - nearLift, back, false) + leg(id, 38, hip, 38 - Math.round(swing / 4), footY - farLift, !back, false);
  s += `<g transform="translate(0 ${bob})">`;
  // Gear is attached to the same anatomical hip at every angle, not mirrored wholesale.
  const bagX = back ? 4 : side ? left ? 34 : 15 : 45, bagY = small ? 56 : 64;
  const pencilX = back ? 10 : side ? left ? 44 : 15 : 51;
  if (small) s += pencil(pencilX, 30) + ((back || side && left) ? pouch(bagX, bagY) : '');
  const armSwing = moving ? Math.round(swing * .7) : 0;
  let nearX = side ? 28 : 12, farX = side ? 36 : 46;
  let nearHandX = nearX + (side ? armSwing : -2), farHandX = farX - (side ? armSwing : -1);
  let nearHandY = top + (small ? 14 : 19) - (!side ? armSwing : 0), farHandY = top + (small ? 14 : 19) + (!side ? armSwing : 0);
  if (!moving) {
    if (gesture === 'wave' || gesture === 'celebrate') { nearHandY = top - (side ? 20 : 30) - pose * 2; nearHandX = side ? left ? 2 : 56 : 2; }
    if (gesture === 'celebrate') { farHandY = top - (side ? 26 : 29) + pose; farHandX = side ? left ? 4 : 54 : 56; }
    if (gesture === 'think' || gesture === 'listen') { nearHandY = 33; nearHandX = side ? left ? 12 : 46 : gesture === 'listen' ? 49 : 36; }
    if (gesture === 'talk' && mouth) { nearHandY -= 5; nearHandX += side ? left ? -5 : 5 : -2; }
    if (gesture === 'reach' || gesture === 'pull' || gesture === 'work') {
      nearHandX = side ? left ? 11 : 48 : 27; farHandX = side ? left ? 14 : 45 : 36;
      nearHandY = top + 12 - pose * 2; farHandY = top + 13 - pose * 2;
    }
    if (gesture === 'brush') { nearHandY = hip - 5; nearHandX = 35 - pose * 4; }
  }
  if (side) s += arm(id, farX, top + 2, farHandX, farHandY, true);
  // Shorter, compact duwende body; Rae keeps his recognizable sando and shorts.
  const body = side ? `M25 ${top - 1}h15v4h5v${small ? 20 : 24}H21V${top + 4}h4z` : `M20 ${top - 1}h23v4h6v${small ? 19 : 24}H15V${top + 4}h5z`;
  s += p(body, c.ink);
  if (small) {
    s += p(side ? 'M26 40h13v6h4v20H22V46h4z' : 'M21 40h21v5h5v19H17V45h4z', c.cloth);
    s += p(side ? 'M23 48h3v13h14v3H23z M37 44h3v16h-3z' : 'M17 47h5v15h19v-16h5v17H17z', c.fold);
    s += p(side ? 'M27 47h3v10h-3z M34 58h6v2h-6z' : 'M23 45h3v13h-3z M28 57h10v2H28z M40 47h2v7h-2z', '#8c9b72');
    s += r(side ? 23 : 17, 61, side ? 20 : 30, 3, '#a2935c') + r(side ? 27 : 29, 61, 5, 3, '#d8c28a');
    s += p(side ? 'M24 65h18v5H23z' : 'M18 64h28v7H35v-3h-5v3H18z', '#4a5c42');
    // Seams and cloth patches have deliberate clusters, rather than random noise.
    for (const [x, y] of side ? [[28, 50], [28, 54], [35, 57]] : [[24, 49], [24, 53], [39, 57], [30, 59]]) s += r(x, y, 2, 1, '#b5b384');
    if (back) s += p('M21 41h22v4H33v13h-4V45h-8z', '#b8a060') + p('M42 45h4v5h-4v4h-5v4h-5v4h-6v3H15v-3h8v-4h6v-4h5v-4h5v-5z', '#9b8652');
    else {
      s += p(side ? 'M25 40h14v6H28v5h-4v-6h1z' : 'M20 40h24v6h-8v9h-5v-8H20z', '#d1ae60');
      s += p(side ? 'M25 41h11v2H25z' : 'M22 41h18v2H22z M32 47h2v5h-2z', '#ead08a');
      if (!side) s += p('M19 45h3v4h4v4h4v4h5v4h6v3h-8v-3h-5v-4h-5v-4h-4z', '#a08a54');
      else s += r(left ? 35 : 24, 46, 3, 14, '#b7a066');
    }
  } else {
    s += p(side ? 'M26 44h13v5h4v22H23V49h3z' : 'M21 44h21v4h5v23H17V48h4z', c.cloth);
    s += p(side ? 'M37 49h5v19H26v-3h11z' : 'M42 49h4v19H20v-3h22z', c.fold);
    s += p(side ? 'M26 51h3v12h-3z M29 67h8v2h-8z' : 'M21 52h3v11h-3z M25 61h10v2H25z M37 50h4v9h-4z', '#f7f0d8');
    if (back) s += r(25, 43, 15, 6, c.skin) + r(24, 49, 17, 2, '#bec6af');
    else if (side) s += r(left ? 25 : 37, 44, 4, 10, c.skin) + r(left ? 23 : 40, 48, 3, 10, c.cloth);
    else s += p('M25 43h14v7H25z', c.skin) + r(23, 45, 3, 9, '#f7f0d8') + r(39, 45, 3, 9, '#f7f0d8') + r(26, 50, 13, 2, '#f7f0d8');
    s += p(side ? 'M22 69h23v11H23z' : 'M16 69h33v11H36v-4h-7v4H16z', '#3d7472');
    s += p(side ? 'M38 71h6v8H26v-2h12z' : 'M17 77h11v2H17z M37 73h11v6H36v-4h1z M30 71h3v8h-3z', '#294f51');
    s += r(side ? 26 : 20, 71, side ? 8 : 10, 1, '#81a29a');
    // Rae's spare kite string is tied to the left pocket, including in back views.
    const stringX = back ? 18 : side ? left ? 28 : 36 : 42;
    s += r(stringX, 72, 4, 4, '#c8b382') + r(stringX + 1, 73, 2, 1, '#f1d9a4');
    if (!side || !left) s += r(stringX + 2, 76, 1, 4, '#b7a276');
  }
  // A profile's near arm crosses the clothing naturally; its face remains one unit.
  if (side) s += arm(id, nearX, top + 2, nearHandX, nearHandY, false);
  else s += arm(id, farX, top + 2, farHandX, farHandY, true) + arm(id, nearX, top + 2, nearHandX, nearHandY, false);
  if (small && !back && !(side && left)) s += pouch(bagX, bagY + (moving && phase === 3 ? 1 : 0));
  const headOffset = !moving && gesture === 'bow' ? 2 : 0;
  s += `<g transform="translate(0 ${headOffset})">${head(id, direction, emotion, blink, mouth)}</g>`;
  if (!moving && (gesture === 'think' || gesture === 'listen')) s += r(nearHandX, nearHandY, 6, 5, c.light);
  if (!moving && (gesture === 'wave' || gesture === 'celebrate')) s += r(nearHandX, nearHandY, 6, 5, c.skin) + r(nearHandX, nearHandY - 3, 2, 5, c.light) + r(nearHandX + 3, nearHandY - 4, 2, 4, c.light);
  if (small && (gesture === 'map' || gesture === 'guardMap')) {
    if (back) s += r(10, 51, 4, 10, '#cbbb88') + r(49, 51, 4, 10, '#e3d5a6');
    else {
      const x = side ? left ? 8 : 40 : gesture === 'map' ? 10 : 24, y = gesture === 'map' ? 48 : 46, w = side ? 14 : gesture === 'map' ? 44 : 22;
      s += r(x, y, w, 17, '#695e3f') + r(x + 1, y + 1, w - 2, 14, '#e5d4a1') + r(x + 2, y + 2, w - 4, 1, '#f7e8b7');
      s += r(x + Math.floor(w / 2), y + 2, 1, 12, '#b6a571') + p(`M${x + 3} ${y + 6}h5v2h-3v3h5v2h-7z`, '#71856a');
      s += r(x - 2, y + 9, 6, 5, c.light) + r(x + w - 4, y + 9, 6, 5, c.skin);
    }
  }
  s += '</g>';
  // Keep the established public source canvas and every scene's foot anchor.
  const result = svg(`<g transform="scale(.5)">${s}</g>`, 32, height / 2);
  if (frames.size > 900) frames.clear(); frames.set(key, result); return result;
}

export function travelerPortraitSvg(id: TravelerId, emotion: Emotion = 'neutral', blink = false, mouth = 0) {
  const key = `p:${id}:${emotion}:${blink}:${mouth}`, old = frames.get(key); if (old) return old;
  const c = colors[id];
  let s = r(0, 0, 80, 96, id === 'rae' ? '#74866b' : '#344e42') + p('M0 0h7v96H0z M66 0h5v96h-5z', id === 'rae' ? '#889978' : '#49644d');
  s += p('M0 78h9v-8h14v-9h34v9h14v8h9v18H0z', c.ink) + p('M5 80h10v-8h13v-9h24v9h14v9h9v15H5z', c.skin);
  s += p('M11 81h6v15h-6z M63 81h8v15h-8z M30 64h8v9h-8z', c.light) + r(51, 68, 7, 12, c.shade);
  if (id === 'rae') {
    s += p('M24 70h7v13h20V70h7v11h6v15H18V81h6z', c.cloth) + r(24, 85, 3, 11, '#f7efd7') + r(57, 83, 5, 13, c.fold) + r(33, 91, 18, 2, '#c2cbb4') + r(29, 83, 23, 2, '#f7efd7');
    s += '<g transform="translate(-5 0) scale(1.4)">' + head(id, 'down', emotion, blink, mouth) + '</g>';
  } else {
    s += p('M20 65h39v7h9v24H12V75h8z', c.cloth) + r(18, 77, 4, 19, '#8c9b72') + r(59, 77, 7, 19, c.fold);
    s += p('M24 62h29v8h-9v13h-7V72H24z', '#d1ae60') + p('M25 63h24v3H25z M39 74h3v6h-3z', '#edcf88');
    s += p('M19 72h5v4h5v5h5v5h6v5h6v5h-9v-4h-6v-5h-5v-5h-5v-4h-2z', '#b3a06a');
    s += '<g transform="translate(0 3) scale(1.25)">' + head(id, 'down', emotion, blink, mouth) + '</g>';
    s += pencil(68, 66) + r(5, 86, 28, 10, '#e5d4a1') + r(7, 88, 24, 1, '#f7e8b7') + p('M10 91h8v2h-5v3h-3z', '#71856a') + r(26, 88, 1, 8, '#b6a571');
  }
  const result = svg(s, 80, 96); frames.set(key, result); return result;
}
