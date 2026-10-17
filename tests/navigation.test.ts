import test from 'node:test';
import assert from 'node:assert/strict';
import { canStand, companionSpawn, followTrail, freshSave, nearbyInteraction, parseSave, stepPlayer, travelRoute } from '../src/game/engine.ts';
import type { TrailPoint, TravelRoute } from '../src/game/engine.ts';
import { getMap } from '../src/game/world.ts';
import { MAP_GROUND, supportsFeet } from '../src/game/walkable.ts';
import { EMPTY_PROGRESS, START } from '../src/game/model.ts';
import type { MapId, Point, Progress } from '../src/game/model.ts';
import { REPLAY_SCENES, replayCheckpoint } from '../src/game/replay.ts';
import { walkRoute } from './helpers/walkRoute.ts';

const maps: MapId[] = ['yard', 'clearing', 'grove', 'waterworks', 'bamboo', 'turning'];
const complete = replayCheckpoint('chapter2').progress;
const progressFor = (map: MapId) => map === 'yard' ? EMPTY_PROGRESS : complete;
const fixtures: Record<MapId, { floor: number[][]; blocked: number[][] }> = {
  yard: { floor: [[270, 252], [150, 177], [203, 202], [412, 147], [548, 182], [290, 409]], blocked: [[350, 100], [550, 80], [210, 120], [130, 410], [620, 260]] },
  clearing: { floor: [[86, 358], [188, 286], [188, 301], [292, 106], [408, 243], [459, 307]], blocked: [[340, 75], [395, 145], [550, 250], [505, 400], [200, 60], [225, 300]] },
  grove: { floor: [[224, 448], [232, 302], [331, 342], [102, 377], [308, 433], [416, 373]], blocked: [[100, 120], [238, 150], [400, 240], [414, 470], [205, 485]] },
  waterworks: { floor: [[224, 424], [264, 281], [322, 219], [385, 322], [430, 378], [584, 214], [654, 314]], blocked: [[84, 160], [130, 210], [322, 110], [432, 250], [500, 214], [224, 300], [550, 460]] },
  bamboo: { floor: [[84, 391], [84, 420], [400, 265], [330, 286], [447, 299], [553, 246], [535, 216]], blocked: [[180, 391], [400, 340], [450, 80], [320, 100], [490, 400], [553, 180], [200, 250]] },
  turning: { floor: [[320, 390], [320, 108], [110, 230], [528, 230], [151, 303], [423, 303], [355, 205]], blocked: [[250, 200], [370, 400], [450, 350], [600, 250], [320, 60], [200, 350]] },
};

test('all six maps distinguish real ground and paths from roofs, forests, water and distant scenery', () => {
  for (const id of maps) {
    const map = getMap(id, progressFor(id));
    assert.equal(map.width, MAP_GROUND[id].width); assert.equal(map.height, MAP_GROUND[id].height);
    for (const [x, y] of fixtures[id].floor) assert.ok(canStand({ x, y }, map.colliders, id), `${id}: ground ${x},${y}`);
    for (const [x, y] of fixtures[id].blocked) {
      assert.equal(canStand({ x, y }, map.colliders, id), false, `${id}: background ${x},${y}`);
      assert.equal(nearbyInteraction({ x, y }, undefined, id, undefined, progressFor(id)), null);
    }
    for (const point of [{ x: -1, y: 200 }, { x: map.width + 1, y: 200 }, { x: 300, y: -1 }, { x: 300, y: map.height + 1 }, { x: NaN, y: 200 }, { x: 100, y: Infinity }]) assert.equal(canStand(point, map.colliders, id), false);
  }
});

