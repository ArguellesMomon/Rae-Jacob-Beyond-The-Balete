import type { DialogueLine, InteractionId, MapId, Progress } from './model.ts';
import { choiceBeat, friendshipCallback } from './storyChoices.ts';
const R = (text: string, emotion: DialogueLine['emotion'] = 'curious', beat?: string): DialogueLine => ({ speaker: 'Rae Jacob', text, emotion, gesture: emotion === 'wistful' ? 'think' : 'talk', ...(beat ? { beat } : {}) });
const T = (text: string, emotion: DialogueLine['emotion'] = 'warm', beat?: string): DialogueLine => ({ speaker: 'Tala', text, emotion, gesture: 'map', ...(beat ? { beat } : {}) });
const M = (text: string): DialogueLine => ({ speaker: 'Minda', text, emotion: 'warm', gesture: 'talk' });

function mapLesson(p: Progress): DialogueLine[] {
  return [
    T('Wait. My copy marks the low trail as dry. That dark line on the bank is above the path.', 'worried', 'Her thumb presses over a small, confidently inked arrow.'),
    R('There are leaves stuck in the branches. The water was all the way up there.'),
    T('I copied that route before the surge. I should have dated it. I was so pleased it looked finished.', 'wistful'),
    ...choiceBeat('mapMistake', p, T('You trusted me with a way forward. I nearly gave you an old answer.', 'worried')),
    T('I will pencil in the high-water line and write when we saw it. We will use the dry plank walkway around the western channel.'),
    R('You do the careful pencil. I will do the looking-before-stepping.', 'determined'),
    T('And I can ask you to check something. I do not have to pretend I know every turn.', 'warm'),
  ];
}

export function afterBellLines(p: Progress): DialogueLine[] {
  const lines: DialogueLine[] = [
    T('Before the next road... shall we watch this one for a moment?', 'warm', 'The last bell note fades. They turn toward the little homes. A shutter opens; a basket goes back inside.'),
    R('Nobody is running now. Even Minda has stopped counting things.', 'warm'),
    M('Only for a moment. This packet is for sharing. You have both earned time to eat.'),
    R(p.discoveries.includes('merienda') ? 'Lola saved the soft pandesal for me. There were two cups on the table. I thought I had all afternoon.' : 'Lola always sets out a second cup before she calls me. I can almost hear it touch the table.', 'wistful', 'Rae holds the warm leaf packet without opening it yet.'),
    T('You helped us. You are allowed to feel glad about that.'),
    R('I am glad. I liked the part where we figured it out together. I just wish I could tell her I am safe.', 'wistful'),
    T('I cannot send a voice across the roots. But I can stay while you miss her.'),
    R('Could you tell me something ordinary? Something that happens here when no roads are broken.'),
    T('Sela brings her washing in late and blames the moon. Nilo loses his pencil behind his ear. Minda pretends not to notice the chair we leave outside her door.', 'warm'),
    R('Lola loses her glasses on top of her head. I once offered to draw her a map.', 'wry'),
    T('Did she accept?'),
    R('She asked whether it showed where I had left my slippers.', 'delighted'),
    ...friendshipCallback(p),
    ...(p.talaMapHelped ? [T('I kept our correction. There is a date beside the low trail now. Your part belongs on this page, too.'), R(p.storyChoices.mapMistake === 'playful' ? 'Make sure the water gets a small warning about its manners.' : p.storyChoices.mapMistake === 'cautious' ? 'Leave room to check it again after the next rain.' : 'Leave room for the next thing we learn.', 'warm')] : []),
    R('All right. Half for you. Then we find the next safe road.', 'warm', 'He opens the packet between them. For a few breaths, the only answer is water turning the wheel.'),
    T('When you tell Lola about this part, say we stopped to eat.'),
    R('She will like you even before the careful-pencil part.', 'warm'),
  ];
  return lines.map(line => line.speaker === 'Tala' && !/map|page|correction/i.test(line.text) ? { ...line, gesture: 'listen' } : line);
}

