import { characterFromSpeaker } from '../game/characters';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { DialogueLine, ReplyTone } from '../game/model';
import { REPLY_TONES, STORY_CHOICES } from '../game/storyChoices';
import { CharacterPortrait } from './CharacterSprite';
import { PixelFrame } from './PixelFrame';
import { Icon } from './Icons';

export function StoryReplyMenu({ line, clock, largeText, onChoose, onHistory, onPause }: { line: DialogueLine; clock: number; largeText: boolean; onChoose: (tone: ReplyTone) => void; onHistory: () => void; onPause: () => void }) {
  if (!line.choice) return null;
  const choice = STORY_CHOICES[line.choice];
  return <View>
    <View style={s.heading}><View style={{ flex: 1 }}><Text style={s.eyebrow}>A MOMENT BETWEEN FRIENDS</Text><Text style={s.title}>Rae's reply</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Pause this conversation" onPress={onPause} style={s.icon}><Icon name="pause" color="#536b43" size={21} /></Pressable></View>
    <View style={s.speech}><CharacterPortrait who={characterFromSpeaker(line.speaker) ?? 'tala'} size={73} emotion={line.emotion} clock={clock} speaking /><View style={{ flex: 1 }}><Text style={s.name}>{line.speaker.toUpperCase()}</Text>{line.beat && <Text style={s.beat}>{line.beat}</Text>}<Text style={[s.words, largeText && { fontSize: 18, lineHeight: 26 }]}>{line.text}</Text></View></View>
    <Text accessibilityRole="header" style={s.prompt}>{choice.prompt}</Text>
    {REPLY_TONES.map((tone, index) => <Pressable key={tone} accessibilityRole="button" accessibilityLabel={`Rae: ${choice.replies[tone].label}`} onPress={() => onChoose(tone)} style={({ pressed }) => [s.reply, pressed && { opacity: .75 }]}>
      <PixelFrame fill="#e9e6cb" border="#b7ba90" light="#fff4d5" />
      <Text style={s.tone}>{Platform.OS === 'web' ? `${index + 1} · ` : ''}{tone === 'playful' ? 'WITH A GRIN' : tone === 'cautious' ? 'CAREFULLY' : 'FROM THE HEART'}</Text>
      <Text style={[s.answer, largeText && { fontSize: 17, lineHeight: 24 }]}>{choice.replies[tone].label}</Text>
    </Pressable>)}
    <Pressable accessibilityRole="button" onPress={onHistory} style={s.history}><Text style={s.historyText}>Read the conversation again</Text></Pressable>
  </View>;
}
const s = StyleSheet.create({ heading: { flexDirection: 'row', alignItems: 'center', gap: 8 }, eyebrow: { fontFamily: 'DMSans_700Bold', fontSize: 8, letterSpacing: 1.3, color: '#899271' }, title: { fontFamily: 'PixelifySans_400Regular', fontSize: 32, color: '#405b3e', marginTop: 5 }, icon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, speech: { flexDirection: 'row', gap: 14, marginVertical: 18, alignItems: 'flex-start' }, name: { fontFamily: 'DMSans_700Bold', fontSize: 9, color: '#71815c', marginBottom: 7, letterSpacing: 1 }, words: { fontFamily: 'DMSans_400Regular', fontSize: 15, lineHeight: 23, color: '#40513c' }, beat: { fontFamily: 'DMSans_400Regular', fontSize: 11, lineHeight: 17, fontStyle: 'italic', color: '#85886a', marginBottom: 6 }, prompt: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, lineHeight: 19, color: '#6d7f55', marginBottom: 13 }, reply: { minHeight: 68, padding: 14, marginBottom: 10 }, tone: { fontFamily: 'DMSans_700Bold', fontSize: 7, letterSpacing: 1.1, color: '#929474', marginBottom: 5 }, answer: { fontFamily: 'DMSans_600SemiBold', fontSize: 14, lineHeight: 21, color: '#455d3e' }, history: { minHeight: 44, justifyContent: 'center', alignItems: 'center' }, historyText: { fontFamily: 'DMSans_600SemiBold', fontSize: 11, color: '#7b8b60' } });
