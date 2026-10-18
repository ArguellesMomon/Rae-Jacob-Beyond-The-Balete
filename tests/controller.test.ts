import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { act, create } from 'react-test-renderer';
import type { ReactTestRenderer } from 'react-test-renderer';
import { useAdventureGame } from '../src/hooks/useAdventureGame.ts';
import { START } from '../src/game/model.ts';
import { canStand, freshSave, nearbyInteraction } from '../src/game/engine.ts';
import { getMap } from '../src/game/world.ts';
import { walkRoute } from './helpers/walkRoute.ts';
import type { InteractionId } from '../src/game/model.ts';
import { CROSSING_DURATION, crossingFrame } from '../src/game/crossing.ts';
import { replayCheckpoint } from '../src/game/replay.ts';
import { FORKS, followsRoute } from '../src/game/chapterTwo.ts';
import { stored } from './mocks/storage.ts';
import { emitAppState, emitBack } from './mocks/native.ts';

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let time = 100, nextFrame = 1;
const frames = new Map<number, FrameRequestCallback>();
globalThis.requestAnimationFrame = callback => { const id = nextFrame++; frames.set(id, callback); return id; };
globalThis.cancelAnimationFrame = id => { if (typeof id === 'number') frames.delete(id); };

async function tick(count: number) {
  await act(async () => {
    for (let i = 0; i < count; i++) {
      time += 1000 / 60;
      const batch = [...frames.values()]; frames.clear();
      for (const callback of batch) callback(time);
    }
  });
}
async function mount() {
  let current!: ReturnType<typeof useAdventureGame>;
  let renderer!: ReactTestRenderer;
  function Harness() { current = useAdventureGame(); return null; }
  await act(async () => { renderer = create(createElement(Harness)); });
  return { get game() { return current; }, async dispose() { await act(async () => { renderer.unmount(); }); } };
}
function currentDialogueId(app: { readonly game: ReturnType<typeof useAdventureGame> }) { return app.game.dialogue?.id; }
async function advanceSpeech(app: { readonly game: ReturnType<typeof useAdventureGame> }) {
  await act(async () => { if (app.game.mode === 'reply') app.game.chooseReply('thoughtful'); else app.game.act(); });
}
async function finishSpeech(app: { readonly game: ReturnType<typeof useAdventureGame> }) {
  let steps = 0;
  const id = app.game.dialogue?.id;
  while (app.game.dialogue && app.game.dialogue.id === id) {
    assert.ok(++steps < 60, 'A conversation must have a finite ending.');
    await advanceSpeech(app);
  }
}
function seedCompletedYard() {
  stored.clear();
  stored.set('@rae-jacob/yard/v1', JSON.stringify({ version: 1, player: { ...START, x: 548, y: 193 }, progress: { talkedToLola: true, discoveries: ['basin'], foundTree: true } }));
}

test('the real controller resumes an interrupted crossing at the saved arrival, retaining old yard notes', async () => {
  seedCompletedYard();
  let app = await mount();
  try {
    assert.equal(app.game.loaded, true);
    await act(async () => app.game.start(true));
    assert.equal(app.game.mode, 'crossing');
    assert.equal(app.game.mapId, 'clearing');
    assert.equal(JSON.parse(stored.get('@rae-jacob/adventure/v2')!).mapId, 'clearing');
    await tick(Math.ceil(CROSSING_DURATION * .38 * 60));
    assert.ok(app.game.transition > 0.2 && app.game.transition < 0.8);
    assert.equal(crossingFrame(app.game.transition).phase, 'blackout');
    await act(async () => emitAppState('background'));
    assert.equal(app.game.mode, 'paused');
    assert.equal(currentDialogueId(app), 'arrival');
    await app.dispose();
    app = await mount();
    await act(async () => app.game.start(true));
    assert.equal(app.game.mode, 'playing');
    assert.equal(app.game.mapId, 'clearing');
    assert.equal(currentDialogueId(app), 'arrival');
    assert.deepEqual(app.game.progress.discoveries, ['basin']);
  } finally { await app.dispose(); }
});

test('the slower opening finishes on its own and saves arrival without requiring optional yard memories', async () => {
  stored.clear();
  stored.set('@rae-jacob/adventure/v2', JSON.stringify({ ...freshSave(), player: { ...START, x: 548, y: 193 }, progress: { ...freshSave().progress, talkedToLola: true } }));
  const app = await mount();
  try {
    await act(async () => app.game.start(true));
    await act(async () => app.game.act());
    assert.equal(currentDialogueId(app), 'balete');
    assert.equal(app.game.progress.crossed, false);
    for (let n = 0; n < app.game.dialogue!.lines.length - 1; n++) await act(async () => app.game.act());
    assert.equal(app.game.mapId, 'yard', 'stay in the yard until the whole exchange is finished');
    await act(async () => app.game.act());
    assert.equal(app.game.mode, 'crossing');
    await tick(Math.ceil((CROSSING_DURATION + .2) * 60));
    assert.equal(app.game.mode, 'playing');
    assert.equal(currentDialogueId(app), 'arrival');
    assert.equal(app.game.progress.arrivalSeen, false);
    assert.equal(JSON.parse(stored.get('@rae-jacob/adventure/v2')!).mapId, 'clearing');
    await finishSpeech(app);
    assert.equal(app.game.progress.arrivalSeen, true);
    assert.deepEqual(app.game.progress.discoveries, []);
  } finally { await app.dispose(); }
});

test('the real controller plays arrival, triggers Tala, supports questions, and restores the recruited companion', async () => {
  seedCompletedYard();
  let app = await mount();
  try {
    await act(async () => app.game.start(true));
    await act(async () => app.game.skipCrossing());
    await finishSpeech(app);
    assert.equal(app.game.progress.arrivalSeen, true);
    app.game.setInput({ x: 1, y: 0 }); await tick(90);
    app.game.setInput({ x: 0, y: -1 }); await tick(55);
    assert.equal(currentDialogueId(app), 'tala');
    await finishSpeech(app);
    assert.equal(app.game.progress.metTala, true);
    assert.equal(app.game.mode, 'questions');
    await act(async () => app.game.askTala('ringing'));
    await finishSpeech(app);
    assert.equal(app.game.mode, 'questions');
    await act(async () => app.game.askTala('home'));
    await finishSpeech(app);
    assert.deepEqual(app.game.progress.talaTopics, ['ringing', 'home']);
    await act(async () => app.game.changeMode('playing'));
    app.game.setInput({ x: 1, y: 0 }); await tick(70);
    app.game.setInput({ x: 0, y: 0 }); await tick(40);
    assert.ok(app.game.companion.x > 200);
    app.game.setInput({ x: 1, y: 0 }); await tick(90);
    app.game.setInput({ x: 0, y: 0 }); await tick(2);
    assert.equal(app.game.targetId, 'bellArch', 'A nearby companion must not lock out scenery interactions.');
    await act(async () => app.game.act());
    assert.equal(currentDialogueId(app), 'bellArch');
    await finishSpeech(app);
    assert.ok(app.game.progress.discoveries.includes('bellArch'));
    await act(async () => app.game.pause());
    const position = { x: app.game.player.x, y: app.game.player.y };
    await app.dispose();
    app = await mount();
    await act(async () => app.game.start(true));
    assert.equal(app.game.mapId, 'clearing');
    assert.equal(app.game.dialogue, null);
    assert.equal(app.game.progress.metTala, true);
    assert.deepEqual(app.game.progress.talaTopics, ['ringing', 'home']);
    assert.ok(app.game.progress.discoveries.includes('bellArch'));
    assert.deepEqual({ x: app.game.player.x, y: app.game.player.y }, position);
    assert.ok(Math.hypot(app.game.player.x - app.game.companion.x, app.game.player.y - app.game.companion.y) <= 20);
  } finally { await app.dispose(); }
});

