import { actingGesture, idleActing, walkFrame } from '../game/acting';
import { memo } from 'react';
import { G, Rect, SvgXml } from 'react-native-svg';
import { characterPortraitSvg, characterSpriteSvg } from '../art/characterArt';
import { characterFromSpeaker } from '../game/characters';
import type { CharacterId, DialogueLine, Emotion, Gesture, MapId, Player } from '../game/model';

export const CharacterSprite = memo(function CharacterSprite({ id, actor, clock, line, pose, greeting = false, map }: { id: Exclude<CharacterId, 'uban' | 'bagtas'>; actor: Player; clock: number; line?: DialogueLine; pose?: Gesture; greeting?: boolean; map?: MapId }) {
  const speaking = characterFromSpeaker(line?.speaker) === id;
  const blink = (clock + (id === 'rae' ? 0 : id === 'tala' ? 1.3 : 2.8)) % 5.7 < .14;
  const mouth = speaking ? Math.floor(clock * 6) % 3 === 0 ? 1 : 0 : 0;
  const gesture: Gesture = pose ?? (!speaking && greeting && clock % 7 < 2 ? 'wave' : actingGesture(id, actor, clock, speaking, line, map));
  const frame = actor.moving ? walkFrame(id, actor.stride) : ['wave', 'work', 'reach', 'pull', 'brush', 'celebrate'].includes(gesture) ? Math.floor(clock * 3) % 2 ? -3 : -4 : Math.floor(clock * .65) % 2 ? -1 : -2;
  const small = id === 'tala' || id === 'minda', w = small ? 18 : 20, h = small ? 22 : 30;
  // Travelers animate their torso above planted feet inside the source art.
  const bounce = id !== 'rae' && id !== 'tala' && actor.moving && frame % 3 === 1 ? 1 : 0;
  const body = characterSpriteSvg(id, actor.facing, frame, gesture, speaking ? line?.emotion ?? 'neutral' : idleActing(id, clock, map).emotion, blink, mouth);
  return <G transform={`translate(${Math.round(actor.x)} ${Math.round(actor.y)})`}>
    <Rect x={-w / 2 + 2} y={-1} width={w - 4} height={3} fill="#142e2b" opacity={.28} />
    <G transform={`translate(${-w / 2} ${-h - bounce})`}><SvgXml xml={body} width={w} height={h} /></G>
  </G>;
});

export const CharacterPortrait = memo(function CharacterPortrait({ who, size = 80, emotion = 'neutral', clock = 1, speaking = false }: { who: CharacterId; size?: number; emotion?: Emotion; clock?: number; speaking?: boolean }) {
  const blink = (clock + (who === 'rae' ? 0 : 1.9)) % 5.4 < .16;
  const mouth = speaking && Math.floor(clock * 6) % 3 === 0 ? 1 : 0;
  return <SvgXml xml={characterPortraitSvg(who, emotion, blink, mouth)} width={size * 80 / 96} height={size} />;
});
