import { dalisaySvg, tigmamanukanSvg } from './trailCreatureArt.ts';
import { currentMaze } from '../game/mazeTrials.ts';
import { mazeWayfinding } from '../game/mazeWayfinding.ts';
import type { DialogueLine, Progress } from '../game/model.ts';
const body=(s:string)=>s.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');

/** Ground anchors stay fixed while the bird flies above its own short stretch of trail. */
export function mazeHelperActors(p:Progress,clock:number,motion=true,line?:DialogueLine){
  const plan=currentMaze(p),way=mazeWayfinding(plan),time=motion?clock:0;
  return way.helpers.map(helper=>{
    if(helper.id==='tigmamanukan'){
      const cycle=(time+plan.stage*.7)%7,flight=motion&&cycle>2&&cycle<4.5;
      const phase=flight?(cycle-2)/2.5:0,travel=14*(1-Math.abs(phase*2-1));
      const dx=helper.facing==='left'?-travel:helper.facing==='right'?travel:0;
      const dy=(helper.facing==='up'?-travel:helper.facing==='down'?travel:0)-(flight?Math.sin(phase*Math.PI)*3:0);
      const flap=flight?1+Math.floor(time*8)%2:0,calling=motion&&!flight&&cycle>.8&&cycle<1.3;
      const bird=tigmamanukanSvg(helper.facing,flap,motion&&time%5.7<.14,calling);
      const perch='<ellipse cx="28" cy="62" rx="7" ry="1.3" fill="#16372a" opacity=".35"/>'
        +'<path d="M26 61V47h-5v-3h-6v-2h13v-5h3v11h-2v13z" fill="#66543a"/>'
        +'<path d="M27 58V46h-5v-1h6V38h1v20z" fill="#9d8354"/>'
        +'<path d="M27 56h-4v-2h5v-3h3v3h4v2h-5v3h-3z" fill="#617148"/>';
      return {...helper,y:helper.point.y,width:56,height:64,anchorX:28,anchorY:62,
        svg:`<svg xmlns="http://www.w3.org/2000/svg" width="56" height="64" viewBox="0 0 56 64" shape-rendering="crispEdges">${perch}<g transform="translate(${18+dx} ${28+dy}) scale(.5)">${body(bird)}</g></svg>`};
    }
    const speaking=line?.speaker==='Aling Dalisay';
    const giant=dalisaySvg(helper.facing,motion&&(time+1.8)%5.7<.15,speaking&&motion&&Math.floor(time*5)%3===0?1:0,motion?Math.floor(time*.7)%2:0);
    return {...helper,y:helper.point.y,width:48,height:60,anchorX:24,anchorY:58,
      svg:`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="60" viewBox="0 0 48 60" shape-rendering="crispEdges"><g transform="scale(.75)"><ellipse cx="32" cy="77" rx="24" ry="2" fill="#19372d" opacity=".35"/>${body(giant)}</g></svg>`};
  });
}
