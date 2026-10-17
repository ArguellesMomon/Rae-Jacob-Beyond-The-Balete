import { chapterTwoAction, chapterTwoHint, chapterTwoObjective, isChapterTwoMap, parseChapterTwo } from './chapterTwo.ts';
import { BAMBOO_START, TURNING_START, freshChapterTwo } from './model.ts';
import { CLEARING_GROVE_RETURN, CLEARING_START, EMPTY_PROGRESS, GROVE_START, START, WATERWORKS_START } from './model.ts';
import type { DiscoveryId, Interaction, InteractionId, LolaTopic, MindaTopic, MangTopic, MapId, Player, Point, Progress, Rect, SaveData, TalaTopic } from './model.ts';
import { COLLIDERS, getMap } from './world.ts';
import { isResident, RESIDENT_IDS } from './residents.ts';
import { parseHistory } from './history.ts';
import { clearApproach } from './interaction.ts';
import { parseStoryChoices } from './storyChoices.ts';
import { MAP_GROUND, supportsFeet } from './walkable.ts';

export function canStand(point: Point, colliders: readonly Rect[] = COLLIDERS, mapId: MapId = 'yard'): boolean {
  const world = MAP_GROUND[mapId];
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return false;
  if (point.x < 36 || point.x > world.width - 29 || point.y < 52 || point.y > world.height - 28) return false;
  if (!supportsFeet(point, mapId)) return false;
  const foot = { x: point.x - 5, y: point.y - 5, width: 10, height: 6 };
  // Touching an edge is allowed. Floating-point drift must not turn a bridge seam
  // (for example 389.00000000000006) into a wall for the following companion.
  const epsilon = 1e-7;
  return !colliders.some(r => foot.x < r.x + r.width - epsilon && foot.x + foot.width > r.x + epsilon && foot.y < r.y + r.height - epsilon && foot.y + foot.height > r.y + epsilon);
}

export function movementSpeed(force: number): number {
  if (!Number.isFinite(force) || force < .18) return 0;
  const amount = Math.min(1, force);
  if (amount < .32) { const t = (amount - .18) / .14; return 24 * t * t * (3 - 2 * t); }
  return amount <= .8 ? 24 + 24 * (amount - .32) / .48 : 48 + 24 * (amount - .8) / .2;
}

export function stepPlayer(player: Player, input: Point, seconds: number, mapId: MapId = 'yard', progress: Progress = EMPTY_PROGRESS): Player {
  const map = getMap(mapId, progress), { colliders } = map;
  if (!canStand(player, colliders, mapId) || (mapId === 'waterworks' && !progress.bellRung && player.x > 407)) return { ...map.spawn, moving: false, stride: 0 };
  const magnitude = Math.hypot(input.x, input.y);
  if (magnitude < 0.18 || !Number.isFinite(magnitude)) return player.moving ? { ...player, moving: false } : player;
  const force = Math.min(1, magnitude);
  const speed = movementSpeed(force);
  const dt = Number.isFinite(seconds) ? Math.max(0, Math.min(seconds, 0.05)) : 0;
  const dx = input.x / magnitude * speed * dt;
  const dy = input.y / magnitude * speed * dt;
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 2));
  let { x, y } = player;
  for (let i = 0; i < steps; i++) {
    if (canStand({ x: x + dx / steps, y }, colliders, mapId)) x += dx / steps;
    if (canStand({ x, y: y + dy / steps }, colliders, mapId)) y += dy / steps;
  }
  const stablePixel = (value: number) => Math.abs(value - Math.round(value)) < 1e-7 ? Math.round(value) : value;
  x = stablePixel(x); y = stablePixel(y);
  const moved = Math.hypot(x - player.x, y - player.y);
  const diagonal = Math.abs(Math.abs(input.x) - Math.abs(input.y)) < magnitude * .12;
  const previousAxis = player.facing === 'left' || player.facing === 'right' ? 'x' : 'y';
  const facing = diagonal ? previousAxis === 'x' ? input.x > 0 ? 'right' : 'left' : input.y > 0 ? 'down' : 'up' : Math.abs(input.x) > Math.abs(input.y) ? input.x > 0 ? 'right' : 'left' : input.y > 0 ? 'down' : 'up';
  return { x, y, facing, moving: moved > 0.01, stride: player.stride + moved };
}

