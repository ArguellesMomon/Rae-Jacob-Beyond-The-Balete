import sharp from 'sharp';

// image_gen authored the new objects. Localize the Bamboo Verge sign to protect
// the existing map. Keep the hamlet edit whole for natural contact shadows;
// its basket/sign interaction points and footprints follow the resulting artwork.
export const STORY_MAP_PATCHES = [
  { original: 'bamboo-verge-v2.png', generated: 'bamboo-verge-story-source.png', output: 'bamboo-verge-v3.png', wholeMap: false, patches: [
    { crop: { left: 688, top: 283, width: 148, height: 84 }, left: 718, top: 277, width: 148, height: 84 },
  ] },
  { original: 'riverside-hamlet-v1.png', generated: 'riverside-hamlet-story-source.png', output: 'riverside-hamlet-v2.png', wholeMap: true, patches: [] },
] as const;

for (const map of STORY_MAP_PATCHES) {
  const normalized = await sharp('assets/maps/' + map.generated).resize(1280, 960, { kernel: 'nearest' }).png().toBuffer();
  if (map.wholeMap) {
    await sharp(normalized).toFile('assets/maps/' + map.output);
    console.log('Integrated full generated story map:', map.output);
    continue;
  }
  const patches = await Promise.all(map.patches.map(async patch => {
    const alpha = Buffer.alloc(patch.width * patch.height);
    for (let y = 0; y < patch.height; y++) for (let x = 0; x < patch.width; x++) {
      const edge = Math.min(x, y, patch.width - x - 1, patch.height - y - 1);
      alpha[y * patch.width + x] = Math.round(255 * Math.min(1, edge / 3));
    }
    const input = await sharp(normalized).extract(patch.crop).resize(patch.width, patch.height, { kernel: 'nearest' }).removeAlpha().joinChannel(alpha, { raw: { width: patch.width, height: patch.height, channels: 1 } }).png().toBuffer();
    return { input, left: patch.left, top: patch.top };
  }));
  await sharp('assets/maps/' + map.original).composite(patches).png().toFile('assets/maps/' + map.output);
  console.log('Integrated generated story details:', map.output);
}
