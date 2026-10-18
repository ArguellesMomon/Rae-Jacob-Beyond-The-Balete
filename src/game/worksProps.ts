import type { Progress } from './model.ts';

export const WORKS_PROP_FILES = { lever: 'works-lever-v1.png', branch: 'works-branch-v1.png' } as const;
export const WORKS_LEVER_BASE_CLIP = 'M311 195h20v13h-20z';
export const WORKS_LEVER_ARM_CLIP = 'M318 202l-2-4 15-22h14v13l-22 14z';
export function worksLeverAngle(diverted: boolean, age?: number, motion = true) {
  const end = diverted ? -78 : 0;
  if (age === undefined || !motion) return end;
  const t = Math.min(1, Math.max(0, age / .45)), eased = t * t * (3 - 2 * t);
  return (diverted ? 0 : -78) + (diverted ? -78 : 78) * eased;
}
export function worksPuzzleItems(p: Progress, transition?: { age: number; motion: boolean }) {
  return [
    { id: 'lever' as const, x: 314, y: 176, width: 28, height: 29, depth: 206, transform: `rotate(${worksLeverAngle(p.flowDiverted, transition?.age, transition?.motion)} 320 201)` },
    { id: 'branch' as const, x: p.branchMoved ? 255 : 198, y: p.branchMoved ? 239 : 259, width: 53, height: 18, depth: p.branchMoved ? 257 : 277, transform: undefined },
  ];
}
