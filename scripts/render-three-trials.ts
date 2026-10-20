import {mkdir,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
import {mazeSceneArt} from './maze-scene-art.ts';
import {currentMaze,MAZE_CAMERA_ZOOM} from '../src/game/mazeTrials.ts';
import {replayCheckpoint} from '../src/game/replay.ts';
import {sceneViewport,cameraTarget} from '../src/game/camera.ts';
const folder='artifacts/random-trials';await mkdir(folder,{recursive:true});
const panels:{input:Buffer;left:number;top:number}[]=[];
for(let stage=0;stage<3;stage++){
  const p=replayCheckpoint('bambooPuzzle').progress;p.chapterTwo.trailStep=stage;p.chapterTwo.mazeSeed=20261019;
  const plan=currentMaze(p),source=mazeSceneArt(p);
  const overview=`<svg xmlns="http://www.w3.org/2000/svg" width="${plan.width}" height="${plan.height}" viewBox="0 0 ${plan.width} ${plan.height}">${source}</svg>`;
  const picture=await sharp(Buffer.from(overview)).png().toBuffer();await writeFile(`${folder}/${stage+1}-${plan.stage===0?'stone':plan.stage===1?'wind':'water'}-overview.png`,picture);
  panels.push({input:await sharp(picture).resize(512,384,{kernel:'nearest'}).png().toBuffer(),left:stage*512,top:0});
  for(const [width,height] of [[844,390],[390,844],[1920,1080]]){
    const center=plan.spawn,normal=sceneViewport(width,height,undefined,plan),view={vw:normal.vw/MAZE_CAMERA_ZOOM,vh:normal.vh/MAZE_CAMERA_ZOOM},camera=cameraTarget({x:center.x,y:center.y-12},plan,view);
    const frame=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${camera.x} ${camera.y} ${view.vw} ${view.vh}">${mazeSceneArt(p,center,1,{fog:true})}</svg>`;
    await writeFile(`${folder}/${stage+1}-${width}x${height}-close.png`,await sharp(Buffer.from(frame)).png().toBuffer());
  }
  if(!plan.goal)throw Error('Missing destination sign');
}
await writeFile(`${folder}/three-trial-layouts.png`,await sharp({create:{width:1536,height:384,channels:4,background:'#17372e'}}).composite(panels).png().toBuffer());
console.log('Rendered three separate 1536x1152 trial maps and nine close camera views. These are source-art reviews; full-map views are developer artifacts and are never shown during play.');
