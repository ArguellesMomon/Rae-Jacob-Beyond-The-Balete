import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { LISTENING_SEED_SVG } from '../art/worldDetails';
import type { Progress } from '../game/model';
import { Icon } from './Icons';
import { PixelFrame } from './PixelFrame';

export function PocketContents({ progress, onInspect }: { progress: Progress; onInspect: () => void }) {
  return <View style={s.card}><Text style={s.heading}>IN MY POCKET</Text><Text style={s.text}>Spare kite string · kept for another adventure{progress.bellRecovered && !progress.bellReturned ? '\nRecovered waybell · return to Minda' : ''}</Text>
    {progress.ubanGiftReceived ? <Pressable accessibilityRole="button" accessibilityLabel="Examine Mang Uban's Listening Seed" onPress={onInspect} style={s.item}><PixelFrame fill="#e0e4c7" border="#a3ae7d" /><SvgXml xml={LISTENING_SEED_SVG} width={34} height={31} /><View style={{ flex: 1 }}><Text style={s.name}>Listening Seed</Text><Text style={s.hint}>Mang Uban's gift · examine</Text></View><Icon name="arrow" color="#647b51" size={17} /></Pressable> : progress.bellRung && <Text style={s.hint}>A quiet thank-you is waiting in Mang Uban's grove. Visit when you like.</Text>}
  </View>;
}
const s = StyleSheet.create({ card: { marginTop: 15, padding: 15, backgroundColor: '#e7e8d0', gap: 8 }, heading: { fontFamily: 'DMSans_700Bold', fontSize: 8, letterSpacing: 1, color: '#7c8862' }, text: { fontFamily: 'DMSans_400Regular', fontSize: 12, lineHeight: 20, color: '#667550' }, item: { flexDirection: 'row', minHeight: 59, padding: 10, gap: 12, alignItems: 'center' }, name: { fontFamily: 'PixelifySans_400Regular', fontSize: 20, color: '#435e42' }, hint: { fontFamily: 'DMSans_400Regular', fontSize: 11, lineHeight: 17, color: '#7c8862' } });
