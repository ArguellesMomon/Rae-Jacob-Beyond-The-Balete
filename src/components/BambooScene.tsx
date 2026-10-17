import { memo, useMemo } from 'react';
import Svg, { G, Path, Rect, SvgXml, Text as SvgText } from 'react-native-svg';
import { turningStateSvg } from '../art/bambooArt';
import { VergeBase, VergeForeground, VergeWeather } from './BambooEnvironment';
import { TurningBase, TurningForeground, TurningWeather } from './TurningEnvironment';
import { bagtasSpriteSvg } from '../art/bagtasArt';
import type { DialogueLine, InteractionId, Player, Progress } from '../game/model';
import { getMap } from '../game/world';
import { useSceneCamera } from '../hooks/useSceneCamera';
import { CharacterSprite } from './CharacterSprite';
import { InteractionFocus } from './InteractionFocus';
export const BambooScene = memo(function BambooScene({ mapId, width, height, player, companion, progress, clock, targetId, line, gentleCamera = true, ambientMotion = true }: { mapId: 'bamboo' | 'turning'; width: number; height: number; player: Player; companion: Player; progress: Progress; clock: number; targetId?: InteractionId; line?: DialogueLine; gentleCamera?: boolean; ambientMotion?: boolean }) {
  const turning = mapId === 'turning', time = ambientMotion ? clock : 1;
  const view = useSceneCamera(width, height, { width: 640, height: 480 }, { x: player.x, y: player.y - 24 }, clock, gentleCamera);
  const state = useMemo(() => turningStateSvg(progress), [progress.chapterTwo.trailStep]);
  const target = getMap(mapId, progress).interactions.find(item => item.id === targetId);
  const point = target?.id === 'tala' ? companion : target?.point;
  const actors = [
    { y: player.y, id: 'rae', node: <CharacterSprite id="rae" map={mapId} actor={player} clock={clock} line={line} /> },
    { y: companion.y, id: 'tala', node: <CharacterSprite id="tala" map={mapId} actor={companion} clock={clock} line={line} /> },
    ...(!turning ? [{ y: 238, id: 'bagtas', node: <G transform="translate(383 170)"><Rect x={3} y={66} width={29} height={3} fill="#1b3732" opacity={.4} /><SvgXml xml={bagtasSpriteSvg((clock + 2.1) % 6 < .15, line?.speaker === 'Bagtas' && Math.floor(clock * 6) % 3 === 0 ? 1 : 0, line?.speaker === 'Bagtas' ? line.emotion : 'neutral', Math.floor(clock * .65) % 2)} width={34} height={68} /></G> }] : []),
  ].sort((a, b) => a.y - b.y);
  return <Svg width={width} height={height} viewBox={`${view.cameraX} ${view.cameraY} ${view.vw} ${view.vh}`}>
    {turning ? <TurningBase /> : <VergeBase />}
    {turning ? <TurningWeather frame={Math.floor(time * 3)} layer="ground" /> : <VergeWeather frame={Math.floor(time * 4)} layer="ground" />}
    {turning && <SvgXml xml={state} width={640} height={480} />}
    {actors.map(actor => <G key={actor.id}>{actor.node}</G>)}
    {turning ? <><TurningForeground player={player} /><TurningWeather frame={Math.floor(time * 3)} /></> : <><VergeForeground player={player} /><VergeWeather frame={Math.floor(time * 4)} /></>}
    {!turning && <G><Rect x={381} y={154} width={39} height={10} fill="#ead9ac" /><SvgText x={400} y={161} fontSize={6} textAnchor="middle" fill="#425a45">{progress.chapterTwo.metBagtas ? 'Bagtas' : 'A traveler'}</SvgText></G>}
    {point && <InteractionFocus point={point} clock={time} talk={target?.action === 'Talk'} />}
    {point && <G transform={`translate(${Math.round(point.x)} ${Math.round(point.y - 29 - Math.sin(time * 4))})`}><Path d="M-4 0h8v2H2v2H0v2h-1V4h-2V2h-1z" fill="#f7df9a" /></G>}
  </Svg>;
});
