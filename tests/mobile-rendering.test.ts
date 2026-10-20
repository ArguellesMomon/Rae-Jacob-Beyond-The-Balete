import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { mazeTerrainChunk, mazeViewportTerrain, mazeVisibleRegion } from '../src/art/mazeViewport.ts';
import { mazeTerrain } from '../src/art/mazeTerrain.ts';
import { currentMaze, MAZE_CAMERA_ZOOM } from '../src/game/mazeTrials.ts';
import { cameraTarget, sceneViewport } from '../src/game/camera.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { characterSpriteSvg } from '../src/art/characterArt.ts';
import { mayumiAuraSvg } from '../src/art/mayumiArt.ts';
import { TRAVELER_ATLAS_POSES, TRAVELER_DIRECTIONS, travelerFrameCell, travelerWalkCell } from '../src/game/travelerAtlas.ts';
import { nextPaintTime } from '../src/game/renderBudget.ts';

test('the 30 fps scene budget remains even on 60, 90 and 120 Hz phones without fractional timing drift',()=>{
  for(const hz of [59.94,60,90,120]){
    let painted=0,count=0;
    for(let frame=1;frame<=Math.floor(hz*10);frame++){
      const next=nextPaintTime(painted,frame*1000/hz,30);
      if(next!==null){painted=next;count++;}
    }
    assert.ok(count>=299&&count<=300,`${hz} Hz should produce approximately 300 scene updates over ten seconds, got ${count}`);
  }
  assert.equal(nextPaintTime(0,10000,0),null);
});

