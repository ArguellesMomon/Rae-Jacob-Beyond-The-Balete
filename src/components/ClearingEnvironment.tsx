import { memo } from 'react';
import { ClipPath, Defs, Image as SvgImage, Path, SvgXml, Use } from 'react-native-svg';
import { CLEARING_DEPTH, clearingDepthOpacity, clearingLightSvg, clearingRecoverySvg, clearingStateSvg } from '../art/clearingEnvironmentArt';
import type { Point, Progress } from '../game/model';

export const CLEARING_MAP_IMAGE = require('../../assets/maps/lantern-clearing-v2.png');
export const ROOT_DESCENT_IMAGE = require('../../assets/maps/root-descent-v2.png');
export const ClearingBase = memo(function ClearingBase({ prefix = 'clearing' }: { prefix?: string }) {
  return <>
    <Defs>
      <SvgImage id={`${prefix}-map`} href={CLEARING_MAP_IMAGE} width={576} height={448} preserveAspectRatio="none" />
      {CLEARING_DEPTH.map(region => <ClipPath key={region.id} id={`${prefix}-${region.id}`}><Path d={region.path} /></ClipPath>)}
    </Defs>
    <Use href={`#${prefix}-map`} />
  </>;
});
export const ClearingForeground = memo(function ClearingForeground({ player, prefix = 'clearing' }: { player?: Point; prefix?: string }) {
  return <>{CLEARING_DEPTH.map(region => <Use key={region.id} href={`#${prefix}-map`} clipPath={`url(#${prefix}-${region.id})`} opacity={clearingDepthOpacity(region.id, player)} />)}</>;
});
export const ClearingState = memo(({ progress }: { progress: Progress }) => <SvgXml xml={clearingStateSvg(progress)} width={576} height={448} />);
export const ClearingLight = memo(({ frame, progress, layer = 'air' }: { frame: number; progress: Progress; layer?: 'ground' | 'air' }) => <SvgXml pointerEvents="none" xml={clearingLightSvg(progress, frame / 3, layer)} width={576} height={448} />);
export const ClearingRecovery = memo(({ frame, progress }: { frame: number; progress: Progress }) => <SvgXml pointerEvents="none" xml={clearingRecoverySvg(progress, frame / 3)} width={576} height={448} />);
