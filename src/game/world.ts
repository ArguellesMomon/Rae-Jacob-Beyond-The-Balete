import { chapterTwoMap } from './chapterTwoWorld.ts';
import type { Interaction, MapId, Progress, Rect } from './model.ts';
import { CLEARING_START, EMPTY_PROGRESS, GROVE_START, START, WATERWORKS_START } from './model.ts';
import { RESIDENTS, residentsIn } from './residents.ts';

const residentInteractions = (map: MapId): Interaction[] => residentsIn(map).map(id => ({ id, name: RESIDENTS[id].name, action: 'Talk', point: { x: RESIDENTS[id].x, y: RESIDENTS[id].y } }));
const residentColliders = (map: MapId): Rect[] => residentsIn(map).map(id => ({ x: RESIDENTS[id].x - 4, y: RESIDENTS[id].y - 14, width: 8, height: 6 }));

export const WORLD = { width: 640, height: 448 };

// All coordinates are source pixels. Sprites are anchored at their feet.
export const COLLIDERS: readonly Rect[] = [
  { x: 69, y: 85, width: 242, height: 86 }, // House walls; porch is walkable.
  { x: 80, y: 188, width: 100, height: 6 },
  { x: 226, y: 188, width: 70, height: 6 },
  { x: 197, y: 179, width: 11, height: 9 }, // Lola.
  { x: 247, y: 171, width: 31, height: 13 }, // Merienda table.
  { x: 100, y: 311, width: 38, height: 13 }, // Basin.
  { x: 352, y: 234, width: 5, height: 16 },
  { x: 460, y: 234, width: 5, height: 16 },
  { x: 406, y: 114, width: 13, height: 17 }, // Calamansi trunk.
  { x: 533, y: 108, width: 29, height: 56 }, // Balete trunk.
  { x: 347, y: 163, width: 148, height: 6 }, // Opening at x495–577.
  { x: 578, y: 163, width: 42, height: 6 },
  { x: 24, y: 62, width: 5, height: 333 },
  { x: 26, y: 391, width: 226, height: 6 },
  { x: 320, y: 391, width: 296, height: 6 },
  { x: 615, y: 169, width: 5, height: 224 },
  { x: 57, y: 204, width: 15, height: 12 },
  { x: 80, y: 209, width: 15, height: 12 },
  { x: 301, y: 198, width: 15, height: 12 },
  { x: 320, y: 207, width: 14, height: 12 },
  { x: 64, y: 285, width: 17, height: 14 },
  { x: 172, y: 327, width: 40, height: 12 }, // Bench.
  { x: 65, y: 346, width: 72, height: 24 }, // Raised kitchen herb bed.
  { x: 331, y: 302, width: 17, height: 11 }, // Covered rain jar.
];

export const INTERACTIONS: readonly Interaction[] = [
  { id: 'lola', name: 'Lola Selya', action: 'Talk', point: { x: 203, y: 194 } },
  { id: 'merienda', name: "Lola's merienda", action: 'Inspect', point: { x: 262, y: 191 }, note: 'Merienda is waiting on the porch. So is Lola.' },
  { id: 'clothesline', name: 'Clothesline', action: 'Inspect', point: { x: 410, y: 248 }, note: 'The shirts point toward the old tree. Excellent wind report.' },
  { id: 'basin', name: 'Washing basin', action: 'Inspect', point: { x: 120, y: 330 }, note: 'Definitely not a swimming pool. Lola was very clear.' },
  { id: 'balete', name: 'Old balete', action: 'Inspect', point: { x: 548, y: 182 } },
  { id: 'yardCat', name: 'Muning in the shade', action: 'Inspect', point: { x: 118, y: 194 }, note: 'Muning likes slow hands and the cool porch. Some friends need no words.' },
  { id: 'calamansi', name: "Lola's calamansi", action: 'Inspect', point: { x: 412, y: 147 }, note: 'Lola planted this tree when she was small. A little shade can hold a long family story.' },
  { id: 'herbBed', name: 'Kitchen garden', action: 'Inspect', point: { x: 104, y: 382 }, note: 'Check the soil before watering. Care starts by noticing what is needed.' },
  { id: 'sungka', name: "Lolo's sungka board", action: 'Use', point: { x: 192, y: 351 }, note: 'One shell at a time. Lolo made the old board; Lola still knows a patient move.' },
  { id: 'rainJar', name: 'Covered rain jar', action: 'Inspect', point: { x: 339, y: 326 }, note: 'The jar catches roof water for the plants. Leave the cover resting firmly.' },
];

