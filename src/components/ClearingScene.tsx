import { ClearingBase, ClearingForeground, ClearingLight, ClearingRecovery, ClearingState } from './ClearingEnvironment';
import { memo, useEffect, useRef } from 'react';
import Svg, { G, Path, Rect, SvgXml, Text as SvgText } from 'react-native-svg';
import { BELL_SVG } from '../art/waterworksArt';
import type { DialogueLine, InteractionId, Player, Progress } from '../game/model';
import { CharacterSprite } from './CharacterSprite';
import { CLEARING_WORLD } from '../game/world';
import { useSceneCamera } from '../hooks/useSceneCamera';
import { residentsIn, RESIDENTS } from '../game/residents';
import { ResidentSprite } from './ResidentSprite';
import { celebrationNeighbors } from '../game/celebration';
import { celebrantSvg } from '../art/celebrationArt';

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
  const actors = [
    ...residentsIn('clearing').map(id => ({ id, y: RESIDENTS[id].y - 8, node: <ResidentSprite id={id} clock={envClock} line={line} celebrating={progress.bellRung} /> })),
    ...celebrationNeighbors(progress).map(n => ({ id: `guest-${n.id}`, y: n.y, node: <G transform={`translate(${n.x - 9} ${n.y - 22})`}><SvgXml xml={celebrantSvg(n, clock, progress.bellRung, ambientMotion)} width={18} height={24} /></G> })),
    { id: 'rae', y: player.y, node: <CharacterSprite map="clearing" id="rae" actor={player} clock={clock} line={line} /> },
    { id: 'tala', y: companion.y, node: <CharacterSprite map="clearing" id="tala" actor={companion} clock={clock} line={line} /> },
    { id: 'minda', y: minda.y, node: <CharacterSprite map="clearing" id="minda" actor={{ ...minda, facing: 'down', moving: false, stride: 0 }} clock={envClock} pose={progress.bellRung && line?.speaker !== 'Minda' ? 'celebrate' : undefined} line={line} /> },
  ].sort((a, b) => a.y - b.y);
  return <Svg width={width} height={height} viewBox={`${Math.round(cameraX)} ${Math.round(cameraY)} ${vw} ${vh}`}>
    <ClearingBase /><ClearingState progress={progress} />
    <ClearingLight progress={progress} frame={lightFrame} layer="ground" />
    <ClearingRecovery progress={progress} frame={Math.floor((ambientMotion ? recoveryClock : 10) * 3)} />
    {progress.bellHung && <G transform={`rotate(${bellSwing} 382 300)`}><G transform="translate(375 302)"><SvgXml xml={BELL_SVG} width={15} height={16} /></G></G>}
    {actors.map(actor => <G key={actor.id}>{actor.node}</G>)}
    <ClearingForeground player={player} />
    <ClearingLight progress={progress} frame={lightFrame} />
  </Svg>;
});