test('whole feet need support at path corners and bridge seams; water stays blocked even when dry', () => {
  assert.equal(supportsFeet({ x: 90, y: 230 }, 'turning'), false, 'center inside the path is insufficient');
  assert.equal(supportsFeet({ x: 92, y: 230 }, 'turning'), true);
  assert.equal(supportsFeet({ x: 110, y: 195 }, 'turning'), false);
  assert.equal(supportsFeet({ x: 110, y: 197 }, 'turning'), true);
  assert.equal(supportsFeet({ x: 274, y: 320 }, 'turning'), false, 'do not cut the concave junction corner');
  assert.equal(supportsFeet({ x: 279, y: 325 }, 'turning'), true);
  assert.equal(supportsFeet({ x: 254, y: 424 }, 'waterworks'), true, 'the union supports feet across joined ground and bridge');
  for (const diverted of [false, true]) {
    const map = getMap('waterworks', { ...complete, flowDiverted: diverted });
    for (const point of [{ x: 224, y: 300 }, { x: 432, y: 250 }]) assert.equal(canStand(point, map.colliders, 'waterworks'), false);
  }
  const locked = getMap('waterworks', replayCheckpoint('works').progress);
  assert.equal(canStand({ x: 430, y: 378 }, locked.colliders, 'waterworks'), false);
  assert.equal(canStand({ x: 430, y: 378 }, getMap('waterworks', complete).colliders, 'waterworks'), true);
  assert.equal(canStand({ x: 430, y: 388.00000000000006 }, getMap('waterworks', complete).colliders, 'waterworks'), true, 'floating-point drift cannot catch Tala on the bridge seam');
  assert.equal(canStand({ x: 430, y: 388.01 }, getMap('waterworks', complete).colliders, 'waterworks'), false, 'actual overhang into water remains blocked');
});

test('sustained directional, diagonal and delayed-frame movement never escapes a map or its ground', () => {
  for (const id of maps) {
    const progress = progressFor(id), map = getMap(id, progress);
    for (const [x, y] of fixtures[id].floor) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      let actor = { ...START, x, y };
      for (let frame = 0; frame < 120; frame++) {
        const previous = actor;
        actor = stepPlayer(actor, { x: dx, y: dy }, frame % 7 ? 1 / 30 : 10, id, progress);
        assert.ok(canStand(actor, map.colliders, id), `${id}: edge escape ${actor.x},${actor.y}`);
        assert.ok(Math.hypot(actor.x - previous.x, actor.y - previous.y) <= 3.600001, 'large delays cannot tunnel or teleport');
      }
    }
  }
});

test('Rae and Tala traverse real floor routes and settle together in every map', () => {
  const goals: Record<MapId, Point> = {
    yard: { x: 548, y: 182 }, clearing: { x: 408, y: 243 }, grove: { x: 331, y: 342 },
    waterworks: { x: 584, y: 214 }, bamboo: { x: 553, y: 246 }, turning: { x: 110, y: 230 },
  };
  for (const id of maps) {
    const progress = progressFor(id), map = getMap(id, progress);
    let leader = { ...map.spawn }, companion = companionSpawn(leader, id, progress);
    const trail: TrailPoint[] = [];
    for (const target of walkRoute(leader, goals[id], id, progress)) {
      let count = 0;
      while (Math.hypot(target.x - leader.x, target.y - leader.y) > .1 && count++ < 1200) {
        const dx = target.x - leader.x, dy = target.y - leader.y, length = Math.hypot(dx, dy);
        leader = stepPlayer(leader, { x: dx / length, y: dy / length }, Math.min(1 / 60, length / 72), id, progress);
        companion = followTrail(companion, trail, leader, 1 / 60, id, progress);
        assert.ok(canStand(leader, map.colliders, id)); assert.ok(canStand(companion, map.colliders, id));
      }
      assert.ok(count < 1200, `${id}: walking route must remain usable`);
    }
    for (let i = 0; i < 400; i++) companion = followTrail(companion, trail, leader, 1 / 60, id, progress);
    assert.ok(Math.hypot(leader.x - companion.x, leader.y - companion.y) < 26, `${id}: Tala must not strand herself at a corner`);
  }
});

