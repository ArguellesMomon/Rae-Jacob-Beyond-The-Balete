import { memo } from 'react';
import { SvgXml } from 'react-native-svg';
import { PROP_SIZES, WORLD_PROPS } from '../art/worldPropArt';
import type { MapId } from '../game/model';

/** Objects absent from the painting but explicitly referenced by the story. */
export const StoryProps = memo(function StoryProps({ mapId }: { mapId: MapId }) {
  const [width, height] = PROP_SIZES[mapId];
  return <SvgXml pointerEvents="none" xml={WORLD_PROPS[mapId]} width={width} height={height} />;
});
