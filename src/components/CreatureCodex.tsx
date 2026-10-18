import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { creatureEncounters, creatureMemory, encounteredCreatures } from '../game/creatureCodex';
import type { CreatureId } from '../game/creatureCodex';
import type { Progress } from '../game/model';
import { CharacterPortrait } from './CharacterSprite';

export function CreatureCodex({ progress, clock }: { progress: Progress; clock: number }) {
  const [selected, setSelected] = useState<CreatureId | null>(null), [linkIssue, setLinkIssue] = useState(false);
  const known = encounteredCreatures(progress), entry = known.find(e => e.id === selected) ?? known[0];
  return <View style={s.page}>
    <Text style={s.intro}>Folklore has many tellers. These pages grow as Rae meets the beings of Silong. Read the recorded traditions alongside what happened on our journey.</Text>
    {!entry ? <View style={s.memory}><Text style={s.title}>A blank page, for now</Text><Text style={s.body}>Meet someone beyond the roots to begin the creature codex. New encounters will appear here automatically.</Text></View> : <>
      <View style={s.tabs}>{known.map(e => <Pressable key={e.id} accessibilityRole="button" accessibilityLabel={`Codex: ${e.name}`} accessibilityState={{ selected: e.id === entry.id }} onPress={() => { setSelected(e.id); setLinkIssue(false); }} style={[s.tab, e.id === entry.id && s.active]}><CharacterPortrait who={e.portrait} size={48} clock={clock} /><Text style={s.tabText}>{e.name}</Text></Pressable>)}</View>
      <View style={s.profile}><CharacterPortrait who={entry.portrait} size={104} clock={clock} emotion="warm" /><View style={s.profileText}><Text style={s.eyebrow}>CREATURES ENCOUNTERED</Text><Text accessibilityRole="header" style={s.title}>{entry.name}</Text><Text style={s.subtitle}>{entry.subtitle}</Text></View></View>
      <Text style={s.met}>Met on our journey: {creatureEncounters(entry.id, progress).join(', ')}</Text>
      <View style={s.memory}><Text style={s.eyebrow}>RAE’S FIELD NOTE · OUR JOURNEY</Text><Text style={s.body}>{creatureMemory(entry.id, progress)}</Text></View>
      {[
        ['IN THE RECORDED TRADITIONS', entry.tradition], ['POWERS & ABILITIES IN THE ACCOUNTS', entry.powers],
        ['HABITS, PLACES & CUSTOMS', entry.ways], ['DIFFERENT TELLERS, DIFFERENT DETAILS', entry.variation], ['IN SILONG · OUR ORIGINAL STORY', entry.inSilong],
      ].map(([title, body]) => <View key={title} style={s.section}><Text accessibilityRole="header" style={s.eyebrow}>{title}</Text><Text style={s.body}>{body}</Text></View>)}
      <View style={s.section}><Text style={s.eyebrow}>FOLLOW THE STORY ROOTS</Text><Text style={s.fine}>The summary works offline. These references open in your browser.</Text>
        {entry.sources.map(source => <Pressable key={source.url} accessibilityRole="link" accessibilityLabel={`Read source: ${source.title}`} onPress={() => { setLinkIssue(false); void Linking.openURL(source.url).catch(() => setLinkIssue(true)); }} style={s.source}><Text style={s.sourceText}>{source.title} ↗</Text></Pressable>)}
        {linkIssue && <Text accessibilityLiveRegion="polite" style={s.fine}>The reference could not open. You can keep reading the codex here.</Text>}
      </View>
    </>}
  </View>;
}
const s = StyleSheet.create({
  page: { marginTop: 16, gap: 14 }, intro: { fontFamily: 'DMSans_400Regular', fontSize: 12, lineHeight: 20, color: '#6e7957' },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, tab: { minWidth: 78, minHeight: 76, alignItems: 'center', padding: 7, borderWidth: 2, borderColor: '#cfc6a1', backgroundColor: '#eee8cd' }, active: { borderColor: '#668056', backgroundColor: '#dce2c3' },
  tabText: { fontFamily: 'PixelifySans_400Regular', fontSize: 15, color: '#3f593b', marginTop: 4 }, profile: { flexDirection: 'row', alignItems: 'center', gap: 14 }, profileText: { flex: 1 },
  title: { fontFamily: 'PixelifySans_400Regular', fontSize: 32, color: '#395239', marginVertical: 4 }, subtitle: { fontFamily: 'DMSans_500Medium', fontSize: 12, lineHeight: 19, color: '#78815d' },
  eyebrow: { fontFamily: 'DMSans_700Bold', fontSize: 9, lineHeight: 15, color: '#7b8158', letterSpacing: .8 }, body: { fontFamily: 'DMSans_400Regular', fontSize: 13, lineHeight: 22, color: '#43553a', marginTop: 6 },
  memory: { padding: 14, borderLeftWidth: 3, borderColor: '#8c9b68', backgroundColor: '#e4e5c9' }, met: { fontFamily: 'DMSans_600SemiBold', fontSize: 11, lineHeight: 19, color: '#657750' }, section: { marginTop: 7 },
  fine: { fontFamily: 'DMSans_400Regular', fontSize: 11, lineHeight: 18, color: '#8b8b6b', marginTop: 6 }, source: { minHeight: 44, justifyContent: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#d6d0b2' }, sourceText: { fontFamily: 'DMSans_500Medium', fontSize: 11, lineHeight: 18, color: '#59734b' },
});
