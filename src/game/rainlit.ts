import { freshRainlit } from './model.ts';
import type { InteractionId, MayumiTopic, Progress, RainlitMapId, RainlitProgress } from './model.ts';

export const RAINLIT_MAPS: RainlitMapId[] = ['rainroad', 'hamlet', 'spring'];
export const isRainlitMap = (map: string): map is RainlitMapId => RAINLIT_MAPS.includes(map as RainlitMapId);
export const MAYUMI_TOPICS: Record<MayumiTopic, InteractionId> = { water: 'mayumiWater', stories: 'mayumiStories', roads: 'mayumiRoads' };
const actions = ['rainroadEntry', 'rainroadArrival', 'roadReturn', 'hamletEntry', 'hamletArrival', 'hamletReturn', 'springEntry', 'springArrival', 'springReturn', 'luning', 'mayumi', 'springChannel', 'springBrace', 'springBasket', 'springSettle', 'springSeal', 'springSeed', ...Object.values(MAYUMI_TOPICS)];

/** Normalize checkpoints in order; a stray later flag cannot grant an unseen scene. */
export function parseRainlit(value: unknown, eligible: boolean): RainlitProgress {
  if (!eligible || !value || typeof value !== 'object') return freshRainlit();
  const raw = value as Partial<RainlitProgress>, r = freshRainlit();
  r.visited = raw.visited === true;
  r.roadSeen = r.visited && raw.roadSeen === true;
  r.hamletSeen = r.roadSeen && raw.hamletSeen === true;
  r.metLuning = r.hamletSeen && raw.metLuning === true;
  r.springSeen = r.hamletSeen && raw.springSeen === true;
  r.metMayumi = r.springSeen && raw.metMayumi === true;
  r.channelRead = r.metMayumi && raw.channelRead === true;
  r.rootBraced = r.channelRead && raw.rootBraced === true;
  r.basketFreed = r.rootBraced && raw.basketFreed === true;
  r.restored = r.basketFreed && raw.restored === true;
  r.basketReturned = r.basketFreed && r.metLuning && raw.basketReturned === true;
  r.sealSeen = r.restored && raw.sealSeen === true;
  r.complete = r.sealSeen && raw.complete === true;
  r.homecomingSeen = r.complete && raw.homecomingSeen === true;
  r.seedMemory = r.metMayumi && raw.seedMemory === true;
  r.topics = r.metMayumi && Array.isArray(raw.topics) ? [...new Set(raw.topics.filter(t => ['water', 'stories', 'roads'].includes(t)))] : [];
  return r;
}

export function rainlitAction(p: Progress, id: InteractionId): Progress | null {
  if (!actions.includes(id)) return null;
  if (!p.chapterComplete || !p.chapterTwo.debriefSeen) return p;
  const r = p.rainlit, set = (patch: Partial<RainlitProgress>): Progress => ({ ...p, rainlit: { ...r, ...patch } });
  if (id === 'rainroadArrival') return r.visited ? set({ roadSeen: true }) : p;
  if (id === 'hamletArrival') return r.roadSeen ? set({ hamletSeen: true }) : p;
  if (id === 'springArrival') return r.hamletSeen ? set({ springSeen: true }) : p;
  if (id === 'luning') return r.hamletSeen ? set({ metLuning: true, basketReturned: r.basketReturned || r.basketFreed, homecomingSeen: r.homecomingSeen || r.complete }) : p;
  if (id === 'mayumi') return r.springSeen ? set({ metMayumi: true }) : p;
  if (id === 'springChannel') return r.metMayumi ? set({ channelRead: true }) : p;
  if (id === 'springBrace') return r.channelRead ? set({ rootBraced: true }) : p;
  if (id === 'springBasket') return r.rootBraced ? set({ basketFreed: true }) : p;
  if (id === 'springSettle') return r.basketFreed ? set({ restored: true }) : p;
  if (id === 'springSeal') return r.sealSeen && r.restored ? set({ complete: true }) : p;
  if (id === 'springSeed') return p.ubanGiftReceived && r.metMayumi ? set({ seedMemory: true }) : p;
  const topic = (Object.keys(MAYUMI_TOPICS) as MayumiTopic[]).find(t => MAYUMI_TOPICS[t] === id);
  return topic && r.metMayumi ? set({ topics: [...new Set([...r.topics, topic])] }) : p;
}

export function rainlitObjective(p: Progress, map: string): string {
  const r = p.rainlit;
  if (r.complete) return r.homecomingSeen ? 'Chapter 2 complete. The hamlet has water and a place for Rae. Rest or revisit your friends.' : 'Chapter 2 complete. Return to Luning in Riverside Hamlet. See what the water brought back.';
  if (!r.visited) return 'Take the RAINLIT ROAD sign behind Bagtas’s shelter. Choose Travel.';
  if (map === 'bamboo' || map === 'turning') return 'Return to the RAINLIT ROAD sign behind Bagtas’s shelter.';
  if (!r.hamletSeen) return 'Follow the broad road east to the hamlet.';
  if (!r.metLuning) return 'Speak with Luning beside the basket rack in Riverside Hamlet.';
  if (!r.metMayumi) return map === 'spring' ? 'Ask the woman beside the water who she is.' : 'Cross the hamlet’s plank bridge east. Meet the keeper of the spring.';
  if (map !== 'spring') return r.basketFreed && !r.basketReturned ? 'Return the rescued basket to Luning, then visit Mayumi at the spring.' : 'Return east to the Quiet Spring. Your companions are waiting.';
  if (!r.channelRead) return 'Inspect the narrow rill beside the roots. Let Tala read the waterline.';
  if (!r.rootBraced) return 'Ask Bagtas to brace the fallen root with the forked support.';
  if (!r.basketFreed) return 'Free the trapped basket while the root is safely braced.';
  if (!r.restored) return 'Use the braced root again. Lower it gently onto the stone cradle.';
  if (!r.sealSeen) return 'The water is moving. Speak to Mayumi beside the spring.';
  return 'Inspect the fresh pale seal. Record what you witnessed together.';
}

export function rainlitHint(p: Progress, level: number): string {
  const r = p.rainlit;
  if (r.complete) return 'The chapter has an ending now. You can revisit every map, return the basket to Luning, and ask Mayumi about water, stories and the closed roads.';
  if (!r.visited) return 'In Bamboo Verge, go up behind Bagtas to the gold RAINLIT ROAD sign, just below the shelter. Stand near its arrow and choose Travel.';
  if (!r.metMayumi) return 'Rainlit Road leads east to Riverside Hamlet. Luning stands by the baskets in the middle of the yard. The gold SPRING arrow is on the plank bridge to the right.';
  if (!r.channelRead) return 'At the spring, approach the narrow rill below the pool, to the right of Mayumi. Inspect it. Tala can see where the basket strap is pinching the flow.';
  if (!r.rootBraced) return 'The forked wooden support is beside Bagtas, below the pool. Use it before pulling the basket. He supplies the strength; Tala checks the safe position.';
  if (!r.basketFreed) return level < 2 ? 'Look for the basket wedged at the root’s right end. The support is steady now.' : 'The trapped basket is just right of the support, at the gold diamond beside the rill. Choose Take.';
  if (!r.restored) return 'Go back to the same forked support beside Bagtas. Choose Use to settle the root onto its stone cradle. Watch the water reach the outlet.';
  return r.sealSeen ? 'The root hollow is above and right of the repair. Inspect the pale ring from the dry bank below it.' : 'Mayumi is on the pool’s left bank. Talk to her about the restored water. Take a quiet moment before leaving.';
}
