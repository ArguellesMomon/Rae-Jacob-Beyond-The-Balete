import { memo } from 'react';
import { G, Rect, SvgXml } from 'react-native-svg';
import { residentSpriteSvg } from '../art/worldDetails';
import { duwendePortraitSvg } from '../art/duwendeArt';
import { RESIDENTS } from '../game/residents';
import type { DialogueLine, ResidentId } from '../game/model';

export const ResidentSprite = memo(function ResidentSprite({ id, clock, line, celebrating = false }: { id: ResidentId; clock: number; line?: DialogueLine; celebrating?: boolean }) {
  const person = RESIDENTS[id];
  return <G transform={`translate(${person.x} ${person.y - 8})`}><Rect x={-6} y={-1} width={12} height={2} fill="#183b35" opacity={.35} /><G transform="translate(-9 -22)"><SvgXml xml={residentSpriteSvg(id, clock, line?.speaker === person.name, celebrating)} width={18} height={22} /></G></G>;
});
export function ResidentPortrait({ id, clock, size = 90, speaking = false }: { id: ResidentId; clock: number; size?: number; speaking?: boolean }) {
  return <SvgXml xml={duwendePortraitSvg(id, 'warm', (clock + id.length) % 5.7 < .15, speaking && Math.floor(clock * 5) % 3 === 0 ? 1 : 0)} width={size * .8} height={size} />;
}
