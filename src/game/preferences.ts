export type Preferences = { music: number; effects: number; gentleCamera: boolean; waterMotion: boolean; ambientMotion: boolean; largeText: boolean };
export const DEFAULT_PREFERENCES: Preferences = { music: .3, effects: .65, gentleCamera: true, waterMotion: true, ambientMotion: true, largeText: false };
export const PREFERENCES_KEY = '@rae-jacob/preferences/v1';
export function parsePreferences(raw: string | null): Preferences {
  try {
    const value = JSON.parse(raw ?? '{}');
    const volume = (v: unknown, fallback: number) => typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : fallback;
    return { music: volume(value?.music, DEFAULT_PREFERENCES.music), effects: volume(value?.effects, DEFAULT_PREFERENCES.effects), gentleCamera: typeof value?.gentleCamera === 'boolean' ? value.gentleCamera : true, waterMotion: typeof value?.waterMotion === 'boolean' ? value.waterMotion : true, ambientMotion: typeof value?.ambientMotion === 'boolean' ? value.ambientMotion : true, largeText: typeof value?.largeText === 'boolean' ? value.largeText : false };
  } catch { return { ...DEFAULT_PREFERENCES }; }
}
