import sharp from 'sharp';

// image_gen removed the vocabulary board. Localize that removal to protect the map.
const box = { left: 900, top: 374, width: 124, height: 96 };
const normalized = await sharp('assets/maps/riverside-hamlet-cleared-source.png').resize(1280, 960, { kernel: 'nearest' }).png().toBuffer();
const alpha = Buffer.alloc(box.width * box.height);
for (let y = 0; y < box.height; y++) for (let x = 0; x < box.width; x++) {
  const edge = Math.min(x, y, box.width - x - 1, box.height - y - 1);
  alpha[y * box.width + x] = Math.round(255 * Math.min(1, edge / 8));
}
const patch = await sharp(normalized).extract(box).removeAlpha().joinChannel(alpha, { raw: { width: box.width, height: box.height, channels: 1 } }).png().toBuffer();
await sharp('assets/maps/riverside-hamlet-v2.png').composite([{ input: patch, left: box.left, top: box.top }]).png().toFile('assets/maps/riverside-hamlet-v3.png');
await sharp('assets/maps/riverside-hamlet-v3.png').extract({ left: 800, top: 375, width: 330, height: 170 }).resize(990, 510, { kernel: 'nearest' }).png().toFile('artifacts/hamlet-cleared-approach.png');
console.log('Removed the painted lesson board; all pixels outside its area are retained.');
