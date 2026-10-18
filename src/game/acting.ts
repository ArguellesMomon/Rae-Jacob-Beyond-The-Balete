import type { CharacterId, DialogueLine, Emotion, Gesture, MapId, Player } from './model.ts';

/** Distance-driven cycles stay in step when frame rate or walking speed changes. */
export function walkFrame(id: CharacterId, stride: number) {
  const traveler = id === 'rae' || id === 'tala';
  return Math.floor(Math.max(0, Number.isFinite(stride) ? stride : 0) / (id === 'tala' ? 3 : traveler ? 4 : 5)) % (traveler ? 8 : 6);
}
export function idleActing(id: CharacterId, clock: number, map?: MapId): { gesture: Gesture; emotion: Emotion } {
  if (id === 'lola') return { gesture: 'idle', emotion: 'warm' };
  if (id === 'mayumi') return { gesture: 'idle', emotion: 'warm' };
  if (id === 'rae') {
    const t = clock % 13;
    if (t < 1.4) return { gesture: 'brush', emotion: 'neutral' };
    if (map === 'clearing' && t > 8 && t < 10) return { gesture: 'listen', emotion: 'curious' };
    if (t > 5 && t < 6.5) return { gesture: 'think', emotion: 'curious' };
  }
  if (id === 'tala') return { gesture: map === 'waterworks' ? 'guardMap' : clock % 8 < 2.5 ? 'map' : clock % 8 > 6.3 ? 'listen' : 'idle', emotion: 'neutral' };
  if (id === 'minda' && clock % 6 < 2.5) return { gesture: 'work', emotion: 'determined' };
  return { gesture: 'idle', emotion: 'neutral' };
}
export function actingGesture(id: CharacterId, actor: Player, clock: number, speaking: boolean, line?: DialogueLine, map?: MapId): Gesture {
  if (actor.moving) return id === 'tala' && map === 'waterworks' && actor.facing !== 'up' ? 'guardMap' : 'idle';
  if (speaking) return line?.gesture ?? (line?.emotion === 'worried' ? 'think' : 'talk');
  return idleActing(id, clock, map).gesture;
}
