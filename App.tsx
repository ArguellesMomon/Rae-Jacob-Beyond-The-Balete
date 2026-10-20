import { CodexButton } from './src/components/CodexButton';
import { RainlitScene, RAINROAD_IMAGE, HAMLET_IMAGE, SPRING_IMAGE } from './src/components/RainlitScene';
import { SPRING_PROP_IMAGES } from './src/components/SpringPuzzleProps';
import { SPRING_SURFACE_IMAGES } from './src/components/SpringSurface';
import { WORKS_PROP_IMAGES } from './src/components/WorksPuzzleProp';
import { isRainlitMap } from './src/game/rainlit';
import type { MayumiTopic } from './src/game/model';
import { MazeTrialScene, MAZE_TERRAIN_IMAGES } from './src/components/MazeTrialScene';
import { TRAVELER_WALK_IMAGES } from './src/components/CharacterSprite';
import { mazeWitnessRecord } from './src/art/mazeTrialArt';
import { BambooScene } from './src/components/BambooScene';
import { isChapterTwoMap } from './src/game/chapterTwo';
import { FramePacing } from './src/components/FramePacing';
import { DialogueHistory } from './src/components/DialogueHistory';
import { ReplayMenu } from './src/components/ReplayMenu';
import { StoryReplyMenu } from './src/components/StoryReplyMenu';
import { JourneyRecap } from './src/components/JourneyRecap';
import { PocketContents } from './src/components/PocketContents';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
import { DMSans_500Medium } from '@expo-google-fonts/dm-sans/500Medium';
import { DMSans_600SemiBold } from '@expo-google-fonts/dm-sans/600SemiBold';
import { DMSans_700Bold } from '@expo-google-fonts/dm-sans/700Bold';
import { PixelifySans_400Regular } from '@expo-google-fonts/pixelify-sans/400Regular';
import { PixelifySans_700Bold } from '@expo-google-fonts/pixelify-sans/700Bold';
import { useFonts } from 'expo-font';
import { useAssets } from 'expo-asset';
import { YARD_MAP_IMAGE } from './src/components/YardEnvironment';
import { CLEARING_MAP_IMAGE, ROOT_DESCENT_IMAGE } from './src/components/ClearingEnvironment';
import { GROVE_MAP_IMAGE } from './src/components/GroveEnvironment';
import { WORKS_MAP_IMAGE } from './src/components/WaterworksEnvironment';
import { VERGE_MAP_IMAGE } from './src/components/BambooEnvironment';
import { TURNING_MAP_IMAGE } from './src/components/TurningEnvironment';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './src/components/Icons';
import { Joystick } from './src/components/Joystick';
import { YardScene } from './src/components/YardScene';
import { ClearingScene } from './src/components/ClearingScene';
import { GroveScene } from './src/components/GroveScene';
import { WaterworksScene } from './src/components/WaterworksScene';
import { PixelFrame } from './src/components/PixelFrame';
import { RootCrossing } from './src/components/RootCrossing';
import { objective, puzzleHint } from './src/game/engine';
import { getMap } from './src/game/world';
import type { LolaTopic, MindaTopic, MangTopic, MapId, TalaTopic, BagtasTopic } from './src/game/model';
import { useAdventureGame } from './src/hooks/useAdventureGame';
import { usePreferences } from './src/hooks/usePreferences';
import { useGameAudio } from './src/hooks/useGameAudio';

import { DialoguePanel } from './src/components/DialoguePanel';
import { ConversationMenu } from './src/components/ConversationMenu';
import { CharacterJournal } from './src/components/CharacterJournal';
import { CreatureCodex } from './src/components/CreatureCodex';
import { encounteredCreatures } from './src/game/creatureCodex';
import { knownCharacters } from './src/game/characters';
type NotePage = MapId | 'people' | 'codex';
const notebookLabel = (page: NotePage) => ({ yard: 'Home', clearing: 'Clearing', grove: 'Grove', waterworks: 'Waterworks', bamboo: 'Bamboo', turning: 'Turning paths', rainroad: 'Rainlit Road', hamlet: 'Hamlet', spring: 'Spring', people: 'People', codex: 'Creature codex' })[page];

const C = { cream: '#f5ecd6', ink: '#344332', green: '#294b3b', muted: '#8a9272', gold: '#d8ba78' };

function Button({ label, onPress, secondary = false, arrow = false }: { label: string; onPress: () => void; secondary?: boolean; arrow?: boolean }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.secondaryButton, pressed && { opacity: 0.8, transform: [{ translateY: 2 }] }]}>
    <PixelFrame fill={secondary ? '#ede8cf' : '#39513c'} border={secondary ? '#b8b48b' : '#243f30'} light={secondary ? '#fff5d6' : '#81946a'} />
    <Text style={[styles.buttonText, secondary && { color: C.ink }]}>{label}</Text>
    {arrow && <Icon name="arrow" size={19} color={secondary ? C.ink : C.cream} />}
  </Pressable>;
}

