export const CROSSING_DURATION = 9.6;
const ramp = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / (b - a)));
export function crossingFrame(progress: number) {
  const t = Math.max(0, Math.min(1, progress));
  const phase = t < .32 ? 'yard' : t < .44 ? 'blackout' : t < .88 ? 'roots' : 'arrival';
  const darkness = phase === 'yard' ? ramp(t, .09, .32) : phase === 'blackout' ? 1 : phase === 'roots' ? 1 - ramp(t, .44, .50) + ramp(t, .80, .88) : 1 - ramp(t, .88, 1);
  return { phase, darkness: Math.min(1, darkness), slide: ramp(t, .44, .88),
    caption: phase === 'yard' ? 'The light reaches beyond the roots.' : phase === 'blackout' ? 'For a moment, even the afternoon is gone.' : phase === 'roots' ? 'A voice in the dark. A bed of leaves below.' : 'Somewhere beneath unfamiliar stars…' };
}
