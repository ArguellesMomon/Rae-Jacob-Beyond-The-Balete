import type { DialogueLine, MapId, Progress, ResidentId } from './model.ts';

export const RESIDENTS = {
  nilo: { name: 'Nilo', role: 'LAMPKEEPER · DUWENDE', map: 'clearing', x: 130, y: 228, base: 'tala', tint: '#a77954', trim: '#d9ba72', bio: 'Tends the lamps one wick at a time. He knows which neighbors leave a light for someone coming home.' },
  sela: { name: 'Sela', role: 'BASKET MENDER · DUWENDE', map: 'clearing', x: 312, y: 282, base: 'minda', tint: '#9a738a', trim: '#d9bca0', bio: 'Mends baskets and collects stories at the same unhurried pace. Her baskets survive the occasional impatient customer.' },
  doro: { name: 'Doro', role: 'SEED TENDER · DUWENDE', map: 'grove', x: 132, y: 309, base: 'tala', tint: '#8e9564', trim: '#d5c397', bio: 'Keeps fallen seeds in shallow trays. He has learned to share a quiet grove with a very large neighbor.' },
  pilo: { name: 'Pilo', role: 'APPRENTICE KEEPER · DUWENDE', map: 'waterworks', x: 281, y: 355, base: 'tala', tint: '#698e9f', trim: '#d6c87e', bio: 'Learns the works by checking the gauge, then checking it again. Minda trusts him to notice small changes.' },
} as const;
export const RESIDENT_IDS = Object.keys(RESIDENTS) as ResidentId[];
export function isResident(id: string): id is ResidentId { return RESIDENT_IDS.includes(id as ResidentId); }
export function residentFromSpeaker(name: string) { return RESIDENT_IDS.find(id => RESIDENTS[id].name === name); }
export function residentsIn(map: MapId) { return RESIDENT_IDS.filter(id => RESIDENTS[id].map === map); }
export function residentVisit(p: Progress, id: ResidentId) { return p.residentChats[id] ?? 0; }

// Two shuffled decks, with a fixed first slot, avoid repeated neighboring lines,
// including at deck boundaries. Visits persist, so reloading does not reset banter.
export function ambientIndex(id: ResidentId, visit: number) {
  const n = Math.max(0, Math.floor(visit)), deck = Math.floor(n / 4) % 2 ? [0, 2, 3, 1] : [0, 1, 3, 2];
  return (deck[n % 4] + RESIDENT_IDS.indexOf(id)) % 4;
}
export function residentLines(id: ResidentId, p: Progress): DialogueLine[] {
  const person = RESIDENTS[id], visit = residentVisit(p, id);
  const variants = {
    nilo: [p.bellRung ? 'One steady lamp for every doorway. It is lovely when my work can be boring again.' : 'I trim the wicks shorter when people are worried. A wavering lamp makes every shadow look like news.', 'That tall lamp is for visitors. The low one is for people who were here before the visitors arrived. Watch both.', 'Moths believe every lantern is a very small moon. I have not found a polite way to correct them.', p.bellRung ? 'I heard you helped Minda. If you visit Mang Uban, tell him his lamp has not needed oil once. He finds that funny.' : 'Minda closed the path before anyone got hurt. That deserves remembering as much as the trouble does.'],
    sela: ['A basket can lose one strip and still hold together. That is no excuse to ignore the loose strip.', 'I was promised a very small basket of mushrooms. They brought the mushrooms first. Now I must negotiate what “small” means.', p.bellRung ? 'Dry steps, steady water, and everyone visiting to explain how they knew it would be all right. I am charging them in good stories.' : 'When the water rose, we moved baskets before furniture. Furniture does not float away quite so enthusiastically.', 'If you find a blue thread on the path, it is probably mine. If you find seven, I have taken a wrong turn.'],
    doro: ['A seed is a patient kind of luggage. It carries a whole tree without once asking whether we are there yet.', 'Mang Uban leaves fallen fruit on that flat stone. He claims it keeps the squirrels from making speeches above his head.', p.bellRung ? 'Hear how far a small bird carries now? Thank you for bringing that sort of quiet back.' : 'The shaking shakes my trays. It does not shake his branch. I suspect the noise has traveled farther than its cause.', 'Some of these will never sprout. I leave room for the ones that surprise me.'],
    pilo: [p.waterRestored ? 'East flow, steady mark. I checked twice. Then Minda told me twice was enough.' : p.flowDiverted ? 'West is carrying the flow. The wheel is stopped. I can finally hear the water under the little walkway.' : 'The float is a lock with a good reason. A blocked bypass cannot take a channelful of water.', 'My first diagram had both arrows pointing toward lunch. Minda said it was clear, but not useful.', p.bellRecovered ? 'That empty paddle space is the best thing I have seen all afternoon. Nothing should be rattling there.' : 'I can watch the gauge while you look at the problem. We do not have to crowd the same patch of bank.', 'Water keeps following its slope even when you point at it very firmly. I have tried.'],
  };
  const line: DialogueLine = { speaker: person.name, text: variants[id][ambientIndex(id, visit)], emotion: 'warm', gesture: id === 'sela' || id === 'pilo' ? 'work' : 'talk' };
  return visit ? [line] : [
    { speaker: person.name, text: `A visitor! I am ${person.name}. ${id === 'nilo' ? 'If you need a light, ask. No traveler should have to pretend they can see in the dark.' : id === 'sela' ? 'Mind that loose strip. My work has been trying to follow people home all afternoon.' : id === 'doro' ? 'A little space around the seed trays, please. They are small now; they have plans.' : 'I am helping Minda. Mostly by keeping my feet on the bank and my eyes on the gauge.'}`, emotion: 'warm' },
    { speaker: 'Rae Jacob', text: id === 'doro' ? 'I will watch my feet. I am practicing.' : 'Hello, po. It is good to meet you.', emotion: 'warm' }, line,
  ];
}
