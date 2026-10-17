export function pixelOutline(w: number, h: number, inset = 0, cut = 4) {
  const a = inset, b = w - inset, c = h - inset, k = Math.min(cut, (b - a) / 4, (c - a) / 4);
  return `M${a + k * 2} ${a}H${b - k * 2}v${k}h${k}v${k}h${k}V${c - k * 2}h-${k}v${k}h-${k}v${k}H${a + k * 2}v-${k}H${a + k}v-${k}H${a}V${a + k * 2}h${k}V${a + k}h${k}z`;
}
export function pixelFrameSvg(w: number, h: number, fill = '#f1e4bd', border = '#7e865b', light = '#fff5d6', cut = 4) {
  const outer = pixelOutline(w, h, 0, cut), inner = pixelOutline(w, h, 2, Math.max(2, cut - 1));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"><path d="${outer} ${inner}" fill="${border}" fill-rule="evenodd"/><path d="${inner}" fill="${fill}"/><path d="M${cut * 2 + 2} 3H${w - cut * 2 - 2}v2H${cut * 2 + 2}z M3 ${cut * 2 + 2}h2v${Math.max(0, h - cut * 4 - 4)}H3z" fill="${light}" opacity=".55"/></svg>`;
}
export const JOYSTICK_MARKS = 'M50 10h8v3h3v3H47v-3h3z M50 98h8v-3h3v-3H47v3h3z M10 50v8h3v3h3V47h-3v3z M98 50v8h-3v3h-3V47h3v3z';
