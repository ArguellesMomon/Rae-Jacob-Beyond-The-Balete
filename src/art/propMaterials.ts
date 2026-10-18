/** Native pixel materials. Half-pixel grain matches the maps' 2x raster detail. */
export const rect = (x: number, y: number, w: number, h: number, fill: string, opacity = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" opacity="${opacity}"/>`;
export const path = (d: string, fill: string, opacity = 1) => `<path d="${d}" fill="${fill}" opacity="${opacity}"/>`;
export type Material = 'wood' | 'bamboo' | 'bark' | 'stone' | 'clay' | 'cloth' | 'brass' | 'leaf';
const palettes: Record<Material, string[]> = {
  wood: ['#694c31', '#b18b55', '#80613b', '#c2a26d', '#4c402d'],
  bamboo: ['#6e7847', '#c4ba78', '#929556', '#dfcc8c', '#4e613c'],
  bark: ['#54482f', '#8c794b', '#6a5c39', '#a28d5a', '#3c432d'],
  stone: ['#596955', '#9b9f78', '#727e63', '#b3b48c', '#3d5447'],
  clay: ['#89593c', '#bd8d5b', '#a6734b', '#d5aa77', '#634c37'],
  cloth: ['#8b8e69', '#bebb94', '#9ca37f', '#dbd0a7', '#6d7d5e'],
  brass: ['#7e6b40', '#c4a061', '#ad8e51', '#e5c183', '#51604b'],
  leaf: ['#47664a', '#8fa16a', '#65865a', '#c1bc7e', '#314c3b'],
};
const noise = (i: number, seed: number) => ((Math.imul(i + seed + 19, 374761393) ^ Math.imul(i * 13 + 71, 668265263)) >>> 0) / 4294967295;
export function material(d: string, box: readonly [number, number, number, number], kind: Material, key: string, seed = 1, density = .42) {
  const [x, y, w, h] = box, colors = palettes[kind], id = `mat-${key.replace(/[^a-zA-Z0-9-]/g, '-')}`;
  const buckets = colors.map(() => '');
  const count = Math.min(1400, Math.ceil(w * h * density));
  for (let i = 0; i < count; i++) {
    const px = x + Math.floor(noise(i, seed) * w * 2) / 2, py = y + Math.floor(noise(i, seed + 71) * h * 2) / 2;
    const long = kind === 'wood' || kind === 'bark', width = long && i % 4 === 0 ? 1.5 + i % 3 : .5;
    buckets[i % colors.length] += `M${px} ${py}h${width}v.5h-${width}z`;
  }
  return path(d, colors[0]) + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">` + buckets.map((pixels, i) => path(pixels, colors[i], .78)).join('') + '</g>';
}
export const shadow = (x: number, y: number, w: number, h = 4) => path(`M${x + 2} ${y}h${w - 4}v1h3v${h - 2}h-3v1H${x + 2}v-1h-3v-${h - 2}h3z`, '#27392c', .3);
export function plank(x: number, y: number, w: number, h: number, key: string, kind: Material = 'wood') {
  const d = `M${x + 1} ${y}h${w - 3}v1h2v${h - 3}h-1v2H${x + 1}v-1h-1v-${h - 3}h1z`;
  let s = shadow(x + 1, y + h - 1, w, 3) + material(d, [x, y, w, h], kind, key, Math.floor(x + y));
  s += rect(x + 1, y, w - 3, .7, '#d6b77f', .8) + rect(x + 1, y + h - 1, w - 2, .8, '#3a3c2b', .9);
  for (let row = 5; row < h - 1; row += 5) s += rect(x + 1, y + row, w - 2, .5, '#3f412c', .5) + rect(x + 2, y + row + .5, w - 4, .5, '#b49a64', .35);
  for (const cx of [x + 3, x + w - 4]) s += rect(cx, y + 2, 1, 1, '#d8c18b') + rect(cx + .5, y + 2.5, .5, .5, '#444a37');
  s += rect(x + w * .7, y + 1, 4, .5, '#d8bd85', .35) + rect(x + w * .7 + 2, y + 1.5, .5, 2, '#4d412d', .55);
  return s;
}
export function bamboo(x: number, y: number, h: number, key: string, w = 4) {
  let s = material(`M${x} ${y}h${w}v${h}h-${w}z`, [x, y, w, h], 'bamboo', key, Math.floor(x), .7);
  s += rect(x + 1, y + .5, .6, h - 1, '#dbcb8d', .6) + rect(x + w - 1, y, 1, h, '#3b5737', .7);
  for (let i = 3; i < h; i += 9) s += rect(x - .5, y + i, w + 1, 1, '#adab69') + rect(x, y + i + 1, w, .5, '#455a38');
  return s;
}
export function lash(x: number, y: number, w = 5) {
  return [0, 1.5, 3].map(i => rect(x, y + i, w, .7, '#c0aa78') + rect(x + .5, y + i + .7, w - 1, .5, '#766044')).join('');
}
export function basket(x: number, y: number, w = 20, h = 14, key = 'basket') {
  let s = shadow(x, y + h, w + 2) + material(`M${x} ${y}h${w}v${h - 3}h-2v3H${x + 2}v-3h-2z`, [x, y, w, h], 'wood', key, 37, .85);
  s += path(`M${x + 3} ${y}v-4h3v-2h${w - 12}v2h3v4h-2v-3h-3v-1H${x + 6}v1h-2v3z`, '#b89a62');
  for (let row = 1; row < h - 2; row += 2) for (let col = 1; col < w - 1; col += 3) s += rect(x + col, y + row, 2, .6, (row + col) % 4 ? '#c3a16a' : '#665333');
  s += rect(x, y + 2, 1, h - 4, '#dfbd7f', .75) + rect(x + w - 3, y + 2, 2, h - 4, '#56472f', .6) + rect(x + 2, y + h - 3, w - 4, 1, '#644f31', .5);
  s += rect(x, y, w, 2, '#ceb17a') + rect(x + 1, y + .5, w - 2, .5, '#ead19c') + rect(x + 2, y + h - 1, w - 4, 1, '#5d5137');
  return s;
}
export function vessel(x: number, y: number, w = 13, h = 15, key = 'pot', lid = false) {
  let s = shadow(x - 1, y + h - 2, w + 3);
  const d = `M${x + 3} ${y}h${w - 6}v2h2v3h1v${h - 8}h-1v2H${x + 2}v-2h-2V${y + 5}h1v-3h2z`;
  s += material(d, [x, y, w, h], 'clay', key, Math.floor(x + y), .8) + rect(x + 3, y + 4, 1, h - 8, '#d2a36f', .7) + rect(x + w - 3, y + 5, 1, h - 9, '#664a35', .7);
  s += rect(x + 3, y + 1, w - 6, 2, '#4e4d36') + rect(x + 2, y, w - 4, 1, '#d0a774');
  if (lid) s += plank(x + 1, y - 1, w - 2, 2, key + '-lid', 'bamboo') + rect(x + w / 2 - 1, y - 3, 2, 2, '#c5ad77');
  return s;
}
export function stone(x: number, y: number, w = 22, h = 10, key = 'stone') {
  const d = `M${x + 4} ${y}h${w - 9}v2h4v3h2v${h - 5}H${x}v-${h - 4}h2v-2h2z`;
  return shadow(x, y + h - 1, w + 2) + material(d, [x, y, w, h], 'stone', key, 43, .9) + path(`M${x + 4} ${y}h${w - 9}v1H${x + 5}v1h-3v2h-1v-2h3z`, '#b2b48b', .75) + rect(x + w - 8, y + h - 3, 6, 2, '#547547') + rect(x + w - 7, y + h - 4, 3, 1, '#8a9d5d');
}
export function leafCup(x: number, y: number, key = 'leaf-cup') {
  const d = `M${x} ${y}h19v3h-2v5h-3v2h-9v-2h-3v-4h-2z`;
  return shadow(x, y + 10, 20) + material(d, [x, y, 19, 10], 'leaf', key, 81, .9) + rect(x + 3, y + 1, 13, 2, '#93b59a') + rect(x + 5, y + 2, 9, 1, '#477c6e') + path(`M${x + 2} ${y}l7 8h1l7-8h-1l-6 6-6-6z`, '#b8c58c', .6);
}

// Five-by-seven hand-cut lettering, independent of platform fonts or glyph fallback.
const font: Record<string, string> = {
  A:'01110/10001/10001/11111/10001/10001/10001', B:'11110/10001/10001/11110/10001/10001/11110', C:'01111/10000/10000/10000/10000/10000/01111', D:'11110/10001/10001/10001/10001/10001/11110', E:'11111/10000/10000/11110/10000/10000/11111', F:'11111/10000/10000/11110/10000/10000/10000', G:'01111/10000/10000/10111/10001/10001/01110', H:'10001/10001/10001/11111/10001/10001/10001', I:'111/010/010/010/010/010/111', J:'00111/00010/00010/00010/00010/10010/01100', K:'10001/10010/10100/11000/10100/10010/10001', L:'10000/10000/10000/10000/10000/10000/11111', M:'10001/11011/10101/10101/10001/10001/10001', N:'10001/11001/11001/10101/10011/10011/10001', O:'01110/10001/10001/10001/10001/10001/01110', P:'11110/10001/10001/11110/10000/10000/10000', Q:'01110/10001/10001/10001/10101/10010/01101', R:'11110/10001/10001/11110/10100/10010/10001', S:'01111/10000/10000/01110/00001/00001/11110', T:'11111/00100/00100/00100/00100/00100/00100', U:'10001/10001/10001/10001/10001/10001/01110', V:'10001/10001/10001/10001/10001/01010/00100', W:'10001/10001/10001/10101/10101/11011/10001', X:'10001/10001/01010/00100/01010/10001/10001', Y:'10001/10001/01010/00100/00100/00100/00100', Z:'11111/00001/00010/00100/01000/10000/11111',
  '0':'01110/10001/10011/10101/11001/10001/01110', '1':'010/110/010/010/010/010/111', '2':'01110/10001/00001/00010/00100/01000/11111', '3':'11110/00001/00001/01110/00001/00001/11110', '4':'10010/10010/10010/11111/00010/00010/00010', '5':'11111/10000/10000/11110/00001/00001/11110', '6':'01110/10000/10000/11110/10001/10001/01110', '7':'11111/00001/00010/00100/01000/01000/01000', '8':'01110/10001/10001/01110/10001/10001/01110', '9':'01110/10001/10001/01111/00001/00001/01110', '/':'00001/00001/00010/00100/01000/10000/10000', '-':'00000/00000/00000/11111/00000/00000/00000', '<':'00010/00100/01000/10000/01000/00100/00010', '>':'01000/00100/00010/00001/00010/00100/01000', ' ':'000/000/000/000/000/000/000', '.':'0/0/0/0/0/1/1',
};
export function lettering(text: string, cx: number, top: number, maxWidth: number, color = '#edddb1', maxScale = 1) {
  const glyphs = [...text.toUpperCase()].map(c => (font[c] ?? font[' ']).split('/'));
  const units = glyphs.reduce((n, rows) => n + rows[0].length + 1, -1), scale = Math.min(maxScale, maxWidth / Math.max(1, units));
  let x = cx - units * scale / 2, pixels = '';
  for (const rows of glyphs) {
    rows.forEach((row, y) => [...row].forEach((bit, col) => { if (bit === '1') pixels += `M${x + col * scale} ${top + y * scale}h${scale}v${scale}h-${scale}z`; }));
    x += (rows[0].length + 1) * scale;
  }
  return '<g transform="translate(.35 .45)">' + path(pixels, '#293b2d', .65) + '</g>' + path(pixels, color);
}

export function signboard(cx: number, top: number, lines: readonly string[], key: string, width = 80, pole = true, arrow?: 'left' | 'right' | 'up') {
  const h = 6 + lines.length * 10;
  let s = pole ? bamboo(cx - 2, top + h - 2, 15, key + '-post') + lash(cx - 3, top + h + 1, 6) + shadow(cx - 5, top + h + 12, 12) : '';
  s += plank(cx - width / 2, top, width, h, key);
  // Darkened inset grain keeps the shallow ivory-filled carving clear.
  s += rect(cx - width / 2 + 4, top + 3, width - 8, h - 6, '#293d30', .4);
  lines.forEach((text, i) => { s += lettering(text, cx, top + 5 + i * 10, width - 12, '#eddbab', .9); });
  if (arrow) {
    const x = cx, y = top + h + 3;
    s += path(arrow === 'left' ? `M${x + 7} ${y}h-12v-3l-5 5 5 5v-3h12z` : arrow === 'right' ? `M${x - 7} ${y}h12v-3l5 5-5 5v-3h-12z` : `M${x - 1} ${y + 7}h3v-8h3l-5-5-5 5h4z`, '#d9bd7e');
  }
  return s;
}
export function bellBody() {
  const d = 'M8 2h7v3h3v11h3v3H2v-3h3V5h3z';
  return material(d, [2, 2, 19, 18], 'brass', 'waybell', 91, 1.5) + path('M8 5h2v11h-3V7h1z', '#e8c98a', .8) + rect(3, 17, 17, 1, '#e9ca89') + rect(6, 7, 12, .5, '#66704b') + rect(6, 12, 12, .5, '#d4b675') + rect(10, 1, 3, 4, '#d1b27a') + rect(10, 19, 3, 3, '#715b3c') + rect(7, 14, 3, 2, '#526f53') + rect(14, 8, 2, 2, '#5c7457');
}
