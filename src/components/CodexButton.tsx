import { Pressable, StyleSheet, Text } from 'react-native';
import { PixelFrame } from './PixelFrame';
import { Icon } from './Icons';

export function CodexButton({ onOpen }: { onOpen: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel="Open creature codex" accessibilityHint="Read about the creatures Rae has encountered" onPress={onOpen} style={({ pressed }) => [s.button, pressed && { opacity: .7 }]}>
    <PixelFrame fill="#263e30e8" border="#c5b77e" light="#e0d3a4" />
    <Icon name="codex" size={23} color="#e8ce91" /><Text style={s.caption}>CODEX</Text>
  </Pressable>;
}
const s = StyleSheet.create({ button: { width: 47, height: 47, alignItems: 'center', justifyContent: 'center', gap: 1 }, caption: { fontFamily: 'PixelifySans_400Regular', fontSize: 8, color: '#e8ce91', letterSpacing: .6 } });
