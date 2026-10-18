import type { Progress, Rect, ResidentId } from './model.ts';

export type Celebrant = { id: string; look: ResidentId | 'minda' | 'luning'; x: number; y: number; activity: 'clap' | 'dance' | 'lantern'; early?: boolean };
// Small groups frame the square. The arch, bridges and north/east routes stay open.
const NEIGHBORS: readonly Celebrant[] = [
  { id: 'fern', look: 'pilo', x: 219, y: 235, activity: 'clap', early: true },
  { id: 'wick', look: 'nilo', x: 245, y: 243, activity: 'lantern', early: true },
  { id: 'reed', look: 'minda', x: 348, y: 244, activity: 'clap', early: true },
  { id: 'patch', look: 'sela', x: 444, y: 258, activity: 'lantern', early: true },
  { id: 'sprout', look: 'doro', x: 193, y: 224, activity: 'clap' },
  { id: 'thread', look: 'luning', x: 268, y: 229, activity: 'dance' },
  { id: 'moss', look: 'pilo', x: 321, y: 242, activity: 'dance' },
  { id: 'acorn', look: 'doro', x: 365, y: 265, activity: 'clap' },
  { id: 'amber', look: 'nilo', x: 254, y: 325, activity: 'lantern' },
  { id: 'petal', look: 'sela', x: 285, y: 337, activity: 'clap' },
  { id: 'stitch', look: 'luning', x: 334, y: 320, activity: 'dance' },
  { id: 'rill', look: 'pilo', x: 445, y: 341, activity: 'clap' },
];
export const celebrationNeighbors = (p: Progress): readonly Celebrant[] => p.bellRung ? NEIGHBORS : p.bellReturned ? NEIGHBORS.filter(n => n.early) : [];
export const celebrationFootprints = (p: Progress): Rect[] => celebrationNeighbors(p).map(n => ({ x: n.x - 3, y: n.y - 3, width: 6, height: 3 }));
