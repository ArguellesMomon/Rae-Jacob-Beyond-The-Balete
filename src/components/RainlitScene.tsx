import { StoryProps } from './StoryProps';
import { SpringPuzzleProps } from './SpringPuzzleProps';
import { SpringSeal, SpringWaterSurface } from './SpringSurface';
import { memo, useMemo } from 'react';
import Svg, { ClipPath, Defs, G, Image as SvgImage, Path, Rect, Use } from 'react-native-svg';
import type { DialogueLine, InteractionId, Player, Progress, RainlitMapId } from '../game/model';
import { LUNING_POINT, MAYUMI_POINT, SPRING_BAGTAS_POINT, HAMLET_BAGTAS_POINT } from '../game/rainlitWorld';
import { useSceneCamera } from '../hooks/useSceneCamera';
import { bagtasSpriteSvg } from '../art/bagtasArt';
import { rainlitWeatherSvg, springWaterSvg } from '../art/rainlitArt';
import { CharacterSprite } from './CharacterSprite';
import { hamletLifeActors } from '../art/hamletLifeArt';
import { SceneArt } from './SceneArt';
export const RAINROAD_IMAGE = require('../../assets/maps/rainlit-road-v1.png');
export const HAMLET_IMAGE = require('../../assets/maps/riverside-hamlet-v3.png');
export const SPRING_IMAGE = require('../../assets/maps/quiet-spring-v2.png');
const images = { rainroad: RAINROAD_IMAGE, hamlet: HAMLET_IMAGE, spring: SPRING_IMAGE };
const standing = (x: number, y: number): Player => ({ x, y, moving: false, stride: 0, facing: 'down' });
const RainlitBase = memo(function RainlitBase({ mapId }: { mapId: RainlitMapId }) {
  return <><Defs><SvgImage id="rainlit-map" href={images[mapId]} width={640} height={480} preserveAspectRatio="none" /><ClipPath id="rainlit-edge"><Path d={mapId === 'rainroad' ? 'M0 0h52v330H0zM0 430h70v50H0zM500 360h140v120H500z' : mapId === 'hamlet' ? 'M0 0h52v480H0zM0 400h130v80H0zM520 360h120v120H520z' : 'M0 0h52v480H0zM540 310h100v170H540zM0 438h160v42H0z'} /></ClipPath></Defs><Use href="#rainlit-map" /></>;
});
export const RainlitScene = memo(function RainlitScene({ mapId, width, height, player, companion, progress, clock, targetId, line, gentleCamera = true, ambientMotion = true, waterMotion = true, restoring, sealing }: { mapId: RainlitMapId; width: number; height: number; player: Player; companion: Player; progress: Progress; clock: number; targetId?: InteractionId; line?: DialogueLine; gentleCamera?: boolean; ambientMotion?: boolean; waterMotion?: boolean; restoring?: number; sealing?: number }) {
  const time = ambientMotion ? clock : 1, q = progress.rainlit;
  const focus = sealing !== undefined ? { x: 478, y: 246 } : restoring !== undefined ? { x: 436, y: 269 } : { x: player.x, y: player.y - 24 };
  const view = useSceneCamera(width, height, { width: 640, height: 480 }, focus, clock, gentleCamera);
  const waterFrame = waterMotion && ambientMotion ? Math.floor(clock * 5) : 0;
  const waterReveal = waterMotion && restoring !== undefined ? Math.max(0, (restoring - .25) / .75) : 1;
  const water = useMemo(() => mapId==='spring'?springWaterSvg(q.restored, waterFrame, waterReveal):'', [mapId,q.restored,waterFrame,waterReveal]);
  const weatherFrame = Math.floor(time * 3);
  const weather = useMemo(() => rainlitWeatherSvg(mapId, weatherFrame, waterMotion), [mapId, weatherFrame, waterMotion]);
  const householdLife = useMemo(() => mapId === 'hamlet' ? hamletLifeActors(progress, clock, ambientMotion) : [], [mapId, q.restored, Math.floor(clock * 2), ambientMotion]);
  const guidePoint = mapId === 'rainroad' ? { x: 338, y: 267 } : HAMLET_BAGTAS_POINT;
  const actors = [
    ...householdLife.map(n => ({ y: n.y, id: n.id, node: <G transform={`translate(${n.x - 9} ${n.y - 23})`}><SceneArt xml={n.svg} width={18} height={25} /></G> })),
    ...(mapId === 'spring' ? [{ y: 274, id: 'springPuzzle', node: <SpringPuzzleProps progress={progress} settling={restoring ?? 1} /> }] : []),
    { y: player.y, id: 'rae', node: <CharacterSprite id="rae" actor={player} clock={clock} map={mapId} line={line} /> },
    { y: companion.y, id: 'tala', node: <CharacterSprite id="tala" actor={companion} clock={clock} map={mapId} line={line} /> },
    ...(mapId !== 'spring' ? [{ y: guidePoint.y, id: 'bagtas', node: <G transform={`translate(${guidePoint.x - 17} ${guidePoint.y - 68})`}><Rect x={3} y={67} width={28} height={3} fill="#203a30" opacity={.32} /><SceneArt xml={bagtasSpriteSvg((clock + 2.1) % 6 < .15, line?.speaker === 'Bagtas' && Math.floor(clock * 6) % 3 === 0 ? 1 : 0, line?.speaker === 'Bagtas' ? line.emotion : 'neutral', Math.floor(clock * .65) % 2)} width={34} height={68} /></G> }] : []),
    ...(mapId === 'hamlet' ? [{ y: LUNING_POINT.y, id: 'luning', node: <CharacterSprite id="luning" actor={standing(LUNING_POINT.x, LUNING_POINT.y)} clock={clock} map={mapId} line={line} pose="work" /> }] : []),
    ...(mapId === 'spring' ? [{ y: MAYUMI_POINT.y, id: 'mayumi', node: <CharacterSprite id="mayumi" actor={standing(MAYUMI_POINT.x, MAYUMI_POINT.y)} ambientMotion={ambientMotion} clock={ambientMotion || line?.speaker === 'Mayumi' ? clock : 1} map={mapId} line={line} /> },
      { y: SPRING_BAGTAS_POINT.y, id: 'bagtas', node: <G transform={`translate(${SPRING_BAGTAS_POINT.x - 17} ${SPRING_BAGTAS_POINT.y - 68})`}><Rect x={3} y={67} width={28} height={3} fill="#203a30" opacity={.32} /><SceneArt xml={bagtasSpriteSvg((clock + 2.1) % 6 < .15, line?.speaker === 'Bagtas' && Math.floor(clock * 6) % 3 === 0 ? 1 : 0, line?.speaker === 'Bagtas' ? line.emotion : 'neutral', q.rootBraced && !q.restored ? 1 : Math.floor(clock * .65) % 2)} width={34} height={68} /></G> }] : []),
  ].sort((a, b) => a.y - b.y);
  return <Svg width={width} height={height} viewBox={`${view.cameraX} ${view.cameraY} ${view.vw} ${view.vh}`}>
    <RainlitBase mapId={mapId} /><StoryProps mapId={mapId} />
    {mapId === 'spring' && <>{q.restored && <SpringWaterSurface reveal={waterReveal} />}<SceneArt xml={water} width={640} height={480} />{q.sealSeen && <SpringSeal reveal={sealing ?? 1} clock={sealing===undefined?0:Math.floor(time*3)/3} />}</>}
    {actors.map(a => <G key={a.id}>{a.node}</G>)}
    <Use href="#rainlit-map" clipPath="url(#rainlit-edge)" opacity={.88} />
    <SceneArt xml={weather} width={640} height={480} />
  </Svg>;
});
