import type { Interaction, Player, Progress, RainlitMapId, Rect } from './model.ts';
import { SPRING_RILL } from './springScene.ts';
import { hamletLifeFootprints } from './hamletLife.ts';
const rillColliders: Rect[] = SPRING_RILL.slice(1).map(([x, y], i) => {
  const [ax, ay] = SPRING_RILL[i];
  return { x: Math.min(ax, x) - 2, y: Math.min(ay, y) - 2, width: Math.abs(x - ax) + 4, height: Math.abs(y - ay) + 4 };
});
export const RAINLIT_SIZE = { width: 640, height: 480 };
const actor = (x: number, y: number): Player => ({ x, y, facing: 'right', moving: false, stride: 0 });
export const RAINLIT_SPAWNS = { rainroad: actor(95, 337), hamlet: actor(160, 329), spring: actor(90, 377) };
export const MAYUMI_POINT = { x: 282, y: 263 };
export const LUNING_POINT = { x: 300, y: 250 };
export const HAMLET_BAGTAS_POINT = { x: 330, y: 266 };
export const SPRING_BAGTAS_POINT = { x: 374, y: 294 };
export const RAINLIT_COLLIDERS: Record<RainlitMapId, readonly Rect[]> = {
  rainroad: [{ x: 331, y: 262, width: 14, height: 7 }, { x: 85, y: 100, width: 150, height: 115 }],
  hamlet: [{ x: 141, y: 235, width: 61, height: 27 }, { x: HAMLET_BAGTAS_POINT.x - 7, y: HAMLET_BAGTAS_POINT.y - 5, width: 14, height: 7 }, { x: 75, y: 60, width: 170, height: 165 }, { x: 290, y: 70, width: 155, height: 155 }, { x: 296, y: 245, width: 8, height: 7 }, { x: 355, y: 218, width: 60, height: 8 }],
  spring: [...rillColliders, { x: 390, y: 252, width: 45, height: 19 }, { x: 430, y: 252, width: 48, height: 14 }, { x: 510, y: 217, width: 24, height: 27 }, { x: 65, y: 50, width: 130, height: 180 }, { x: 277, y: 258, width: 10, height: 8 }, { x: 367, y: 289, width: 14, height: 8 }],
};
const guide: Interaction = { id: 'bagtas', name: 'Bagtas', action: 'Talk', point: { x: 338, y: 267 } };
const tala: Interaction = { id: 'tala', name: 'Tala', action: 'Talk', point: { x: 100, y: 385 } };
export function rainlitMap(id: RainlitMapId, p: Progress) {
  const r = p.rainlit;
  const interactions: Interaction[] = id === 'rainroad' ? [tala, guide,
    { id: 'roadReturn', name: 'Back to Bagtas’s shelter', action: 'Travel', point: { x: 76, y: 350 } },
    { id: 'hamletEntry', name: 'Riverside Hamlet →', action: 'Travel', point: { x: 575, y: 213 } },
    { id: 'rainGauge', name: 'Rain cup on the road', action: 'Inspect', point: { x: 208, y: 261 }, note: 'Rain fills this cup, but the hamlet’s spring runs low. Rainfall and spring flow are different observations.' },
    { id: 'bambooDrips', name: 'A leaf holding the sky', action: 'Inspect', point: { x: 420, y: 248 }, note: 'A drop holds a tiny upside-down canopy. Rae stops to look, even on the way home.' },
  ] : id === 'hamlet' ? [tala, { ...guide, point: HAMLET_BAGTAS_POINT },
    { id: 'hamletReturn', name: '← Rainlit Road', action: 'Travel', point: { x: 147, y: 350 } },
    { id: 'springEntry', name: 'The Quiet Spring →', action: 'Travel', point: { x: 585, y: 240 } },
    { id: 'luning', name: r.basketFreed && !r.basketReturned ? 'Luning · Return the basket' : 'Luning · Basket-maker', action: 'Talk', point: LUNING_POINT },
    { id: 'basketRack', name: 'Baskets waiting for water', action: 'Inspect', point: { x: 376, y: 239 }, note: 'Luning’s delivery was caught upstream. Her repair work serves neighbors whose daily routines depend on this water.' },
  ] : [tala,
    { id: 'springReturn', name: '← Riverside Hamlet', action: 'Travel', point: { x: 85, y: 409 } },
    { id: 'mayumi', name: r.metMayumi ? 'Mayumi · The Diwata ng Bukal' : 'The woman by the spring', action: 'Talk', point: MAYUMI_POINT },
    { id: 'springChannel', name: 'Tala’s narrow-rill survey', action: 'Inspect', point: { x: 450, y: 269 } },
    { id: 'springBrace', name: !r.rootBraced ? 'Bagtas · Brace the root' : !r.restored ? 'Settle the braced root gently' : 'The repaired stone cradle', action: 'Use', point: { x: 399, y: 289 } },
    { id: 'springBasket', name: r.basketFreed ? 'The cleared rill' : 'Basket trapped under the root', action: r.basketFreed ? 'Inspect' : 'Take', point: { x: 490, y: 281 } },
    { id: 'springSeal', name: r.sealSeen ? 'The newly formed pale seal' : 'A root hollow with no mark', action: 'Inspect', point: { x: 520, y: 281 } },
    { id: 'springMoss', name: 'The spring’s mossy edge', action: 'Inspect', point: { x: 248, y: 290 }, note: 'Tiny wet spaces are habitats. The bank stays dry; the rill carries water to the lives downstream.' },
    ...(p.ubanGiftReceived ? [{ id: 'springSeed' as const, name: 'Listen with Mang Uban’s seed', action: 'Inspect' as const, point: { x: 313, y: 292 } }] : []),
  ];
  return { ...RAINLIT_SIZE, name: id === 'rainroad' ? 'Rainlit Road' : id === 'hamlet' ? 'Riverside Hamlet' : 'The Quiet Spring', spawn: RAINLIT_SPAWNS[id], colliders: id === 'hamlet' ? [...RAINLIT_COLLIDERS[id], ...hamletLifeFootprints(p)] : RAINLIT_COLLIDERS[id], interactions };
}
