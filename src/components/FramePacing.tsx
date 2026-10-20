import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { framePacing } from '../game/framePacing';
export function FramePacing({clock}:{clock:number}) {
  const [stats, setStats] = useState({ hz: 0, late: 0, worst: 0 });
  const timing=useRef({last:0,report:0,samples:[] as number[]});
  useEffect(() => {
    // Count committed scene updates, not an unrelated 60 Hz RAF callback.
    const now=performance.now(),t=timing.current;
    if(t.last)t.samples.push(now-t.last);t.last=now;
    if(!t.report)t.report=now;
    if(now-t.report>=1000){setStats(framePacing(t.samples));t.samples=[];t.report=now;}
  }, [clock]);
  return <View pointerEvents="none" style={s.card}><Text style={s.label}>SCENE UPDATES · 30/S TARGET</Text><Text style={s.text}>{stats.hz ? `${stats.hz}/s · ${stats.late} late · ${stats.worst}ms peak` : 'Measuring…'}</Text></View>;
}
const s = StyleSheet.create({ card: { backgroundColor: '#243e35e8', borderWidth: 1, borderColor: '#a8b18b', paddingHorizontal: 10, paddingVertical: 7 }, label: { fontFamily: 'DMSans_600SemiBold', fontSize: 7, color: '#c1c6a0', letterSpacing: 1 }, text: { fontFamily: 'PixelifySans_400Regular', fontSize: 13, color: '#f3e6c6', marginTop: 3 } });
