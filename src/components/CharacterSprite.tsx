import { actingGesture, idleActing, walkFrame } from '../game/acting';
import { memo, useId } from 'react';
import { ClipPath, Defs, G, Image as SvgImage, Rect, SvgXml } from 'react-native-svg';
import { Platform } from 'react-native';
import { characterPortraitSvg, characterSpriteSvg } from '../art/characterArt';
import { mayumiAuraSvg } from '../art/mayumiArt';
import { characterFromSpeaker } from '../game/characters';
import type { CharacterId, DialogueLine, Emotion, Gesture, MapId, Player } from '../game/model';
import { travelerFrameLayout, travelerFrameCell } from '../game/travelerAtlas';
import { SceneArt } from './SceneArt';

export const TRAVELER_WALK_IMAGES=[require('../../assets/characters/rae-frames-mobile-v2.png'),require('../../assets/characters/tala-frames-mobile-v2.png')] as const;

export const CharacterSprite = memo(function CharacterSprite({ id, actor, clock, line, pose, greeting = false, map, ambientMotion = true, insideOut = false }: { id: Exclude<CharacterId, 'uban' | 'bagtas'>; actor: Player; clock: number; line?: DialogueLine; pose?: Gesture; greeting?: boolean; map?: MapId; ambientMotion?: boolean; insideOut?: boolean }) {
  const clipId=`traveler-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`;
  const speaking = characterFromSpeaker(line?.speaker) === id;
  const blink = (clock + (id === 'rae' ? 0 : id === 'tala' ? 1.3 : 2.8)) % 5.7 < .14;
  const mouth = speaking ? Math.floor(clock * 6) % 3 === 0 ? 1 : 0 : 0;
  const gesture: Gesture = pose ?? (!speaking && greeting && clock % 7 < 2 ? 'wave' : actingGesture(id, actor, clock, speaking, line, map));
  const frame = actor.moving ? walkFrame(id, actor.stride) : ['wave', 'work', 'reach', 'pull', 'brush', 'celebrate'].includes(gesture) ? Math.floor(clock * 3) % 2 ? -3 : -4 : Math.floor(clock * .65) % 2 ? -1 : -2;
  const small = id === 'tala' || id === 'minda', w = id === 'mayumi' ? 26 : id === 'luning' ? 20 : small ? 18 : 20, h = id === 'mayumi' ? 45.5 : id === 'luning' ? 25 : small ? 22 : 30;
  // Travelers animate their torso above planted feet inside the source art.
  const bounce = id !== 'rae' && id !== 'tala' && actor.moving && frame % 3 === 1 ? 1 : 0;
  const emotion=speaking ? line?.emotion ?? 'neutral' : gesture === 'celebrate' ? 'delighted' : idleActing(id, clock, map).emotion;
  // Keep the same image and clip mounted through stride, blink and idle changes.
  const cell=Platform.OS!=='web'&&(id==='rae'||id==='tala')&&!speaking?travelerFrameCell(id,actor.facing,frame,blink,emotion,gesture):null;
  const crop=cell?travelerFrameLayout(cell,w,h):null;
  const body = cell?'':characterSpriteSvg(id, actor.facing, frame, gesture, emotion, blink, mouth);
  return <G transform={`translate(${Math.round(actor.x)} ${Math.round(actor.y)})`}>
    {id === 'mayumi' && <G transform="translate(-24 -61)"><SceneArt xml={mayumiAuraSvg(clock, ambientMotion)} width={48} height={66} /></G>}
    <Rect x={-w / 2 + 2} y={-1} width={w - 4} height={3} fill="#142e2b" opacity={.28} />
    {crop?<G transform={`translate(${crop.x} ${crop.y})`}>
      <Defs><ClipPath id={clipId}><Rect width={crop.width} height={crop.height}/></ClipPath></Defs>
      <G clipPath={`url(#${clipId})`}><SvgImage href={TRAVELER_WALK_IMAGES[id==='rae'?0:1]} x={crop.imageX} y={crop.imageY} width={crop.imageWidth} height={crop.imageHeight} preserveAspectRatio="none"/></G>
    </G>:<G transform={`translate(${-w / 2} ${-h - bounce})`}><SceneArt xml={body} width={w} height={h} /></G>}
    {id === 'rae' && insideOut && <G><Rect x={actor.facing === 'left' ? -4 : 3} y={-15} width={.7} height={6} fill="#8baca3" /><Rect x={actor.facing === 'left' ? -5 : 3} y={-13} width={2} height={1.5} fill="#eee6cc" /></G>}
  </G>;
});

export const CharacterPortrait = memo(function CharacterPortrait({ who, size = 80, emotion = 'neutral', clock = 1, speaking = false }: { who: CharacterId; size?: number; emotion?: Emotion; clock?: number; speaking?: boolean }) {
  const blink = (clock + (who === 'rae' ? 0 : 1.9)) % 5.4 < .16;
  const mouth = speaking && Math.floor(clock * 6) % 3 === 0 ? 1 : 0;
  return <SvgXml xml={characterPortraitSvg(who, emotion, blink, mouth)} width={size * 80 / 96} height={size} />;
});
