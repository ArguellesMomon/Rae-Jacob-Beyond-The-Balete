import { leafCup } from './propMaterials.ts';
import type { MapId } from '../game/model.ts';
export const PROP_SIZES: Record<MapId, readonly [number, number]> = { yard: [640, 448], clearing: [576, 448], grove: [480, 512], waterworks: [704, 480], bamboo: [640, 480], turning: [640, 480], rainroad: [640, 480], hamlet: [640, 480], spring: [640, 480] };
export const propSvg = (body: string, map: MapId) => `<svg xmlns="http://www.w3.org/2000/svg" width="${PROP_SIZES[map][0]}" height="${PROP_SIZES[map][1]}" viewBox="0 0 ${PROP_SIZES[map].join(' ')}" shape-rendering="crispEdges">${body}</svg>`;

// Preserve story referents that are absent from the raster painting. No decorative replacements.
const bodies: Partial<Record<MapId, string>> = {
  rainroad: '<g transform="translate(201 248) scale(.65)">' + leafCup(0, 0, 'story-rain-cup') + '</g>',
  // The root hollow and stone cradle now belong to the generated spring painting.
};
export const WORLD_PROPS = Object.fromEntries(Object.keys(PROP_SIZES).map(map => [map, propSvg(bodies[map as MapId] ?? '', map as MapId)])) as Record<MapId, string>;
export const PROP_MOTION = Object.fromEntries(Object.keys(PROP_SIZES).map(map => [map, [0, 1, 2, 3].map(() => propSvg('', map as MapId))])) as Record<MapId, string[]>;
