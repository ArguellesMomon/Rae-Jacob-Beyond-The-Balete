import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { CHARACTERS, FOLKLORE_SOURCES, knownCharacters, relationshipNote } from '../game/characters';
import type { CharacterId, Progress } from '../game/model';
import { CharacterPortrait } from './CharacterSprite';
import { Icon } from './Icons';
import { RESIDENTS, RESIDENT_IDS } from '../game/residents';
import { ResidentPortrait } from './ResidentSprite';

export function CharacterJournal({ progress, clock }: { progress: Progress; clock: number }) {
  const [selected, setSelected] = useState<CharacterId>('rae');
  const [linkIssue, setLinkIssue] = useState(false);
  const known = knownCharacters(progress), person = CHARACTERS[selected];
  return <View style={{ marginTop: 16 }}>
    <Text style={s.eyebrow}>PEOPLE, BEFORE THE STORIES ABOUT THEM</Text>
    <View style={s.tabs}>{known.map(id => <Pressable key={id} accessibilityRole="button" accessibilityLabel={`Read about ${CHARACTERS[id].name}`} accessibilityState={{ selected: selected === id }} onPress={() => setSelected(id)} style={[s.tab, selected === id && { backgroundColor: '#dfe5ca', borderColor: '#8b9b71' }]}><CharacterPortrait who={id} size={56} clock={clock} /><Text style={s.tabText}>{id === 'rae' ? 'Rae' : id === 'lola' ? 'Lola' : id === 'uban' ? 'Uban' : CHARACTERS[id].name}</Text></Pressable>)}</View>
    <View style={s.profile}><CharacterPortrait who={selected} size={120} clock={clock} emotion={selected === 'uban' ? 'wry' : 'warm'} /><View style={{ flex: 1 }}><Text style={s.eyebrow}>{person.role}</Text><Text style={s.name}>{person.name}</Text><Text style={s.tagline}>{person.title}</Text></View></View>
    <Text style={s.body}>{person.bio}</Text><Text style={s.detail}>{person.detail}</Text>
    <View style={s.memory}><Icon name="leaf" size={20} color="#718255" /><Text style={[s.body, { flex: 1, marginTop: 0 }]}>{relationshipNote(selected, progress)}</Text></View>
    <Text style={[s.eyebrow, { marginTop: 22 }]}>NEIGHBORS WE HAVE MET</Text>
    {RESIDENT_IDS.filter(id => (progress.residentChats[id] ?? 0) > 0).map(id => <View key={id} style={s.profile}><ResidentPortrait id={id} clock={clock} size={66} /><View style={{ flex: 1 }}><Text style={s.eyebrow}>{RESIDENTS[id].role}</Text><Text style={[s.name, { fontSize: 25 }]}>{RESIDENTS[id].name}</Text><Text style={s.detail}>{RESIDENTS[id].bio}</Text></View></View>)}
    {!RESIDENT_IDS.some(id => (progress.residentChats[id] ?? 0) > 0) && <Text style={s.detail}>Someone may have a moment for a conversation beside the lamps, seed trays or waterworks.</Text>}
    <Text style={[s.eyebrow, { marginTop: 22 }]}>STORY ROOTS · TRADITION & SILONG</Text><Text style={s.body}>{person.roots}</Text>
    <Text style={s.detail}>Philippine folklore holds many voices. These characters are an original story inspired by them; no single village stands for every community. Tala is this story’s young duwende mapmaker.</Text>
    <Text style={[s.eyebrow, { marginTop: 17 }]}>READ THE REFERENCES</Text>
    {FOLKLORE_SOURCES.map(source => <Pressable key={source.url} accessibilityRole="link" onPress={() => { setLinkIssue(false); void Linking.openURL(source.url).catch(() => setLinkIssue(true)); }} style={s.source}><Text style={s.sourceText}>{source.title}</Text><Icon name="arrow" size={13} color="#7d895f" /></Pressable>)}
    {linkIssue && <Text style={s.detail}>The reference could not open right now. You can keep reading here.</Text>}
  </View>;
}
const s = StyleSheet.create({ eyebrow: { fontFamily: 'DMSans_700Bold', fontSize: 8, lineHeight: 13, color: '#8b906d', letterSpacing: 1 }, tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginVertical: 15 }, tab: { alignItems: 'center', paddingHorizontal: 7, paddingVertical: 6, borderWidth: 1, borderColor: '#d2d1b4', borderRadius: 5, minWidth: 59 }, tabText: { fontFamily: 'DMSans_600SemiBold', fontSize: 10, marginTop: 4, color: '#647451' }, profile: { flexDirection: 'row', gap: 18, alignItems: 'center', marginTop: 9 }, name: { fontFamily: 'PixelifySans_400Regular', fontSize: 33, color: '#3d553b', marginVertical: 5 }, tagline: { fontFamily: 'DMSans_500Medium', fontSize: 12, lineHeight: 18, color: '#7e8561' }, body: { fontFamily: 'DMSans_400Regular', fontSize: 13, lineHeight: 21, color: '#48583e', marginTop: 13 }, detail: { fontFamily: 'DMSans_400Regular', fontSize: 11, lineHeight: 18, color: '#929276', marginTop: 10 }, memory: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 13, borderRadius: 7, backgroundColor: '#e7e7cb', marginTop: 17 }, source: { flexDirection: 'row', alignItems: 'center', minHeight: 44, paddingVertical: 8, gap: 10, borderBottomWidth: 1, borderBottomColor: '#dbdac1' }, sourceText: { flex: 1, fontFamily: 'DMSans_500Medium', fontSize: 11, lineHeight: 17, color: '#61764d' } });
