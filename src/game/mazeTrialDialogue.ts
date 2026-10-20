import type { DialogueLine, InteractionId, MapId, Progress } from './model.ts';
import { currentMaze, MAZE_TRIALS } from './mazeTrials.ts';
import { helperDirections, mazeWayfinding, trailDirectionWords } from './mazeWayfinding.ts';
const R=(text:string,emotion:DialogueLine['emotion']='curious',beat?:string):DialogueLine=>({speaker:'Rae Jacob',text,emotion,gesture:'talk',...(beat?{beat}:{})});
const T=(text:string,beat?:string):DialogueLine=>({speaker:'Tala',text,emotion:'warm',gesture:'map',...(beat?{beat}:{})});
const B=(text:string):DialogueLine=>({speaker:'Bagtas',text,emotion:'wry',gesture:'talk'});
const D=(text:string,beat?:string):DialogueLine=>({speaker:'Aling Dalisay',text,emotion:'warm',gesture:'talk',...(beat?{beat}:{})});
export function mazeTrialLines(id:InteractionId,p:Progress,map:MapId):DialogueLine[]|null {
  if(map!=='turning'&&id!=='turningEntry')return null;
  const plan=currentMaze(p),trial=MAZE_TRIALS[plan.stage],c=p.chapterTwo;
  if(id==='turningEntry')return c.metBagtas?[
    T(c.routeVerified?'All three signs are recorded. Bagtas owes us passage.':`Trial ${plan.stage+1}: ${plan.name}. One destination sign. Watch the omen bird, and look for occasional worn arrows, fallen white petals and tied leaves.`),
    R('No extra carvings to hunt down?'),T('None. Our completed trials stay earned. The entrance marker still leads back to the shelter.'),
  ]:[R('We should agree on the rules with Bagtas first.')];
  if(map!=='turning')return null;
  if(id==='turningArrival')return[
    R(plan.stage===0?'I can hear hooves everywhere. Which way are we supposed to go?':'Another stretch of bamboo. Is that the same blue bird?','surprised'),
    B(`${plan.name}. One destination sign. Reach it and read it; that is the whole trial.`),
    T('Watch where the bird flies. The old arrows are spaced out, and white petals mark the turns. There is a resting place farther in, too. We can ask for help.'),
    R('One sign. And no starting over if I take a wrong turn. Good.','determined'),
  ];
  if(id===plan.goal.id)return c.routeVerified?[T('All three signs are earned. Return to Bagtas for his side of the bargain.')]:[
    ...([
      [R('The crack goes right through the stone on this sign. We found it!','delighted'),T('The Divided Stone. First trial complete. We can leave the other branches behind.')],
      [R('Three leaves on a bowed stalk. Even your backward wind cannot hide that.','delighted'),T('The Backward Wind. Second trial complete. One sign left.')],
      [R('The little leaf is moving past the reed. Running water, just like the sign.'),R('And La said to turn my shirt inside out if a tikbalang kept me going in circles.','determined','Behind the sign’s reed screen, Rae reverses his sando. The doubled hoofbeat falls quiet.'),T('The Borrowed Current. Third trial complete. We found every sign together.')],
    ] as DialogueLine[][])[plan.stage],
    B(plan.stage===2?'Three signs. A most inconvenient success. Come collect your promised road.':`One trial earned. Next: ${MAZE_TRIALS[plan.stage+1].name}. Even the birds seem determined to interrupt my dramatic pauses.`),
  ];
  if(id==='tigmamanukan'){
    const helper=mazeWayfinding(plan).helpers.find(h=>h.id===id)!;
    const beat=`The bird tilts its head, opens its blue wings and flies a short way ${trailDirectionWords[helper.facing]}. It returns to the same perch.`;
    return (c.helperChats[id]??0)>0?[
      R('There you are. Will you show us again?','warm',beat),
      T(helperDirections(plan,id)),R('Thank you. We will walk; you can keep the flying part.','delighted'),
    ]:[
      R('Tala! That bird keeps looking back at us. Is it waiting for me?','surprised',beat),
      T('A Tigmamanukan. I have heard Tagalog stories of an omen bird: travelers listened to its calls before deciding whether to continue.'),
      R('Lola listens for rain. People listened to a bird before a whole journey? Can it tell we are lost?'),
      T('The stories speak of signs, not a bird explaining every turn. This one seems to want our attention. Let us watch where it actually goes.'),
      T(helperDirections(plan,id)),
      R('It flew that way, then waited instead of leaving us behind. Hello, little bird. I am Rae. I am trying to get home.','warm'),
      T('We can follow this short stretch, then check the petals at the next turn. No need to chase it into the bamboo.'),
    ];
  }
  if(id==='dalisay'){
    const helper=mazeWayfinding(plan).helpers.find(h=>h.id===id)!;
    const beat=`Aling Dalisay points ${trailDirectionWords[helper.facing]}, keeping her large hand above the path so the travelers have room.`;
    return (c.helperChats[id]??0)>0?[
      D('There you are, little travelers. Take a breath; the bamboo can wait.'),D(helperDirections(plan,id),beat),
      R('Thank you, po. It helps when someone waits for us.','warm'),D('A wrong turn is a reason to ask, not a reason to be ashamed.'),
    ]:[
      R('Oh! I thought that was a rock beside the clearing. Tala... she is taller sitting down than I am standing up.','surprised','A giantess rests with her hands open on her knees. She lowers her gaze until Rae can meet it.'),
      D('Only my knees are rocks after sitting this long. I am Dalisay. You can stand there, child; I will keep the road open.'),
      R('Hello, po. I am Rae Jacob. Are you a kapre, like Mang Uban?'),
      D('No, little Rae. A large shadow can belong to more than one kind of neighbor. You may ask me yourself; your friend need not do all the asking.'),
      R('Do the hoofbeats bother you? I keep thinking I chose the wrong path.','worried'),
      D('They bother my afternoon. They do not get to decide whether you deserve help. Put your feet still a moment. Which sign are you looking for?'),
      R(`The ${plan.stage===0?'split stone':plan.stage===1?'bowed bamboo':'running water'}. Just one sign. Then we can go on.`,'determined'),
      D(helperDirections(plan,id),beat),
      D('White petals continue after that turn. I gather what has already fallen and leave a few where small eyes can find them. Nothing here needs another errand from you.'),
      R('I was frightened when I saw how big you were. I am sorry I stared.','wistful'),
      D('You looked, and then you asked. That is a good beginning. Rest if you need to. The path will still be here when you stand.'),
      R('Thank you, Aling Dalisay. When I get home, I have so much to tell Lola.','warm'),
    ];
  }
  if(id==='trailVerse'){
    const clue=mazeWayfinding(plan).inspect;
    return[R('White petals, and a strip of leaf tied around a fallen twig.'),T(`They continue ${trailDirectionWords[clue.facing]}. This is the right branch. Someone has left a quiet confirmation between the old arrows.`),R('Good. I would like a path that says something back when I choose it.','warm')];
  }
  if(id==='turningReturn')return[T('We can rest at the shelter. Our current trial and every completed sign stay saved.'),R('A rest. Not surrender.')];
  if(id.startsWith('tala'))return[
    T(`Trial ${plan.stage+1}: ${plan.name}. ${trial.rule}`),
    T('The worn arrows are occasional. Watch the Tigmamanukan near the start, or ask Aling Dalisay in the clearing. White petals lead into the right branch, and leaf ties confirm it. We only need one destination sign.'),
    R('And if I need a rest?'),T('We keep our progress. You do not have to earn the earlier signs again.'),
  ];
  return null;
}