test('the controller travels to the grove, reveals Mang, follows the tube, and returns without losing progress', async () => {
  stored.clear();
  stored.set('@rae-jacob/adventure/v2', JSON.stringify({ ...freshSave(), mapId: 'clearing', player: { ...START, x: 292, y: 133, facing: 'up' }, progress: { ...freshSave().progress, talkedToLola: true, foundTree: true, crossed: true, arrivalSeen: true, metTala: true, groveLead: true, talaTopics: ['home'], discoveries: ['bellArch'] } }));
  let app = await mount();
  try {
    await act(async () => app.game.start(true));
    await act(async () => app.game.act());
    assert.equal(currentDialogueId(app), 'grovePath');
    await finishSpeech(app);
    assert.equal(app.game.mapId, 'grove');
    app.game.setInput({ x: 0, y: -1 }); await tick(100);
    assert.equal(app.game.mode, 'revealing');
    assert.equal(app.game.progress.metMang, false);
    await tick(260); // The reveal must finish on its own without needing the skip button.
    assert.equal(currentDialogueId(app), 'mang');
    await finishSpeech(app);
    assert.equal(app.game.mode, 'mangQuestions');
    assert.equal(app.game.progress.metMang, true);
    await act(async () => app.game.askMang('home'));
    await finishSpeech(app);
    await act(async () => app.game.askMang('ringing'));
    await finishSpeech(app);
    assert.deepEqual(app.game.progress.mangTopics, ['home', 'ringing']);
    await act(async () => app.game.changeMode('playing'));
    app.game.setInput({ x: 1, y: 0 }); await tick(90);
    app.game.setInput({ x: 0, y: 0 }); await tick(3);
    assert.equal(app.game.targetId, 'speakingTube');
    await act(async () => app.game.act());
    await finishSpeech(app);
    assert.ok(app.game.progress.discoveries.includes('speakingTube'));
    app.game.setInput({ x: 1, y: 0 }); await tick(70);
    app.game.setInput({ x: 0, y: 1 }); await tick(18);
    app.game.setInput({ x: 0, y: 0 }); await tick(3);
    assert.equal(app.game.targetId, 'waterworksPath');
    await act(async () => app.game.act());
    await finishSpeech(app);
    assert.equal(app.game.mode, 'playing');
    assert.equal(app.game.mapId, 'waterworks');
    assert.equal(currentDialogueId(app), 'waterworksArrival');
    assert.equal(app.game.progress.waterworksLead, true);
    await app.dispose();
    app = await mount();
    await act(async () => app.game.start(true));
    assert.equal(app.game.mapId, 'waterworks');
    assert.equal(currentDialogueId(app), 'waterworksArrival');
    await finishSpeech(app);
    await act(async () => app.game.act());
    assert.equal(currentDialogueId(app), 'groveReturn');
    await act(async () => app.game.act());
    assert.equal(app.game.mapId, 'grove');
    assert.equal(app.game.progress.metMang, true);
    assert.deepEqual(app.game.progress.mangTopics, ['home', 'ringing']);
    app.game.setInput({ x: -1, y: 0 }); await tick(160);
    app.game.setInput({ x: 0, y: 1 }); await tick(80);
    app.game.setInput({ x: 0, y: 0 }); await tick(3);
    assert.equal(app.game.targetId, 'clearingPath');
    await act(async () => app.game.act());
    await act(async () => app.game.act());
    assert.equal(app.game.mapId, 'clearing');
    assert.ok(app.game.progress.discoveries.includes('bellArch'));
    assert.ok(app.game.progress.discoveries.includes('speakingTube'));
    assert.equal(app.game.progress.metTala, true);
    assert.equal(app.game.progress.metMang, true);
  } finally { await app.dispose(); }
});

test('interrupting Mang’s reveal resumes safely with his introduction, not a stuck camera', async () => {
  stored.clear();
  stored.set('@rae-jacob/adventure/v2', JSON.stringify({ ...freshSave(), mapId: 'grove', player: { ...START, x: 232, y: 354, facing: 'up' }, progress: { ...freshSave().progress, talkedToLola: true, foundTree: true, crossed: true, arrivalSeen: true, metTala: true, visitedGrove: true } }));
  let app = await mount();
  try {
    await act(async () => app.game.start(true));
    app.game.setInput({ x: 0, y: -1 }); await tick(5);
    assert.equal(app.game.mode, 'revealing');
    await act(async () => emitAppState('background'));
    assert.equal(app.game.mode, 'paused');
    assert.equal(currentDialogueId(app), 'mang');
    assert.equal(app.game.progress.groveRevealed, true);
    assert.equal(app.game.progress.metMang, false);
    await app.dispose();
    app = await mount();
    await act(async () => app.game.start(true));
    assert.equal(app.game.mode, 'playing');
    assert.equal(currentDialogueId(app), 'mang');
    await finishSpeech(app);
    assert.equal(app.game.progress.metMang, true);
    assert.equal(app.game.mode, 'mangQuestions');
  } finally { await app.dispose(); }
});

