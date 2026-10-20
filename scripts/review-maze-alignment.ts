import sharp from 'sharp';
import { mazeGroundRegions } from '../src/game/turningMaze.ts';
let s = mazeGroundRegions().map(points => `<polygon points="${points.map(p => p.join(',')).join(' ')}" fill="#54f0fc" opacity=".22" stroke="#f2ffff" stroke-width=".5"/>`).join('');
for (let x = 40; x < 640; x += 40) s += `<path d="M${x} 0v480" stroke="white" opacity=".25"/><text x="${x + 1}" y="20" fill="white" font-size="10">${x}</text>`;
for (let y = 40; y < 480; y += 40) s += `<path d="M0 ${y}h640" stroke="white" opacity=".25"/><text x="3" y="${y - 2}" fill="white" font-size="10">${y}</text>`;
await sharp('assets/maps/turning-paths-v3.png').composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="960" viewBox="0 0 640 480">${s}</svg>`) }]).png().toFile('artifacts/turning-maze-alignment.png');
