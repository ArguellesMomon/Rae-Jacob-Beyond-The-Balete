import type { Point } from './model.ts';
export type FlowBeat = { at: number; toDiverted: boolean };
export const FLOW_BEAT_DURATION = 3.4;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export function flowPresentation(beat: FlowBeat | null, clock: number, player: Point, motion = true, gentle = true) {
  const age = beat ? Math.max(0, clock - beat.at) : FLOW_BEAT_DURATION;
  const active = !!beat && age < FLOW_BEAT_DURATION, t = clamp(age / FLOW_BEAT_DURATION);
  const diverted = beat?.toDiverted ?? false;
  const target = { x: mix(322, diverted ? 224 : 432, smooth((t - .22) / .40)), y: mix(132, 266, smooth((t - .22) / .40)) };
  const amount = active && motion ? smooth(t / .18) * (1 - smooth((t - .79) / .21)) : 0;
  const tremble = active && motion ? (gentle ? .65 : 1.4) * clamp((age - .25) / .12) * clamp((1.05 - age) / .8) : 0;
  return { active, age, t, diverted, center: { x: mix(player.x, target.x, amount), y: mix(player.y - 24, target.y, amount) },
    shakeX: tremble ? Math.sin(age * 39) * tremble : 0, shakeY: tremble ? Math.sin(age * 31) * tremble * .6 : 0,
    frontY: 127 + 234 * clamp((age - .2) / 1.35),
    caption: diverted ? 'WEST BYPASS · WHEEL STOPPING' : 'EAST FLOW · WHEEL RESTARTING' };
}
