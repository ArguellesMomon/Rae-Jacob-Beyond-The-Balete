import type { Interaction, Point, Rect } from './model.ts';
/** Stop short of the item's own footing, but reject a wall between it and Rae. */
export function clearApproach(player: Point, item: Interaction, colliders: readonly Rect[]) {
  const dx = item.point.x - player.x, dy = item.point.y - player.y, distance = Math.hypot(dx, dy);
  if (distance <= 15) return true;
  // Clip the approach segment against each wall so even a one-pixel wall is seen.
  for (const r of colliders) {
    const footing = r.width < 60 && r.height < 60 && Math.hypot(item.point.x - r.x - r.width / 2, item.point.y - r.y - r.height / 2) < 30;
    if (footing) continue;
    let enter = 4 / distance, leave = (distance - 11) / distance;
    for (const [origin, delta, min, max] of [[player.x, dx, r.x, r.x + r.width], [player.y, dy, r.y, r.y + r.height]]) {
      if (delta === 0) { if (origin < min || origin > max) { leave = -1; break; } }
      else {
        const a = (min - origin) / delta, b = (max - origin) / delta;
        enter = Math.max(enter, Math.min(a, b)); leave = Math.min(leave, Math.max(a, b));
      }
    }
    if (enter <= leave) return false;
  }
  return true;
}
