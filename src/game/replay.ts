import { RAINLIT_SPAWNS } from './rainlitWorld.ts';
import { freshRainlit } from './model.ts';
import type { SaveData } from './model.ts';
import { EMPTY_PROGRESS, START, CLEARING_START, GROVE_START, WATERWORKS_START, BAMBOO_START, TURNING_START, freshChapterTwo } from './model.ts';
export type SaveSlot = 'journey' | 'replay';
export const JOURNEY_KEY = '@rae-jacob/adventure/v2';
export const REPLAY_KEY = '@rae-jacob/chapter-1-replay/v1';
export const REPLAY_SCENES = [
  { id: 'rainroad', title: 'Chapter 2: The rainlit road', detail: 'Continue beyond Bagtas’s checked route.' },
  { id: 'springMeeting', title: 'Chapter 2: The Diwata ng Bukal', detail: 'Meet Mayumi for the first time.' },
  { id: 'springPuzzle', title: 'Chapter 2: A little room for water', detail: 'Survey, support, untangle and settle together.' },
  { id: 'springEnding', title: 'Chapter 2: The spring remembers', detail: 'Rest after the repair and witness a new clue.' },
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
  if (scene === 'rainroad' || scene === 'springMeeting' || scene === 'springPuzzle' || scene === 'springEnding') {
    const ready = replayCheckpoint('bambooDebrief');
    ready.progress.chapterTwo.debriefSeen = true;
    ready.progress.rainlit = { ...freshRainlit(), visited: true };
    ready.mapId = 'rainroad'; ready.player = { ...RAINLIT_SPAWNS.rainroad };
    if (scene === 'rainroad') return ready;
    Object.assign(ready.progress.rainlit, { roadSeen: true, hamletSeen: true, metLuning: true });
    ready.mapId = 'spring'; ready.player = { ...RAINLIT_SPAWNS.spring };
    if (scene === 'springMeeting') return ready;
    Object.assign(ready.progress.rainlit, { springSeen: true, metMayumi: true });
    ready.player = { ...RAINLIT_SPAWNS.spring, x: 298, y: 285, facing: 'up' };
    if (scene === 'springPuzzle') return ready;
    Object.assign(ready.progress.rainlit, { channelRead: true, rootBraced: true, basketFreed: true, restored: true });
    ready.player = { ...RAINLIT_SPAWNS.spring, x: 282, y: 283, facing: 'up' }; return ready;
  }
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
  const p = { ...EMPTY_PROGRESS, rainlit: freshRainlit(), chapterTwo: freshChapterTwo(), discoveries: [], talaTopics: [], mangTopics: [], lolaTopics: [], mindaTopics: [], residentChats: {}, storyChoices: {} };
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
