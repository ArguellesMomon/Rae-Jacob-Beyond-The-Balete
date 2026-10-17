import { wrapSvg } from './pixelArt.ts';
import type { flowPresentation } from '../game/flowFeedback.ts';

export function flowSurgeSvg(flow: ReturnType<typeof flowPresentation>) {
  if (!flow.active) return wrapSvg('', 704, 480);
  let s = `<g opacity="${Math.min(1, flow.age * 3) * (1 - flow.t)}"><rect x="${flow.diverted ? 211 : 416}" y="${Math.round(flow.frontY)}" width="${flow.diverted ? 25 : 31}" height="3" fill="#d6e7cd"/>`;
  for (let i = 0; i < 4; i++) s += `<path d="M${flow.diverted ? 217 : 426} ${Math.round(146 + (flow.age * 65 + i * 49) % 198)}h4v3h3v3h-3v3h-4v-3h-3v-3h3z" fill="#b1d5be" opacity=".5"/>`;
  return wrapSvg(s + '</g>', 704, 480);
}
