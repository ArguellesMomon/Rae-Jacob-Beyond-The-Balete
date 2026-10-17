import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CharacterPortrait } from './CharacterSprite';
import { Icon } from './Icons';
import { CHARACTERS, characterFromSpeaker } from '../game/characters';
import type { DialogueLine } from '../game/model';
import { residentFromSpeaker, RESIDENTS } from '../game/residents';
import { ResidentPortrait } from './ResidentSprite';

export function DialoguePanel({ line, index, total, compact, clock, onContinue, onHistory, largeText = false, maxHeight = 300 }: { line: DialogueLine; index: number; total: number; compact: boolean; clock: number; onContinue: () => void; onHistory: () => void; largeText?: boolean; maxHeight?: number }) {
  const who = characterFromSpeaker(line.speaker);
  const resident = residentFromSpeaker(line.speaker);
  return <View style={[s.paper, { maxHeight }, compact && { padding: 13, gap: 13 }]}>
    <View style={[s.portrait, compact && { width: 76, height: 91 }]}>{who ? <CharacterPortrait who={who} emotion={line.emotion} size={compact ? 87 : 105} clock={clock} speaking /> : resident ? <ResidentPortrait id={resident} clock={clock} size={compact ? 83 : 100} speaking /> : <Text style={s.mystery}>?</Text>}</View>
    <View style={s.body}>
      <View style={s.heading}><View style={{ flex: 1 }}><Text style={s.name}>{line.speaker === 'Someone?' ? '???' : line.speaker.toUpperCase()}</Text><Text style={s.role}>{who ? CHARACTERS[who].role : resident ? RESIDENTS[resident].role : 'AN UNSEEN VOICE'}</Text></View><Text style={s.count}>{index + 1} / {total}</Text></View>
      <ScrollView key={`${line.speaker}:${index}:${line.text}`} style={{ maxHeight: Math.max(48, maxHeight - (compact ? 108 : 134)) }} showsVerticalScrollIndicator>
        {line.beat && <Text style={[s.beat, compact && { fontSize: 11, lineHeight: 15 }]}>{line.beat}</Text>}
        <Text style={[s.text, compact && { fontSize: 15, lineHeight: 21 }, largeText && { fontSize: compact ? 18 : 20, lineHeight: compact ? 25 : 29 }]}>{line.text}</Text>
      </ScrollView>
      <View style={[s.continue, { justifyContent: 'space-between' }]}><Pressable accessibilityRole="button" accessibilityLabel="Read dialogue history" onPress={onHistory} style={{ minHeight: 44, minWidth: 72, justifyContent: 'center' }}><Text style={s.continueText}>History</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Continue dialogue" onPress={onContinue} style={{ minHeight: 44, minWidth: 96, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}><Text style={[s.continueText, { fontSize: 13 }]}>Continue</Text><Icon name="arrow" size={14} color="#78825d" /></Pressable></View>
    </View>
  </View>;
}
const s = StyleSheet.create({
  paper: { width: '100%', maxWidth: 840, backgroundColor: '#faf0d8', borderWidth: 3, borderColor: '#b69e6b', borderRadius: 10, padding: 19, flexDirection: 'row', gap: 19, boxShadow: '0px 6px 0px #42513640' },
  portrait: { width: 92, height: 110, borderWidth: 2, borderColor: '#9fa77e', backgroundColor: '#bec39d', borderRadius: 4, overflow: 'hidden', justifyContent: 'flex-end', alignItems: 'center' },
  mystery: { color: '#596e58', fontFamily: 'PixelifySans_400Regular', fontSize: 58, alignSelf: 'center', paddingBottom: 13 },
  body: { flex: 1 }, heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  name: { fontFamily: 'DMSans_700Bold', fontSize: 10, letterSpacing: 1.4, color: '#536846' },
  role: { fontFamily: 'DMSans_500Medium', fontSize: 7, letterSpacing: .8, color: '#8b8a68', marginTop: 3 },
  count: { fontFamily: 'DMSans_500Medium', fontSize: 9, color: '#9c9980' },
  beat: { fontFamily: 'DMSans_400Regular', fontStyle: 'italic', fontSize: 12, lineHeight: 17, color: '#858361', marginBottom: 7 },
  text: { fontFamily: 'DMSans_400Regular', fontSize: 17, lineHeight: 25, color: '#354330' },
  continue: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 8 },
  continueText: { fontFamily: 'DMSans_600SemiBold', fontSize: 9, color: '#78825d' },
});