function Game() {
  const game = useAdventureGame();
  const options = usePreferences();
  const audio = useGameAudio({ mode: game.mode, mapId: game.mapId, progress: game.progress, player: game.player, dialogue: game.dialogue, clock: game.clock }, options.preferences, options.ready);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const compact = height < 520;
  const narrow = width < 760;
  const hudTight = width < 620;
  const [confirmNew, setConfirmNew] = useState(false);
  const showReplay = game.mode === 'replayMenu';
  const [showPacing, setShowPacing] = useState(false);
  const [notePage, setNotePage] = useState<NotePage | null>(null);
  const [hint, setHint] = useState({ stage: '', level: 0 });
  const hintStage = [game.progress.branchMoved, game.progress.flowDiverted, game.progress.bellRecovered, game.progress.waterRestored, game.progress.bellReturned, game.progress.bellHung, game.progress.bellRung, game.progress.chapterComplete, game.progress.chapterTwo.trailStep, game.progress.chapterTwo.debriefSeen, ...Object.values(game.progress.rainlit)].join(':');
  const hintLevel = hint.stage === hintStage ? hint.level : 0;
  const map = getMap(game.mapId, game.progress);
  const inChapterTwo = isChapterTwoMap(game.mapId);
  const inRainlit = isRainlitMap(game.mapId);
  const inClearing = game.mapId === 'clearing';
  const inGrove = game.mapId === 'grove';
  const inWorks = game.mapId === 'waterworks';
  const inSilong = game.mapId !== 'yard';
  const target = map.interactions.find(item => item.id === game.targetId);
  const notebookMap = notePage ?? game.mapId;
  const notebookItems = notebookMap === 'people' || notebookMap === 'codex' ? [] : getMap(notebookMap, game.progress).interactions.filter(item => item.note);
  const seenNote = (id: string) => id==='mazeWitnessA'||id==='mazeWitnessB' ? !!(game.progress.chapterTwo.mazeWitnesses[Math.min(2,game.progress.chapterTwo.trailStep)]&(id==='mazeWitnessA'?1:2)) : game.progress.discoveries.some(entry => entry === id);
  const title = game.mode === 'title';
  const playing = game.mode === 'playing';
  const currentLine = game.dialogue?.lines[game.dialogue.index];
  const cinematic = ['crossing', 'revealing', 'retrieving', 'sealRevealing', 'watching', 'pathTurning', 'springRestoring', 'springSealing'].includes(game.mode);
  const conversation = game.mode === 'mayumiQuestions' ? 'mayumi' : game.mode === 'bagtasQuestions' ? 'bagtas' : game.mode === 'questions' ? 'tala' : game.mode === 'mangQuestions' ? 'uban' : game.mode === 'lolaQuestions' ? 'lola' : game.mode === 'mindaQuestions' ? 'minda' : null;
  const conversationTopics = conversation === 'mayumi' ? game.progress.rainlit.topics : conversation === 'bagtas' ? game.progress.chapterTwo.topics : conversation === 'tala' ? game.progress.talaTopics : conversation === 'uban' ? game.progress.mangTopics : conversation === 'lola' ? game.progress.lolaTopics : game.progress.mindaTopics;
  const overlay = showReplay || game.mode === 'reply' || game.mode === 'history' || game.mode === 'paused' || game.mode === 'notebook' || game.mode === 'ending' || game.mode === 'chapterTwoEnding' || game.mode === 'questions' || game.mode === 'mangQuestions' || game.mode === 'tools' || game.mode === 'settings' || !!conversation;
  const worldClock=useRef(game.clock);
  if(!overlay||cinematic)worldClock.current=game.clock;
  const startNew = () => { if (game.saved) setConfirmNew(true); else game.start(false); };
  const margins = { left: Math.max(20, insets.left + 12), right: Math.max(20, insets.right + 12) };

  return <View onStartShouldSetResponderCapture={() => { audio.unlock(); return false; }} style={[styles.root, inSilong && { backgroundColor: inGrove ? '#2a4248' : '#2f4b4b' }]}>
    <StatusBar hidden />
    <View style={StyleSheet.absoluteFill} accessibilityLabel={inRainlit ? 'A rainlit road, riverside hamlet, and a spring with a dry bank and a repair shared by four travelers' : inChapterTwo ? 'A traveler shelter and three guided bamboo trails, each with one destination sign, quiet trail clues, a Tigmamanukan omen bird and a resting giantess' : inWorks ? 'A waterworks with a splitter, western bypass, eastern waterwheel, footbridge and a pale seal on a severed root' : inGrove ? 'An enormous balete, a giant in its branches, and a bamboo line leading through the forest' : inClearing ? 'A twilight village of lantern-lit homes among enormous roots' : "A sunny pixel-art yard outside Lola's wooden house"}>
      {isRainlitMap(game.mapId) ? <RainlitScene mapId={game.mapId} width={width} height={height} player={game.player} companion={game.companion} progress={game.progress} clock={worldClock.current} line={playing ? currentLine : undefined} targetId={playing && !game.dialogue ? game.targetId : undefined} gentleCamera={options.preferences.gentleCamera} ambientMotion={options.preferences.ambientMotion} waterMotion={options.preferences.waterMotion} restoring={game.mode === 'springRestoring' ? game.sceneTime : undefined} sealing={game.mode === 'springSealing' ? game.sceneTime : undefined} />
        : game.mapId === 'turning' ? <MazeTrialScene width={width} height={height} player={game.player} companion={game.companion} progress={game.progress} clock={worldClock.current} line={playing ? currentLine : undefined} gentleCamera={options.preferences.gentleCamera} ambientMotion={options.preferences.ambientMotion} />
        : inChapterTwo ? <BambooScene mapId={game.mapId as 'bamboo' | 'turning'} width={width} height={height} player={game.player} companion={game.companion} progress={game.progress} clock={worldClock.current} line={playing ? currentLine : undefined} targetId={playing && !game.dialogue ? game.targetId : undefined} gentleCamera={options.preferences.gentleCamera} ambientMotion={options.preferences.ambientMotion} />
        : inWorks ? <WaterworksScene ambientMotion={options.preferences.ambientMotion} active={playing} waterMotion={options.preferences.waterMotion} width={width} height={height} player={game.player} companion={game.companion} progress={game.progress} clock={worldClock.current} targetId={playing && !game.dialogue ? game.targetId : undefined} retrieving={game.mode === 'retrieving' ? game.sceneTime : undefined} focusRoot={game.mode === 'sealRevealing' || game.dialogue?.id === 'rootSeal'} reveal={game.mode === 'sealRevealing' ? game.sceneTime : 1} gentleCamera={options.preferences.gentleCamera} line={playing ? currentLine : undefined} />
        : inGrove ? <GroveScene ambientMotion={options.preferences.ambientMotion} giftScene={playing && game.dialogue?.id === 'mangGift'} progress={game.progress} width={width} height={height} player={game.player} companion={game.companion} clock={worldClock.current} targetId={playing && !game.dialogue ? game.targetId : undefined} overview={title} focusMang={game.mode === 'revealing' || game.mode === 'mangQuestions' || !!game.dialogue?.id.startsWith('mang')} reveal={game.mode === 'revealing' ? game.reveal : 1} quiet={game.progress.bellRecovered || game.progress.flowDiverted} gentleCamera={options.preferences.gentleCamera} line={playing ? currentLine : undefined} />
        : inClearing ? <ClearingScene reflecting={game.mode === 'watching' || playing && game.dialogue?.id === 'afterBell'} ambientMotion={options.preferences.ambientMotion} width={width} height={height} player={game.player} companion={game.companion} metTala={game.progress.metTala} progress={game.progress} clock={worldClock.current} targetId={playing && !game.dialogue ? game.targetId : undefined} overview={title} gentleCamera={options.preferences.gentleCamera} line={playing ? currentLine : undefined} />
        : <YardScene ambientMotion={options.preferences.ambientMotion} progress={game.progress} width={width} height={height} player={game.player} clock={worldClock.current} targetId={playing && !game.dialogue ? game.targetId : undefined} overview={title} gentleCamera={options.preferences.gentleCamera} line={playing ? currentLine : undefined} />}
    </View>
    {/* A quiet edge tint keeps the interface legible without covering the yard. */}
    <View pointerEvents="none" style={[styles.topShade, { height: compact ? 92 : 118 }]} />

    {!title && !cinematic && <View pointerEvents="box-none" style={[styles.header, margins, { top: Math.max(16, insets.top + 10), gap: compact ? 10 : 18 }]}>
      <View style={[styles.location, (compact || hudTight) && { paddingVertical: 10, paddingHorizontal: 12 }]}>
        {!hudTight && <View style={styles.locationIcon}><Icon name={inSilong ? 'leaf' : 'sun'} color={C.gold} size={22} /></View>}
        <View style={{ flexShrink: 1 }}><Text numberOfLines={1} style={[styles.eyebrow, hudTight && { fontSize: 7, letterSpacing: .6 }]}>{inChapterTwo ? game.slot === 'replay' ? 'CHAPTER 02 / REPLAY' : 'CHAPTER 02 / SILONG' : game.slot === 'replay' ? 'CHAPTER 01 \u00b7 REPLAY' : inSilong ? 'CHAPTER 01 · SILONG' : 'CHAPTER 01 · AN AFTERNOON'}</Text><Text numberOfLines={1} style={[styles.locationName, compact && { fontSize: 21 }, hudTight && { fontSize: 18 }]}>{map.name}</Text></View>
      </View>
      {!narrow && <View style={[styles.objective, compact && { paddingVertical: 9 }]}>
        <View style={styles.objectiveTop}><View style={styles.goldDot} /><Text style={styles.objectiveLabel}>{inSilong ? 'A ROAD BACK HOME' : 'ONE MORE MINUTE'}</Text></View>
        <Text style={styles.objectiveText} numberOfLines={2}>{objective(game.progress, game.mapId)}</Text>
      </View>}
      <View style={styles.headerActions}>{!hudTight && <Pressable accessibilityRole="button" accessibilityLabel="Open dialogue history" onPress={game.openHistory} style={styles.iconButton}><PixelFrame fill="#263e30e8" border="#aaa982" /><Text style={{ fontFamily: 'PixelifySans_400Regular', fontSize: 14, color: C.cream }}>LOG</Text></Pressable>}
        {!hudTight && <Pressable accessibilityRole="button" accessibilityLabel="Sound and comfort settings" onPress={game.openSettings} style={styles.iconButton}><PixelFrame fill="#263e30e8" border="#aaa982" light="#c9c29a" /><Icon name={options.preferences.music || options.preferences.effects ? 'sound' : 'muted'} size={20} /></Pressable>}
        <Pressable accessibilityRole="button" accessibilityLabel="Open notebook" onPress={() => { setNotePage(null); game.changeMode('notebook'); }} style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.65 }]}>
          <PixelFrame fill="#263e30e8" border="#aaa982" light="#c9c29a" /><Icon name="book" size={21} />
          {game.progress.discoveries.length > 0 && <View style={styles.noteCount}><Text style={styles.noteCountText}>{game.progress.discoveries.length}</Text></View>}
        </Pressable>
        <CodexButton onOpen={() => { setNotePage('codex'); game.changeMode('notebook'); }} />
        <Pressable accessibilityRole="button" accessibilityLabel="Pause game" onPress={game.pause} style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.65 }]}><PixelFrame fill="#263e30e8" border="#aaa982" light="#c9c29a" /><Icon name="pause" size={19} /></Pressable>
      </View>
    </View>}

    {showPacing && playing && !game.dialogue && <View pointerEvents="none" style={[{ position: 'absolute' }, narrow ? { bottom: insets.bottom + 18, alignSelf: 'center' } : { top: insets.top + 93, right: Math.max(20, insets.right + 10) }]}><FramePacing clock={game.clock} /></View>}
    {playing && !game.dialogue && <>
      {narrow && <View pointerEvents="none" style={[styles.smallObjective, { top: insets.top + 95 }]}><Text style={styles.objectiveText}>{objective(game.progress, game.mapId)}</Text></View>}
      <View style={[styles.joystick, { left: Math.max(14, insets.left + 6), bottom: Math.max(12, insets.bottom + 8) }]}><Joystick onMove={game.setInput} compact={compact} /></View>
      <View style={[styles.actionWrap, { right: Math.max(30, insets.right + 18), bottom: Math.max(20, insets.bottom + 12) }]}>
        {target && <View style={styles.targetLabel}><Text style={styles.targetLabelText}>{target.name}</Text></View>}
        <Pressable accessibilityRole="button" accessibilityLabel={target ? `${target.action} ${target.name}` : 'Explore'} disabled={!target} onPress={game.act} style={({ pressed }) => [styles.actionButton, compact && { width: 68, height: 68 }, !target && { opacity: 0.46 }, pressed && { transform: [{ translateY: 2 }] }]}>
          <PixelFrame fill="#f6e9c5ef" border="#a3a47b" light="#fff8de" cut={9} /><Icon name={target?.action === 'Talk' ? 'leaf' : 'hand'} size={27} color={C.ink} />
        </Pressable>
        <Text style={styles.actionCaption}>{target?.action.toUpperCase() ?? 'EXPLORE'}</Text>
      </View>
      {Platform.OS === 'web' && !narrow && <View pointerEvents="none" style={[styles.keyboardHint, { bottom: compact ? 19 : 26 }]}>
        <Text style={styles.keyText}>WASD / ARROWS</Text><Text style={styles.keyDescription}> move</Text><View style={styles.hintDivider} /><Text style={styles.keyText}>E</Text><Text style={styles.keyDescription}> interact</Text><View style={styles.hintDivider} /><Text style={styles.keyText}>N</Text><Text style={styles.keyDescription}> notes</Text>
      </View>}
    </>}

    {playing && !game.dialogue && game.recap && <View style={{ position: 'absolute', bottom: Math.max(125, insets.bottom + 106), alignSelf: 'center', width: Math.min(360, width - insets.left - insets.right - 36) }}><JourneyRecap text={game.recap} onClose={game.dismissRecap} /></View>}

    {playing && currentLine && game.dialogue && <View style={[styles.dialoguePosition, { left: Math.max(18, insets.left + 10), right: Math.max(18, insets.right + 10), bottom: Math.max(14, insets.bottom + 8) }]}><DialoguePanel line={currentLine} index={game.dialogue.index} total={game.dialogue.lines.length} compact={compact} clock={game.clock} onContinue={game.act} onHistory={game.openHistory} largeText={options.preferences.largeText} maxHeight={Math.max(165, height - insets.top - insets.bottom - 110)} /></View>}

    {title && <View style={[styles.titleOverlay, !inSilong && { backgroundColor: '#182e278c' }]}>
      <View style={[styles.titleTop, margins, { top: Math.max(25, insets.top + 15) }]}><View style={styles.brandMark}><Icon name="leaf" size={20} color={C.gold} /><Text style={styles.titleEyebrow}>A LITTLE WAY FROM HOME</Text></View><View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}><Text style={styles.chapterTop}>CHAPTERS 01 + 02</Text><Pressable accessibilityRole="button" accessibilityLabel="Sound and comfort settings" onPress={game.openSettings} style={styles.iconButton}><PixelFrame fill="#263e30e8" border="#aaa982" light="#c9c29a" /><Icon name={options.preferences.music || options.preferences.effects ? 'sound' : 'muted'} size={20} /></Pressable></View></View>
      <View style={[styles.titleContent, { left: Math.max(width * 0.075, insets.left + 24), top: compact ? height * 0.19 : height * 0.23, maxWidth: narrow ? width - 48 : 500 }]}>
        <Text style={[styles.gameTitle, compact && { fontSize: 58, lineHeight: 52 }, narrow && { fontSize: 54, lineHeight: 50 }]}>Rae Jacob</Text>
        <View style={styles.subtitleRow}><View style={styles.titleRule} /><Text style={styles.gameSubtitle}>BEYOND THE BALETE</Text></View>
        <Text style={[styles.titleDescription, compact && { fontSize: 16, lineHeight: 23, marginTop: 17, marginBottom: 22 }]}>Some adventures begin{ '\n' }with “one more minute.”</Text>
        {!game.loaded ? <ActivityIndicator color={C.cream} style={{ alignSelf: 'flex-start', marginVertical: 16 }} /> : <View style={{ alignItems: 'flex-start', gap: 10 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={game.saved ? 'Continue your journey' : 'Step into the yard'} onPress={() => game.saved ? game.start(true) : game.start(false)} style={({ pressed }) => [styles.startButton, pressed && { opacity: .85, transform: [{ translateY: 2 }] }]}><PixelFrame fill="#f1e4bd" border="#9d9462" light="#fff5d6" /><Icon name="kite" color={C.ink} size={21} /><Text style={styles.startButtonText}>{game.saved ? 'Continue your journey' : 'Step into the yard'}</Text><Icon name="arrow" color={C.ink} size={19} /></Pressable>
          <View style={{ flexDirection: 'row', gap: 18, alignItems: 'center' }}><Pressable accessibilityRole="button" accessibilityLabel="Replay story scenes without replacing my journey" onPress={game.openReplay} style={styles.newGameButton}><Text style={styles.newGameText}>Revisit a scene</Text></Pressable>{game.saved && <Pressable accessibilityRole="button" onPress={startNew} style={styles.newGameButton}><Text style={styles.newGameText}>Start a new afternoon</Text></Pressable>}</View>
        </View>}
      </View>
      {!narrow && <View style={[styles.chapterCard, { right: width * 0.065, bottom: compact ? 52 : 90 }]}><Text style={styles.chapterCardNumber}>{game.saved?.progress.chapterTwo.visited ? '02' : '01'}</Text><View style={styles.chapterCardRule} /><Text style={styles.chapterCardTitle}>{game.saved?.progress.chapterTwo.visited ? 'The Rainlit\nRoad' : 'The Bell Beneath\nthe Balete'}</Text><Text style={styles.chapterCardCaption}>EVERY PATH HAS A STORY.</Text></View>}
      <View style={[styles.titleFooter, margins, { bottom: Math.max(20, insets.bottom + 10) }]}><Text style={styles.titleFooterText}>A Philippine folklore adventure</Text><View style={styles.footerDots}><View style={[styles.footerDot, { backgroundColor: C.gold }]} /><View style={styles.footerDot} /><View style={styles.footerDot} /></View></View>
    </View>}

    {overlay && <View style={styles.modalBackdrop}>
      <ScrollView style={[styles.paper, { maxHeight: height - Math.max(40, insets.top + insets.bottom + 24), width: game.mode === 'history' ? 610 : game.mode === 'notebook' ? 540 : 440 }]} contentContainerStyle={{ padding: compact ? 20 : 31 }} showsVerticalScrollIndicator={false}>
        {showReplay && <ReplayMenu hasReplay={!!game.replaySaved} onClose={game.closeReplay} onResume={() => game.start(true, 'replay')} onStart={game.startReplay} />}
        {!showReplay && game.mode === 'history' && <DialogueHistory entries={game.history} mapId={game.mapId} onClose={game.closeHistory} largeText={options.preferences.largeText} />}
        {!showReplay && game.mode === 'reply' && currentLine && <StoryReplyMenu line={currentLine} clock={game.clock} largeText={options.preferences.largeText} onChoose={game.chooseReply} onHistory={game.openHistory} onPause={game.pause} />}
        {!showReplay && game.mode === 'paused' && <>
          {!compact && <View style={styles.modalIcon}><Icon name="sun" size={27} color="#7d895a" /></View>}
          <Text style={styles.modalEyebrow}>{game.slot === 'replay' ? 'REPLAY \u00b7 YOUR JOURNEY IS SAFE' : 'NO NEED TO HURRY'}</Text><Text style={styles.modalTitle}>Take a breather.</Text>
          <Text style={styles.modalDescription}>{inRainlit ? 'The road can wait. So can the next question.' : inChapterTwo ? 'The bamboo can keep its own time for a moment.' : inWorks ? 'Let the water do the hurrying for a while.' : inGrove ? 'Even the forest watcher needs a rest.' : inClearing ? 'The lanterns will keep you company.' : 'The afternoon can wait.'}</Text>
          <View style={styles.menuButtons}><Button label={inRainlit ? 'Back to the rainlit road' : inChapterTwo ? 'Back to the bamboo paths' : inWorks ? 'Back to the waterworks' : inGrove ? 'Back to the grove' : inClearing ? 'Back to the clearing' : 'Back to the yard'} arrow onPress={() => game.changeMode('playing')} />{game.mapId === 'turning' && !game.progress.chapterTwo.routeVerified && <Button label="Return to this trial's entrance" secondary onPress={game.returnToTrialEntrance} />}<Button label="Open field notes" secondary onPress={() => { setNotePage(null); game.changeMode('notebook'); }} /><Button label="Sound & comfort" secondary onPress={game.openSettings} /><Button label="Read conversations" secondary onPress={game.openHistory} /><Button label="Revisit a story scene" secondary onPress={game.openReplay} /><Button label={showPacing ? 'Hide frame pacing' : 'Show frame pacing'} secondary onPress={() => setShowPacing(value => !value)} />{game.slot === 'replay' && game.saved && <Button label="Return to my saved journey" onPress={() => game.start(true)} />}<Pressable accessibilityRole="button" onPress={game.title} style={styles.textButton}><Text style={styles.textButtonLabel}>Return to title</Text></Pressable></View>
        </>}
        {!showReplay && game.mode === 'settings' && <>
          <View style={styles.notebookHeader}><View><Text style={[styles.modalEyebrow, { textAlign: 'left' }]}>MAKE YOURSELF AT HOME</Text><Text style={[styles.modalTitle, { textAlign: 'left', fontSize: 31 }]}>Sound & comfort</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Close settings" onPress={game.closeSettings} style={styles.closeButton}><Icon name="close" color={C.ink} size={21} /></Pressable></View>
          <Text style={[styles.modalDescription, { textAlign: 'left', marginTop: 12 }]}>A little music for the road. Every clue is also shown on screen.</Text>
          {!options.ready ? <ActivityIndicator color={C.green} /> : <>
            {([{ key: 'music', title: 'Music', values: [0, .16, .3] }, { key: 'effects', title: 'Sounds & ambience', values: [0, .32, .65] }] as const).map(row => <View key={row.key} style={styles.settingGroup}><Text style={styles.noteTitle}>{row.title}</Text><View style={styles.settingChoices}>{row.values.map((value, i) => <Pressable key={value} accessibilityRole="button" accessibilityLabel={`${row.title}: ${['Off', 'Soft', 'On'][i]}`} accessibilityState={{ selected: Math.abs(options.preferences[row.key] - value) < .01 }} onPress={() => options.update({ [row.key]: value })} style={[styles.settingChoice, Math.abs(options.preferences[row.key] - value) < .01 && styles.settingChoiceActive]}><Text style={[styles.noteTabText, Math.abs(options.preferences[row.key] - value) < .01 && { color: C.cream }]}>{['Off', 'Soft', 'On'][i]}</Text></Pressable>)}</View></View>)}
            <View style={styles.settingGroup}><Text style={styles.noteTitle}>Water scene motion</Text><View style={styles.settingChoices}>{[{ on: true, label: 'Gentle motion' }, { on: false, label: 'Steady view' }].map(choice => <Pressable key={choice.label} accessibilityRole="button" accessibilityLabel={choice.label} accessibilityState={{ selected: options.preferences.waterMotion === choice.on }} onPress={() => options.update({ waterMotion: choice.on })} style={[styles.settingChoice, options.preferences.waterMotion === choice.on && styles.settingChoiceActive]}><Text style={[styles.noteTabText, options.preferences.waterMotion === choice.on && { color: C.cream }]}>{choice.label}</Text></Pressable>)}</View><Text style={styles.noteBody}>Follow a changed current with a brief, soft tremble. Steady view keeps the camera with Rae; water and captions still show the change.</Text></View>
            {([{ key: 'ambientMotion', title: 'Background motion', yes: 'Animated', no: 'Still' }, { key: 'largeText', title: 'Dialogue size', yes: 'Larger', no: 'Standard' }] as const).map(row => <View key={row.key} style={styles.settingGroup}><Text style={styles.noteTitle}>{row.title}</Text><View style={styles.settingChoices}>{[false, true].map(value => <Pressable key={String(value)} accessibilityRole="button" accessibilityState={{ selected: options.preferences[row.key] === value }} onPress={() => options.update({ [row.key]: value })} style={[styles.settingChoice, options.preferences[row.key] === value && styles.settingChoiceActive]}><Text style={[styles.noteTabText, options.preferences[row.key] === value && { color: C.cream }]}>{value ? row.yes : row.no}</Text></Pressable>)}</View></View>)}
            <View style={styles.settingGroup}><Text style={styles.noteTitle}>Camera follow</Text><View style={styles.settingChoices}>{[{ gentle: true, label: 'Gentle' }, { gentle: false, label: 'Direct' }].map(choice => <Pressable key={choice.label} accessibilityRole="button" accessibilityState={{ selected: options.preferences.gentleCamera === choice.gentle }} onPress={() => options.update({ gentleCamera: choice.gentle })} style={[styles.settingChoice, options.preferences.gentleCamera === choice.gentle && styles.settingChoiceActive]}><Text style={[styles.noteTabText, options.preferences.gentleCamera === choice.gentle && { color: C.cream }]}>{choice.label}</Text></Pressable>)}</View><Text style={styles.noteBody}>Gentle eases into each turn. Direct keeps the camera close to Rae’s movement.</Text></View>
            <View style={styles.menuButtons}><Button label={audio.issue ? 'Retry sound · play waybell' : 'Preview the waybell'} secondary onPress={audio.preview} /><Button label="All comfortable" arrow onPress={game.closeSettings} /></View>
            <Text style={styles.previewEnd}>{audio.issue ? 'Sound could not start. Tap Preview to try again; you can keep playing quietly.' : !options.preferences.effects ? 'Turn sounds on to hear the preview.' : 'Game audio pauses here. Preview plays one bell. On iPhone, sound respects silent mode.'}</Text>
            {options.saveIssue && <Text style={styles.previewEnd}>Your choices work now, but could not be saved for next time.</Text>}
          </>}
        </>}
        {!showReplay && game.mode === 'notebook' && <>
          <View style={styles.notebookHeader}><View><Text style={styles.modalEyebrow}>RAE JACOB'S NOTEBOOK</Text><Text style={[styles.modalTitle, { textAlign: 'left', marginTop: 4 }]}>{notebookMap === 'codex' ? 'Creature codex' : notebookMap === 'people' ? 'People we meet' : 'Small discoveries'}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Close notebook" onPress={() => game.changeMode('playing')} style={styles.closeButton}><Icon name="close" color={C.ink} size={21} /></Pressable></View>
          <Button label="Read conversations" secondary onPress={game.openHistory} />
          <View style={{ marginTop: 10 }}><Button label={`Creature codex (${encounteredCreatures(game.progress).length} encountered)`} secondary onPress={() => setNotePage('codex')} /></View>
          <View style={styles.noteTabs}>{(['yard', ...(game.progress.crossed ? ['clearing'] : []), ...(game.progress.visitedGrove ? ['grove'] : []), ...(game.progress.visitedWaterworks ? ['waterworks'] : []), ...(game.progress.chapterTwo.visited ? ['bamboo'] : []), ...(game.progress.chapterTwo.turningVisited ? ['turning'] : []), ...(game.progress.rainlit.visited ? ['rainroad'] : []), ...(game.progress.rainlit.hamletSeen ? ['hamlet'] : []), ...(game.progress.rainlit.springSeen ? ['spring'] : []), 'people'] as NotePage[]).map(page => <Pressable key={page} accessibilityRole="button" accessibilityLabel={`Notebook: ${notebookLabel(page)}`} onPress={() => setNotePage(page)} style={[styles.noteTab, notebookMap === page && styles.noteTabActive]}><Text style={[styles.noteTabText, notebookMap === page && { color: '#f5ecd6' }]}>{notebookLabel(page)}</Text></Pressable>)}</View>
          {notebookMap === 'spring' && game.progress.rainlit.metMayumi && <View style={{ marginTop: 18, gap: 8 }}><Text style={styles.noteTitle}>Words beside the water</Text><Text style={styles.noteBody}>Bukal: a spring or source. Batis: a small stream. Agos: water’s movement or flow. Observe the source, the channel, and what changes along it.</Text><Text style={styles.noteTitle}>A story has a place</Text><Text style={styles.noteBody}>Mayumi is our original character. A recorded Diwata sa Bukal account belongs to Namayan, Santa Ana, Manila. Anggoy Doronoon belongs to a separate central Panay Hinilawod account. These traditions have their own names and contexts. Read the sources under People; one character cannot represent every Philippine tradition.</Text>{game.progress.rainlit.complete && <><Text style={styles.noteTitle}>What we witnessed</Text><Text style={styles.noteBody}>The rill reached the hamlet. A distant voice sounded familiar to Rae; its source is unconfirmed. A pale seal formed on a hollow that was unmarked when we arrived. We do not yet know who made it or why.</Text></>}</View>}
          {notebookMap !== 'people' && notebookMap !== 'codex' && game.progress.crossed && <PocketContents progress={game.progress} onInspect={game.inspectKeepsake} />}
          {notebookMap !== 'people' && notebookMap !== 'codex' && game.progress.visitedWaterworks && <View style={{ gap: 10, marginTop: 14 }}><Text style={styles.noteTitle}>{objective(game.progress, game.mapId)}</Text>{hintLevel > 0 && <Text accessibilityLiveRegion="polite" style={styles.noteBody}>{puzzleHint(game.progress, hintLevel, game.mapId)}</Text>}<Button label={hintLevel === 0 ? 'A little nudge?' : hintLevel < 3 ? 'Tell me a little more' : 'Show that hint again'} secondary onPress={() => setHint({ stage: hintStage, level: Math.min(3, hintLevel + 1) })} /></View>}
          {notebookMap === 'codex' ? <CreatureCodex progress={game.progress} clock={game.clock} /> : notebookMap === 'people' ? <CharacterJournal progress={game.progress} clock={game.clock} /> : <View style={{ marginTop: 16, paddingBottom: 12 }}>
            <View style={styles.lolaNote}><Icon name="leaf" size={20} color="#73805a" /><Text style={styles.lolaNoteText}>{game.progress.talkedToLola ? '“If you lose your way, stop first. Look around.”\n— Lola' : 'Lola is calling from the porch. I should probably answer.'}</Text></View>
            {notebookItems.map((item, i) => {
              const seen = seenNote(item.id);
              return <View key={item.id} style={styles.noteRow}><View style={[styles.noteBullet, seen && { backgroundColor: '#e1e6cb' }]}>{seen ? <Icon name="check" size={16} color="#5b734e" /> : <Text style={styles.noteQuestion}>?</Text>}</View><View style={{ flex: 1 }}><Text style={[styles.noteTitle, !seen && { color: '#a09d88' }]}>{seen ? item.name : `A little mystery, no. ${i + 1}`}</Text><Text style={[styles.noteBody, !seen && { color: '#a09d88' }]}>{seen ? item.note : 'Some things only make sense when you look a little closer.'}</Text></View></View>;
            })}
            {(notebookMap === 'bamboo' || notebookMap === 'turning') && <View style={styles.lolaNote}><Icon name="leaf" size={20} color="#73805a" /><Text style={styles.lolaNoteText}>{game.progress.chapterTwo.debriefSeen ? 'We outwitted his maze. Bagtas kept his bargain: a road toward the spring, without another hidden turn.' : game.progress.chapterTwo.routeVerified ? 'Three true marks checked. Return to Bagtas for his side of the bargain.' : game.progress.chapterTwo.metBagtas ? `Three trails. One destination sign per trial. Look for fallen petals, leaf ties and occasional worn arrows. Watch the omen bird or ask Aling Dalisay. ${game.progress.chapterTwo.trailStep}/3 turns earned. Completed signs stay earned; wrong turns do not reset the trial.` : 'The hoofbeats are coming from more than one direction. Meet the traveler before following his advice.'}</Text></View>}
            {notebookMap === 'turning' && game.progress.chapterTwo.turningVisited && <View style={styles.lolaNote}><Icon name="book" size={20} color="#73805a" /><Text style={styles.lolaNoteText}>{mazeWitnessRecord(game.progress)}</Text></View>}
            {notebookMap === 'yard' && game.progress.foundTree && <View style={styles.lolaNote}><Icon name="kite" size={21} color="#73805a" /><Text style={styles.lolaNoteText}>{game.progress.crossed ? 'The tree led somewhere else. My kite stayed behind. So did home.' : 'There is a light between the roots. And somebody on the other side.'}</Text></View>}
            {notebookMap === 'clearing' && game.progress.metTala && <View style={styles.lolaNote}><Icon name="leaf" size={21} color="#73805a" /><Text style={styles.lolaNoteText}>Tala is a mapmaker. Almost. She is helping me find a way home.{game.progress.talaTopics.includes('home') || game.progress.groveLead ? '\nMang Uban watches the old paths. His grove is north of the clearing.' : ''}</Text></View>}
            {notebookMap === 'clearing' && game.progress.heardMinda && <View style={styles.lolaNote}><Icon name="book" size={21} color="#73805a" /><Text style={styles.lolaNoteText}>Minda says the bell disappeared on the evening of the water surge. That is when the ringing began, too.</Text></View>}
            {notebookMap === 'grove' && game.progress.metMang && <View style={styles.lolaNote}><Icon name="leaf" size={21} color="#73805a" /><Text style={styles.lolaNoteText}>Mang Uban knows the older paths. The Heart Balete may hold a crossing home. {game.progress.bellRung ? 'Our local crossing is restored. Next: find Bagtas in the bamboo paths.' : game.progress.waterRestored ? 'The wheel is repaired. The waybell still needs to be hung and rung.' : 'First, the flooded local crossing needs help.'}{game.progress.mangTopics.includes('home') && !game.progress.bellRung ? '\nAfter that: find Bagtas in the bamboo paths.' : ''}</Text></View>}
            {notebookMap === 'grove' && game.progress.mangTopics.includes('ringing') && <View style={styles.lolaNote}><Icon name="book" size={21} color="#73805a" /><Text style={styles.lolaNoteText}>The surge, the missing bell, and the crooked ringing all began the same evening. Two things happening together... could they belong together?</Text></View>}
          </View>}
          <View style={styles.notebookFooter}><Text style={styles.notebookFooterText}>{notebookMap === 'codex' ? 'CREATURE CODEX' : notebookMap === 'bamboo' ? 'BAMBOO VERGE / PAGE 05' : notebookMap === 'turning' ? 'TURNING PATHS / PAGE 06' : notebookMap === 'people' ? 'PEOPLE · STORIES & MEMORIES' : notebookMap === 'yard' ? "LOLA'S YARD · PAGE 01" : notebookMap === 'grove' ? 'OLD BALETE GROVE · PAGE 03' : notebookMap === 'waterworks' ? 'ROOTWATER WORKS · PAGE 04' : 'LANTERN CLEARING · PAGE 02'}</Text><Text style={styles.notebookFooterText}>{notebookMap === 'codex' ? `${encounteredCreatures(game.progress).length} CREATURE KINDS MET` : notebookMap === 'people' ? `${knownCharacters(game.progress).length + Object.values(game.progress.residentChats).filter(n => (n ?? 0) > 0).length} PEOPLE MET` : `${notebookItems.filter(item => seenNote(item.id)).length} / ${notebookItems.length} DISCOVERIES`}</Text></View>
        </>}
        {conversation && <ConversationMenu who={conversation} visited={conversationTopics} clock={game.clock} onClose={() => game.changeMode('playing')} closeLabel={conversation === 'lola' ? 'Back to the kite mission' : conversation === 'minda' && game.progress.bellReturned && !game.progress.bellHung ? 'Meet Minda at the arch' : 'Keep exploring'} onAsk={topic => { if (conversation === 'mayumi') game.askMayumi(topic as MayumiTopic); else if (conversation === 'bagtas') game.askBagtas(topic as BagtasTopic); else if (conversation === 'tala') game.askTala(topic as TalaTopic); else if (conversation === 'uban') game.askMang(topic as MangTopic); else if (conversation === 'lola') game.askLola(topic as LolaTopic); else game.askMinda(topic as MindaTopic); }} />}
        {!showReplay && game.mode === 'tools' && <>
          <Text style={styles.modalEyebrow}>A HANDLE JUST OUT OF REACH</Text><Text style={styles.modalTitle}>In my pocket…</Text>
          <Text style={styles.modalDescription}>The wheel is stopped. Rae can safely work from the grating. Choose something to reach the bell.</Text>
          <View style={styles.menuButtons}><Pressable accessibilityRole="button" accessibilityLabel="Use spare kite string" onPress={game.useString} style={styles.topicButton}><Icon name="kite" size={25} color="#798551" /><View style={{ flex: 1, marginLeft: 12 }}><Text style={styles.topicText}>Spare kite string</Text><Text style={[styles.noteBody, { marginTop: 4 }]}>Long enough for a loop. Strong enough for a bell.</Text></View><Icon name="arrow" size={19} color="#798551" /></Pressable><Button label="Keep looking" secondary onPress={() => game.changeMode('playing')} /></View>
        </>}
        {!showReplay && game.mode === 'chapterTwoEnding' && <>
          <Text style={styles.modalEyebrow}>CHAPTER 02 / COMPLETE</Text><Text style={styles.modalTitle}>The water runs.{ '\n' }The road remembers.</Text>
          <Text style={styles.modalDescription}>The spring reaches its neighbors again. Rae has heard a voice he hopes was Lola’s—and learned that helping this world need not mean forgetting home. In Riverside Hamlet, a place at supper is waiting.</Text>
          <View style={styles.lolaNote}><Icon name="leaf" size={22} color="#73805a" /><Text style={styles.lolaNoteText}>Next question: Who is still closing the roads—and whom are those closures meant to protect?</Text></View>
          <View style={styles.menuButtons}><Button label="Return to Riverside Hamlet" onPress={game.visitRestoredHamlet} arrow /><Button secondary label="Rest beside the spring" onPress={() => game.changeMode('playing')} /><Button secondary label="Read our notes" onPress={() => { setNotePage('spring'); game.changeMode('notebook'); }} /><Button secondary label="Return to title" onPress={game.title} /></View>
          <Text style={styles.previewEnd}>Chapter 2 is saved. All return paths remain open. The next chapter has not begun.</Text>
        </>}
        {!showReplay && game.mode === 'ending' && <>
          {!compact && <View style={styles.modalIcon}><Icon name="kite" size={30} color="#7d895a" /></View>}
          <Text style={styles.modalEyebrow}>CHAPTER 01 · COMPLETE</Text><Text style={[styles.modalTitle, { fontSize: compact ? 33 : 38 }]}>Every path{ '\n' }has a story.</Text>
          <Text style={styles.modalDescription}>One bell returned. One crossing restored.{ '\n' }One friend for the road ahead.</Text>
          <View style={styles.lolaNote}><Icon name="leaf" size={22} color="#73805a" /><Text style={styles.lolaNoteText}>NEXT: Find Bagtas in the bamboo paths.{ '\n' }And find out who sealed that root passage.</Text></View>
          <View style={styles.menuButtons}><Button label="Begin Chapter 2" arrow onPress={game.beginChapterTwo} /><Button label="Keep exploring Chapter 1" arrow onPress={() => game.changeMode('playing')} /><Pressable accessibilityRole="button" onPress={game.title} style={styles.textButton}><Text style={styles.textButtonLabel}>Return to title</Text></Pressable></View>
          <Text style={styles.previewEnd}>{game.slot === 'replay' ? 'Your replay is saved separately. Your main journey is safe.' : 'Your journey is saved.'} Chapter 2 now begins beyond the open bamboo road.</Text>
        </>}
      </ScrollView>
    </View>}

    {confirmNew && <View style={styles.modalBackdrop}><View style={[styles.paper, { width: 410, padding: 26 }]}><Text style={styles.modalTitle}>Start from home?</Text><Text style={styles.modalDescription}>Your current adventure progress will be replaced.</Text><View style={styles.menuButtons}><Button label="Keep my journey" onPress={() => setConfirmNew(false)} /><Button label="Start again" secondary onPress={() => { setConfirmNew(false); game.start(false); }} /></View></View></View>}
    {game.saveIssue && !title && <View pointerEvents="none" style={[styles.saveNotice, { top: 99 + insets.top }]}><Text style={styles.saveNoticeText}>Saving is unavailable right now. You can keep playing.</Text></View>}
    {width < height && playing && !game.dialogue && <View pointerEvents="none" style={styles.rotateHint}><Text style={styles.rotateHintText}>Turn your phone sideways for a little more room.</Text></View>}
    {(game.mode === 'springRestoring' || game.mode === 'springSealing') && <View style={styles.revealOverlay} pointerEvents="box-none"><View pointerEvents="none" style={[styles.revealCaption, { bottom: Math.max(28, insets.bottom + 16) }]}><Text style={styles.revealEyebrow}>THE QUIET SPRING</Text><Text style={styles.revealTitle}>{game.mode === 'springRestoring' ? 'A little room. A way for the water.' : 'A mark that was not here before.'}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Finish spring scene" onPress={game.skipScene} style={[styles.revealSkip, { top: 20, right: 24 }]}><Text style={styles.revealSkipText}>Continue</Text></Pressable></View>}
    {game.mode === 'pathTurning' && <View style={styles.revealOverlay} pointerEvents="box-none"><View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#1d3434', opacity: 1 - game.sceneTime }]} /><View pointerEvents="none" style={[styles.revealCaption, { bottom: Math.max(28, insets.bottom + 16) }]}><Text style={styles.revealEyebrow}>THE TURNING PATHS</Text><Text style={styles.revealTitle}>{game.progress.chapterTwo.routeVerified ? 'A checked route reaches the shelter.' : `Trial ${Math.min(3, game.progress.chapterTwo.trailStep + 1)}: quiet trail clues lead to the next sign.`}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Finish the path transition" onPress={game.skipScene} style={[styles.revealSkip, { top: 20, right: 24 }]}><Text style={styles.revealSkipText}>Continue</Text></Pressable></View>}
    {game.mode === 'crossing' && <RootCrossing progress={game.transition} width={width} height={height} onSkip={game.skipCrossing} />}
    {game.mode === 'revealing' && <View pointerEvents="box-none" style={styles.revealOverlay}>
      <View pointerEvents="none" style={[styles.revealCaption, { bottom: Math.max(28, insets.bottom + 16) }]}><Text style={styles.revealEyebrow}>THE OLD BALETE GROVE</Text><Text style={styles.revealTitle}>{game.reveal < 0.55 ? 'Something stirs in the branches…' : 'A very large someone.'}</Text></View>
      <Pressable accessibilityRole="button" accessibilityLabel="Skip Mang Uban reveal" onPress={game.skipReveal} style={[styles.revealSkip, { top: Math.max(16, insets.top + 8), right: Math.max(20, insets.right + 12) }]}><Text style={styles.revealSkipText}>Skip ›</Text></Pressable>
    </View>}
    {(game.mode === 'retrieving' || game.mode === 'sealRevealing' || game.mode === 'watching') && <View pointerEvents="box-none" style={styles.revealOverlay}>
      <View pointerEvents="none" style={[styles.revealCaption, { bottom: Math.max(28, insets.bottom + 16) }]}><Text style={styles.revealEyebrow}>{game.mode === 'watching' ? 'THE QUIET AFTER THE BELL' : game.mode === 'retrieving' ? 'A LITTLE RESOURCEFULNESS' : 'BEYOND BAMBOO CROSSING'}</Text><Text style={styles.revealTitle}>{game.mode === 'watching' ? 'For a moment, the village can rest.' : game.mode === 'retrieving' ? game.sceneTime < .55 ? 'A loop around the handle…' : 'One lost waybell, found.' : 'Water doesn’t leave a mark like that.'}</Text></View>
      <Pressable accessibilityRole="button" accessibilityLabel="Skip scene" onPress={game.skipScene} style={[styles.revealSkip, { top: Math.max(16, insets.top + 8), right: Math.max(20, insets.right + 12) }]}><Text style={styles.revealSkipText}>Skip ›</Text></Pressable>
    </View>}
  </View>;
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold, PixelifySans_400Regular, PixelifySans_700Bold });
  const [environmentAssets, environmentAssetError] = useAssets([YARD_MAP_IMAGE, CLEARING_MAP_IMAGE, ROOT_DESCENT_IMAGE, GROVE_MAP_IMAGE, WORKS_MAP_IMAGE, VERGE_MAP_IMAGE, TURNING_MAP_IMAGE, RAINROAD_IMAGE, HAMLET_IMAGE, SPRING_IMAGE, ...Object.values(SPRING_PROP_IMAGES), ...Object.values(SPRING_SURFACE_IMAGES), ...Object.values(WORKS_PROP_IMAGES), ...MAZE_TERRAIN_IMAGES.flat(), ...TRAVELER_WALK_IMAGES]);
  if ((!fontsLoaded && !fontError) || (!environmentAssets && !environmentAssetError)) return <View style={styles.loading}><StatusBar hidden /><ActivityIndicator color={C.gold} /><Text style={styles.loadingText}>A little adventure is waking up…</Text></View>;
  return <SafeAreaProvider><Game /></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  settingGroup: { marginTop: 17, gap: 9 },
  settingChoices: { flexDirection: 'row', gap: 8 },
  settingChoice: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#b9bf9e', borderRadius: 0, backgroundColor: '#ede8cf' },
  settingChoiceActive: { backgroundColor: '#38573e', borderColor: '#38573e' },
  root: { flex: 1, backgroundColor: '#71864c', overflow: 'hidden' },
  loading: { flex: 1, backgroundColor: '#213d31', justifyContent: 'center', alignItems: 'center', gap: 18 },
  loadingText: { color: '#ead9ad', fontSize: 14 },
  topShade: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#1f342b12' },
  header: { position: 'absolute', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  location: { flexShrink: 1, backgroundColor: '#223e30e8', borderWidth: 1, borderColor: '#d7ce9d36', borderRadius: 13, paddingVertical: 13, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', gap: 11, boxShadow: '0px 4px 16px #23332520' },
  locationIcon: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: '#c0c3a1', fontSize: 8, letterSpacing: 1.4, fontFamily: 'DMSans_600SemiBold', marginBottom: 3 },
  locationName: { color: '#f7edce', fontSize: 25, fontFamily: 'PixelifySans_400Regular', lineHeight: 28 },
  objective: { backgroundColor: '#fff2d6eb', maxWidth: 300, flex: 1, paddingHorizontal: 18, paddingVertical: 13, borderRadius: 11, borderWidth: 1, borderColor: '#fff7dd70' },
  objectiveTop: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  goldDot: { width: 5, height: 5, backgroundColor: '#a88742', transform: [{ rotate: '45deg' }] },
  objectiveLabel: { fontSize: 8, letterSpacing: 1.5, fontFamily: 'DMSans_700Bold', color: '#8b815e' },
  objectiveText: { color: '#445038', fontSize: 12, fontFamily: 'DMSans_600SemiBold', lineHeight: 18 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconButton: { width: 47, height: 47, borderRadius: 0, backgroundColor: 'transparent', borderWidth: 0, borderColor: '#e4ddb047', alignItems: 'center', justifyContent: 'center' },
  noteCount: { position: 'absolute', right: -4, top: -4, backgroundColor: '#dfc58b', width: 17, height: 17, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  noteCountText: { fontFamily: 'DMSans_700Bold', fontSize: 9, color: '#475337' },
  joystick: { position: 'absolute' },
  actionWrap: { position: 'absolute', width: 98, alignItems: 'center' },
  actionButton: { width: 78, height: 78, borderRadius: 0, borderWidth: 0, borderColor: '#fff5d6aa', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 4px 0px #394b3038' },
  actionCaption: { color: '#fff2ce', fontSize: 9, letterSpacing: 1.8, fontFamily: 'DMSans_700Bold', marginTop: 11, textShadowColor: '#30442b', textShadowRadius: 3 },
  targetLabel: { backgroundColor: '#2d4435e8', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 10, minWidth: 100 },
  targetLabelText: { textAlign: 'center', fontSize: 11, fontFamily: 'DMSans_500Medium', color: '#f2e8cc' },
  keyboardHint: { position: 'absolute', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: '#2a422e80', borderRadius: 8, paddingHorizontal: 13, paddingVertical: 8 },
  keyText: { fontSize: 8, color: '#f2e4bc', fontFamily: 'DMSans_700Bold', letterSpacing: 0.5 },
  keyDescription: { fontSize: 10, color: '#e9dfbbbd', fontFamily: 'DMSans_400Regular' },
  hintDivider: { height: 10, width: 1, backgroundColor: '#efdfb538', marginHorizontal: 10 },
  smallObjective: { position: 'absolute', alignSelf: 'center', borderRadius: 7, backgroundColor: '#fff2d6e8', paddingHorizontal: 13, paddingVertical: 7 },
  dialoguePosition: { position: 'absolute', alignItems: 'center' },
  dialogue: { width: '100%', maxWidth: 820, backgroundColor: '#faf0d8', borderWidth: 3, borderColor: '#b69e6b', borderRadius: 10, padding: 22, flexDirection: 'row', gap: 21, boxShadow: '0px 6px 0px #42513640' },
  portraitBox: { width: 76, height: 89, backgroundColor: '#dce0bf', borderWidth: 1, borderColor: '#bbc3a0', borderRadius: 5, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 5 },
  dialogueBody: { flex: 1 },
  speakerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
  speaker: { fontSize: 10, fontFamily: 'DMSans_700Bold', color: '#68774e', letterSpacing: 1.3 },
  lineCounter: { color: '#a29e83', fontFamily: 'DMSans_500Medium', fontSize: 10 },
  dialogueText: { fontFamily: 'DMSans_400Regular', fontSize: 18, lineHeight: 27, color: '#394432' },
  continueRow: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'flex-end', marginTop: 9 },
  continueText: { fontSize: 10, color: '#77805d', fontFamily: 'DMSans_600SemiBold' },
  mysteryPortrait: { fontSize: 45, fontFamily: 'PixelifySans_400Regular', color: '#6d7b51', paddingBottom: 9 },
  titleOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#182e27b8' },
  titleTop: { position: 'absolute', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandMark: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  titleEyebrow: { color: '#e4d7af', fontFamily: 'DMSans_600SemiBold', fontSize: 9, letterSpacing: 2 },
  chapterTop: { color: '#c8d0b29c', fontFamily: 'DMSans_600SemiBold', fontSize: 9, letterSpacing: 2 },
  titleContent: { position: 'absolute' },
  gameTitle: { fontFamily: 'PixelifySans_700Bold', fontSize: 88, lineHeight: 87, color: '#f5e8c3', textShadowColor: '#162a23', textShadowOffset: { width: 3, height: 4 }, textShadowRadius: 0 },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
  titleRule: { width: 24, height: 1, backgroundColor: '#c5ac72' },
  gameSubtitle: { color: '#ddc992', fontFamily: 'DMSans_600SemiBold', fontSize: 11, letterSpacing: 4 },
  titleDescription: { color: '#e1e3cadb', fontFamily: 'DMSans_400Regular', fontSize: 20, lineHeight: 30, marginTop: 26, marginBottom: 34 },
  startButton: { backgroundColor: 'transparent', borderWidth: 0, borderColor: '#fff5d6', borderRadius: 0, minHeight: 52, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 15, boxShadow: '0px 4px 0px #a18d5860' },
  startButtonText: { color: C.ink, fontFamily: 'DMSans_700Bold', fontSize: 13 },
  newGameButton: { paddingHorizontal: 4, minHeight: 42, justifyContent: 'center' },
  newGameText: { fontFamily: 'DMSans_500Medium', fontSize: 12, color: '#d9ddc4b3' },
  chapterCard: { position: 'absolute', borderLeftWidth: 1, borderLeftColor: '#c3bc8e52', paddingLeft: 25, width: 205 },
  chapterCardNumber: { fontFamily: 'PixelifySans_400Regular', fontSize: 50, color: '#e4d5aa88' },
  chapterCardRule: { width: 27, height: 2, backgroundColor: '#c3ab78', marginVertical: 10 },
  chapterCardTitle: { color: '#efdfb8', fontFamily: 'DMSans_500Medium', fontSize: 17, lineHeight: 25 },
  chapterCardCaption: { color: '#b1c2a3', fontFamily: 'DMSans_500Medium', fontSize: 7, letterSpacing: 1.5, marginTop: 19 },
  titleFooter: { position: 'absolute', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleFooterText: { fontFamily: 'DMSans_400Regular', color: '#ccd3b77d', fontSize: 10 },
  footerDots: { flexDirection: 'row', gap: 7 },
  footerDot: { width: 4, height: 4, backgroundColor: '#e1d8b135', transform: [{ rotate: '45deg' }] },
  modalBackdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#192f27ba', alignItems: 'center', justifyContent: 'center', padding: 20 },
  paper: { backgroundColor: '#f6edd6', borderWidth: 2, borderColor: '#c0ad7a', borderRadius: 11, maxWidth: '100%', flexGrow: 0, boxShadow: '0px 8px 0px #11291f44' },
  modalIcon: { alignSelf: 'center', marginBottom: 14 },
  modalEyebrow: { color: '#8e946e', fontSize: 8, letterSpacing: 1.6, fontFamily: 'DMSans_700Bold', textAlign: 'center' },
  modalTitle: { color: '#3f5039', fontFamily: 'PixelifySans_400Regular', fontSize: 34, lineHeight: 37, textAlign: 'center', marginTop: 9 },
  modalDescription: { color: '#7b8265', fontFamily: 'DMSans_400Regular', fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: 10, marginBottom: 22 },
  menuButtons: { gap: 11 },
  button: { backgroundColor: 'transparent', borderWidth: 0, borderColor: '#2d4532', minHeight: 49, borderRadius: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, flexDirection: 'row', gap: 15 },
  secondaryButton: { backgroundColor: 'transparent', borderColor: '#ccc5a7' },
  buttonText: { color: '#f5ecd6', fontFamily: 'PixelifySans_400Regular', fontSize: 16 },
  textButton: { alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  textButtonLabel: { color: '#818367', fontFamily: 'DMSans_500Medium', fontSize: 12 },
  notebookHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  closeButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  lolaNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 15, backgroundColor: '#e7e8d0', borderRadius: 4, marginBottom: 6 },
  lolaNoteText: { color: '#687451', fontSize: 12, lineHeight: 20, fontFamily: 'DMSans_500Medium', flex: 1 },
  noteRow: { flexDirection: 'row', gap: 13, paddingVertical: 17, borderBottomColor: '#d6d0b9', borderBottomWidth: 1 },
  noteBullet: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#e7e1cb', alignItems: 'center', justifyContent: 'center' },
  noteQuestion: { color: '#aaa98b', fontFamily: 'PixelifySans_400Regular', fontSize: 17 },
  noteTitle: { color: '#4e5d40', fontFamily: 'DMSans_600SemiBold', fontSize: 13, marginBottom: 4 },
  noteBody: { color: '#7c8368', fontFamily: 'DMSans_400Regular', fontSize: 12, lineHeight: 19 },
  notebookFooter: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14 },
  notebookFooterText: { color: '#97977b', fontFamily: 'DMSans_600SemiBold', fontSize: 8, letterSpacing: 0.6 },
  previewEnd: { color: '#96957b', textAlign: 'center', fontSize: 10, fontFamily: 'DMSans_400Regular', marginTop: 15 },
  saveNotice: { position: 'absolute', alignSelf: 'center', backgroundColor: '#fff0ce', padding: 10, borderRadius: 6 },
  saveNoticeText: { color: '#765e3b', fontFamily: 'DMSans_500Medium', fontSize: 11 },
  rotateHint: { position: 'absolute', alignSelf: 'center', bottom: '31%', padding: 10, backgroundColor: '#253e2dd9', borderRadius: 7 },
  rotateHintText: { color: '#f3e7c9', fontFamily: 'DMSans_500Medium', fontSize: 10 },
  noteTabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  noteTab: { paddingHorizontal: 12, minHeight: 42, justifyContent: 'center', borderWidth: 1, borderColor: '#c8c8ab', borderRadius: 0 },
  noteTabActive: { backgroundColor: '#53694b', borderColor: '#53694b' },
  noteTabText: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, color: '#6f7b59' },
  questionHeader: { flexDirection: 'row', gap: 17, alignItems: 'center' },
  questionPortrait: { width: 58, height: 65, borderRadius: 6, backgroundColor: '#dce3c8', alignItems: 'center', justifyContent: 'center' },
  topicButton: { minHeight: 48, borderRadius: 0, borderWidth: 1, borderColor: '#c9c9ac', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  topicText: { fontFamily: 'DMSans_500Medium', color: '#4d6043', fontSize: 13 },
  revealOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  revealCaption: { position: 'absolute', alignSelf: 'center', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 8, backgroundColor: '#20383bb0', gap: 7 },
  revealEyebrow: { color: '#b8c4a4', fontSize: 8, letterSpacing: 1.6, fontFamily: 'DMSans_600SemiBold' },
  revealTitle: { color: '#f0e4c0', fontFamily: 'PixelifySans_400Regular', fontSize: 25 },
  revealSkip: { position: 'absolute', minWidth: 65, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#c9d0ae66', borderRadius: 0, backgroundColor: '#243f3bb0' },
  revealSkipText: { color: '#e5e0bd', fontSize: 12, fontFamily: 'DMSans_500Medium' },
});
