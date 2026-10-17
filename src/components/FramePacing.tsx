import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { framePacing } from '../game/framePacing';
export function FramePacing() {
  const [stats, setStats] = useState({ hz: 0, late: 0, worst: 0 });
  useEffect(() => {
    let raf = 0, last = 0, report = 0; let samples: number[] = [];
    const tick = (now: number) => {
      if (last) samples.push(now - last); last = now;
      if (!report) report = now;
      if (now - report >= 1000) { setStats(framePacing(samples)); samples = []; report = now; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <View pointerEvents="none" style={s.card}><Text style={s.label}>REPLAY · FRAME PACING</Text><Text style={s.text}>{stats.hz ? `${stats.hz}/s · ${stats.late} late · ${stats.worst}ms peak` : 'Measuring…'}</Text></View>;
}
const s = StyleSheet.create({ card: { backgroundColor: '#243e35e8', borderWidth: 1, borderColor: '#a8b18b', paddingHorizontal: 10, paddingVertical: 7 }, label: { fontFamily: 'DMSans_600SemiBold', fontSize: 7, color: '#c1c6a0', letterSpacing: 1 }, text: { fontFamily: 'PixelifySans_400Regular', fontSize: 13, color: '#f3e6c6', marginTop: 3 } });
