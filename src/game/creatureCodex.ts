import type { CharacterId, Progress } from './model.ts';
import { RESIDENTS, RESIDENT_IDS } from './residents.ts';

export type CreatureId = 'duwende' | 'kapre' | 'tikbalang' | 'diwata' | 'tigmamanukan' | 'giantess';
type Source = { title: string; url: string };
export type CreatureEntry = { id: CreatureId; name: string; subtitle: string; portrait: CharacterId; tradition: string; powers: string; ways: string; variation: string; inSilong: string; sources: Source[] };
export const CREATURES: readonly CreatureEntry[] = [
  {
    id: 'duwende', name: 'Duwende', subtitle: 'Small neighbors, many different tellings', portrait: 'tala',
    tradition: 'A Filipino American family account recorded in 2015 describes very small, humanlike beings who can be friendly or mischievous. These are family memories, not a single description shared by every Philippine community.',
    powers: 'In that telling, duwende hide belongings and decide when to return them. A different narrator, recorded in 2017, recalls beings near trees and a family belief that disturbing their home could lead to possession. These are reported beliefs, not medical explanations.',
    ways: 'The 2015 narrator remembers food being left outside to keep them pleased. The 2017 account stresses leaving their dwelling undisturbed. Both accounts give small, easily overlooked neighbors a presence in ordinary family spaces.',
    variation: 'One narrator calls them harmless pranksters; the other distinguishes helpful and harmful kinds. Keep those differences visible. A nuno sa punso has its own mound-related tellings; this entry does not make every small spirit the same being.',
    inSilong: 'Tala and the duwende village are original characters. Their tapered ears, leaf clasps, woven clothes, mapmaking and waterworks are our art and story choices. They are neighbors with different skills and temperaments, rather than one personality copied across a species.',
    sources: [
      { title: 'USC Digital Folklore Archives · 2015 family telling, collected by Miel Krauss', url: 'https://folklore.usc.edu/duwende/' },
      { title: 'USC Digital Folklore Archives · 2017 family telling, collected by Crystal Yang', url: 'https://folklore.usc.edu/duwende-2/' },
    ],
  },
  {
    id: 'kapre', name: 'Kapre', subtitle: 'A giant in the branches', portrait: 'uban',
    tradition: 'The National Commission for Culture and the Arts describes a tobacco-smoking giant commonly seated high in a tree. Scale, branches and smoke make a powerful silhouette before a traveler hears a voice.',
    powers: 'The NCCA account includes changing size or appearance and making howling or birdlike sounds. This records a set of motifs, not a fixed list of abilities for every kapre story.',
    ways: 'The same account discusses kapre warnings told to children who resist resting at midday. A frightening story can carry an adult reminder; its teller and setting matter as much as its giant.',
    variation: 'The NCCA also records a later childlike depiction. There is no reason to assume every telling gives the kapre the same age, clothing or disposition.',
    inSilong: 'Mang Uban is our particular kapre: huge, tobacco-smoking, watchful and capable of gentleness. His old perch, memories, personal name and Listening Seed are original fiction. His size does not prove he caused the village’s trouble. Rae has to listen and investigate.',
    sources: [{ title: 'NCCA Official · kapre, 2015 cultural vocabulary entry', url: 'https://www.flickr.com/photos/nccaofficial/18442068642' }],
  },
  {
    id: 'tikbalang', name: 'Tikbalang', subtitle: 'The traveler’s uncertain road', portrait: 'bagtas',
    tradition: 'The NCCA describes a tall being with a horse-like head and long horse-like legs, alongside a humanlike body and hands. It also associates tikbalang with large trees, including balete.',
    powers: 'Misleading travelers in forests and mountains is a recorded motif. The apparent road becomes unreliable. This entry does not turn every confusing turn into proof that a tikbalang is nearby.',
    ways: 'A familiar saying links rain falling in sunshine with a tikbalang wedding. The NCCA records it as a saying and children’s rhyme, rather than a literal weather rule.',
    variation: 'The institutional entry brings together several motifs. Individual tellings need not use all of them, and a named character need not behave like every warning told about his kind.',
    inSilong: 'Bagtas deliberately misleads Rae with echoing hoofbeats, changing signs and returning paths. His three-trial bargain, muscular build and gradual willingness to keep company are original fiction. Rae uses family advice about reversing clothing beside the final sign to loosen the last illusion. The three guided trials, occasional worn waymarks, creature helpers and destination signs are game inventions. Winning earns reluctant respect, not instant friendship.',
    sources: [{ title: 'NCCA Official · tikbalang, 2015 cultural vocabulary entry', url: 'https://www.flickr.com/photos/nccaofficial/18070087763' }, { title: 'Read Tiktik · modern field-guide retelling, including inside-out clothing advice', url: 'https://www.readtiktik.com/fieldguide/tikbalang' }],
  },
  {
    id: 'diwata', name: 'Diwata', subtitle: 'Mayumi · The Diwata ng Bukal', portrait: 'mayumi',
    tradition: 'Diwata belongs to more than one Philippine tradition. Marie Melanie Misajon’s study of early Bisayan mythology discusses deities called diwata in Hiligaynon, with powers and territories tied to elements and places.',
    powers: 'That study discusses dominion over parts of nature; it does not establish one identical power set for all diwata. In the separate Santa Ana account discussed by Pimentel, Rodriguez and del Rosario, the Diwata sa Bukal is associated with a spring and its religious history.',
    ways: 'The Santa Ana discussion concerns Namayan in what is now Manila. It gives one spring tradition a specific setting. A local relationship with water should not become a claim that one spirit rules every Philippine spring.',
    variation: 'These sources come from different places and bodies of tradition. Diwata is not simply a universal winged-fairy species, and names and biographies from different communities should not be merged.',
    inSilong: 'Mayumi, The Diwata ng Bukal, is our original caretaker of the Quiet Spring. Her name, appearance, memories, limits and involvement with the seals are authored for this game. She is not the traditional Santa Ana figure renamed. Her care for a particular bukal gives Rae a way to understand why people downstream matter.',
    sources: [
      { title: 'Central Philippine University · Misajon, The System of Early Bisayan Mythology (completed 2008)', url: 'https://urc.cpu.edu.ph/the-system-of-early-bisayan-mythology-2/' },
      { title: 'Pimentel, Rodriguez & del Rosario (2022) · Santa Ana / Diwata sa Bukal, pp. 328–330', url: 'https://ioer-imrj.com/wp-content/uploads/2022/08/Ntra.-Sra.-De-Los-Desamparados-and-Postcolonial-Resistances.pdf' },
    ],
  },
  {
    id:'tigmamanukan',name:'Tigmamanukan',subtitle:'A Tagalog omen bird and the traveler’s decision',portrait:'tigmamanukan',
    tradition:'Juan de Plasencia’s 1589 account of Tagalog customs records a bird called Tigmamanuguin. Travelers interpreted its song before continuing a journey. The spelling Tigmamanukan is used here for our bird.',
    powers:'The account distinguishes favorable and unfavorable forms of song. It documents omen interpretation, rather than a bird speaking directions or reliably finding every lost person.',
    ways:'A traveler might continue or return home according to the omen. Listening before setting out gives the bird a connection to travel and uncertainty.',
    variation:'This is an early colonial account of a Tagalog practice, not the voice of every Philippine community. Other regional omen birds have their own names and tellings; this entry does not merge them into one creature.',
    inSilong:'Our original blue bird flies a short way along the correct seeded corridor, then returns to a branch. Tala helps Rae interpret that particular behavior. Its kindness, repeated appearances and navigation mechanic are authored for Silong. It does not talk or require a gift. The Codex records an observation after Rae watches it.',
    sources:[{title:'Plasencia (1589) · Customs of the Tagalogs, travel omens, printed p. 189',url:'https://upload.wikimedia.org/wikipedia/commons/4/4c/The_Philippine_Islands%2C_1493-1803%3B_%28IA_afk2830.0001.007.umich.edu%29.pdf'}],
  },
  {
    id:'giantess',name:'Giantess',subtitle:'Aling Dalisay · Inspired by an Isneg tale',portrait:'dalisay',
    tradition:'In “The Giant’s Wife,” an Isneg tale recorded by Morice Vanoverbergh, Sibbarayungan sees Ayo approaching the dwelling of Gisurab. She takes Ayo inside and conceals her in a trunk.',
    powers:'Sibbarayungan protects the visitor through hospitality and clever concealment. This episode does not give her a universal power to navigate forests or command paths.',
    ways:'She deflects Gisurab’s suspicion, then lets Ayo out when he leaves. They eat, and Ayo goes home. A dangerous giant and a protective giantess appear in the same account.',
    variation:'Sibbarayungan is a named figure in a particular Isneg tale. Her actions are not a rule that every giant, giantess or Isneg supernatural being is kind. This entry concerns that recorded episode, rather than one pan-Philippine giant species.',
    inSilong:'Aling Dalisay is our original giantess, inspired by the tale’s protective welcome. She is not Sibbarayungan renamed, and her name is not presented as an Isneg traditional name. Her woven costume, open resting clearing, fallen-petal clues and directions are authored for this game. She offers help without a new quest and lets Rae be a frightened, curious child.',
    sources:[{title:'Morice Vanoverbergh · Isneg Tales, “The Giant’s Wife,” printed p. 64',url:'https://asianethnology.org/article/148006-isneg-tales.pdf'}],
  },
];