test('the controller completes the waterworks, contextual string use, bell restoration and chapter ending across interruptions', async () => {
  stored.clear();
  stored.set('@rae-jacob/adventure/v2', JSON.stringify({ ...freshSave(), mapId: 'waterworks', player: { ...START, x: 84, y: 344 }, progress: { ...freshSave().progress, talkedToLola: true, foundTree: true, crossed: true, arrivalSeen: true, metTala: true, visitedGrove: true, metMang: true, waterworksLead: true, visitedWaterworks: true, discoveries: ['basin', 'speakingTube'] } }));
  let app = await mount();
  const walk = async (x: number, y: number) => {
    for (const waypoint of walkRoute(app.game.player, { x, y }, app.game.mapId, app.game.progress)) {
    let reached = false;
    for (let i = 0; i < 160; i++) {
      const dx = waypoint.x - app.game.player.x, dy = waypoint.y - app.game.player.y, d = Math.hypot(dx, dy);
      if (d < 1.5) { app.game.setInput({ x: 0, y: 0 }); await tick(3); reached = true; break; }
      const force = Math.min(1, Math.max(.32, d / 8));
      app.game.setInput({ x: dx / d * force, y: dy / d * force }); await tick(Math.max(2, Math.min(10, Math.floor(d / 1.2))));
      const map = getMap(app.game.mapId, app.game.progress);
      assert.ok(canStand(app.game.player, map.colliders, app.game.mapId), 'Rae stays on ground');
      assert.ok(canStand(app.game.companion, map.colliders, app.game.mapId), 'Tala stays on ground');
    }
    assert.ok(reached, `Could not walk to ${waypoint.x},${waypoint.y}; at ${app.game.player.x},${app.game.player.y}`);
    }
  };
  const interact = async (id: InteractionId) => {
    await act(async () => app.game.act());
    assert.equal(currentDialogueId(app), id);
    await finishSpeech(app);
    if (app.game.mode === 'mindaQuestions') await act(async () => app.game.changeMode('playing'));
  };
  const resume = async () => { await app.dispose(); app = await mount(); await act(async () => app.game.start(true)); };
  const dialogueId = () => app.game.dialogue?.id;
  try {
    await act(async () => app.game.start(true));
    assert.equal(currentDialogueId(app), 'waterworksArrival');
    while (app.game.dialogue) await advanceSpeech(app);
    await walk(264, 281);
    await interact('branch'); assert.equal(app.game.progress.branchMoved, true);
    await resume(); assert.equal(app.game.progress.branchMoved, true);
    await walk(264, 219); await walk(322, 219); await interact('lever');
    assert.equal(app.game.progress.flowDiverted, true);
    await walk(322, 322); await walk(385, 322); await interact('wheelBell');
    assert.equal(app.game.mode, 'tools');
    await act(async () => app.game.useString());
    assert.equal(app.game.mode, 'retrieving');
    await tick(55); assert.ok(app.game.sceneTime > .1);
    await act(async () => emitAppState('background'));
    assert.equal(app.game.mode, 'paused'); assert.equal(app.game.progress.bellRecovered, true);
    await resume();
    assert.equal(app.game.progress.bellRecovered, true); assert.equal(app.game.dialogue, null);
    await walk(322, 219); await interact('lever');
    assert.equal(app.game.progress.waterRestored, true);
    await walk(322, 420); await walk(117, 420); await interact('lowTrail');
    assert.equal(app.game.mapId, 'clearing');
    await walk(408, 239); await interact('minda');
    assert.equal(app.game.progress.bellReturned, true);
    await walk(382, 239); await walk(382, 337); await interact('bellArch');
    assert.equal(app.game.progress.bellHung, true); assert.equal(app.game.progress.bellRung, false);
    await interact('bellArch'); assert.equal(app.game.progress.bellRung, true);
    assert.equal(app.game.mode, 'watching'); await tick(180);
    assert.equal(currentDialogueId(app), 'afterBell'); await finishSpeech(app);
    await resume(); assert.equal(app.game.progress.bellRung, true);
    await walk(382, 350); await walk(459, 350); await walk(470, 305); await interact('waterPath');
    assert.equal(app.game.mapId, 'waterworks');
    await walk(584, 214);
    await act(async () => app.game.act());
    assert.equal(app.game.mode, 'sealRevealing');
    await tick(40); await act(async () => emitAppState('background'));
    assert.equal(app.game.progress.rootRevealed, true); assert.equal(app.game.progress.chapterComplete, false);
    await resume(); assert.equal(dialogueId(), 'rootSeal');
    while (app.game.dialogue) await advanceSpeech(app);
    assert.equal(app.game.mode, 'ending'); assert.equal(app.game.progress.chapterComplete, true);
    assert.ok(app.game.progress.discoveries.includes('basin'));
    await resume();
    assert.equal(app.game.progress.chapterComplete, true);
    assert.ok(app.game.player.x > 452, 'completed chapter resumes on the earned eastern bank');
  } finally { await app.dispose(); }
});

test('the root ending offers Chapter 2 once; repeated inspections and reloading keep earned exploration', async () => {
  stored.clear();
  const ready = replayCheckpoint('ending');
  ready.player = { ...START, x: 584, y: 214 };
  stored.set('@rae-jacob/adventure/v2', JSON.stringify(ready));
  let app = await mount();
  try {
    await act(async () => app.game.start(true));
    await act(async () => app.game.act());
    assert.equal(app.game.mode, 'sealRevealing');
    await act(async () => app.game.skipScene());
    await finishSpeech(app);
    assert.equal(app.game.mode, 'ending', 'the first completion still offers Chapter 2');
    await act(async () => app.game.changeMode('playing'));
    for (let visit = 0; visit < 3; visit++) {
      if (visit === 1) {
        await app.dispose(); app = await mount();
        await act(async () => app.game.start(true));
      }
      await tick(3); await act(async () => app.game.act());
      assert.equal(currentDialogueId(app), 'rootSeal');
      await finishSpeech(app);
      assert.equal(app.game.mode, 'playing', 'a later inspection must not reopen the chapter invitation');
      assert.equal(app.game.progress.chapterComplete, true);
      assert.equal(app.game.progress.chapterTwo.visited, false);
    }
    await act(async () => app.game.beginChapterTwo());
    assert.equal(app.game.mapId, 'bamboo', 'the earned road remains available after dismissing the invitation');
  } finally { await app.dispose(); }
});

