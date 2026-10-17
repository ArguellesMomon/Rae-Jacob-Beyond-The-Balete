import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';
import { AUDIO_SOURCES } from './catalog';
import type { Channel, Cue, PlaybackPort, Track } from './director';

// Exactly four managed voices: music, ambience, one story/UI cue, and quiet footsteps.
export function createPlayback(onIssue: (failed: boolean) => void): PlaybackPort {
  type Voice = { player: AudioPlayer; source: string | null; wanted: boolean; generation: number; volume: number; loop: boolean };
  const make = (): Voice => ({ player: createAudioPlayer(null, { updateInterval: 1000 }), source: null, wanted: false, generation: 0, volume: -1, loop: false });
  const voices = { music: make(), ambience: make(), effect: make(), step: make() };
  let configured = false, configuring = false, unlocked = false, disposed = false;
  const safe = (action: () => void) => { if (!disposed) try { action(); } catch { onIssue(true); } };
  const run = (voice: Voice) => { if (configured && unlocked && voice.wanted) safe(() => voice.player.play()); };
  const subscriptions = Object.values(voices).map(voice => voice.player.addListener('playbackStatusUpdate', status => {
    if (status.isLoaded && voice.wanted && !status.playing && !status.didJustFinish && voice.player.currentTime === 0) run(voice);
    if (status.didJustFinish && !voice.player.loop) voice.wanted = false;
  }));
  const configure = () => {
    if (configured || configuring || disposed) return;
    configuring = true;
    void setAudioModeAsync({ playsInSilentMode: false, allowsRecording: false, shouldPlayInBackground: false, interruptionMode: 'mixWithOthers', shouldRouteThroughEarpiece: false }).then(() => {
      configured = true; configuring = false; for (const voice of Object.values(voices)) run(voice);
    }).catch(() => { configuring = false; if (!disposed) onIssue(true); });
  };
  configure();
  const load = (voice: Voice, source: Track | Cue, volume: number, loop: boolean) => safe(() => {
    const changed = voice.source !== source, wasWanted = voice.wanted;
    const gain = Math.max(0, Math.min(1, volume));
    if (voice.volume !== gain) { voice.player.volume = gain; voice.volume = gain; }
    if (voice.loop !== loop) { voice.player.loop = loop; voice.loop = loop; }
    if (changed) { voice.generation++; voice.player.pause(); voice.source = source; voice.player.replace(AUDIO_SOURCES[source]); }
    voice.wanted = true;
    if (!loop && !changed) {
      const generation = ++voice.generation;
      voice.player.pause();
      void voice.player.seekTo(0).then(() => { if (!disposed && generation === voice.generation && voice.wanted) run(voice); }).catch(() => { if (!disposed) onIssue(true); });
    } else if (changed || !wasWanted) run(voice);
  });
  return {
    loop(channel: Channel, source: Track | null, volume: number) {
      const voice = voices[channel];
      if (!source || !volume) { if (voice.wanted) safe(() => voice.player.pause()); voice.wanted = false; return; }
      load(voice, source, volume, true);
    },
    cue(source, volume) { if (volume > 0) load(source === 'step' ? voices.step : voices.effect, source, volume, false); },
    unlock() { unlocked = true; if (configured) onIssue(false); else configure(); for (const voice of Object.values(voices)) if (!voice.player.playing) run(voice); },
    stop() { for (const voice of Object.values(voices)) { if (voice.wanted) safe(() => voice.player.pause()); voice.wanted = false; voice.generation++; } },
    silenceEffects() { for (const voice of [voices.effect, voices.step]) { if (voice.wanted) safe(() => voice.player.pause()); voice.wanted = false; voice.generation++; } },
    dispose() {
      if (disposed) return;
      for (const subscription of subscriptions) subscription.remove();
      for (const voice of Object.values(voices)) { try { voice.player.pause(); voice.player.release(); } catch { /* Already released during native teardown. */ } }
      disposed = true;
    },
  };
}
