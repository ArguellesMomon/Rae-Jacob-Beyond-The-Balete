# Character and folklore pass

Research update, 2026-10-18: [Mayumi and cast research notes](folklore-research-mayumi-and-cast.md) distinguish documented motifs, regional accounts and original character design. The planned continuation introduces **Mayumi, The Diwata ng Bukal**; her personal identity is an adaptation informed by spring-spirit references.

Implemented 2026-10-16 for the existing Chapter 1 route. The five on-screen characters receive new source art, acting and conversations. Bagtas remains an unseen voice at the ending; his full design belongs to the next chapter.

## Cast and voice

| Character | Visual signature | Inner life and dialogue direction |
| --- | --- | --- |
| Rae Jacob | White sando, teal shorts, worn flip-flops, warm brown skin, straight nape-length hair and spare kite string | Ten, energetic and curious. He jokes when nervous. Missing Lola gives the adventure an emotional cost. He gradually practices stopping, looking and asking. |
| Lola Selya | Low silver bun, sage blouse, flowered skirt and a wave from the porch | Affection expressed through food, mending and noticing. Her memories of Lolo's kite knots connect a practical puzzle tool to family. These are original family histories. |
| Tala | Ochre neckerchief, moss tunic, map pouch and oversized pencil | A young duwende mapmaker who knows her neighborhood and fears drawing an unverified road. Helping Rae becomes her own decision to travel. Her name does not make her a portrayal of a goddess. |
| Minda | Tied gray hair, rolled sleeves, blue apron and working tools | An experienced duwende waterkeeper. She worries about the neighbors who relied on her. Her arc includes accepting help and explaining what happened without blaming a distant giant. |
| Mang Uban | Giant seated silhouette, silver-streaked hair, heavy brows, expressive hands and earth-toned clothes | A patient kapre with dry humor and a memory of ordinary people. He knows his grove, not every answer. Quiet kindness makes him more than an obstacle or exposition source. |

Conversations should reveal a person's priorities through specific memories and actions. Rae's worries remain understandable to a child. NPCs can be mistaken, tired, unsure or funny. They do not all speak as mystical authorities. Filipino words such as *Lola*, *po* and *tabi-tabi po* appear in context, rather than as decorative vocabulary.

## What is drawn from tradition

The references below informed this pass. They are starting points with identifiable sources, not a claim that Philippine folklore has one uniform canon. The USC entries preserve particular narrators' accounts; a family recollection should not be generalized to all communities. Museum collections also distinguish the practices of different ethnolinguistic groups.

| Reference | Supported motif used here | Original adaptation or boundary |
| --- | --- | --- |
| [NCCA official: Kapre](https://www.flickr.com/photos/nccaofficial/18442068642) | A tobacco-smoking giant associated with a tree | Mang Uban's personality, guardianship, friendships and memories belong to this story. He is not declared the model for every kapre. |
| [NCCA official: Tikbalang](https://www.flickr.com/photos/nccaofficial/18070087763) | Horse-headed, long-limbed figure; stories of travelers being led astray | Mang's optional account foreshadows Bagtas. His motives and the root seal are fictional and remain unresolved. |
| [USC Folklore Archives: Tabi Tabi Po](https://folklore.usc.edu/tabi-tabi-po/) | A recorded Caloocan family practice of respectfully announcing passage near a mound associated with unseen residents | Lola teaches her family's version. Courtesy also means watching one's feet; the phrase is not a universal spell or a puzzle password. |
| [USC Folklore Archives: Duwende](https://folklore.usc.edu/duwende-2/) | One recorded family's association of duwende with trees and caution about disturbing their space | Tala, Minda, their clothes, root homes and professions are original characters and worldbuilding. No imported pointed-hat gnome costume. |
| [National Museum: Ritual Objects](https://www.nationalmuseum.gov.ph/our-collections/ethnology/ritual-objects/) | Collections document distinct communities and relationships with spiritual life and place | This is context for careful attribution. No specific sacred object, ritual or community's ceremonial clothing is reproduced as a generic magic item. |

Silong, the waybell, its crossing magic, the waterworks, the Heart Balete, the sealed side passage and these characters' biographies are inventions. The People page makes that distinction available inside the game and links to these references. Future chapters introducing another community's named practices should research and attribute those practices separately.

## Implemented visual treatment

Original SVG pixel art uses integer-grid shapes. Human sprites have a 32 × 48 source canvas and render at 20 × 30 world units. Duwende use 32 × 40 sources at 18 × 22 world units. Feet retain the existing collision anchors. The denser art supersedes the smaller first-prototype character canvases in the preproduction blueprint.

Rae has six walking frames in four directions, opposing arm/leg movement, head sway and a small walking bob. Standing characters breathe and blink; speaking adds mouth movement. Lola waves, Tala unfolds her map, Minda works with her tools, and retrieval gives Rae reach/pull poses. Mang has blinking, changing brows/mouth and a small hand movement. These are light SVG poses, not a skeletal animation system.

Five 80 × 96 bust portraits have nine authored expressions: neutral, warm, delighted, curious, worried, determined, wistful, surprised and wry. Dialogue chooses expressions and gestures, with occasional short sensory or acting beats. Longer text scrolls inside the dialogue panel on short screens. No recorded speech is included.

Preview the actual generators: [animation GIF](../artifacts/character-animation-preview.gif), [expressions](../artifacts/character-expression-sheet.png), [walk cycles](../artifacts/rae-animation-sheet.png), [gestures](../artifacts/character-gesture-sheet.png). These are source-art renders, not screenshots or recordings of the game UI. Regenerate with `npm.cmd run characters:preview`.

## Story and save behavior

Twelve new personal topics add Lola's stories/string/waiting, Tala's maps/courtesy/journey, Minda's water/neighbors/waybell and Mang's kapre/memory/Bagtas. Existing road questions remain available. Key introductions, the arrival, bell return and ending are rewritten with more character detail. State-aware puzzle replies remain in place.

Topics are optional and repeatable. Reading them records a visited check but never repairs a machine or silently gates the main route. Each menu has a visible exit before the topic list. The notebook's People page unlocks characters as Rae meets them, with histories, visual details and relationship notes that change with the journey.

Existing v1/v2 saves migrate without losing the journey; absent topic arrays default empty. Continue lets a completed save revisit available NPCs. Lola's yard and the first introductions are seen on a fresh journey; starting one replaces the existing journey only after the game's confirmation. There is no new return-to-yard route.

## Verification limits

The character pass has TypeScript checking and 53 passing automated tests, including eight mounted React-controller integration tests. New coverage checks optional-topic persistence and interruption recovery, unchanged quest flags, character discovery, expression/walk-frame distinctions, valid raster output and the authored hoofbeat cue. Full Chapter 1 puzzle and ending checks still pass.

Art sheets were rendered and visually reviewed. Android, iOS and web production exports pass; the running web bundle returns HTTP 200 and contains the new character journal and conversations. Physical-phone animation smoothness, thumb reach, long-dialogue scrolling, actual rendering and emotional pacing still require the [device check](chapter-01-device-check.md).
