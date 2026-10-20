import { memo } from 'react';
import { SvgXml } from 'react-native-svg';

/** Unchanged art must not reconcile hundreds of native shapes on each world tick.
 * Position this in a G transform: nested native Svg views do not support x/y. */
export const SceneArt=memo(function SceneArt({xml,width,height}:{xml:string;width:number;height:number}){
  return <SvgXml pointerEvents="none" xml={xml} width={width} height={height}/>;
});
