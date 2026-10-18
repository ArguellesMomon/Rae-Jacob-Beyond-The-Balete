import { memo } from 'react';
import { G, Image as SvgImage, SvgXml } from 'react-native-svg';
import type { Progress } from '../game/model';
import { springPuzzleItems } from '../game/springScene';
import { springRepairSvg } from '../art/rainlitArt';

export const SPRING_PROP_IMAGES = {
  root: require('../../assets/props/spring-root-v1.png'),
  basket: require('../../assets/props/spring-basket-v1.png'),
  brace: require('../../assets/props/spring-brace-v1.png'),
};
export const SpringPuzzleProps = memo(function SpringPuzzleProps({ progress, settling = 1 }: { progress: Progress; settling?: number }) {
  return <G pointerEvents="none">
    <SvgXml xml={springRepairSvg(progress, settling)} width={640} height={480} />
    {springPuzzleItems(progress, settling).map(item => <SvgImage key={item.id} href={SPRING_PROP_IMAGES[item.id]} x={item.x} y={item.y} width={item.width} height={item.height} transform={item.transform} preserveAspectRatio="none" />)}
  </G>;
});