test('tool selection can be cancelled, and both new scenes finish without using their skip buttons', async () => {
  const seed = (root: boolean) => {
    stored.clear();
    stored.set('@rae-jacob/adventure/v2', JSON.stringify({ ...freshSave(), mapId: 'waterworks', player: { ...START, x: root ? 584 : 385, y: root ? 214 : 322 }, progress: { ...freshSave().progress, talkedToLola: true, foundTree: true, crossed: true, arrivalSeen: true, metTala: true, visitedWaterworks: true, waterworksSeen: true, branchMoved: true, flowDiverted: !root, bellRung: root } }));
  };
  seed(false);
  let app = await mount();
  const dialogueId = () => app.game.dialogue?.id;
  try {
    await act(async () => app.game.start(true));
    await act(async () => app.game.act());
    while (app.game.dialogue) await advanceSpeech(app);
    assert.equal(app.game.mode, 'tools');
    await act(async () => app.game.changeMode('playing'));
    assert.equal(app.game.progress.bellRecovered, false);
    await act(async () => app.game.act());
    while (app.game.dialogue) await advanceSpeech(app);
    await act(async () => app.game.useString()); await tick(180);
    assert.equal(app.game.mode, 'playing'); assert.equal(dialogueId(), 'stringBell');
    assert.equal(app.game.progress.bellRecovered, true);
    await app.dispose(); seed(true); app = await mount();
    await act(async () => app.game.start(true));
    await act(async () => app.game.act()); assert.equal(app.game.mode, 'sealRevealing');
    await tick(180); assert.equal(app.game.mode, 'playing'); assert.equal(dialogueId(), 'rootSeal');
    while (app.game.dialogue) await advanceSpeech(app);
    assert.equal(app.game.mode, 'ending');
  } finally { await app.dispose(); }
});

test('settings return to the title, paused game or unfinished conversation without starting or advancing play', async () => {
  seedCompletedYard();
  const app = await mount();
  try {
    const previous = stored.get('@rae-jacob/yard/v1');
    await act(async () => app.game.openSettings()); assert.equal(app.game.mode, 'settings');
    await act(async () => { assert.equal(emitBack(), true); }); assert.equal(app.game.mode, 'title');
    assert.equal(stored.get('@rae-jacob/yard/v1'), previous);
    assert.equal(stored.has('@rae-jacob/adventure/v2'), false);
    await act(async () => app.game.start(true)); await act(async () => app.game.skipCrossing());
    await act(async () => app.game.openSettings()); await tick(60);
    await act(async () => app.game.closeSettings());
    assert.equal(app.game.mode, 'playing'); assert.equal(app.game.dialogue?.index, 0);
    await act(async () => app.game.pause()); await act(async () => app.game.openSettings());
    await act(async () => { emitBack(); }); assert.equal(app.game.mode, 'paused');
  } finally { await app.dispose(); }
});

test('personal conversations pause safely, remember topics and leave the optional story route open', async () => {
  stored.clear();
  stored.set('@rae-jacob/adventure/v2', JSON.stringify({ ...freshSave(), player: { ...START, x: 203, y: 205, facing: 'up' } }));
  let app = await mount();
  try {
    await act(async () => app.game.start(true)); await act(async () => app.game.act());
    assert.equal(currentDialogueId(app), 'lola');
    await finishSpeech(app); assert.equal(app.game.mode, 'lolaQuestions');
    assert.equal(app.game.progress.talkedToLola, true);
    await act(async () => app.game.askLola('stories')); await finishSpeech(app);
    await act(async () => app.game.askLola('string')); await finishSpeech(app);
    assert.deepEqual(app.game.progress.lolaTopics, ['stories', 'string']);
    await act(async () => emitAppState('background')); assert.equal(app.game.mode, 'paused');
    await app.dispose(); app = await mount(); await act(async () => app.game.start(true));
    assert.deepEqual(app.game.progress.lolaTopics, ['stories', 'string']);
    assert.equal(app.game.progress.foundTree, false);
    await act(async () => app.game.askTala('maps')); await finishSpeech(app);
    assert.ok(app.game.progress.talaTopics.includes('maps'));
    await act(async () => app.game.askMinda('neighbors')); await finishSpeech(app);
    assert.equal(app.game.mode, 'mindaQuestions');
    assert.ok(app.game.progress.mindaTopics.includes('neighbors'));
    await act(async () => { emitBack(); }); assert.equal(app.game.mode, 'playing');
    assert.equal(app.game.progress.bellRecovered, false);
  } finally { await app.dispose(); }
});

test('a completed bell save can collect Mang Uban’s gift, recover an interrupted offer and keep it across remounts', async () => {
  stored.clear();
  stored.set('@rae-jacob/adventure/v2', JSON.stringify({ ...freshSave(), mapId: 'grove', player: { ...START, x: 232, y: 302 }, progress: { ...freshSave().progress, talkedToLola: true, metMang: true, groveRevealed: true, bellRung: true, chapterComplete: true } }));
  let app = await mount();
  try {
    await act(async () => app.game.start(true));
    assert.equal(app.game.progress.ubanGiftReceived, false);
    await act(async () => app.game.act());
    assert.equal(currentDialogueId(app), 'mangGift');
    await act(async () => app.game.act());
    await act(async () => emitAppState('background'));
    assert.equal(app.game.progress.ubanGiftReceived, false);
    await app.dispose(); app = await mount();
    await act(async () => app.game.start(true));
    await act(async () => app.game.act());
    assert.equal(currentDialogueId(app), 'mangGift');
    await finishSpeech(app);
    assert.equal(app.game.progress.ubanGiftReceived, true);
    assert.equal(app.game.progress.chapterComplete, true);
    assert.equal(app.game.mode, 'mangQuestions');
    await app.dispose(); app = await mount();
    await act(async () => app.game.start(true));
    assert.equal(app.game.progress.ubanGiftReceived, true);
    await act(async () => app.game.inspectKeepsake());
    assert.equal(currentDialogueId(app), 'listeningSeed');
    await finishSpeech(app);
    await act(async () => app.game.act());
    assert.equal(currentDialogueId(app), 'mang', 'the gift offer is not repeated');
  } finally { await app.dispose(); }
});

test('ambient residents save only completed visits and offer a different short speech after returning', async () => {
  stored.clear();
  stored.set('@rae-jacob/adventure/v2', JSON.stringify({ ...freshSave(), mapId: 'clearing', player: { ...START, x: 130, y: 239 }, progress: { ...freshSave().progress, arrivalSeen: true, metTala: true } }));
  let app = await mount();
  try {
    await act(async () => app.game.start(true));
    await act(async () => app.game.act());
    assert.equal(currentDialogueId(app), 'nilo');
    assert.equal(app.game.progress.residentChats.nilo, undefined);
    const initial = app.game.dialogue!.lines.at(-1)!.text;
    await finishSpeech(app);
    assert.equal(app.game.progress.residentChats.nilo, 1);
    await app.dispose(); app = await mount();
    await act(async () => app.game.start(true));
    await act(async () => app.game.act());
    assert.equal(app.game.dialogue?.lines.length, 1);
    assert.notEqual(app.game.dialogue?.lines[0].text, initial);
    await finishSpeech(app);
    assert.equal(app.game.progress.residentChats.nilo, 2);
    assert.equal(app.game.progress.branchMoved, false);
  } finally { await app.dispose(); }
});

