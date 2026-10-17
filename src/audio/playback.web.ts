import { Asset } from 'expo-asset';
import { AUDIO_SOURCES } from './catalog';
import type { Channel, Cue, PlaybackPort, Track } from './director';

// Keep each HTMLAudioElement across source changes. Catch play() rejections so an
// autoplay restriction leaves a usable silent game and a clear retry control.
export function createPlayback(onIssue: (failed: boolean) => void): PlaybackPort {
  type Voice = { media: HTMLAudioElement; source: string | null; wanted: boolean; generation: number };
  const make = (source: Track | Cue): Voice => {
    const media = new Audio(Asset.fromModule(AUDIO_SOURCES[source]).uri); media.preload = 'auto'; media.volume = 0;
    const voice = { media, source, wanted: false, generation: 0 };
    media.onended = () => { if (!media.loop) voice.wanted = false; };
    return voice;
  };
  const voices = { music: make('afternoon'), ambience: make('garden'), effect: make('tap'), step: make('step') };
  let unlocked = false, disposed = false;
  const play = (voice: Voice) => {
    if (!unlocked || disposed || !voice.wanted) return;
    const generation = voice.generation;
    void voice.media.play().catch(error => {
      if (!disposed && voice.wanted && generation === voice.generation && error?.name !== 'AbortError') onIssue(true);
    });
  };
  const load = (voice: Voice, source: Track | Cue, volume: number, loop: boolean) => {
    const changed = voice.source !== source, wasWanted = voice.wanted;
    voice.media.volume = Math.max(0, Math.min(1, volume)); voice.media.loop = loop;
    if (changed) { voice.generation++; voice.media.pause(); voice.source = source; voice.media.src = Asset.fromModule(AUDIO_SOURCES[source]).uri; }
    voice.wanted = true;
    if (!loop) { voice.generation++; voice.media.currentTime = 0; }
    if (changed || !loop || !wasWanted) play(voice);
  };
  return {
    loop(channel: Channel, source: Track | null, volume: number) {
      const voice = voices[channel];
      if (!source || !volume) { if (voice.wanted) voice.media.pause(); voice.wanted = false; return; }
      load(voice, source, volume, true);
    },
    cue(source, volume) { if (volume > 0 && !disposed) load(source === 'step' ? voices.step : voices.effect, source, volume, false); },
    unlock() {
      if (disposed) return;
      const first = !unlocked; unlocked = true; onIssue(false);
      for (const voice of Object.values(voices)) {
        if (voice.wanted && voice.media.paused) play(voice);
        else if (first && !voice.wanted) {
          // Prime the existing elements synchronously inside the user's gesture (Safari).
          voice.media.volume = 0;
          void voice.media.play().then(() => { if (!disposed && !voice.wanted) voice.media.pause(); }).catch(() => {});
        }
      }
    },
    stop() { for (const voice of Object.values(voices)) { voice.generation++; voice.wanted = false; voice.media.pause(); } },
    silenceEffects() { for (const voice of [voices.effect, voices.step]) { voice.generation++; voice.wanted = false; voice.media.pause(); } },
    dispose() { disposed = true; for (const voice of Object.values(voices)) { voice.media.pause(); voice.media.removeAttribute('src'); voice.media.load(); } },
  };
}
