# Lola, Mayumi, Mingming and codex access

Updated October 18, 2026.

- Lola's sprite and portrait now use a dedicated human character design: silver bun, reading glasses, smile lines, soft cheeks, small rounded ears, sage blouse, light shoulder cloth, floral skirt and worn slippers. Her hands rest gently or wave in welcome. Her normal idle expression is warm. Existing dialogue, portrait expressions, blink, speech and source anchors remain compatible.
- Mayumi, The Diwata ng Bukal, now wears ivory-white fabric with ice-blue pleats and a deeper blue drape, silver-blue leaf clasp, long dark hair with cool highlights and a softly luminous white-blue aura. Her brown skin and springkeeper role remain. This is original costume design, with no claim to a specific community's ritual clothing. Aura and fabric motion freeze under Still; dialogue acting remains available.
- Mingming replaces Muning in the yard interaction, notes and first/repeat dialogue. The saved discovery ID stays `yardCat`, so old saves retain it.
- A separate gold **CODEX** icon opens the creature codex directly. It uses the existing notebook mode, which stops movement and preserves the current conversation. On narrow screens, Notebook, Codex and Pause stay in the primary HUD; history and settings remain in Pause. Touch targets remain 47×47.

## Art and UI files

- `src/art/lolaArt.ts`: detailed animated sprite and matching portrait.
- `src/art/mayumiArt.ts`: sprite, portrait, aura and cloth detail.
- `src/components/CodexButton.tsx`: accessible pixel-style codex button.
- `src/components/Icons.tsx`: distinct codex glyph.

The existing native SVG animation system was extended so expressions, speech, directional faces and save behavior remain coherent. No image-generation assets were needed for this character-rig update.

## Review

Run `node --experimental-strip-types scripts/render-lola-mayumi.ts` for the expression sheet and scene detail crops:

- `artifacts/lola-mayumi-cast-review.png`
- `artifacts/lola-yard-character-review.png`
- `artifacts/mayumi-spring-character-review.png`

Existing character tests cover distinct expressions, blink, speech and canvas bounds. Additional checks cover the aura's motion/Still setting and Mingming's discovery persistence. TypeScript, the complete test suite and all-platform exports are checked. Source-art previews are not device screenshots; no physical Expo Go playthrough is claimed.
