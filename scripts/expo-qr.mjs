import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const url = process.argv[2];
if (!url || !/^exp:\/\/[\w.:-]+$/.test(url)) throw new Error('Usage: node scripts/expo-qr.mjs exp://YOUR-LAN-IP:8081');
// Use the encoder already supplied with Expo's CLI, without another runtime dependency.
const expoRequire = createRequire(import.meta.resolve('expo/package.json'));
const cliRequire = createRequire(expoRequire.resolve('@expo/cli'));
const { toQR } = cliRequire('toqr');
const data = toQR(url), size = Math.sqrt(data.byteLength);
if (!Number.isInteger(size)) throw new Error('Unexpected QR matrix.');
let cells = '';
for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (data[y * size + x]) cells += `M${x + 4} ${y + 4}h1v1h-1z`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size + 8}" height="${size + 8}" viewBox="0 0 ${size + 8} ${size + 8}"><rect width="100%" height="100%" fill="white"/><path d="${cells}" fill="#102a20"/></svg>`;
await mkdir('artifacts', { recursive: true });
await sharp(Buffer.from(svg)).resize((size + 8) * 10, (size + 8) * 10, { kernel: 'nearest' }).png().toFile(resolve('artifacts/expo-go-qr.png'));
await writeFile('artifacts/expo-go-url.txt', url + '\n');
console.log(`QR created for ${url}. It works while this computer's Expo server is running and both devices share the network.`);
