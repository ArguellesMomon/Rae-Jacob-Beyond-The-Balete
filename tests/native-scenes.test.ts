import './register-scene-mocks.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { act, create } from 'react-test-renderer';
import type { ReactTestRendererJSON } from 'react-test-renderer';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { Platform } from './mocks/native.ts';
import { xmlDraws } from './mocks/svg.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { mazeHelperActors } from '../src/art/mazeHelperArt.ts';
import { springWetMarkup, SPRING_WET_BOUNDS, springWaterRevealPath } from '../src/art/springSurfaceArt.ts';
import { characterSpriteSvg } from '../src/art/characterArt.ts';
import { TRAVELER_DIRECTIONS } from '../src/game/travelerAtlas.ts';
import { cameraTarget, sceneViewport } from '../src/game/camera.ts';
import { currentMaze, MAZE_CAMERA_ZOOM } from '../src/game/mazeTrials.ts';
import type { Player } from '../src/game/model.ts';

const {CharacterSprite}=await import('../src/components/CharacterSprite.tsx');
const {MazeTrialScene}=await import('../src/components/MazeTrialScene.tsx');
const {RainlitScene}=await import('../src/components/RainlitScene.tsx');
(globalThis as unknown as {IS_REACT_ACT_ENVIRONMENT:boolean}).IS_REACT_ACT_ENVIRONMENT=true;
type Tree=ReactTestRendererJSON|ReactTestRendererJSON[]|null;
function nodes(tree:Tree):ReactTestRendererJSON[]{
  if(!tree)return [];
  if(Array.isArray(tree))return tree.flatMap(nodes);
  return [tree,...(tree.children??[]).filter(c=>typeof c!=='string').flatMap(c=>nodes(c as ReactTestRendererJSON))];
}
const escape=(v:unknown)=>String(v).replaceAll('&','&amp;').replaceAll('"','&quot;');
function svg(tree:Tree):string{
  if(!tree)return '';
  if(Array.isArray(tree))return tree.map(svg).join('');
  const {type,props,children}=tree;
  if(type==='raw-svg')return (props.xml as string).replace(/^<svg[^>]*>/,`<svg width="${props.width}" height="${props.height}" viewBox="${(props.xml as string).match(/viewBox="([^"]+)"/)?.[1]??`0 0 ${props.width} ${props.height}`}">`);
  const attrs=Object.entries(props).filter(([key,v])=>!['children','pointerEvents','style'].includes(key)&&v!==undefined).map(([key,value])=>{
    if(type==='image'&&key==='href')value=`data:image/png;base64,${readFileSync(new URL(value as string)).toString('base64')}`;
    return `${({clipPath:'clip-path',stopColor:'stop-color',stopOpacity:'stop-opacity'} as Record<string,string>)[key]??key}="${escape(value)}"`;
  }).join(' ');
  return `<${type} ${attrs}>${(children??[]).map(c=>typeof c==='string'?escape(c):svg(c)).join('')}</${type}>`;
}
function alphaBounds(data:Buffer,width:number,height:number){
  let left=width,top=height,right=0,bottom=0,count=0;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(data[(y*width+x)*4+3]>20){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);count++;}
  return {left,right,top,bottom,count};
}

