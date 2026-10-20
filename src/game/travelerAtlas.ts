import type { Direction, Emotion, Gesture } from './model.ts';
export const TRAVELER_DIRECTIONS:readonly Direction[]=['down','right','up','left'];

/** Every cell is the exact authored angle, stride, blink and common walking pose. */
export function travelerWalkCell(id:'rae'|'tala',direction:Direction,frame:number,blink:boolean,emotion:Emotion,gesture:Gesture){
  const variant=id==='rae'?(emotion==='curious'?1:0):(gesture==='guardMap'?1:0);
  return {column:Math.max(0,frame)%8,row:variant*8+(blink?4:0)+TRAVELER_DIRECTIONS.indexOf(direction),cellWidth:64,cellHeight:id==='rae'?96:80};
}

/** Match SvgXml's uniform fit, with a fixed foot anchor in every animation state. */
export function travelerFrameLayout(cell:{column:number;row:number;cellWidth:number;cellHeight:number;columns?:number;rows?:number},width:number,height:number){
  const scale=Math.min(width/cell.cellWidth,height/cell.cellHeight);
  const frameWidth=cell.cellWidth*scale,frameHeight=cell.cellHeight*scale;
  return {x:-frameWidth/2,y:-height+(height-frameHeight)/2,width:frameWidth,height:frameHeight,
    imageX:-cell.column*frameWidth,imageY:-cell.row*frameHeight,imageWidth:frameWidth*(cell.columns??8),imageHeight:frameHeight*(cell.rows??16)};
}

type Pose={gesture:Gesture;emotion:Emotion;frames:readonly number[]};
export const TRAVELER_ATLAS_POSES:Record<'rae'|'tala',readonly Pose[]>={
  rae:[{gesture:'idle',emotion:'neutral',frames:[0,1,2,3,4,5,6,7]},{gesture:'idle',emotion:'curious',frames:[0,1,2,3,4,5,6,7]},
    {gesture:'idle',emotion:'neutral',frames:[-1,-2]},{gesture:'idle',emotion:'curious',frames:[-1,-2]},
    {gesture:'brush',emotion:'neutral',frames:[-3,-4]},{gesture:'think',emotion:'curious',frames:[-1,-2]},
    {gesture:'listen',emotion:'curious',frames:[-1,-2]},{gesture:'wave',emotion:'neutral',frames:[-3,-4]}],
  tala:[{gesture:'idle',emotion:'neutral',frames:[0,1,2,3,4,5,6,7]},{gesture:'guardMap',emotion:'neutral',frames:[0,1,2,3,4,5,6,7]},
    {gesture:'idle',emotion:'neutral',frames:[-1,-2]},{gesture:'map',emotion:'neutral',frames:[-1,-2]},
    {gesture:'listen',emotion:'neutral',frames:[-1,-2]},{gesture:'guardMap',emotion:'neutral',frames:[-1,-2]},
    {gesture:'wave',emotion:'neutral',frames:[-3,-4]}],
};
export function travelerFrameCell(id:'rae'|'tala',direction:Direction,frame:number,blink:boolean,emotion:Emotion,gesture:Gesture){
  let index=0;
  const poses=TRAVELER_ATLAS_POSES[id],columns=16,rows=Math.ceil(poses.reduce((n,p)=>n+p.frames.length*8,0)/columns);
  for(const pose of poses){
    const phase=pose.frames.indexOf(frame);
    if(pose.gesture===gesture&&pose.emotion===emotion&&phase>=0){
      index+=((blink?4:0)+TRAVELER_DIRECTIONS.indexOf(direction))*pose.frames.length+phase;
      return {column:index%columns,row:Math.floor(index/columns),cellWidth:64,cellHeight:id==='rae'?96:80,columns,rows};
    }
    index+=pose.frames.length*8;
  }
  return null;
}
