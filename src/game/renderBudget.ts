/** Rendering stops behind static menus; simulation keeps its independent RAF timestep. */
export function sceneRenderRate(mode:string,dialogue:boolean,focused=true){
  if(!focused||['paused','settings','history','notebook','replayMenu','ending','chapterTwoEnding'].includes(mode))return 0;
  if(mode==='title')return 8;
  if(dialogue||['reply','questions','mangQuestions','lolaQuestions','mindaQuestions','bagtasQuestions','mayumiQuestions','tools'].includes(mode))return 12;
  return 30;
}

/** Carry fractional frame time across 60/90/120 Hz screens instead of resetting it. */
export function nextPaintTime(previous:number,now:number,rate:number):number|null{
  if(rate<=0)return null;
  const interval=1000/rate,count=Math.floor((now-previous+0.01)/interval);
  return count>0?previous+count*interval:null;
}
