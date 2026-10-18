import { pixelPath as p, pixelRect as r, wrapSvg } from './pixelArt.ts';
import type { MapId, Progress } from '../game/model.ts';
const sizes = { rainroad: [640, 480], hamlet: [640, 480], spring: [640, 480], bamboo: [640, 480], turning: [640, 480], yard: [640, 448], clearing: [576, 448], grove: [480, 512], waterworks: [704, 480] };
const cache = new Map<string, string>();
export function atmosphereSvg(map: MapId, progress: Progress, clock: number, layer: 'ground' | 'air' = 'air') {
  const time = Math.floor(clock * 3) / 3, key = `${map}:${layer}:${time % 120}:${progress.bellRung}:${progress.flowDiverted}`;
  const old = cache.get(key); if (old) return old;
  let s = '';
  if (layer === 'ground') {
    if (map === 'yard') {
      s += p('M75 207h83l110 103h-42z M196 212h34l86 86h-19z M417 166h19l75 78h-33z', '#ffdfa1', .055);
      for (let i = 0; i < 16; i++) { const x = 60 + i * 37 % 530 + Math.round(Math.sin(time * .14 + i) * 3), y = 216 + i * 31 % 152;
        s += p(`M${x} ${y}h9v3h7v5h-4v4h-10v-3h-5v-5h3z`, '#3f633e', .075);
      }
    } else if (map === 'clearing') {
      for (const [x, y] of [[80, 241], [130, 253], [181, 246], [232, 223], [282, 215], [332, 229], [386, 213], [92, 325], [262, 112], [447, 262]]) {
        const glow = progress.bellRung ? .075 : .05 + Math.sin(time * 1.1 + x) * .012;
        s += p(`M${x - 16} ${y + 4}h32v6h8v12h-8v5h-32v-5h-8v-12h8z`, '#edcc83', glow) + r(x - 9, y + 9, 18, 9, '#fbe1a5', .035);
      }
    } else if (map === 'grove') {
      s += p('M140 280h59v20h-18v38h-20v58h-12v-71h-9z M282 276h30v25h19v44h-21v-31h-28z', '#153a3b', .13);
      s += p('M174 301h8v44h-8z M266 300h9v42h-9z', '#b4c5a0', .035);
    } else {
      for (const [x, y, w] of [[242, 216, 22], [373, 304, 27], [363, 382, 36], [89, 407, 49], [457, 376, 25]]) s += p(`M${x} ${y}h${w}v3h5v5h-8v2h-${w - 3}z`, '#456e6c', progress.bellRung ? .16 : .27);
    }
  } else if (map === 'yard') {
    for (let i = 0; i < 8; i++) s += r(100 + (i * 59 + Math.floor(time * 1.2)) % 370, 210 + (i * 29 + Math.floor(time * .8)) % 100, 1, 1, '#fff3ce', .2);
  } else if (map === 'grove') {
    for (let i = 0; i < 3; i++) { const x = Math.round(12 + Math.sin(time * .11 + i) * 14), y = 285 + i * 75;
      s += p(`M${x} ${y}h70v-3h90v3h68v4h-19v3h-147v-3H${x}z`, '#bbcfbd', .025);
    }
    const lx = Math.floor(285 + Math.sin(time * .25) * 18), ly = Math.floor(90 + time * 5 % 220);
    s += r(lx, ly, 3, 1, '#a1ad77', .4) + r(lx + 1, ly + 1, 1, 2, '#829b70', .4);
  } else if (map === 'waterworks') {
    for (let i = 0; i < 8; i++) {
      const x = progress.flowDiverted ? 213 + i * 3 % 19 : 418 + i * 7 % 27, y = Math.round(321 + i * 4 + time * 4 % 7);
      s += r(x, y, 3 + i % 3, 1, '#c2d7c6', .25);
    }
    for (let i = 0; i < 6; i++) s += r(251 + i * 25 + Math.floor(time * 5) % 18, 454 + i % 2 * 4, 4, 1, '#d3ddc6', .2);
  }
  const [w, h] = sizes[map], result = wrapSvg(s, w, h);
  if (cache.size > 260) cache.clear(); cache.set(key, result); return result;
}

export function recoverySvg(progress: Progress, clock = 1) {
  if (!progress.waterRestored) return wrapSvg('', 576, 448);
  let s = r(114, 182, 7, 2, '#dfc798') + r(123, 184, 6, 2, '#bd9770');
  if (progress.bellRung) {
    // New open shutters and neighbors at home, outside all walkable approaches.
    for (const [x, y] of [[87, 142], [160, 122], [231, 154]]) {
      s += r(x - 3, y - 1, 2, 10, '#9e8d68') + r(x + 9, y - 1, 2, 10, '#9e8d68') + r(x, y, 8, 8, '#f1d49a');
      s += r(x + 2, y + 3, 4, 4, '#b48660') + r(x + 1, y + 2, 6, 2, '#5a5840') + r(x, y + 7, 8, 2, '#78895d');
    }
    s += r(115, 166, 8, 6, '#ab8759') + r(116, 165, 6, 1, '#dfbf88');
    const phase = (clock % 18) / 18;
    if (phase < .42) {
      const t = phase / .42, x = Math.round(148 - t * 30), y = Math.round(183 - t * 13), bob = Math.floor(t * 18) % 2;
      s += r(x, y + 2, 2, 2, '#7b6142') + r(x + 4, y + 2 - bob, 2, 2, '#7b6142') + r(x - 1, y - 5, 8, 7, '#8d9a6c') + r(x, y - 11, 6, 6, '#bf8d60') + r(x - 1, y - 12, 8, 3, '#4f513d') + r(x - 3, y - 3, 6, 5, '#c0a16e');
    }
    const smoke = Math.floor(clock * 2) % 8;
    s += r(168 + smoke % 3, 105 - smoke, 4, 2, '#c1c7aa', .16);
  }
  return wrapSvg(s, 576, 448);
}
