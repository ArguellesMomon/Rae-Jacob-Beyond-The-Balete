import { mkdir,writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { replayCheckpoint } from '../src/game/replay.ts';
import { currentMaze,MAZE_CAMERA_ZOOM,mazePoint } from '../src/game/mazeTrials.ts';
import { mazeWayfinding,helperDirections } from '../src/game/mazeWayfinding.ts';
import { mazeSceneArt } from './maze-scene-art.ts';
import { sceneViewport,cameraTarget } from '../src/game/camera.ts';
import { dalisaySvg, tigmamanukanSvg, trailCreaturePortraitSvg } from '../src/art/trailCreatureArt.ts';
const folder='artifacts/folklore-guides';await mkdir(folder,{recursive:true});
const report=[];
for(let stage=0;stage<3;stage++){
  const p=replayCheckpoint('bambooPuzzle').progress;p.chapterTwo.mazeSeed=20261019;p.chapterTwo.trailStep=stage;
  const plan=currentMaze(p),way=mazeWayfinding(plan);
  for(const helper of way.helpers){
    const a=mazePoint(helper.node),b=mazePoint(helper.next),player={x:a.x+(b.x-a.x)*.25,y:a.y+(b.y-a.y)*.25};
    const normal=sceneViewport(844,390,undefined,plan),view={vw:normal.vw/MAZE_CAMERA_ZOOM,vh:normal.vh/MAZE_CAMERA_ZOOM};
    const camera=cameraTarget({x:player.x,y:player.y-12},plan,view);
    const source=`<svg xmlns="http://www.w3.org/2000/svg" width="844" height="390" viewBox="${camera.x} ${camera.y} ${view.vw} ${view.vh}">${mazeSceneArt(p,player,1,{fog:true})}</svg>`;
    await writeFile(`${folder}/${stage+1}-${helper.id}.png`,await sharp(Buffer.from(source)).png().toBuffer());
    report.push({trial:plan.name,helper:helper.id,position:helper.point,facing:helper.facing,directions:helperDirections(plan,helper.id),arrows:way.arrows.length,clues:way.clues.length});
  }
}
await writeFile(`${folder}/directions.json`,JSON.stringify(report,null,2));
const sourceBody=(s:string)=>s.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
let sheet='<rect width="480" height="180" fill="#345044"/>';
for(const [i,direction] of (['up','right','down','left'] as const).entries()){
  sheet+=`<svg x="${10+i*74}" y="90" width="64" height="80" viewBox="0 0 64 80">${sourceBody(dalisaySvg(direction))}</svg>`;
  sheet+=`<svg x="${20+i*74}" y="36" width="40" height="40" viewBox="0 0 40 40">${sourceBody(tigmamanukanSvg(direction))}</svg>`;
}
sheet+=`<svg x="308" y="30" width="80" height="96">${sourceBody(trailCreaturePortraitSvg('tigmamanukan'))}</svg><svg x="394" y="30" width="80" height="96">${sourceBody(trailCreaturePortraitSvg('dalisay'))}</svg>`;
await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="180">${sheet}</svg>`)).resize(1440,540,{kernel:'nearest'}).png().toFile(`${folder}/creature-art.png`);
console.log('Rendered six source-art close views of the omen bird and resting giantess with seeded directions.');
