import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { SPRING_WET_BOUNDS, springWetMarkup } from '../src/art/springSurfaceArt.ts';

// Compile the existing texture and feathered rill mask once. Runtime draws one
// small RGBA image, avoiding native luminance-mask passes on every scene frame.
const source=await readFile('assets/props/spring-wet-bed-v1.png');
const b=SPRING_WET_BOUNDS;
const xml=`<svg xmlns="http://www.w3.org/2000/svg" width="${b.width*2}" height="${b.height*2}" viewBox="${b.x} ${b.y} ${b.width} ${b.height}">${springWetMarkup(`data:image/png;base64,${source.toString('base64')}`)}</svg>`;
await sharp(Buffer.from(xml)).png().toFile('assets/props/spring-water-mobile.png');
console.log('Prepared the transparent 320 × 144 spring water surface.');