export function nearbyInteraction(player: Point & Partial<Pick<Player, 'facing'>>, previousId?: string, mapId: MapId = 'yard', companion?: Point, progress: Progress = EMPTY_PROGRESS): Interaction | null {
  const map = getMap(mapId, progress);
  if (!canStand(player, map.colliders, mapId)) return null;
  const items = map.interactions.map(item => item.id === 'tala' && companion ? { ...item, point: companion } : item);
  const candidates = items.filter(item => {
    const dx = item.point.x - player.x;
    const dy = item.point.y - player.y;
    if (Math.hypot(dx, dy) > 29) return false;
    if (!clearApproach(player, item, map.colliders)) return false;
    // Do not select a porch object from behind the solid house wall.
    return item.id !== 'lola' && item.id !== 'merienda' || player.y >= 187;
  });
  const facing = player.facing === 'up' ? { x: 0, y: -1 } : player.facing === 'down' ? { x: 0, y: 1 } : player.facing === 'left' ? { x: -1, y: 0 } : player.facing === 'right' ? { x: 1, y: 0 } : null;
  const score = (item: Interaction) => {
    const dx = item.point.x - player.x, dy = item.point.y - player.y, distance = Math.hypot(dx, dy);
    const behind = facing && distance > 0 && (dx * facing.x + dy * facing.y) / distance < -0.25;
    // A companion is always nearby: do not let her monopolize the action button.
    return distance + (item.id === 'tala' && companion ? 10 : 0) + (behind ? 8 : 0);
  };
  const best = candidates.sort((a, b) => score(a) - score(b))[0];
  const previous = candidates.find(item => item.id === previousId);
  if (previous && best && score(previous) <= score(best) + 3) return previous;
  return best ?? null;
}

export function objective(progress: Progress, mapId: MapId = 'yard'): string {
  if (isChapterTwoMap(mapId)) return chapterTwoObjective(progress, mapId);
  if (progress.chapterComplete) return 'Chapter 1 complete. Follow the open bamboo road east to Bagtas.';
  if (progress.bellRung) return mapId === 'waterworks' ? 'Cross the footbridge. Inspect the pale mark beyond it.' : 'Take the maintenance trail to the restored footbridge.';
  if (progress.bellHung) return 'Ring the waybell once. Give the crossing its name.';
  if (progress.bellReturned) return 'Help Minda rehang the bell at the arch.';
  if (progress.waterRestored) return mapId === 'waterworks' ? 'Take the low trail back. Return the bell to Minda.' : 'Return the waybell to Minda in Lantern Clearing.';
  if (progress.bellRecovered) return 'Restore water east with the splitter lever.';
  if (progress.flowDiverted) return 'The wheel is stopped. Retrieve the bell with a tool.';
  if (progress.visitedWaterworks) return progress.branchMoved ? 'Use the lever to divert water through the bypass.' : 'Inspect the splitter. Clear the blocked bypass.';
  if (progress.crossed) {
    if (!progress.metTala) return 'Follow the lanterns. Find someone to help.';
    if (progress.visitedGrove) {
      if (progress.discoveries.includes('speakingTube')) return mapId === 'grove' ? 'Follow the tube east to Rootwater Works.' : 'Take the grove’s eastern maintenance trail.';
      if (!progress.metMang) return mapId === 'grove' ? 'Speak to the watcher above the roots.' : 'Visit Mang Uban in the old grove.';
      if (!progress.discoveries.includes('speakingTube')) return mapId === 'grove' ? 'Trace the ringing. Inspect the bamboo tube.' : 'Return to the grove. Trace the ringing.';
      return mapId === 'grove' ? 'Follow the tube east to Rootwater Works.' : 'Take the grove’s eastern maintenance trail.';
    }
    if (!progress.talaTopics.includes('home') && !progress.groveLead) return 'Ask Tala about a way home.';
    return 'Find the path to Mang Uban’s grove.';
  }
  if (progress.foundTree) return 'A voice beneath the roots…';
  if (!progress.talkedToLola) return 'Talk to Lola on the porch';
  return 'Explore the yard. Find your kite.';
}

