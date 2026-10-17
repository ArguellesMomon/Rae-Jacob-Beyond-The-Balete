import type { DialogueLine, InteractionId, Progress, SceneryId } from './model.ts';
import { isResident, residentLines } from './residents.ts';

const R = (text: string, beat?: string): DialogueLine => ({ speaker: 'Rae Jacob', text, emotion: 'curious', ...(beat ? { beat } : {}) });
const T = (text: string): DialogueLine => ({ speaker: 'Tala', text, emotion: 'warm', gesture: 'map' });
const U = (text: string): DialogueLine => ({ speaker: 'Mang Uban', text, emotion: 'warm', gesture: 'reach' });
export const LISTENING_SEED_DESCRIPTION = 'A warm seed in a thumb-sized wooden case. Mang Uban says it may answer a place where roots remember. It is quiet for now; keep it for a later journey.';

export function worldLines(id: InteractionId, p: Progress): DialogueLine[] | null {
  if (isResident(id)) return residentLines(id, p);
  if (id === 'mangGift') return !p.bellRung ? [U('A gift can wait. A crossing still needs its bell.')] : p.ubanGiftReceived ? [U('Keep the seed safe, little traveler. It has not finished waiting.')] : [
    U('Before you take the bamboo road, little traveler. Hold out your hand.'),
    R('For a snack? Tala said a folded leaf was practically a speech.'),
    U('Then this will be an unnecessarily long conversation.'),
    { ...U('A listening seed. The case is from a fallen branch. No living tree was asked to lose a piece.'), prop: 'seed', beat: 'A giant hand lowers a little wooden case. Rae needs only his thumb to lift its lid.' },
    R('It is warm. Is something alive in there?'),
    U('Something waiting. Keep it dry. Do not bury it simply because someone calls it a seed.'),
    T('What will it do?'),
    U('In a place where old roots remember, it may answer. I cannot tell you which place. Mine has never asked it the right question.'),
    R('So it will not open the next door for us?'),
    U('Not every gift belongs to the next door. You listened before blaming a shadow, and mended more than a noisy wheel. I trust you to notice when its time comes.'),
    { ...R('Lola says to keep the patient part. I think I am collecting patient things.', 'He tucks the closed case beside his spare kite string.'), prop: 'seed', emotion: 'warm', gesture: 'reach' },
    U('A useful collection. And Rae—thank you. For the quiet, and for asking.'),
    R('I will look after it. I promise.'),
  ];
  if (id === 'listeningSeed') return p.ubanGiftReceived ? [
    { ...R('Still warm. Still quiet.'), prop: 'seed', beat: 'The smooth case fits in his palm. A pale seam crosses the seed inside.' },
    T('A place where roots remember. I will leave a small mark beside that sentence.'),
    R('We do not have to use everything the moment we find it. It can come with us.'),
    { ...R(LISTENING_SEED_DESCRIPTION), prop: 'seed', emotion: 'warm' },
  ] : [R('I have not received that keepsake yet.')];
  const descriptions: Record<SceneryId, DialogueLine[]> = {
    lampShelf: [R('One little lamp, a spare wick, and a folded cloth. Somebody packed this carefully.'), T('Nilo leaves one ready for visitors. He says finding the light should be the easy part.'), R('When I get home, I will remember to leave the porch lamp on, too.')],
    messageBoard: [R('“Extra bed dry. Ask Sela.” “Missing blue thread.” “Please return the tiny ladder.”'), T(p.bellRung ? 'And a new note: “Thank you, waterkeepers and travelers.” Minda has very neat writing.' : 'People moved their things when the water rose. Everybody is trying to find the right owner again.'), R('There is a little drawing for someone who cannot read the words. That is a good sign.')],
    dryingRack: [R('Those slippers are smaller than my thumb. That sleeve has been patched twice.'), T(p.waterRestored ? 'Drying at last. Their owner will be pleased.' : 'The lower homes are damp. We share the higher racks until the water settles.'), R('A whole afternoon waiting for your favorite shirt. Some things are the same size in every world.')],
    seedTray: [R('Every seed has its own shallow place. Even the cracked ones.'), T('Doro sorts the fallen ones. He will not know which will grow until he gives them time.'), R('Lola would like these trays. She would probably reorganize them before admitting it.')],
    rainCup: [R('A leaf folded into a cup. How does it hold together?'), T('A little peg, a careful fold, and not asking it to hold too much.'), R('There is a giant fingerprint on the stone beside it. Mang really does use careful hands.')],
    listeningStone: [R(p.bellRecovered ? 'Birds. Water. A leaf scratching another leaf. I can hear separate things again.' : 'I can feel that clanging through the stone. It travels underneath my feet.'), T('This was a quiet stopping place before the surge. We can leave a little quiet behind us, too.'), R('Just one breath, then. There is no hurry inside one breath.')],
    toolRoll: [R('Every tool has a shape stitched beneath it. There is even a space for a very small hammer.'), T('Pilo checks the empty shapes before he carries anything away.'), R('Lola would put a slipper shape beside our door. Possibly two.')],
    floatGauge: [R(p.waterRestored ? 'The float holds at the middle mark. No jumping.' : p.flowDiverted ? 'It rose when the west gate opened. Now it has found a steady mark.' : 'Three marks on the post. The float keeps bumping the upper one.'), T('A gauge turns a change into something we can compare. Pilo watches this while Minda checks the gates.'), R('Notice, then check. Everyone here has a different way of saying it.')],
    reedChimes: [R('The breeze can move these reeds without moving the water gate. They have different jobs.'), T('Pilo hung them where the bank stays dry. A small sound above a large one.'), R(p.flowDiverted || p.bellRecovered ? 'Now I can hear the little sound.' : 'I want to hear them without that wheel answering.')],
  };
  const memory = descriptions[id as SceneryId];
  return memory ? memory.filter(line => p.metTala || line.speaker !== 'Tala') : null;
}
