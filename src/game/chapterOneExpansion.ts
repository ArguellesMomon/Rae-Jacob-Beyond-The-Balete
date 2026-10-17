import type { DialogueLine, Emotion, Gesture, InteractionId, Progress } from './model.ts';

const say = (speaker: DialogueLine['speaker'], text: string, emotion: Emotion = 'neutral', gesture: Gesture = 'talk', beat?: string): DialogueLine => ({ speaker, text, emotion, gesture, ...(beat ? { beat } : {}) });
const R = (text: string, emotion: Emotion = 'curious', beat?: string) => say('Rae Jacob', text, emotion, 'talk', beat);
const V = (text: string, beat?: string) => say('Someone?', text, 'worried', 'talk', beat);
const L = (text: string, emotion: Emotion = 'warm') => say('Lola Selya', text, emotion);
const T = (text: string, emotion: Emotion = 'curious') => say('Tala', text, emotion, 'map');
const M = (text: string, emotion: Emotion = 'neutral') => say('Minda', text, emotion, 'work');
const U = (text: string, emotion: Emotion = 'wry') => say('Mang Uban', text, emotion);

/** Authored scene extensions; folklore motifs and Silong's invented crossing rules stay distinct. */
export function expandedScene(id: InteractionId, p: Progress): DialogueLine[] | null {
  if (id === 'balete' && p.talkedToLola) return [
    R('Tabi-tabi po. I am only getting my kite. I will not break anything.', 'curious', 'The kite tail stirs. Every shirt on the clothesline hangs still.'),
    R('That is strange. The wind is coming out of the tree.'),
    V('Can you hear me? Please… tell me there is somebody on that side.'),
    R('La? Is that you behind the trunk?', 'surprised'),
    V('No. I cannot see your yard. Only light between the roots.'),
    R('You know this is a yard? Where are you?', 'worried'),
    V('Beneath another balete. In Silong. Our paths once touched yours without opening into it.'),
    R('Another tree? You sound as though you are inside this one.'),
    V('The roots carry things farther than they should today. Voices first. Now the opening itself.'),
    R('Did you put my kite up there?', 'worried'),
    V('No. I did not call you by name. I called to anyone who might hear. I thought the gap was only wide enough for a voice.'),
    R('Then why is the ground shining?', 'surprised', 'A pale line runs under the dry leaves. The earth feels cool through his flip-flops.'),
    V('A crossing below us has lost its waybell. When the water rose, the road lost its name. Its edges are reaching into places they do not belong.'),
    R('Like a kite with a broken string?', 'worried'),
    V('Like a door that cannot find its frame. Your tree is one of the places its roots remember.'),
    R('Can you shut it? My Lola is right there. I have to go back to the porch.'),
    V('Step away from the hollow. Slowly. Do not reach for the light.'),
    R('I am trying. The leaves are moving under my feet.', 'worried', 'For a heartbeat, the birds and the distant road fall silent.'),
    L('Rae Jacob? Leave the kite for now, anak. Come back into the shade.', 'worried'),
    R('La! There is someone—', 'surprised'),
    V('The opening is moving. Hold the thick root beside you!'),
    R('I cannot—my hand is slipping!', 'worried'),
    V('Listen to me. There are leaves below, not stone. Keep your arms close. Follow my voice away from the broken edge.'),
    R('You said this was only for voices!', 'worried'),
    V('I was wrong. I am sorry. I cannot hold the passage from here.'),
    R('If I fall through… how do I get home?', 'worried'),
    V('Find the lanterns. Ask for the keeper of the water. A named crossing is a beginning—not the whole way home.'),
    R('Lola! I am still here!', 'worried', 'His fingers close on empty air. The afternoon folds into a thin gold line.'),
    V('Keep calling, little traveler. I am listening.'),
  ];
  if (id === 'arrival') return [
    R('Oof. Leaves. Leaves are good. I think… everything still bends.', 'surprised', 'He checks his knees, his elbows, then both flip-flops.'),
    R('Hello? You said you were listening. Are you still there?', 'worried'),
    R('…Nothing. Not even an echo.'),
    R('La? Lola! I am down here!', 'worried', 'The words disappear into a forest that smells of wet wood and lamp oil.'),
    R('The hole was above me. There should be daylight. There should be our fence.', 'worried'),
    R('Just roots. They will not move.', 'worried'),
    R('I should not pull at them. If another opening breaks, I might fall farther.'),
    R('Silong. The voice called this place Silong.'),
    R('A bell went missing. A road forgot its name. And somehow the wrong door opened under my feet.', 'wistful'),
    R('It did not even know who I was. I was only trying to get my kite.', 'worried'),
    R('Lola is going to come down the steps. She will look by the basin first, then the gate.', 'wistful'),
    R('I promised I would stay where she could hear me.', 'wistful', 'He rubs his eyes with the clean corner of his sando, then lets his hands fall.'),
    R('Stop first. Look around. Then ask for help.', 'determined'),
    R('My string is here. Both slippers. One very frightened person. That is a start.', 'wry'),
    R('Those lights are hanging in rows. Somebody put them there. Somebody has to know these paths.'),
    R('The keeper of the water. I will ask for them. And I will remember how I got here.', 'determined'),
    R('Wait for me a little longer, La. I am coming home.', 'determined', 'He faces the nearest lamp and takes one careful step.'),
  ];
  if (id === 'merienda') return [
    R('The soft pandesal! You really did save it.', 'delighted'),
    L('Bread first, grand announcements afterward. Tell me whether the kite needs a ladder.'),
    R('It only needs a very tall version of me.'),
    L('Then it can wait until we find a safer plan.', 'wry'),
    R('There are two cups. Were you waiting to eat with me?'),
    L('I like hearing what happened between breakfast and the end of the world. You usually fit quite a lot into an afternoon.'),
    R('Today is only a kite-sized afternoon. Probably.', 'warm'),
  ];
  if (id === 'clothesline') return [
    R('The shirts are pointing toward the balete. The wind is a very helpful signpost.'),
    L('Only when you remember it changes its mind. Keep the clean sheets away from your experiments.'),
    R('That one looks like a sail. A ship could fit in this yard if it was an extremely small ship.', 'delighted'),
    L('An extremely small ship can wait until these are dry.'),
    R('The kite tail is moving… but this shirt is still now.', 'curious', 'A breeze touches the old tree without reaching the line.'),
    R('I will look from the path. No climbing, and no borrowing a sail.', 'determined'),
  ];
  if (id === 'basin') return [
    R('My reflection has a leaf for a hat. That is a considerable improvement.', 'wry'),
    L('Hands, please. Not your whole head.'),
    R('I was only considering a very small swim.'),
    L('In a washing basin? The frogs would complain about the crowd.', 'wry'),
    R('All right. Dust off, fingers clean.', 'warm', 'He rinses his hands, shaking the last drops toward the bare earth.'),
    L('Good. Dry them before touching the string. Wet fingers do not make a stubborn knot easier.'),
    R('Everything is a knot lesson today.'),
    L('Only because someone keeps finding new knots.', 'warm'),
  ];
  if (id === 'yardCat') return p.discoveries.includes('yardCat') ? [R('Still guarding the cool patch, Muning?', 'warm'), R('I will go around. Important sleeping work is happening here.', 'wry')] : [
    R('Muning! You found the one place the sun cannot reach.', 'delighted'),
    L('Let her sniff your hand first. She decides whether it is visiting time.'),
    R('Hello, most important porch inspector.', 'warm', 'Rae crouches. A striped tail uncurls without the rest of the cat getting up.'),
    R('A nose on my finger. Is that permission?'),
    L('For one gentle stroke. Watch her ears. Small friends tell you things even when they do not speak.'),
    R('One stroke. Then I shall leave you to inspect your dreams.', 'warm'),
  ];
  if (id === 'calamansi') return [
    R('This one smells like your juice, La. Even the leaf does.'),
    L('Your great-grandmother gave me the seedling. It fitted inside an old milk tin.'),
    R('You were little and it was littler?', 'delighted'),
    L('Now it shades the place where you leave your slippers. Growing takes longer than an afternoon.'),
    R('Could I plant one? My own tree?'),
    L('We can save a seed. But you must remember it after the exciting first day.'),
    R('Tomorrow, too. And the day after. That is a fairly long adventure.', 'determined'),
  ];
  if (id === 'herbBed') return [
    R('The soil is dark underneath, even though the top looks dry.'),
    L('A finger near the edge tells you more than a whole pitcher poured in a hurry.'),
    R('So they do not need another drink yet?'),
    L('Not these. See the new leaves? Leave room around them when you weed.'),
    R('I will move this loose twig instead. There. No squashed leaf.', 'determined', 'He sets the twig beyond the raised bed and pats the loose soil beside it.'),
    L('Careful hands make more difference than busy hands, anak.'),
  ];
  if (id === 'sungka') return [
    R('You left the shells in the board. Are we still playing yesterday’s game?'),
    L('We stopped when your kite was ready. I have not forgotten whose turn it is.', 'wry'),
    R('Mine. Definitely mine.', 'delighted'),
    L('Your Lolo smoothed those hollows by hand. Feel the edge before you move a shell.'),
    R('It is softer where your hands go.', 'curious', 'Rae rolls one shell between his fingers, then places it back in its hollow.'),
    L('Some things remember being used kindly.'),
    R('Save my turn, La. When the kite is down, I am going to make an extremely patient move.', 'warm'),
  ];
  if (id === 'rainJar') return [
    R('There is yesterday’s rain in here. I can hear a drip under the lid.'),
    L('From the roof into the jar, then into the watering can. We keep it covered between visits.'),
    R('A little river that stays home.'),
    L('And a lid that stays where you found it, please.'),
    R('Firm on the rim. No leaf stuck underneath.', 'determined', 'He checks the wooden cover and tips a loose leaf into the garden instead.'),
    R('Tomorrow’s plants have tomorrow’s drink ready.', 'warm'),
  ];
  if (id === 'minda' && p.bellRung) return [M('Hear that? Water on wood. No scraping. I had forgotten how gentle it could sound.', 'warm'), R('Will you rest now?'), M('After one last look at the low doorways. Then yes. I will accept a chair.'), T('I shall draw a chair on the work schedule.', 'wry'), M('Draw two. Someone ought to sit with me and tell me about the road.', 'warm'), R('We will have a story when we come back.', 'warm')];
  if (id === 'mang' && p.metMang) return p.bellRung ? [U('A road with a name again. And two travelers taking their time.'), R('We have been taking quite a lot of time, actually.', 'wry'), U('Good. A road is not improved by failing to notice it.'), T('Do you have one more piece of advice?'), U('Remember who is waiting. Remember who is walking beside you. Both can help you find a direction.', 'warm'), R('I can remember both.', 'warm')] : [U('Still down there, little traveler?'), R('Still trying to make the forest fit inside my head.'), U('A poor fit. Try making room for one question instead.'), T('That is how a blank map begins.', 'warm')];
  return null;
}

