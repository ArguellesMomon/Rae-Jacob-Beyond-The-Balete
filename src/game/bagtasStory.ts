import { mazeTrialLines } from './mazeTrialDialogue.ts';
import type { BambooForkId, DialogueLine, InteractionId, MapId, Progress } from './model.ts';
import { followsRoute, FORKS, LANDMARKS, landmarkAt, PROOF_NOTES, routeReady } from './chapterTwo.ts';
import { choiceBeat } from './storyChoices.ts';
const R = (text: string, emotion: DialogueLine['emotion'] = 'curious', beat?: string): DialogueLine => ({ speaker: 'Rae Jacob', text, emotion, gesture: emotion === 'wistful' ? 'think' : 'talk', ...(beat ? { beat } : {}) });
const T = (text: string, emotion: DialogueLine['emotion'] = 'warm'): DialogueLine => ({ speaker: 'Tala', text, emotion, gesture: 'map' });
const B = (text: string, emotion: DialogueLine['emotion'] = 'wry', beat?: string): DialogueLine => ({ speaker: 'Bagtas', text, emotion, gesture: 'talk', ...(beat ? { beat } : {}) });
export function chapterTwoLines(id: InteractionId, p: Progress, map: MapId): DialogueLine[] | null {
  const trial = mazeTrialLines(id,p,map); if(trial) return trial;
  const c = p.chapterTwo;
  if (id === 'mangBagtas' && c.metBagtas) return [R('Bagtas was making the paths repeat. On purpose.'), { speaker: 'Mang Uban', text: 'He enjoys being the one who knows the joke. Did you ask what you were agreeing to?', emotion: 'wry', gesture: 'talk' }, R('A way out whenever we wanted. No borrowed voices from home. He had to say it plainly.', 'determined'), { speaker: 'Mang Uban', text: 'Remember how you made him listen. You need not enjoy a trick to speak to its maker.', emotion: 'warm', gesture: 'talk' }];
  if (id === 'minda' && c.debriefSeen) return [R('Bagtas made a maze of the bamboo. We found a route, but I did not like being someone else’s game.'), { speaker: 'Minda', text: 'Then tell him that, even if he helped afterward. Gratitude does not require you to forget.', emotion: 'warm', gesture: 'talk' }, T('We recorded the safe way out. Nobody has to accept his challenge to return here.')];
  if (id === 'bambooDeparture') return p.chapterComplete ? [T('The bamboo road is open. The waybell stays behind us.'), R('And the way back?'), T('Still here. New paths do not erase old ones.'), R('Then let us find who is making those hoofbeats.', 'determined')] : [T('First, inspect the pale mark on the cut root.')];
  if (id === 'bambooArrival') return [R('Tala, the hooves are ahead of us. Now behind us. There is only one road!', 'surprised', 'Three measured clops answer from opposite sides of the bamboo. The last arrives before its echo.'), T('Stay beside me. A sound is not a direction.'), { ...B('A promising observation. Most visitors have already started running by now.'), cue: 'hooves' }, R('That voice is laughing at us.'), T('Then we should meet its owner before following its advice.'), R('Lola would make me introduce myself. I would rather introduce a fence between us.', 'worried')];
  if (id === 'bagtas') return c.metBagtas ? [B(c.routeVerified ? 'You have returned with inconveniently good evidence. Show me.' : 'Three trials. One destination sign in each. The old carvings remain. That bird and Dalisay have added their own little clues.'), R('Stone, bending bamboo, running water. We read one sign and that trial is done.'), T('Worn arrows, petals and leaf ties follow the real paths. Wrong turns cost no completed progress.'), B('You are taking a dreadful amount of suspense out of my afternoon.')] : [
    R('Tala... his head. Those feet. Please tell me that is a costume.', 'surprised', 'Rae stops at the edge of the shelter. The tall figure unfolds his arms, mane slipping over broad shoulders.'),
    T('A tikbalang. You can stay beside me.'), R('Lola said they could make you lose your way. My knees remember that part very clearly.', 'worried'),
    B('Bagtas. Finest guide in this bamboo. Also the reason you have passed that bent stalk twice.'), R('You did that? We thought we were getting somewhere!'),
    B('You were. Back to me. Excellent destination.'), R('That is not funny when you do not know how to get home.', 'worried'),
    B('A child in a hurry, a map with unfinished edges. You were going to ask for the Heart Balete without asking whose paths you crossed.'),
    T('We can ask permission. You could have answered without turning us around.', 'determined'), B('I could. But then I would have learned nothing about you.'),
    R('And we would have learned less about you. I am Rae Jacob. This is Tala. May we pass through your bamboo?'),
    B('Better. Passage has a price: outwit my three turns. Bring me proof that you looked at the road instead of chasing the voice that sounded most certain.'),
    T('Your terms, clearly. Before either of us agrees.'),
    B('Three separate trails: stone, wind and water. One destination sign in each. Find it and read it. The occasional worn arrow points toward it. A meddlesome bird and Dalisay seem determined to make this a social visit.'),
    R('And if I take a wrong turn?'), B('Follow the arrows back out. No resets, no lost belongings, no trapped feet. Completed trials remain earned. The marked return at each entrance always leads back to this shelter.'),
    R('No pretending to be my Lola. No making Tala disappear. And if we say stop, we stop.', 'determined'),
    B('You negotiate rather well for someone wearing such small slippers.', 'wry', 'The smile leaves his muzzle for a breath. He rests one hoof flat on the earth.'),
    B('Agreed. Your grandmother’s voice stays yours. Your companion stays with you. The return path remains open.'),
    T('And what do you owe us when we succeed?'), B('The road toward the spring. My company as far as its keeper. Answers without a false turn tucked inside them.'),
    R('Why would the finest guide need to make people prove themselves?'), B('Because every traveler wants a shortcut. Very few ask what is growing under the feet they hurry past.'),
    T('That explains what you care about. It does not make every trick kind.'), B('No. I did not offer kindness. I offered a bargain.'),
    ...choiceBeat('bagtasIntent', p, B('Have you a condition to add?')),
    B('The signs bear a split stone, bowed bamboo and running water, in that order. One sign per trail. Even my most persuasive hoofbeats cannot move those gold arrows.'),
    R('Stone, bamboo, water. And keep my friend where I can see her.'), B('To your right: TURNING PATHS. I shall enjoy this enormously. Try not to make it too easy.'),
  ];
  if (id === 'bagtasPaths') return [R('Are all those hoofbeats really you?'), B('All mine. Their locations are a different matter. I can invite your attention east while your feet carry you west.'), T('The sounds can lie. The little trail clues stay useful.'), B('The carvings point toward the destination sign. Dalisay leaves pale petals and tied leaves between them. Do not confuse a convincing clop with a direction.'), R('And one sign finishes the whole trial?'), B('One. A remarkably generous arrangement.'), T('If we enter a dead end, its arrow points back out. Nothing is lost.')];
  if (id === 'bagtasStories') return [R('Did you become a guide so you could confuse more people?'), B('I learned the road before most travelers learned to ask for it. Being ignored becomes tiresome.'), R('So does being lost.'), B('Yes.', 'neutral', 'One ear turns away. He rubs a knot in the survey cord rather than meet Rae’s eyes.'), T('You like being needed. You also like deciding when somebody is allowed to leave.'), B('A sharp pencil, that one.'), R('Lola told me about turning your shirt inside out when a tikbalang keeps leading you around. Does that bother you?'), B('Old advice travels farther than I would prefer. You may find a reason to remember it.'), T('That is one family’s telling. Bagtas is one tikbalang. We will record both without pretending they are the same thing.'), R('I still think your mane is amazing. I can think that and be cross with you.'), B('A balanced assessment. Begin with the mane when you write it down.')];
  if (id === 'bagtasSeals') return [R('Is the pale ring on the cut root another of your jokes?'), B('No. I turn a traveler’s attention. Those seals close actual passages. I do not know who makes them.'), T('You are sure of the difference?'), B('Certain of what I do. Uncertain of what they do. Record it in that order.'), R('Then we can be suspicious without deciding you did everything.')];
  if (id === 'bagtasDebrief') return [
    B('Back already? I had another splendid taunt prepared.', 'wry', 'His ears rise before he can lower them. Tala opens her notebook without handing it over.'),
    T('The split seam. Three leaves on the bowed stalk. A leaf carried past a reed. Three trails, three destination signs. We followed the ground instead of your borrowed hoofbeats.'), R('And I turned my sando inside out beside the last sign. La gets credit for that part.', 'delighted'),
    B('An inelegant victory. Annoyingly effective.'), R('You promised us a road. No extra test because we finished this one.'),
    B('The bargain stands.', 'determined', 'Bagtas unwinds one knot. The hoofbeats behind the shelter stop. For the first time, one sound comes from one place.'),
    T('Did you expect us to give up?'), B('I expected you to run after me. You stayed with each other instead.'), R('Tala is my friend, not part of your maze.'), B('I heard you the first time.', 'neutral'),
    R('Then hear this, too. It was clever. I hated not knowing whether you would let us leave.'), B('I kept the return path open.'), T('You knew that. A frightened child had to take your word for it.'),
    B('...Fair.', 'neutral', 'His hoof scrapes a short line into the soil. He leaves the word unadorned.'),
    B('Rainlit Road lies behind this shelter. I owe Luning an answer about a delivery, and I owe you passage to Mayumi. Those are promises, not prizes.'),
    ...(p.ubanGiftReceived ? [R('Mang Uban trusted me with a listening seed before I proved anything.'), B('Uban has his ways. I am beginning to suspect mine could use an alteration.', 'neutral')] : []),
    ...(p.storyChoices.bagtasIntent === 'playful' ? [B('Tell your slippers they have beaten a worthy opponent.'), R('They would like a snack and an apology.', 'wry')] : p.storyChoices.bagtasIntent === 'cautious' ? [B('Checked: the road to the hamlet. Unknown: whether your way home is open. No false certainty.'), R('Keep doing that.', 'warm')] : p.storyChoices.bagtasIntent === 'thoughtful' ? [B('You asked for a companion instead of an opponent. I shall attempt the less familiar role.'), R('You can start by walking where your hooves sound.', 'wry')] : []),
    B('I remain the finest guide available. You may correct my directions. Quietly, if possible.'), T('Clearly, when necessary.'), R('Then let us go. Together, and no disappearing.', 'determined'),
  ];
  if (id === 'bambooReturn') return [T('Back to Rootwater Works. The waybell still holds its name.')];
  if (id === 'turningReturn') return [T('The southern trail returns to the shelter. Leaving does not surrender our notes or checked steps.'), R('We decide when to rest. That was part of the bargain.')];
  const props: Partial<Record<InteractionId, DialogueLine[]>> = {
    bambooCord: [R('A knot for every road?'), B('And for agreements. I do not tie one lightly.'), T('Then make room for ours.')],
    bambooCup: [R('You have a small cup ready.'), B('Being a difficult host is not the same as being a thirsty one. Drink if you wish. It changes none of our terms.')],
    hoofMarks: [R('These prints cross the same patch of mud in both directions.'), T('He can throw the sound of a pursuit without taking a step.'), R('I am going to watch his feet when he tells me where to go.')],
    rainLeaves: [R('Sun and rain. La says there is a tikbalang wedding.'), B('No wedding here. One thoroughly occupied bachelor.'), T('A familiar saying. A particular tikbalang. Different things to record.')],
    trailVerse: [T('Stone with a seam. Crown that bends. Water that runs. Three trails, one destination sign in each.'), B('Look for worn waymarks and pale petals. Ignore the hoofbeats. Read each sign and that trial is earned.'), R('A rule I can remember without filling your whole notebook.')],
    pathStone: [R('A pale seam all the way through. No round hole in the middle.'), T('Proof one. The true split-stone sign has a zigzag crack; the hollow-stone sign has a closed dark center.'), R('A drawing can look nearly right and still send us wrong.')],
    pathWind: [T('Three leaves on a bowed living stalk. Their undersides catch the light.'), R('Inside out... La had advice about clothes when a tikbalang kept turning the road around.'), T('Remember it. There is a sheltered spot just to the right if we need to try it.'), R('The true bamboo sign has one bent stalk and three leaves. I can check that.')],
    pathWater: [R('That leaf passed the reed. This water is going somewhere.'), T('Proof three. The running-water sign has two broken ripple lines. The still-water trick is a closed ring.'), R('A splashing sound by itself could be Bagtas. The leaf actually moved.')],
  };
  if (props[id]) return props[id]!;
  if ((map === 'bamboo' || map === 'turning') && id.startsWith('tala')) {
    if (id === 'talaWhere' || id === 'talaHome') return [T(c.routeVerified ? 'We earned passage. Return to Bagtas for his side of the bargain.' : map === 'bamboo' ? 'The named Turning Paths arch is to the right of Bagtas.' : `Our next proof is ${LANDMARKS[c.trailStep].toLowerCase()}. Explore the inner junction and the two short side trails. The southern entrance stays open.`)];
    if (id === 'talaRinging') return [T('The bell repair still holds. This maze is Bagtas’s doing, and the pale seals are another question.')];
    if (id === 'talaMaps') return [T('I draw the ground we walked. Then I record where a turn actually returned us. His joke cannot move the ink on this page.'), R('Leave room for how cross I am.'), T('A generous margin.', 'wry')];
    if (id === 'talaJourney') return [R('You do not have to stay for his challenge.'), T('I know. I am choosing to stay with you. That makes the choice ours.'), R('Then we leave together, too.', 'warm')];
  }
  return null;
}
