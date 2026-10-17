import { Pressable, StyleSheet, Text, View } from 'react-native';
import { REPLAY_SCENES } from '../game/replay';
import type { ReplayScene } from '../game/replay';
import { Icon } from './Icons';

export function ReplayMenu({ hasReplay, onResume, onStart, onClose }: { hasReplay: boolean; onResume: () => void; onStart: (scene: ReplayScene) => void; onClose: () => void }) {
  return <View><View style={s.header}><Text style={s.title}>Revisit a scene</Text><Pressable accessibilityRole="button" accessibilityLabel="Close replay choices" onPress={onClose} style={s.close}><Icon name="close" size={22} color="#536b43" /></Pressable></View><Text style={s.body}>Your main journey stays saved. Replay has its own progress and conversations. Choosing a scene starts that replay again.</Text>
    {hasReplay && <Pressable accessibilityRole="button" onPress={onResume} style={[s.row, { backgroundColor: '#dfe7cd' }]}><Text style={s.name}>Continue my replay</Text><Icon name="arrow" size={17} color="#5a764b" /></Pressable>}
    {REPLAY_SCENES.map(scene => <Pressable key={scene.id} accessibilityRole="button" onPress={() => onStart(scene.id)} style={s.row}><View style={{ flex: 1 }}><Text style={s.name}>{scene.title}</Text><Text style={s.detail}>{scene.detail}</Text></View><Icon name="arrow" size={16} color="#839267" /></Pressable>)}
  </View>;
}
const s = StyleSheet.create({ header: { flexDirection: 'row', alignItems: 'center', gap: 12 }, title: { flex: 1, fontFamily: 'PixelifySans_400Regular', fontSize: 31, color: '#405b3e' }, close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, body: { fontFamily: 'DMSans_400Regular', fontSize: 12, lineHeight: 20, color: '#808b66', marginVertical: 15 }, row: { minHeight: 56, borderBottomWidth: 1, borderBottomColor: '#d2d5b8', paddingVertical: 13, paddingHorizontal: 7, flexDirection: 'row', alignItems: 'center', gap: 13 }, name: { fontFamily: 'DMSans_600SemiBold', fontSize: 13, color: '#526b45' }, detail: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: '#8b9373', lineHeight: 17, marginTop: 4 } });
