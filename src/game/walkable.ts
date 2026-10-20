import type { MapId, Point } from './model.ts';
import { MAZE_SIZE } from './mazeTrials.ts';

export type GroundPolygon = readonly (readonly [number, number])[];
const box = (x: number, y: number, width: number, height: number): GroundPolygon => [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];

// Ground-plane silhouettes, in native map pixels. Crowns, roofs, cliffs and distant
// scenery are pictures above/beyond these surfaces, never additional walking space.
// Adjacent polygons form a UNION: feet can straddle a path/bridge seam safely.
export const MAP_GROUND: Record<MapId, { width: number; height: number; regions: readonly GroundPolygon[] }> = {
  yard: { width: 640, height: 448, regions: [
    [[40, 205], [80, 194], [300, 194], [331, 204], [342, 177], [490, 177], [504, 168], [578, 168], [604, 186], [606, 300], [572, 367], [490, 390], [320, 390], [252, 390], [91, 384], [40, 337]],
    box(74, 171, 228, 23), // Porch floor; the existing railings leave only its stairs open.
    box(177, 185, 49, 36),
    [[337, 148], [380, 134], [440, 134], [485, 147], [516, 148], [578, 148], [580, 185], [495, 185], [495, 164], [337, 164]], // Orchard behind the fence.
    box(256, 386, 64, 40),
  ] },
  clearing: { width: 576, height: 448, regions: [
    [[65, 237], [108, 223], [157, 218], [175, 206], [240, 209], [282, 194], [315, 197], [347, 205], [396, 205], [447, 218], [479, 253], [481, 330], [460, 381], [412, 403], [351, 399], [318, 388], [259, 389], [213, 402], [148, 391], [92, 370], [64, 352], [66, 327], [62, 282]],
    [[75, 169], [129, 162], [154, 147], [196, 146], [219, 172], [267, 176], [277, 200], [285, 213], [262, 236], [165, 231], [125, 213], [77, 211]],
    [[278, 89], [309, 87], [325, 122], [324, 153], [344, 187], [331, 221], [288, 221], [275, 180], [278, 139]],
    box(164, 293, 52, 17), // Tiny plank bridge; its water banks are separate colliders.
  ] },
  grove: { width: 480, height: 512, regions: [
    [[85, 312], [125, 292], [171, 278], [210, 278], [258, 277], [295, 280], [332, 283], [365, 290], [386, 315], [405, 333], [455, 343], [465, 372], [449, 393], [408, 399], [379, 431], [336, 447], [279, 460], [253, 481], [204, 481], [185, 455], [136, 443], [100, 426], [77, 389], [77, 348]],
  ] },
  waterworks: { width: 704, height: 480, regions: [
    [[58, 326], [87, 312], [119, 326], [145, 348], [160, 360], [172, 388], [197, 403], [207, 410], [207, 439], [152, 438], [114, 430], [83, 408], [64, 374], [57, 347]],
    box(195, 412, 59, 26), // Western footwalk is the sole bypass crossing.
    [[248, 128], [282, 129], [303, 139], [344, 139], [360, 164], [374, 209], [381, 247], [400, 268], [407, 284], [407, 363], [411, 363], [411, 396], [386, 415], [338, 428], [290, 437], [247, 438], [245, 405], [249, 383], [254, 351], [258, 317], [247, 288], [247, 240], [254, 207], [249, 177]],
    box(376, 284, 32, 51), // Safe grating beside the wheel.
    box(382, 365, 96, 28), // Main bridge planks, below the top railing.
    [[458, 367], [489, 354], [515, 339], [533, 309], [545, 277], [542, 251], [540, 232], [552, 206], [567, 195], [608, 195], [633, 213], [647, 237], [651, 265], [675, 295], [675, 326], [647, 343], [620, 338], [600, 331], [588, 350], [586, 374], [602, 401], [582, 415], [552, 401], [525, 400], [493, 414], [461, 414]],
  ] },
  bamboo: { width: 640, height: 480, regions: [
    [[55, 370], [115, 363], [119, 322], [207, 315], [222, 282], [300, 275], [364, 271], [376, 243], [421, 233], [488, 234], [524, 223], [589, 220], [594, 251], [573, 272], [518, 277], [491, 283], [420, 282], [419, 319], [378, 328], [308, 326], [238, 333], [226, 359], [178, 368], [148, 379], [144, 447], [60, 447]],
    [[299, 275], [318, 248], [345, 226], [369, 201], [377, 174], [417, 174], [449, 177], [479, 192], [502, 214], [500, 242], [465, 264], [426, 274], [377, 289], [335, 301]],
    [[420, 262], [500, 264], [510, 288], [480, 306], [427, 310], [410, 293]],
    box(529, 209, 60, 65), // Ground under the arch, not its raised lintel or nameplate.
  ] },
  rainroad: { width: 640, height: 480, regions: [
    [[50, 331], [95, 305], [135, 275], [173, 245], [218, 224], [260, 213], [298, 219], [341, 229], [390, 207], [430, 183], [465, 166], [504, 167], [543, 178], [593, 184], [610, 195], [610, 223], [558, 246], [509, 265], [461, 279], [410, 291], [362, 300], [315, 289], [278, 278], [244, 282], [204, 300], [164, 322], [128, 352], [110, 370], [75, 372], [49, 355]],
  ] },
  hamlet: { width: 640, height: 480, regions: [
    [[100, 330], [104, 297], [145, 268], [210, 245], [205, 222], [260, 213], [295, 207], [380, 207], [420, 215], [450, 225], [463, 242], [440, 260], [390, 260], [340, 267], [300, 284], [282, 307], [264, 338], [230, 372], [198, 383], [165, 364], [122, 353], [100, 338]],
    box(445, 224, 165, 32), // Bridge planks only; the river below is inaccessible.
  ] },
  spring: { width: 640, height: 480, regions: [
    [[60, 355], [80, 305], [135, 287], [185, 272], [205, 247], [195, 217], [220, 203], [260, 213], [300, 228], [360, 228], [430, 222], [500, 215], [551, 219], [560, 242], [540, 270], [500, 296], [460, 319], [418, 326], [382, 324], [360, 347], [388, 372], [438, 400], [475, 424], [464, 450], [408, 440], [370, 414], [333, 389], [288, 362], [245, 336], [220, 319], [180, 315], [150, 338], [121, 366], [106, 405], [75, 428], [50, 410]],
  ] },
  // Procedural maze walls provide the detailed boundary; its world ground is fixed.
  turning: { ...MAZE_SIZE, regions: [box(36, 40, MAZE_SIZE.width - 65, MAZE_SIZE.height - 60)] },
};

