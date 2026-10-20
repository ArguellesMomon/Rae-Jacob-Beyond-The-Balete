import { readFileSync } from 'node:fs';
import { mazeTerrainMarkup, mazeMarkersSvg, mazeGlamourSvg, mazeSightRadius, mazeGuidesSvg } from '../src/art/mazeTrialArt.ts';
import { currentMaze } from '../src/game/mazeTrials.ts';
import { characterSpriteSvg } from '../src/art/characterArt.ts';
import { mazeHelperActors } from '../src/art/mazeHelperArt.ts';
import { canStand, companionSpawn } from '../src/game/engine.ts';
import type { Point, Progress, Rect } from '../src/game/model.ts';
const textures=['stone','wind','water'].map(stage=>[`maze-${stage}-floor-mobile-v1`,`maze-${stage}-forest-mobile-v1`,...Array.from({length:8},(_,i)=>`maze-foliage-${i+1}-v2`)].map(name=>`data:image/png;base64,${readFileSync(`assets/maps/${name}.png`).toString('base64')}`));
const body=(s:string)=>s.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
export function mazeSceneArt(p:Progress,position?:Point,clock=1,options:{actors?:boolean;fog?:boolean;still?:boolean;viewport?:Rect}={}) {
  const plan=currentMaze(p),player=position&&canStand(position,plan.colliders,'turning')?position:plan.spawn;
  let s=mazeTerrainMarkup(p,textures[plan.stage],'trial',options.viewport)+body(mazeGuidesSvg(p))+body(mazeMarkersSvg(p))+body(mazeGlamourSvg(p,clock,!options.still));
  if(options.actors!==false){
    const companion=companionSpawn({...player,facing:'up',moving:false,stride:0},'turning',p);
    const actors=[{id:'rae' as const,point:player,w:20,h:30},{id:'tala' as const,point:companion,w:18,h:22}].sort((a,b)=>a.point.y-b.point.y);
    const layers=actors.map(actor=>({y:actor.point.y,svg:`<ellipse cx="${actor.point.x}" cy="${actor.point.y}" rx="7" ry="1.5" fill="#163429" opacity=".3"/><svg x="${actor.point.x-actor.w/2}" y="${actor.point.y-actor.h}" width="${actor.w}" height="${actor.h}">${body(characterSpriteSvg(actor.id,'up',-1,actor.id==='tala'?'map':'idle'))}</svg>`}));
    for(const helper of mazeHelperActors(p,clock,!options.still))layers.push({y:helper.point.y,svg:`<svg x="${helper.point.x-helper.anchorX}" y="${helper.point.y-helper.anchorY}" width="${helper.width}" height="${helper.height}">${body(helper.svg)}</svg>`});
    s+=layers.sort((a,b)=>a.y-b.y).map(layer=>layer.svg).join('');
  }
  if(options.fog)s+=`<defs><radialGradient id="maze-fog" cx="${player.x}" cy="${player.y-10}" r="${mazeSightRadius(plan.stage)}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#102923" stop-opacity="0"/><stop offset=".55" stop-color="#102923" stop-opacity="0"/><stop offset=".85" stop-color="#102923" stop-opacity=".08"/><stop offset="1" stop-color="#102923" stop-opacity=".3"/></radialGradient></defs><rect width="${plan.width}" height="${plan.height}" fill="url(#maze-fog)"/>`;
  return s;
}
