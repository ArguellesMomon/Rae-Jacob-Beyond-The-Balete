import type { Progress } from './model.ts';

// The generated rill is painted into quiet-spring-v2. Water follows its irregular bed.
export const SPRING_RILL: readonly (readonly [number, number])[] = [
  [438, 208], [441, 218], [444, 230], [451, 242], [459, 250], [473, 259],
  [490, 266], [508, 267], [526, 264], [544, 258], [558, 248], [570, 241], [583, 235],
];
export const SPRING_PROP_FILES = { root: 'spring-root-v1.png', basket: 'spring-basket-v1.png', brace: 'spring-brace-v1.png' } as const;
export type SpringProp = { id: keyof typeof SPRING_PROP_FILES; x: number; y: number; width: number; height: number; transform?: string };
export function springPuzzleItems(p: Progress, settling = 1): SpringProp[] {
  const q = p.rainlit, amount = Math.min(1, Math.max(0, settling));
  const lift = q.rootBraced && !q.restored ? -8 : q.restored ? -8 + 10 * amount : 0;
  return [
    ...(q.rootBraced && (!q.restored || amount < .7) ? [{ id: 'brace' as const, x: 394, y: 255, width: 14, height: 22 }] : []),
    ...(!q.basketFreed ? [{ id: 'basket' as const, x: 475, y: 254, width: 20, height: 19 }] : []),
    { id: 'root', x: 390, y: 245 + lift, width: 96, height: 29, transform: `rotate(-12 407 ${274 + lift})` },
  ];
}