test('a tube-first traveler meets Mang before the post-bell gift scene rather than skipping his introduction', async () => {
  stored.clear();
  stored.set('@rae-jacob/adventure/v2', JSON.stringify({ ...freshSave(), mapId: 'grove', player: { ...START, x: 232, y: 302 }, progress: { ...freshSave().progress, groveRevealed: true, bellRung: true } }));
  const app = await mount();
  try {
    await act(async () => app.game.start(true));
    assert.equal(currentDialogueId(app), 'mang');
    await finishSpeech(app);
    assert.equal(app.game.progress.metMang, true);
    assert.equal(currentDialogueId(app), 'mangGift');
    await finishSpeech(app);
    assert.equal(app.game.progress.ubanGiftReceived, true);
    assert.equal(app.game.mode, 'mangQuestions');
  } finally { await app.dispose(); }
});

test('chapter replay writes to a separate slot and returns to the main journey with its memories intact', async () => {
  stored.clear();
  stored.set('@rae-jacob/adventure/v2', JSON.stringify({ ...freshSave(), player: { ...START, x: 203, y: 205 }, progress: { ...freshSave().progress, discoveries: ['basin'] } }));
  let app = await mount();
  try {
    await act(async () => app.game.start(true));
    await act(async () => app.game.act()); await finishSpeech(app);
    const original = stored.get('@rae-jacob/adventure/v2')!;
    const mainHistory = app.game.history.map(e => e.text);
    await act(async () => app.game.startReplay('works'));
    assert.equal(app.game.slot, 'replay'); assert.equal(app.game.mapId, 'waterworks');
    assert.equal(currentDialogueId(app), 'waterworksArrival');
    await finishSpeech(app);
    await act(async () => app.game.askTala('maps')); await finishSpeech(app);
    await act(async () => app.game.pause());
    assert.equal(stored.get('@rae-jacob/adventure/v2'), original);
    assert.equal(JSON.parse(stored.get('@rae-jacob/chapter-1-replay/v1')!).mapId, 'waterworks');
    await app.dispose(); app = await mount();
    await act(async () => app.game.start(true, 'replay'));
    assert.ok(app.game.progress.talaTopics.includes('maps'));
    await act(async () => app.game.start(true));
    assert.equal(app.game.slot, 'journey'); assert.equal(app.game.mapId, 'yard');
    assert.deepEqual(app.game.progress.discoveries, ['basin']);
    assert.deepEqual(app.game.history.map(e => e.text), mainHistory);
    assert.equal(app.game.progress.visitedWaterworks, false);
  } finally { await app.dispose(); }
});

test('history pauses a conversation without advancing it and restores its exact entry context', async () => {
  stored.clear();
  stored.set('@rae-jacob/adventure/v2', JSON.stringify({ ...freshSave(), player: { ...START, x: 203, y: 205 } }));
  let app = await mount();
  try {
    await act(async () => app.game.start(true)); await act(async () => app.game.act());
    assert.equal(app.game.history.length, 1);
    const second = app.game.dialogue!.lines[1].text;
    assert.equal(app.game.history.some(line => line.text === second), false);
    await act(async () => app.game.openHistory());
    assert.equal(app.game.mode, 'history');
    await act(async () => app.game.act()); assert.equal(app.game.dialogue?.index, 0);
    await act(async () => { emitBack(); });
    assert.equal(app.game.mode, 'playing'); assert.equal(app.game.dialogue?.index, 0);
    await act(async () => app.game.act()); assert.equal(app.game.history.length, 2);
    await act(async () => app.game.pause()); await act(async () => app.game.openHistory());
    await act(async () => app.game.closeHistory()); assert.equal(app.game.mode, 'paused');
    await app.dispose(); app = await mount(); await act(async () => app.game.start(true));
    assert.equal(app.game.history.length, 2); assert.equal(app.game.history[1].text, second);
    assert.equal(app.game.progress.talkedToLola, false);
  } finally { await app.dispose(); }
});

test('rapid replay scene changes keep queued snapshots isolated from the main save', async () => {
  stored.clear(); stored.set('@rae-jacob/adventure/v2', JSON.stringify(freshSave()));
  const original = stored.get('@rae-jacob/adventure/v2');
  const app = await mount();
  try {
    await act(async () => { app.game.startReplay('works'); app.game.startReplay('arrival'); });
    assert.equal(app.game.slot, 'replay'); assert.equal(app.game.mapId, 'clearing');
    assert.equal(currentDialogueId(app), 'arrival');
    assert.equal(stored.get('@rae-jacob/adventure/v2'), original);
    assert.equal(JSON.parse(stored.get('@rae-jacob/chapter-1-replay/v1')!).mapId, 'clearing');
    assert.equal(app.game.history.some(line => line.scene === 'waterworksArrival'), false);
  } finally { await app.dispose(); }
});

test('replay choices suspend input and Back returns to title or the unfinished paused conversation', async () => {
  stored.clear();
  const app = await mount();
  try {
    await act(async () => app.game.openReplay()); assert.equal(app.game.mode, 'replayMenu');
    await act(async () => { emitBack(); }); assert.equal(app.game.mode, 'title');
    await act(async () => app.game.startReplay('works'));
    const line = app.game.dialogue?.index, position = { x: app.game.player.x, y: app.game.player.y };
    await act(async () => app.game.pause()); await act(async () => app.game.openReplay());
    await act(async () => { app.game.setInput({ x: 1, y: 0 }); app.game.act(); }); await tick(12);
    assert.equal(app.game.mode, 'replayMenu'); assert.equal(app.game.dialogue?.index, line);
    assert.deepEqual({ x: app.game.player.x, y: app.game.player.y }, position);
    await act(async () => { emitBack(); }); assert.equal(app.game.mode, 'paused');
    assert.equal(app.game.dialogue?.index, line);
  } finally { await app.dispose(); }
});

