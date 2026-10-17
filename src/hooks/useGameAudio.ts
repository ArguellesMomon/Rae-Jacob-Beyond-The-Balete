import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { SoundDirector } from '../audio/director';
import type { SoundSnapshot } from '../audio/director';
import { createPlayback } from '../audio/playback';
import type { Preferences } from '../game/preferences';

export function useGameAudio(snapshot: Omit<SoundSnapshot, 'focused'>, settings: Preferences, ready: boolean) {
  const director = useRef<SoundDirector | null>(null), focused = useRef(true);
  const latest = useRef({ snapshot, settings, ready }); latest.current = { snapshot, settings, ready };
  const [issue, setIssue] = useState(false);
  useEffect(() => {
    let live = true;
    const sound = new SoundDirector(createPlayback(failed => { if (live) setIssue(failed); }));
    director.current = sound;
    const suspend = () => { focused.current = false; sound.suspend(); };
    const app = AppState.addEventListener('change', state => { focused.current = state === 'active'; if (!focused.current) sound.suspend(); });
    const visibility = () => { if (document.hidden) suspend(); else focused.current = true; };
    const focus = () => { focused.current = true; };
    const key = (event: KeyboardEvent) => { if (!event.repeat) sound.unlock(); };
    if (Platform.OS === 'web') { window.addEventListener('blur', suspend); window.addEventListener('focus', focus); window.addEventListener('keydown', key); document.addEventListener('visibilitychange', visibility); }
    return () => {
      live = false; app.remove();
      if (Platform.OS === 'web') { window.removeEventListener('blur', suspend); window.removeEventListener('focus', focus); window.removeEventListener('keydown', key); document.removeEventListener('visibilitychange', visibility); }
      sound.dispose(); director.current = null;
    };
  }, []);
  useEffect(() => { if (ready) director.current?.update({ ...snapshot, focused: focused.current }, settings); }, [snapshot, settings, ready]);
  const unlock = useCallback(() => { if (latest.current.ready) director.current?.unlock(); }, []);
  const preview = useCallback(() => { if (latest.current.ready) director.current?.preview(); }, []);
  return { unlock, preview, issue };
}
