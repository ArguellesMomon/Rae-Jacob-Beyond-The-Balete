import { chapterTwoLines } from './chapterTwoDialogue.ts';
import type { DialogueLine, InteractionId, MapId, Progress } from './model.ts';
import { characterLines } from './characterDialogues.ts';
import { deepenConversation, expandedScene } from './chapterOneExpansion.ts';
import { worldLines } from './worldDialogues.ts';
import { chapterOneMoments } from './chapterOneMoments.ts';

export function linesFor(id: InteractionId, progress: Progress, mapId: MapId = 'yard'): DialogueLine[] {
  const chapterTwo = chapterTwoLines(id, progress, mapId);
  if (chapterTwo) return chapterTwo;
  const scene = worldLines(id, progress) ?? expandedScene(id, progress);
  const authored = scene ?? deepenConversation(id, progress, characterLines(id, progress, mapId) ?? baseLinesFor(id, progress, mapId));
  const lines: DialogueLine[] = id === 'bellArch' && progress.bellHung && !progress.bellRung ? [...authored, { speaker: 'Minda', text: 'Mang Uban asked you to stop by before you leave. A quiet thank-you, he said. No hurry—the road will wait.', emotion: 'warm' }] : authored;
  let visible = chapterOneMoments(id, progress, mapId, lines);
  if (!progress.metTala && ['sealedRoots', 'rootHomes', 'bellArch', 'waterPath', 'grovePath'].includes(id)) {
    visible = visible.filter(line => line.speaker !== 'Tala');
    if (!visible.length) visible = [{ speaker: 'Rae Jacob', text: 'Somebody who lives here will know this path. I should ask the little mapmaker by the lamps.', emotion: 'curious' }];
  }
  return visible.map(entry => ({ ...entry,
    emotion: entry.emotion ?? (entry.speaker === 'Mang Uban' ? 'wry' : entry.text.includes('?') ? 'curious' : id === 'rootSeal' || id === 'sealedRoots' ? 'worried' : 'neutral'), gesture: entry.gesture ?? 'talk',
    ...(id === 'bellArch' && progress.bellHung && !progress.bellRung && entry.text === 'Much better.' ? { beat: 'A deep voice carries down from the grove. A folded leaf packet settles beside the arch.' } : {}),
    ...(id === 'bellArch' && progress.bellHung && !progress.bellRung && entry.speaker === 'Rae Jacob' && entry.text.includes('friend') ? { emotion: 'delighted' as const, gesture: 'celebrate' as const } : {}) }));
}

