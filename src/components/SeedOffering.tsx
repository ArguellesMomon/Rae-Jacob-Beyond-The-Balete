import { useEffect, useState } from 'react';
import { G, Rect, SvgXml } from 'react-native-svg';
import { LISTENING_SEED_SVG } from '../art/worldDetails';
import { groveSeedPosition } from '../art/groveEnvironmentArt';
import type { DialogueLine, Player } from '../game/model';

export function SeedOffering({ line, clock, player }: { line?: DialogueLine; clock: number; player: Player }) {
  const offering = line?.prop === 'seed' && line.speaker === 'Mang Uban';
  const [at, setAt] = useState<number | null>(null);
  useEffect(() => { if (offering && at === null) setAt(clock); else if (!offering && at !== null) setAt(null); }, [offering, at, clock]);
  if (line?.prop !== 'seed') return null;
  const t = offering ? (clock - (at ?? clock)) / 1.4 : 1;
  const { x, y } = groveSeedPosition(player, t);
  return <G transform={`translate(${Math.round(x)} ${Math.round(y)})`}><Rect x={-2} y={-2} width={16} height={15} fill="#e5dfaa" opacity={.12} /><SvgXml xml={LISTENING_SEED_SVG} width={12} height={11} /></G>;
}