export function deepenConversation(id: InteractionId, p: Progress, lines: DialogueLine[]): DialogueLine[] {
  const add = (at: number, extra: DialogueLine[]) => [...lines.slice(0, at), ...extra, ...lines.slice(at)];
  if (id === 'rootSeal' && !p.chapterComplete) return [...add(lines.findIndex(entry => entry.speaker === 'Someone?') + 1, [R('That is not the voice I heard under Lola’s tree.', 'worried'), T('Then there is more than one person we need to ask.'), R('When I get home, I will have to start this story before the falling part. Lola will want every detail.', 'wistful'), T('Keep them safe. We can help each other remember.', 'warm')]), R('One crossing closer, La. And I am learning how to ask for the next one.', 'determined', 'He touches the string in his pocket. This time, he takes the first step beside a friend.')];
  if (id === 'lola' && !p.talkedToLola) return add(4, [R('If I get it down, can we go to the open field later?', 'delighted'), L('After we eat. First we see whether the string is sound. A good afternoon is not a race.'), R('Only a very small race against the clouds.', 'wry'), L('The clouds will still be there when you finish your bread.', 'wry'), R('And you will watch?'), L('From the shade. Somebody must clap when your experiment works.', 'warm')]);
  if (id === 'tala' && !p.metTala) return add(lines.length - 1, [R('A voice told me to find the keeper of the water. It said a crossing broke. Then the opening moved.', 'worried'), T('Minda keeps our channels. If an old crossing touched your yard, the trouble has reached farther than we thought.', 'worried'), R('Was I brought here because somebody needs me to fix it?'), T('I do not know who called. But being caught in something does not make it your fault.', 'warm'), R('I keep thinking I should have been quicker. Or listened sooner.', 'wistful'), T('You are here now. We can begin with a safe place to stand, and a person to ask.'), R('Thank you for saying “we”.', 'warm')]);
  if (id === 'minda' && !p.heardMinda && !p.waterRestored) return add(5, [R('Someone called through the roots. They said the lost bell let an opening reach our yard.', 'worried'), M('Our waybell steadies a crossing in Silong. The roots connect farther than my channels do. I did not know another doorway had opened.', 'worried'), T('Rae needs a road back to his Lola.'), M('Then I owe you clear directions, not a guess. The work path is unsafe. The old grove has a dry approach to the maintenance trail.'), R('I do not know how to mend a road.'), M('Neither did I when I first held a gate cord. Find what is wrong before deciding what you cannot do.', 'warm')]);
  if (id === 'minda' && p.waterRestored && !p.bellReturned) return add(5, [M('Was anyone hurt? Tell me that before we talk about the machinery.', 'worried'), R('Wet hands. A leaf in my hair. Nothing worse.', 'warm'), T('We stopped the flow first. Then Rae used a loop of kite string.'), M('Good. A rescued bell is not worth an injured traveler.'), R('Lola showed me how the knot opens again. I kept thinking of her hands.', 'wistful'), M('Then a little of her care reached us, too.', 'warm')]);
  if (id === 'mang' && !p.metMang) return add(lines.findIndex(entry => entry.text === 'But there is somewhere to start?') + 1, [R('The voice said the roots were remembering our tree. Why that one?'), U('Old crossings follow old connections. A balete that has stood beside a home for years may touch roads its people have never seen.'), R('So I was just close enough when the opening went wrong?', 'worried'), U('That is what your story suggests. I will not invent a destiny to make an accident easier to explain.'), T('Then fixing our crossing is a first step, not a promise that everything is solved.'), U('Exactly. Give the child an honest beginning. He has already had one false certainty too many.', 'warm')]);
  const extras: Partial<Record<InteractionId, DialogueLine[]>> = {
    lolaStories: [R('Do you still say it when nobody is watching?'), L('Manners would be a very small thing if they only worked in front of an audience.'), R('Then I shall practice when the ants are watching.', 'warm')],
    lolaString: [R('Did Lolo get impatient, too?'), L('With knots, yes. With teaching you, never. He used to leave the last loop for your small fingers.', 'wistful'), R('I remember thinking I had done the whole thing.'), L('You had done the part you were ready for. That mattered.', 'warm')],
    lolaWaiting: [R('What if I have a story that sounds impossible?'), L('Start with where you were, and how you felt. I can listen before deciding what I understand.'), R('Even if I made a mistake?'), L('Especially then. Coming home does not require a perfect story.', 'warm')],
    talaMaps: [R('Do you draw people, too?'), T('A bench outside a doorway. A place to refill a lamp. Useful things a traveler might miss.'), R('Put a mark where someone helped you.'), T('Then this page may need more room.', 'warm')],
    talaCourtesy: [R('What if I do step in the wrong place?'), T('Stop. Listen to the person whose place it is. Help repair what you can. An apology has work attached.'), R('Words, feet, then hands. I can remember that.', 'determined')],
    talaJourney: [R('What will you miss first?'), T('The little lamp outside my door. I always know its particular flicker.', 'wistful'), R('Mine is the sound of Lola setting a cup down. Before she calls me.'), T('Then we have good reasons to learn a way back.', 'warm')],
    mindaWater: [R('Could you teach me one sound?'), M('Hear the even splash below the gate? Watch where it lands. Listening tells you where to look; it does not replace looking.'), R('I used to think quiet meant nothing was happening.'), M('Sometimes it means somebody has been doing careful work.', 'warm')],
    mindaNeighbors: [R('Does everybody know you worry this much?'), M('They know I knock after heavy rain. They do not need to know every thought that comes before the knock.'), T('They might bring you supper if you told them.'), M('That would be an unusually sensible repair.', 'warm')],
    mindaWaybell: [R('What does the crossing mean to someone who lives here?'), M('A sister visiting. Oil for the lamps. A child returning before supper. Magic becomes ordinary when people can trust it.'), R('Ordinary sounds very good from here.', 'wistful'), M('Then let us put a little of it back.', 'warm')],
    mangKapre: [R('Would you rather people stopped telling stories?'), U('No. I would rather they left room for a person to answer back.'), T('A map can be corrected. So can a story.'), U('If its keeper is willing to listen.', 'warm')],
    mangMemory: [R('Do you ever forget something important?'), U('Yes. A voice becomes difficult to remember. A face loses its edges. That is why I tell the small stories while I can.', 'wistful'), R('I will remember the leaky jar.'), U('Then it has traveled farther than its owner ever carried it.', 'warm')],
    mangBagtas: [R('What should I say when we meet him?'), U('Your own name. Where you hope to go. The truth when you do not know an answer.'), T('And ask whether the road on my map is still there.'), U('A useful conversation. Much better than beginning with an accusation.', 'warm')],
  };
  const extra = extras[id];
  return extra ? add(Math.max(1, lines.length - 1), extra) : lines;
}
