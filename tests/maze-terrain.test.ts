import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { mazeTerrain } from '../src/art/mazeTerrain.ts';
import { mazeTerrainMarkup } from '../src/art/mazeTrialArt.ts';
import { currentMaze } from '../src/game/mazeTrials.ts';
import { replayCheckpoint } from '../src/game/replay.ts';

test('joined organic trail art covers supported floor in every trial and keeps foliage off paths and clue clearings',async()=>{
  const progress=replayCheckpoint('bambooPuzzle').progress;
  for(const seed of [0,20261019,4294967295])for(let stage=0;stage<3;stage++){
    progress.chapterTwo.mazeSeed=seed;progress.chapterTwo.trailStep=stage;
    const plan=currentMaze(progress),terrain=mazeTerrain(progress);
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${plan.width}" height="${plan.height}"><path d="${terrain.path}" fill="white"/></svg>`;
    const {data,info}=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    for(const r of plan.floor)for(let y=r.y;y<=r.y+r.height;y+=8)for(let x=r.x;x<=r.x+r.width;x+=8)
      assert.ok(data[(y*info.width+x)*4+3]>240,`supported ground is visible at ${seed}/${stage}/${x},${y}`);
    assert.ok(terrain.plants.length>150,'all three maps have substantial complete foliage');
    for(const plant of terrain.plants)assert.ok(!plan.floor.some(r=>plant.x<r.x+r.width&&plant.x+plant.width>r.x&&plant.y<r.y+r.height&&plant.y+plant.height>r.y),'foliage cannot hide a supported trail or clue clearing');
    assert.equal(mazeTerrain(progress),terrain,'static terrain is cached across movement frames');
  }
});

test('terrain uses continuous paintings and truly transparent plant assets rather than tiled scenery',async()=>{
  const progress=replayCheckpoint('bambooPuzzle').progress;
  const textures=['earth','understory',...Array.from({length:8},(_,i)=>`plant${i}`)];
  for(let stage=0;stage<3;stage++){
    progress.chapterTwo.trailStep=stage;const art=mazeTerrainMarkup(progress,textures);
    assert.doesNotMatch(art,/<pattern/);
    assert.equal((art.match(/href="earth"/g)||[]).length,1);
    assert.equal((art.match(/href="understory"/g)||[]).length,1);
    assert.match(art,/<mask/);
  }
  for(let i=1;i<=8;i++){
    const image=sharp(`assets/maps/maze-foliage-${i}-v2.png`),metadata=await image.metadata(),stats=await image.stats();
    assert.equal(metadata.hasAlpha,true);assert.equal(stats.channels[3].min,0);
    const {data,info}=await image.raw().toBuffer({resolveWithObject:true});
    let clear=0,visible=0;
    for(let n=3;n<data.length;n+=4){if(data[n]===0)clear++;if(data[n]>100)visible++;}
    assert.ok(clear>info.width*info.height*.15,'the rectangular sprite backdrop must be absent');
    assert.ok(visible>info.width*info.height*.1,'the plant itself remains visible');
  }
});
