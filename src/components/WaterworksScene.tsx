import { InteractionFocus } from './InteractionFocus';
import { WorksBase, WorksFlowBeds, WorksForeground, WorksMotion } from './WaterworksEnvironment';
import { worksPickupY, worksShot, worksStateSvg, worksWheelSvg } from '../art/waterworksEnvironmentArt';
import { flowSurgeSvg } from '../art/flowArt';
import { memo, useMemo } from 'react';
import Svg, { G, Path, Rect, SvgXml, Text as SvgText } from 'react-native-svg';
import { BELL_SVG } from '../art/waterworksArt';
import type { DialogueLine, InteractionId, Player, Progress } from '../game/model';
import { CharacterSprite } from './CharacterSprite';
import { WATERWORKS_INTERACTIONS } from '../game/world';
import { useSceneCamera } from '../hooks/useSceneCamera';
import { ResidentSprite } from './ResidentSprite';
import { useFlowChange } from '../hooks/useFlowChange';
import { flowPresentation } from '../game/flowFeedback';

const Wheels = Array.from({ length: 16 }, (_, i) => worksWheelSvg(i * 22.5));
const Wheel = memo(({ frame }: { frame: number }) => <G transform="translate(406 278)"><SvgXml xml={Wheels[frame]} width={56} height={56} /></G>);

export const WaterworksScene = memo(function WaterworksScene({ player, companion, progress, width, height, clock, targetId, retrieving, focusRoot = false, reveal = 1, gentleCamera = true, line, active = true, waterMotion = true, ambientMotion = true }: { player: Player; companion: Player; progress: Progress; width: number; height: number; clock: number; targetId?: InteractionId; retrieving?: number; focusRoot?: boolean; reveal?: number; gentleCamera?: boolean; line?: DialogueLine; active?: boolean; waterMotion?: boolean; ambientMotion?: boolean }) {
  const envClock = ambientMotion ? clock : 1;
  const waterClock = ambientMotion && waterMotion ? clock : 1;
  const beat = useFlowChange(progress.flowDiverted, clock, active);
  const flow = flowPresentation(beat, clock, player, waterMotion, gentleCamera);
  const flowFocus = flow.active && !focusRoot && retrieving === undefined;
  const state = useMemo(() => worksStateSvg(progress), [progress]);
  const center = worksShot(player, { focusRoot, reveal, retrieving, flowCenter: flowFocus ? flow.center : undefined });
  const { cameraX: cx, cameraY: cy, vw, vh } = useSceneCamera(width, height, { width: 704, height: 480 }, center, clock, gentleCamera, undefined, focusRoot || retrieving !== undefined);
  const wheelFrame = progress.flowDiverted ? 0 : progress.waterRestored ? Math.floor(clock * 9) % 16 : Math.sin(clock * 6) > 0 ? 0 : 1;
  const target = WATERWORKS_INTERACTIONS.find(item => item.id === targetId);
  const targetPoint = targetId === 'tala' ? companion : target?.point;
  const actors = [
    { id: 'rae', y: player.y, node: <CharacterSprite map="waterworks" id="rae" actor={player} clock={clock} line={line} pose={retrieving !== undefined ? retrieving < .5 ? 'reach' : 'pull' : undefined} /> },
    { id: 'tala', y: companion.y, node: <CharacterSprite map="waterworks" id="tala" actor={companion} clock={clock} line={line} /> },
    { id: 'pilo', y: 347, node: <ResidentSprite id="pilo" clock={clock} line={line} /> },
  ].sort((a, b) => a.y - b.y);
  const pickup = retrieving === undefined ? null : worksPickupY(retrieving);
  return <Svg width={width} height={height} viewBox={`${Math.round(cx + (flowFocus ? flow.shakeX : 0))} ${Math.round(cy + (flowFocus ? flow.shakeY : 0))} ${vw} ${vh}`}>
    <WorksBase /><WorksFlowBeds diverted={progress.flowDiverted} /><SvgXml xml={state} width={704} height={480} />
    <WorksMotion frame={Math.floor(waterClock * 6)} progress={progress} layer="water" />
    {flow.active && <SvgXml xml={flowSurgeSvg(flow)} width={704} height={480} />}
    <Wheel frame={wheelFrame} />
    {!progress.bellRecovered && retrieving === undefined && <G transform={`translate(420 ${321 + (!progress.flowDiverted ? Math.round(Math.sin(clock * 6) * 2) : 0)})`}><SvgXml xml={BELL_SVG} width={15} height={16} /></G>}
    {!progress.bellRecovered && !progress.flowDiverted && clock % 6 < 1.3 && <G><Rect x={362} y={255} width={41} height={11} rx={2} fill="#d8d1ab" /><SvgText x={382} y={262.5} textAnchor="middle" fontSize={5} fill="#445f56">CLANG...</SvgText></G>}
    {actors.map(actor => <G key={actor.id}>{actor.node}</G>)}
    {pickup !== null && <G><Path d={`M${player.x + 5} ${player.y - 12} L427 ${pickup}`} fill="none" stroke="#e9d9a9" strokeWidth={1} /><Path d={`M424 ${pickup}h7v5h-7z`} fill="none" stroke="#e9d9a9" strokeWidth={1} /><G transform={`translate(420 ${pickup + 2})`}><SvgXml xml={BELL_SVG} width={16} height={17} /></G></G>}
    <WorksForeground player={player} />
    <WorksMotion frame={Math.floor(envClock * 6)} progress={progress} />
    {focusRoot && <G opacity={.25 + Math.sin(clock * 2) * .08}><Rect x={575} y={153} width={24} height={34} fill="#e4ebd5" opacity={.22} /><Path d="M568 162h-4v17h4 M605 162h4v17h-4" fill="none" stroke="#c0d5bf" strokeWidth={1} /></G>}
    {flow.active && <G><Rect x={cx + vw / 2 - 91} y={cy + 51} width={182} height={13} fill="#203c3be8" /><SvgText x={cx + vw / 2} y={cy + 60} textAnchor="middle" fontFamily="PixelifySans_400Regular" fontSize={7} fill="#f0dfb2">{flow.caption}</SvgText></G>}
    {targetPoint && <InteractionFocus point={targetPoint} clock={envClock} talk={target?.action === 'Talk'} />}
    {targetPoint && <G transform={`translate(${Math.round(targetPoint.x)} ${Math.round(targetPoint.y - 29 - Math.sin(clock * 4))})`}><Path d="M-4 0h8v2H2v2H0v2h-1V4h-2V2h-1z" fill="#f7df9a" /></G>}
  </Svg>;
});
