import { mkdir, writeFile } from 'node:fs/promises';

// Original, deterministic synthesis: no downloaded samples or borrowed melodies.
const rate = 22050, tau = Math.PI * 2;
const assets = {};
let seed = 1927;
const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };
const buffer = seconds => new Float64Array(Math.round(seconds * rate));
const hz = midi => 440 * 2 ** ((midi - 69) / 12);
function note(out, start, duration, midi, amplitude, kind = 'flute') {
  const frequency = hz(midi), offset = Math.round(start * rate), size = Math.round(duration * rate);
  for (let i = 0; i < size; i++) {
    const t = i / rate, phase = tau * frequency * t;
    const envelope = Math.min(1, t / .012) * Math.min(1, (duration - t) / .065) * Math.exp(-t / (kind === 'pluck' ? .23 : 1.8));
    const tone = Math.sin(phase + .012 * Math.sin(tau * 5 * t)) + .14 * Math.sin(phase * 2) + .055 * Math.sin(phase * 3);
    const at = (offset + i) % out.length;
    out[at] += tone * amplitude * envelope;
  }
}
function tap(out, start, amplitude = .09, woody = false) {
  const offset = Math.round(start * rate);
  for (let i = 0; i < rate * .11; i++) {
    const t = i / rate, at = offset + i;
    if (at >= out.length) break;
    out[at] += amplitude * Math.min(1, t / .002) * Math.exp(-t * 65) * (.5 * random() + .6 * Math.sin(tau * (woody ? 155 : 260) * t));
  }
}
function bell(out, start, frequency, amplitude, decay = 1) {
  for (let i = 0; i < Math.min(out.length - Math.round(start * rate), rate * decay * 3); i++) {
    const t = i / rate, at = Math.round(start * rate) + i;
    let tone = 0;
    for (const [partial, weight, damp] of [[1, 1, 1], [2.013, .4, 1.3], [2.76, .2, 2], [4.07, .1, 3.5]]) tone += weight * Math.sin(tau * frequency * partial * t) * Math.exp(-t * damp / decay);
    out[at] += amplitude * tone * Math.min(1, t / .003) * Math.min(1, (out.length - at) / (rate * .045));
  }
}
function music(kind) {
  const beat = 60 / (kind === 'yard' ? 96 : 84), out = buffer(beat * 32);
  const chords = kind === 'yard' ? [[48, 55, 60, 64], [53, 60, 65, 69], [45, 52, 57, 60], [55, 62, 67, 71]] : [[45, 52, 57, 60], [53, 60, 65, 69], [48, 55, 60, 64], [55, 62, 67, 69]];
  const melody = kind === 'yard'
    ? [[72, 76, 79, 76, 74, 72, 67, 69], [69, 72, 77, 76, 72, 69, 67, 72], [76, 79, 81, 79, 76, 74, 72, 69], [71, 74, 79, 76, 74, 71, 67, 72]]
    : [[76, 72, 69, 67, 69, 72, 76, 79], [77, 76, 72, 69, 67, 69, 72, 76], [79, 76, 72, 67, 64, 67, 72, 76], [74, 71, 67, 69, 72, 71, 67, 69]];
  for (let bar = 0; bar < 8; bar++) {
    const chord = chords[bar % 4], start = bar * 4 * beat;
    for (let j = 0; j < 4; j++) note(out, start + j * beat, beat * .8, chord[j], .052, 'pluck');
    for (let j = 0; j < 8; j++) {
      // Phrase breathing keeps the short loop from becoming a constant lead line.
      if ((bar === 3 || bar === 7) && j === 7) continue;
      note(out, start + j * beat / 2, beat * (j % 3 ? .43 : .7), melody[bar % 4][j] + (bar > 3 && j === 3 ? -12 : 0), kind === 'yard' ? .13 : .105);
    }
    note(out, start, beat * 1.8, chord[0] - 12, .07);
    note(out, start + beat * 2, beat * 1.6, chord[1] - 12, .055);
    for (let j = 0; j < 4; j++) tap(out, start + j * beat, kind === 'yard' ? .033 : .018, true);
  }
  return out;
}
function ambience(kind) {
  const out = buffer(8); let low = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / rate, n = random(); low = low * .93 + n * .07;
    const bed = kind === 'water' ? low * .65 + n * .028 : low * .16;
    out[i] = bed * (.8 + .12 * Math.sin(tau * t / 8) + .08 * Math.cos(tau * t / 4));
    if (kind === 'forest') out[i] += .018 * Math.sin(tau * 2450 * t) * Math.max(0, Math.sin(tau * 3 * t)) ** 8 * (.6 + .4 * Math.sin(tau * t / 8) ** 2);
  }
  if (kind === 'garden') for (const start of [.5, 2.7, 5.4, 6.1]) for (let i = 0; i < rate * .2; i++) {
    const t = i / rate; out[Math.round(start * rate) + i] += .12 * Math.sin(tau * (1500 * t + 1300 * t * t)) * Math.sin(Math.PI * t / .2) ** 2;
  }
  // Fade only the noise bed at the seam; the music itself is synthesized circularly.
  for (let i = 0; i < rate * .025; i++) { const gain = i / (rate * .025); out[i] *= gain; out[out.length - 1 - i] *= gain; }
  return out;
}
async function save(name, out, maxPeak = .72) {
  let peak = 0; for (const sample of out) peak = Math.max(peak, Math.abs(sample));
  const gain = peak > maxPeak ? maxPeak / peak : 1, wav = Buffer.alloc(44 + out.length * 2);
  wav.write('RIFF', 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(out.length * 2, 40);
  let sum = 0;
  for (let i = 0; i < out.length; i++) { const sample = out[i] * gain; sum += sample * sample; wav.writeInt16LE(Math.round(sample * 32767), 44 + i * 2); }
  await writeFile(`assets/audio/${name}.wav`, wav);
  assets[name] = { seconds: +(out.length / rate).toFixed(3), bytes: wav.length, peak: +(peak * gain).toFixed(4), rms: +Math.sqrt(sum / out.length).toFixed(4) };
}
await mkdir('assets/audio', { recursive: true });
await save('afternoon', music('yard'));
await save('silong', music('silong'));
for (const kind of ['garden', 'forest', 'water']) await save(kind, ambience(kind));
let out = buffer(.16); note(out, 0, .12, 81, .17, 'pluck'); await save('tap', out);
out = buffer(.13); tap(out, 0, .32, true); tap(out, .035, .1); await save('step', out);
out = buffer(.6); for (let i = 0; i < 6; i++) tap(out, i * .065, .2 - i * .015, true); await save('push', out);
out = buffer(.34); tap(out, 0, .3, true); tap(out, .16, .32, true); note(out, .05, .2, 43, .1); await save('lever', out);
out = buffer(2.6); bell(out, 0, hz(76), .35, .7); await save('bell', out);
out = buffer(.9); bell(out, 0, 587, .2, .12); bell(out, .24, 611, .13, .15); bell(out, .57, 566, .19, .1); await save('clang', out);
out = buffer(1.1); [72, 76, 79].forEach((m, i) => note(out, i * .14, .6, m, .23, 'pluck')); await save('found', out);
out = buffer(1.5); for (let i = 0; i < out.length; i++) { const t = i / rate; out[i] = Math.sin(Math.PI * t / 1.5) ** 2 * (.1 * random() + .12 * Math.sin(tau * (120 * t + 90 * t * t))); } await save('crossing', out);
out = buffer(.8); for (const start of [0, .12, .47, .6]) tap(out, start, .4, true); await save('hooves', out);
out = buffer(3.2); [72, 76, 79, 84, 79, 84].forEach((m, i) => note(out, i * .24, i === 5 ? 1.6 : .4, m, .22)); [48, 55, 60, 64].forEach(m => note(out, 1.2, 1.8, m, .08)); await save('complete', out);
await writeFile('assets/audio/manifest.json', JSON.stringify({ sampleRate: rate, channels: 1, encoding: 'PCM16', originalSynthesis: true, assets }, null, 2) + '\n');
console.log(`Generated ${Object.keys(assets).length} original WAV assets (${(Object.values(assets).reduce((n, a) => n + a.bytes, 0) / 1048576).toFixed(2)} MiB).`);
