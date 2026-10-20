import sharp from 'sharp';
import { MAZE_PATHS, MAZE_PATH_WIDTH } from '../src/game/turningMaze.ts';
const paths = MAZE_PATHS.map(points => `<polyline points="${points.map(p => p.join(',')).join(' ')}" fill="none" stroke="#d8b577" stroke-width="${MAZE_PATH_WIDTH}" stroke-linejoin="round" stroke-linecap="square"/>`).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="960" viewBox="0 0 640 480"><rect width="640" height="480" fill="#143b31"/>${paths}</svg>`;
await sharp(Buffer.from(svg)).png().toFile('artifacts/turning-maze-layout.png');