export const FLOWERS = [
  { x: 64, y: 213, color: '#df896c' }, { x: 87, y: 218, color: '#eed09a' },
  { x: 307, y: 207, color: '#de7869' }, { x: 326, y: 216, color: '#f0c36e' },
  { x: 71, y: 295, color: '#df896c' },
] as const;

export const CLEARING_WORLD = { width: 576, height: 448 };
export const CLEARING_COLLIDERS: readonly Rect[] = [
  ...residentColliders('clearing'),
  { x: 338, y: 183, width: 20, height: 6 },
  { x: 267, y: 195, width: 23, height: 6 },
  { x: 141, y: 180, width: 24, height: 3 },
  { x: 30, y: 38, width: 225, height: 72 }, // The upper root ridge.
  { x: 80, y: 129, width: 46, height: 32 },
  { x: 153, y: 107, width: 46, height: 34 },
  { x: 224, y: 140, width: 43, height: 33 },
  { x: 33, y: 301, width: 35, height: 41 }, // Closed arrival hollow.
  { x: 365, y: 296, width: 5, height: 35 }, // Bell arch posts; walk between them.
  { x: 395, y: 296, width: 5, height: 35 },
  { x: 423, y: 208, width: 38, height: 13 }, // Minda's workbench.
  { x: 404, y: 218, width: 9, height: 9 },
  { x: 486, y: 174, width: 32, height: 216 }, // Flooded channel.
  { x: 461, y: 278, width: 25, height: 7 }, // Work barrier.
  { x: 43, y: 215, width: 20, height: 49 },
  { x: 320, y: 112, width: 21, height: 42 },
  { x: 275, y: 357, width: 71, height: 21 }, // Root bench.
  { x: 145, y: 295, width: 19, height: 11 }, // Trickle: cross on the plank bridge only.
  { x: 216, y: 295, width: 23, height: 11 },
];
export const CLEARING_INTERACTIONS: readonly Interaction[] = [
  ...residentInteractions('clearing'),
  { id: 'lampShelf', name: 'Spare lamp shelf', action: 'Inspect', point: { x: 348, y: 202 }, note: 'A small lamp waits for the next traveler. Nilo leaves a dry wick beside it.' },
  { id: 'messageBoard', name: 'Neighbor noticeboard', action: 'Inspect', point: { x: 278, y: 207 }, note: 'Requests, spare beds and borrowed tools. A village is held together by small answers.' },
  { id: 'dryingRack', name: 'Tiny drying rack', action: 'Inspect', point: { x: 153, y: 188 }, note: 'A patched sleeve and tiny slippers. Somebody will need them tomorrow.' },
  { id: 'tala', name: 'Tala', action: 'Talk', point: { x: 188, y: 286 } },
  { id: 'minda', name: 'Minda · Waterkeeper', action: 'Talk', point: { x: 408, y: 236 } },
  { id: 'sealedRoots', name: 'The closed hollow', action: 'Inspect', point: { x: 65, y: 349 }, note: 'The opening is gone. Solid roots where the way home should be.' },
  { id: 'rootHomes', name: 'Homes in the roots', action: 'Inspect', point: { x: 105, y: 177 }, note: 'Tiny homes, tiny laundry, tiny roads. Watch where you put your feet.' },
  { id: 'bellArch', name: 'Empty bell arch', action: 'Inspect', point: { x: 382, y: 337 }, note: 'A snapped cord and fresh scratches toward the channel. Something used to hang here.' },
  { id: 'waterPath', name: 'Flooded work path', action: 'Inspect', point: { x: 470, y: 301 }, note: 'The maintenance route is closed. Water is still rushing through the damaged crossing.' },
  { id: 'grovePath', name: 'Path to the old grove', action: 'Inspect', point: { x: 292, y: 106 } },
];