export function completeInteraction(progress: Progress, id: InteractionId): Progress {
  const chapterTwo = chapterTwoAction(progress, id);
  if (chapterTwo) return progress.chapterComplete ? chapterTwo : progress;
  if (id === 'afterBell') return progress.bellRung ? { ...progress, afterBellSeen: true } : progress;
  if (isResident(id)) return { ...progress, residentChats: { ...progress.residentChats, [id]: Math.min(1_000_000, (progress.residentChats[id] ?? 0) + 1) } };
  if (id === 'mangGift') return progress.bellRung ? { ...progress, ubanGiftReceived: true } : progress;
  if (id === 'listeningSeed') return progress;
  const note = (next: Progress, discovery: DiscoveryId): Progress => ({ ...next, discoveries: [...new Set([...next.discoveries, discovery])] });
  if (id === 'waterworksArrival') return { ...progress, waterworksSeen: true, talaMapHelped: true };
  if (id === 'branch') return note({ ...progress, branchMoved: true }, 'branch');
  if (id === 'lever') {
    if (!progress.branchMoved || progress.waterRestored) return note(progress, 'lever');
    const flowDiverted = !progress.flowDiverted;
    return note({ ...progress, flowDiverted, waterRestored: !flowDiverted && progress.bellRecovered }, 'lever');
  }
  if (id === 'stringBell') return progress.flowDiverted && !progress.bellRecovered ? note({ ...progress, bellRecovered: true }, 'wheelBell') : progress;
  if (id === 'rootSeal') return progress.bellRung ? note({ ...progress, rootRevealed: true, chapterComplete: true }, 'rootSeal') : progress;
  if (id === 'bellArch' && progress.bellReturned) return note(progress.bellHung ? { ...progress, bellRung: true } : { ...progress, bellHung: true }, 'bellArch');
  if (id === 'groveReturn' || id === 'lowTrail' || id === 'footbridge') return progress;
  if (id === 'lola') return { ...progress, talkedToLola: true };
  if (id === 'balete') return progress.talkedToLola ? { ...progress, foundTree: true } : progress;
  if (id === 'arrival') return { ...progress, arrivalSeen: true };
  if (id === 'tala') return { ...progress, metTala: true };
  if (id === 'minda') return { ...progress, heardMinda: true, bellReturned: progress.bellReturned || progress.waterRestored && progress.bellRecovered };
  if (id === 'grovePath') return progress.metTala ? { ...progress, groveLead: true } : progress;
  if (id === 'clearingPath') return progress;
  if (id === 'mang') return { ...progress, metMang: true, groveRevealed: true };
  if (id === 'waterworksPath') return progress.metMang || progress.discoveries.includes('speakingTube') ? { ...progress, waterworksLead: true } : progress;
  const lolaIds: Partial<Record<InteractionId, LolaTopic>> = { lolaStories: 'stories', lolaString: 'string', lolaWaiting: 'waiting' };
  const lolaTopic = lolaIds[id];
  if (lolaTopic) return progress.lolaTopics.includes(lolaTopic) ? progress : { ...progress, lolaTopics: [...progress.lolaTopics, lolaTopic] };
  const mindaIds: Partial<Record<InteractionId, MindaTopic>> = { mindaWater: 'water', mindaNeighbors: 'neighbors', mindaWaybell: 'waybell' };
  const mindaTopic = mindaIds[id];
  if (mindaTopic) return progress.mindaTopics.includes(mindaTopic) ? progress : { ...progress, mindaTopics: [...progress.mindaTopics, mindaTopic] };
  const mangIds: Partial<Record<InteractionId, MangTopic>> = { mangHome: 'home', mangRinging: 'ringing', mangForest: 'forest', mangKapre: 'kapre', mangMemory: 'memory', mangBagtas: 'bagtas' };
  const mangTopic = mangIds[id];
  if (mangTopic) return progress.mangTopics.includes(mangTopic) ? progress : { ...progress, mangTopics: [...progress.mangTopics, mangTopic] };
  const topicIds: Partial<Record<InteractionId, TalaTopic>> = { talaWhere: 'where', talaHome: 'home', talaRinging: 'ringing', talaMaps: 'maps', talaCourtesy: 'courtesy', talaJourney: 'journey' };
  const topic = topicIds[id];
  if (topic) return { ...progress, talaTopics: [...new Set([...progress.talaTopics, topic])], talaMapHelped: progress.talaMapHelped || id === 'talaMaps' && progress.visitedWaterworks };
  const discovery = id as DiscoveryId;
  return progress.discoveries.includes(discovery) ? progress : { ...progress, discoveries: [...progress.discoveries, discovery] };
}