test('actual native traveler components keep their feet anchored through walking, turning, stopping and resuming',async()=>{
  mkdirSync('artifacts/native-scene-fixes',{recursive:true});
  const reviews:string[]=[];
  for(const os of ['android','ios'])for(const id of ['rae','tala'] as const){
    Platform.OS=os;
    let renderer!:ReturnType<typeof create>;
    try{
      await act(async()=>{renderer=create(createElement(CharacterSprite,{id,actor:{x:80,y:110,facing:'down',moving:false,stride:0},clock:2,map:'turning'}));});
      for(const direction of TRAVELER_DIRECTIONS)for(const moving of [true,false,true,false]){
        const actor:Player={x:80,y:110,facing:direction,moving,stride:21};
        await act(async()=>renderer.update(createElement(CharacterSprite,{id,actor,clock:2,map:'turning'})));
        const xml=`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="144">${svg(renderer.toJSON())}</svg>`;
        const pixels=await sharp(Buffer.from(xml)).ensureAlpha().raw().toBuffer();
        const bounds=alphaBounds(pixels,160,144),height=id==='rae'?30:22;
        assert.ok(bounds.count>80,`${os}/${id}/${direction}: visible sprite`);
        assert.ok(bounds.left>=69&&bounds.right<=90&&bounds.top>=110-height-1&&bounds.bottom<=112,`${os}/${id}/${direction}/${moving}: fixed foot anchor ${JSON.stringify(bounds)}`);
        const w=id==='rae'?20:18,frame=moving?Math.floor(21/(id==='rae'?4:3))%8:-1;
        const expected=await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="144"><g transform="translate(${80-w/2} ${110-height})">${characterSpriteSvg(id,direction,frame).replace(/^<svg[^>]*>/,`<svg width="${w}" height="${height}" viewBox="0 0 64 ${id==='rae'?96:80}">`)}</g></svg>`)).ensureAlpha().raw().toBuffer();
        const expectedBounds=alphaBounds(expected,160,144);
        assert.ok(Math.abs(bounds.top-expectedBounds.top)<=1,`${id}: native walking and vector idle use the same top anchor`);
        assert.ok(!nodes(renderer.toJSON()).some(n=>n.type==='svg'),'walking must not depend on nested native viewBox placement');
        if(os==='android'&&direction==='right'&&moving)reviews.push(xml.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,''));
      }
    }finally{await act(async()=>renderer.unmount());}
  }
  Platform.OS='ios';
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="144">${reviews.slice(0,1).join('')}</svg>`)).png().toFile('artifacts/native-scene-fixes/anchored-walk.png');
});

test('native traveler image and clip stay mounted across eye blinks, pauses and ambient poses',async()=>{
  for(const os of ['android','ios'])for(const id of ['rae','tala'] as const){
    Platform.OS=os;let renderer!:ReturnType<typeof create>;
    const actor:Player={x:80,y:110,facing:'right',moving:true,stride:21};
    try{
      await act(async()=>{renderer=create(createElement(CharacterSprite,{id,actor,clock:2,map:'turning'}));});
      const image=renderer.root.findByType('image'),clip=renderer.root.findByType('clipPath'),href=image.props.href;
      for(const clock of [0,.1,.2,1.39,1.41,4.39,4.41,4.56,5.69,5.71,5.86,6.4,8.1,11.41,13.1])for(const moving of [true,false,true]){
        await act(async()=>renderer.update(createElement(CharacterSprite,{id,actor:{...actor,moving},clock,map:'turning'})));
        assert.equal(renderer.root.findByType('image'),image,`${id}: no image remount at ${clock}/${moving}`);
        assert.equal(renderer.root.findByType('clipPath'),clip,`${id}: no clipping definition remount`);
        assert.equal(image.props.href,href,'no texture loading when eyes close or a traveler stops');
        assert.equal(nodes(renderer.toJSON()).filter(n=>n.type==='raw-svg').length,0,'ambient play never switches back to the vector renderer');
      }
    }finally{await act(async()=>renderer.unmount());}
  }
  Platform.OS='ios';
});

test('maze terrain has an independent static surface and the zoomed camera follows the current ground anchor immediately',async()=>{
  for(let stage=0;stage<3;stage++)for(const [width,height]of [[844,390],[390,844]]){
    const p=replayCheckpoint('bambooPuzzle').progress;p.chapterTwo.trailStep=stage;
    const plan=currentMaze(p),player:Player={x:700,y:500,facing:'right',moving:true,stride:21};
    let renderer!:ReturnType<typeof create>;
    const props={width,height,progress:p,companion:{...player,x:682},gentleCamera:true};
    try{
      await act(async()=>{renderer=create(createElement(MazeTrialScene,{...props,player,clock:2}));});
      const surfaces=renderer.root.findAllByType('svg'),painting=surfaces.find(n=>!n.props.style)!,foreground=surfaces.find(n=>n.props.style?.position==='absolute')!;
      assert.equal(surfaces.length,2,'terrain and moving actors have different native SVG roots');
      assert.ok(painting&&foreground);const backgroundProps=painting.props;
      for(let frame=1;frame<=4;frame++){
        const actor={...player,x:player.x+frame*1.2,stride:21+frame*1.2};
        await act(async()=>renderer.update(createElement(MazeTrialScene,{...props,player:actor,clock:2+frame/30})));
        const normal=sceneViewport(width,height,undefined,plan),vw=normal.vw/MAZE_CAMERA_ZOOM,vh=normal.vh/MAZE_CAMERA_ZOOM;
        const target=cameraTarget({x:Math.round(actor.x),y:Math.round(actor.y)-12},plan,{vw,vh});
        assert.equal(foreground.props.viewBox,`${target.x} ${target.y} ${vw} ${vh}`,'no easing debt or delayed camera step');
        assert.equal(painting.props,backgroundProps,'walking does not reconcile the static painting');
        let carrier=painting.parent;
        while(carrier&&!carrier.props.style?.transform)carrier=carrier.parent;
        assert.ok(carrier,'the terrain has an independently translated native parent');
        const [bx,by]=String(painting.props.viewBox).split(' ').map(Number),scale=width/vw;
        assert.ok(Math.abs(carrier.props.style.left+(actor.x-bx)*scale-(actor.x-target.x)*scale)<1e-6,'terrain and actor projections match at this zoom');
        assert.ok(Math.abs(carrier.props.style.top+(actor.y-by)*scale-(actor.y-target.y)*scale)<1e-6);
      }
    }finally{await act(async()=>renderer.unmount());}
  }
});

test('both maze NPCs use native-supported ground translations in every trial and phone orientation',async()=>{
  for(const seed of [17,20261020])for(let stage=0;stage<3;stage++)for(const [width,height]of [[844,390],[390,844]]){
    const p=replayCheckpoint('bambooPuzzle').progress;p.chapterTwo.mazeSeed=seed;p.chapterTwo.trailStep=stage;
    for(const helper of mazeHelperActors(p,1,true)){
      const player:Player={...helper.point,facing:'down',moving:false,stride:0};
      let renderer!:ReturnType<typeof create>;
      try{
        await act(async()=>{renderer=create(createElement(MazeTrialScene,{width,height,player,companion:{...player,x:player.x-18},progress:p,clock:1,gentleCamera:false}));});
        const all=nodes(renderer.toJSON()),art=all.find(n=>n.type==='raw-svg'&&n.props.xml===helper.svg);
        assert.ok(art,`${helper.id} visible when camera is at its interaction point`);
        const parent=all.find(n=>n.type==='g'&&n.children?.includes(art));
        assert.equal(parent?.props.transform,`translate(${helper.point.x-helper.anchorX} ${helper.point.y-helper.anchorY})`);
        assert.doesNotMatch(helper.svg,/<svg[^>]*\s[xy]="/,'internal creature placement must also work on native');
        for(const n of all.filter(n=>n.type==='raw-svg'))assert.ok(n.props.x===undefined&&n.props.y===undefined,'no nested art relies on unsupported x/y');
      }finally{await act(async()=>renderer.unmount());}
    }
  }
});

test('restored spring native scene has no live mask, keeps the story cast visible and reuses unchanged art',async()=>{
  const saved=replayCheckpoint('springEnding'),p=saved.progress;p.rainlit.restored=true;p.rainlit.sealSeen=true;
  let renderer!:ReturnType<typeof create>;
  const props={mapId:'spring' as const,width:844,height:390,player:{...saved.player,x:430,y:300},companion:{...saved.player,x:412,y:300},progress:p,gentleCamera:false};
  try{
    await act(async()=>{renderer=create(createElement(RainlitScene,{...props,clock:2}));});
    const all=nodes(renderer.toJSON());
    assert.ok(!all.some(n=>n.type==='mask'||n.props.mask),'restored water must not start repeated native mask passes');
    assert.ok(all.some(n=>n.type==='image'&&String(n.props.href).includes('spring-water-mobile.png')));
    assert.ok(all.some(n=>n.type==='raw-svg'&&String(n.props.xml).includes('mayumi-aura-light')));
    const before=xmlDraws.count;
    for(let i=1;i<=8;i++)await act(async()=>renderer.update(createElement(RainlitScene,{...props,clock:2+i/1000})));
    assert.equal(xmlDraws.count-before,0,'unchanged water, aura and character body art must not be rebuilt on every tick');
    const report={nativeMasks:all.filter(n=>n.type==='mask').length,waterSurface:{width:320,height:144},updates:8,xmlDraws:xmlDraws.count-before};
    writeFileSync('artifacts/native-scene-fixes/restored-spring-workload.json',JSON.stringify(report,null,2));
    const xml=svg(renderer.toJSON()).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ');
    await sharp(Buffer.from(xml)).png().toFile('artifacts/native-scene-fixes/restored-spring-native-contract.png');
  }finally{await act(async()=>renderer.unmount());}
});

test('baked spring water matches the original feathered rill and progressive clips finish without a jump',async()=>{
  const b=SPRING_WET_BOUNDS,uri=`data:image/png;base64,${readFileSync('assets/props/spring-wet-bed-v1.png').toString('base64')}`;
  const expected=await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="144" viewBox="${b.x} ${b.y} ${b.width} ${b.height}">${springWetMarkup(uri)}</svg>`)).ensureAlpha().raw().toBuffer();
  const actual=await sharp('assets/props/spring-water-mobile.png').ensureAlpha().raw().toBuffer();
  assert.deepEqual(actual,expected,'preserve the exact existing texture and mask once at build time');
  const baked=`data:image/png;base64,${readFileSync('assets/props/spring-water-mobile.png').toString('base64')}`;
  let previous=0;
  for(const reveal of [0,.1,.25,.5,.75,.99,1]){
    const xml=`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="144" viewBox="${b.x} ${b.y} ${b.width} ${b.height}"><defs><clipPath id="flow"><path d="${springWaterRevealPath(reveal)}"/></clipPath></defs><image href="${baked}" x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" clip-path="url(#flow)"/></svg>`;
    const data=await sharp(Buffer.from(xml)).ensureAlpha().raw().toBuffer();
    const count=alphaBounds(data,320,144).count;assert.ok(count>=previous);previous=count;
    if(reveal===1){
      let lost=0;for(let i=3;i<actual.length;i+=4)if(actual[i]>20&&data[i]<actual[i]-8)lost++;
      assert.ok(lost<15,`the completed reveal cannot lose water pixels: ${lost}`);
    }
  }
});
