# Duwende neighbors, celebration and creature codex

Implemented October 18, 2026.

## Play and review

Open the running game at **http://localhost:8081**. Field notes → **Creature codex** opens the encyclopedia; **N** opens field notes on web. There is no new save format or collectible requirement. Existing encounters unlock entries automatically. A fresh or earlier replay uses that replay's own encounter progress.

To review the celebration quickly, use **Pause → Revisit a story scene → Bring the bell home**. Return the bell to Minda, hang it at the arch, then ring it. **A village recovering** starts after the bell has rung. Replay uses its existing separate slot.

## Characters and celebration

- Minda, Luning, Nilo, Sela, Doro and Pilo share a new duwende art family: broad stepped ears, compact faces, layered skin and hair highlights, woven cloth, role-specific tools and matching close-up portraits. Tala remains the visual reference. Lola remains human; Mang Uban remains a kapre, Bagtas a tikbalang and Mayumi a diwata.
- Four neighbors gather after the bell is returned. Twelve additional villagers celebrate after it rings, alongside Nilo, Sela and Minda. They clap, dance, wave and carry lanterns. Their static footings and depth order match their painted ground positions. The group persists on return visits and saved-game resumes.
- The existing after-bell scene now acknowledges the crowd before Rae's quieter conversation about home. Minda's bench holds shared leaf packets. The former tiny generic background walker is replaced by the village crowd.
- Still freezes celebration gestures and lantern poses without removing the gathering. No labels or target brackets were added.

## Codex and folklore scope

Four entries unlock after encounters: **Duwende, Kapre, Tikbalang and Diwata**. Each includes recorded traditions, attributed powers, habits and places, differences between tellings, original Silong interpretation, Rae's changing observations, encountered names and external references. Future creature entries stay absent until their encounters. The summaries are bundled for offline reading; external sources need connectivity.

Sources checked for this feature:

- NCCA Official [kapre](https://www.flickr.com/photos/nccaofficial/18442068642) and [tikbalang](https://www.flickr.com/photos/nccaofficial/18070087763) cultural vocabulary entries (2015). Summaries paraphrase selected motifs, rather than treating the entries as exhaustive universal rules.
- USC Digital Folklore Archives [2015 duwende family telling](https://folklore.usc.edu/duwende/) and [2017 telling](https://folklore.usc.edu/duwende-2/). Direct retrieval timed out/failed; indexed full transcripts were available and checked. The narrator's performance is distinguished from collector speculation. Contradictory family descriptions remain distinct. Reports of possession are identified as beliefs.
- Marie Melanie J. Misajon, [The System of Early Bisayan Mythology](https://urc.cpu.edu.ph/the-system-of-early-bisayan-mythology-2/), completed May 2008, CPU institutional abstract. Used for the limited Hiligaynon diwata/deities and territorial-power discussion.
- Pimentel, Rodriguez and del Rosario (2022), [Ntra. Sra. De Los Desamparados and Postcolonial Resistances](https://ioer-imrj.com/wp-content/uploads/2022/08/Ntra.-Sra.-De-Los-Desamparados-and-Postcolonial-Resistances.pdf), particularly pp. 328–330: a place-specific Santa Ana/Namayan Diwata sa Bukal account. Mayumi remains the game's original **The Diwata ng Bukal**, with no claim that her personal name or biography comes from this account.

## Verification

- **134 tests pass**, including encounter-only unlocks, existing save/replay isolation, changing field memories, celebration stages, safe ground/physical footings, visible clap/dance/lantern frames, Still, and distinct duwende portraits/ear silhouettes.
- TypeScript passes. Expo Android, iOS and web exports pass.
- Navigation review passes all nine map surfaces, interaction reachability checks and replay spawns with the new crowd colliders.
- Shared runtime art was rendered and visually inspected in `artifacts/duwende-neighbors-review.png` and `artifacts/clearing-celebrating-review.png`. Before/gathering/celebrating variants are included beside them. Regenerate with `node --experimental-strip-types scripts/render-duwende-celebration.ts`.
- Local server responds HTTP 200. Browser automation inventory contained no connected browsers or apps, so these checks do not claim a browser or physical Expo Go playthrough.
