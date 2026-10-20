import { MAYUMI_TOPICS } from '../game/rainlit';
import type { MayumiTopic } from '../game/model';
import { FORKS } from '../game/chapterTwo';
import { JOURNEY_KEY, REPLAY_KEY, replayCheckpoint } from '../game/replay';
import type { SaveSlot, ReplayScene } from '../game/replay';
import { rememberLine } from '../game/history';
import { chooseStoryReply, REPLY_TONES, STORY_CHOICES } from '../game/storyChoices';
import { journeyRecap } from '../game/recap';
import { nextPaintTime, sceneRenderRate } from '../game/renderBudget';
import { CROSSING_DURATION } from '../game/crossing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, BackHandler, Platform } from 'react-native';
import { companionSpawn, completeInteraction, crossToClearing, followTrail, freshSave, nearbyInteraction, parseSave, stepPlayer, travelRoute } from '../game/engine';
import { currentMaze, newMazeSeed } from '../game/mazeTrials';
import type { TrailPoint } from '../game/engine';
import type { TravelRoute } from '../game/engine';
import { linesFor } from '../game/dialogue';
import { MANG_POINT } from '../game/world';
import { TALA_START } from '../game/model';
import type { Dialogue, HistoryEntry, InteractionId, LolaTopic, MindaTopic, MangTopic, MapId, Player, Point, Progress, ReplyTone, BagtasTopic, SaveData, TalaTopic } from '../game/model';

type Mode = 'springRestoring' | 'springSealing' | 'mayumiQuestions' | 'chapterTwoEnding' | 'title' | 'playing' | 'paused' | 'notebook' | 'ending' | 'crossing' | 'questions' | 'revealing' | 'mangQuestions' | 'lolaQuestions' | 'mindaQuestions' | 'tools' | 'retrieving' | 'sealRevealing' | 'settings' | 'history' | 'replayMenu' | 'reply' | 'watching' | 'bagtasQuestions' | 'pathTurning';
const SAVE_KEY = JOURNEY_KEY;
const LEGACY_KEY = '@rae-jacob/yard/v1';
const ZERO = { x: 0, y: 0 };
const TOPIC_IDS: Record<TalaTopic, InteractionId> = { where: 'talaWhere', home: 'talaHome', ringing: 'talaRinging', maps: 'talaMaps', courtesy: 'talaCourtesy', journey: 'talaJourney' };
const MANG_TOPIC_IDS: Record<MangTopic, InteractionId> = { home: 'mangHome', ringing: 'mangRinging', forest: 'mangForest', kapre: 'mangKapre', memory: 'mangMemory', bagtas: 'mangBagtas' };
const LOLA_TOPIC_IDS: Record<LolaTopic, InteractionId> = { stories: 'lolaStories', string: 'lolaString', waiting: 'lolaWaiting' };
const BAGTAS_TOPIC_IDS: Record<BagtasTopic, InteractionId> = { paths: 'bagtasPaths', stories: 'bagtasStories', seals: 'bagtasSeals' };
const MINDA_TOPIC_IDS: Record<MindaTopic, InteractionId> = { water: 'mindaWater', neighbors: 'mindaNeighbors', waybell: 'mindaWaybell' };

