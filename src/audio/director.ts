import type { Dialogue, MapId, Player, Progress } from '../game/model.ts';
import type { Preferences } from '../game/preferences.ts';

export type Track = 'afternoon' | 'silong' | 'garden' | 'forest' | 'water';
export type Cue = 'tap' | 'step' | 'push' | 'lever' | 'bell' | 'clang' | 'found' | 'crossing' | 'hooves' | 'complete';
export type Channel = 'music' | 'ambience';
export type PlaybackPort = {
  loop: (channel: Channel, source: Track | null, volume: number) => void;
  cue: (source: Cue, volume: number) => void;
  stop: () => void;
  silenceEffects: () => void;
  unlock: () => void;
  dispose: () => void;
};
export type SoundSnapshot = { mode: string; mapId: MapId; progress: Progress; player: Player; dialogue: Dialogue | null; clock: number; focused: boolean };
const activeMode = (mode: string) => ['springRestoring', 'springSealing', 'mayumiQuestions', 'chapterTwoEnding', 'playing', 'reply', 'watching', 'pathTurning', 'questions', 'mangQuestions', 'bagtasQuestions', 'lolaQuestions', 'mindaQuestions', 'crossing', 'revealing', 'retrieving', 'sealRevealing', 'ending', 'tools'].includes(mode);

export class SoundDirector {
  private previous: SoundSnapshot | null = null;
  private stride = 0;
  private nextClang = 0;
  private protectedUntil = 0;
  private latest: { snapshot: SoundSnapshot; settings: Preferences } | null = null;
  private readonly port: PlaybackPort;
  constructor(port: PlaybackPort) { this.port = port; }

  update(snapshot: SoundSnapshot, settings: Preferences) {
    const priorSettings = this.latest?.settings;
    this.latest = { snapshot, settings };
    const before = this.previous;
    this.previous = snapshot;
    const active = snapshot.focused && activeMode(snapshot.mode);
    if (!active) {
      if (!before || before.focused && activeMode(before.mode)) this.port.stop();
      if (!settings.effects && priorSettings?.effects) this.port.silenceEffects();
      this.stride = snapshot.player.stride; this.nextClang = snapshot.clock + 2.4; return;
    }
    const continuing = !!before && before.focused && activeMode(before.mode) && before.mapId === snapshot.mapId;
    const talking = !!snapshot.dialogue || snapshot.mode === 'questions' || snapshot.mode.endsWith('Questions');
    const reflective = snapshot.mode === 'watching' || snapshot.dialogue?.id === 'afterBell';
    const groveHush = snapshot.mapId === 'grove' ? .72 : snapshot.mapId === 'bamboo' || snapshot.mapId === 'turning' ? .84 : 1;
    this.port.loop('music', settings.music ? snapshot.mapId === 'yard' ? 'afternoon' : 'silong' : null, settings.music * groveHush * (reflective ? .6 : 1) * (talking ? .48 : 1));
    const nearWater = snapshot.mapId === 'spring' || snapshot.mapId === 'hamlet' || snapshot.mapId === 'waterworks' || snapshot.mapId === 'clearing' && snapshot.player.x > 420;
    const bed: Track = nearWater ? 'water' : snapshot.mapId === 'yard' ? 'garden' : 'forest';
    const channelX = snapshot.progress.flowDiverted ? 222 : 432;
    const proximity = snapshot.mapId === 'waterworks' ? .5 + .5 * Math.max(0, 1 - Math.hypot(snapshot.player.x - channelX, snapshot.player.y - 333) / 320) : 1;
    this.port.loop('ambience', settings.effects ? bed : null, settings.effects * proximity * (nearWater ? snapshot.progress.flowDiverted ? .13 : .24 : snapshot.mapId === 'grove' ? .14 : .2) * (talking ? .5 : 1));
    if (!continuing) { this.stride = snapshot.player.stride; this.nextClang = snapshot.clock + 2.4; }
    if (!settings.effects) { this.port.silenceEffects(); this.protectedUntil = 0; return; }
    const play = (cue: Cue, gain = 1, protect = 0) => {
      this.port.cue(cue, settings.effects * gain);
      if (protect) this.protectedUntil = snapshot.clock + protect;
    };
    if (snapshot.mode === 'crossing' && before?.mode !== 'crossing') play('crossing', .65, 1.5);
    if (continuing && before) {
      if (!before.progress.rainlit.complete && snapshot.progress.rainlit.complete) play('complete', .75, 3.2);
      else if (!before.progress.rainlit.restored && snapshot.progress.rainlit.restored) play('found', .5, 1.1);
      else if (!before.progress.rainlit.rootBraced && snapshot.progress.rainlit.rootBraced) play('push', .5, .8);
      else if (!before.progress.chapterComplete && snapshot.progress.chapterComplete) play('complete', .8, 3.2);
      else if (!before.progress.ubanGiftReceived && snapshot.progress.ubanGiftReceived) play('found', .55, 1.1);
      else if (!before.progress.bellRung && snapshot.progress.bellRung) play('bell', .85, 2.6);
      else if (before.mode === 'retrieving' && snapshot.mode === 'playing') play('found', .7, 1.1);
      else if (!before.progress.branchMoved && snapshot.progress.branchMoved) play('push', .65, .6);
      else if (before.progress.flowDiverted !== snapshot.progress.flowDiverted) play('lever', .6, .4);
      else if (snapshot.dialogue?.lines[snapshot.dialogue.index]?.cue === 'hooves' && (before.dialogue?.id !== snapshot.dialogue.id || before.dialogue.index !== snapshot.dialogue.index)) play('hooves', .7, .8);
      else if (snapshot.clock >= this.protectedUntil && snapshot.dialogue && (snapshot.dialogue.id !== before.dialogue?.id || snapshot.dialogue.index !== before.dialogue?.index)) play('tap', .16);
    }
    if (snapshot.mode === 'playing' && !snapshot.dialogue && snapshot.player.moving && snapshot.player.stride - this.stride >= 16) {
      this.stride = snapshot.player.stride; play('step', .15);
    }
    const ringing = snapshot.mapId !== 'yard' && !snapshot.progress.bellRecovered && !snapshot.progress.flowDiverted;
    if (ringing && snapshot.mode === 'playing' && !snapshot.dialogue && snapshot.clock >= this.nextClang && snapshot.clock >= this.protectedUntil) {
      play('clang', snapshot.mapId === 'waterworks' ? .4 : .13, .9); this.nextClang = snapshot.clock + 10.3;
    }
  }
  unlock() { this.port.unlock(); }
  suspend() {
    this.port.stop();
    if (this.previous) this.previous = { ...this.previous, focused: false };
  }
  preview() { this.port.unlock(); this.port.cue('bell', (this.latest?.settings.effects ?? .65) * .7); }
  dispose() { this.port.dispose(); }
}
