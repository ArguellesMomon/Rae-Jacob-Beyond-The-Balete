import { memo } from 'react';
import { ClipPath, Defs, Image as SvgImage, Path, Rect, SvgXml, Use } from 'react-native-svg';
import { GROVE_DEPTH, GROVE_PERCH_EDGE, groveDepthOpacity, groveLightSvg } from '../art/groveEnvironmentArt';
import type { Point, Progress } from '../game/model';

export const GROVE_MAP_IMAGE = require('../../assets/maps/old-balete-grove-v2.png');
export const GroveBase = memo(function GroveBase({ prefix = 'grove' }: { prefix?: string }) {
  return <>
    <Defs>
      <SvgImage id={`${prefix}-map`} href={GROVE_MAP_IMAGE} width={480} height={512} preserveAspectRatio="none" />
      {GROVE_DEPTH.map(region => <ClipPath key={region.id} id={`${prefix}-${region.id}`}><Path d={region.path} /></ClipPath>)}
      <ClipPath id={`${prefix}-perch`}><Path d={GROVE_PERCH_EDGE} /></ClipPath>
    </Defs>
    <Rect x={-240} y={-256} width={960} height={1024} fill="#142d36" />
    <Use href={`#${prefix}-map`} transform="translate(-240 -256) scale(2)" opacity={.45} />
    <Use href={`#${prefix}-map`} />
  </>;
});
export const GrovePerchEdge = memo(({ prefix = 'grove' }: { prefix?: string }) => <Use href={`#${prefix}-map`} clipPath={`url(#${prefix}-perch)`} />);
export const GroveForeground = memo(function GroveForeground({ player, prefix = 'grove' }: { player?: Point; prefix?: string }) {
  return <>{GROVE_DEPTH.map(region => <Use key={region.id} href={`#${prefix}-map`} clipPath={`url(#${prefix}-${region.id})`} opacity={groveDepthOpacity(region.id, player)} />)}</>;
});
export const GroveLight = memo(({ frame, progress, layer = 'air' }: { frame: number; progress: Progress; layer?: 'ground' | 'air' }) => <SvgXml pointerEvents="none" xml={groveLightSvg(progress, frame / 3, layer)} width={480} height={512} />);
