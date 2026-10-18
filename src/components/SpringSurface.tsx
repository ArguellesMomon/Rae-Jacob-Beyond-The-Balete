import { memo } from 'react';
import { Defs, G, Image as SvgImage, Mask, SvgXml } from 'react-native-svg';
import { SPRING_SEAL_BOUNDS, SPRING_WET_BOUNDS, springWaterMaskSvg } from '../art/springSurfaceArt';
import { springSealSvg } from '../art/rainlitArt';

export const SPRING_SURFACE_IMAGES = {
  water: require('../../assets/props/spring-wet-bed-v1.png'),
  seal: require('../../assets/props/spring-bark-seal-v1.png'),
};
export const SpringWaterSurface = memo(function SpringWaterSurface({ reveal = 1 }: { reveal?: number }) {
  return <G pointerEvents="none"><Defs><Mask id="spring-water-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={640} height={480}><SvgXml xml={springWaterMaskSvg(reveal)} width={640} height={480} /></Mask></Defs><SvgImage href={SPRING_SURFACE_IMAGES.water} {...SPRING_WET_BOUNDS} mask="url(#spring-water-mask)" preserveAspectRatio="none" /></G>;
});
export const SpringSeal = memo(function SpringSeal({ reveal = 1, clock = 0 }: { reveal?: number; clock?: number }) {
  return <G pointerEvents="none"><SvgImage href={SPRING_SURFACE_IMAGES.seal} {...SPRING_SEAL_BOUNDS} preserveAspectRatio="none" opacity={Math.min(1, Math.max(0, reveal))} /><SvgXml xml={springSealSvg(reveal, clock)} width={640} height={480} /></G>;
});