export function crossToClearing(progress: Progress): SaveData {
  return { version: 2, mapId: 'clearing', player: { ...CLEARING_START }, progress: { ...progress, foundTree: true, crossed: true, arrivalSeen: false } };
}

export type TravelRoute = 'toBamboo' | 'toTurning' | 'bambooLoop' | 'backToBamboo' | 'backToWorks' | 'toGrove' | 'toClearing' | 'toWaterworks' | 'toGroveFromWorks' | 'toClearingFromWorks' | 'toWorksFromClearing';
export function travelRoute(progress: Progress, route: TravelRoute): SaveData | null {
  const checkpoint = (mapId: MapId, x: number, y: number, facing: Player['facing'] = 'down'): SaveData => ({ version: 2, mapId, player: { x, y, facing, moving: false, stride: 0 }, progress });
  if (route === 'toBamboo') return progress.chapterComplete ? { version: 2, mapId: 'bamboo', player: { ...BAMBOO_START }, progress: { ...progress, chapterTwo: { ...progress.chapterTwo, visited: true } } } : null;
  if (route === 'toTurning') return progress.chapterComplete && progress.chapterTwo.metBagtas ? { version: 2, mapId: 'turning', player: { ...TURNING_START }, progress: { ...progress, chapterTwo: { ...progress.chapterTwo, turningVisited: true } } } : null;
  if (route === 'bambooLoop') return progress.chapterTwo.turningSeen ? { version: 2, mapId: 'turning', player: { ...TURNING_START }, progress } : null;
  if (route === 'backToBamboo') return progress.chapterTwo.visited ? checkpoint('bamboo', 520, 267, 'left') : null;
  if (route === 'backToWorks') return progress.chapterComplete ? checkpoint('waterworks', 644, 314, 'left') : null;
  if (route === 'toWaterworks' || route === 'toWorksFromClearing') {
    if (route === 'toWaterworks' ? !progress.waterworksLead : !progress.waterRestored) return null;
    return { version: 2, mapId: 'waterworks', player: route === 'toWaterworks' ? { ...WATERWORKS_START } : { ...WATERWORKS_START, x: 375, y: 378 }, progress: { ...progress, visitedWaterworks: true } };
  }
  if (route === 'toGroveFromWorks') return checkpoint('grove', 395, 373, 'left');
  if (route === 'toClearingFromWorks') return progress.waterRestored ? checkpoint('clearing', 459, 307, 'left') : null;
  if (route === 'toGrove') {
    if (!progress.metTala) return null;
    return { version: 2, mapId: 'grove', player: { ...GROVE_START }, progress: { ...progress, groveLead: true, visitedGrove: true } };
  }
  return { version: 2, mapId: 'clearing', player: { ...CLEARING_GROVE_RETURN }, progress };
}