test('a personal reply pauses safely, commits once, excludes other branches from history and survives an unfinished introduction', async () => {
  stored.clear();
  stored.set('@rae-jacob/adventure/v2', JSON.stringify({ ...freshSave(), mapId: 'clearing', player: { ...START, x: 188, y: 307 }, progress: { ...freshSave().progress, arrivalSeen: true } }));
  let app = await mount();
  try {
    await act(async () => app.game.start(true)); await tick(3);
    for (let i = 0; i < 40 && app.game.mode !== 'reply'; i++) await advanceSpeech(app);
    assert.equal(app.game.mode, 'reply'); assert.equal(app.game.dialogue?.lines[app.game.dialogue.index].choice, 'firstTrust');
    const index = app.game.dialogue!.index, pos = app.game.player.x;
    app.game.setInput({ x: 1, y: 0 }); await tick(20);
    await act(async () => app.game.act()); assert.equal(app.game.dialogue!.index, index); assert.equal(app.game.player.x, pos);
    await act(async () => app.game.openHistory()); await act(async () => { emitBack(); }); assert.equal(app.game.mode, 'reply');
    await act(async () => emitAppState('background')); assert.equal(app.game.mode, 'paused');
    await act(async () => emitAppState('active')); await act(async () => app.game.changeMode('playing')); assert.equal(app.game.mode, 'reply');
    await act(async () => { app.game.chooseReply('playful'); app.game.chooseReply('cautious'); });
    assert.equal(app.game.progress.storyChoices.firstTrust, 'playful'); assert.equal(app.game.progress.metTala, false);
    assert.ok(app.game.history.at(-1)!.text.includes('proper exploring team'));
    assert.equal(app.game.history.some(e => e.text.includes('fallen down quite enough')), false);
    await app.dispose(); app = await mount(); await act(async () => app.game.start(true)); await tick(3);
    assert.equal(currentDialogueId(app), 'tala');
    assert.equal(app.game.dialogue!.lines.some(line => line.choice === 'firstTrust'), false);
    assert.equal(app.game.progress.storyChoices.firstTrust, 'playful');
    await finishSpeech(app); assert.equal(app.game.progress.metTala, true); assert.equal(app.game.mode, 'questions');
  } finally { await app.dispose(); }
});

test('the map lesson preserves the puzzle, completes its relationship beat and keeps recap dismissal independent of saves', async () => {
  stored.clear();
  const app = await mount();
  try {
    await act(async () => app.game.startReplay('works')); assert.equal(app.game.recap, null);
    for (let i = 0; i < 20 && app.game.mode !== 'reply'; i++) await advanceSpeech(app);
    assert.equal(app.game.dialogue?.lines[app.game.dialogue.index].choice, 'mapMistake');
    await act(async () => app.game.chooseReply('cautious')); await finishSpeech(app);
    assert.equal(app.game.progress.talaMapHelped, true); assert.equal(app.game.progress.waterworksSeen, true);
    assert.equal(app.game.progress.branchMoved, false); assert.equal(app.game.progress.bellRecovered, false);
    await act(async () => app.game.title()); await act(async () => app.game.start(true, 'replay'));
    assert.match(app.game.recap!, /missing bell/);
    const saved = stored.get('@rae-jacob/chapter-1-replay/v1');
    await act(async () => app.game.dismissRecap()); assert.equal(app.game.recap, null);
    assert.equal(stored.get('@rae-jacob/chapter-1-replay/v1'), saved);
    assert.equal(stored.has('@rae-jacob/adventure/v2'), false);
  } finally { await app.dispose(); }
});

test('the quiet aftermath follows the bell, recovers across interruptions and completes once without repeating the ring', async () => {
  stored.clear();
  stored.set('@rae-jacob/adventure/v2', JSON.stringify({ ...freshSave(), mapId: 'clearing', player: { ...START, x: 382, y: 337 }, progress: { ...freshSave().progress, metTala: true, arrivalSeen: true, bellHung: true, visitedWaterworks: true, talaMapHelped: true, storyChoices: { firstTrust: 'thoughtful', mapMistake: 'cautious' } } }));
  let app = await mount();
  try {
    await act(async () => app.game.start(true)); await act(async () => app.game.act());
    assert.equal(currentDialogueId(app), 'bellArch'); await finishSpeech(app);
    assert.equal(app.game.mode, 'watching'); assert.equal(app.game.progress.bellRung, true);
    assert.equal(app.game.progress.afterBellSeen, false); await tick(30);
    await act(async () => emitAppState('background')); assert.equal(app.game.mode, 'paused'); assert.equal(currentDialogueId(app), 'afterBell');
    await app.dispose(); app = await mount(); await act(async () => app.game.start(true));
    assert.equal(currentDialogueId(app), 'afterBell');
    assert.ok(app.game.dialogue!.lines.some(line => line.text.includes('needed to hear')));
    await advanceSpeech(app); await app.dispose(); app = await mount(); await act(async () => app.game.start(true));
    assert.equal(currentDialogueId(app), 'afterBell'); await finishSpeech(app);
    assert.equal(app.game.progress.afterBellSeen, true); assert.equal(app.game.progress.bellRung, true);
    await app.dispose(); app = await mount(); await act(async () => app.game.start(true));
    assert.equal(app.game.dialogue, null); assert.match(app.game.recap!, /shared a quiet moment/);
    await act(async () => app.game.act()); assert.equal(currentDialogueId(app), 'bellArch'); await finishSpeech(app);
    assert.equal(app.game.dialogue, null); assert.equal(app.game.mode, 'playing');
    await act(async () => app.game.startReplay('restored')); assert.equal(app.game.mode, 'watching');
    await act(async () => app.game.skipScene()); assert.equal(currentDialogueId(app), 'afterBell');
    assert.equal(app.game.progress.afterBellSeen, false, 'skipping the establishing shot does not skip the conversation');
  } finally { await app.dispose(); }
});

