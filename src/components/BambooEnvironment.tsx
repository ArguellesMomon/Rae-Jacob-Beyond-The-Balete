import { memo } from 'react';
import { ClipPath, Defs, Image as SvgImage, Path, SvgXml, Use } from 'react-native-svg';
import { VERGE_DEPTH, VERGE_WAYFINDING_SVG, vergeDepthOpacity, vergeWeatherSvg } from '../art/bambooEnvironmentArt';
import type { Point } from '../game/model';

export const VERGE_MAP_IMAGE = require('../../assets/maps/bamboo-verge-v2.png');
export const VergeBase = memo(function VergeBase({ prefix = 'verge' }: { prefix?: string }) {
  return <>
    <Defs>
      <SvgImage id={`${prefix}-map`} href={VERGE_MAP_IMAGE} width={640} height={480} preserveAspectRatio="none" />
      {VERGE_DEPTH.map(region => <ClipPath key={region.id} id={`${prefix}-${region.id}`}><Path d={region.path} /></ClipPath>)}
    </Defs>
    <Use href={`#${prefix}-map`} />
    <SvgXml xml={VERGE_WAYFINDING_SVG} width={640} height={480} />
  </>;
});
export const VergeForeground = memo(function VergeForeground({ player, prefix = 'verge' }: { player: Point; prefix?: string }) {
  return <>{VERGE_DEPTH.map(region => <Use key={region.id} href={`#${prefix}-map`} clipPath={`url(#${prefix}-${region.id})`} opacity={vergeDepthOpacity(region.id, player)} />)}</>;
});
export const VergeWeather = memo(({ frame, layer = 'air' }: { frame: number; layer?: 'ground' | 'air' }) => <SvgXml pointerEvents="none" xml={vergeWeatherSvg(frame / 4, layer)} width={640} height={480} />);