test('every replay and allowed map transition places both characters on connected ground', () => {
  const ready = { ...complete, chapterTwo: { ...complete.chapterTwo, visited: true, metBagtas: true, turningSeen: true } };
  const routes: TravelRoute[] = ['toBamboo', 'toTurning', 'bambooLoop', 'backToBamboo', 'backToWorks', 'toGrove', 'toClearing', 'toWaterworks', 'toGroveFromWorks', 'toClearingFromWorks', 'toWorksFromClearing'];
  const saves = [...REPLAY_SCENES.map(scene => replayCheckpoint(scene.id)), ...routes.map(route => { const save = travelRoute(ready, route); assert.ok(save, route); return save; })];
  for (const save of saves) {
    const map = getMap(save.mapId, save.progress), companion = companionSpawn(save.player, save.mapId, save.progress);
    assert.ok(canStand(save.player, map.colliders, save.mapId), `${save.mapId}: Rae spawn`);
    assert.ok(canStand(companion, map.colliders, save.mapId), `${save.mapId}: Tala spawn`);
    for (let step = 0; step <= 18; step++) {
      const point = { x: save.player.x + (companion.x - save.player.x) * step / 18, y: save.player.y + (companion.y - save.player.y) * step / 18 };
      assert.ok(canStand(point, map.colliders, save.mapId), 'Tala cannot spawn through a wall or across water');
    }
  }
});

test('old background positions recover safely without losing discoveries, keepsakes or chapter progress', () => {
  for (const id of maps) {
    const [x, y] = fixtures[id].blocked[0], progress = { ...progressFor(id), discoveries: ['basin'] as const, ubanGiftReceived: id !== 'yard' };
    const save = { ...freshSave(), mapId: id, player: { ...START, x, y }, progress };
    const parsed = parseSave(JSON.stringify(save)); assert.ok(parsed);
    assert.ok(canStand(parsed.player, getMap(id, parsed.progress).colliders, id));
    assert.deepEqual(parsed.progress.discoveries, ['basin']);
    assert.equal(parsed.progress.chapterComplete, id !== 'yard');
    assert.equal(parsed.progress.ubanGiftReceived, id !== 'yard');
    const recovered = stepPlayer({ ...START, x, y }, { x: 0, y: 0 }, 1 / 60, id, progressFor(id));
    assert.ok(canStand(recovered, getMap(id, progressFor(id)).colliders, id), 'live invalid positions recover even with no joystick input');
  }
  const legacy = parseSave(JSON.stringify({ version: 1, player: { ...START, x: 350, y: 100 }, progress: { talkedToLola: true, foundTree: true, discoveries: ['basin'] } }));
  assert.ok(legacy); assert.deepEqual(legacy.progress.discoveries, ['basin']); assert.equal(legacy.progress.talkedToLola, true);
});

test('bad frame input and invalid companion breadcrumbs cannot leave characters outside the scene', () => {
  for (const id of maps) {
    const progress = progressFor(id), map = getMap(id, progress), leader = { ...map.spawn };
    for (const seconds of [NaN, Infinity, -1]) {
      const result = stepPlayer(leader, { x: 1, y: 0 }, seconds, id, progress);
      assert.equal(result.x, leader.x); assert.equal(result.y, leader.y);
    }
    for (const input of [{ x: NaN, y: 1 }, { x: Infinity, y: 0 }]) assert.ok(canStand(stepPlayer(leader, input, .05, id, progress), map.colliders, id));
    const trail = [{ x: -100, y: -100, distance: 0 }];
    const recovered = followTrail({ ...START, x: -100, y: -100 }, trail, leader, 1 / 60, id, progress);
    assert.ok(canStand(recovered, map.colliders, id));
    const recoveredTrail = followTrail(recovered, [{ x: -100, y: -100, distance: 0 }], { ...leader, stride: 100 }, 1 / 60, id, progress);
    assert.ok(canStand(recoveredTrail, map.colliders, id));
  }
});