test('the controller plays Chapter 2 from an earned crossing through loops, checked landmarks, Bagtas and the return to Chapter 1', async () => {
  stored.clear();
  const ready = replayCheckpoint('ending'); ready.progress.chapterComplete = true; ready.progress.ubanGiftReceived = true;
  ready.progress.storyChoices.firstTrust = 'playful'; ready.player = { ...START, x: 654, y: 314 };
  stored.set('@rae-jacob/adventure/v2', JSON.stringify(ready));
  let app = await mount();
  const walk = async (x: number, y: number) => {
    for (const waypoint of walkRoute(app.game.player, { x, y }, app.game.mapId, app.game.progress)) {
    let reached = false;
    for (let i = 0; i < 160; i++) {
      const dx = waypoint.x - app.game.player.x, dy = waypoint.y - app.game.player.y, d = Math.hypot(dx, dy);
      if (d < 1.5) { app.game.setInput({ x: 0, y: 0 }); await tick(3); reached = true; break; }
      const force = Math.min(1, Math.max(.32, d / 8));
      app.game.setInput({ x: dx / d * force, y: dy / d * force }); await tick(Math.max(2, Math.min(10, Math.floor(d / 1.2))));
      const map = getMap(app.game.mapId, app.game.progress);
      assert.ok(canStand(app.game.player, map.colliders, app.game.mapId), 'Rae stays on ground');
      assert.ok(canStand(app.game.companion, map.colliders, app.game.mapId), 'Tala stays on ground');
    }
    assert.ok(reached, `Could not walk to ${waypoint.x},${waypoint.y} from ${app.game.player.x},${app.game.player.y}`);
    }
  };
  const interact = async (id: InteractionId) => { await tick(3); assert.equal(app.game.targetId, id); await act(async () => app.game.act()); assert.equal(currentDialogueId(app), id); await finishSpeech(app); };
  const resume = async () => { await app.dispose(); app = await mount(); await act(async () => app.game.start(true)); };
  try {
    await act(async () => app.game.start(true)); await interact('bambooDeparture');
    assert.equal(app.game.mapId, 'bamboo'); assert.equal(currentDialogueId(app), 'bambooArrival'); await finishSpeech(app);
    await walk(400, 265);
    await interact('bagtas'); assert.equal(app.game.mode, 'bagtasQuestions'); assert.equal(app.game.progress.chapterTwo.metBagtas, true);
    await act(async () => app.game.askBagtas('paths')); await finishSpeech(app); assert.deepEqual(app.game.progress.chapterTwo.topics, ['paths']);
    await act(async () => app.game.changeMode('playing')); await walk(553, 265); await walk(553, 246); await interact('turningEntry');
    assert.equal(app.game.mapId, 'turning'); await finishSpeech(app);
    await walk(320, 108); await interact('forkNorth'); assert.equal(app.game.mode, 'pathTurning');
    assert.equal(app.game.progress.chapterTwo.trailStep, 0); assert.equal(app.game.progress.chapterTwo.loops, 1);
    await act(async () => emitAppState('background')); assert.equal(app.game.mode, 'paused'); await resume();
    for (let step = 0; step < 3; step++) {
      const fork = FORKS.find(id => followsRoute(app.game.progress, id))!;
      await walk(320, 300);
      if (fork === 'forkWest') { await walk(110, 300); await walk(110, 230); }
      else if (fork === 'forkEast') { await walk(528, 300); await walk(528, 230); }
      else await walk(320, 108);
      await interact(fork); assert.equal(app.game.mode, 'pathTurning'); assert.equal(app.game.progress.chapterTwo.trailStep, step + 1);
      if (step === 0) await resume(); else await tick(90);
    }
    assert.equal(app.game.mapId, 'bamboo'); assert.equal(app.game.progress.chapterTwo.routeVerified, true);
    await walk(400, 267); await act(async () => app.game.act()); assert.equal(currentDialogueId(app), 'bagtasDebrief');
    await advanceSpeech(app); await act(async () => emitAppState('background')); await resume();
    await act(async () => app.game.act()); assert.equal(currentDialogueId(app), 'bagtasDebrief'); await finishSpeech(app);
    assert.equal(app.game.progress.chapterTwo.debriefSeen, true); assert.equal(app.game.mode, 'bagtasQuestions');
    await act(async () => app.game.askBagtas('seals')); await finishSpeech(app); await act(async () => app.game.changeMode('playing'));
    await walk(84, 420); await interact('bambooReturn');
    assert.equal(app.game.mapId, 'waterworks'); assert.equal(app.game.progress.bellRung, true);
    assert.equal(app.game.progress.ubanGiftReceived, true); assert.equal(app.game.progress.storyChoices.firstTrust, 'playful');
    assert.equal(app.game.progress.chapterTwo.debriefSeen, true);
    await resume(); assert.equal(app.game.progress.chapterTwo.trailStep, 3);
    assert.ok(app.game.history.some(line => line.speaker === 'Bagtas'));
  } finally { await app.dispose(); }
});

test('Chapter 2 replay preserves the main journey and recovers an interrupted Bagtas reply without asking twice', async () => {
  stored.clear(); const main = freshSave(); main.progress.discoveries = ['calamansi'];
  stored.set('@rae-jacob/adventure/v2', JSON.stringify(main)); const original = stored.get('@rae-jacob/adventure/v2');
  let app = await mount();
  try {
    await act(async () => app.game.startReplay('bambooDebrief'));
    await act(async () => app.game.act()); assert.equal(currentDialogueId(app), 'bagtasDebrief'); await finishSpeech(app);
    assert.equal(app.game.progress.chapterTwo.debriefSeen, true); assert.equal(stored.get('@rae-jacob/adventure/v2'), original);
    await act(async () => app.game.startReplay('chapter2')); await finishSpeech(app);
    await app.dispose();
    const replay = JSON.parse(stored.get('@rae-jacob/chapter-1-replay/v1')!); replay.player = { ...START, x: 400, y: 265 };
    stored.set('@rae-jacob/chapter-1-replay/v1', JSON.stringify(replay)); app = await mount();
    await act(async () => app.game.start(true, 'replay')); await act(async () => app.game.act());
    for (let i = 0; i < 40 && app.game.mode !== 'reply'; i++) await advanceSpeech(app);
    assert.equal(app.game.mode, 'reply'); await act(async () => { app.game.chooseReply('cautious'); app.game.chooseReply('playful'); });
    assert.equal(app.game.progress.storyChoices.bagtasIntent, 'cautious'); assert.equal(app.game.progress.chapterTwo.metBagtas, false);
    await app.dispose(); app = await mount(); await act(async () => app.game.start(true, 'replay')); await act(async () => app.game.act());
    assert.equal(app.game.dialogue!.lines.some(line => line.choice === 'bagtasIntent'), false); await finishSpeech(app);
    assert.equal(app.game.progress.chapterTwo.metBagtas, true); assert.equal(stored.get('@rae-jacob/adventure/v2'), original);
    await act(async () => app.game.start(true)); assert.equal(app.game.mapId, 'yard');
    assert.deepEqual(app.game.progress.discoveries, ['calamansi']); assert.equal(app.game.progress.chapterTwo.visited, false);
  } finally { await app.dispose(); }
});