export function useAdventureGame() {
  const initial = freshSave();
  const [mode, setMode] = useState<Mode>('title');
  const modeRef = useRef<Mode>('title');
  const settingsReturn = useRef<Mode>('title');
  const historyReturn = useRef<Mode>('playing');
  const replayReturn = useRef<Mode>('title');
  const [slot, setSlot] = useState<SaveSlot>('journey');
  const slotRef = useRef<SaveSlot>('journey');
  const [replaySaved, setReplaySaved] = useState<SaveData | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [recap, setRecap] = useState<string | null>(null);
  const historyRef = useRef<HistoryEntry[]>([]);
  const [mapId, setMapId] = useState<MapId>('yard');
  const mapRef = useRef<MapId>('yard');
  const [player, setPlayer] = useState(initial.player);
  const playerRef = useRef(initial.player);
  const [companion, setCompanion] = useState<Player>({ ...TALA_START });
  const companionRef = useRef<Player>({ ...TALA_START });
  const trail = useRef<TrailPoint[]>([]);
  const [progress, setProgress] = useState<Progress>(initial.progress);
  const progressRef = useRef(initial.progress);
  const [saved, setSaved] = useState<SaveData | null>(null);
  const snapshots = useRef<Record<SaveSlot, SaveData | null>>({ journey: null, replay: null });
  const [loaded, setLoaded] = useState(false);
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const dialogueRef = useRef<Dialogue | null>(null);
  const input = useRef<Point>(ZERO);
  const keys = useRef(new Set<string>());
  const [clock, setClock] = useState(0);
  const [transition, setTransition] = useState(0);
  const transitionElapsed = useRef(0);
  const [reveal, setReveal] = useState(0);
  const revealElapsed = useRef(0);
  const [sceneTime, setSceneTime] = useState(0);
  const sceneElapsed = useRef(0);
  const [saveIssue, setSaveIssue] = useState(false);
  const saveQueue = useRef(Promise.resolve());
  const lastSaved = useRef({ journey: '', replay: '' });
  const hasStarted = useRef(false);
  const focus = useRef(true);
  const targetRef = useRef<InteractionId | undefined>(undefined);
  const [targetId, setTargetId] = useState<InteractionId | undefined>(undefined);

  const stop = useCallback(() => { input.current = ZERO; keys.current.clear(); }, []);
  const changeMode = useCallback((next: Mode) => {
    if (next === 'playing' && dialogueRef.current?.lines[dialogueRef.current.index]?.choice) next = 'reply';
    stop(); modeRef.current = next; setMode(next);
    if (next !== 'playing') {
      playerRef.current = { ...playerRef.current, moving: false }; setPlayer(playerRef.current);
      companionRef.current = { ...companionRef.current, moving: false }; setCompanion(companionRef.current);
    }
  }, [stop]);

  const record = useCallback((next: Dialogue) => { historyRef.current = rememberLine(historyRef.current, next, mapRef.current); setHistory(historyRef.current); }, []);

  const persist = useCallback((force = false) => {
    if (!hasStarted.current) return;
    const destination = slotRef.current;
    const snapshot: SaveData = { version: 2, mapId: mapRef.current,
      player: { ...playerRef.current, moving: false, stride: 0 },
      history: [...historyRef.current], progress: { ...progressRef.current, rainlit: { ...progressRef.current.rainlit, topics: [...progressRef.current.rainlit.topics] }, chapterTwo: { ...progressRef.current.chapterTwo, topics: [...progressRef.current.chapterTwo.topics] }, discoveries: [...progressRef.current.discoveries], talaTopics: [...progressRef.current.talaTopics], mangTopics: [...progressRef.current.mangTopics], lolaTopics: [...progressRef.current.lolaTopics], mindaTopics: [...progressRef.current.mindaTopics], residentChats: { ...progressRef.current.residentChats }, storyChoices: { ...progressRef.current.storyChoices } } };
    snapshots.current[destination] = snapshot;
    const raw = JSON.stringify(snapshot);
    if (!force && raw === lastSaved.current[destination]) return;
    lastSaved.current[destination] = raw;
    saveQueue.current = saveQueue.current.then(async () => {
      try { await AsyncStorage.setItem(destination === 'journey' ? SAVE_KEY : REPLAY_KEY, raw); if (destination === 'journey') setSaved(snapshot); else setReplaySaved(snapshot); setSaveIssue(false); }
      catch { lastSaved.current[destination] = ''; setSaveIssue(true); }
    });
  }, []);

  useEffect(() => {
    let live = true;
    Promise.all([AsyncStorage.getItem(SAVE_KEY), AsyncStorage.getItem(LEGACY_KEY), AsyncStorage.getItem(REPLAY_KEY)]).then(([raw, legacy, replay]) => {
      if (live) { snapshots.current = { journey: parseSave(raw ?? legacy), replay: parseSave(replay) }; setSaved(snapshots.current.journey); setReplaySaved(snapshots.current.replay); setLoaded(true); }
    }).catch(() => { if (live) { setLoaded(true); setSaveIssue(true); } });
    return () => { live = false; };
  }, []);

  const showDialogue = useCallback((id: InteractionId) => {
    stop(); playerRef.current = { ...playerRef.current, moving: false }; setPlayer(playerRef.current);
    companionRef.current = { ...companionRef.current, moving: false }; setCompanion(companionRef.current);
    if (id === 'listeningSeed' && mapRef.current === 'spring' && progressRef.current.rainlit.metMayumi) id = 'springSeed';
    if (id === 'mang' && progressRef.current.metMang && progressRef.current.bellRung && !progressRef.current.ubanGiftReceived) id = 'mangGift';
    if (id === 'bagtas' && progressRef.current.chapterTwo.routeVerified && !progressRef.current.chapterTwo.debriefSeen) id = 'bagtasDebrief';
    if (id === 'afterBell') {
      playerRef.current = { ...playerRef.current, facing: 'up' }; setPlayer(playerRef.current);
      companionRef.current = { ...companionSpawn(playerRef.current, mapRef.current, progressRef.current), facing: 'up' }; setCompanion(companionRef.current);
      trail.current = [];
    }
    const next: Dialogue = { id, lines: linesFor(id, progressRef.current, mapRef.current), index: 0 };
    // World actions take effect on activation, so their visible result accompanies the dialogue.
    // The dialogue records the transaction to prevent a second lever toggle on its last line.
    if (id === 'springBrace' || id === 'springBasket' || id === 'branch' || id === 'lever' || id === 'bellArch') {
      progressRef.current = completeInteraction(progressRef.current, id); setProgress(progressRef.current);
      next.effectApplied = true;
    }
    dialogueRef.current = next; setDialogue(next); record(next); persist(true);
  }, [persist, record, stop]);

  const land = useCallback((paused = false) => {
    if (modeRef.current !== 'crossing') return;
    transitionElapsed.current = CROSSING_DURATION; setTransition(1);
    showDialogue('arrival'); changeMode(paused ? 'paused' : 'playing'); persist(true);
  }, [changeMode, persist, showDialogue]);

  const beginCrossing = useCallback(() => {
    const next = crossToClearing(progressRef.current);
    // Commit a safe arrival checkpoint BEFORE the animation so interruptions cannot strand Rae.
    mapRef.current = next.mapId; setMapId(next.mapId);
    progressRef.current = next.progress; setProgress(next.progress);
    playerRef.current = next.player; setPlayer(next.player);
    companionRef.current = { ...TALA_START }; setCompanion(companionRef.current); trail.current = [];
    targetRef.current = undefined; setTargetId(undefined);
    dialogueRef.current = null; setDialogue(null);
    transitionElapsed.current = 0; setTransition(0); changeMode('crossing'); persist(true);
  }, [changeMode, persist]);

  const finishReveal = useCallback((paused = false) => {
    if (modeRef.current !== 'revealing') return;
    revealElapsed.current = 4.2; setReveal(1);
    progressRef.current = { ...progressRef.current, groveRevealed: true }; setProgress(progressRef.current);
    showDialogue('mang'); changeMode(paused ? 'paused' : 'playing'); persist(true);
  }, [changeMode, persist, showDialogue]);

  const beginReveal = useCallback(() => {
    playerRef.current = { ...playerRef.current, facing: 'up' }; setPlayer(playerRef.current);
    revealElapsed.current = 0; setReveal(0); changeMode('revealing'); persist(true);
  }, [changeMode, persist]);

  const finishScene = useCallback((paused = false) => {
    const scene = modeRef.current;
    if (scene === 'springRestoring' || scene === 'springSealing') {
      setSceneTime(1); showDialogue(scene === 'springRestoring' ? 'springSettle' : 'springSeal');
      changeMode(paused ? 'paused' : 'playing'); persist(true); return;
    }
    if (scene === 'pathTurning') { setSceneTime(1); changeMode(paused ? 'paused' : 'playing'); persist(true); return; }
    if (scene !== 'retrieving' && scene !== 'sealRevealing' && scene !== 'watching') return;
    if (scene === 'sealRevealing') { progressRef.current = { ...progressRef.current, rootRevealed: true }; setProgress(progressRef.current); }
    setSceneTime(1); showDialogue(scene === 'retrieving' ? 'stringBell' : scene === 'watching' ? 'afterBell' : 'rootSeal');
    changeMode(paused ? 'paused' : 'playing'); persist(true);
  }, [changeMode, persist, showDialogue]);

  const useString = useCallback(() => {
    if (modeRef.current !== 'tools' || !progressRef.current.flowDiverted || progressRef.current.bellRecovered) return;
    progressRef.current = completeInteraction(progressRef.current, 'stringBell'); setProgress(progressRef.current);
    sceneElapsed.current = 0; setSceneTime(0); changeMode('retrieving'); persist(true);
  }, [changeMode, persist]);

  const travel = useCallback((route: TravelRoute) => {
    const next = travelRoute(progressRef.current, route);
    if (!next) return;
    mapRef.current = next.mapId; setMapId(next.mapId);
    playerRef.current = next.player; setPlayer(next.player);
    progressRef.current = next.progress; setProgress(next.progress);
    companionRef.current = companionSpawn(next.player, next.mapId, next.progress); setCompanion(companionRef.current);
    trail.current = [{ x: next.player.x, y: next.player.y, distance: 0 }];
    dialogueRef.current = null; setDialogue(null); targetRef.current = undefined; setTargetId(undefined);
    changeMode('playing');
    if (next.mapId === 'rainroad' && !next.progress.rainlit.roadSeen) showDialogue('rainroadArrival');
    if (next.mapId === 'hamlet' && !next.progress.rainlit.hamletSeen) showDialogue('hamletArrival');
    if (next.mapId === 'spring') {
      if (!next.progress.rainlit.springSeen) showDialogue('springArrival');
      else if (next.progress.rainlit.sealSeen && !next.progress.rainlit.complete) showDialogue('springSeal');
    }
    if (next.mapId === 'bamboo' && !next.progress.chapterTwo.arrivalSeen) showDialogue('bambooArrival');
    if (next.mapId === 'turning' && !next.progress.chapterTwo.turningSeen) showDialogue('turningArrival');
    if (next.mapId === 'waterworks' && !next.progress.waterworksSeen) showDialogue('waterworksArrival');
    persist(true);
  }, [changeMode, persist, showDialogue]);

  const beginAfterBell = useCallback(() => {
    playerRef.current = { ...playerRef.current, moving: false, facing: 'up' }; setPlayer(playerRef.current);
    companionRef.current = { ...companionSpawn(playerRef.current, mapRef.current, progressRef.current), facing: 'up' }; setCompanion(companionRef.current);
    trail.current = []; sceneElapsed.current = 0; setSceneTime(0); changeMode('watching'); persist(true);
  }, [changeMode, persist]);

  const start = useCallback((resume: boolean, destination: SaveSlot = 'journey', checkpoint?: ReplayScene) => {
    persist(true);
    const storedSave = snapshots.current[destination] ?? (destination === 'journey' ? saved : replaySaved);
    let next = destination === 'replay' && checkpoint ? replayCheckpoint(checkpoint) : resume && storedSave ? storedSave : freshSave();
    if (destination === 'replay' && checkpoint && next.mapId === 'turning') {
      const progress = {...next.progress,chapterTwo:{...next.progress.chapterTwo,mazeSeed:newMazeSeed()}};
      next={...next,progress,player:{...next.player,...currentMaze(progress).spawn}};
    }
    setRecap(resume && storedSave && !checkpoint ? journeyRecap(next.progress, next.mapId) : null);
    slotRef.current = destination; setSlot(destination);
    historyRef.current = [...(next.history ?? [])]; setHistory(historyRef.current);
    lastSaved.current[destination] = '';
    setSaveIssue(false);
    mapRef.current = next.mapId; setMapId(next.mapId);
    playerRef.current = { ...next.player, moving: false, stride: 0 }; setPlayer(playerRef.current);
    progressRef.current = { ...next.progress, rainlit: { ...next.progress.rainlit, topics: [...next.progress.rainlit.topics] }, chapterTwo: { ...next.progress.chapterTwo, topics: [...next.progress.chapterTwo.topics] }, discoveries: [...next.progress.discoveries], talaTopics: [...next.progress.talaTopics], mangTopics: [...next.progress.mangTopics], lolaTopics: [...next.progress.lolaTopics], mindaTopics: [...next.progress.mindaTopics], residentChats: { ...next.progress.residentChats }, storyChoices: { ...next.progress.storyChoices } }; setProgress(progressRef.current);
    companionRef.current = next.progress.metTala ? companionSpawn(playerRef.current, next.mapId, next.progress) : { ...TALA_START }; setCompanion(companionRef.current);
    trail.current = [{ x: playerRef.current.x, y: playerRef.current.y, distance: 0 }];
    dialogueRef.current = null; setDialogue(null); hasStarted.current = true;
    targetRef.current = undefined; setTargetId(undefined);
    // Old completed yard saves continue directly into the new sequence.
    if (next.mapId === 'yard' && next.progress.foundTree && next.progress.talkedToLola) { beginCrossing(); return; }
    changeMode('playing');
    if (next.mapId === 'rainroad' && !next.progress.rainlit.roadSeen) showDialogue('rainroadArrival');
    if (next.mapId === 'hamlet' && !next.progress.rainlit.hamletSeen) showDialogue('hamletArrival');
    if (next.mapId === 'spring') {
      if (!next.progress.rainlit.springSeen) showDialogue('springArrival');
      else if (next.progress.rainlit.sealSeen && !next.progress.rainlit.complete) showDialogue('springSeal');
    }
    if (next.mapId === 'bamboo' && !next.progress.chapterTwo.arrivalSeen) showDialogue('bambooArrival');
    if (next.mapId === 'turning' && (!next.progress.chapterTwo.turningSeen || checkpoint === 'bambooWind' || checkpoint === 'bambooWater')) showDialogue('turningArrival');
    if (next.mapId === 'clearing' && !next.progress.arrivalSeen) showDialogue('arrival');
    if (next.mapId === 'grove' && next.progress.groveRevealed && !next.progress.metMang) showDialogue('mang');
    if (next.mapId === 'waterworks' && !next.progress.waterworksSeen) showDialogue('waterworksArrival');
    else if (next.mapId === 'waterworks' && next.progress.rootRevealed && !next.progress.chapterComplete) showDialogue('rootSeal');
    if (next.mapId === 'clearing' && next.progress.bellRung && !next.progress.afterBellSeen && !next.progress.chapterComplete && Math.hypot(next.player.x - 382, next.player.y - 337) < 85) {
      if (checkpoint === 'restored') beginAfterBell(); else showDialogue('afterBell');
    }
    persist(true);
  }, [beginAfterBell, beginCrossing, changeMode, persist, replaySaved, saved, showDialogue]);

  const finishDialogue = useCallback((id: InteractionId, effectApplied = false) => {
    const chapterWasComplete = progressRef.current.chapterComplete;
    const rainlitWasComplete = progressRef.current.rainlit.complete;
    const trialBefore = progressRef.current.chapterTwo.trailStep;
    const next = effectApplied ? progressRef.current : completeInteraction(progressRef.current, id);
    progressRef.current = next; setProgress(next);
    const rainRoutes: Partial<Record<InteractionId, TravelRoute>> = { rainroadEntry: 'toRainroad', roadReturn: 'backToShelter', hamletEntry: 'toHamlet', hamletReturn: 'backToRoad', springEntry: 'toSpring', springReturn: 'backToHamlet' };
    const onward = rainRoutes[id];
    if (onward) { travel(onward); return; }
    if (id === 'mayumi' && next.rainlit.restored && !next.rainlit.sealSeen) {
      progressRef.current = { ...next, rainlit: { ...next.rainlit, sealSeen: true } }; setProgress(progressRef.current);
      sceneElapsed.current = 0; setSceneTime(0); changeMode('springSealing'); persist(true); return;
    }
    if (id === 'springSeal' && next.rainlit.complete && !rainlitWasComplete) changeMode('chapterTwoEnding');
    if (id === 'mayumi' || Object.values(MAYUMI_TOPICS).includes(id)) changeMode('mayumiQuestions');
    if (id === 'bambooDeparture' && next.chapterComplete) { travel('toBamboo'); return; }
    if (id === 'turningEntry' && next.chapterTwo.metBagtas) { travel('toTurning'); return; }
    if (id === 'bambooReturn') { travel('backToWorks'); return; }
    if (id === 'turningReturn') { travel('backToBamboo'); return; }
    if (FORKS.includes(id as typeof FORKS[number]) && next.chapterTwo.trailStep > trialBefore) {
      travel(next.chapterTwo.routeVerified ? 'backToBamboo' : 'bambooLoop');
      sceneElapsed.current = 0; setSceneTime(0); changeMode('pathTurning'); persist(true); return;
    }
    if (id === 'bagtas' || id === 'bagtasDebrief' || Object.values(BAGTAS_TOPIC_IDS).includes(id)) changeMode('bagtasQuestions');
    if (id === 'bellArch' && next.bellRung && !next.afterBellSeen) { beginAfterBell(); return; }
    if (id === 'mang' && next.bellRung && !next.ubanGiftReceived) { showDialogue('mangGift'); persist(true); return; }
    if (id === 'balete' && next.foundTree) { beginCrossing(); return; }
    if (id === 'tala') {
      trail.current = [{ x: playerRef.current.x, y: playerRef.current.y, distance: playerRef.current.stride }];
      changeMode('questions');
    }
    if (Object.values(TOPIC_IDS).includes(id)) changeMode('questions');
    if (id === 'lola' || Object.values(LOLA_TOPIC_IDS).includes(id)) changeMode('lolaQuestions');
    if (id === 'minda' || Object.values(MINDA_TOPIC_IDS).includes(id)) changeMode('mindaQuestions');
    if (id === 'grovePath' && next.groveLead) { travel('toGrove'); return; }
    if (id === 'clearingPath') { travel('toClearing'); return; }
    if (id === 'mang' || id === 'mangGift' || Object.values(MANG_TOPIC_IDS).includes(id)) changeMode('mangQuestions');
    if (id === 'waterworksPath' && next.waterworksLead) { travel('toWaterworks'); return; }
    if (id === 'groveReturn') { travel('toGroveFromWorks'); return; }
    if (id === 'lowTrail' && next.waterRestored) { travel('toClearingFromWorks'); return; }
    if (id === 'waterPath' && next.waterRestored) { travel('toWorksFromClearing'); return; }
    if (id === 'wheelBell' && next.flowDiverted && !next.bellRecovered) changeMode('tools');
    if (id === 'rootSeal' && next.chapterComplete && !chapterWasComplete) changeMode('ending');
    persist(true);
  }, [beginAfterBell, beginCrossing, changeMode, persist, showDialogue, travel]);

  const askMayumi = useCallback((topic: MayumiTopic) => { if (progressRef.current.rainlit.metMayumi && MAYUMI_TOPICS[topic]) { changeMode('playing'); showDialogue(MAYUMI_TOPICS[topic]); } }, [changeMode, showDialogue]);
  const askBagtas = useCallback((topic: BagtasTopic) => { changeMode('playing'); showDialogue(BAGTAS_TOPIC_IDS[topic]); }, [changeMode, showDialogue]);
  const askTala = useCallback((topic: TalaTopic) => { changeMode('playing'); showDialogue(TOPIC_IDS[topic]); }, [changeMode, showDialogue]);
  const askMang = useCallback((topic: MangTopic) => { changeMode('playing'); showDialogue(MANG_TOPIC_IDS[topic]); }, [changeMode, showDialogue]);
  const askLola = useCallback((topic: LolaTopic) => { changeMode('playing'); showDialogue(LOLA_TOPIC_IDS[topic]); }, [changeMode, showDialogue]);
  const askMinda = useCallback((topic: MindaTopic) => { changeMode('playing'); showDialogue(MINDA_TOPIC_IDS[topic]); }, [changeMode, showDialogue]);
  const act = useCallback(() => {
    if (modeRef.current !== 'playing') return;
    const current = dialogueRef.current;
    if (current) {
      if (current.index + 1 < current.lines.length) {
        const next = { ...current, index: current.index + 1 }; dialogueRef.current = next; setDialogue(next); record(next); changeMode('playing'); persist();
      } else { dialogueRef.current = null; setDialogue(null); finishDialogue(current.id, current.effectApplied); }
      return;
    }
    const item = nearbyInteraction(playerRef.current, targetRef.current, mapRef.current, progressRef.current.metTala ? companionRef.current : undefined, progressRef.current);
    if (!item) return;
    if (item.id === 'springBrace' && progressRef.current.rainlit.basketFreed && !progressRef.current.rainlit.restored) {
      progressRef.current = completeInteraction(progressRef.current, 'springSettle'); setProgress(progressRef.current);
      sceneElapsed.current = 0; setSceneTime(0); changeMode('springRestoring'); persist(true); return;
    }
    if (item.id === 'mang' && !progressRef.current.groveRevealed) { beginReveal(); return; }
    if (item.id === 'rootSeal' && progressRef.current.bellRung && !progressRef.current.rootRevealed) { sceneElapsed.current = 0; setSceneTime(0); changeMode('sealRevealing'); return; }
    const dx = item.point.x - playerRef.current.x, dy = item.point.y - playerRef.current.y;
    playerRef.current = { ...playerRef.current, facing: Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'down' : 'up' };
    if (item.id === 'tala') {
      companionRef.current = { ...companionRef.current, facing: dy > 0 ? 'up' : 'down' }; setCompanion(companionRef.current);
    }
    showDialogue(item.id);
  }, [beginReveal, changeMode, finishDialogue, persist, record, showDialogue]);

  const chooseReply = useCallback((tone: ReplyTone) => {
    if (modeRef.current !== 'reply' || !REPLY_TONES.includes(tone)) return;
    const current = dialogueRef.current, line = current?.lines[current.index];
    if (!current || !line?.choice || progressRef.current.storyChoices[line.choice]) return;
    const choice = line.choice, { choice: _choice, ...spoken } = line;
    progressRef.current = chooseStoryReply(progressRef.current, choice, tone); setProgress(progressRef.current);
    const next: Dialogue = { ...current, lines: [...current.lines.slice(0, current.index), spoken, ...STORY_CHOICES[choice].replies[tone].lines, ...current.lines.slice(current.index + 1)], index: current.index + 1 };
    dialogueRef.current = next; setDialogue(next); record(next); changeMode('playing'); persist(true);
  }, [changeMode, persist, record]);

  const pause = useCallback(() => { persist(); changeMode('paused'); }, [changeMode, persist]);
  const title = useCallback(() => { persist(); dialogueRef.current = null; setDialogue(null); changeMode('title'); }, [changeMode, persist]);
  const openSettings = useCallback(() => { settingsReturn.current = modeRef.current; persist(); changeMode('settings'); }, [changeMode, persist]);
  const closeSettings = useCallback(() => changeMode(settingsReturn.current), [changeMode]);
  const openHistory = useCallback(() => { if (modeRef.current === 'history') return; historyReturn.current = modeRef.current; persist(); changeMode('history'); }, [changeMode, persist]);
  const closeHistory = useCallback(() => changeMode(historyReturn.current), [changeMode]);
  const openReplay = useCallback(() => { if (modeRef.current === 'replayMenu') return; replayReturn.current = modeRef.current; persist(); changeMode('replayMenu'); }, [changeMode, persist]);
  const closeReplay = useCallback(() => changeMode(replayReturn.current), [changeMode]);

  useEffect(() => {
    let request = 0, previous = 0, painted = 0, elapsed = 0;
    const frame = (now: number) => {
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0; previous = now;
      const rate=sceneRenderRate(modeRef.current,!!dialogueRef.current,focus.current);
      if (rate>0) elapsed += dt;
      if (modeRef.current === 'crossing' && focus.current) {
        transitionElapsed.current += dt;
        if (transitionElapsed.current >= CROSSING_DURATION) land();
      }
      if (modeRef.current === 'revealing' && focus.current) {
        revealElapsed.current += dt;
        if (revealElapsed.current >= 4.2) finishReveal();
      }
      if ((modeRef.current === 'retrieving' || modeRef.current === 'sealRevealing' || modeRef.current === 'watching' || modeRef.current === 'pathTurning' || modeRef.current === 'springRestoring' || modeRef.current === 'springSealing') && focus.current) {
        sceneElapsed.current += dt;
        if (sceneElapsed.current >= (modeRef.current === 'pathTurning' ? 1.2 : modeRef.current === 'springSealing' ? 4 : modeRef.current === 'springRestoring' ? 3.4 : 2.8)) finishScene();
      }
      if (modeRef.current === 'playing' && !dialogueRef.current && focus.current) {
        const k = keys.current;
        const keyboard = { x: Number(k.has('d') || k.has('arrowright')) - Number(k.has('a') || k.has('arrowleft')), y: Number(k.has('s') || k.has('arrowdown')) - Number(k.has('w') || k.has('arrowup')) };
        playerRef.current = stepPlayer(playerRef.current, keyboard.x || keyboard.y ? keyboard : input.current, dt, mapRef.current, progressRef.current);
        if (mapRef.current === 'clearing') {
          if (!progressRef.current.metTala && progressRef.current.arrivalSeen && Math.hypot(playerRef.current.x - TALA_START.x, playerRef.current.y - TALA_START.y) < 34) showDialogue('tala');
        }
        if (mapRef.current !== 'yard' && progressRef.current.metTala) companionRef.current = followTrail(companionRef.current, trail.current, playerRef.current, dt, mapRef.current, progressRef.current);
        if (mapRef.current === 'grove' && !progressRef.current.groveRevealed && Math.hypot(playerRef.current.x - MANG_POINT.x, playerRef.current.y - MANG_POINT.y) < 51) beginReveal();
      }
      const nextPaint=nextPaintTime(painted,now,rate);
      if (nextPaint!==null) {
        // Keep the fractional remainder so 60 Hz timestamps do not accidentally
        // turn a 30 fps budget into irregular 20 fps updates.
        painted=nextPaint;
        if (focus.current) setClock(elapsed);
        if (modeRef.current === 'crossing') setTransition(Math.min(1, transitionElapsed.current / CROSSING_DURATION));
        if (modeRef.current === 'revealing') setReveal(Math.min(1, revealElapsed.current / 4.2));
        if (modeRef.current === 'retrieving' || modeRef.current === 'sealRevealing' || modeRef.current === 'watching' || modeRef.current === 'pathTurning' || modeRef.current === 'springRestoring' || modeRef.current === 'springSealing') setSceneTime(Math.min(1, sceneElapsed.current / (modeRef.current === 'pathTurning' ? 1.2 : modeRef.current === 'springSealing' ? 4 : modeRef.current === 'springRestoring' ? 3.4 : 2.8)));
        if (modeRef.current === 'playing' && !dialogueRef.current) {
          setPlayer(playerRef.current); setCompanion(companionRef.current);
          const target = nearbyInteraction(playerRef.current, targetRef.current, mapRef.current, progressRef.current.metTala ? companionRef.current : undefined, progressRef.current)?.id;
          if (target !== targetRef.current) { targetRef.current = target; setTargetId(target); }
        }
      }
      request = requestAnimationFrame(frame);
    };
    request = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(request);
  }, [beginReveal, finishReveal, finishScene, land, showDialogue]);

  useEffect(() => {
    const timer = setInterval(() => persist(), 2500);
    const state = AppState.addEventListener('change', next => {
      focus.current = next === 'active';
      if (!focus.current) {
        stop();
        if (modeRef.current === 'crossing') land(true);
        else if (modeRef.current === 'revealing') finishReveal(true);
        else if (modeRef.current === 'retrieving' || modeRef.current === 'sealRevealing' || modeRef.current === 'watching' || modeRef.current === 'pathTurning' || modeRef.current === 'springRestoring' || modeRef.current === 'springSealing') finishScene(true);
        else if (['playing', 'reply', 'questions', 'mangQuestions', 'bagtasQuestions', 'mayumiQuestions', 'lolaQuestions', 'mindaQuestions', 'tools'].includes(modeRef.current)) changeMode('paused');
        persist();
      }
    });
    return () => { clearInterval(timer); state.remove(); persist(); };
  }, [changeMode, finishReveal, finishScene, land, persist, stop]);

  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', () => {
      if (modeRef.current === 'replayMenu') { closeReplay(); return true; }
      if (modeRef.current === 'history') { closeHistory(); return true; }
      if (modeRef.current === 'settings') { closeSettings(); return true; }
      if (modeRef.current === 'crossing') { land(true); return true; }
      if (modeRef.current === 'revealing') { finishReveal(true); return true; }
      if (modeRef.current === 'retrieving' || modeRef.current === 'sealRevealing' || modeRef.current === 'watching' || modeRef.current === 'pathTurning' || modeRef.current === 'springRestoring' || modeRef.current === 'springSealing') { finishScene(true); return true; }
      if (modeRef.current === 'playing' || modeRef.current === 'reply') { pause(); return true; }
      if (['paused', 'notebook', 'ending', 'chapterTwoEnding', 'questions', 'mangQuestions', 'bagtasQuestions', 'mayumiQuestions', 'lolaQuestions', 'mindaQuestions', 'tools'].includes(modeRef.current)) { changeMode('playing'); return true; }
      return false;
    });
    return () => back.remove();
  }, [changeMode, closeHistory, closeReplay, closeSettings, finishReveal, finishScene, land, pause]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const movement = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (movement.includes(key) && modeRef.current === 'playing' && !dialogueRef.current) { event.preventDefault(); keys.current.add(key); }
      if (event.repeat) return;
      if (modeRef.current === 'reply' && ['1', '2', '3'].includes(key)) { event.preventDefault(); chooseReply(REPLY_TONES[Number(key) - 1]); return; }
      if (['e', ' ', 'enter'].includes(key) && modeRef.current === 'playing') { event.preventDefault(); act(); }
      if (key === 'escape') {
        if (modeRef.current === 'replayMenu') closeReplay();
        else if (modeRef.current === 'history') closeHistory();
        else if (modeRef.current === 'settings') closeSettings();
        else if (modeRef.current === 'crossing') land(true);
        else if (modeRef.current === 'revealing') finishReveal(true);
        else if (modeRef.current === 'retrieving' || modeRef.current === 'sealRevealing' || modeRef.current === 'watching' || modeRef.current === 'pathTurning' || modeRef.current === 'springRestoring' || modeRef.current === 'springSealing') finishScene(true);
        else if (modeRef.current === 'playing' || modeRef.current === 'reply') pause();
        else if (['paused', 'notebook', 'questions', 'mangQuestions', 'bagtasQuestions', 'mayumiQuestions', 'lolaQuestions', 'mindaQuestions', 'ending', 'chapterTwoEnding', 'tools'].includes(modeRef.current)) changeMode('playing');
      }
      if (key === 'h' && (modeRef.current === 'playing' || modeRef.current === 'reply')) { event.preventDefault(); openHistory(); }
      if (key === 'n' && !dialogueRef.current) { if (modeRef.current === 'playing') changeMode('notebook'); else if (modeRef.current === 'notebook') changeMode('playing'); }
    };
    const up = (event: KeyboardEvent) => keys.current.delete(event.key.toLowerCase());
    const blur = () => { stop(); if (modeRef.current === 'crossing') land(true); else if (modeRef.current === 'revealing') finishReveal(true); else if (modeRef.current === 'retrieving' || modeRef.current === 'sealRevealing' || modeRef.current === 'watching' || modeRef.current === 'pathTurning' || modeRef.current === 'springRestoring' || modeRef.current === 'springSealing') finishScene(true); else if (['playing', 'reply', 'questions', 'mangQuestions', 'bagtasQuestions', 'mayumiQuestions', 'lolaQuestions', 'mindaQuestions', 'tools'].includes(modeRef.current)) pause(); };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', blur);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', blur); };
  }, [act, changeMode, chooseReply, closeHistory, closeReplay, closeSettings, finishReveal, finishScene, land, openHistory, pause, stop]);

  const setInput=useCallback((value:Point)=>{input.current=value;},[]);
  return { mode, mapId, player, companion, progress, saved, replaySaved, slot, history, recap, dismissRecap: () => setRecap(null), chooseReply, loaded, dialogue, clock, transition, reveal, sceneTime, saveIssue, targetId,
    inspectKeepsake: () => { if (progressRef.current.ubanGiftReceived) { changeMode('playing'); showDialogue('listeningSeed'); } },
    beginChapterTwo: () => { if (progressRef.current.chapterComplete) travel('toBamboo'); },
    returnToTrialEntrance: () => {
      if(modeRef.current!=='paused'||mapRef.current!=='turning'||progressRef.current.chapterTwo.routeVerified)return;
      dialogueRef.current=null;setDialogue(null);travel('bambooLoop');changeMode('playing');persist(true);
    },
    visitRestoredHamlet: () => { if (progressRef.current.rainlit.complete) travel('backToHamlet'); },
    startReplay: (scene: ReplayScene) => start(false, 'replay', scene),
    start, act, pause, title, changeMode, openHistory, closeHistory, openReplay, closeReplay, openSettings, closeSettings, askMayumi, askBagtas, askTala, askMang, askLola, askMinda, useString, skipScene: () => finishScene(), skipCrossing: () => land(), skipReveal: () => finishReveal(),
    setInput };
}
