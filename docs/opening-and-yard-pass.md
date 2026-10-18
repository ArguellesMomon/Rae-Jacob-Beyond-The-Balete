# Chapter 1 — Opening, controls and yard pass

Implemented 2026-10-17. This extends the completed chapter rather than adding Chapter 2.

## Controls and sprites

The movement pad and thumb cap use stepped pixel corners, cardinal marks and a square center. Title/menu, action and header buttons use the same measured SVG frame. Settings and notebook tabs use square corners. The joystick still sends continuous movement; its decorative edges do not reduce the rectangular touch target or change the dead zone and walk/jog response.

Rae and Tala's side distortion came from drawing a profile over an existing front face, followed by another face outside the head's sway transform. The side view now draws one coherent profile, with one visible eye, nose, mouth and ear inside the same head group. Left-facing poses mirror the whole drawing. This shared correction also applies to Lola and Minda.

Review the actual art generators: [controls](../artifacts/pixel-controls-preview.png), [animated Rae/Tala profiles](../artifacts/profile-walk-preview.gif), [updated yard](../artifacts/lolas-yard-art-preview.png). These are source-art renders rather than running UI screenshots.

## A slower beginning

The old four-line exchange at the tree is now a 29-line scene. The unknown voice is displayed as **???**. It explains that Silong's damaged local crossing, its missing waybell and the water surge have allowed a passage to reach into the wrong place. Rae was close enough to hear it while fetching his kite; the caller did not select him by name or know that a person could fall through. The voice warns him away, tries to guide him when the opening moves, and admits it cannot hold the passage.

This explains the immediate accident while leaving the voice's identity and the cause of the surge unresolved. These crossing rules are original fantasy worldbuilding, not a documented Philippine belief. Mang later qualifies what he can infer from Rae's account. The ending voice sounds different; the opening caller is not silently identified as Bagtas.

After the exchange finishes, a 9.6-second skippable sequence shows the balete close-up, fades the yard completely to black, holds the darkness, reveals the root journey, and fades through black into the clearing. Arrival expands to 17 lines so Rae can check himself, call for Lola, understand that the opening has closed, and decide to seek help. All dialogue remains player-paced.

Lola, Tala, Minda and Mang receive longer introductions and personal topics. Minda's bell return and restored-state conversation, Mang's repeat visits and the root-seal ending also gain detail. Required instructions still follow current quest progress; optional personal stories do not gate repairs or travel. The [generated dialogue review copy](chapter-01-dialogue-review.md) lets the author review the actual playable script.

## Lola's Yard

The familiar warm yard gains a worn stepping-stone path, a woven porch mat, basket, hanging fern, chimes, watering can, detailed sungka board, herb labels, tree mulch and covered earthen rain jar. In the scene, butterflies drift, Mingming moves her tail, and water catches the light. The center stays open for play and the new jar has a matching foot collider.

Five optional interactions join the original five:

| Place or object | Action and story purpose |
| --- | --- |
| Mingming on the porch | Rae offers a hand gently and learns to notice a small friend's signals. Repeat inspection acknowledges the sleeping cat. |
| Calamansi tree | Lola recalls a seedling from her mother; Rae considers caring for his own tree beyond its exciting first day. |
| Kitchen garden | Rae checks the soil and moves a loose twig without trampling new growth. The twig appears beside the bed after completion. |
| Lolo's sungka board | Rae handles a shell and leaves the family game waiting for his return. This is an inspection/story interaction, not a separate sungka minigame. |
| Covered rain jar | Rae checks the cover and notices how roof water is kept for the plants. |

The original merienda, basin and clothesline conversations are expanded, including an early clue that the tree's breeze does not match the laundry. Discoveries each record one notebook entry and survive save migration. None is required before the crossing.

## Verification

58 automated tests pass, including nine mounted React-controller integration checks. Coverage includes all ten reachable yard targets, new discovery persistence without quest mutation, a full blackout before travel, the longer opening staying in the yard until its final line, automatic cinematic completion, safe background recovery during the blackout, and mirrored readable side profiles across all six strides. TypeScript and Android/iOS/web production exports pass. The restarted local web bundle returns HTTP 200 and contains the new opening, frames, yard discoveries and blackout choreography.

Phone review still needs to cover joystick appearance over the map, side-view motion at normal scale, thumb reach, dialogue scrolling and the emotional timing of the opening. Use [the device check](chapter-01-device-check.md). Continue preserves an existing journey. Reviewing the entire opening requires a fresh afternoon, which replaces that journey after the game's confirmation.
