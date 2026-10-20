import type { Direction, Emotion } from '../game/model.ts';

// Original pixel costumes and silhouettes; no sacred patterns or borrowed regalia.
const r=(x:number,y:number,w:number,h:number,c:string)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
const p=(d:string,c:string)=>`<path d="${d}" fill="${c}"/>`;
const svg=(body:string,w:number,h:number)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${body}</svg>`;
const body=(s:string)=>s.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');

/** Bird faces its actual next corridor. Side views mirror as a whole, preserving its face. */
export function tigmamanukanSvg(direction:Direction='right',flap=0,blink=false,calling=false){
  const back=direction==='up',front=direction==='down';
  let s='';
  if(back||front){
    s+=p('M17 23h7v12h-2v3h-3v-3h-2z','#193b51')+r(19,26,2,10,'#427b8c');
    s+=p('M14 12h13v4h3v10h-4v4H14v-4h-3V16h3z','#182e39');
    s+=p('M15 14h11v3h2v7h-3v4H15v-4h-2v-7h2z',back?'#238eae':'#32798b');
    if(flap){
      s+=p('M14 16H9v-3H5v-3H2v7h3v5h5v3h5z','#163d54')+p('M26 16h5v-3h4v-3h3v7h-3v5h-5v3h-5z','#163d54');
      s+=r(5,14,5,3,'#3ca9bc')+r(30,14,5,3,'#3ca9bc');
    }else s+=r(11,18,4,8,'#153e55')+r(26,18,4,8,'#153e55')+r(12,18,2,5,'#398c9b')+r(27,18,2,5,'#398c9b');
    s+=p('M16 5h9v2h3v9h-3v3h-9v-3h-3V8h3z','#132932')+r(16,6,8,2,'#308d9d');
    if(!back){s+=r(15,11,2,blink?1:3,'#eddeb1')+r(24,11,2,blink?1:3,'#eddeb1')+r(19,15,4,calling?4:2,'#aa9865');}
    s+=r(16,29,2,3,'#9b875a')+r(24,29,2,3,'#9b875a');
  }else{
    s+=p('M14 23h8v3h-5v4h-5v4H5v-3h4v-4h5z','#162f42')+r(7,30,7,2,'#3e6e7b');
    s+=p('M14 12h11v3h5v9h-4v4H15v-3h-5V17h4z','#1b3541');
    s+=p('M15 13h10v3h3v7h-4v3h-9v-3h-3v-5h3z','#288ba4')+r(15,14,7,2,'#58b9c5');
    s+=p('M23 6h9v3h3v8h-4v5h-6v-5h-4V9h2z','#162b32')+r(24,6,6,2,'#3c9ba8');
    s+=r(30,11,2,blink?1:2,'#dfd5a4')+r(31,11,1,1,'#fff0c6');
    s+=p(calling?'M34 13h5v2h-4v1h4v2h-6z':'M34 13h5v2h-5z','#a99567');
    if(flap===1)s+=p('M16 16h-4V9H9V3h5v3h4v5h4v7z','#245e7a')+r(11,5,2,7,'#4fabbc')+r(15,9,2,5,'#5bc6d0');
    else if(flap===2)s+=p('M15 17h8v5h-4v4h-4v3h-4v-9h4z','#174b65')+r(13,21,3,5,'#43a2b3');
    else s+=p('M13 17h9v5h-3v3h-5v-3h-2z','#1b536d')+r(14,18,6,2,'#40a6b9')+r(14,21,3,1,'#6ebac1');
    s+=r(19,27,2,4,'#ac9565')+r(25,26,2,5,'#ac9565')+r(18,30,5,1,'#d1bb83')+r(24,30,5,1,'#d1bb83');
    if(direction==='left')s=`<g transform="translate(40 0) scale(-1 1)">${s}</g>`;
  }
  return svg(s,40,40);
}

/** Dalisay is a seated, round-eared giantess with an open expression and grounded weight. */
export function dalisaySvg(direction:Direction='right',blink=false,mouth=0,breath=0){
  let s=p('M10 66h44v3h6v6H4v-6h6z','#343e32')+r(11,67,42,2,'#727154');
  s+=p('M11 48h42v4h6v13h-4v6H9v-6H5V54h6z','#614a36');
  s+=p('M13 46h38v5h6v12h-6v5H12v-5H7V53h6z','#967344');
  s+=p('M17 48h11v18H13v-4H9v-8h8z','#b18a51')+p('M38 47h12v8h6v7H43v5h-6z','#795f3c');
  for(let i=0;i<12;i++)s+=r(12+i*11%40,51+i*7%13,3,1,i%2?'#c09d62':'#6b5436');
  s+=r(16,67,12,6,'#8b593f')+r(38,66,11,7,'#916044')+r(16,72,14,3,'#4d4435')+r(37,72,15,3,'#4d4435');
  s+=r(18,68,8,2,'#ba8559')+r(39,68,7,2,'#c08c61');
  const torso=breath?1:0;
  s+=`<g transform="translate(0 ${torso})">`;
  s+=p('M19 26h26v4h7v22H12V31h7z','#443f32')+p('M20 28h24v4h6v19H14V33h6z','#8a6447');
  s+=r(17,34,5,14,'#b28b5f')+r(43,34,5,16,'#664f3b')+r(24,36,16,15,'#9d7750');
  for(let i=0;i<18;i++)s+=r(16+i*7%32,34+i*11%17,2,1,i%3?'#a58156':'#c5a171');
  // A plain pale shoulder cloth, with hand-stitched edges rather than tribal regalia.
  s+=p('M17 28h9v5h8v4h10v-7h5v12H35v-4H24v-4h-7z','#c0b58e')+r(19,29,5,2,'#e0d2aa')+r(36,38,10,2,'#e6d5a7');
  const restingArm=r(13,35,5,13,'#976a4b')+r(10,45,10,6,'#bb8a61')+r(12,46,7,2,'#d0a175');
  s+=direction==='left'?`<g transform="translate(64 0) scale(-1 1)">${restingArm}</g>`:restingArm;
  // Point with one complete arm; all four authored directions remain readable.
  const arm=direction==='up'?'M45 34h6V23h3v-8h-4v7h-4v7h-5v7z':direction==='down'?'M45 35h7v13h3v12h-4V50h-6z':direction==='left'?'M18 35h-6v4H4v-2H1v5h12v-3h7z':'M46 35h6v4h8v-2h3v5H51v-3h-7z';
  s+=p(arm,'#ad7c55');
  s+='</g>';
  s+=p('M23 4h18v3h5v6h3v16h-5v6H20v-5h-5V13h4V7h4z','#303831');
  s+=p('M23 9h18v5h4v12h-4v5H24v-4h-5V15h4z','#aa7652')+r(24,13,15,10,'#c09063');
  s+=r(18,18,3,6,'#a16c4c')+r(43,18,3,6,'#a16c4c');
  s+=p('M20 11V7h5V4h14v2h5v6H31V9h-5v3z','#4f5547')+r(24,5,4,3,'#8d8f75')+r(34,7,7,2,'#afb098')+r(20,11,3,9,'#8d927a');
  s+=r(24,17,5,1,'#5a4835')+r(36,17,5,1,'#5a4835');
  s+=r(25,20,3,blink?1:2,'#302f29')+r(37,20,3,blink?1:2,'#302f29');
  if(!blink)s+=r(25,20,1,1,'#efe1b3')+r(37,20,1,1,'#efe1b3');
  s+=r(31,21,3,4,'#986443')+r(31,21,2,2,'#dfad7c')+r(22,24,5,1,'#a77353')+r(38,24,5,1,'#a77353');
  s+=mouth?r(29,27,8,3,'#72503e')+r(31,29,5,1,'#d19a77'):p('M27 26h2v1h9v-1h2v2h-3v1h-7v-1h-3z','#764d38');
  return svg(s,64,80);
}

export function trailCreaturePortraitSvg(id:'tigmamanukan'|'dalisay',emotion:Emotion='warm',blink=false,mouth=0){
  let s=r(0,0,80,96,'#425e52')+p('M0 70h8V48h7v13h6V35h5v61H0z','#344d42')+p('M56 0h5v96h-5zM69 0h4v96h-4z','#57715b');
  for(let i=0;i<26;i++)s+=r(3+i*17%73,4+i*23%84,1,1,i%2?'#7d9365':'#bbad76');
  if(id==='tigmamanukan'){
    s+=p('M0 81h21v-3h28v-4h31v5H52v4H24v3H0z','#705b3d')+r(5,82,18,1,'#ae8d58');
    s+=`<svg x="3" y="10" width="74" height="74" viewBox="0 0 40 40">${body(tigmamanukanSvg('right',emotion==='delighted'?1:0,blink,mouth>0))}</svg>`;
  }else{
    // Hand-drawn portrait face at native portrait scale, rather than enlarging a world sprite.
    s+=p('M11 96V77h7v-9h12v-9h22v9h12v8h7v20z','#775d40')+p('M17 77h11v7h26v-9h10v21H17z','#ae9369');
    s+=p('M24 69h7v6h22v-6h6v16H42v-4H30v-5h-6z','#e0cda1');
    s+=p('M21 17h37v5h6v12h4v27h-7v9H20v-8h-7V32h4V22h4z','#303b33');
    s+=p('M24 24h31v6h7v27h-7v8H27v-5h-8V34h5z','#b17e58')+r(27,31,25,20,'#c99b70');
    s+=r(15,40,5,12,'#b2825d')+r(61,40,5,12,'#a77553');
    s+=p('M21 30V21h8v-7h22v5h10v12H42v-7H30v8z','#5b6452')+r(27,17,7,4,'#959b81')+r(43,20,12,3,'#b5b6a0');
    s+=r(20,31,5,16,'#8a927a')+r(56,31,5,16,'#9ba38a');
    s+=r(28,37,9,2,'#5b4e39')+r(46,37,9,2,'#5b4e39');
    s+=r(29,43,6,blink?2:4,'#31352b')+r(47,43,6,blink?2:4,'#31352b');
    if(!blink)s+=r(30,43,2,1,'#f1dfb4')+r(48,43,2,1,'#f1dfb4');
    s+=r(39,43,5,10,'#a16d4c')+r(39,43,3,6,'#dfb182')+r(24,51,8,2,'#af7856')+r(51,51,7,2,'#af7856');
    s+=mouth?r(35,57,12,5,'#78533f')+r(38,60,7,2,'#d7a27e'):p('M32 56h3v2h12v-2h3v4h-4v2H36v-2h-4z','#7d513a');
    for(let i=0;i<12;i++)s+=r(21+i*13%40,81+i*7%14,2,1,'#cbb17c');
  }
  return svg(s,80,96);
}
