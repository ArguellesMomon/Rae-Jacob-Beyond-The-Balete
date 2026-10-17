import type { DialogueLine, Emotion, Gesture, InteractionId, MapId, Progress } from './model.ts';

const line = (speaker: DialogueLine['speaker'], text: string, emotion: Emotion = 'neutral', gesture: Gesture = 'talk', beat?: string): DialogueLine => ({ speaker, text, emotion, gesture, ...(beat ? { beat } : {}) });
const R = (text: string, emotion: Emotion = 'curious', gesture: Gesture = 'talk', beat?: string) => line('Rae Jacob', text, emotion, gesture, beat);
const T = (text: string, emotion: Emotion = 'determined', gesture: Gesture = 'talk', beat?: string) => line('Tala', text, emotion, gesture, beat);
const L = (text: string, emotion: Emotion = 'warm', gesture: Gesture = 'talk', beat?: string) => line('Lola Selya', text, emotion, gesture, beat);
const M = (text: string, emotion: Emotion = 'neutral', gesture: Gesture = 'talk', beat?: string) => line('Minda', text, emotion, gesture, beat);
const U = (text: string, emotion: Emotion = 'wry', gesture: Gesture = 'talk', beat?: string) => line('Mang Uban', text, emotion, gesture, beat);

export function characterLines(id: InteractionId, p: Progress, map: MapId): DialogueLine[] | null {
  switch (id) {
    case 'lola': return p.talkedToLola ? [
      L('Still on your important kite mission, anak? I saved the soft pandesal for you.'),
      R('You saved the soft one?', 'delighted'),
      L('I know which one disappears first. Come, what is on your mind?', 'warm', 'wave'),
    ] : [
      L('Rae Jacob! Merienda! Come into the shade a little.', 'warm', 'wave', 'Lola lifts a hand from the porch. There is a second cup on the table.'),
      R('One more minute, La! The wind put my kite in the old tree.', 'delighted', 'reach'),
      L('The wind, was it? Not the boy who said the string could reach the clouds?', 'wry'),
      R('The experiment was going very well until the tree joined in.', 'wry'),
      L('Tell me before you go near those roots. And mind where you step. A yard is somebody else’s world, too.'),
      R('Even the ants?', 'curious'),
      L('Especially the ones carrying something bigger than themselves. If you lose your way, stop first. Look around. Then ask for help.'),
      R('I can do that. I’ll be where you can hear me, La.', 'warm', 'wave'),
    ];
    case 'lolaStories': return [
      R('Why do you say “tabi-tabi po” by the old tree?'),
      L('In our family, it is a way to say “excuse me” to someone we might not see. My mother said it near places people believed had unseen residents.'),
      R('So there is definitely somebody living there?', 'surprised'),
      L('I cannot tell you who is in every tree, anak. Stories change from one family to another. But I can tell you not to trample a place just because it looks empty.'),
      R('Like knocking before opening a door.', 'curious'),
      L('Yes. And remembering that the door may not be built to your size.', 'warm'),
    ];
    case 'lolaString': return [
      R('You tied my spare string better than the kite seller did.'),
      L('Your Lolo showed me that knot. A tight pull holds it. A patient finger can open it again.', 'wistful', 'think', 'She turns an invisible loop between her fingers.'),
      R('I always pull harder when it gets stuck.', 'worried'),
      L('You do most things harder before trying them slower.', 'wry'),
      R('I’m keeping the spare in my pocket. For important rescues.', 'determined'),
      L('Then remember the patient part, too.', 'warm'),
    ];
    case 'lolaWaiting': return [
      R('Were you ever the last one to come home?'),
      L('Often enough that my mother could find me by the dust on the road.', 'wry'),
      R('You? But you always tell me to come in.', 'surprised'),
      L('Because I remember how far an afternoon can take a child. And how long it can feel to the person waiting.'),
      R('I’ll tell you my adventure when I get back.', 'warm'),
      L('I will be here to hear it. Now, something about a kite?', 'warm', 'wave'),
    ];
    case 'balete': return !p.talkedToLola ? [R('There’s my kite. I should tell Lola before I go poking around the roots.', 'curious', 'reach')] : [
      R('Tabi-tabi po. I’m only getting my kite…', 'curious', 'bow', 'Cool air slips between the roots. The yard sounds suddenly far away.'),
      R('One little reach. Huh? There is a light down there.', 'surprised', 'reach'),
      line('Someone?', 'Hello? Who’s there?', 'worried'),
      R('La? …Trees do not usually answer.', 'worried'),
    ];
    case 'arrival': return [
      R('Oof. Leaves. Good. Leaves are good.', 'surprised', 'think', 'Rae brushes a leaf from his sando. He still has the spare string.'),
      R('La? …Lola? I’m here. I’m right…', 'worried'),
      R('The opening was behind me. It was right behind me.', 'worried', 'reach'),
      R('Those lights are not our windows. And I don’t know those stars.', 'wistful'),
      R('Stop first. Look around. Then ask for help.', 'determined', 'think', 'He takes one breath slowly, the way Lola showed him.'),
      R('Okay, La. Lights mean somebody is home. I can ask.', 'determined'),
    ];
    case 'tala': return p.metTala ? [T(p.bellRung ? 'New road. New page. What shall we put on it first?' : 'I have a pencil, a map, and a little time. What would you like to know?', 'warm', 'map')] : [
      T('Please move your foot.', 'determined', 'wave', 'A small pencil taps the edge of Rae’s flip-flop.'),
      R('My foot?', 'surprised'),
      R('Aaah! Who said that? There is somebody down there!', 'surprised', 'think', 'Rae pulls his foot back and crouches, keeping both hands close to his chest.'),
      T('Me. You can look down without stepping closer.', 'determined'),
      R('You are real. You have a pencil! Are you... a duwende? Like in Lola\'s stories?', 'surprised'),
      T('A duwende, yes. And a person trying to finish a map. You are the first human to land on it.', 'wry', 'map'),
      R('I thought those were bedtime stories. Do all the roots have people under them? Did I step on somebody\'s house?', 'worried'),
      T('You are standing on the road. The little one. Under your very large foot.', 'wry', 'map'),
      R('Oh! Sorry. Tabi-tabi po. I didn’t see it.', 'worried', 'bow'),
      T('Thank you. Words help. Moving the foot helps more.', 'wry'),
      R('I’m Rae Jacob. I fell through a tree. My Lola is waiting on the other side.', 'worried'),
      T('Tala. Mapmaker. Almost.', 'curious', 'map', 'She smooths a creased corner before offering her name.'),
      R('Your map has a way back, right?', 'worried'),
      T('Not yet. I won’t draw a road I haven’t found. But I can help you look.', 'warm'),
      R('I’d like that. Very much.', 'warm'),
      T('Then we start with where you are. Lantern Clearing. Watch the lamps—and the little roads.', 'determined', 'map'),
    ];
    case 'talaMaps': return [
      R('You said “almost” a mapmaker. This looks like a real map.'),
      T('The clearing is real. The blank edge is everything I haven’t dared to put my feet on yet.', 'worried', 'map', 'Her thumb covers a patch where the paper has worn thin.'),
      R('A blank edge is the best part. You can put anything there.', 'delighted'),
      T('Only what is actually there. Someone might trust it when they are frightened or tired.', 'determined'),
      R('Then we’ll go and look. I’ll be the very large foot. You can be the careful pencil.', 'warm'),
      T(p.bellRung ? 'And neither of us has to do it alone anymore.' : 'That is… a workable arrangement.', 'warm', 'map'),
    ];
    case 'talaCourtesy': return [
      R('When you first spoke, my tummy did a jump. I had never met a duwende. Did I frighten you, too?', 'worried'),
      T('A large foot arriving without warning? A little. Asking me is a good way to begin again.', 'warm'),
      R('Can I ask what your house is like? I keep imagining my room, only with a leaf for a blanket.', 'curious'),
      T('A dry floor, a shelf for my pencils, and a door you must knock on. You can ask about the blanket when we get back.', 'wry'),
      R('Lola says to ask before passing places where somebody might live. Is “tabi-tabi po” enough?'),
      T('It is a good beginning. It is not a password that makes a broken doorstep unbroken.', 'wry'),
      R('So I still have to watch my feet.', 'curious'),
      T('And notice who has to step aside for them. People you don’t see can still be having a perfectly ordinary day.', 'warm'),
      R('Lola would like you.', 'delighted'),
      T('Your Lola sounds like someone who knows where the little roads are.', 'warm'),
    ];
    case 'talaJourney': return [
      R(p.bellRung ? 'Are you sure you want to come farther?' : 'Have you ever wanted to leave the clearing?'),
      T('I want to see what the older maps left out. I also want to be certain I can find my way back.', 'wistful', 'map'),
      R('I wanted to play all day. Now I’d give quite a lot to hear Lola call me in.', 'wistful', 'think'),
      T('We can want the road and still miss home.', 'warm'),
      R('If you get worried, we stop first. Look around. Then ask for help.', 'warm'),
      T('You have remembered the useful part of your story.', 'warm'),
    ];
    case 'minda': if (p.waterRestored && !p.bellReturned) return [
      R('Minda! We found it. The bell was caught in the wheel.', 'delighted', 'reach', 'Rae lifts the wet bell with both hands.'),
      M('That dent near the rim… yes. Our bell.', 'wistful', 'reach'),
      T('The bamboo carried the clanging up to Mang Uban’s tree. He was never shaking the homes.', 'determined'),
      M('I should have checked the works before lending my worry to a rumor.', 'worried'),
      R('The wheel turns properly now. We put the water back, too.', 'determined'),
      M('You did the whole job. Thank you, both of you. I’ll tell our neighbors what happened.', 'warm'),
      M('Meet me at the arch. I kept a good cord dry. We can give this bell its place again.', 'warm', 'work'),
    ];
      if (!p.heardMinda && !p.waterRestored) return [
        M('Mind the channel, young traveler. The water has already taken enough from this clearing.', 'worried', 'work', 'Minda tests a damp cord, then sets it aside instead of trusting it.'),
        R('Tala said you keep the water. Was it always this loud?'),
        M('No. There was a surge. Our path bell vanished that evening, and the wheel began to shudder.', 'worried'),
        T('People think Mang Uban is shaking their homes.', 'worried'),
        M('Worried people want a name to put their worry on. I need a cause. So I closed the work path.', 'determined'),
        R('We can help find it.', 'determined'),
        M('Then ask, look, and keep to the bank. Bravery is useful. Dry feet are useful too.', 'warm'),
      ]; return null;
    case 'mindaWater': return [
      R('How do you know when a channel is working?'),
      M('A gate has a sound when it settles. A wheel has a rhythm. A doorstep stays dry. I listen, and then I check.', 'neutral', 'work'),
      R('Like learning a song?'),
      M('Like learning your neighbors. You notice when something is wrong because you know what their ordinary day sounds like.', 'warm'),
      M(p.waterRestored ? 'That steady turning is an ordinary day returning.' : 'The other channel goes around the wheel. Clear its branch before you divert the water west.', 'determined'),
    ];
    case 'mindaNeighbors': return [
      R('You look as though you haven’t rested.'),
      M('The lowest doorway belongs to a neighbor who cannot lift a full bucket anymore. I keep thinking about that doorway.', 'worried', 'think'),
      R('Lola carries the heavy pitcher with two hands. I could carry a bucket.', 'warm'),
      M('You can help with the cause instead. I do not have to be the only pair of hands.', 'warm'),
      T('Put that on the work sign. In very large letters.', 'wry'),
      M('You bring the pencil, mapmaker.', 'warm'),
    ];
    case 'mindaWaybell': return [
      R('Does every bell make a road remember its name?'),
      M('No, child. This is our waybell, made for our crossing. Do not go ringing every cooking pot you meet.', 'wry'),
      R('I was only considering one cooking pot.', 'wry'),
      M('My mother taught me to replace its cord before the fibers tire. People trusted her hands. Now they trust mine.', 'wistful', 'work'),
      M(p.bellRung ? 'Today I learned to let them trust someone else’s hands, too.' : 'It is not only a bell I want back. It is the small certainty that the road home will still be there.', 'warm'),
    ];
    case 'mang': if (!p.metMang) return [
      R('Tala. That branch moved. No... that is his ARM!', 'surprised', 'think', 'Rae takes half a step behind Tala, then realizes how little cover she offers. His chin tips upward.'),
      R('A kapre? An actual kapre? Lola said they were big, but he could see over our roof!', 'worried'),
      T('That is Mang Uban. Stay here with me. We can say hello before we go closer.', 'warm', 'listen'),
      R('His eyes are looking right at me. I thought they were little lights in the tree.', 'worried', 'think', 'Smoke uncurls from a thick cigar. Silver hair breaks up the giant\'s outline; beneath it, the face is utterly still.'),
      U('I can see you, little traveler. You need not hide behind someone whose shadow barely reaches your ankle.', 'neutral', 'listen'),
      R('I was not hiding. Very much.', 'wry'),
      U(p.flowDiverted || p.bellRecovered ? 'Quiet. At last.' : 'Three times.', 'wry', 'think', 'A great hand rests on a root without disturbing a single small lamp. Its knuckles are wider than Rae\'s fist.'),
      R(p.flowDiverted || p.bellRecovered ? 'You noticed?' : 'Three times what?', 'surprised'),
      U(p.flowDiverted || p.bellRecovered ? 'The absence of that bell. A sound can occupy a great deal of a person’s afternoon.' : 'That bell. Every time I begin to sleep.', 'wry'),
      T(p.bellRung ? 'We found what was shaking the homes. A waybell caught in the wheel. Minda is telling everyone.' : 'Some of the clearing thinks it is you shaking their homes.', 'worried'),
      U('If I were walking, little mapmaker, you would know.', 'wry'),
      R('Lola’s stories have people in trees. I didn’t think I would ever have to look this far up to say hello.', 'curious', 'wave'),
      U('Then say hello before your neck gives out.', 'warm'),
      R('Hello, po. Sorry I stared. Do you sleep up there? How does the branch not break?', 'curious', 'wave', 'He peeks upward again. Fear has not quite caught up with his questions.'),
      U('That old fork is stronger than it looks. And I sit where the little homes will not be troubled.', 'warm'),
      R('Can you hear their tiny doors from all the way up there?', 'curious'),
      U('I can. Especially when everyone closes them because of a noise I did not make.', 'wry'),
      R('I’m Rae Jacob. I fell into this forest. Can I get back to my Lola?', 'worried'),
      U('The old crossings meet at the Heart Balete. Yours may touch it still. I cannot promise what I have not seen.', 'neutral'),
      R('But there is somewhere to start?', 'worried'),
      U(p.bellRung ? 'You have already mended the first crossing. The bamboo road beyond it leads toward Bagtas. Ask him which turns he has checked.' : 'The road beyond the clearing. Its approach is flooded, its guiding bell gone. Repair what is before you first.', 'determined'),
      U(p.bellRung ? 'And if you have another question before you leave, I am awake now.' : p.discoveries.includes('speakingTube') ? 'You found the bamboo tube? Follow its line downhill. A sound has a source, however large the shadow above it.' : 'Listen at that bamboo tube. The ringing comes from below. Follow its line downhill.', 'neutral', 'reach'),
      T(p.bellRung ? 'Then we can stop for a question before the next road.' : 'We’ll look for the cause. And tell the clearing what we find.', 'determined', 'map'),
    ]; return null;
    case 'mangKapre': return [
      R('I nearly ran when I saw your hand move. But then I wanted to know how big your slippers would be.', 'worried'),
      U('I walk barefoot. One less thing for the clearing to trip over.', 'wry'),
      R('Do you ever get scared of something smaller than you?', 'curious'),
      U('A falling spark. A small, dry leaf. Size does not decide what needs care.', 'neutral'),
      R('In some of Lola’s stories, a kapre frightens children who won’t come inside.'),
      U('A useful story for a person with a cold supper and a child still in a field.', 'wry'),
      R('You don’t mind?', 'curious'),
      U('I mind being blamed for a bell I did not ring. As for the rest… ask the person in front of you. A story has not met everybody.', 'neutral'),
      R('Then what would you like me to remember about you?'),
      U('That I answered your question. And that even a kapre would like to finish a nap.', 'wry'),
      R('Then I’ll keep the next question small.', 'warm'),
    ];
    case 'mangMemory': return [
      R('Were you here before the houses?'),
      U('Before those houses. Not before people. Someone once sat here with a small tree and a very leaky water jar.', 'wistful', 'think'),
      T('Who was it?', 'curious'),
      U('A person who knew they would never sit in its full shade. They planted it anyway.', 'warm'),
      R('Lola says the calamansi was small when she was small.', 'wistful'),
      U('Then she has watched something grow slowly. Listen when she tells you how.', 'warm'),
      R('When I get home, I’ll ask.', 'determined'),
    ];
    case 'mangBagtas': return [
      R('What kind of person is Bagtas?'),
      U('A tikbalang. Long legs, a horse’s head, and opinions about which way you should walk.', 'wry'),
      R('Lola told me about travelers led in circles. Will he trick us?', 'worried'),
      U('Some stories say a tikbalang leads people astray. Bagtas has his own reasons for walking his roads. Ask him before deciding you know them.', 'neutral'),
      T('I shall keep my map open.', 'determined', 'map'),
      U('Keep your ears open as well. A map cannot draw a person’s intentions.', 'wry'),
    ];
    case 'rootSeal': if (p.chapterComplete) return [
      R(p.chapterTwo.metBagtas ? 'Bagtas really was the one making those hoofbeats. But who made this circle? And who was talking through Lola\'s tree?' : 'The hoofbeats came from the bamboo. The voice under Lola\'s tree sounded different. Are there two people watching the roads?', 'curious', 'think'),
      T('We still do not know who called through your tree, or who sealed this passage. I have kept the mark on our map.', 'worried', 'map'),
      R('I want to ask them why. But I am not pulling at a strange opening again.', 'determined'),
      T('Good. The open bamboo road is beside it. We can return when we have something more to go on.', 'warm'),
    ];
      return [
        R('That root… it is cut straight through.', 'worried', 'think', 'The pale circle catches the light. Beside it, the open bamboo road bends onward.'),
        T('This side passage was open on my old sketch. I drew it before the surge.', 'worried', 'map'),
        R('Did the water do that?', 'worried'),
        T('Water doesn’t leave a mark like that.', 'determined'),
        R('Is it writing? Could somebody be stuck on the other side, like I was?', 'worried'),
        T('I cannot read it. A closed passage does not tell us who is beyond it. We should keep the shape and ask someone who knows.', 'worried', 'map'),
        R('I want to look... but I do not want another tree to swallow me. Draw the edge of the cut, too.', 'curious'),
        R('We fixed the wheel. We brought the bell home. But somebody closed this on purpose.', 'worried'),
        T('We don’t know who. We do know our road is still open. One thing at a time, Rae.', 'warm'),
        { ...R('A hoofbeat? …There. And another, on the other side.', 'surprised', 'think', 'Sharp hooves strike somewhere in the bamboo. The answer comes from a different direction.'), cue: 'hooves' },
        line('Someone?', 'If you two are taking that road, you’ve already taken the wrong one!', 'wry'),
        R('Stay close, Tala?', 'worried'),
        T('There is room for both our footsteps.', 'warm', 'map'),
      ];
    default: return null;
  }
}
