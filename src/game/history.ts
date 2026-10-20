import type { Dialogue, HistoryEntry, MapId } from './model.ts';
export const HISTORY_LIMIT = 600;
const speakers = ['Aling Dalisay', 'Mayumi', 'Luning', 'Bagtas', 'Rae Jacob', 'Lola Selya', 'Someone?', 'Tala', 'Minda', 'Mang Uban', 'Nilo', 'Sela', 'Doro', 'Pilo'];
export function parseHistory(value: unknown): HistoryEntry[] {
  if (!Array.isArray(value)) return [];
  return value.slice(-HISTORY_LIMIT).flatMap((entry, index) => {
    if (!entry || !['yard', 'clearing', 'grove', 'waterworks', 'bamboo', 'turning', 'rainroad', 'hamlet', 'spring'].includes(entry.mapId) || !speakers.includes(entry.speaker) || typeof entry.text !== 'string' || !entry.text.trim()) return [];
    return [{ seq: index + 1, mapId: entry.mapId as MapId, scene: typeof entry.scene === 'string' ? entry.scene.slice(0, 60) : '', speaker: entry.speaker as HistoryEntry['speaker'], text: entry.text.slice(0, 1800), ...(typeof entry.beat === 'string' ? { beat: entry.beat.slice(0, 500) } : {}) }];
  });
}
export function rememberLine(history: HistoryEntry[], dialogue: Dialogue, mapId: MapId): HistoryEntry[] {
  const line = dialogue.lines[dialogue.index];
  if (!line) return history;
  return [...history, { seq: (history.at(-1)?.seq ?? 0) + 1, mapId, scene: dialogue.id, speaker: line.speaker, text: line.text, ...(line.beat ? { beat: line.beat } : {}) }].slice(-HISTORY_LIMIT);
}
export function searchHistory(entries: HistoryEntry[], query: string, map?: MapId) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return entries.filter(e => (!map || e.mapId === map) && words.every(word => `${e.speaker} ${e.text} ${e.beat ?? ''}`.toLocaleLowerCase().includes(word)));
}
