import { WORKS_LEVER_ARM_CLIP, WORKS_LEVER_BASE_CLIP } from '../game/worksProps.ts';
import type { worksPuzzleItems } from '../game/worksProps.ts';

export function worksPropMarkup(item: ReturnType<typeof worksPuzzleItems>[number], uri: string) {
  const shadow = `<ellipse cx="${item.id === 'lever' ? 320 : item.x + 25}" cy="${item.depth - 1}" rx="${item.id === 'lever' ? 5 : 23}" ry="1.8" fill="#1c3026" opacity=".26"/>`;
  const image = `<image href="${uri}" x="${item.x}" y="${item.y}" width="${item.width}" height="${item.height}" preserveAspectRatio="none"/>`;
  if (item.id === 'branch') return shadow + image;
  return shadow + `<defs><clipPath id="works-lever-base"><path d="${WORKS_LEVER_BASE_CLIP}"/></clipPath><clipPath id="works-lever-arm"><path d="${WORKS_LEVER_ARM_CLIP}"/></clipPath></defs><g clip-path="url(#works-lever-base)">${image}</g><g transform="${item.transform}"><g clip-path="url(#works-lever-arm)">${image}</g></g>`;
}