test('the real controller walks the new road, meets Luning and Mayumi, repairs the spring, survives interruption, and ends Chapter 2 once', async () => {
  stored.clear(); const checkpoint = replayCheckpoint('rainroad');
  checkpoint.mapId = 'bamboo'; checkpoint.player = { ...START, x: 384, y: 203, facing: 'up' };
  checkpoint.progress.rainlit.visited = false;
  stored.set('@rae-jacob/adventure/v2', JSON.stringify(checkpoint));
  let app = await mount();
  const walk = async (x: number, y: number) => {
    for (const waypoint of walkRoute(app.game.player, { x, y }, app.game.mapId, app.game.progress)) {
      let reached = false;
      for (let i = 0; i < 180; i++) {
        const dx = waypoint.x - app.game.player.x, dy = waypoint.y - app.game.player.y, d = Math.hypot(dx, dy);
        if (d < 1.5) { app.game.setInput({ x: 0, y: 0 }); await tick(3); reached = true; break; }
        const force = Math.min(1, Math.max(.32, d / 8));
        app.game.setInput({ x: dx / d * force, y: dy / d * force });
        await tick(Math.max(2, Math.min(10, Math.floor(d / 1.2))));
        const map = getMap(app.game.mapId, app.game.progress);
        assert.ok(canStand(app.game.player, map.colliders, app.game.mapId));
        assert.ok(canStand(app.game.companion, map.colliders, app.game.mapId));
      }
      assert.ok(reached, 'Unreached waypoint ' + JSON.stringify(waypoint) + ' from ' + JSON.stringify(app.game.player));
    }
  };
  const approach = async (id: InteractionId) => {
    if (app.game.mode !== 'playing') await act(async () => app.game.changeMode('playing'));
    const map = getMap(app.game.mapId, app.game.progress), target = map.interactions.find(i => i.id === id)!; assert.ok(target, id);
    const spots = [0, 12, 16, -12, -16, 24, -24].flatMap(dy => [0, 12, -12, 20, -20].map(dx => ({ x: target.point.x + dx, y: target.point.y + dy })));
    const spot = spots.find(point => canStand(point, map.colliders, app.game.mapId) && nearbyInteraction(point, undefined, app.game.mapId, undefined, app.game.progress)?.id === id)!;
    assert.ok(spot, 'There is an unobstructed approach to ' + id); await walk(spot.x, spot.y); await tick(3);
    assert.equal(app.game.targetId, id); await act(async () => app.game.act());
  };
  const interact = async (id: InteractionId) => { await approach(id); assert.equal(currentDialogueId(app), id); await finishSpeech(app); };
  const resume = async () => { await app.dispose(); app = await mount(); await act(async () => app.game.start(true)); };
  try {
    await act(async () => app.game.start(true));
    await interact('rainroadEntry'); assert.equal(app.game.mapId, 'rainroad'); assert.equal(currentDialogueId(app), 'rainroadArrival'); await finishSpeech(app);
    await interact('hamletEntry'); assert.equal(app.game.mapId, 'hamlet'); await finishSpeech(app);
    await interact('springEntry'); assert.equal(app.game.mapId, 'hamlet', 'The delivery clue is introduced first.');
    await interact('luning'); assert.equal(app.game.progress.rainlit.metLuning, true);
    await interact('springEntry'); assert.equal(app.game.mapId, 'spring'); await finishSpeech(app);
    await interact('mayumi'); assert.equal(app.game.mode, 'mayumiQuestions'); assert.equal(app.game.progress.rainlit.metMayumi, true);
    await act(async () => app.game.askMayumi('stories')); await finishSpeech(app);
    assert.deepEqual(app.game.progress.rainlit.topics, ['stories']);
    await interact('springBasket'); assert.equal(app.game.progress.rainlit.basketFreed, false);
    await interact('springChannel'); await interact('springBrace'); assert.equal(app.game.progress.rainlit.rootBraced, true);
    await resume(); assert.equal(app.game.progress.rainlit.rootBraced, true);
    await interact('springBasket'); assert.equal(app.game.progress.rainlit.basketFreed, true);
    await approach('springBrace'); assert.equal(app.game.mode, 'springRestoring'); assert.equal(app.game.progress.rainlit.restored, true);
    await tick(45); assert.ok(app.game.sceneTime > 0 && app.game.sceneTime < 1);
    await act(async () => emitAppState('background')); assert.equal(app.game.mode, 'paused'); assert.equal(currentDialogueId(app), 'springSettle');
    await resume(); assert.equal(app.game.progress.rainlit.restored, true); assert.equal(app.game.dialogue, null);
    await interact('springReturn'); assert.equal(app.game.mapId, 'hamlet');
    await interact('luning'); assert.equal(app.game.progress.rainlit.basketReturned, true);
    await interact('springEntry'); assert.equal(app.game.mapId, 'spring'); assert.equal(app.game.dialogue, null, 'Arrival plays only once.');
    await interact('mayumi'); assert.equal(app.game.mode, 'springSealing'); assert.equal(app.game.progress.rainlit.sealSeen, true);
    await tick(60); await act(async () => emitAppState('background')); assert.equal(currentDialogueId(app), 'springSeal');
    await resume(); assert.equal(currentDialogueId(app), 'springSeal'); await finishSpeech(app);
    assert.equal(app.game.mode, 'chapterTwoEnding'); assert.equal(app.game.progress.rainlit.complete, true);
    assert.equal(app.game.progress.ubanGiftReceived, false, 'The optional Chapter 1 gift was never required.');
    assert.equal(app.game.history.some(l => l.speaker === 'Mayumi'), true);
    await interact('springSeal'); assert.equal(app.game.mode, 'playing', 'The ending is not repeated.');
    await resume(); assert.equal(app.game.progress.rainlit.complete, true); assert.equal(app.game.dialogue, null);
  } finally { await app.dispose(); }
});

test('spring replay scenes keep the main save untouched and a skipped reveal still shows its dialogue', async () => {
  stored.clear(); const main = freshSave(); main.progress.discoveries = ['calamansi'];
  stored.set('@rae-jacob/adventure/v2', JSON.stringify(main)); const original = stored.get('@rae-jacob/adventure/v2');
  const app = await mount();
  try {
    await act(async () => app.game.startReplay('springEnding'));
    await tick(3); assert.equal(app.game.targetId, 'mayumi');
    await act(async () => app.game.act()); await finishSpeech(app);
    assert.equal(app.game.mode, 'springSealing'); await act(async () => app.game.skipScene());
    assert.equal(currentDialogueId(app), 'springSeal'); assert.equal(app.game.progress.rainlit.complete, false);
    await finishSpeech(app); assert.equal(app.game.progress.rainlit.complete, true);
    assert.equal(stored.get('@rae-jacob/adventure/v2'), original);
    await act(async () => app.game.start(true)); assert.equal(app.game.mapId, 'yard');
    assert.equal(app.game.progress.rainlit.metMayumi, false);
  } finally { await app.dispose(); }
});


test('the baked Rainlit Road sign can be read early without traveling or stranding the controller', async () => {
  stored.clear();
  const checkpoint = replayCheckpoint('chapter2');
  checkpoint.progress.chapterTwo.arrivalSeen = true;
  checkpoint.player = { ...checkpoint.player, x: 392, y: 185, facing: 'up' };
  stored.set('@rae-jacob/adventure/v2', JSON.stringify(checkpoint));
  const app = await mount();
  try {
    await act(async () => app.game.start(true)); await tick(4);
    assert.equal(app.game.targetId, 'rainroadEntry');
    await act(async () => app.game.act());
    assert.equal(currentDialogueId(app), 'rainroadEntry');
    await finishSpeech(app);
    assert.equal(app.game.mapId, 'bamboo'); assert.equal(app.game.mode, 'playing');
    assert.equal(app.game.progress.chapterTwo.debriefSeen, false);
    assert.equal(app.game.progress.rainlit.visited, false);
  } finally { await app.dispose(); }
});
