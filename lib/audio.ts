'use client';

/**
 * Murmur's sound engine — six procedurally generated layers built with the Web Audio API.
 * Nothing is downloaded: noise buffers, rain drops, fire crackle and birdsong are synthesised
 * once on first play, then looped through filters and slow LFOs so they keep drifting.
 *
 * The state lives in a tiny external store (subscribe/get) so any component can read it
 * with `useAudio()` and the hero, nav, mixer and sleep-timer all stay in sync.
 */

import { useSyncExternalStore } from 'react';

export type ChannelId = 'rain' | 'waves' | 'wind' | 'fire' | 'birds' | 'brown';
export const CHANNELS: ChannelId[] = ['rain', 'waves', 'wind', 'fire', 'birds', 'brown'];

type Levels = Record<ChannelId, number>;
export type AudioState = { playing: boolean; levels: Levels; sleepAt: number | null };

const INITIAL: AudioState = {
  playing: false,
  levels: { rain: 0.7, waves: 0, wind: 0, fire: 0, birds: 0, brown: 0.35 },
  sleepAt: null,
};

let state = INITIAL;
const listeners = new Set<() => void>();
const emit = (patch: Partial<AudioState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => (listeners.add(l), () => void listeners.delete(l));
export function useAudio() {
  return useSyncExternalStore(subscribe, () => state, () => INITIAL);
}
export const getAudio = () => state;

// ── graph ────────────────────────────────────────────────────────────────────

let ctx: AudioContext | null = null;
let master: GainNode;
let analyser: AnalyserNode;
const gains = {} as Record<ChannelId, GainNode>;
// Per-layer loudness trim so the sliders feel even.
const TRIM: Levels = { rain: 0.55, waves: 0.8, wind: 0.7, fire: 0.9, birds: 0.35, brown: 0.6 };
const MASTER = 0.8;
let suspendTimer = 0;
let sleepTimer = 0;

function buffer(seconds: number, fill: (data: Float32Array, sr: number, ch: number) => void, channels = 2) {
  const b = ctx!.createBuffer(channels, Math.floor(ctx!.sampleRate * seconds), ctx!.sampleRate);
  for (let c = 0; c < channels; c++) fill(b.getChannelData(c), ctx!.sampleRate, c);
  return b;
}

const white = (d: Float32Array) => {
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
};
const brown = (d: Float32Array) => {
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    d[i] = last * 3.5;
  }
};
const pink = (d: Float32Array) => {
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.969 * b2 + w * 0.153852;
    b3 = 0.8665 * b3 + w * 0.3104856;
    b4 = 0.55 * b4 + w * 0.5329522;
    b5 = -0.7616 * b5 - w * 0.016898;
    d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
    b6 = w * 0.115926;
  }
};

/** Sparse decaying sine "plinks" — individual rain drops. */
const drops = (d: Float32Array, sr: number) => {
  const n = Math.floor((d.length / sr) * 70);
  for (let k = 0; k < n; k++) {
    const at = Math.floor(Math.random() * d.length);
    const f = 1400 + Math.random() * 3600;
    const amp = 0.04 + Math.random() ** 3 * 0.3;
    const len = Math.floor(sr * (0.004 + Math.random() * 0.01));
    for (let i = 0; i < len && at + i < d.length; i++) d[at + i] += Math.sin((2 * Math.PI * f * i) / sr) * amp * Math.exp((-6 * i) / len);
  }
};

/** Short noisy pops with random spacing — fire crackle. */
const crackle = (d: Float32Array, sr: number) => {
  let t = 0;
  while (t < d.length) {
    t += Math.floor(sr * (0.02 + Math.random() ** 2 * 0.5));
    const amp = 0.2 + Math.random() ** 2 * 0.8;
    const len = Math.floor(sr * (0.001 + Math.random() * 0.012));
    for (let i = 0; i < len && t + i < d.length; i++) d[t + i] += (Math.random() * 2 - 1) * amp * Math.exp((-5 * i) / len);
  }
};

/** Phrases of quick frequency-swept chirps — synthetic birdsong. */
const birdsong = (d: Float32Array, sr: number, ch: number) => {
  let t = Math.floor(sr * (0.3 + ch * 0.9));
  while (t < d.length) {
    const base = 2600 + Math.random() * 2200;
    const notes = 2 + Math.floor(Math.random() * 5);
    const dir = Math.random() > 0.5 ? 1 : -1;
    for (let n = 0; n < notes; n++) {
      const dur = 0.04 + Math.random() * 0.09;
      const len = Math.floor(sr * dur);
      const f0 = base + (Math.random() - 0.5) * 500;
      const f1 = f0 + dir * (600 + Math.random() * 1400);
      let phase = 0;
      for (let i = 0; i < len && t + i < d.length; i++) {
        const p = i / len;
        phase += (2 * Math.PI * (f0 + (f1 - f0) * p)) / sr;
        d[t + i] += Math.sin(phase) * Math.sin(Math.PI * p) * 0.3;
      }
      t += len + Math.floor(sr * (0.03 + Math.random() * 0.1));
    }
    t += Math.floor(sr * (1.2 + Math.random() * 3.5));
  }
};

