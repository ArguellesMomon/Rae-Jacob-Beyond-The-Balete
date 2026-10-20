import type { Progress, Rect } from './model.ts';
import type { DuwendeLook } from '../art/duwendeArt.ts';
export const HAMLET_NEIGHBORS: readonly { id: string; look: DuwendeLook; x: number; y: number; task: 'cup' | 'wash' | 'carry' }[] = [
  { id: 'household-cup', look: 'sela', x: 230, y: 275, task: 'cup' },
  { id: 'cloth-rinsing', look: 'minda', x: 196, y: 300, task: 'wash' },
  { id: 'water-carrier', look: 'doro', x: 270, y: 290, task: 'carry' },
  { id: 'basket-soaking', look: 'luning', x: 360, y: 245, task: 'wash' },
  { id: 'shared-drink', look: 'pilo', x: 400, y: 240, task: 'cup' },
];
export const hamletNeighbors = (p: Progress) => p.rainlit.restored ? HAMLET_NEIGHBORS : [];
export const hamletLifeFootprints = (p: Progress): Rect[] => hamletNeighbors(p).map(n => ({ x: n.x - 3, y: n.y - 3, width: 6, height: 3 }));
