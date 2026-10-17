import { memo } from 'react';
import { ClipPath, Defs, Image as SvgImage, Path, SvgXml, Use } from 'react-native-svg';
import { YARD_DEPTH, yardDepthOpacity, yardLaundrySvg, yardLightSvg } from '../art/yardArt';
import type { Point } from '../game/model';

export const YARD_MAP_IMAGE = require('../../assets/maps/lolas-yard-v2.png');
// The bundled bitmap is decoded once by the native image cache; foregrounds reuse its pixels.
export const YardBase = memo(function YardBase({ prefix = 'yard' }: { prefix?: string }) {
  return <>
    <Defs>
      <SvgImage id={`${prefix}-map`} href={YARD_MAP_IMAGE} width={640} height={448} preserveAspectRatio="none" />
      {YARD_DEPTH.map(region => <ClipPath key={region.id} id={`${prefix}-${region.id}`}><Path d={region.path} /></ClipPath>)}
    </Defs>
    <Use href={`#${prefix}-map`} />
  </>;
});
export const YardForeground = memo(function YardForeground({ player, prefix = 'yard' }: { player?: Point; prefix?: string }) {
  return <>{YARD_DEPTH.map(region => <Use key={region.id} href={`#${prefix}-map`} clipPath={`url(#${prefix}-${region.id})`} opacity={yardDepthOpacity(region.id, player)} />)}</>;
});
export const YardLaundry = memo(({ frame }: { frame: number }) => <SvgXml xml={yardLaundrySvg(frame)} width={640} height={448} />);
export const YardLight = memo(({ frame, layer = 'air' }: { frame: number; layer?: 'ground' | 'air' }) => <SvgXml pointerEvents="none" xml={yardLightSvg(frame / 3, layer)} width={640} height={448} />);
