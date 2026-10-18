import { memo } from 'react';
import { SvgXml } from 'react-native-svg';
import { atmosphereSvg, recoverySvg } from '../art/atmosphere';
import { EMPTY_PROGRESS } from '../game/model';
import type { MapId, Progress } from '../game/model';
const sizes = { rainroad: [640, 480], hamlet: [640, 480], spring: [640, 480], bamboo: [640, 480], turning: [640, 480], yard: [640, 448], clearing: [576, 448], grove: [480, 512], waterworks: [704, 480] };
export const SceneAtmosphere = memo(function SceneAtmosphere({ map, progress = EMPTY_PROGRESS, clock, layer = 'air', moving = true }: { map: MapId; progress?: Progress; clock: number; layer?: 'ground' | 'air'; moving?: boolean }) {
  const [w, h] = sizes[map];
  return <SvgXml pointerEvents="none" xml={atmosphereSvg(map, progress, moving ? clock : 1, layer)} width={w} height={h} />;
});
export const SettlementRecovery = memo(function SettlementRecovery({ progress, clock, moving = true }: { progress: Progress; clock: number; moving?: boolean }) {
  return <SvgXml pointerEvents="none" xml={recoverySvg(progress, moving ? clock : 10)} width={576} height={448} />;
});
