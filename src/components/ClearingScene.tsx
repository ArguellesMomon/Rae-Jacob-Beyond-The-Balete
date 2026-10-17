import { InteractionFocus } from './InteractionFocus';
import { ClearingBase, ClearingForeground, ClearingLight, ClearingRecovery, ClearingState } from './ClearingEnvironment';
import { memo, useEffect, useRef } from 'react';
import Svg, { G, Path, Rect, SvgXml, Text as SvgText } from 'react-native-svg';
import { BELL_SVG } from '../art/waterworksArt';
import type { DialogueLine, InteractionId, Player, Progress } from '../game/model';
import { CharacterSprite } from './CharacterSprite';
import { CLEARING_WORLD, getMap } from '../game/world';
import { useSceneCamera } from '../hooks/useSceneCamera';
import { residentsIn, RESIDENTS } from '../game/residents';
import { ResidentSprite } from './ResidentSprite';

export const ClearingScene = memo(function ClearingScene({ player, companion, metTala, progress, width, height, clock, targetId, overview = false, gentleCamera = true, line, ambientMotion = true, reflecting = false }: { player: Player; companion: Player; metTala: boolean; progress: Progress; width: number; height: number; clock: number; targetId?: InteractionId; overview?: boolean; gentleCamera?: boolean; line?: DialogueLine; ambientMotion?: boolean; reflecting?: boolean }) {
  const envClock = ambientMotion ? clock : 1;
  const reflectionAt = useRef<number | null>(null);
  if (!reflecting) reflectionAt.current = null;
  else if (reflectionAt.current === null) reflectionAt.current = clock;
  const recoveryClock = reflecting ? clock - reflectionAt.current! : clock;
  const lightFrame = Math.floor(envClock * 3);
  const previousRing = useRef(progress.bellRung), ringAt = useRef(-100);
  useEffect(() => { if (progress.bellRung && !previousRing.current) ringAt.current = clock; previousRing.current = progress.bellRung; }, [progress.bellRung, clock]);
  const ringAge = clock - ringAt.current;
  const bellSwing = Math.sin(ringAge * 16) * 18 * Math.max(0, 1 - ringAge / 1.6);
  const minda = progress.bellReturned ? { x: 411, y: 337 } : { x: 408, y: 227 };
  const wideView = { width: Math.min(576, 448 * width / height), height: Math.min(448, 576 * height / width) };
  const { cameraX, cameraY, vw, vh } = useSceneCamera(width, height, CLEARING_WORLD, { x: overview ? 288 : reflecting ? 284 : player.x, y: overview ? 240 : reflecting ? 246 : player.y - 24 }, clock, gentleCamera, overview || reflecting ? wideView : undefined);
  const item = getMap('clearing', progress).interactions.find(entry => entry.id === targetId);
  const target = item?.id === 'tala' ? { ...item, point: companion } : item;
  const actors = [
    ...residentsIn('clearing').map(id => ({ id, y: RESIDENTS[id].y - 8, node: <ResidentSprite id={id} clock={clock} line={line} /> })),
    { id: 'rae', y: player.y, node: <CharacterSprite map="clearing" id="rae" actor={player} clock={clock} line={line} /> },
    { id: 'tala', y: companion.y, node: <CharacterSprite map="clearing" id="tala" actor={companion} clock={clock} line={line} /> },
    { id: 'minda', y: minda.y, node: <CharacterSprite map="clearing" id="minda" actor={{ ...minda, facing: 'down', moving: false, stride: 0 }} clock={clock} line={line} /> },
  ].sort((a, b) => a.y - b.y);
  return <Svg width={width} height={height} viewBox={`${Math.round(cameraX)} ${Math.round(cameraY)} ${vw} ${vh}`}>
    <ClearingBase /><ClearingState progress={progress} />
    <ClearingLight progress={progress} frame={lightFrame} layer="ground" />
    <ClearingRecovery progress={progress} frame={Math.floor((ambientMotion ? recoveryClock : 10) * 3)} />
    {progress.bellHung && <G transform={`rotate(${bellSwing} 382 300)`}><G transform="translate(375 302)"><SvgXml xml={BELL_SVG} width={15} height={16} /></G></G>}
    {ringAge >= 0 && ringAge < 1.6 && <G opacity={1 - ringAge / 1.6}><Rect x={367} y={277 - ringAge * 4} width={30} height={10} rx={2} fill="#f1e2b4" /><SvgText x={382} y={284 - ringAge * 4} textAnchor="middle" fontSize={5} fill="#58714e">DING</SvgText></G>}
    {actors.map(actor => <G key={actor.id}>{actor.node}</G>)}
    <ClearingForeground player={player} />
    <ClearingLight progress={progress} frame={lightFrame} />
    {!metTala && <G><Rect x={169} y={247} width={38} height={9} rx={2} fill="#faf0cf" /><SvgText x={188} y={253.5} textAnchor="middle" fontSize={5.5} fill="#455c4b">Tala</SvgText><Path d="M187 258h2v6h-2z M187 266h2v2h-2z" fill="#f0d18b" /></G>}
    <G opacity={0.8}><Rect x={minda.x - 16} y={minda.y - 35} width={33} height={8} rx={2} fill="#efddad" /><SvgText x={minda.x} y={minda.y - 29} textAnchor="middle" fontSize={5} fill="#455c4b">Minda</SvgText></G>
    {target && <InteractionFocus point={target.point} clock={envClock} talk={target.action === 'Talk'} />}
    {target && <G transform={`translate(${Math.round(target.point.x)} ${Math.round(target.point.y - 29 - Math.sin(clock * 4))})`}><Path d="M-4 0h8v2H2v2H0v2h-1V4h-2V2h-1z" fill="#f7df9a" /></G>}
  </Svg>;
});
