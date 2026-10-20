import { createElement } from 'react';
import type { ReactNode } from 'react';
type Props=Record<string,unknown>&{children?:ReactNode};
export const xmlDraws={count:0};
const host=(name:string)=>(props:Props)=>createElement(name,props,props.children);
// Native SvgView exposes a viewBox, but unlike a browser <svg> has no x/y props.
// Deliberately ignore them here so web-only placement cannot pass this test.
export default function Svg({x,y,...props}:Props){return createElement('svg',props,props.children);}
export function SvgXml({x,y,...props}:Props){xmlDraws.count++;return createElement('raw-svg',props);}
export const G=host('g'),Rect=host('rect'),Path=host('path'),Ellipse=host('ellipse');
export const Defs=host('defs'),ClipPath=host('clipPath'),Mask=host('mask'),Image=host('image');
export const RadialGradient=host('radialGradient'),Stop=host('stop'),Use=host('use');