/** Personal callbacks enrich existing clues; no discovery becomes a puzzle prerequisite. */
export function chapterOneMoments(id: InteractionId, p: Progress, map: MapId, lines: DialogueLine[]): DialogueLine[] {
  if (id === 'afterBell') return afterBellLines(p);
  if (id === 'tala' && !p.metTala) return [...lines.slice(0, -1), ...choiceBeat('firstTrust', p, T('May I walk with you until we find Minda? You need help here, and I would like to see beyond my blank edge.')), ...lines.slice(-1)];
  if (id === 'waterworksArrival') return [...lines.slice(0, 2), ...(p.talaMapHelped ? [T('Our dated correction still stands: check the banks, then take the dry plank walkway.')] : mapLesson(p)), ...lines.slice(2, -1)];
  let result = lines;
  if (id === 'talaMaps' && p.visitedWaterworks && !p.talaMapHelped) result = [...lines, ...mapLesson(p)];
  if (id === 'lowTrail' && p.waterRestored && p.talaMapHelped) return [...lines,
    T('Dry stones. The high-water line is still there, but the path is safe again. I can date a second mark beside the first.'),
    R('A before and an after. Both true, just at different times.'), T('And this time, we checked together.')];
  if (id === 'talaMaps' && p.talaMapHelped) result = [...lines, T('The dated correction stays beside the low trail. I am keeping the first line, too. It reminds me to check.'), R('A map with a memory. I like that.', 'warm')];
  const extra: DialogueLine[] = [];
  if (id === 'dryingRack') extra.push(R(p.discoveries.includes('clothesline') ? 'The cloth smells of warm bark. Our clean sheets smell of sun. Lola can tell they are dry without looking.' : 'That warm-cloth smell... Lola brings the washing in against her shoulder like that.', 'wistful'), R('If I were small enough, a handkerchief would be an excellent blanket.', 'wry'));
  if (id === 'rainCup' && p.discoveries.includes('rainJar')) extra.push(R('Roof, jar, watering can. Lola showed me how one bit of water can have several stops.'), T('Here it is leaf, cup, seed tray. Different sizes. The same care.'));
  if (id === 'splitter' && p.discoveries.includes('rainJar')) extra.push(R('Like the gutter at Lola\'s jar. The water follows whichever opening we give it. We need somewhere clear for it to go first.'), T('That is the western bypass on the diagram. We still check the actual channel before touching the lever.'));
  if (id === 'branch' && !p.branchMoved && p.discoveries.includes('herbBed')) extra.push(R('Careful hands, La. I will move the loose branch into that recess. The live roots can stay where they are.', 'determined'));
  if (id === 'stringBell' && p.discoveries.includes('basin')) extra.push(R('Dry fingers before the string. I nearly forgot.', 'warm', 'He wipes his hands on his shorts before opening the recovered loop.'), T('Another thing your Lola taught you?'), R('She thought she was teaching me not to drip on the porch. It turns out that travels quite far.', 'warm'));
  if (id === 'talaMaps' && p.discoveries.includes('sungka')) extra.push(R('Lolo made the hollows in our sungka board smooth. You can feel where people put their hands. Your map has soft corners like that.'), T('I thought they only made it look old.'), R('They make it look as though somebody cared about using it.', 'warm'));
  if (id === 'mangMemory') extra.push(R(p.discoveries.includes('calamansi') ? 'Lola has a calamansi tree from her great-grandmother. She can tell the whole story while she picks one leaf.' : 'Lola tells stories while her hands do other things. I used to listen for the end so I could go outside.', 'wistful'), { speaker: 'Mang Uban', text: 'And now?', emotion: 'warm', gesture: 'listen' }, R('Now I keep remembering the middle parts.', 'warm'));
  if (id === 'mindaNeighbors') extra.push(M('Sela left a warm packet by my tools. She does that when I forget supper.'), R('Lola saves me a place before I remember I am hungry. You might have a Lola-shaped committee here.', 'wry'), M('A formidable committee. I had better listen.'));
  // Tala's personal story can be revisited after the work, with the selected voice remembered.
  if (id === 'talaJourney' && p.bellRung) extra.push(...friendshipCallback(p));
  if (map === 'yard') return lines;
  return [...result, ...extra];
}
