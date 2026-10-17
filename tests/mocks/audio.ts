export const players: MockPlayer[] = [];
export const modes: Record<string, unknown>[] = [];
export class MockPlayer {
  playing = false; loop = false; volume = 0; currentTime = 0;
  source: unknown = null; plays = 0; replacements = 0; released = 0;
  listeners = new Set<(status: Record<string, unknown>) => void>();
  resolveSeek: (() => void) | null = null;
  play() { this.playing = true; this.plays++; }
  pause() { this.playing = false; }
  replace(source: unknown) { this.source = source; this.currentTime = 0; this.replacements++; }
  seekTo() { this.currentTime = 0; return new Promise<void>(resolve => { this.resolveSeek = resolve; }); }
  addListener(_: string, listener: (status: Record<string, unknown>) => void) { this.listeners.add(listener); return { remove: () => this.listeners.delete(listener) }; }
  release() { this.released++; }
  finish() { this.playing = false; this.currentTime = 2; for (const listener of this.listeners) listener({ isLoaded: true, didJustFinish: true, playing: false }); }
}
export function createAudioPlayer() { const player = new MockPlayer(); players.push(player); return player; }
export async function setAudioModeAsync(mode: Record<string, unknown>) { modes.push(mode); }
