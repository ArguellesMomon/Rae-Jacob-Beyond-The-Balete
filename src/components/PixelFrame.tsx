import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { pixelFrameSvg } from '../art/interfaceArt';

/** Stepped corners are decorative; the full rectangular touch target stays intact. */
export function PixelFrame({ fill = '#f1e4bd', border = '#7e865b', light = '#fff5d6', cut = 4 }: { fill?: string; border?: string; light?: string; cut?: number }) {
  const [size, setSize] = useState({ width: 100, height: 48 });
  return <View pointerEvents="none" style={StyleSheet.absoluteFill} onLayout={e => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0 && (width !== size.width || height !== size.height)) setSize({ width, height });
  }}><SvgXml xml={pixelFrameSvg(size.width, size.height, fill, border, light, cut)} width="100%" height="100%" preserveAspectRatio="none" /></View>;
}
