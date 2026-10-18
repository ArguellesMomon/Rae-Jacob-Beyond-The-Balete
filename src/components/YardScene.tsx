import { memo } from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { YardBase, YardForeground, YardLaundry, YardLight } from './YardEnvironment';
import type { InteractionId, Player, Progress } from '../game/model';
import { WORLD } from '../game/world';
import { useSceneCamera } from '../hooks/useSceneCamera';
import { CharacterPortrait, CharacterSprite } from './CharacterSprite';
import type { DialogueLine, Emotion } from '../game/model';

export function Portrait({ who, size = 64, emotion, clock }: { who: 'rae' | 'lola' | 'tala' | 'minda' | 'uban'; size?: number; emotion?: Emotion; clock?: number }) {
  return <CharacterPortrait who={who} size={size} emotion={emotion} clock={clock} />;
}

export const YardScene = memo(function YardScene({ player, width, height, clock, targetId, overview = false, gentleCamera = true, line, progress, ambientMotion = true }: { player: Player; width: number; height: number; clock: number; targetId?: InteractionId; overview?: boolean; gentleCamera?: boolean; line?: DialogueLine; progress?: Progress; ambientMotion?: boolean }) {
  const envClock = ambientMotion ? clock : 1;
  const lightFrame = Math.floor(envClock * 3), laundryFrame = Math.floor(envClock * 1.3) % 4;
  const behindLaundry = player.y < 249;
  const px = overview ? 320 : player.x, py = overview ? 180 : player.y - 24;
  const titleView = { width: Math.min(640, 448 * width / height), height: Math.min(448, 640 * height / width) };
  const { cameraX, cameraY, vw, vh } = useSceneCamera(width, height, WORLD, { x: px, y: py }, clock, gentleCamera, overview ? titleView : undefined);
  const rae = <G key="rae"><G transform={`translate(${Math.round(player.x)} ${Math.round(player.y)})`}><Path d="M-6-1H5L19 8H8z" fill="#5b4430" opacity={.18} /></G><CharacterSprite map="yard" id="rae" actor={player} clock={clock} line={line} /></G>;
  const lola = <CharacterSprite map="yard" key="lola" id="lola" actor={{ x: 203, y: 186, facing: 'down', moving: false, stride: 0 }} clock={clock} line={line} greeting={!line && Math.hypot(player.x - 203, player.y - 194) < 85} />;
  return <Svg width={width} height={height} viewBox={`${Math.round(cameraX)} ${Math.round(cameraY)} ${vw} ${vh}`}>
    <YardBase /><YardLight frame={lightFrame} layer="ground" />
    {!behindLaundry && <YardLaundry frame={laundryFrame} />}
    {player.y < 185 ? [rae, lola] : [lola, rae]}
    {behindLaundry && <YardLaundry frame={laundryFrame} />}
    <YardForeground player={player} />
    <YardLight frame={lightFrame} />
    {/* Nearby actions appear on the interaction button. */}
  </Svg>;
});
