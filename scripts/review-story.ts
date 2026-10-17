import { writeFile } from 'node:fs/promises';
import { linesFor } from '../src/game/dialogue.ts';
import { freshSave } from '../src/game/engine.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { journeyRecap } from '../src/game/recap.ts';
import { REPLY_TONES, STORY_CHOICES } from '../src/game/storyChoices.ts';
import type { DialogueLine, DiscoveryId, InteractionId, MapId, Progress } from '../src/game/model.ts';

function prose(line: DialogueLine): string {
  let text = `${line.beat ? `*${line.beat}*\n\n` : ''}**${line.speaker === 'Someone?' ? '???' : line.speaker}:** ${line.text}\n\n`;
  if (line.choice) {
    const choice = STORY_CHOICES[line.choice];
    text += `*Player choice: ${choice.prompt}*\n\n`;
    for (const tone of REPLY_TONES) text += `### ${tone}: ${choice.replies[tone].label}\n\n${choice.replies[tone].lines.map(prose).join('')}`;
    text += '*All replies rejoin the conversation below.*\n\n';
  }
  return text;
}
let review = '# Chapter 1 - Connected story moments\n\nGenerated from playable source with `npm.cmd run story:review`. Reply branches, personal memories and Silong characters are original fiction. Choice tones change exchanges and later callbacks; they do not alter puzzle access or endings. This document shows alternatives for editorial review; the in-game history records only the chosen, reached lines.\n\n';
const scene = (title: string, id: InteractionId, p: Progress, map: MapId) => { review += `## ${title}\n\n${linesFor(id, p, map).map(prose).join('')}`; };
const fresh = freshSave().progress;
scene('First trust - all three replies', 'tala', { ...fresh, arrivalSeen: true }, 'clearing');
scene('An outdated map - all three replies', 'waterworksArrival', replayCheckpoint('works').progress, 'waterworks');
const links: [DiscoveryId, InteractionId, MapId][] = [['clothesline', 'dryingRack', 'clearing'], ['rainJar', 'rainCup', 'grove'], ['rainJar', 'splitter', 'waterworks'], ['herbBed', 'branch', 'waterworks'], ['basin', 'stringBell', 'waterworks'], ['sungka', 'talaMaps', 'clearing'], ['calamansi', 'mangMemory', 'grove']];
for (const [memory, id, map] of links) scene(`Remembering ${memory} at ${id}`, id, { ...fresh, discoveries: [memory], metTala: true, metMang: true }, map);
scene('Ordinary care - Minda and Lola', 'mindaNeighbors', { ...fresh, metTala: true, heardMinda: true }, 'clearing');
scene('The corrected route', 'lowTrail', { ...replayCheckpoint('bellReturn').progress, talaMapHelped: true }, 'waterworks');
for (const tone of REPLY_TONES) scene(`After the bell - ${tone} callbacks`, 'afterBell', { ...replayCheckpoint('restored').progress, talaMapHelped: true, discoveries: ['merienda'], storyChoices: { firstTrust: tone, mapMistake: tone } }, 'clearing');
review += '## Returning to a save\n\n';
for (const preset of ['yard', 'arrival', 'grove', 'works', 'bellReturn', 'restored', 'ending'] as const) {
  const save = replayCheckpoint(preset); review += `- **${preset}:** ${journeyRecap(save.progress, save.mapId)}\n`;
}
await writeFile('docs/chapter-01-story-moments-review.md', review);
console.log('Exported both choice points, all six replies, discovery links, aftermath variants and save recaps from playable source.');
