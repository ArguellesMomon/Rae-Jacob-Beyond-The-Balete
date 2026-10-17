import { InteractionFocus } from './InteractionFocus';
import { GroveBase, GroveForeground, GroveLight, GrovePerchEdge } from './GroveEnvironment';
import { memo, useMemo } from 'react';
import Svg, { G, Path, SvgXml } from 'react-native-svg';
import { mangUbanSvg } from '../art/groveArt';
import { groveShot } from '../art/groveEnvironmentArt';
import type { DialogueLine, InteractionId, Player, Progress } from '../game/model';
import { CharacterSprite } from './CharacterSprite';
import { GROVE_INTERACTIONS, GROVE_WORLD } from '../game/world';
import { useSceneCamera } from '../hooks/useSceneCamera';
import { ResidentSprite } from './ResidentSprite';
import { SeedOffering } from './SeedOffering';

export const GroveScene = memo(function GroveScene({ player, companion, width, height, clock, targetId, overview = false, focusMang = false, reveal = 1, quiet = false, gentleCamera = true, line, progress, giftScene = false, ambientMotion = true }: { player: Player; companion: Player; width: number; height: number; clock: number; targetId?: InteractionId; overview?: boolean; focusMang?: boolean; reveal?: number; quiet?: boolean; gentleCamera?: boolean; line?: DialogueLine; progress: Progress; giftScene?: boolean; ambientMotion?: boolean }) {
  const envClock = ambientMotion ? clock : 1;
  const lightFrame = Math.floor(envClock * 3);
  const mangSpeaking = line?.speaker === 'Mang Uban';
  const mangBlink = clock % 6.2 < .18, mangMouth = mangSpeaking && Math.floor(clock * 4) % 3 === 0 ? 1 : 0;
  const hand = mangSpeaking && Math.floor(clock * 1.2) % 2 ? -2 : 0;
  const mang = useMemo(() => mangUbanSvg(mangBlink, false, { emotion: mangSpeaking ? line?.emotion : 'neutral', mouth: mangMouth, hand }), [mangBlink, mangSpeaking, line?.emotion, mangMouth, hand]);
  const shot = groveShot(player, width, height, { overview, giftScene, focusMang, reveal });
  const { cameraX, cameraY, vw, vh } = useSceneCamera(width, height, GROVE_WORLD, shot.center, clock, gentleCamera, shot.view, shot.cinematic);
  const item = GROVE_INTERACTIONS.find(entry => entry.id === targetId);
  const target = item?.id === 'tala' ? { ...item, point: companion } : item;
  const actors = [
    { id: 'doro', y: 301, node: <ResidentSprite id="doro" clock={clock} line={line} /> },
    { id: 'rae', y: player.y, node: <CharacterSprite map="grove" id="rae" actor={player} clock={clock} line={line} /> },
    { id: 'tala', y: companion.y, node: <CharacterSprite map="grove" id="tala" actor={companion} clock={clock} line={line} /> },
  ].sort((a, b) => a.y - b.y);
  return <Svg width={width} height={height} viewBox={`${Math.round(cameraX)} ${Math.round(cameraY)} ${vw} ${vh}`}>
    <GroveBase /><GroveLight progress={progress} frame={lightFrame} layer="ground" />
    <G transform="translate(182 108)"><SvgXml xml={mang} width={112} height={156} /></G>
    <GrovePerchEdge />
    {progress.bellRung && !progress.ubanGiftReceived && <G opacity={.55 + Math.sin(clock * 3) * .2}><Path d="M229 267h2v-3h2v3h2v2h-2v3h-2v-3h-2z" fill="#edd7a0" /></G>}
    {actors.map(actor => <G key={actor.id}>{actor.node}</G>)}
    <SeedOffering line={line} clock={clock} player={player} />
    <GroveForeground player={player} />
    <GroveLight progress={progress} frame={lightFrame} />
    {target && <InteractionFocus point={target.point} clock={envClock} talk={target.action === 'Talk'} />}
    {target && <G transform={`translate(${Math.round(target.point.x)} ${Math.round(target.point.y - 29 - Math.sin(clock * 4))})`}><Path d="M-4 0h8v2H2v2H0v2h-1V4h-2V2h-1z" fill="#f5d899" /></G>}
  </Svg>;
});
