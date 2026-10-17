import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from './Icons';
import { PixelFrame } from './PixelFrame';
export function JourneyRecap({ text, onClose }: { text: string; onClose: () => void }) {
  const close = useRef(onClose); close.current = onClose;
  useEffect(() => { const timer = setTimeout(() => close.current(), 12000); return () => clearTimeout(timer); }, [text]);
  return <View style={s.card} accessibilityLiveRegion="polite"><PixelFrame fill="#f4ebd1f5" border="#acaa7e" light="#fff7dc" /><View style={{ flex: 1 }}><Text style={s.eyebrow}>LAST TIME, IN MY NOTEBOOK</Text><Text style={s.words}>{text}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Dismiss journey reminder" onPress={onClose} style={s.close}><Icon name="close" size={16} color="#78815c" /></Pressable></View>;
}
const s = StyleSheet.create({ card: { paddingLeft: 15, paddingVertical: 12, paddingRight: 3, flexDirection: 'row', gap: 7, alignItems: 'flex-start' }, eyebrow: { fontFamily: 'DMSans_700Bold', fontSize: 7, letterSpacing: 1.2, color: '#929372', marginBottom: 6 }, words: { fontFamily: 'DMSans_400Regular', fontSize: 12, lineHeight: 18, color: '#586b47' }, close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' } });