export const GROVE_WORLD = { width: 480, height: 512 };
export const MANG_POINT = { x: 232, y: 302 };
export const GROVE_COLLIDERS: readonly Rect[] = [
  ...residentColliders('grove'),
  { x: 105, y: 405, width: 32, height: 4 },
  { x: 336, y: 285, width: 20, height: 3 },
  { x: 298, y: 418, width: 28, height: 4 },
  { x: 168, y: 74, width: 136, height: 195 }, // The giant balete's trunk and perch.
  { x: 149, y: 249, width: 36, height: 29 },
  { x: 293, y: 252, width: 39, height: 22 },
  { x: 323, y: 315, width: 6, height: 18 }, // Bamboo tube's maintenance stand.
  { x: 90, y: 343, width: 22, height: 22 }, // Old marker base.
  { x: 369, y: 187, width: 22, height: 56 },
  { x: 53, y: 193, width: 26, height: 63 },
  { x: 148, y: 391, width: 39, height: 15 }, // Fallen limb.
];
export const GROVE_INTERACTIONS: readonly Interaction[] = [
  ...residentInteractions('grove'),
  { id: 'seedTray', name: "Doro's seed trays", action: 'Inspect', point: { x: 122, y: 422 }, note: 'Fallen seeds rest in shallow trays. Doro leaves room for the ones that surprise him.' },
  { id: 'rainCup', name: 'Rain-catching leaf cup', action: 'Inspect', point: { x: 345, y: 293 }, note: 'A folded leaf catches rain for the little roots. Mang can lower it without crushing it.' },
  { id: 'listeningStone', name: 'Mossy listening stone', action: 'Inspect', point: { x: 308, y: 433 }, note: 'A quiet place to hear birds, water, and the space between them.' },
  { id: 'tala', name: 'Tala', action: 'Talk', point: { x: 206, y: 448 } },
  { id: 'mang', name: 'Mang Uban', action: 'Talk', point: MANG_POINT },
  { id: 'speakingTube', name: 'Bamboo speaking tube', action: 'Inspect', point: { x: 331, y: 342 }, note: 'The ringing is strongest inside the bamboo. Its line runs east, downhill toward the waterworks.' },
  { id: 'oldMarker', name: 'Weathered path marker', action: 'Inspect', point: { x: 102, y: 377 }, note: 'An old crossing marker with a branching tree carved into it. Some paths connect to the Heart Balete.' },
  { id: 'rootFootprints', name: 'Dust beneath the roots', action: 'Inspect', point: { x: 273, y: 292 }, note: 'Fresh dust trembles loose when the ringing starts. Mang Uban is sitting still.' },
  { id: 'clearingPath', name: 'Return to Lantern Clearing', action: 'Inspect', point: { x: 224, y: 471 } },
  { id: 'waterworksPath', name: 'Trail to Rootwater Works', action: 'Inspect', point: { x: 416, y: 373 } },
];

export const WATERWORKS_WORLD = { width: 704, height: 480 };
export const WATERWORKS_COLLIDERS: readonly Rect[] = [
  ...residentColliders('waterworks'),
  { x: 271, y: 391, width: 32, height: 3 },
  { x: 253, y: 126, width: 12, height: 5 },
  { x: 161, y: 373, width: 3, height: 7 },
  { x: 208, y: 96, width: 204, height: 30 }, // Headwater and splitter.
  { x: 208, y: 126, width: 32, height: 282 }, // Bypass, including its dry bed.
  { x: 240, y: 442, width: 172, height: 38 }, // Downstream water beyond the small western walkway.
  { x: 412, y: 0, width: 40, height: 365 }, // Wheel channel: cross only on the bridge.
  { x: 412, y: 389, width: 40, height: 91 },
  { x: 303, y: 150, width: 38, height: 34 }, // Diagram stand.
  { x: 316, y: 195, width: 9, height: 11 }, // Lever plinth.
  { x: 553, y: 156, width: 91, height: 34 }, // Severed side passage; onward road stays open.
  { x: 68, y: 170, width: 31, height: 61 },
  { x: 609, y: 348, width: 21, height: 48 },
];
export const WATERWORKS_INTERACTIONS: readonly Interaction[] = [
  ...residentInteractions('waterworks'),
  { id: 'toolRoll', name: 'Apprentice tool roll', action: 'Inspect', point: { x: 286, y: 404 }, note: 'Every tool has a stitched outline. An empty space is easier to notice than a missing tool.' },
  { id: 'floatGauge', name: 'Marked float gauge', action: 'Inspect', point: { x: 262, y: 139 }, note: 'Water lifts a float against three marks. A steady level matters more than a loud splash.' },
  { id: 'reedChimes', name: 'Reed wind chimes', action: 'Inspect', point: { x: 169, y: 390 }, note: 'The reeds speak to the breeze; the gauge speaks for the water. Pilo checks both.' },
  { id: 'tala', name: 'Tala', action: 'Talk', point: { x: 100, y: 344 } },
  { id: 'splitter', name: 'Waterkeeper’s diagram', action: 'Inspect', point: { x: 322, y: 184 }, note: 'East powers the wheel. West bypasses it and rejoins downstream, away from the homes.' },
  { id: 'branch', name: 'Branch across the bypass', action: 'Push', point: { x: 260, y: 281 }, note: 'A shallow recess beside the channel has room for the fallen branch. One push will clear the bypass.' },
  { id: 'lever', name: 'Splitter lever', action: 'Use', point: { x: 322, y: 219 }, note: 'The safety float prevents diversion into a blocked bypass. Clear it before changing the water’s route.' },
  { id: 'wheelBell', name: 'Bell in the wheel', action: 'Inspect', point: { x: 385, y: 322 }, note: 'The lost waybell is caught beneath a paddle. Its raised handle is below Rae’s reach. The grating is safe when the wheel stops.' },
  { id: 'worksTube', name: 'Waterkeeper’s speaking tube', action: 'Talk', point: { x: 359, y: 277 }, note: 'Minda can hear us through the bamboo. Restore the flow after freeing the bell so the wheel can drain the approach.' },
  { id: 'groveReturn', name: 'Return to the grove', action: 'Travel', point: { x: 84, y: 344 } },
  { id: 'lowTrail', name: 'Low trail to Lantern Clearing', action: 'Inspect', point: { x: 117, y: 417 } },
  { id: 'footbridge', name: 'Bamboo Crossing', action: 'Inspect', point: { x: 389, y: 378 } },
  { id: 'bambooDeparture', name: 'Road into the bamboo', action: 'Travel', point: { x: 654, y: 314 } },
  { id: 'rootSeal', name: 'A mark on the severed root', action: 'Inspect', point: { x: 584, y: 214 }, note: 'The side passage was intact on Tala’s earlier sketch. Its root has a smooth cut and a pale circular seal. The bamboo road is still open.' },
];

