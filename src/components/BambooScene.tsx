import { turningStateSvg } from '../art/bambooArt';
import { turningGlamourSvg } from '../art/turningEnvironmentArt';
import { StoryProps } from './StoryProps';
import { memo, useMemo } from 'react';
import Svg, { G, Path, Rect, SvgXml } from 'react-native-svg';
import { VergeBase, VergeForeground, VergeWeather } from './BambooEnvironment';
import { TurningBase, TurningForeground, TurningWeather } from './TurningEnvironment';
import { bagtasSpriteSvg } from '../art/bagtasArt';
import type { DialogueLine, InteractionId, Player, Progress } from '../game/model';
import { useSceneCamera } from '../hooks/useSceneCamera';
import { CharacterSprite } from './CharacterSprite';
export const BambooScene = memo(function BambooScene({ mapId, width, height, player, companion, progress, clock, targetId, line, gentleCamera = true, ambientMotion = true }: { mapId: 'bamboo' | 'turning'; width: number; height: number; player: Player; companion: Player; progress: Progress; clock: number; targetId?: InteractionId; line?: DialogueLine; gentleCamera?: boolean; ambientMotion?: boolean }) {
  const turning = mapId === 'turning', time = ambientMotion ? clock : 1;
  const view = useSceneCamera(width, height, { width: 640, height: 480 }, { x: player.x, y: player.y - 24 }, clock, gentleCamera);
  const clues = useMemo(() => turningStateSvg(progress), [progress.chapterTwo.trailStep, progress.chapterTwo.glamourBroken, progress.discoveries]);
  const glamour = useMemo(() => turningGlamourSvg(progress.chapterTwo.trailStep, time, progress.chapterTwo.glamourBroken, ambientMotion), [progress.chapterTwo.trailStep, progress.chapterTwo.glamourBroken, Math.floor(time * 3), ambientMotion]);
  const actors = [
    { y: player.y, id: 'rae', node: <CharacterSprite id="rae" map={mapId} actor={player} clock={clock} line={line} insideOut={turning && progress.chapterTwo.glamourBroken} /> },
    { y: companion.y, id: 'tala', node: <CharacterSprite id="tala" map={mapId} actor={companion} clock={clock} line={line} /> },
    ...(!turning ? [{ y: 238, id: 'bagtas', node: <G transform="translate(383 170)"><Rect x={3} y={66} width={29} height={3} fill="#1b3732" opacity={.4} /><SvgXml xml={bagtasSpriteSvg((clock + 2.1) % 6 < .15, line?.speaker === 'Bagtas' && Math.floor(clock * 6) % 3 === 0 ? 1 : 0, line?.speaker === 'Bagtas' ? line.emotion : 'neutral', Math.floor(clock * .65) % 2)} width={34} height={68} /></G> }] : []),
  ].sort((a, b) => a.y - b.y);
  return <Svg width={width} height={height} viewBox={`${view.cameraX} ${view.cameraY} ${view.vw} ${view.vh}`}>
    {turning ? <TurningBase /> : <VergeBase />}<StoryProps mapId={mapId} />
    {turning && <SvgXml xml={clues} width={640} height={480} />}
    {turning && <SvgXml pointerEvents="none" xml={glamour} width={640} height={480} />}
    {turning ? <TurningWeather frame={Math.floor(time * 3)} layer="ground" /> : <VergeWeather frame={Math.floor(time * 4)} layer="ground" />}
    {actors.map(actor => <G key={actor.id}>{actor.node}</G>)}
    {turning ? <><TurningForeground player={player} /><TurningWeather frame={Math.floor(time * 3)} /></> : <><VergeForeground player={player} /><VergeWeather frame={Math.floor(time * 4)} /></>}
  </Svg>;
});
