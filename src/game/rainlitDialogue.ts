import type { DialogueLine, Emotion, InteractionId, MapId, Progress } from './model.ts';
import { isRainlitMap } from './rainlit.ts';
const say = (speaker: DialogueLine['speaker']) => (text: string, emotion: Emotion = 'neutral', beat?: string): DialogueLine => ({ speaker, text, emotion, gesture: emotion === 'curious' ? 'think' : 'talk', ...(beat ? { beat } : {}) });
const R = say('Rae Jacob'), T = say('Tala'), B = say('Bagtas'), M = say('Mayumi'), L = say('Luning');

export function rainlitLines(id: InteractionId, p: Progress, map: MapId): DialogueLine[] | null {
  const r = p.rainlit;
  if (id === 'rainroadEntry') return p.chapterTwo.debriefSeen ? [
    B('There. The road behind my shelter. The riverside people use it to reach the spring. I am coming with you.'),
    R('Because we are headed toward the Heart Balete?'),
    B('Because I told the basket-maker the road was safe this morning. I should find out whether I was right.', 'determined'),
    T('I will leave a copy of our checked turns here. Our next page begins together.'),
  ] : [T(!p.chapterTwo.metBagtas ? 'The sign says Rainlit Road. We should speak to the traveler by the shelter before following an unchecked road.' : p.chapterTwo.routeVerified ? 'Let us show Bagtas the checked route before we leave.' : 'We need to check the turning paths with Bagtas before taking this road.')];
  if (id === 'rainroadArrival') return [
    R('It is raining and sunny at the same time. The whole forest looks like somebody washed it.', 'delighted', 'Drops fall from one leaf to another. Bagtas waits until Tala has folded the dry side of her map inward.'),
    R('La would tell me to come inside. Then I would say one more minute. I used up a lot of those minutes, didn’t I?', 'wistful'),
    T('We can stop for one now. You do not have to earn every rest by fixing something.'),
    B('A remarkably sensible suggestion. My finest journeys include sitting down.'),
    R('Does being a tikbalang mean you always know where you are? Even in the dark?'),
    B('My ears are excellent. My memory is excellent. Neither tells me what happened after I last passed a place.'),
    T('That belongs on the map: checked this morning is different from checked now.'),
    R('You two make adventure sound like homework. Very wet homework.', 'wry'),
    B('Then here is the practical examination. Follow this broad road east until the riverside roofs appear. Listen when the water changes.'),
    T('You can always return west to the shelter. No route behind us disappears just because we keep walking.'),
  ];
  if (id === 'hamletEntry') return [T('The plank roofs are ahead. Let us ask how the spring is running before we follow it upstream.')];
  if (id === 'roadReturn' || id === 'hamletReturn' || id === 'springReturn') return [T('I have marked our return route. We can walk back without losing our notes or the repair we have done.')];
  if (id === 'hamletArrival') return [
    R('More little houses! There is a tiny shirt drying on that rail. And a spoon. A very serious spoon.', 'surprised'),
    T('People live ordinary days here, Rae. Even while someone else is having an extraordinary one.'),
    R('I keep forgetting that the stories have laundry.', 'warm'),
    B('Luning works by the baskets in the middle of the yard. She will know whether her delivery arrived.'),
    R('Another duwende? Is it all right if I ask her about it? I have about forty questions.'),
    T('Start with her name. Then give her room to answer one.'),
  ];
  if (id === 'luning') {
    if (r.basketFreed && !r.basketReturned) return [
      L('My delivery basket! That dark band is my repair. The old weave is stronger than it looks.', 'surprised'),
      R('The strap caught under a root. Tala found it, Bagtas braced the wood, and I pulled very carefully. There was no heroic jumping.'),
      L('Good. I cannot weave a replacement Rae Jacob. The basket can wait for a patch.', 'warm'),
      T(r.restored ? 'The neighbors should have water again. We checked the outlet after lowering the root.' : 'Your basket is safe. The root is still resting on its forked support. We need to settle it before the outlet can run freely.'),
      L(r.restored ? 'I heard it reach the stones. A small sound, until you have spent a day without it.' : 'Then thank you for bringing this back safely. Finish the lowering when you return. The water matters more than my delivery.'),
      R('Could you leave a space beside your road notes for someone who is still looking for home?'),
      L('Already there. A covered cup, too. Take your time asking the keeper what she knows.', 'warm'),
    ];
    if (!r.metLuning) return [
      L('Bagtas. You said the spring road was clear.'),
      B('It was, when I checked it. I am checking again. With assistance.', 'determined'),
      R('I am the assistance. Rae Jacob. Tala is also assistance, but with much better handwriting.'),
      L('Luning. Basket-maker, occasional roof patcher, and the person who would like her delivery back.'),
      R('You are a duwende, like Tala? I thought everybody in Lola’s stories stayed under a tree.', 'curious'),
      L('This duwende is usually under a deadline. Tala’s home has its own stories. Mine has baskets to mend.'),
      R('Sorry. I think I have been asking people to fit inside the stories I already know.', 'worried'),
      L('Stories can introduce us. You still have to meet me. You have done that part nicely enough.', 'warm'),
      T('What happened to the delivery?'),
      L('A root shifted above the spring’s little outlet. My basket strap slid under it. I left it rather than tug at wood I could not support.'),
      L('Now the household rill barely feeds the hamlet. The big river has its own course. Rain filled our jars, but it has not cleared that pinch.'),
      R('Is there somebody guarding the water?'),
      L('Mayumi. We call her the Diwata ng Bukal. Cross the plank bridge east and follow the dry bank. Ask her before touching the spring.'),
      B('My shoulders are at your disposal. So, on this occasion, is my willingness to listen.'),
      L('A promising development. Bring the boy back with all his slippers.'),
    ];
    return r.restored ? [L('Hear the stream under the bridge? It reached us again.'), R(r.basketReturned ? 'And your basket has a new adventure to complain about.' : 'I still have your basket. Let me put it safely beside the rack.'), L('Thank you for coming back, Rae. The road means more when someone does.','warm')]
      : [L('Mayumi is across the eastern plank bridge. Follow the SPRING arrow. The basket can wait until the root is supported.'), R('No pulling first and finding out afterward. I promised.')];
  }
  if (id === 'springEntry') return !r.metLuning ? [R('Bagtas mentioned a basket-maker. I should speak to Luning in the yard before we head upstream.')]
    : [T('Across the planks, then along the dry bank. We will leave the wet moss and the pool itself undisturbed.')];
  if (id === 'springArrival') return [
    R('Someone is standing by the water. Her clothes look green until the light catches them.', 'surprised', 'A woman kneels to lift a stranded leaf out of a shallow stone pocket. She waits while a tiny fish slips back into shade.'),
    R('Is that... really a diwata? Like the ones Lola meant? I do not know what I thought they looked like. Taller than a story, I suppose.'),
    T('We can ask her. From the dry stones. There is room to approach on the left bank.'),
    B('I usually announce our arrival. This seems a good time to let someone else begin.'),
    R('My knees feel funny. I will begin very politely.', 'worried'),
  ];
  if (id === 'mayumi') {
    if (!r.metMayumi) return [
      R('Good afternoon po. Are we allowed to stand here? Luning said we should ask before touching anything.', 'worried'),
      M('The dry bank is safe. Thank you for asking. The wet moss is home to small lives that cannot move aside as quickly as you.'),
      R('I am Rae Jacob. That is Tala. And that is—'),
      B('Bagtas. Whose arrival usually requires no explanation.'),
      M('I know your hoofprints, Bagtas. Today they stopped at the right place.', 'wry'),
      R('Are you the Diwata ng Bukal? You do not have to tell me if that is a secret.', 'curious'),
      M('Mayumi. The people here call me the Diwata ng Bukal. This spring and the lives it feeds are in my care.'),
      R('You are real. Sorry. I know you are standing there. Lola told me about diwata, but a story never looked back at me before.', 'surprised'),
      M('Then let us give the meeting a little time. What did your Lola tell you?'),
      R('That there are places you should enter carefully. And that asking is better than grabbing. I was very good at the grabbing part.'),
      T('He is practicing the other part.'),
      R('Can you open a way back to her? I fell through the balete roots. Someone called to me. I did not mean to go so far.', 'wistful'),
      M('I cannot promise a door into your yard. I have not seen your crossing. I can show you what this water tells us, and tell you when I do not know.'),
      R('I wish you had said yes. But... thank you for saying it properly.', 'worried'),
      M('Sit with that wish as long as you need. You are a child far from home. You do not owe a spring a brave face.'),
      B('And he does not owe it a repair in exchange for directions. We can still help, if he wishes.'),
      R('Luning’s neighbors need the water. I want to help. Just tell me where to put my feet.'),
      M('On the dry bank. First, inspect the narrow rill below the pool, to my right. Tala can see under the root without moving it.'),
      T('I will trace the waterline and the strap. We need to understand what is trapped before anyone lifts.'),
      M('Then ask Bagtas to brace the root using the forked support below it. Free the basket only after the support is stable. Finally, lower the root onto its stone cradle.'),
      R('Look. Support. Untangle. Settle. I can remember that. Four things, and none of them are jumping into the spring.', 'determined'),
    ];
    if (r.restored && !r.sealSeen) return [
      M('Listen. The outlet reaches the next stones without stopping. A repair is complete when the people downstream can feel it.'),
      R('It sounded much bigger when I was worried about it. Now it is just... water. Doing water things.', 'warm'),
      T('I dated the low-water line and the restored one. The next person can see what changed.'),
      B('And I added that a forked support was needed. My strength is impressive. It is still useful to leave instructions.'),
      M('You have all left something another traveler can use. Let us rest before talking about the old road.'),
      R('La always knows when I am trying to look less tired than I am.', 'wistful', 'The forest settles around the ordinary sound of running water. Rae loosens the string around his pocket.'),
      { speaker: 'Someone?', text: 'Jacob...?', emotion: 'wistful', beat: 'A faint syllable travels with the water. For an instant, it has the shape of a voice calling across a familiar yard.' },
      R('La? Lola! I am here! Can you hear me?', 'surprised'),
      T('Rae—stay on the bank. I heard something, too. I could not make out whose voice it was.', 'worried'),
      R('It sounded like her. Please do not tell me I only wanted it to.'),
      M('Wanting does not make you foolish. But an echo cannot tell us where it began. We will keep what we heard separate from what we hope.'),
      R('Can I keep hoping while we check?'),
      M('Yes.', 'warm'),
      B('Then we check together. No running at a sound alone.'),
      T('Mayumi. The hollow above the outlet. There was no ring on that root when we arrived.', 'worried'),
      M('Stand back on the dry ground. Something is changing.', 'determined', 'A pale thread begins to gather over the closed hollow. Mayumi’s hand stills; she has not touched it.'),
    ];
    return [M(r.complete ? 'The new seal is in your notebook. Ask what you need before you take another road.' : r.restored ? 'The water is steady. The new mark is not. Inspect the pale seal from the dry bank below it.' : 'The narrow rill, the forked support, the trapped basket, then the stone cradle. Take each step carefully.'), R('And we can stop for a question?'), M('There is time for a question.', 'warm')];
  }
  if (id === 'springChannel') return !r.metMayumi ? [R('I should ask the woman beside the spring before I put my hands near it.')]
    : r.channelRead ? [T('The strap is pinched beneath the root. The forked support goes under the heavy end, beside Bagtas. We do not need to enter the pool.')]
    : [T('I can see beneath it from here. The basket strap has caught a mat of reeds across the little outlet.', 'determined', 'Tala crouches beside the dry edge and compares two wet marks on the stone. Her pencil stays above the water.'), R('Should I pull the basket?'), T('Not yet. The root rests on it. Bagtas must brace the heavy end with that forked support first.'), B('An opportunity to display both strength and restraint. I contain multitudes.', 'wry'), M('The stone cradle will carry the weight afterward. Keep the narrow gap beside it clear for the rill.'), R('So the spring is the source, the rill is the little stream, and the flow is what is getting pinched?'), M('Yes. Bukal, batis, agos. Related words for things you can observe, not three names for the same thing.')];
  if (id === 'springBrace') {
    if (!r.channelRead) return [B('Even these shoulders require a plan. Ask Tala to inspect the narrow rill to the right of Mayumi before we lift.')];
    if (r.basketFreed && !r.restored) return rainlitLines('springSettle', p, map);
    if (r.restored) return [B('Resting on stone, with the water gap open. A fine repair. I will accept a modest amount of admiration.'), T('I wrote down everyone’s part.'), B('An even finer record.')];
    if (r.rootBraced) return [B('The forked support is seated on firm stone. You can reach the basket at the right end of the root. Keep your fingers clear of the weight.')];
    return [B('Observe. Not a single dramatic heave.', 'determined', 'Bagtas lifts only as far as Tala asks. Mayumi checks the stone beneath the forked support. The wood settles with a low creak.'), T('Firm ground under both ends. It is stable. We can step away without leaving someone holding it.'), R('You made that look easy.'), B('You noticed the easy part. Good. Remember the checking, too.', 'warm'), M('Now take the basket at the root’s right end. Pull along the dry bank, away from the pool.')];
  }
  if (id === 'springBasket') return !r.rootBraced ? [R('The strap will not move safely while the root is resting on it.'), T('Inspect the narrow rill first, then use the forked support beside Bagtas.')]
    : r.basketFreed ? [R(r.basketReturned ? 'A clear gap, and Luning has her basket back.' : 'The gap is clear. I will keep Luning’s basket dry until I return it.'), T(r.restored ? 'And water can pass beneath the resting root.' : 'One more step: use the support beside Bagtas to settle the root onto the stone cradle.')]
    : [R('It is caught on a smaller twig. If I twist—no. La said to loosen a knot before pulling it tight.', 'determined', 'Rae feeds a little slack into the strap. Tala points to the snag, and he lifts the loop clear. The basket comes free without a splash.'), T('There. The reeds are loose now. Move them onto the dry bank, away from the outlet.'), B('A victory for those remarkably unremarkable hands.'), R('They are my favorite pair.', 'delighted'), M('Keep the basket for Luning. Now return to the support beside Bagtas and lower the root gently onto its stone cradle. That opens the rill fully.')];
  if (id === 'springSettle') return !r.basketFreed ? [T('The basket is still pinned. Brace the root, then free the strap before lowering anything.')]
    : [R('Slowly. Slowly. There. The water has room under it.', 'determined', 'The root settles onto stone. A bright line of water slips through the gap, reaches the outlet, and runs on toward the hamlet.'), T('Support removed, root stable, outlet clear. I can see the same leaf pass both stones.'), B('No grand entrance for the water. It appears quite confident without one.'), M('Let it reach the neighbors. Then come speak with me on the left bank. You have earned a quiet moment.', 'warm')];
  if (id === 'springSeal') return !r.sealSeen ? [R('This hollow is already closed, but there is no pale ring on it.'), T('I am sketching it as it is now. We should not force an opening.')]
    : r.complete ? [T('Fresh ring, same root hollow. We recorded when it formed. The way beyond remains closed.'), R('And the water is still reaching the hamlet. Both things can be true.')]
    : [
      R('It is the same kind of ring we found after the waybell. But that one was already there. This one just happened.', 'worried'),
      T('I have the earlier sketch. No ring. Now a ring. We all watched the change. The paths are still being closed.'),
      B('And I cannot blame an old map for something forming in front of my nose.', 'determined'),
      R('Mayumi, did fixing the spring do that? Did I make it worse?'),
      M('The outlet is open. The hamlet has water. Those are the changes we made. I do not know what formed this seal.'),
      M('Some closed ways protect a spring from feet and careless hands. A closure is not proof of cruelty. This mark needs its own explanation.'),
      T('We should find who is making them, and ask why. Before we decide every sealed passage must be opened.'),
      R('I still need a road home. I also do not want to break somebody else’s home to get there.'),
      B('Then you need a guide with the courage to say the road is unchecked. Fortunately, you have the finest available.'),
      R('And assistance with very good handwriting.', 'warm'),
      M('The old survey road continues beyond these banks. We will prepare what we know before you follow it. Tonight, the water runs, and there is a place for you to rest.'),
      R('One road at a time, La. I heard something today. I am going to find out what it means.', 'wistful', 'Tala dates the new seal. Beneath it, Rae draws a cup with room beside it for another. The spring keeps its small, steady sound.'),
    ];
  if (id === 'mayumiWater') return [R('If you care for a spring, can you just tell the water to go where you want?'), M('Water follows the ground it finds. I watch where it begins, what changes its course, and whose lives depend on it.'), R('That sounds like a lot of ordinary work for somebody in a story.'), M('Ordinary work keeps a place alive. A spring is not less remarkable because someone clears a leaf from it.'), T('And being remarkable does not make someone able to fix everything alone.'), M('Exactly. Keep that sentence on your map.', 'warm')];
  if (id === 'mayumiStories') return [R('Lola said diwata, but I think I imagined the same person in every forest.'), M('I can tell you who I am and the place I care for. One meeting cannot tell you every story people carry.'), T('Then on this page I will write Mayumi of this spring. No guessing at everyone else.'), R('And when I get home, I can ask Lola where she first heard her stories.'), M('Ask who told them, where they were told, and what the people of that place call their guardians. Names matter.'), R('Mayumi. I will remember yours.', 'warm')];
  if (id === 'mayumiRoads') return [R('What if the person sealing roads thinks they are helping?'), M('Then we must ask who is safer, who is stranded, and whether another way was left. An intention is the beginning of an answer.'), B('A guide who closes a dangerous turn still owes the traveler directions.'), T('And a date. If the danger changes, the warning should change.'), M('Take those questions to the maker of the seal. I will not invent an enemy because I cannot yet explain a mark.'), R('I can be angry about being lost and still ask a careful question.', 'determined')];
  if (id === 'springSeed') return !p.ubanGiftReceived ? [R('The water makes its own quiet sound.')]
    : !r.metMayumi ? [R('I will ask before bringing the seed near the water. I can keep it dry in my pocket.')]
    : [R('Mang Uban gave me this seed. May I hold it here? I will keep it dry.'), M('In your palm, on the dry bank. A gift need not be spent to be carried.'), R('It feels warm.', 'surprised', 'For a moment Rae remembers enormous hands folding a leaf, and the shade of a tree planted for someone who had not arrived yet. No doorway opens.'), T('What did it show you?'), R('I do not know if show is the word. I remembered someone making room for me.'), M('That is a useful thing to remember far from home.', 'warm')];
  if (id === 'listeningSeed' && isRainlitMap(map) && map !== 'spring') return [R('Still safe in its folded leaf. I can listen beside Mayumi’s spring when we return.'), T('A gift can travel without becoming a key.', 'warm')];
  if (id === 'listeningSeed' && map === 'spring' && p.ubanGiftReceived) return rainlitLines('springSeed', p, map);
  if (id === 'rainGauge') return [R('The cup is full. Why is Luning’s stream low?'), T('Rain in one cup does not tell us whether the outlet upstream is blocked. We should check both.'), R('Two observations. One wet forehead.')];
  if (id === 'bambooDrips') return [R('There is a whole upside-down tree in this drop. Look before it—oh! It fell.', 'delighted'), T('There will be another.'), R('I know. I wanted you to see that one.', 'warm')];
  if (id === 'basketRack') return [L('A patch is a record of someone deciding this was worth keeping.'), R('Lola says that about my shorts. There are a lot of records on my shorts.'), L('Then someone has been keeping you very carefully.', 'warm')];
  if (id === 'springMoss') return [R('There is something moving in the wet moss! Smaller than Tala’s pencil point.', 'surprised'), T('Then the smallest path on this page belongs to someone else.'), R('I can stay on the dry one. There is room.')];
  if (isRainlitMap(map) && id === 'bagtas') return [B(r.complete ? 'The road beyond the banks is still unchecked. We prepare before we follow it. Even the finest guide can wait for daylight.' : r.metMayumi ? 'Tala checks the narrow channel. I brace the root. Rae frees the basket. A guide remembers the whole party.' : 'East along the broad road. First the riverside hamlet, then Mayumi’s spring. We ask the people who live there what changed.'), R('You said we instead of I.'), B('A stylistic improvement. You may record it.', 'wry')];
  if (isRainlitMap(map) && id === 'tala') return [T(r.complete ? 'We know when this seal formed. We do not yet know who made it. That is our next question.' : r.metMayumi ? 'Look, support, untangle, settle. Mayumi gave us an order we can check. The notebook keeps the next step.' : 'Bagtas knows the road, Luning knows her neighbors, and the spring’s keeper knows this water. We should ask each of them.'), R('It is nice when I do not have to know everything before taking another step.'), T('You never did. Neither did I.', 'warm')];
  if (isRainlitMap(map) && id === 'talaWhere') return [R('Which part goes on the new page?'), T(map === 'rainroad' ? 'Rainlit Road. The shelter is west, and Riverside Hamlet is east, beyond the sunlit bend.' : map === 'hamlet' ? 'Riverside Hamlet. Luning works in the central yard. The eastern plank bridge leads to Mayumi’s spring.' : 'The Quiet Spring. Mayumi is on the left bank. The little household rill leaves beside the root; the larger river has its own course.'), T('I mark the dry ground we actually walked, then date it. The wet moss and the pool are not shortcuts.')];
  if (isRainlitMap(map) && id === 'talaHome') return [R('Does the old road really get me closer to Lola?'), T(r.complete ? 'It gives us a direction to investigate. The voice sounded familiar to you, but we do not know where it began. We will prepare before following the old survey road.' : 'Bagtas says the old survey road points toward the Heart Balete. Mayumi knows this spring. Neither has promised that your crossing is open.'), R('I want a promise. I know that does not mean someone can honestly give me one.'), T('You can ask for company while we look. That is a promise I can make.', 'warm')];
  if (isRainlitMap(map) && id === 'talaRinging') return [R('I keep listening for the waybell behind us.'), T('The bell is safe in the clearing. Its repair still matters here. We can hear smaller things now: water reaching a stone, a loose strap, someone asking us to stop.'), R('The quiet is getting quite crowded.'), T('We do not have to understand every sound at once.', 'warm')];
  if (isRainlitMap(map) && id === 'talaMaps') return [R('There are two waterlines on this page.'), T('Before and after. A drawing without a date could tell the next traveler the wrong thing.'), R('Do you ever wish you could draw a perfect map and be finished?'), T('Often. Then a neighbor moves a step, or a root grows, or somebody notices what I missed.'), T('I can leave room for a correction without leaving the page empty.'), R('Put my name beside the tiny upside-down tree in the raindrop, then. I definitely checked that.', 'delighted')];
  if (isRainlitMap(map) && id === 'talaCourtesy') return [R('I said po. But I still needed to ask where I could stand.'), T('A courteous word starts a meeting. It cannot tell you whether your foot is on someone’s home.'), R('So Lola’s advice is something to pay attention with, not a word that makes anything I do all right.'), T('That is how I would like a visitor to treat my doorstep. And I can ask what matters at theirs.'), R('Mayumi said the dry bank. I can manage the dry bank.', 'determined')];
  if (isRainlitMap(map) && id === 'talaJourney') return [R('Do you miss your own home while we are looking for mine?'), T('Yes. I wonder whether the lamps are steady and whether Minda finally sat down.'), R('You can want to be here and miss somewhere else?'), T('Both fit on the same page. I chose this road. That does not make the people behind us smaller.'), R('When I tell Lola about you, I will start with your name.'), T('Then let us make sure you have a good story to tell.', 'warm')];
  return null;
}
