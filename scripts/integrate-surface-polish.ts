import sharp from 'sharp';

// Generated image art only: trim transparent padding and prepare game-sized assets.
for (const [id, width, height] of [['works-lever', 112, 116], ['works-branch', 212, 72]] as const) {
  const file = `assets/props/generated/${id}-source.png`;
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = 0, bottom = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 16) {
    left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  await sharp(file).extract({ left, top, width: right - left + 1, height: bottom - top + 1 }).resize(width, height, { fit: 'fill', kernel: 'nearest' }).png().toFile(`assets/props/${id}-v1.png`);
}
await sharp('assets/props/generated/spring-wet-bed-source.png').resize(640, 288, { kernel: 'nearest' }).png().toFile('assets/props/spring-wet-bed-v1.png');
// The seal is an edited patch of the same hollow, softly edged to its existing bark.
const width = 144, height = 176, alpha = Buffer.alloc(width * height);
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  const edge = Math.min(x, y, width - x - 1, height - y - 1);
  alpha[y * width + x] = Math.round(255 * Math.min(1, edge / 12));
}
await sharp('assets/props/generated/spring-bark-seal-source.png').resize(width, height, { kernel: 'nearest' }).removeAlpha().joinChannel(alpha, { raw: { width, height, channels: 1 } }).png().toFile('assets/props/spring-bark-seal-v1.png');
console.log('Prepared lever, branch, shallow water texture and bark seal.');
