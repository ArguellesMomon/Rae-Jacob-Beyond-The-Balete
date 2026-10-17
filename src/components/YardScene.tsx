import { InteractionFocus } from './InteractionFocus';
import { memo } from 'react';
import Svg, { G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { YardBase, YardForeground, YardLaundry, YardLight } from './YardEnvironment';
import type { InteractionId, Player, Progress } from '../game/model';
import { INTERACTIONS, WORLD } from '../game/world';
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
  const target = INTERACTIONS.find(item => item.id === targetId);
  const rae = <G key="rae"><G transform={`translate(${Math.round(player.x)} ${Math.round(player.y)})`}><Path d="M-6-1H5L19 8H8z" fill="#5b4430" opacity={.18} /></G><CharacterSprite map="yard" id="rae" actor={player} clock={clock} line={line} /></G>;
  const lola = <CharacterSprite map="yard" key="lola" id="lola" actor={{ x: 203, y: 186, facing: 'down', moving: false, stride: 0 }} clock={clock} line={line} greeting={!line && Math.hypot(player.x - 203, player.y - 194) < 85} />;
  return <Svg width={width} height={height} viewBox={`${Math.round(cameraX)} ${Math.round(cameraY)} ${vw} ${vh}`}>
    <YardBase /><YardLight frame={lightFrame} layer="ground" />
    {!behindLaundry && <YardLaundry frame={laundryFrame} />}
    {progress?.discoveries.includes('herbBed') && <G><Rect x={138} y={365} width={6} height={1} fill="#9d784d" /><Rect x={142} y={364} width={2} height={1} fill="#b4955c" /></G>}
    {player.y < 185 ? [rae, lola] : [lola, rae]}
    {behindLaundry && <YardLaundry frame={laundryFrame} />}
    <YardForeground player={player} />
    {targetId === 'balete' && <G opacity={0.45 + Math.sin(clock * 3) * 0.2}><Rect x={541} y={148} width={10} height={10} fill="#d6dfad" /><Rect x={543} y={150} width={6} height={6} fill="#f4edc9" /></G>}
    <YardLight frame={lightFrame} />
    {target && <InteractionFocus point={target.point} clock={envClock} talk={target.action === 'Talk'} />}
    {target && <G transform={`translate(${target.point.x} ${target.point.y - 34 - Math.floor(Math.sin(clock * 4) * 1.5)})`}>
      <Path d="M-4 0h8v2H2v2H0v2h-1V4h-2V2h-1z" fill="#f9edc8" />
      <Path d="M-3-3h6v2h-6z" fill="#f9edc8" />
    </G>}
    {(!overview || targetId === 'lola') && <G opacity={0.9}><Rect x={180} y={149} width={45} height={9} fill="#fff0cb" /><SvgText x={202.5} y={155.5} textAnchor="middle" fontSize={5.5} fontWeight="600" fill="#5c563d">Lola Selya</SvgText></G>}
  </Svg>;
});
