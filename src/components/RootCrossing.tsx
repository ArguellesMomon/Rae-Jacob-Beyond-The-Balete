import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { G, Image as SvgImage, Rect, SvgXml } from 'react-native-svg';
import { YardBase, YardForeground } from './YardEnvironment';
import { ROOT_DESCENT_IMAGE } from './ClearingEnvironment';
import { characterSpriteSvg } from '../art/characterArt';
import { crossingFrame } from '../game/crossing';
import { PixelFrame } from './PixelFrame';

const Rae = characterSpriteSvg('rae', 'down', -1, 'reach', 'surprised');
export function RootCrossing({ progress, width, height, onSkip }: { progress: number; width: number; height: number; onSkip: () => void }) {
  const insets = useSafeAreaInsets();
  const shot = crossingFrame(progress), slide = shot.slide;
  const landing = Math.max(0, (slide - 0.65) / 0.35);
  const y = 47 + Math.min(1, slide / 0.8) * 94;
  const angle = landing > 0.8 ? 0 : -12 + Math.sin(slide * 13) * 17;
  return <View style={styles.root} accessibilityLabel="The yard fades completely to black before Rae passes between the roots into Silong">
    {shot.phase === 'yard' && <Svg width={width} height={height} viewBox="388 90 260 146" preserveAspectRatio="xMidYMid slice">
      <YardBase prefix="crossing-yard" />
      <G opacity={.2 + Math.sin(progress * 34) * .1}><Rect x={533} y={140} width={30} height={34} fill="#f8e6ac" /></G>
      <G transform="translate(538 160)"><SvgXml xml={Rae} width={20} height={30} /></G>
      <YardForeground prefix="crossing-yard" />
      {[0, 1, 2, 3, 4].map(i => <Rect key={i} x={531 + i * 8} y={172 - Math.floor(progress * 70 + i * 5) % 27} width={2} height={2} fill="#fff1c8" opacity={.7} />)}
    </Svg>}
    {shot.phase === 'roots' && <Svg width={width} height={height} viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
      <Rect width={320} height={180} fill="#142a36" />
      <SvgImage href={ROOT_DESCENT_IMAGE} x={0} y={-8 + Math.floor(slide * 8)} width={320} height={196} preserveAspectRatio="none" />
      {Array.from({ length: 18 }, (_, i) => <Rect key={i} x={84 + i * 31 % 153} y={(i * 23 - slide * 80 + 300) % 180} width={i % 3 ? 1 : 2} height={2} fill={i % 2 ? '#a6bb91' : '#c3b77c'} opacity={0.3 + landing * 0.4} />)}
      <Rect x={99} y={159} width={122} height={21} fill="#e6b778" opacity={landing * .04} />
      <G transform={`translate(150 ${y}) rotate(${angle} 10 15)`}><SvgXml xml={Rae} width={20} height={30} /></G>
    </Svg>}
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#080f12', opacity: shot.darkness }]} />
    <View pointerEvents="none" style={[styles.caption, { bottom: Math.max(24, insets.bottom + 12), maxWidth: width - 50 }]}><Text style={styles.chapter}>CHAPTER 01 · THE BELL BENEATH THE BALETE</Text><Text style={styles.captionText}>{shot.caption}</Text></View>
    <Pressable accessibilityRole="button" accessibilityLabel="Skip crossing animation" onPress={onSkip} style={[styles.skip, { top: Math.max(16, insets.top + 8), right: Math.max(20, insets.right + 12) }]}><PixelFrame fill="#233d37dd" border="#809579" /><Text style={styles.skipText}>Skip ›</Text></Pressable>
  </View>;
}
const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFill },
  caption: { position: 'absolute', alignSelf: 'center', alignItems: 'center', gap: 10 },
  chapter: { fontFamily: 'DMSans_600SemiBold', fontSize: 8, letterSpacing: 1.5, color: '#c6cfb3aa' },
  captionText: { fontFamily: 'PixelifySans_400Regular', fontSize: 25, color: '#f0e8c9', textAlign: 'center', textShadowColor: '#080f12', textShadowRadius: 4 },
  skip: { position: 'absolute', minWidth: 65, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  skipText: { color: '#dedfc0', fontFamily: 'DMSans_500Medium', fontSize: 12 },
});
