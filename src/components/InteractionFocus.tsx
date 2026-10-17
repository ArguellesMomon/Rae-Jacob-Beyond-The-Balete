import { G, Path, Rect } from 'react-native-svg';
import type { Point } from '../game/model';

export function InteractionFocus({ point, clock, talk = false }: { point: Point; clock: number; talk?: boolean }) {
  return <G pointerEvents="none" transform={`translate(${Math.round(point.x)} ${Math.round(point.y - 11)})`}>
    <Rect x={-14} y={-13} width={28} height={22} fill="#e5d3a0" opacity={.06} />
    <Path d="M-15-7v-6h6 M9-13h6v6 M15 3v6H9 M-9 9h-6V3" stroke={talk ? '#e8d1a2' : '#faf0ba'} strokeWidth={1} fill="none" />
    <Path d="M-4 13h8v1h-8z" fill="#f6dfa3" opacity={.6 + Math.sin(clock * 3) * .15} />
  </G>;
}
