import type { DialogueLine, Progress, ReplyTone, StoryChoiceId } from './model.ts';

export const REPLY_TONES: ReplyTone[] = ['playful', 'cautious', 'thoughtful'];
type Reply = { label: string; lines: DialogueLine[] };
const R = (text: string, emotion: DialogueLine['emotion'] = 'warm'): DialogueLine => ({ speaker: 'Rae Jacob', text, emotion, gesture: 'talk' });
const T = (text: string, emotion: DialogueLine['emotion'] = 'warm'): DialogueLine => ({ speaker: 'Tala', text, emotion, gesture: 'map' });
export const STORY_CHOICES: Record<StoryChoiceId, { prompt: string; replies: Record<ReplyTone, Reply> }> = {
  bagtasIntent: {
    prompt: 'How does Rae answer Bagtas?',
    replies: {
      playful: { label: 'A road that does not race my slippers.', lines: [R('A road that does not race my slippers. They have had a very long afternoon.', 'wry'), { speaker: 'Bagtas', text: 'I shall reduce my magnificent stride. Tell your slippers they are receiving special consideration.', emotion: 'wry' }, R('They are excellent at stopping for clues. And snacks.')] },
      cautious: { label: 'Tell us what you have actually checked.', lines: [R('Tell us what you have actually checked. I need to know when a direction is a guess.', 'worried'), { speaker: 'Bagtas', text: 'You bargain like a surveyor. Very well. Checked ground first; my excellent theories clearly labeled.', emotion: 'warm' }, R('Then I can help you check it.', 'determined')] },
      thoughtful: { label: 'We can help you find your way, too.', lines: [R('You have been coming back to your own footprints. We can help you find your way, too.'), { speaker: 'Bagtas', text: 'Help me? An unusual proposal. Hm. A good guide recognizes a useful traveling party. Accepted.', emotion: 'wry' }, R('Tala and I are learning that neither person has to know every turn.')] },
    },
  },
  firstTrust: {
    prompt: 'How does Rae answer Tala?',
    replies: {
      playful: { label: 'A careful pencil and a very large foot!', lines: [R('A careful pencil and a very large foot. That sounds like a proper exploring team!', 'delighted'), T('Only if the very large foot waits at corners.'), R('I can do a small wait. A very heroic small wait.', 'wry')] },
      cautious: { label: 'Can we take it one safe path at a time?', lines: [R('Can we take it one safe path at a time? I have already fallen down quite enough today.', 'worried'), T('Yes. If I do not know a path, I will tell you. We can stop together.'), R('Then I would like you to come.', 'warm')] },
      thoughtful: { label: 'We can help each other find the way.', lines: [R('You know these little roads. I can reach the things above them. We can help each other find the way.'), T('I had been thinking of all the places I could not reach alone.'), R('Then we can start with one of those.', 'determined')] },
    },
  },
  mapMistake: {
    prompt: 'Tala has found an error on her map. What does Rae say?',
    replies: {
      playful: { label: 'The water forgot to read your map.', lines: [R('The water forgot to read your map. Very bad manners, water.', 'wry'), T('I suppose I cannot make it copy the correct route as punishment.', 'wry'), R('We can make a new mark instead. A very damp-looking one.')] },
      cautious: { label: 'Let us check the ground before we go.', lines: [R('Let us check the ground before we go. I would rather stop than have either of us fall.', 'worried'), T('You are right. The page should remind us to look, not make us stop looking.'), R('I will watch the bank while you mark it.', 'determined')] },
      thoughtful: { label: 'A correction means we learned something.', lines: [R('A correction means we learned something. It does not mean the whole map is bad.'), T('I thought a real mapmaker would have known before bringing someone here.', 'wistful'), R('You noticed. You told me. That is someone I can walk with.')] },
    },
  },
};

export function parseStoryChoices(value: unknown): Progress['storyChoices'] {
  if (!value || typeof value !== 'object') return {};
  const choices = value as Record<string, unknown>;
  return Object.fromEntries((['firstTrust', 'mapMistake', 'bagtasIntent'] as const).flatMap(id => REPLY_TONES.includes(choices[id] as ReplyTone) ? [[id, choices[id]]] : []));
}

/** Reconstruct answered choices when an unfinished introduction restarts after loading. */
export function choiceBeat(id: StoryChoiceId, p: Progress, line: DialogueLine): DialogueLine[] {
  const answer = p.storyChoices[id];
  return answer ? [line, ...STORY_CHOICES[id].replies[answer].lines] : [{ ...line, choice: id }];
}

export function chooseStoryReply(p: Progress, id: StoryChoiceId, tone: ReplyTone): Progress {
  if (!REPLY_TONES.includes(tone) || p.storyChoices[id]) return p;
  return { ...p, storyChoices: { ...p.storyChoices, [id]: tone } };
}

export function friendshipCallback(p: Progress): DialogueLine[] {
  const tone = p.storyChoices.firstTrust;
  if (tone === 'playful') return [T('The careful pencil would like to report that the very large foot kept its promises.', 'wry'), R('A heroic number of small waits.', 'delighted')];
  if (tone === 'cautious') return [T('One safe path at a time. You asked for that when we met. I am keeping it on the map.'), R('And when we do not know the next one, we stop together.')];
  if (tone === 'thoughtful') return [T('You said we could help each other find the way. I did not know how much I needed to hear that.'), R('I needed somebody to say yes.')];
  return [T('When you arrived, I offered directions. Now I would like to keep walking beside you.'), R('I would like that, too.')];
}