export function creatureEncounters(id: CreatureId, p: Progress): string[] {
  if (id === 'duwende') return [
    ...(p.metTala ? ['Tala'] : []), ...(p.heardMinda || p.bellReturned ? ['Minda'] : []),
    ...RESIDENT_IDS.filter(id => (p.residentChats[id] ?? 0) > 0).map(id => RESIDENTS[id].name),
    ...(p.rainlit.metLuning ? ['Luning'] : []),
  ];
  if (id === 'kapre') return p.metMang ? ['Mang Uban'] : [];
  if (id === 'tikbalang') return p.chapterTwo.metBagtas ? ['Bagtas'] : [];
  if (id === 'tigmamanukan') return (p.chapterTwo.helperChats.tigmamanukan??0)>0?['The blue omen bird']:[];
  if (id === 'giantess') return (p.chapterTwo.helperChats.dalisay??0)>0?['Aling Dalisay']:[];
  return p.rainlit.metMayumi ? ['Mayumi'] : [];
}
export const encounteredCreatures = (p: Progress) => CREATURES.filter(entry => creatureEncounters(entry.id, p).length > 0);
export function creatureMemory(id: CreatureId, p: Progress): string {
  if(id==='tigmamanukan')return 'I told a bird my name! It did not speak, but it flew a little way and waited. Tala said people listened to omen birds before journeys. I wonder what it notices from above the bamboo.';
  if(id==='giantess')return 'She was enormous, even sitting down. I thought of Mang Uban, but she said a large shadow could belong to more than one kind of neighbor. She made room for my questions before showing us the road.';
  if (id === 'duwende') return p.bellRung ? 'The square filled with little voices when the bell rang. These are somebody’s homes. I helped bring their road back.' : p.metTala ? 'Tala is a duwende! I nearly stared at her ears instead of saying hello. She makes maps. I wonder what she sees that I walk straight past.' : 'I met one of the little neighbors. I want to learn their names before deciding what their story means.';
  if (id === 'kapre') return p.ubanGiftReceived ? 'He put a Listening Seed in my hand. Someone that enormous managed to give me something so small without crushing it.' : 'He is bigger than Lola’s house! I thought a voice that deep would only sound angry. But he waited for my question.';
  if (id === 'tikbalang') return p.chapterTwo.debriefSeen ? 'He made the maze. We beat it, and he kept his bargain. I can admire his cleverness and still tell him I hated being lost. La’s inside-out shirt advice helped!' : 'A horse’s face, hands like a man’s, and so much confidence. He admitted the wrong turns were his. I asked him to keep a way back open. Tala heard him promise.';
  return p.rainlit.restored ? 'The water reached the neighbors again. Mayumi needed our hands as well as our questions. Being a diwata doesn’t mean every problem disappears.' : 'Mayumi noticed the water before anything else. I have so many questions. I should ask before stepping closer to her spring.';
}
