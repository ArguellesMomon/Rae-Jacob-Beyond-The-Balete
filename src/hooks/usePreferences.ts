import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_PREFERENCES, parsePreferences, PREFERENCES_KEY } from '../game/preferences';
import type { Preferences } from '../game/preferences';

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>({ ...DEFAULT_PREFERENCES });
  const [ready, setReady] = useState(false), [saveIssue, setSaveIssue] = useState(false);
  const queue = useRef(Promise.resolve());
  const current = useRef(preferences);
  useEffect(() => {
    let live = true;
    void AsyncStorage.getItem(PREFERENCES_KEY).then(raw => { if (live) { current.current = parsePreferences(raw); setPreferences(current.current); } }).catch(() => { if (live) setSaveIssue(true); }).finally(() => { if (live) setReady(true); });
    return () => { live = false; };
  }, []);
  const update = useCallback((patch: Partial<Preferences>) => {
    if (!ready) return;
    const next = parsePreferences(JSON.stringify({ ...current.current, ...patch }));
    current.current = next; setPreferences(next);
    queue.current = queue.current.then(async () => {
      try { await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(next)); setSaveIssue(false); }
      catch { setSaveIssue(true); }
    });
  }, [ready]);
  return { preferences, ready, saveIssue, update };
}