export function getMap(id: MapId, progress: Progress = EMPTY_PROGRESS) {
  if (id === 'bamboo' || id === 'turning') return chapterTwoMap(id, progress);
  if (id === 'yard') return { ...WORLD, name: "Lola's Yard", spawn: START, colliders: COLLIDERS, interactions: INTERACTIONS };
  if (id === 'clearing') {
    const colliders = CLEARING_COLLIDERS.filter(r => !(progress.waterRestored && r.x === 461) && !(progress.bellReturned && r.x === 404));
    if (progress.bellReturned) colliders.push({ x: 407, y: 328, width: 9, height: 9 });
    const interactions: Interaction[] = CLEARING_INTERACTIONS.map(item => {
      if (item.id === 'minda' && progress.bellReturned) return { ...item, point: { x: 411, y: 345 } };
      if (item.id === 'bellArch' && progress.bellReturned) return { ...item, name: progress.bellHung ? progress.bellRung ? 'Waybell · Bamboo Crossing' : 'Rehung waybell' : 'Rehang the waybell', action: progress.bellHung ? progress.bellRung ? 'Inspect' : 'Ring' : 'Use', note: progress.bellRung ? 'The waybell has its name back: Bamboo Crossing. The path lamps are steady.' : 'Minda has a new cord ready at the arch. Hang the bell, then ring it once to restore the crossing’s name.' };
      if (item.id === 'waterPath' && progress.waterRestored) return { ...item, name: 'Open maintenance trail', action: 'Travel', note: 'The wheel is turning smoothly. The approach has drained and the maintenance trail is open.' };
      return item;
    });
    return { ...CLEARING_WORLD, name: 'Lantern Clearing', spawn: CLEARING_START, colliders, interactions };
  }
  if (id === 'waterworks') {
    const interactions: Interaction[] = WATERWORKS_INTERACTIONS.filter(item => item.id !== 'bambooDeparture' || progress.chapterComplete).map(item => {
      if (item.id === 'branch' && progress.branchMoved) return { ...item, name: 'Cleared bypass', action: 'Inspect', note: 'The branch is safely tucked into the recess. The bypass has room to carry the wheel’s water.' };
      if (item.id === 'wheelBell') return { ...item, name: progress.bellRecovered ? 'Freed waterwheel' : 'Bell in the wheel', action: progress.flowDiverted && !progress.bellRecovered ? 'Take' : 'Inspect', note: progress.bellRecovered ? 'Rae looped spare kite string around the bell’s handle and pulled it free. The string is still in his pocket.' : item.note };
      if (item.id === 'lowTrail' && progress.waterRestored) return { ...item, action: 'Travel' };
      if (item.id === 'footbridge' && !progress.bellRung) return { ...item, name: 'Nameless footbridge' };
      return item;
    });
    return { ...WATERWORKS_WORLD, name: 'Rootwater Works', spawn: WATERWORKS_START, colliders: [...WATERWORKS_COLLIDERS, ...(!progress.bellRung ? [{ x: 412, y: 365, width: 40, height: 24 }] : [])], interactions };
  }
  return { ...GROVE_WORLD, name: 'Old Balete Grove', spawn: GROVE_START, colliders: GROVE_COLLIDERS, interactions: GROVE_INTERACTIONS };
}
