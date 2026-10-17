export function framePacing(intervals: number[]) {
  const valid = intervals.filter(n => Number.isFinite(n) && n > 0);
  if (!valid.length) return { hz: 0, late: 0, worst: 0 };
  const average = valid.reduce((sum, n) => sum + n, 0) / valid.length;
  return { hz: Math.round(1000 / average), late: valid.filter(n => n > 50).length, worst: Math.round(Math.max(...valid)) };
}
