import { memo } from 'react';
import { ClipPath, Defs, Image as SvgImage, Path, SvgXml, Use } from 'react-native-svg';
import { TURNING_CLUE_BOARDS_SVG, TURNING_DEPTH, turningDepthOpacity, turningWeatherSvg } from '../art/turningEnvironmentArt';
import type { Point } from '../game/model';

export const TURNING_MAP_IMAGE = require('../../assets/maps/turning-paths-v2.png');
export const TurningBase = memo(function TurningBase({ prefix = 'turning' }: { prefix?: string }) {
  return <>
    <Defs>
      <SvgImage id={`${prefix}-map`} href={TURNING_MAP_IMAGE} width={640} height={480} preserveAspectRatio="none" />
      {TURNING_DEPTH.map(region => <ClipPath key={region.id} id={`${prefix}-${region.id}`}><Path d={region.path} /></ClipPath>)}
    </Defs>
    <Use href={`#${prefix}-map`} />
    <SvgXml xml={TURNING_CLUE_BOARDS_SVG} width={640} height={480} />
  </>;
});
export const TurningForeground = memo(function TurningForeground({ player, prefix = 'turning' }: { player: Point; prefix?: string }) {
  return <>{TURNING_DEPTH.map(region => <Use key={region.id} href={`#${prefix}-map`} clipPath={`url(#${prefix}-${region.id})`} opacity={turningDepthOpacity(region.id, player)} />)}</>;
});
export const TurningWeather = memo(({ frame, layer = 'air' }: { frame: number; layer?: 'ground' | 'air' }) => <SvgXml pointerEvents="none" xml={turningWeatherSvg(frame / 3, layer)} width={640} height={480} />);
