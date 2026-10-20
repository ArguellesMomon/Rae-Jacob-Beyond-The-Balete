import { mkdir,writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { mazeSceneArt } from './maze-scene-art.ts';
import { mazeTerrain } from '../src/art/mazeTerrain.ts';
import { mazeViewportTerrain, mazeVisibleRegion } from '../src/art/mazeViewport.ts';
import { currentMaze, MAZE_CAMERA_ZOOM, mazePoint } from '../src/game/mazeTrials.ts';
import { mazeWayfinding } from '../src/game/mazeWayfinding.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { sceneViewport,cameraTarget } from '../src/game/camera.ts';

const folder='artifacts/mobile-maze-review';await mkdir(folder,{recursive:true});
const report=[];
for(let stage=0;stage<3;stage++){
  const p=replayCheckpoint('bambooPuzzle').progress;p.chapterTwo.mazeSeed=20261019;p.chapterTwo.trailStep=stage;
  const plan=currentMaze(p),all=mazeTerrain(p),helper=mazeWayfinding(plan).helpers[0],a=mazePoint(helper.node),b=mazePoint(helper.next);
  const position={x:(a.x+b.x)/2,y:(a.y+b.y)/2};
  for(const [width,height] of [[844,390],[390,844]]){
    const normal=sceneViewport(width,height,undefined,plan),view={vw:normal.vw/MAZE_CAMERA_ZOOM,vh:normal.vh/MAZE_CAMERA_ZOOM};
    const camera=cameraTarget({x:position.x,y:position.y-12},plan,view),viewport={x:camera.x,y:camera.y,width:view.vw,height:view.vh};
    const visible=mazeViewportTerrain(p,mazeVisibleRegion(viewport));
    const art=mazeSceneArt(p,position,1,{fog:true,viewport});
    await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${camera.x} ${camera.y} ${view.vw} ${view.vh}">${art}</svg>`)).png().toFile(`${folder}/${stage+1}-${width}x${height}.png`);
    report.push({stage:plan.name,screen:`${width}x${height}`,before:{plants:all.plants.length,contourBytes:all.path.length,activeGroundMiB:54},after:{plants:visible.plants.length,chunks:visible.chunks.length,contourBytes:visible.chunks.reduce((n,c)=>n+c.path.length,0),activeGroundMiB:13.5}});
  }
}
await writeFile(`${folder}/render-budget.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
