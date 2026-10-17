import type { BambooForkId, DialogueLine, InteractionId, MapId, Progress } from './model.ts';
import { followsRoute, FORKS, LANDMARKS, landmarkAt } from './chapterTwo.ts';
import { choiceBeat } from './storyChoices.ts';
const R = (text: string, emotion: DialogueLine['emotion'] = 'curious', beat?: string): DialogueLine => ({ speaker: 'Rae Jacob', text, emotion, gesture: emotion === 'wistful' ? 'think' : 'talk', ...(beat ? { beat } : {}) });
const T = (text: string, emotion: DialogueLine['emotion'] = 'warm'): DialogueLine => ({ speaker: 'Tala', text, emotion, gesture: 'map' });
const B = (text: string, emotion: DialogueLine['emotion'] = 'wry', beat?: string): DialogueLine => ({ speaker: 'Bagtas', text, emotion, gesture: 'talk', ...(beat ? { beat } : {}) });
export function chapterTwoLines(id: InteractionId, p: Progress, map: MapId): DialogueLine[] | null {
  const c = p.chapterTwo;
  if (id === 'mangBagtas' && c.metBagtas) return [R('We met Bagtas. He was trying to check a path that kept returning him to his own footprints.'), { speaker: 'Mang Uban', text: 'And did he admit it before telling you which turn to take?', emotion: 'wry', gesture: 'talk' }, R('He did. We are helping each other check the landmarks.', 'warm'), { speaker: 'Mang Uban', text: 'Good. Knowing where your certainty ends is useful work for a guide.', emotion: 'warm', gesture: 'talk' }];
  if (id === 'minda' && c.debriefSeen) return [R('We found Bagtas. Tala and I checked a route through the turning bamboo with him.', 'delighted'), { speaker: 'Minda', text: 'Then we have another reliable place to send a traveler. Thank you for coming back to tell me.', emotion: 'warm', gesture: 'talk' }, T('We kept dates beside the landmarks. We can copy the notes for the clearing.'), { speaker: 'Minda', text: 'After you sit down. Good directions should include somewhere to rest.', emotion: 'warm', gesture: 'talk' }];
  if (id === 'bambooDeparture') return p.chapterComplete ? [T('The bamboo road. We checked the cut root; this is the open path beside it.'), R('We can go back if we need to?'), T('To Minda, Mang Uban, and the clearing. A new road does not erase the old one.'), R('Then let us find the person attached to those hoofbeats.', 'determined')] : [T('First, look at the pale mark on the severed root. We should know what we are leaving behind.')];
  if (id === 'bambooArrival') return [
    R('The bamboo is taller than the yard fence. Considerably taller.', 'surprised', 'Light slips through high leaves. A few rain drops tick against the hollow stalks.'),
    T('Keep the sound of the wheel behind us. For now, we know one way back.'),
    R('That voice said we had already taken the wrong road. An extremely encouraging welcome.', 'wry'),
    T('We can ask what it meant before deciding it meant trouble.'),
    R('Lola would make me introduce myself before arguing with someone that tall.'),
    T('There is a shelter ahead. And cups. Somebody expects travelers.'),
    R('Two cups. I am going to count that as a good sign.', 'warm'),
    T('We begin with our names. Then we ask for a road someone has actually checked.'),
  ];
  if (id === 'bagtas') return c.metBagtas ? [B(c.routeVerified ? 'Back to consult your favorite guide? Sensible. A checked path deserves a second look.' : 'The stone with a seam. The bending crown. The running water. Three things the road has not learned to disguise.'), R('And not simply north, east, or whichever way your ears point?', 'wry'), B('Excellent ears. Impeccable instincts. Still, use the landmarks. I would hate to be outdone by a signpost.'), T('We have questions, if you have a little time.')] : [
    R('Tala... his head. And those feet. That is not somebody wearing a mask, is it?', 'surprised', 'Rae stops short of the shelter. His fingers close around his spare kite string.'),
    T('No mask. You can stand beside me. We do not have to rush.'),
    R(p.metMang ? 'A tikbalang. I thought seeing a kapre would make me ready for anything. My knees disagree.' : 'A tikbalang. Lola told me about them. I did not think I would be standing this close to one.', 'worried'),
    B('At last. Travelers with the good sense to find the finest guide in this bamboo.', 'wry', 'The traveler straightens to his full height, broad shoulders catching the light. A long dark mane slips over his back. He sets one hand on his hip.'),
    R('The finest guide? There is a sign behind you pointing back to this same shelter.', 'curious'),
    B('Excellent placement. You found me, did you not?', 'wry'),
    R('You can really talk. Sorry! Of course you can. I have just never met anyone like you.', 'surprised'),
    B('Naturally I can talk. Directions would be rather wasted on a silent guide. Take your time coming closer; I am difficult to overlook.', 'warm', 'He lowers the smaller cup onto the bench, carefully clear of Tala. His chin remains lifted.'),
    R('Lola said a tikbalang could lead someone in circles. Were those your hooves calling from both sides?', 'worried'),
    B('My hooves. An unmistakable sound. The echoes took several routes; I took one. I called because you were approaching an unchecked road.'),
    R('Were you the person shouting about the wrong road?'),
    B('Bagtas. Remember the name; most roads do. And yes, I called. The road was wrong. No need to take it personally.'),
    R('Rae Jacob. This is Tala. Our bell has its name back, so we thought the road was fixed.'),
    B('One crossing was fixed. These turns and I are having a temporary disagreement. Since the surge, they keep returning me to this shelter.'),
    T('So the finest guide is caught in the loop, too?', 'curious'),
    B('I have been checking it from every angle. Extensively.', 'wry', 'One ear flicks backward. For a moment, Bagtas finds the survey cord more interesting than their faces.'),
    T('You know the paths. Does that mean you are changing them?', 'worried'),
    B('I have turned a careless traveler around before a doorstep was trampled. This is different. If I were arranging it, the turns would have considerably more style.'),
    T('We need to know what is happening, even if you do not know yet.'),
    B('Very well. I do not know what changed the paths. There. A rare admission. Do not make me repeat it.', 'determined'),
    R('Someone sealed a side passage behind us. A smooth cut, with a pale ring.'),
    B('Then do not pry it open. We can follow the road that remains, while we learn who has been closing the others.'),
    T('Can it lead toward the Heart Balete?'),
    B('Beyond this thicket, yes. Usually a small matter for someone of my experience. Today, we check the thicket before discussing my other triumphs.'),
    R('I need to get back to my Lola. I cannot spend forever following a road that walks behind me.', 'wistful'),
    B('Then we shall put those restless feet to use. I remember the landmarks. Tala records them. You check the posts. With my guidance, we can make one reliable route.', 'determined'),
    R('And with our checking.', 'wry'),
    B('Yes, yes. With your checking. I was coming to that.', 'wry'),
    ...choiceBeat('bagtasIntent', p, B('What do you need from me before we begin?', 'warm')),
    B('Read the little verse beside the shelter. First the split stone, then bent bamboo, then running water. Those sketches mark the paths that reach each landmark.'),
    B('The entrance is to your right, beyond the verse board. Look for the gold arrow under the arch marked TURNING PATHS. Walk up to it and choose Travel.', 'warm'),
    T('The posts can change position. We will record the landmark, not just a turn to the left.'),
    B('If a branch loops, come back calmly. Your checked steps still count. The return path at the bottom always reaches this shelter.'),
    R('One reliable route. That is a beginning I can understand.', 'determined'),
  ];
  if (id === 'bagtasPaths') return [R('Why remember a stone instead of a direction?'), B('A post can be turned. A traveler can turn. A seam through a stone takes more work to move. One of my better observations.'), T('So we compare what a marker shows with what we see.'), B('Precisely. And we check again after a change. My old cord measures the road I walked. Even my stride cannot measure a road before it exists.'), R('A guide who leaves room for corrections. Tala and I have been practicing that.', 'warm'), B('Call them refinements. It sounds better beside my name.', 'wry')];
  if (id === 'bagtasStories') return [
    R('I keep looking at your ears. Do they turn toward things before you hear them? Sorry. Is that rude?', 'curious'),
    B('Looking is understandable. Excellent ears. They turn toward interesting sounds. Including a child whispering beside my cup.', 'wry'),
    R('You heard that? I asked Tala whether you sleep standing up.', 'surprised'),
    B('After walking farther in a morning than most travelers manage all week, I have earned a seat.'),
    R('And your mane goes nearly to your waist. Does it catch on all the bamboo?'),
    B('I choose my turns carefully. A mane like this deserves a proper entrance.', 'wry'),
    T('It caught on the shelter cord when you stood up.', 'wry'),
    B('A badly placed cord. I shall relocate it.'),
    R('You look strong enough to lift that bench with one hand. Could you just push through the paths?'),
    B('Easily. The bench, I mean. Strength gets you through a thicket; knowing where you arrived takes something else.', 'determined'),
    R('Lola told stories about tikbalang making travelers lose their way. I was scared you might keep us here.', 'worried'),
    B('If I wanted an audience for my accomplishments, I would prefer one that stayed willingly. Ask your questions. Watch what I do. You may judge for yourself.', 'warm'),
    R('Then I will ask before I decide. But I might still jump if a hoof goes clop behind me.'),
    T('A story can remind us to be careful. It cannot tell us what every person will do.'),
    B('Good. You can begin by drawing my good side. Either will do.', 'wry'),
  ];
  if (id === 'bagtasSeals') return [R('Have you seen a pale ring like the one on the cut root?'), B('Yes. On another closed passage, farther along the old survey line.'), T('Beyond the flooding?'), B('On dry ground. I cannot tell you who made it. I can tell you the surge does not explain every closed road.'), R('Then fixing the water was real help, but not the whole mystery.'), B('Exactly. Do not let a larger worry make a small kindness disappear.', 'warm')];
  if (id === 'bagtasDebrief') return [
    B('Back already? An excellent result. Just as I expected.', 'wry', 'Bagtas pushes away from the shelter post, shaking a caught leaf from his mane. His ears turn toward Tala\'s notebook.'),
    R('Your ears went straight up. You looked surprised.', 'wry'),
    B('Impressed. A very different expression.'),
    T('Stone seam, bending crown, running water. I dated every observation. Rae checked each post.'),
    R('We kept the landmarks when the directions changed. Also, I would like to report that my slippers did excellent work.', 'delighted'),
    B('Then four feet and a careful pencil have earned the thanks of Bagtas. I do not hand those out with every cup of water.', 'warm'),
    R('There are only two of mine.'),
    B('I noticed Tala. You should keep doing that, too.', 'wry'),
    T('We can copy this route for the people returning from the clearing.'),
    B('I will walk it again before hanging my guide cord. If a route carries my name, it must carry people safely. Your notes will come with me.', 'determined'),
    ...(p.ubanGiftReceived ? [R('Mang Uban gave me this listening seed. It has not done anything dramatic.'), B('Then let it keep being a seed. Not every kindness needs to become a key.', 'warm')] : []),
    ...(p.storyChoices.bagtasIntent === 'playful' ? [B('The route has been measured against the pace of your slippers. I trust they approve.', 'wry'), R('They would approve even more after a snack.', 'delighted')]
      : p.storyChoices.bagtasIntent === 'cautious' ? [B('Checked: stone, bamboo, water. Unchecked: the rainlit road beyond. I remember what you asked of me.', 'warm'), R('That is a direction I can trust.', 'warm')]
      : p.storyChoices.bagtasIntent === 'thoughtful' ? [B('You offered to help a guide find his own way. I am glad I let you.', 'warm'), R('It is a good thing to practice from both sides.', 'warm')] : []),
    R('When we find a way toward home, will you tell me what you know and what you only hope?', 'worried'),
    B('Yes. Beyond this thicket lies the rainlit road. It points toward the Heart Balete. Whether your crossing is open is a question we still have to ask.', 'warm'),
    T('One checked route, and an honest next question.'),
    R('Lola, I am still coming. Today I helped a guide find his own way back.', 'warm', 'Bagtas adds a new knot to the shelter cord. Beside Tala\'s dated line, Rae draws two very large slippers.'),
  ];
  if (id === 'turningEntry') return c.metBagtas ? [T(c.routeVerified ? 'Our checked route is here. We can walk it again without losing what we learned.' : 'Stone, bending bamboo, running water. I have the verse. We will read every post.'), R('And if the path repeats, we still know how to reach the shelter.', 'determined')] : [R('I would like to know where these paths return before I try them. The tall traveler by the shelter may know.')];
  if (id === 'turningArrival') return [R('This leaf looks like a tiny boat. I shall remember it.', 'delighted'), T('There are three paths ahead: left, straight up, and right. Each has a sign showing its landmark. Walk close to a sign and choose Travel.'), R('So that is what you mean by a fork. A place where the path splits! Split stone first. Then bent bamboo. Then running water.'), T('After each turn, we may return to a clearing that looks the same. Our checked steps still count. Read the signs again; their pictures may move.'), T('The path at the bottom always returns to Bagtas. You can stop there whenever you want.'), R('No rushing into the loudest-looking road. Yes, La. I am learning.', 'warm')];
  if (FORKS.includes(id as BambooForkId)) {
    if (c.routeVerified) return [T('The route still connects. Back to the shelter; we can show Bagtas our notes.')];
    const landmark = landmarkAt(id as BambooForkId, c.trailStep), correct = followsRoute(p, id as BambooForkId);
    return correct ? [T(`${landmark}. That matches the next part of the verse.`), R(c.trailStep === 2 ? 'Running water. We checked all three! That is the shelter beyond the leaves.' : 'There is our landmark. Mark the page before the next turn.', 'delighted'), T(c.trailStep === 2 ? 'A route that connects. We should tell Bagtas.' : `Checked ${c.trailStep + 1} of three. ${LANDMARKS[c.trailStep + 1]} comes next. The posts may trade places again.`)]
      : [R('The little boat leaf again. We have come round to our own footprints.', 'surprised'), T(`We followed ${landmark.toLowerCase()}. The next landmark is still ${LANDMARKS[c.trailStep].toLowerCase()}. Our ${c.trailStep} checked steps are safe in the notebook.`), R('Stop first. Look around. Then read the post. I can try that again.', 'determined')];
  }
  if (id === 'bambooReturn') return [T('Back across the checked crossing to Rootwater Works. The waybell still holds its name.'), R('We can visit the others, and come back here afterward.', 'warm')];
  if (id === 'turningReturn') return [T('This southern trail goes straight to the shelter. Our checked steps stay on the page.')];
  const props: Partial<Record<InteractionId, DialogueLine[]>> = {
    bambooCord: [R('Knots in different sizes. Is this a very long necklace?'), B('A survey cord. Every knot is a distance I have walked. The loose end is this thicket, which is being difficult.'), T('You left room for a correction.'), B('For a refinement. People follow my directions. I intend to remain worth following.', 'determined')],
    bambooCup: [R('A large cup and a small one. Were you waiting for somebody?'), B('Naturally. The finest guide should offer more than excellent company. Smaller travelers need water, too.'), R('Lola saves a second cup, too.', 'warm')],
    hoofMarks: [R('All these prints turn back toward the shelter.'), T('He has been checking the same road, too.'), R('It is easier to blame someone when you have not looked at where they were walking.')],
    rainLeaves: [R('Rain and sunshine at once. Lola has a story for weather like this.'), B('I have a roof that needs mending for weather like this.'), T('Both worth remembering.', 'warm')],
    trailVerse: [T('First the stone with a seam. Then the crown that bends. Then the water that runs.'), B('The three fork posts carry sketches of those landmarks. They may change places; look at their shapes, not just west or east.'), R('Stone, bent bamboo, water. I will say it slowly while my feet are doing other things.')],
    pathStone: [R('A seam through a round stone. The first picture in the verse.'), T('Find the fork whose post carries that split-stone sketch.')],
    pathWind: [T('The crown bends without breaking. Three leaves, one curved stalk. That comes second.'), R('Like a kite string bowing in the wind. Shape first, direction second.')],
    pathWater: [R('Three ripples passing a reed. Running water comes last.'), T('Once we have checked stone and bamboo, that sketch should take us through.')],
  };
  if (props[id]) return props[id]!;
  if ((map === 'bamboo' || map === 'turning') && id.startsWith('tala')) {
    if (id === 'talaWhere' || id === 'talaHome') return [T(c.routeVerified ? 'We have a checked path back to the shelter. Bagtas can help us survey the rainlit road next.' : map === 'bamboo' ? 'The Turning Paths entrance is to the right of Bagtas, past the verse board. Find the named arch and gold ground arrow; walk close and choose Travel.' : `Read the signs on the left, top, and right paths. Our next landmark is ${LANDMARKS[c.trailStep].toLowerCase()}. The bottom path returns to Bagtas.`)];
    if (id === 'talaRinging') return [T('The waybell is still steady behind us. These changing turns are a separate problem.'), R('One good repair can stay good while we look at the next thing.', 'warm')];
    if (id === 'talaMaps') return [T('This page has dates beside the landmarks. I am leaving room for the route to change.'), R(p.talaMapHelped ? 'Our waterworks correction was good practice.' : 'And room for my very large footprints?','warm'), T('A narrow margin. You will have to be modest.', 'wry')];
    if (id === 'talaJourney') return [R('You said you were coming as far as the bamboo paths. We are here now.'), T('We are. I would like to see what is beyond them. I am choosing again.'), R('Then I am very glad to ask again.', 'warm')];
  }
  return null;
}
