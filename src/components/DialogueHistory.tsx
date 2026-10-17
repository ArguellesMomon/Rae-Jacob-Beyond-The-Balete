import { memo, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { HistoryEntry, MapId } from '../game/model';
import { searchHistory, HISTORY_LIMIT } from '../game/history';
import { Icon } from './Icons';

export const DialogueHistory = memo(function DialogueHistory({ entries, mapId, onClose, largeText = false }: { entries: HistoryEntry[]; mapId: MapId; onClose: () => void; largeText?: boolean }) {
  const [query, setQuery] = useState(''), [here, setHere] = useState(false);
  const [limit, setLimit] = useState(40);
  useEffect(() => setLimit(40), [query, here]);
  const visible = useMemo(() => searchHistory(entries, query, here ? mapId : undefined).slice().reverse(), [entries, query, here, mapId]);
  return <View><View style={s.header}><View style={{ flex: 1 }}><Text style={s.eyebrow}>WORDS WE KEEP</Text><Text style={s.title}>Conversations</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Return from dialogue history" onPress={onClose} style={s.close}><Icon name="close" size={22} color="#586d48" /></Pressable></View>
    <Text style={s.caption}>Newest first · only words Rae has heard. Up to {HISTORY_LIMIT} recent lines stay with this journey.</Text>
    <TextInput value={query} onChangeText={setQuery} placeholder="Search a name, clue, or word" placeholderTextColor="#96977b" accessibilityLabel="Search dialogue history" autoCorrect={false} style={s.search} />
    <View style={s.filters}>{[false, true].map(value => <Pressable key={String(value)} accessibilityRole="button" accessibilityState={{ selected: here === value }} onPress={() => setHere(value)} style={[s.filter, here === value && { backgroundColor: '#dce4c9' }]}><Text style={s.filterText}>{value ? 'This place' : 'All places'}</Text></Pressable>)}</View>
    {!visible.length && <Text style={s.caption}>{entries.length ? 'No words match this search yet.' : 'Your next conversation will appear here as you read it.'}</Text>}
    {visible.slice(0, limit).map(entry => <View key={entry.seq} style={s.entry}><Text style={s.name}>{entry.speaker === 'Someone?' ? '???' : entry.speaker} <Text style={s.place}>· {entry.mapId === 'bamboo' ? 'Bamboo Verge' : entry.mapId === 'turning' ? 'Turning Paths' : entry.mapId === 'yard' ? 'Home' : entry.mapId === 'grove' ? 'Grove' : entry.mapId === 'waterworks' ? 'Waterworks' : 'Clearing'}</Text></Text>{entry.beat && <Text style={s.beat}>{entry.beat}</Text>}<Text style={[s.words, largeText && { fontSize: 17, lineHeight: 25 }]}>{entry.text}</Text></View>)}
    {visible.length > limit && <Pressable accessibilityRole="button" onPress={() => setLimit(n => n + 40)} style={s.filter}><Text style={s.filterText}>Read 40 earlier lines</Text></Pressable>}
  </View>;
});
const s = StyleSheet.create({ header: { flexDirection: 'row', alignItems: 'center' }, close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, eyebrow: { fontFamily: 'DMSans_700Bold', fontSize: 8, letterSpacing: 1.4, color: '#8a9270' }, title: { fontFamily: 'PixelifySans_400Regular', fontSize: 34, color: '#3d563d' }, caption: { fontFamily: 'DMSans_400Regular', fontSize: 11, lineHeight: 18, color: '#899071', marginVertical: 12 }, search: { minHeight: 46, backgroundColor: '#e8e8ce', borderWidth: 1, borderColor: '#bfc6a1', padding: 12, fontFamily: 'DMSans_400Regular', color: '#465c40', fontSize: 13 }, filters: { flexDirection: 'row', gap: 9, marginVertical: 13 }, filter: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 14, borderWidth: 1, borderColor: '#c0c7a3' }, filterText: { fontFamily: 'DMSans_600SemiBold', fontSize: 11, color: '#64784e' }, entry: { borderBottomWidth: 1, borderBottomColor: '#d9d9bc', paddingVertical: 13 }, name: { fontFamily: 'DMSans_700Bold', fontSize: 11, color: '#4e6746' }, place: { fontFamily: 'DMSans_400Regular', fontSize: 10, color: '#929576' }, beat: { fontFamily: 'DMSans_400Regular', fontSize: 11, fontStyle: 'italic', lineHeight: 17, color: '#949173', marginTop: 8 }, words: { fontFamily: 'DMSans_400Regular', fontSize: 14, lineHeight: 21, color: '#40553c', marginTop: 7 } });