function loop(buf: AudioBuffer) {
  const s = ctx!.createBufferSource();
  s.buffer = buf;
  s.loop = true;
  // Start each loop at a random point so layers never line up the same way.
  s.start(0, Math.random() * buf.duration);
  return s;
}
function filter(type: BiquadFilterType, frequency: number, Q = 0.7) {
  return new BiquadFilterNode(ctx!, { type, frequency, Q });
}
function gain(value: number) {
  return new GainNode(ctx!, { gain: value });
}
/** Slow sine LFO added onto an AudioParam. */
function lfo(param: AudioParam, hz: number, depth: number) {
  const o = new OscillatorNode(ctx!, { frequency: hz });
  const g = gain(depth);
  o.connect(g).connect(param);
  o.start();
}

function build() {
  ctx = new AudioContext({ latencyHint: 'playback' });
  master = gain(0);
  const comp = new DynamicsCompressorNode(ctx, { threshold: -18, ratio: 3, attack: 0.02, release: 0.3 });
  analyser = new AnalyserNode(ctx, { fftSize: 512, smoothingTimeConstant: 0.82 });
  master.connect(comp).connect(analyser).connect(ctx.destination);

  for (const id of CHANNELS) {
    gains[id] = gain(0);
    gains[id].connect(master);
  }

  const pinkBuf = buffer(9, pink);
  const brownBuf = buffer(9, brown);

  // Rain: bright pink hiss plus individual drops.
  const hiss = loop(pinkBuf).connect(filter('highpass', 500)).connect(filter('lowpass', 7500)).connect(gain(0.9));
  hiss.connect(gains.rain);
  loop(buffer(8, drops)).connect(filter('highpass', 900)).connect(gain(0.9)).connect(gains.rain);

  // Waves: low noise whose volume and brightness swell on a ~11 s cycle.
  const waveLp = filter('lowpass', 650);
  const waveAmp = gain(0.5);
  loop(brownBuf).connect(waveLp).connect(waveAmp).connect(gains.waves);
  lfo(waveAmp.gain, 0.09, 0.45);
  lfo(waveLp.frequency, 0.09, 420);

  // Wind: band-passed noise with a wandering centre frequency.
  const windBp = filter('bandpass', 420, 0.9);
  const windAmp = gain(0.8);
  loop(buffer(9, white)).connect(windBp).connect(windAmp).connect(gains.wind);
  lfo(windBp.frequency, 0.055, 260);
  lfo(windAmp.gain, 0.13, 0.3);

  // Fire: a low rumble under sharp crackles.
  loop(brownBuf).connect(filter('lowpass', 260)).connect(gain(0.9)).connect(gains.fire);
  loop(buffer(7, crackle)).connect(filter('highpass', 1100)).connect(gain(0.55)).connect(gains.fire);

  // Birds: chirps, slightly softened.
  loop(buffer(14, birdsong)).connect(filter('lowpass', 7000)).connect(gains.birds);

  // Brown noise, plain and deep.
  loop(brownBuf).connect(filter('lowpass', 900)).connect(gains.brown);

  applyLevels(state.levels, true);
}

function applyLevels(levels: Levels, instant = false) {
  if (!ctx) return;
  for (const id of CHANNELS) {
    const v = levels[id] ** 2 * TRIM[id];
    gains[id].gain.setTargetAtTime(v, ctx.currentTime, instant ? 0.001 : 0.08);
  }
}

// ── public API ───────────────────────────────────────────────────────────────

export async function play() {
  if (!ctx) build();
  window.clearTimeout(suspendTimer);
  await ctx!.resume();
  master.gain.cancelScheduledValues(ctx!.currentTime);
  master.gain.setTargetAtTime(MASTER, ctx!.currentTime, 0.6);
  emit({ playing: true });
}

export function pause(fade = 0.25) {
  if (!ctx) return;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(0, ctx.currentTime, fade);
  window.clearTimeout(suspendTimer);
  suspendTimer = window.setTimeout(() => ctx?.suspend(), fade * 6000);
  window.clearTimeout(sleepTimer);
  emit({ playing: false, sleepAt: null });
}

export const toggle = () => (state.playing ? pause() : play());

export function setLevel(id: ChannelId, v: number) {
  const levels = { ...state.levels, [id]: Math.max(0, Math.min(1, v)) };
  emit({ levels });
  applyLevels(levels);
}

export function setMix(partial: Partial<Levels>) {
  const levels = Object.fromEntries(CHANNELS.map((id) => [id, partial[id] ?? 0])) as Levels;
  emit({ levels });
  applyLevels(levels);
}

/** Fade out after `minutes` (only while playing). `null` clears the timer. */
export function sleepAfter(minutes: number | null) {
  window.clearTimeout(sleepTimer);
  if (minutes === null || !state.playing) return emit({ sleepAt: null });
  const at = Date.now() + minutes * 60_000;
  sleepTimer = window.setTimeout(() => pause(8), minutes * 60_000);
  emit({ sleepAt: at });
}

/** Current loudness 0..1 (0 when silent) — used to make visuals breathe with the sound. */
const td = new Uint8Array(512);
export function level() {
  if (!ctx || !state.playing) return 0;
  analyser.getByteTimeDomainData(td);
  let sum = 0;
  for (let i = 0; i < td.length; i++) {
    const v = (td[i] - 128) / 128;
    sum += v * v;
  }
  return Math.min(1, Math.sqrt(sum / td.length) * 4);
}

/** Frequency bins 0..255 into `out` (zeros when silent). */
export function spectrum(out: Uint8Array<ArrayBuffer>) {
  if (!ctx || !state.playing) return out.fill(0);
  analyser.getByteFrequencyData(out);
  return out;
}
