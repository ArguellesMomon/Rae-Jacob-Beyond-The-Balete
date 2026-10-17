import type { SaveData } from './model.ts';
import { EMPTY_PROGRESS, START, CLEARING_START, GROVE_START, WATERWORKS_START, BAMBOO_START, TURNING_START, freshChapterTwo } from './model.ts';
export type SaveSlot = 'journey' | 'replay';
export const JOURNEY_KEY = '@rae-jacob/adventure/v2';
export const REPLAY_KEY = '@rae-jacob/chapter-1-replay/v1';
export const REPLAY_SCENES = [
  { id: 'chapter2', title: 'Chapter 2: The bamboo verge', detail: 'Meet Bagtas and begin the next journey.' },
  { id: 'bambooPuzzle', title: 'Chapter 2: The turning paths', detail: 'Check three landmarks through changing forks.' },
  { id: 'bambooDebrief', title: 'Chapter 2: A route verified', detail: 'Bring the checked route back to Bagtas.' },
  { id: 'yard', title: 'A new afternoon', detail: 'Lola, the yard, and the mysterious crossing.' },
  { id: 'arrival', title: 'First steps in Silong', detail: 'Rae arrives and meets Tala.' },
  { id: 'grove', title: 'The watcher in the tree', detail: 'Explore the grove and meet Mang Uban.' },
  { id: 'works', title: 'The waterworks puzzle', detail: 'Inspect, divert, retrieve, and restore.' },
  { id: 'bellReturn', title: 'Bring the bell home', detail: 'Return to Minda and restore the waybell.' },
  { id: 'restored', title: 'A village recovering', detail: 'Visit neighbors and receive Mang Uban’s gift.' },
  { id: 'ending', title: 'Beyond the crossing', detail: 'The sealed side passage and Chapter 1 ending.' },
] as const;
export type ReplayScene = typeof REPLAY_SCENES[number]['id'];
export function replayCheckpoint(scene: ReplayScene): SaveData {
  if (scene === 'chapter2' || scene === 'bambooPuzzle' || scene === 'bambooDebrief') {
    const ready = replayCheckpoint('ending');
    Object.assign(ready.progress, { chapterComplete: true, rootRevealed: true, afterBellSeen: true, chapterTwo: freshChapterTwo() });
    const c = ready.progress.chapterTwo; c.visited = true;
    ready.mapId = 'bamboo'; ready.player = { ...BAMBOO_START };
    if (scene === 'chapter2') return ready;
    Object.assign(c, { arrivalSeen: true, metBagtas: true, turningVisited: true });
    if (scene === 'bambooPuzzle') { ready.mapId = 'turning'; ready.player = { ...TURNING_START }; return ready; }
    Object.assign(c, { turningSeen: true, trailStep: 3, routeVerified: true });
    ready.player = { ...BAMBOO_START, x: 400, y: 265, facing: 'up' }; return ready;
  }
  const p = { ...EMPTY_PROGRESS, chapterTwo: freshChapterTwo(), discoveries: [], talaTopics: [], mangTopics: [], lolaTopics: [], mindaTopics: [], residentChats: {}, storyChoices: {} };
  const result: SaveData = { version: 2, mapId: 'yard', player: { ...START }, progress: p, history: [] };
  if (scene === 'yard') return result;
  Object.assign(p, { talkedToLola: true, foundTree: true, crossed: true });
  result.mapId = 'clearing'; result.player = { ...CLEARING_START };
  if (scene === 'arrival') return result;
  Object.assign(p, { arrivalSeen: true, metTala: true, groveLead: true, visitedGrove: true });
  result.mapId = 'grove'; result.player = { ...GROVE_START };
  if (scene === 'grove') return result;
  Object.assign(p, { groveRevealed: true, metMang: true, waterworksLead: true, heardMinda: true, visitedWaterworks: true });
  result.mapId = 'waterworks'; result.player = { ...WATERWORKS_START };
  if (scene === 'works') return result;
  Object.assign(p, { waterworksSeen: true, branchMoved: true, bellRecovered: true, waterRestored: true });
  result.mapId = 'clearing'; result.player = { ...START, x: 408, y: 239, facing: 'up' };
  if (scene === 'bellReturn') return result;
  Object.assign(p, { bellReturned: true, bellHung: true, bellRung: true });
  result.player = { ...START, x: 382, y: 350, facing: 'up' };
  if (scene === 'restored') return result;
  result.mapId = 'waterworks'; result.player = { ...START, x: 584, y: 214, facing: 'up' };
  return result;
}
