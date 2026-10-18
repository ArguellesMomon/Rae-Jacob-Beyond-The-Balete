import type { Emotion } from '../game/model.ts';
import { duwendePortraitSvg, duwendeSpriteSvg } from './duwendeArt.ts';
import { mayumiPortraitSvg, mayumiSpriteSvg } from './mayumiArt.ts';
export type SpringCharacter = 'mayumi' | 'luning';
export function springSpriteSvg(id: SpringCharacter, blink = false, mouth = 0, emotion: Emotion = 'neutral', frame = 0) {
  return id === 'luning' ? duwendeSpriteSvg(id, 'down', frame, 'work', emotion, blink, mouth) : mayumiSpriteSvg(blink, mouth, emotion, frame);
}
export function springPortraitSvg(id: SpringCharacter, emotion: Emotion = 'neutral', blink = false, mouth = 0) {
  return id === 'luning' ? duwendePortraitSvg(id, emotion, blink, mouth) : mayumiPortraitSvg(emotion, blink, mouth);
}
