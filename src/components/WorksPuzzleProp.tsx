import { memo } from 'react';
import { G, Image as SvgImage, Ellipse, Defs, ClipPath, Path } from 'react-native-svg';
import type { worksPuzzleItems } from '../game/worksProps';
import { WORKS_LEVER_ARM_CLIP, WORKS_LEVER_BASE_CLIP } from '../game/worksProps';

export const WORKS_PROP_IMAGES = { lever: require('../../assets/props/works-lever-v1.png'), branch: require('../../assets/props/works-branch-v1.png') };
export const WorksPuzzleProp = memo(function WorksPuzzleProp({ item }: { item: ReturnType<typeof worksPuzzleItems>[number] }) {
  const image = <SvgImage href={WORKS_PROP_IMAGES[item.id]} x={item.x} y={item.y} width={item.width} height={item.height} preserveAspectRatio="none" />;
  return <G pointerEvents="none"><Ellipse cx={item.id === 'lever' ? 320 : item.x + 25} cy={item.depth - 1} rx={item.id === 'lever' ? 5 : 23} ry={1.8} fill="#1c3026" opacity={.26} />{item.id === 'lever' ? <><Defs><ClipPath id="works-lever-base"><Path d={WORKS_LEVER_BASE_CLIP} /></ClipPath><ClipPath id="works-lever-arm"><Path d={WORKS_LEVER_ARM_CLIP} /></ClipPath></Defs><G clipPath="url(#works-lever-base)">{image}</G><G transform={item.transform}><G clipPath="url(#works-lever-arm)">{image}</G></G></> : image}</G>;
});
