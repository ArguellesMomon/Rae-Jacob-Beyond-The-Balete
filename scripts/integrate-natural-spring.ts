import sharp from 'sharp';

// image_gen authored these images. This file only crops, scales and places them.
// The map patch protects all existing map pixels outside the spring puzzle area.
const normalized = await sharp('assets/maps/quiet-spring-natural-source.png').resize(1280, 960, { kernel: 'nearest' }).png().toBuffer();
const crop = { left: 790, top: 400, width: 430, height: 180 };
const target = { left: 887, top: 386, width: 366, height: 180 };
const alpha = Buffer.alloc(target.width * target.height);
for (let y = 0; y < target.height; y++) for (let x = 0; x < target.width; x++) {
  const edge = Math.min(x, y, target.width - x - 1, target.height - y - 1);
  alpha[y * target.width + x] = Math.round(255 * Math.min(1, edge / 18));
}
const patch = await sharp(normalized).extract(crop).resize(target.width, target.height, { kernel: 'nearest' }).removeAlpha().joinChannel(alpha, { raw: { width: target.width, height: target.height, channels: 1 } }).png().toBuffer();
const sizes = { root: [384, 116], basket: [80, 76], brace: [48, 104], cradle: [76, 20] } as const;
for (const [id, size] of Object.entries(sizes)) {
  const path = `assets/props/generated/spring-${id}-source.png`;
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = 0, bottom = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 16) {
    left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  await sharp(path).extract({ left, top, width: right - left + 1, height: bottom - top + 1 }).resize(size[0], size[1], { kernel: 'nearest', fit: 'fill' }).png().toFile(`assets/props/spring-${id}-v1.png`);
}
const cradle = await sharp('assets/props/spring-cradle-v1.png').resize(38, 10, { kernel: 'nearest' }).png().toBuffer();
await sharp('assets/maps/quiet-spring-v1.png').composite([{ input: patch, left: target.left, top: target.top }, { input: cradle, left: 796, top: 548 }]).png().toFile('assets/maps/quiet-spring-v2.png');
console.log('Integrated generated spring terrain and four transparent props; original assets retained.');
