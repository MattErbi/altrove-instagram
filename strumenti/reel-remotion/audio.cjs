// THE SOUNDTRACK — voice + music bed + sound effects, all placed from score.json (same cue times as the picture).
//   node audio.cjs [genre]     -> out/mix.wav (-14 LUFS, true peak -1.5 dBTP).  STEMS=1 also writes out/stem-*.wav
// Music: animation-studio engine (vendor/engine, synthesized, no samples). Effects: Kenney CC0 sounds in sfx/.
const path = require('path'), fs = require('fs');
const { SR, Bus, reverb } = require('./vendor/engine/audio/dsp');
const I = require('./vendor/engine/audio/instruments');
const MIX = require('./vendor/engine/audio/mix');
const MU = require('./vendor/engine/music');
const Genre = require('./vendor/engine/audio/genres');
const { decode } = require('./vendor/engine/audio/voice');

const score = JSON.parse(fs.readFileSync('score.json', 'utf8'));
const DUR = score.duration, N = Math.ceil((DUR + 0.5) * SR);
const bus = () => new Bus(N);
const drums = bus(), bass = bus(), pad = bus(), keys = bus(), voice = bus(), fx = bus(), verb = bus();
const GENRE = process.argv[2] || 'afrobeats';

// ---------- voice ----------
for (const sc of score.scenes) voice.addMono(decode(path.join('public/audio', sc.id + '.wav')), sc.start + sc.lead, 1.0);

// ---------- music: warm travel groove in F, quiet intro bar, drums from bar 1, soft outro ----------
const BPM = +(process.argv[3] || 104);
const clock = MU.makeClock({ bpm: BPM });
const bars = Math.ceil(DUR / clock.BAR) + 1;
const prog = (process.env.PROG || 'F,C,Dm,Bb').split(',');
const { chords, chordAt } = MU.makeChords(clock, {
  F: { notes: ['A3', 'C4', 'F4'], bass: 'F2' }, C: { notes: ['G3', 'C4', 'E4'], bass: 'C2' },
  Dm: { notes: ['A3', 'D4', 'F4'], bass: 'D2' }, Bb: { notes: ['Bb3', 'D4', 'F4'], bass: 'Bb1' },
}, Array.from({ length: bars }, (_, b) => [b, 0, 4, prog[b % 4]]));
const endScene = score.scenes[score.scenes.length - 1];
const endBar = Math.floor(endScene.start / clock.BAR);
const kicks = [];
Genre.play(GENRE, { clock, from: 0, to: 1, chordAt, buses: { drums, bass, pad, keys }, drums: false, bassline: false, kicks });
Genre.play(GENRE, { clock, from: 1, to: endBar, chordAt, buses: { drums, bass, pad, keys }, fill: [endBar - 1], kicks });
Genre.play(GENRE, { clock, from: endBar, to: bars, chordAt, buses: { drums, bass, pad, keys }, drums: false, gain: 0.8 });
for (const c of chords) for (const n of c.notes) { const { L, R } = I.padNote(n, c.t1 - c.t0, { cutoff: 1100, attack: 0.4, release: 1.2 }); pad.addStereo(L, R, c.t0, 0.05); }
// music-box hook on the logo moments
const hook = (t0, notes) => notes.forEach(([n, d], i) => { const x = I.musicBox(MU.m(n) + 12); keys.addMono(x, t0 + d, 0.2); verb.addMono(x, t0 + d, 0.25); });

// ---------- sound effects ----------
const norm = (buf, peak = 0.5) => { let m = 0; for (const v of buf) m = Math.max(m, Math.abs(v)); const g = m ? peak / m : 1; return buf.map((v) => v * g); };
const K = (f) => norm(decode(path.join('sfx', f + '.ogg')));
const S = {
  pop: [K('pluck_002'), 0.55], pop2: [K('drop_002'), 0.45], tick: [K('click_002'), 0.4], toggle: [K('toggle_002'), 0.5],
  coins: [K('chips-collide-2'), 0.6], coins2: [K('chips-handle-3'), 0.5], ding: [K('confirmation_001'), 0.35],
  slide: [K('card-slide-3'), 0.5], stamp: [K('impactPunch_heavy_000'), 0.8], impact: [K('impactSoft_heavy_001'), 0.85],
  whoosh: [norm(I.noiseSweep(0.36, 350, 4200, { q: 1, pink: true, shape: (x) => x * x })), 0.5],
  whoosh_s: [norm(I.noiseSweep(0.22, 1200, 5200, { q: 1, pink: true })), 0.35],
  sparkle: [K('glass_002'), 0.4],
};
// split-flap board rattle: the click sample repeated at irregular 25-45 ms steps, fading out
const rattle = (dur) => { const c = K('click_002'), out = new Float32Array(Math.ceil((dur + 0.2) * SR)); let t = 0, i = 0;
  while (t < dur) { const g = (0.55 + 0.45 * ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1) * Math.min(1, (dur - t) / 0.25 + 0.2); const o = Math.round(t * SR);
    for (let j = 0; j < c.length && o + j < out.length; j++) out[o + j] += c[j] * g; t += 0.025 + 0.02 * (((Math.sin(i * 78.233) * 12345.678) % 1 + 1) % 1); i++; }
  return out; };
S.rattle = [rattle(0.6), 0.3]; S.rattleL = [rattle(1.35), 0.3];
let ci = 0;
for (const e of score.sfx) {
  if (e.k === 'sparkle') hook(e.t, [['F5', 0], ['A5', 0.09], ['C6', 0.18], ['F6', 0.27]]);
  const s = e.k === 'coins' ? (ci++ % 2 ? S.coins2 : S.coins) : S[e.k];
  if (!s) { console.warn('unknown sfx', e.k); continue; }
  fx.addMono(s[0], e.t, s[1] * (e.gain || 1), e.k === 'whoosh' ? 0.15 : 0);
}

// ---------- mix ----------
MIX.duck([drums, bass, pad, keys], voice, { depth: 0.62 });
MIX.sidechain([pad, bass], kicks, { depth: 0.25 });
const stems = { drums, bass, pad, keys, voice, fx, verb: reverb(verb, { room: 0.8, damp: 0.35 }) };
const GAIN = { drums: 0.2, bass: 0.32, pad: 1.3, keys: 0.26, voice: 1.0, fx: 0.7, verb: 0.8 };
const MUS = +(process.env.MUSIC || 1); for (const k of ['drums', 'bass', 'pad', 'keys']) GAIN[k] *= MUS; // MUSIC=0.7 -> music bed 3 dB quieter (dense genres like edm)
fs.mkdirSync('out', { recursive: true });
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? 'out' : null });
MIX.highpass(mix, 30);
MIX.fadeOut(mix, DUR - 1.0, DUR);
const M = MIX.master(mix, 0.8, undefined, { lufs: -14 });
MIX.writeWav('out/mix.wav', mix);
console.log(`out/mix.wav ${DUR.toFixed(2)}s, ${M.lufs !== undefined ? M.lufs.toFixed(1) + ' LUFS' : ''} (${GENRE}, ${BPM} BPM)`);
