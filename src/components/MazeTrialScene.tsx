import { memo, useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, { ClipPath, Defs, Ellipse, G, Image as SvgImage, Path, RadialGradient, Rect, Stop, SvgXml } from 'react-native-svg';
import { currentMaze, MAZE_CAMERA_ZOOM } from '../game/mazeTrials';
import { mazeGlamourSvg, mazeMarkersSvg, mazeSightRadius, mazeGuidesSvg } from '../art/mazeTrialArt';
import { MAZE_TINTS } from '../art/mazeTerrain';
import { mazeRegionBounds, mazeVisibleRegion, mazeViewportTerrain } from '../art/mazeViewport';
import type { TerrainChunk } from '../art/mazeViewport';
import { mazeHelperActors } from '../art/mazeHelperArt';
import type { DialogueLine, Player, Progress } from '../game/model';
import { cameraTarget, sceneViewport } from '../game/camera';
import { CharacterSprite } from './CharacterSprite';
const MATERIAL_IMAGES=[
  [require('../../assets/maps/maze-stone-floor-mobile-v1.png'),require('../../assets/maps/maze-stone-forest-mobile-v1.png')],
  [require('../../assets/maps/maze-wind-floor-mobile-v1.png'),require('../../assets/maps/maze-wind-forest-mobile-v1.png')],
  [require('../../assets/maps/maze-water-floor-mobile-v1.png'),require('../../assets/maps/maze-water-forest-mobile-v1.png')],
] as const;
const FOLIAGE_IMAGES=[
  require('../../assets/maps/maze-foliage-1-v2.png'),require('../../assets/maps/maze-foliage-2-v2.png'),
  require('../../assets/maps/maze-foliage-3-v2.png'),require('../../assets/maps/maze-foliage-4-v2.png'),
  require('../../assets/maps/maze-foliage-5-v2.png'),require('../../assets/maps/maze-foliage-6-v2.png'),
  require('../../assets/maps/maze-foliage-7-v2.png'),require('../../assets/maps/maze-foliage-8-v2.png'),
] as const;
export const MAZE_TERRAIN_IMAGES=[...MATERIAL_IMAGES.flat(),...FOLIAGE_IMAGES];
const PIXEL_IMAGE=Platform.OS==='web'?{imageRendering:'pixelated'}:{};
const StaticXml=memo(function StaticXml({xml,width,height}:{xml:string;width:number;height:number}){
  return <SvgXml pointerEvents="none" xml={xml} width={width} height={height}/>;
});
const GroundChunk=memo(function GroundChunk({chunk,floor,width,height}:{chunk:TerrainChunk;floor:number;width:number;height:number}){
  const prefix=`terrain-${chunk.id.replace(/:/g,'-')}`;
  return <G>
    <Defs>
      <ClipPath id={`${prefix}-tile`}><Rect x={chunk.x} y={chunk.y} width={chunk.width} height={chunk.height}/></ClipPath>
      <ClipPath id={`${prefix}-ground`}><Path d={chunk.path}/></ClipPath>
    </Defs>
    <G clipPath={`url(#${prefix}-tile)`}>
      <G clipPath={`url(#${prefix}-ground)`}><SvgImage {...PIXEL_IMAGE} href={floor} width={width} height={height} preserveAspectRatio="none"/></G>
      <G transform={`translate(${chunk.x} ${chunk.y})`}><StaticXml width={chunk.width} height={chunk.height}
        xml={`<svg xmlns="http://www.w3.org/2000/svg" width="${chunk.width}" height="${chunk.height}" viewBox="${chunk.x} ${chunk.y} ${chunk.width} ${chunk.height}">${chunk.fringe}</svg>`}/></G>
    </G>
  </G>;
});
const Terrain = memo(function Terrain({ progress,region }: { progress: Progress;region:ReturnType<typeof mazeVisibleRegion> }) {
  const plan=currentMaze(progress),terrain=useMemo(()=>mazeViewportTerrain(progress,region),[plan.id,region]),tint=MAZE_TINTS[plan.stage];
  const [floor,forest]=MATERIAL_IMAGES[plan.stage];
  return <>
    <SvgImage {...PIXEL_IMAGE} href={forest} width={plan.width} height={plan.height} preserveAspectRatio="none"/>
    {terrain.chunks.map(chunk=><GroundChunk key={chunk.id} chunk={chunk} floor={floor} width={plan.width} height={plan.height}/>)}
    {terrain.plants.map(plant=><G key={`${plant.x}:${plant.y}`}>
      <Ellipse cx={plant.x+plant.width/2} cy={plant.y+plant.height-2} rx={plant.width*.4} ry={2} fill="#122b22" opacity={.35}/>
      <SvgImage {...PIXEL_IMAGE} href={FOLIAGE_IMAGES[plant.sprite]} x={plant.x} y={plant.y} width={plant.width} height={plant.height}/>
    </G>)}
    <Rect width={plan.width} height={plan.height} fill={tint.color} opacity={tint.opacity}/>
  </>;
});
/** This SVG has its own native surface. Moving its parent uses the cached
 * painting rather than invalidating every contour and texture on each stride. */
const MazeTerrainPainting=memo(function MazeTerrainPainting({progress,region}:{progress:Progress;region:ReturnType<typeof mazeVisibleRegion>}){
  const plan=currentMaze(progress),bounds=mazeRegionBounds(plan,region);
  const guides=useMemo(()=>mazeGuidesSvg(progress),[plan.id]);
  const markers=useMemo(()=>mazeMarkersSvg(progress),[plan.id]);
  return <Svg width={bounds.width} height={bounds.height} viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}>
    <Terrain progress={progress} region={region}/>
    <StaticXml xml={guides} width={plan.width} height={plan.height}/>
    <StaticXml xml={markers} width={plan.width} height={plan.height}/>
  </Svg>;
});
export const MazeTrialScene = memo(function MazeTrialScene({ width,height,player,companion,progress,clock,line,ambientMotion=true }: {
  width:number;height:number;player:Player;companion:Player;progress:Progress;clock:number;line?:DialogueLine;gentleCamera?:boolean;ambientMotion?:boolean;
}) {
  const plan=currentMaze(progress), frame=ambientMotion?Math.floor(clock*3):3;
  // Direct follow avoids an easing tail amplified by the close maze camera.
  // Match the same integer ground anchor that the traveler sprite uses.
  const normal=sceneViewport(width,height,undefined,plan),vw=normal.vw/MAZE_CAMERA_ZOOM,vh=normal.vh/MAZE_CAMERA_ZOOM;
  const camera=cameraTarget({x:Math.round(player.x),y:Math.round(player.y)-12},plan,{vw,vh});
  const view={vw,vh,cameraX:camera.x,cameraY:camera.y},scale=width/vw;
  const visible=mazeVisibleRegion({x:view.cameraX,y:view.cameraY,width:view.vw,height:view.vh});
  const region=useMemo(()=>visible,[visible.left,visible.top,visible.right,visible.bottom]);
  const bounds=mazeRegionBounds(plan,region);
  const glamour=useMemo(()=>mazeGlamourSvg(progress,frame/3,ambientMotion),[plan.id,frame,progress.chapterTwo.glamourBroken,ambientMotion]);
  const helperClock=ambientMotion?Math.floor(clock*6)/6:1;
  const helpers=useMemo(()=>mazeHelperActors(progress,helperClock,ambientMotion,line),[plan.id,helperClock,ambientMotion,line?.speaker]);
  const actors=[
    ...[{id:'rae' as const,actor:player},{id:'tala' as const,actor:companion}].map(({id,actor})=>({id,y:actor.y,node:<CharacterSprite id={id} actor={actor} clock={clock} map="turning" line={line} insideOut={id==='rae'&&progress.chapterTwo.glamourBroken}/>})),
    ...helpers.filter(helper=>helper.point.x+helper.width>view.cameraX-32&&helper.point.x-helper.width<view.cameraX+view.vw+32&&helper.point.y>view.cameraY-32&&helper.point.y-helper.height<view.cameraY+view.vh+32)
      .map(helper=>({id:helper.id,y:helper.point.y,node:<G transform={`translate(${helper.point.x-helper.anchorX} ${helper.point.y-helper.anchorY})`}><StaticXml xml={helper.svg} width={helper.width} height={helper.height}/></G>})),
  ].sort((a,b)=>a.y-b.y);
  return <View style={{width,height,overflow:'hidden'}}>
    <View pointerEvents="none" style={{position:'absolute',left:(bounds.x-view.cameraX)*scale,top:(bounds.y-view.cameraY)*scale,
      width:bounds.width,height:bounds.height,transformOrigin:'top left',transform:[{scale}]}}>
      <MazeTerrainPainting progress={progress} region={region}/>
    </View>
    <Svg style={StyleSheet.absoluteFill} width={width} height={height} viewBox={`${view.cameraX} ${view.cameraY} ${view.vw} ${view.vh}`}>
    <StaticXml xml={glamour} width={plan.width} height={plan.height}/>
    {actors.map(actor=><G key={actor.id}>{actor.node}</G>)}
    <Defs><RadialGradient id="maze-sight" cx={player.x} cy={player.y-10} r={mazeSightRadius(plan.stage)} gradientUnits="userSpaceOnUse">
      <Stop offset={0} stopColor="#102923" stopOpacity={0}/><Stop offset={0.55} stopColor="#102923" stopOpacity={0}/>
      <Stop offset={0.85} stopColor="#102923" stopOpacity={.08}/><Stop offset={1} stopColor="#102923" stopOpacity={.3}/>
    </RadialGradient></Defs>
    <Rect pointerEvents="none" x={view.cameraX} y={view.cameraY} width={view.vw} height={view.vh} fill="url(#maze-sight)"/>
    </Svg>
  </View>;
});
