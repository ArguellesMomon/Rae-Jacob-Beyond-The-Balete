import { memo, useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import type { Point } from '../game/model';
import Svg, { Path, Rect } from 'react-native-svg';
import { PixelFrame } from './PixelFrame';
import { JOYSTICK_MARKS } from '../art/interfaceArt';

export const Joystick=memo(function Joystick({ onMove, compact = false }: { onMove: (point: Point) => void; compact?: boolean }) {
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [origin, setOrigin] = useState({ x: 66, y: 66 });
  const callback = useRef(onMove); callback.current = onMove;
  const responder = useMemo(() => {
    const reset = () => { callback.current({ x: 0, y: 0 }); setDrag({ x: 0, y: 0, active: false }); };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: event => {
        const { locationX, locationY } = event.nativeEvent;
        setOrigin({ x: Math.max(48, Math.min(84, locationX)), y: Math.max(48, Math.min(84, locationY)) });
        setDrag({ x: 0, y: 0, active: true }); callback.current({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gesture) => {
        const length = Math.hypot(gesture.dx, gesture.dy), ratio = length > 38 ? 38 / length : 1;
        const x = gesture.dx * ratio, y = gesture.dy * ratio;
        setDrag({ x, y, active: true }); callback.current({ x: x / 38, y: y / 38 });
      },
      onPanResponderRelease: reset,
      onPanResponderTerminate: reset,
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
    });
  }, []);
  return <View style={[styles.wrap, compact && { transform: [{ scale: 0.87 }], transformOrigin: 'bottom left' }]}>
    <View {...responder.panHandlers} style={styles.area} accessibilityLabel="Movement joystick. Drag to walk; drag farther to jog." accessibilityRole="adjustable">
      <View pointerEvents="none" style={[styles.ring, { left: origin.x - 54, top: origin.y - 54, borderColor: drag.active ? '#eadcb388' : '#f5e9ca55' }]}>
        <PixelFrame fill="#253e2a55" border={drag.active ? '#eadcb399' : '#f5e9ca66'} light="#fff1cb" cut={9} />
        <Svg pointerEvents="none" width={108} height={108} viewBox="0 0 108 108" style={StyleSheet.absoluteFill}><Path d={JOYSTICK_MARKS} fill="#fff1cb99" /><Rect x={30} y={52} width={48} height={3} fill="#efe0b522" /><Rect x={52} y={30} width={3} height={48} fill="#efe0b522" /></Svg>
        <View style={[styles.knob, { transform: [{ translateX: Math.round(drag.x) }, { translateY: Math.round(drag.y) }] }]}><PixelFrame fill="#f7ecc8d9" border="#fff5d5c0" light="#ffffff" cut={6} /><View style={styles.dot} /></View>
      </View>
    </View>
    <Text style={styles.caption}>{drag.active ? 'A LITTLE FURTHER TO JOG' : 'WANDER A LITTLE'}</Text>
  </View>;
});
const styles = StyleSheet.create({
  wrap: { width: 150, alignItems: 'center' },
  area: { width: 132, height: 132 },
  ring: { position: 'absolute', width: 108, height: 108, alignItems: 'center', justifyContent: 'center' },
  knob: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, backgroundColor: '#5f704e99', borderWidth: 2, borderColor: '#8d9970' },
  mark: { position: 'absolute', color: '#fff1cb99', fontSize: 21, lineHeight: 20 },
  caption: { color: '#fcf0d1c0', fontSize: 8, letterSpacing: 1.3, fontFamily: 'DMSans_600SemiBold', marginTop: 1 },
});