export function parseSave(raw: string | null): SaveData | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (![1, 2].includes(value.version) || !value.player || !value.progress) return null;
    if (value.version === 2 && !['yard', 'clearing', 'grove', 'waterworks', 'bamboo', 'turning'].includes(value.mapId)) return null;
    if (typeof value.player.x !== 'number' || typeof value.player.y !== 'number' || !Number.isFinite(value.player.x) || !Number.isFinite(value.player.y)) return null;
    const p = value.progress;
    if (typeof p.talkedToLola !== 'boolean' || typeof p.foundTree !== 'boolean' || !Array.isArray(p.discoveries)) return null;
    if (isChapterTwoMap(value.mapId) && p.chapterComplete !== true) return null;
    const validIds = ['bambooCord', 'bambooCup', 'hoofMarks', 'rainLeaves', 'trailVerse', 'pathStone', 'pathWind', 'pathWater', 'merienda', 'clothesline', 'basin', 'yardCat', 'calamansi', 'herbBed', 'sungka', 'rainJar', 'sealedRoots', 'rootHomes', 'bellArch', 'waterPath', 'speakingTube', 'oldMarker', 'rootFootprints', 'splitter', 'branch', 'lever', 'wheelBell', 'worksTube', 'rootSeal', 'lampShelf', 'messageBoard', 'dryingRack', 'seedTray', 'rainCup', 'listeningStone', 'toolRoll', 'floatGauge', 'reedChimes'];
    const topics = Array.isArray(p.talaTopics) ? p.talaTopics.filter((topic: unknown) => ['where', 'home', 'ringing', 'maps', 'courtesy', 'journey'].includes(topic as string)) : [];
    const mapId: MapId = value.version === 1 ? 'yard' : value.mapId;
    const inSilong = mapId !== 'yard';
    const mangTopics = Array.isArray(p.mangTopics) ? p.mangTopics.filter((topic: unknown) => ['home', 'ringing', 'forest', 'kapre', 'memory', 'bagtas'].includes(topic as string)) : [];
    const progress: Progress = { ...EMPTY_PROGRESS, talkedToLola: p.talkedToLola, foundTree: p.foundTree,
      discoveries: [...new Set(p.discoveries.filter((id: unknown) => typeof id === 'string' && validIds.includes(id)))] as DiscoveryId[],
      crossed: inSilong, arrivalSeen: inSilong && (p.arrivalSeen === true || mapId !== 'clearing'),
      metTala: inSilong && (p.metTala === true || mapId !== 'clearing'),
      talaTopics: [...new Set(topics)] as TalaTopic[], heardMinda: p.heardMinda === true, groveLead: p.groveLead === true || mapId === 'grove',
      visitedGrove: p.visitedGrove === true || mapId === 'grove' || mapId === 'waterworks', groveRevealed: p.groveRevealed === true || p.metMang === true,
      metMang: p.metMang === true, mangTopics: [...new Set(mangTopics)] as MangTopic[], waterworksLead: p.waterworksLead === true || mapId === 'waterworks',
      lolaTopics: [...new Set((Array.isArray(p.lolaTopics) ? p.lolaTopics : []).filter((t: unknown) => ['stories', 'string', 'waiting'].includes(t as string)))] as LolaTopic[],
      mindaTopics: [...new Set((Array.isArray(p.mindaTopics) ? p.mindaTopics : []).filter((t: unknown) => ['water', 'neighbors', 'waybell'].includes(t as string)))] as MindaTopic[] };
    // Additive v2 migration keeps earlier prototypes. Normalize puzzle dependencies so a corrupt save cannot duplicate a bell or strand Rae.
    progress.visitedWaterworks = p.visitedWaterworks === true || mapId === 'waterworks' || isChapterTwoMap(mapId);
    progress.waterworksSeen = p.waterworksSeen === true;
    progress.chapterComplete = p.chapterComplete === true && inSilong;
    progress.chapterTwo = parseChapterTwo(p.chapterTwo, progress.chapterComplete, mapId);
    progress.rootRevealed = p.rootRevealed === true || progress.chapterComplete;
    progress.bellRung = p.bellRung === true || progress.chapterComplete;
    progress.storyChoices = parseStoryChoices(p.storyChoices);
    progress.talaMapHelped = p.talaMapHelped === true && progress.visitedWaterworks;
    progress.afterBellSeen = p.afterBellSeen === true && progress.bellRung;
    progress.ubanGiftReceived = p.ubanGiftReceived === true && progress.bellRung;
    progress.residentChats = Object.fromEntries(RESIDENT_IDS.flatMap(id => {
      const count = p.residentChats?.[id];
      return typeof count === 'number' && Number.isFinite(count) && count > 0 ? [[id, Math.min(1_000_000, Math.floor(count))]] : [];
    }));
    progress.bellHung = p.bellHung === true || progress.bellRung;
    progress.bellReturned = p.bellReturned === true || progress.bellHung;
    progress.waterRestored = p.waterRestored === true || progress.bellReturned;
    progress.bellRecovered = p.bellRecovered === true || progress.waterRestored;
    progress.branchMoved = p.branchMoved === true || progress.bellRecovered;
    progress.flowDiverted = progress.branchMoved && !progress.waterRestored && (p.flowDiverted === true || progress.bellRecovered);
    if (inSilong) { progress.foundTree = true; progress.talkedToLola = true; }
    const map = getMap(mapId, progress), onLockedBank = mapId === 'waterworks' && !progress.bellRung && value.player.x > 407;
    const safe = !onLockedBank && canStand(value.player, map.colliders, mapId) ? value.player : map.spawn;
    return { version: 2, mapId, player: { ...START, x: safe.x, y: safe.y, facing: ['up', 'down', 'left', 'right'].includes(value.player.facing) ? value.player.facing : 'down' }, progress, history: parseHistory(value.history) };
  } catch { return null; }
}

export function freshSave(): SaveData {
  return { version: 2, mapId: 'yard', player: { ...START }, progress: { ...EMPTY_PROGRESS, chapterTwo: freshChapterTwo(), discoveries: [], talaTopics: [], mangTopics: [], lolaTopics: [], mindaTopics: [], residentChats: {}, storyChoices: {} } };
}