type Interval = [number, number];
const rows = new Map<MapId, readonly (readonly Interval[])[]>();
function groundRows(mapId: MapId) {
  const old = rows.get(mapId); if (old) return old;
  const { height, regions } = MAP_GROUND[mapId];
  const compiled: Interval[][] = Array.from({ length: height }, () => []);
  // Compile scan lines once. Runtime checks use six or seven short interval lists,
  // avoiding image decoding, per-frame polygon traversal or large bitmap buffers.
  for (let y = 0; y < height; y++) {
    const intervals: [number, number][] = [];
    for (const polygon of regions) {
      const cuts: number[] = [], scanY = y + .5;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const a = polygon[j], b = polygon[i];
        if ((a[1] > scanY) !== (b[1] > scanY)) cuts.push(a[0] + (scanY - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
      }
      cuts.sort((a, b) => a - b);
      for (let i = 0; i + 1 < cuts.length; i += 2) {
        // Only complete native-pixel cells belong to the supported floor.
        const left = cuts[i], right = cuts[i + 1];
        if (right > left) intervals.push([left, right]);
      }
    }
    intervals.sort((a, b) => a[0] - b[0]);
    for (const interval of intervals) {
      const previous = compiled[y][compiled[y].length - 1];
      if (previous && interval[0] <= previous[1]) previous[1] = Math.max(previous[1], interval[1]);
      else compiled[y].push(interval);
    }
    compiled[y] = compiled[y].map(([left, right]) => [Math.ceil(left), Math.floor(right)]).filter(([left, right]) => right > left) as Interval[];
  }
  rows.set(mapId, compiled); return compiled;
}

/** The WHOLE foot rectangle must be supported, including at concave corners. */
export function supportsFeet(point: Point, mapId: MapId): boolean {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return false;
  const { width, height } = MAP_GROUND[mapId], left = Math.floor(point.x - 5 + 1e-7), right = Math.ceil(point.x + 5 - 1e-7), top = Math.floor(point.y - 5 + 1e-7), bottom = Math.ceil(point.y + 1 - 1e-7);
  if (left < 0 || top < 0 || right > width || bottom > height) return false;
  const lines = groundRows(mapId);
  for (let y = top; y < bottom; y++) if (!lines[y].some(([start, end]) => start <= left && end >= right)) return false;
  return true;
}
