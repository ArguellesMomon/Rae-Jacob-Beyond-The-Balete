import { pixelRect } from './pixelArt.ts';

// Original 3-by-5 capitals keep small world signs crisp at the game's pixel scale.
const GLYPHS: Record<string, string> = {
  A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110',
  E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101',
  I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
  M: '101111111101101', N: '101111111111101', O: '010101101101010', P: '110101110100100',
  Q: '010101101111011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
  U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
  Y: '101101010010010', Z: '111001010100111',
  '0': '111101101101111', '1': '010110010010111', '2': '110001010100111', '3': '110001010001110',
  '/': '001001010100100', '-': '000000111000000', ' ': '000000000000000',
};
export function pixelLettering(text: string, centerX: number, top: number, color = '#f1dfad', scale = 1) {
  const label = text.toUpperCase(), left = Math.round(centerX - (label.length * 4 - 1) * scale / 2);
  let result = '';
  for (let i = 0; i < label.length; i++) {
    const glyph = GLYPHS[label[i]] ?? GLYPHS[' '];
    for (let bit = 0; bit < 15; bit++) if (glyph[bit] === '1') result += pixelRect(left + (i * 4 + bit % 3) * scale, top + Math.floor(bit / 3) * scale, scale, scale, color);
  }
  return result;
}
