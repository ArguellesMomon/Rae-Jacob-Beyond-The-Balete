import { memo, useId } from 'react';
import { ClipPath, Defs, G, Image as SvgImage, Path } from 'react-native-svg';
import { SPRING_SEAL_BOUNDS, SPRING_WET_BOUNDS, springWaterRevealPath } from '../art/springSurfaceArt';
import { springSealSvg } from '../art/rainlitArt';
import { SceneArt } from './SceneArt';

export const SPRING_SURFACE_IMAGES = {
  water: require('../../assets/props/spring-water-mobile.png'),
  seal: require('../../assets/props/spring-bark-seal-v1.png'),
};
export const SpringWaterSurface = memo(function SpringWaterSurface({ reveal = 1 }: { reveal?: number }) {
  const clipId=`spring-flow-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`;
  if(reveal<=0)return null;
  const image=<SvgImage href={SPRING_SURFACE_IMAGES.water} {...SPRING_WET_BOUNDS} preserveAspectRatio="none"/>;
  return <G pointerEvents="none">{reveal>=1?image:<><Defs><ClipPath id={clipId}><Path d={springWaterRevealPath(reveal)}/></ClipPath></Defs><G clipPath={`url(#${clipId})`}>{image}</G></>}</G>;
});
export const SpringSeal = memo(function SpringSeal({ reveal = 1, clock = 0 }: { reveal?: number; clock?: number }) {
  return <G pointerEvents="none"><SvgImage href={SPRING_SURFACE_IMAGES.seal} {...SPRING_SEAL_BOUNDS} preserveAspectRatio="none" opacity={Math.min(1, Math.max(0, reveal))} />{reveal>0&&reveal<1&&<SceneArt xml={springSealSvg(reveal, clock)} width={640} height={480}/>}</G>;
});
