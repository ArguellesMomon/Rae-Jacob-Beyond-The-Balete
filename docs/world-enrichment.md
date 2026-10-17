# Chapter 1 — Neighbors, keepsake and changing water

Implemented 2026-10-17 for Lantern Clearing, Old Balete Grove and Rootwater Works. The new conversations and discoveries remain optional; they do not add hidden prerequisites to the bell mission or ending.

## A world people live in

| Map | New detail and inspectable objects | New residents |
| --- | --- | --- |
| Lantern Clearing | Spare lamp shelf with wick, neighbor noticeboard, tiny drying rack; woven work mat, baskets, pots and worn path stones | Nilo, a lampkeeper; Sela, a basket mender |
| Old Balete Grove | Doro's seed trays, a rain-catching leaf cup and a mossy listening stone; fungal shelves, lichen and exposed roots | Doro, a seed tender |
| Rootwater Works | Apprentice tool roll, marked float gauge and reed chimes; a workbench, maintenance details and bank stones | Pilo, Minda's apprentice |

All four are original duwende characters with individual pixel sprites, blinking, work gestures, speaking portraits and short introductions. Later interactions draw from four ambient remarks per resident. The order varies through two alternating decks without adjacent repeats, including deck boundaries. Repair-sensitive remarks acknowledge steady lamps, drying homes, restored quiet and the current water state. This is varied authored dialogue, not generated chat.

Only completed visits advance a resident's dialogue counter. Counters survive save/reload. The People page lists neighbors after meeting them. Each of the nine scenery discoveries records a notebook memory once. Tala joins those inspections only after Rae has met her.

The residents, professions, Listening Seed and its magic belong to the game's fictional Silong. They extend the existing [character and folklore approach](characters-and-folklore.md); they are not presented as a documented ritual or a universal description of Philippine communities.

## Mang Uban's thank-you

After restoring and ringing the waybell, return to Mang Uban. Minda mentions his invitation, and the notebook pocket also carries a reminder. A small glint in the grove marks his waiting thank-you. The main route remains available without this visit.

Mang gives Rae a **Listening Seed** in a thumb-sized wooden case. A wider camera frame keeps both travelers and the giant's offering in view; the case lowers toward Rae during the offer. The thirteen-line exchange recognizes Rae's care and willingness to listen before blaming the giant. A short existing reward cue accompanies receiving it.

The seed is warm and dormant. Mang says it may answer in a place where old roots remember. It is deliberately reserved for a later chapter, with no commitment to Chapter 2 and no new power to activate in Chapter 1. Future implementation can check the persistent `ubanGiftReceived` flag. Do not consume or reset this flag when adding its eventual use; model activation separately if the later story needs it.

The item appears under **Notebook → In my pocket → Listening Seed**. Examine it for repeatable dialogue. Granting it is gated by the rung waybell and commits only when the gift conversation finishes. An interrupted unfinished offer can be replayed by talking to Mang again. A received gift is never offered twice. Travelers who solved the works before meeting Mang get his introduction before the gift. Existing completed saves can collect it without restarting Chapter 1.

## Lever feedback and comfort

Actual lever changes start a 3.4-second visual beat: the camera looks toward the splitter, follows the selected channel, then returns to Rae. A soft, decaying tremble marks the gate movement. A pale surge front and directional current marks travel down the west bypass or east wheel channel. A caption identifies the new route.

Open **Sound & comfort → Water scene motion → Steady view** to remove the camera move and shake. The surge and caption remain readable. Gentle camera follow also uses the lower shake amplitude. Blocked attempts and already-repaired lever inspections do not trigger the beat. Loading an old lever state or resuming from pause does not replay it; pausing cancels an active beat. Player input is not locked by this feedback, and the existing lever transaction still commits once before its explanatory dialogue.

## Review and verification

67 tests pass, including twelve mounted controller integration checks. New checks cover reachable resident/prop approaches before and after repair, discovery persistence without quest mutation, varied resident speech, save-safe optional visits, an interrupted gift, completed-save collection, the tube-first introduction path, bounded camera/shake values, a steady camera option and no replay on load/resume. TypeScript and Android/iOS/web production exports pass.

Source-art previews: [clearing](../artifacts/lantern-clearing-art-preview.png), [grove](../artifacts/old-balete-grove-art-preview.png), [works](../artifacts/rootwater-initial-art-preview.png), [residents](../artifacts/residents-preview.png), [gift scene](../artifacts/mang-uban-gift-preview.png), [water animation](../artifacts/water-flow-preview.gif). The water GIF uses the shared source art and camera choreography; it is not a recording of the running UI, and does not include the live follow-camera smoothing or dialogue panel.

Regenerate with `npm.cmd run art:preview` and `npm.cmd run world:preview`. Read the [generated dialogue review](world-dialogue-review.md) and use [the phone check](chapter-01-device-check.md) for actual motion comfort, readability, timing and frame-rate review.
