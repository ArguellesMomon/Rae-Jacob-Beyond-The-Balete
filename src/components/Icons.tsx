import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

export type IconName = 'leaf' | 'book' | 'pause' | 'arrow' | 'close' | 'sun' | 'hand' | 'kite' | 'check' | 'sound' | 'muted';
export function Icon({ name, size = 22, color = '#f5e9cf' }: { name: IconName; size?: number; color?: string }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <G stroke={color} strokeWidth={1.65} strokeLinecap="round" strokeLinejoin="round">
      {name === 'leaf' && <><Path d="M20 3C8 2 2 8 5 15s15 5 15-12Z" /><Path d="m5 21 10-12M9 16v-5m0 5h5" /></>}
      {name === 'book' && <><Path d="M12 5C9 2 4 3 3 4v15c3-2 6-1 9 1 3-2 6-3 9-1V4c-3-2-6-1-9 1Zm0 0v15" /><Path d="M6 8h3M6 11h3m6-3h3m-3 3h3" /></>}
      {name === 'pause' && <><Rect x={7} y={5} width={3} height={14} rx={1} /><Rect x={14} y={5} width={3} height={14} rx={1} /></>}
      {name === 'arrow' && <Path d="M4 12h15m-6-6 6 6-6 6" />}
      {name === 'close' && <Path d="m6 6 12 12M6 18 18 6" />}
      {name === 'sun' && <><Circle cx={12} cy={12} r={4} /><Path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1" /></>}
      {name === 'hand' && <><Path d="M8 12V5a2 2 0 0 1 4 0v6-2a2 2 0 0 1 4 0v3-1a2 2 0 0 1 4 0v4c0 4-2 7-6 7h-2c-2 0-4-2-5-4l-3-5a2 2 0 0 1 3-2l2 2" /></>}
      {name === 'kite' && <><Path d="m11 2 8 8-8 7-8-7 8-8Zm0 0v15M3 10h16m-8 7c0 4 7 1 5 6" /></>}
      {name === 'check' && <Path d="m5 12 4 4L19 6" />}
      {(name === 'sound' || name === 'muted') && <><Path d="M4 9h4l5-4v14l-5-4H4z" />{name === 'sound' ? <Path d="M16 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14" /> : <Path d="m17 9 5 6m-5 0 5-6" />}</>}
    </G>
  </Svg>;
}