function baseLinesFor(id: InteractionId, progress: Progress, mapId: MapId): DialogueLine[] {
  if (progress.flowDiverted && !progress.bellRecovered && (id === 'speakingTube' || id === 'rootFootprints' || id === 'talaRinging')) return [
    { speaker: 'Tala', text: 'Quiet now. Diverting the water stopped the wheel and its clanging. No more trembling roots.' },
    { speaker: 'Rae Jacob', text: 'The bypass is working. Let’s go back to the stopped wheel and get that bell.' },
  ];
  if (id === 'talaHome' && progress.bellRung) return [
    { speaker: 'Tala', text: progress.chapterComplete ? 'That voice came from the bamboo paths. We should find Bagtas. He knows the turns that lead toward the Heart Balete.' : 'Bamboo Crossing remembers its name again. We can take the maintenance trail back to the footbridge and follow the bamboo road toward Bagtas.' },
    { speaker: 'Rae Jacob', text: 'One road closer to Lola. And someone to walk it with.' },
  ];
  if (id === 'talaWhere' && mapId === 'waterworks' && progress.waterRestored) return [
    { speaker: 'Tala', text: 'Rootwater Works. A clear wheel, a working splitter, and a dry low trail southwest to Lantern Clearing.' },
    { speaker: 'Tala', text: progress.bellRung ? 'Our named crossing is the footbridge to the east. The bamboo road lies beyond it.' : 'The footbridge still needs its waybell. Minda is waiting in the clearing.' },
  ];
  if (id === 'talaHome' && progress.bellHung) return [{ speaker: 'Tala', text: 'The waybell is hanging at the clearing’s arch. Give it one ring and we can follow our crossing toward the bamboo paths.' }];
  if (id === 'talaHome' && progress.bellReturned) return [{ speaker: 'Tala', text: 'Minda has the bell at the clearing’s arch. Let’s help her hang it, then ring it once.' }];
  if (id === 'worksTube' && progress.bellReturned) return [{ speaker: 'Minda', text: progress.bellRung ? 'A steady wheel and a named crossing. Safe travels, you two. The low trail is always here if you need to come back.' : progress.bellHung ? 'Our bell is hanging safely at the arch. Give it one clear ring, Rae.' : 'I have the bell and the new cord here at the arch. Come help me rehang it, then give it one clear ring.' }];
  if (id === 'minda' && progress.bellReturned && !progress.bellRung) return [{ speaker: 'Minda', text: progress.bellHung ? 'A fine knot and a steady bell. Go on, Rae: ring it once.' : 'Here at the arch, just as promised. Help me lift the bell and we will get it hanging again.' }];
  if (id === 'mangHome' && progress.bellRung) return [
    { speaker: 'Mang Uban', text: 'Your first road is mended. Seek Bagtas among the bamboo paths. His turns can lead you toward the Heart Balete.' },
    { speaker: 'Mang Uban', text: 'And remember: a crossing may lead home, but I cannot promise what I have not seen.' },
  ];
  if (id === 'mangRinging' && progress.bellRecovered) return [
    { speaker: 'Rae Jacob', text: 'The waybell was caught in the wheel! Every paddle knocked it against the bamboo line.' },
    { speaker: 'Mang Uban', text: 'The tree was only carrying its complaint. A useful lesson about blaming the largest person in a forest.' },
    { speaker: 'Tala', text: progress.bellReturned ? 'Minda is telling the clearing what happened. No more blaming you.' : 'We will tell the clearing what happened. No more blaming you.' },
  ];
  if (id === 'waterworksPath' && progress.bellRecovered) return [{ speaker: 'Tala', text: progress.bellRung ? 'Back to Rootwater Works. Our footbridge there leads onward to the bamboo paths.' : 'Back down to the works. The bell is safe; we can finish putting the crossing right.' }];
  if (id === 'talaHome' && progress.waterRestored) return [{ speaker: 'Tala', text: 'The wheel is repaired. Next, bring the waybell to Minda, rehang it at the clearing’s arch, and ring it. That will give the crossing its name again.' }];
  if (id === 'talaWhere' && mapId === 'waterworks') return [
    { speaker: 'Tala', text: 'Rootwater Works. The upper splitter feeds the wheel to the east, or the maintenance bypass to the west. Both rejoin downstream.' },
    { speaker: 'Tala', text: 'The grove is up the western trail. The low trail back to the clearing will open when the flooding drains.' },
  ];
  if (id === 'talaRinging' && progress.bellRecovered) return [{ speaker: 'Tala', text: progress.bellRung ? 'One proper ring. No more crooked clanging through the roots. My neighbors can sleep again.' : 'That bell was caught in the paddles. The bamboo carried its clanging all the way to Mang Uban’s tree.' }];
  if (id === 'minda' && progress.waterRestored) return progress.bellReturned ? [
    { speaker: 'Minda', text: progress.bellRung ? 'A steady wheel, dry doorsteps, and a road with a name. You two have done good work.' : 'Meet me at the arch. I have the replacement cord ready.' },
  ] : [
    { speaker: 'Rae Jacob', text: 'Found your bell! The wheel was knocking it against the bamboo line. We cleared the bypass and pulled it free.' },
    { speaker: 'Minda', text: 'And restored the flow. Our doorsteps are drying already. Thank you, both of you.' },
    { speaker: 'Tala', text: 'Mang Uban was never shaking the roots. We should tell everyone.' },
    { speaker: 'Minda', text: 'I will. Bring the bell to the arch. I have a new hanging cord; you can help me lift it.' },
  ];
  if (id === 'bellArch' && progress.bellReturned) return progress.bellRung ? [
    { speaker: 'Tala', text: 'Bamboo Crossing. Written on my map, and remembered by the road.' },
    { speaker: 'Rae Jacob', text: 'A good name. I am getting attached to roads that know where they go.' },
  ] : progress.bellHung ? [
    { speaker: 'Rae Jacob', text: 'One ring. Here goes!' },
    { speaker: 'Tala', text: 'The letters are coming back. Bamboo Crossing! And the lamps have steadied.' },
    { speaker: 'Minda', text: 'A waybell keeps one crossing’s name. The rest of the forest still needs looking after.' },
    { speaker: 'Mang Uban', text: 'Much better.' },
    { speaker: 'Rae Jacob', text: 'You’re welcome!' },
    { speaker: 'Mang Uban', text: 'I meant the silence.' },
    { speaker: 'Tala', text: 'Look, a folded leaf. Minda’s snack packet! He is sharing. That is practically a speech, for him.' },
    { speaker: 'Tala', text: 'I’m coming as far as the bamboo paths.' },
    { speaker: 'Rae Jacob', text: 'Because I’ll get lost?' },
    { speaker: 'Tala', text: 'Because I haven’t drawn them yet.' },
    { speaker: 'Rae Jacob', text: 'Then let’s draw them together. Come on, friend.' },
  ] : [
    { speaker: 'Minda', text: 'Steady now. Rae, lift the bell. Tala, pass me the new cord.' },
    { speaker: 'Tala', text: 'A good knot. No more surprises from the water.' },
    { speaker: 'Minda', text: 'There. The waybell is home. Rae, would you give it one clear ring?' },
  ];
  if (id === 'waterPath' && progress.waterRestored) return [{ speaker: 'Tala', text: 'The work barrier is open. This trail reaches the footbridge at Rootwater Works.' }];
  if (id === 'rootHomes' && progress.waterRestored) return [{ speaker: 'Rae Jacob', text: 'The window is open again. Someone is putting their tiny slippers out to dry. Excellent slippers weather.' }];
  if (id === 'mang' && progress.bellRung) return [{ speaker: 'Mang Uban', text: 'The forest is quiet enough to hear yourself think. Try it sometime.' }, { speaker: 'Rae Jacob', text: 'I’ll try it on the way. We have a road to follow.' }];
  if ((id === 'speakingTube' || id === 'rootFootprints') && progress.bellRecovered) return [{ speaker: 'Rae Jacob', text: 'No crooked clanging. No falling dust. The tree was only carrying the sound from the wheel.' }];
  switch (id) {
    case 'waterworksArrival': return [
      { speaker: 'Rae Jacob', text: 'There! Something shiny under that wheel. Every paddle makes it clang.' },
      { speaker: 'Tala', text: 'Our waybell. The surge must have washed it into the works. That bamboo line carries the sound uphill.' },
      { speaker: 'Rae Jacob', text: 'We should stop the water first. I still have my spare kite string in my pocket, if we need to reach anything.' },
      { speaker: 'Tala', text: 'Minda’s diagram is on the middle bank. We can get around the end of the western channel, down here.' },
    ];
    case 'splitter': return [
      { speaker: 'Tala', text: 'East: wheel channel. West: maintenance bypass. The bypass rejoins below the wheel, away from the homes.' },
      { speaker: 'Rae Jacob', text: 'So we can stop the wheel without flooding anybody else. Once the other channel is clear.' },
    ];
    case 'branch': return progress.branchMoved ? [{ speaker: 'Rae Jacob', text: 'The branch is tucked into the shallow recess. Plenty of room for water now.' }] : [
      { speaker: 'Rae Jacob', text: 'This branch is blocking the bypass. That shallow recess beside it looks big enough.' },
      { speaker: 'Tala', text: 'I’ll guide this end. One push... there. It will stay on the bank.' },
    ];
    case 'lever': return progress.waterRestored ? [{ speaker: 'Tala', text: 'East flow is steady. The wheel is doing its job again. We can leave the splitter here.' }] : !progress.branchMoved ? [
      { speaker: 'Rae Jacob', text: 'The handle stops against that little float.' },
      { speaker: 'Tala', text: 'The other channel needs room for the water. The branch is still in the way.' },
    ] : progress.flowDiverted ? progress.bellRecovered ? [
      { speaker: 'Rae Jacob', text: 'Bell out. Sending the water east again!' },
      { speaker: 'Tala', text: 'The wheel can turn freely now. Watch the bridge approach drain.' },
      { speaker: 'Minda', text: 'I can hear you through the tube! The water is settling here, too. I’ll open the low trail. Bring our bell back.' },
    ] : [{ speaker: 'Rae Jacob', text: 'Back to the east channel. The bell is still caught, so we will need to stop it again before reaching in.' }] : [
      { speaker: 'Rae Jacob', text: 'Sending the water west, through the clear bypass.' },
      { speaker: 'Tala', text: 'The wheel is stopping. We can safely use the grating beside it now.' },
    ];
    case 'wheelBell': return progress.bellRecovered ? [{ speaker: 'Rae Jacob', text: progress.waterRestored ? 'Round and round. No clanging! Much better.' : 'The bell is safely in my pocket. Time to restore the wheel’s water.' }] : progress.flowDiverted ? [
      { speaker: 'Rae Jacob', text: 'I can see the handle. Just a little too far down for my arm.' },
      { speaker: 'Tala', text: 'Could something in your pocket reach it? Choose a tool.' },
    ] : [
      { speaker: 'Tala', text: 'Stay on the bank. We need the wheel stopped before using that grating.' },
      { speaker: 'Rae Jacob', text: 'A bell, not a snack for a waterwheel. We’ll get you out.' },
    ];
    case 'stringBell': return [
      { speaker: 'Rae Jacob', text: 'A loop around the handle... pull the string tight... got it!' },
      { speaker: 'Tala', text: 'Our waybell. Safe and whole. Keep your string; I suspect you will need it again.' },
    ];
    case 'worksTube': return progress.waterRestored ? [{ speaker: 'Minda', text: 'The low trail southwest is open. Come back to Lantern Clearing with the bell.' }] : progress.bellRecovered ? [{ speaker: 'Minda', text: 'You got the bell? Good work! Restore water east so the wheel can drain the approach.' }] : [
      { speaker: 'Minda', text: 'I can hear you! Clear the west bypass before moving the splitter. Stay on the bank until the wheel stops.' },
      { speaker: 'Minda', text: 'The bell’s handle should be visible from the grating. Do you have something to loop around it?' },
    ];
    case 'groveReturn': return [{ speaker: 'Tala', text: 'The western trail climbs back to Mang Uban’s grove.' }];
    case 'lowTrail': return [{ speaker: 'Tala', text: progress.waterRestored ? 'The flooding has drained. This low trail takes us straight back to Minda in Lantern Clearing.' : 'The low trail is flooded. We can return through the grove, or restore the wheel to drain this shorter path.' }];
    case 'footbridge': return [{ speaker: 'Tala', text: !progress.waterRestored ? 'The approach is flooded. First we need a freely turning wheel to drain it.' : !progress.bellRung ? 'Dry planks, but the road still bends back on itself. We need to return the waybell and ring it at the clearing’s arch.' : 'Bamboo Crossing. A road that knows its name again. Come across; there is something pale on that root to the north.' }];
    case 'rootSeal': return progress.chapterComplete ? [
      { speaker: 'Tala', text: 'My earlier sketch shows that side passage open. Someone sealed it. The bamboo road ahead is still ours to follow.' },
      { speaker: 'Rae Jacob', text: 'And somewhere along it, Bagtas. He sounds like a person with directions. Complicated directions.' },
    ] : [
      { speaker: 'Rae Jacob', text: 'A root cut right through. So smooth... and that pale circle. Did the water do that?' },
      { speaker: 'Tala', text: 'Water doesn’t leave a mark like that. Look at my sketch: this side passage was open before the surge.' },
      { speaker: 'Rae Jacob', text: 'Someone closed it. But our road is still open, right?' },
      { speaker: 'Tala', text: 'Yes. The bamboo paths are just ahead. We will find Bagtas and ask about the turns.' },
      { speaker: 'Rae Jacob', text: '[A sharp hoofbeat from the bamboo. Another, from the other side.] ...Did you hear that?' },
      { speaker: 'Someone?', text: 'If you two are taking that road, you’ve already taken the wrong one!' },
      { speaker: 'Rae Jacob', text: 'Well. At least someone knows where we are. Come on, Tala.' },
    ];
    case 'lola': return progress.talkedToLola ? [
      { speaker: 'Lola Selya', text: 'Still here, anak? Your merienda is getting lonely.' },
      { speaker: 'Rae Jacob', text: "Tell it I'm on a very important kite mission." },
      { speaker: 'Lola Selya', text: 'Then take care of yourself, very important explorer.' },
    ] : [
      { speaker: 'Lola Selya', text: 'Rae Jacob! Merienda! Come out of the sun for a little while.' },
      { speaker: 'Rae Jacob', text: 'One more minute, La! The wind put my kite in the old tree.' },
      { speaker: 'Lola Selya', text: 'One minute becomes a whole afternoon with you. Stay where I can hear you, ha?' },
      { speaker: 'Lola Selya', text: 'And if you lose your way, stop first. Look around. Sometimes the way back is right beside you.' },
    ];
    case 'merienda': return [
      { speaker: 'Rae Jacob', text: "Warm pandesal. I can smell that from here." },
      { speaker: 'Rae Jacob', text: 'An explorer should probably pack supplies. Or eat them immediately.' },
    ];
    case 'clothesline': return [
      { speaker: 'Rae Jacob', text: 'The shirts are all pointing at the balete.' },
      { speaker: 'Rae Jacob', text: 'Excellent wind report. Terrible news for my kite.' },
    ];
    case 'basin': return [
      { speaker: 'Rae Jacob', text: 'Definitely not a swimming pool. Lola was very clear.' },
      { speaker: 'Rae Jacob', text: 'But if I were VERY small… no. Still not a swimming pool.' },
    ];
    case 'balete': return !progress.talkedToLola ? [
      { speaker: 'Rae Jacob', text: "There's my kite! I should tell Lola before I go poking around the roots." },
    ] : [
      { speaker: 'Rae Jacob', text: 'Just one little reach… Huh? Is that a light between the roots?' },
      { speaker: 'Someone?', text: "Hello? Who's there?" },
      { speaker: 'Rae Jacob', text: 'La? …Okay. Trees do not usually do that.' },
    ];
    case 'arrival': return [
      { speaker: 'Rae Jacob', text: 'Oof. Leaves. Good. Leaves are good.' },
      { speaker: 'Rae Jacob', text: 'La? ...Lola? The opening was right here.' },
      { speaker: 'Rae Jacob', text: 'Those are not the stars from our yard. And those lights... are those houses?' },
      { speaker: 'Rae Jacob', text: 'Stop first. Look around. Okay, La. I can do that.' },
    ];
    case 'tala': return progress.metTala ? [
      { speaker: 'Tala', text: 'The map is not finished. Neither is the afternoon, apparently.' },
      { speaker: 'Tala', text: 'What do you want to know?' },
    ] : [
      { speaker: 'Tala', text: 'Please move your foot.' },
      { speaker: 'Rae Jacob', text: 'What?' },
      { speaker: 'Tala', text: 'You are standing on the road. The little one. Under your very large foot.' },
      { speaker: 'Rae Jacob', text: 'Oh! Sorry. I am Rae Jacob. I fell through a tree. That sounds strange when I say it.' },
      { speaker: 'Tala', text: 'Tala. Mapmaker. Well... almost. And you are human, which is considerably stranger.' },
      { speaker: 'Rae Jacob', text: 'Can you help me get home? My Lola is waiting.' },
      { speaker: 'Tala', text: 'I will help you look. These paths have been acting oddly. Tell me what happened.' },
    ];
    case 'talaWhere': return mapId === 'grove' ? [
      { speaker: 'Tala', text: 'The Old Balete Grove. Lantern Clearing is back down the southern path.' },
      { speaker: 'Rae Jacob', text: 'That is a lot of tree for one grove.' },
      { speaker: 'Tala', text: 'And a lot of grove for one map. I will need another page.' },
    ] : [
      { speaker: 'Tala', text: 'Lantern Clearing. Our homes are under the roots, our roads between them. Please watch your feet.' },
      { speaker: 'Rae Jacob', text: 'And beyond the clearing?' },
      { speaker: 'Tala', text: 'Silong. More paths than I have drawn. I have never been very far from here.' },
    ];
    case 'talaHome': return progress.metMang ? [
      { speaker: 'Tala', text: 'Mang Uban said the old crossings lead through the Heart Balete. That is our way to look for home.' },
      { speaker: 'Rae Jacob', text: 'First we get the local crossing working again. One road at a time.' },
    ] : mapId === 'grove' ? [
      { speaker: 'Tala', text: 'Mang Uban is right above those roots. He knows paths older than this clearing.' },
      { speaker: 'Rae Jacob', text: 'I suppose we should look up when we ask.' },
    ] : [
      { speaker: 'Rae Jacob', text: 'There was a gap in the balete. Then I fell. Now it is just... roots.' },
      { speaker: 'Tala', text: 'Old crossings do that sometimes. Mang Uban knows the older forest paths. We should ask him.' },
      { speaker: 'Rae Jacob', text: 'Is he very far?' },
      { speaker: 'Tala', text: 'The grove is north of the clearing. He is the large person in the large tree. Difficult to miss.' },
    ];
    case 'talaRinging': return progress.discoveries.includes('speakingTube') ? [
      { speaker: 'Tala', text: 'The ringing travels through the bamboo tube. It runs downhill toward the waterworks.' },
      { speaker: 'Rae Jacob', text: 'So a sound can get lost in the forest, too. At least this one left a trail.' },
    ] : [
      { speaker: 'Tala', text: 'That ringing started after the water surge. It shakes dust out of our ceilings.' },
      { speaker: 'Rae Jacob', text: 'Do you know what is making it?' },
      { speaker: 'Tala', text: 'Not yet. Minda keeps the water channels. She is working east of here. We can ask her.' },
      { speaker: 'Rae Jacob', text: 'A mystery. I should write this down.' },
    ];
    case 'minda': return progress.heardMinda ? [
      { speaker: 'Minda', text: 'The work path is still closed. I need to know what is wrong before anyone crosses.' },
      { speaker: 'Minda', text: 'If you visit Mang Uban, ask when he first heard the ringing. He notices things up in that tree.' },
    ] : [
      { speaker: 'Minda', text: 'Mind the channel, young traveler. We had a sudden surge, and the crossing is not safe.' },
      { speaker: 'Rae Jacob', text: 'Was that when the ringing started?' },
      { speaker: 'Minda', text: 'The very same evening. Our path bell went missing then, too. See that empty arch down there?' },
      { speaker: 'Minda', text: 'I have closed the maintenance route. Something is making the wheel shudder. First we find the cause.' },
    ];
    case 'sealedRoots': return [
      { speaker: 'Rae Jacob', text: 'Solid roots. Not even a gap. I came through here... I think.' },
      { speaker: 'Rae Jacob', text: 'My kite is still up there. So is home. There has to be another way.' },
    ];
    case 'rootHomes': return [
      { speaker: 'Rae Jacob', text: 'Tiny windows. Tiny slippers. Somebody has a tiny clothesline.' },
      { speaker: 'Rae Jacob', text: 'This is a whole neighborhood. I had better be careful where I step.' },
    ];
    case 'bellArch': return progress.metTala ? [
      { speaker: 'Rae Jacob', text: 'A snapped cord. And fresh scratches toward the channel.' },
      { speaker: 'Tala', text: 'Our waybell hung here. It helped the crossing remember where it led. The marker has been blank since it vanished.' },
      { speaker: 'Rae Jacob', text: 'I once forgot where I left my slippers. A whole road forgetting is new.' },
    ] : [
      { speaker: 'Rae Jacob', text: 'Something used to hang here. The cord is snapped.' },
      { speaker: 'Rae Jacob', text: 'And those scratches lead toward the water. I will remember that.' },
    ];
    case 'waterPath': return [
      { speaker: 'Rae Jacob', text: 'A work barrier. The water is moving awfully fast beyond it.' },
      { speaker: 'Rae Jacob', text: 'The sign says to speak with the waterkeeper. That seems like excellent advice.' },
    ];
    case 'grovePath': return progress.metTala ? [
      { speaker: 'Tala', text: 'This is the path to Mang Uban. He has watched this forest longer than anybody I know.' },
      { speaker: 'Rae Jacob', text: 'Then that is where we go next.' },
      { speaker: 'Tala', text: 'Together. Your feet are good at covering ground. Mine are good at finding the road.' },
    ] : [
      { speaker: 'Rae Jacob', text: 'An old trail, and a name I do not know. I should find someone in the clearing before I head deeper in.' },
    ];
    case 'mang': return progress.metMang ? [
      { speaker: 'Mang Uban', text: 'Still down there, little traveler? Speak up. The forest is louder than it looks.' },
      { speaker: 'Rae Jacob', text: 'I have another question.' },
      { speaker: 'Mang Uban', text: 'Children usually do.' },
    ] : [
      { speaker: 'Mang Uban', text: 'Three times.' },
      { speaker: 'Rae Jacob', text: 'Three times what?' },
      { speaker: 'Mang Uban', text: 'That bell. Every time I begin to sleep.' },
      { speaker: 'Tala', text: 'Some of the clearing thinks it is you shaking their homes.' },
      { speaker: 'Mang Uban', text: 'If I were walking, little mapmaker, you would know.' },
      { speaker: 'Rae Jacob', text: 'I fell into this forest. Do you know a way back to my Lola?' },
      { speaker: 'Mang Uban', text: 'The old crossings lead through the Heart Balete. Yours may still be open. I cannot promise what I have not seen.' },
      { speaker: 'Mang Uban', text: 'The first road is beyond the clearing. But its approach is flooded and its guiding bell is gone.' },
      { speaker: 'Mang Uban', text: progress.discoveries.includes('speakingTube') ? 'You already found the bamboo tube? Good eyes. Follow its line downhill. That sound has a source.' : 'Listen beside that bamboo tube. The ringing comes up from below. Find its source, and you may find what is troubling the crossing.' },
    ];
    case 'mangHome': return [
      { speaker: 'Rae Jacob', text: 'What is the Heart Balete?' },
      { speaker: 'Mang Uban', text: 'An old meeting place of roots and roads. A crossing to your world must touch it somewhere.' },
      { speaker: 'Mang Uban', text: 'Start with the road before you. Mend that crossing, then seek Bagtas among the bamboo paths. He knows the turns.' },
    ];
    case 'mangRinging': return [
      { speaker: 'Rae Jacob', text: 'When did you first hear the bell?' },
      { speaker: 'Mang Uban', text: 'After the water surged. A crooked rhythm. Water, a clang, then the roots trembling beneath me.' },
      { speaker: 'Tala', text: 'Minda said our bell disappeared that evening.' },
      { speaker: 'Mang Uban', text: 'Then you have two things that happened together. Go and see whether they belong together.' },
    ];
    case 'mangForest': return [
      { speaker: 'Rae Jacob', text: 'Have the paths always been like this?' },
      { speaker: 'Mang Uban', text: 'A forest changes. But lately, familiar roads have been forgetting familiar places.' },
      { speaker: 'Mang Uban', text: 'Watch your landmarks. Ask before assuming. And do not confuse a large shadow with an enemy.' },
    ];
    case 'speakingTube': return [
      { speaker: 'Rae Jacob', text: 'The ringing is much stronger inside the bamboo. It is coming through it!' },
      { speaker: 'Tala', text: 'A speaking tube. Minda uses them to call between the maintenance stations. This line goes down toward the wheel.' },
      { speaker: 'Rae Jacob', text: 'Then the tree is carrying the message. Not making the noise.' },
    ];
    case 'oldMarker': return [
      { speaker: 'Rae Jacob', text: 'A tree carved into a road sign. Its roots branch in every direction.' },
      { speaker: 'Tala', text: 'The Heart Balete. I have heard stories of it. Old crossings carry that mark.' },
    ];
    case 'rootFootprints': return [
      { speaker: 'Rae Jacob', text: 'Dust is trembling loose. But Mang Uban has not moved.' },
      { speaker: 'Tala', text: 'Then somebody in the clearing owes him an apology. Possibly several somebodies.' },
    ];
    case 'clearingPath': return [
      { speaker: 'Tala', text: 'Back to Lantern Clearing. I can practically smell the lamps from here.' },
    ];
    case 'waterworksPath': return progress.metMang || progress.discoveries.includes('speakingTube') ? [
      { speaker: 'Tala', text: 'The maintenance trail. The bamboo line follows it downhill to Rootwater Works.' },
      { speaker: 'Rae Jacob', text: progress.metMang ? 'One missing bell, one strange sound. Let us see what is down there.' : 'Let us find where that sound starts. We should speak to the watcher in the tree, too.' },
    ] : [
      { speaker: 'Rae Jacob', text: 'A bamboo line follows this trail. That ringing is coming through it. I should inspect the tube or ask the forest watcher before heading down.' },
    ];
    default: return [{ speaker: 'Rae Jacob', text: 'There is a story here. I should ask someone who knows it.' }];
  }
}