test('native gradient offsets obey the SVG renderer number contract and cannot flood warnings',()=>{
  const scene=readFileSync('src/components/MazeTrialScene.tsx','utf8');
  assert.doesNotMatch(scene,/<Stop[^>]*offset=["']\./);
  for(const t of [0,1,5])for(const match of mayumiAuraSvg(t).matchAll(/<stop[^>]*offset="([^"]+)"/g))
    assert.match(match[1],/^([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)(%?)$/,'matches the installed react-native-svg gradient parser');
});

test('small clipped terrain regions cover all supported floor, including chunk seams, without opening forest walls',async()=>{
  const p=replayCheckpoint('bambooPuzzle').progress;
  for(const seed of [0,20261019,4294967295])for(let stage=0;stage<3;stage++){
    p.chapterTwo.mazeSeed=seed;p.chapterTwo.trailStep=stage;const plan=currentMaze(p);
    let body='';
    for(let row=0;row<plan.height/256;row++)for(let column=0;column<plan.width/256;column++){
      const c=mazeTerrainChunk(p,column,row),id=`c${column}-${row}`;
      body+=`<defs><clipPath id="${id}"><rect x="${c.x}" y="${c.y}" width="${c.width}" height="${c.height}"/></clipPath></defs><g clip-path="url(#${id})"><path d="${c.path}" fill="white"/></g>`;
      assert.equal(mazeTerrainChunk(p,column,row),c);
    }
    const {data,info}=await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${plan.width}" height="${plan.height}">${body}</svg>`)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    for(const r of plan.floor)for(let y=r.y;y<=r.y+r.height;y+=8)for(let x=r.x;x<=r.x+r.width;x+=8)
      assert.ok(data[(y*info.width+x)*4+3]>240,`walkable floor must remain painted across seams at ${seed}/${stage}/${x},${y}`);
    for(const wall of plan.colliders.filter(r=>r.width>24&&r.height>24).slice(0,20)){
      const x=Math.floor(wall.x+wall.width/2),y=Math.floor(wall.y+wall.height/2);
      assert.equal(data[(y*info.width+x)*4+3],0,'a broad wall center must remain forest');
    }
  }
});

test('phone cameras bound terrain geometry and foliage to nearby regions rather than the whole map',()=>{
  const p=replayCheckpoint('bambooPuzzle').progress;
  for(let stage=0;stage<3;stage++){
    p.chapterTwo.trailStep=stage;const plan=currentMaze(p),all=mazeTerrain(p);
    for(const [width,height] of [[844,390],[390,844]])for(const point of [plan.spawn,plan.goal.point,plan.proof]){
      const normal=sceneViewport(width,height,undefined,plan),view={vw:normal.vw/MAZE_CAMERA_ZOOM,vh:normal.vh/MAZE_CAMERA_ZOOM};
      const camera=cameraTarget(point,plan,view),region=mazeVisibleRegion({x:camera.x,y:camera.y,width:view.vw,height:view.vh});
      const visible=mazeViewportTerrain(p,region);
      assert.ok(visible.chunks.length<=12);
      assert.ok(visible.plants.length<all.plants.length*.6);
      assert.ok(visible.chunks.reduce((sum,c)=>sum+c.path.length,0)<all.path.length*.65,'the native contour work must be substantially smaller');
    }
  }
});

test('every phone walking atlas cell preserves the authored angle, stride, blink and carried-map pose pixel for pixel',async()=>{
  for(const id of ['rae','tala'] as const){
    const {data,info}=await sharp(`assets/characters/${id}-walk-mobile.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    for(const direction of TRAVELER_DIRECTIONS)for(const blink of [false,true])for(const variant of [0,1])for(let frame=0;frame<8;frame++){
      const emotion=id==='rae'&&variant===1?'curious':'neutral',gesture=id==='tala'&&variant===1?'guardMap':'idle';
      const cell=travelerWalkCell(id,direction,frame,blink,emotion,gesture),actual=Buffer.alloc(cell.cellWidth*cell.cellHeight*4);
      for(let y=0;y<cell.cellHeight;y++){
        const from=((cell.row*cell.cellHeight+y)*info.width+cell.column*cell.cellWidth)*4;
        data.copy(actual,y*cell.cellWidth*4,from,from+cell.cellWidth*4);
      }
      const expected=await sharp(Buffer.from(characterSpriteSvg(id,direction,frame,gesture,emotion,blink))).resize(cell.cellWidth,cell.cellHeight,{kernel:'nearest'}).ensureAlpha().raw().toBuffer();
      assert.deepEqual(actual,expected,`${id}/${direction}/${frame}/${blink}/${variant}`);
    }
  }
});

test('persistent traveler atlases have no empty or incorrect walking, blinking or idle cells',async()=>{
  for(const id of ['rae','tala'] as const){
    const {data,info}=await sharp(`assets/characters/${id}-frames-mobile-v2.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    assert.ok(info.width<=2048&&info.height<=2048,'keep each native sprite texture within a conservative phone texture size');
    const used=new Set<string>();
    for(const pose of TRAVELER_ATLAS_POSES[id])for(const facing of TRAVELER_DIRECTIONS)for(const blink of [false,true])for(const frame of pose.frames){
      const cell=travelerFrameCell(id,facing,frame,blink,pose.emotion,pose.gesture)!;
      assert.ok(cell);assert.equal(info.width,cell.columns*cell.cellWidth);assert.equal(info.height,cell.rows*cell.cellHeight);
      const key=`${cell.column}:${cell.row}`;assert.ok(!used.has(key),'every state has its own cell');used.add(key);
      const actual=Buffer.alloc(cell.cellWidth*cell.cellHeight*4);
      for(let y=0;y<cell.cellHeight;y++){
        const from=((cell.row*cell.cellHeight+y)*info.width+cell.column*cell.cellWidth)*4;
        data.copy(actual,y*cell.cellWidth*4,from,from+cell.cellWidth*4);
      }
      const expected=await sharp(Buffer.from(characterSpriteSvg(id,facing,frame,pose.gesture,pose.emotion,blink))).resize(cell.cellWidth,cell.cellHeight,{kernel:'nearest'}).ensureAlpha().raw().toBuffer();
      assert.deepEqual(actual,expected,`${id}/${facing}/${pose.gesture}/${frame}/${blink}`);
      assert.ok(actual.some((value,i)=>i%4===3&&value>200),'a blink only changes facial pixels, never hides the body');
    }
    assert.equal(used.size,info.width/64*info.height/(id==='rae'?96:80));
  }
});

test('each trial uses its V1 material family at a bounded decoded texture size',async()=>{
  const source=readFileSync('src/components/MazeTrialScene.tsx','utf8');
  assert.ok(!source.includes('maze-earth-v2.png')&&!source.includes('maze-understory-v2.png'));
  for(const stage of ['stone','wind','water'])for(const surface of ['floor','forest']){
    assert.ok(source.includes(`maze-${stage}-${surface}-mobile-v1.png`));
    const metadata=await sharp(`assets/maps/maze-${stage}-${surface}-mobile-v1.png`).metadata();
    assert.equal(metadata.width,1536);assert.equal(metadata.height,1152);
  }
});

test('walking sprite viewport crops never expose adjacent atlas frames or shift a character angle',async()=>{
  for(const id of ['rae','tala'] as const){
    const uri=`data:image/png;base64,${readFileSync(`assets/characters/${id}-walk-mobile.png`).toString('base64')}`;
    for(const direction of TRAVELER_DIRECTIONS)for(const frame of [0,3,7]){
      const blink=frame===3,emotion=id==='rae'?'curious':'neutral',gesture=id==='tala'?'guardMap':'idle';
      const c=travelerWalkCell(id,direction,frame,blink,emotion,gesture);
      const source=`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="128"><svg x="16" y="16" width="${c.cellWidth}" height="${c.cellHeight}" style="overflow:hidden" viewBox="${c.column*c.cellWidth} ${c.row*c.cellHeight} ${c.cellWidth} ${c.cellHeight}"><image href="${uri}" width="${c.cellWidth*8}" height="${c.cellHeight*16}" preserveAspectRatio="none"/></svg></svg>`;
      const actual=await sharp(Buffer.from(source)).ensureAlpha().raw().toBuffer();
      const framePixels=await sharp(Buffer.from(characterSpriteSvg(id,direction,frame,gesture,emotion,blink))).resize(c.cellWidth,c.cellHeight,{kernel:'nearest'}).ensureAlpha().raw().toBuffer();
      const expected=Buffer.alloc(96*128*4);
      for(let y=0;y<c.cellHeight;y++)framePixels.copy(expected,((y+16)*96+16)*4,y*c.cellWidth*4,(y+1)*c.cellWidth*4);
      assert.deepEqual(actual,expected,`${id}/${direction}/${frame}: only the selected sprite may be drawn`);
    }
  }
});
