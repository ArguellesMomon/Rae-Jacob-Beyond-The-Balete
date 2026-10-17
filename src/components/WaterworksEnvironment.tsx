import { memo } from 'react';
import { ClipPath, Defs, G, Image as SvgImage, Path, Rect, SvgXml, Use } from 'react-native-svg';
import { WORKS_DEPTH, WORKS_BRIDGE_LIP, WORKS_FLOW_BEDS, worksDepthOpacity, worksMotionSvg } from '../art/waterworksEnvironmentArt';
import type { Point, Progress } from '../game/model';

export const WORKS_MAP_IMAGE = require('../../assets/maps/rootwater-works-v2.png');
export const WorksBase = memo(function WorksBase({ prefix = 'works' }: { prefix?: string }) {
  return <>
    <Defs>
      <SvgImage id={`${prefix}-map`} href={WORKS_MAP_IMAGE} width={704} height={480} preserveAspectRatio="none" />
      {WORKS_DEPTH.map(region => <ClipPath key={region.id} id={`${prefix}-${region.id}`}><Path d={region.path} /></ClipPath>)}
      <ClipPath id={`${prefix}-bridge`}><Path d={WORKS_BRIDGE_LIP} /></ClipPath>
      {WORKS_FLOW_BEDS.map(bed => <ClipPath key={bed.id} id={`${prefix}-${bed.id}`}><Rect x={bed.x} y={bed.y} width={bed.width} height={bed.height} /></ClipPath>)}
    </Defs>
    <Use href={`#${prefix}-map`} />
  </>;
});
export const WorksFlowBeds = memo(({ diverted, prefix = 'works' }: { diverted: boolean; prefix?: string }) => diverted ? <>{WORKS_FLOW_BEDS.map(bed => <G key={bed.id} clipPath={`url(#${prefix}-${bed.id})`}><Use href={`#${prefix}-map`} transform={bed.transform} /></G>)}</> : null);
export const WorksForeground = memo(function WorksForeground({ player, prefix = 'works' }: { player: Point; prefix?: string }) {
  return <>{WORKS_DEPTH.map(region => <Use key={region.id} href={`#${prefix}-map`} clipPath={`url(#${prefix}-${region.id})`} opacity={worksDepthOpacity(region.id, player)} />)}{(player.y < 366 || player.y > 392) && <Use href={`#${prefix}-map`} clipPath={`url(#${prefix}-bridge)`} />}</>;
});
export const WorksMotion = memo(({ frame, progress, layer = 'air' }: { frame: number; progress: Progress; layer?: 'water' | 'air' }) => <SvgXml pointerEvents="none" xml={worksMotionSvg(progress, frame / 6, layer)} width={704} height={480} />);