export type TrailPoint = Point & { distance: number };
export function companionSpawn(player: Player, mapId: MapId, progress: Progress): Player {
  const map = getMap(mapId, progress), leader = canStand(player, map.colliders, mapId) ? player : map.spawn;
  for (const [dx, dy] of [[-18, 0], [18, 0], [0, 18], [0, -18], [0, 0]]) {
    const length = Math.hypot(dx, dy), steps = Math.max(1, Math.ceil(length));
    let clear = true;
    for (let i = 1; i <= steps; i++) if (!canStand({ x: leader.x + dx * i / steps, y: leader.y + dy * i / steps }, map.colliders, mapId)) { clear = false; break; }
    if (clear) return { ...leader, x: leader.x + dx, y: leader.y + dy, moving: false, stride: 0 };
  }
  return { ...leader, moving: false, stride: 0 };
}
export function followTrail(companion: Player, trail: TrailPoint[], leader: Player, seconds: number, mapId: MapId, progress: Progress = EMPTY_PROGRESS): Player {
  const { colliders } = getMap(mapId, progress);
  if (!canStand(leader, colliders, mapId)) return canStand(companion, colliders, mapId) ? { ...companion, moving: false } : companionSpawn(getMap(mapId, progress).spawn, mapId, progress);
  if (!canStand(companion, colliders, mapId)) {
    trail.length = 0;
    return companionSpawn(leader, mapId, progress);
  }
  const last = trail[trail.length - 1];
  if (!last || Math.hypot(last.x - leader.x, last.y - leader.y) >= 1.5) trail.push({ x: leader.x, y: leader.y, distance: leader.stride });
  const followDistance = leader.stride - 18;
  while (trail.length > 1 && trail[1].distance <= followDistance && Math.hypot(companion.x - trail[0].x, companion.y - trail[0].y) < 3) trail.shift();
  const target = trail[0];
  if (target && !canStand(target, colliders, mapId)) { trail.length = 0; return companionSpawn(leader, mapId, progress); }
  if (!target || target.distance > followDistance) return companion.moving ? { ...companion, moving: false } : companion;
  const dx = target.x - companion.x, dy = target.y - companion.y;
  if (Math.hypot(dx, dy) < 1.5) return { ...companion, moving: false };
  const catchUp = Math.hypot(leader.x - companion.x, leader.y - companion.y) > 44 ? 1.2 : 1;
  return stepPlayer(companion, { x: dx / Math.max(1, Math.hypot(dx, dy)), y: dy / Math.max(1, Math.hypot(dx, dy)) }, Math.min(seconds * catchUp, Math.hypot(dx, dy) / 72), mapId, progress);
}

export function puzzleHint(p: Progress, level: number, mapId: MapId = 'yard'): string {
  if (isChapterTwoMap(mapId)) return chapterTwoHint(p, level);
  if (p.chapterComplete) return 'The open bamboo road on the eastern bank leads to Bagtas. You can begin Chapter 2 and return to the clearing afterward.';
  if (p.bellRung) return 'Cross the bridge at Rootwater Works. Inspect the pale circle on the root beyond the eastern bank.';
  if (p.bellHung) return 'Use the bell arch again to ring the waybell.';
  if (p.bellReturned) return 'Minda has a replacement cord. Meet her at the bell arch and interact to rehang the bell.';
  if (p.waterRestored) return 'The low trail at the southwest of Rootwater Works now reaches the clearing. Speak to Minda.';
  if (p.bellRecovered) return 'The bell is out. Use the lever once more to restore water east and drain the bridge approach.';
  if (p.flowDiverted) return level < 2 ? 'The bell’s handle is just out of reach. Rae still has something from his kite.' : 'Inspect the stopped wheel, then choose spare kite string. Rae can lower a loop around the bell’s handle.';
  if (p.branchMoved) return level < 2 ? 'The bypass has room now. Its gate is connected to the splitter lever on the middle bank.' : 'Use the lever below the diagram to send water west. The wheel will stop, making its grating safe to use.';
  return ['Minda said the other channel goes around the wheel.', 'A fallen branch blocks that bypass. There is an empty recess beside it.', 'Push the branch aside, then use the lever to send water west. Approach the wheel from its grating.'][Math.max(0, Math.min(2, level - 1))];
}
