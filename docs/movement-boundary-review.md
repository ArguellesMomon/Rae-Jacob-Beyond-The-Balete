# Movement boundary review

Generated with `npm.cmd run navigation:review`. These overlays review source geometry against map artwork, not a running-phone capture. Green shows reachable foot positions, amber shows ground on the locked eastern bank, and red outlines solid objects. All other background space is unavailable.

| Map / state | Reachable sample positions | Expected interactions reached |
| --- | ---: | ---: |
| Lola's Yard | 26671 | 10 |
| Lantern Clearing | 18791 | 11 |
| Old Balete Grove | 12164 | 10 |
| Rootwater Works | 11234 | 12 |
| Bamboo Verge | 9620 | 9 |
| Turning Paths | 12149 | 7 |
| Rainlit Road | 9068 | 5 |
| Riverside Hamlet | 6948 | 5 |
| The Quiet Spring | 10328 | 7 |
| Clearing before repairs | 19097 | 11 |
| Clearing after bell return | 19151 | 11 |
| Works bypass diverted | 11234 | 12 |
| Works bell retrieved | 11234 | 12 |
| Works water restored | 11234 | 12 |
| Works named crossing | 16811 | 14 |
| Verge onward road | 9620 | 9 |
| Spring with optional seed | 10328 | 8 |
| Spring root braced | 10326 | 7 |
| Spring after repair | 10381 | 7 |
| Verge before Bagtas | 9620 | 9 |
| Turning Paths 1 | 12149 | 7 |
| Turning Paths 2 | 12149 | 7 |
| Turning Paths 3 | 12149 | 7 |

All expected targets remain reachable in every reviewed state. Waterworks requires the named bridge for its eastern bank. Every replay starts on safe ground. Regression tests also drive Rae/Tala through real paths, test held/diagonal input and delayed frames, check old-save recovery, and verify bridge/corner foot support.

Physical-phone touch/performance review remains pending.
