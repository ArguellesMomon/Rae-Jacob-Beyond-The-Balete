import type { InteractionId } from './model.ts';
type Topic = { key: string; label: string; id: InteractionId; group: 'road' | 'story' };
export const CONVERSATION_TOPICS: Record<'lola' | 'tala' | 'minda' | 'uban' | 'bagtas', readonly Topic[]> = {
  bagtas: [
    { key: 'paths', id: 'bagtasPaths', label: 'How do you check a changing path?', group: 'road' },
    { key: 'stories', id: 'bagtasStories', label: 'Lola told stories about tikbalang.', group: 'story' },
    { key: 'seals', id: 'bagtasSeals', label: 'Have you seen that pale ring?', group: 'story' },
  ],
  lola: [
    { key: 'stories', id: 'lolaStories', label: 'Why say “tabi-tabi po”?', group: 'story' },
    { key: 'string', id: 'lolaString', label: 'That knot you taught me…', group: 'story' },
    { key: 'waiting', id: 'lolaWaiting', label: 'Were you ever late coming home?', group: 'story' },
  ],
  tala: [
    { key: 'where', id: 'talaWhere', label: 'Where are we?', group: 'road' },
    { key: 'home', id: 'talaHome', label: 'How do we look for home?', group: 'road' },
    { key: 'ringing', id: 'talaRinging', label: 'About that ringing…', group: 'road' },
    { key: 'maps', id: 'talaMaps', label: 'Why “almost” a mapmaker?', group: 'story' },
    { key: 'courtesy', id: 'talaCourtesy', label: 'Is “tabi-tabi po” enough?', group: 'story' },
    { key: 'journey', id: 'talaJourney', label: 'Do you ever want to leave home?', group: 'story' },
  ],
  minda: [
    { key: 'water', id: 'mindaWater', label: 'How do you listen to the water?', group: 'story' },
    { key: 'neighbors', id: 'mindaNeighbors', label: 'You haven’t rested, have you?', group: 'story' },
    { key: 'waybell', id: 'mindaWaybell', label: 'Who taught you about the waybell?', group: 'story' },
  ],
  uban: [
    { key: 'home', id: 'mangHome', label: 'What is the Heart Balete?', group: 'road' },
    { key: 'ringing', id: 'mangRinging', label: 'When did the ringing begin?', group: 'road' },
    { key: 'forest', id: 'mangForest', label: 'What is happening to the paths?', group: 'road' },
    { key: 'kapre', id: 'mangKapre', label: 'Lola told me stories about kapre.', group: 'story' },
    { key: 'memory', id: 'mangMemory', label: 'Were you here before the houses?', group: 'story' },
    { key: 'bagtas', id: 'mangBagtas', label: 'What kind of person is Bagtas?', group: 'story' },
  ],
};
