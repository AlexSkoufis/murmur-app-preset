// ─────────────────────────────────────────────────────────────────────────────
//  PRESET CONFIG — Murmur, a FICTIONAL focus & sleep sound app.
//  Names, ratings, prices, reviews and claims are demo content.
//  No photography: every visual on the page is drawn in code.
// ─────────────────────────────────────────────────────────────────────────────

import type { ChannelId } from './audio';

export const app = {
  name: 'Murmur',
  tagline: 'Sound for focus & sleep',
  rating: '4.9',
  ratings: '38k ratings',
  email: 'hello@murmur.example',
  credit: { label: 'Core Concepts Design', href: 'https://coreconcepts.design' },
  disclaimer: 'Murmur is a fictional app created as a design concept. Ratings, reviews, prices and features are illustrative placeholders.',
};

export const nav = [
  { label: 'Day & night', href: '#story' },
  { label: 'Try it', href: '#mixer' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export const hero = {
  title: ['Hear yourself', 'think.'],
  lede: 'Murmur mixes living soundscapes that help you focus by day and fall asleep by night. Six sound engines, generated live — never the same loop twice.',
  callout: 'Tap play — it’s real sound',
  mix: 'Rainy study',
};

/** Sky colours per chapter: [top, bottom], ink, and how much "night" (stars) shows. */
export type Chapter = {
  id: 'focus' | 'mix' | 'breathe' | 'sleep';
  time: string;
  label: string;
  title: string;
  text: string;
  points: string[];
  sky: [string, string];
  ink: string;
  night: number;
};

export const story: Chapter[] = [
  {
    id: 'focus',
    time: '08:30',
    label: 'Morning',
    title: 'Focus without the fog.',
    text: 'Pick a task, pick a sound, press start. Murmur runs gentle focus sessions over café hum or brown noise, then chimes softly when it’s time to stretch.',
    points: ['Pomodoro & deep-work timers', 'Quiets notifications while you work', 'A calm record of your sessions'],
    sky: ['#F4E6DB', '#F7CDB4'],
    ink: '#1D1830',
    night: 0,
  },
  {
    id: 'mix',
    time: '14:05',
    label: 'Afternoon',
    title: 'Mix your own weather.',
    text: 'Layer rain over a crackling fire, add a far-off sea. Every layer is synthesised on your phone, so it drifts and changes like the real thing.',
    points: ['Six live sound engines', 'Save mixes, share them with a link', 'Spatial audio with headphones'],
    sky: ['#E5EEF4', '#C4D8EA'],
    ink: '#13202F',
    night: 0,
  },
  {
    id: 'breathe',
    time: '21:40',
    label: 'Evening',
    title: 'Breathe the day out.',
    text: 'A glowing orb paces 4-7-8 breathing: no voice, no lecture, just rhythm. Two minutes is enough to feel the difference.',
    points: ['Box, 4-7-8 & coherent breathing', 'Haptic pacing — eyes closed', 'Wind-down reminders'],
    sky: ['#4E4388', '#D48B85'],
    ink: '#FFFFFF',
    night: 0.35,
  },
  {
    id: 'sleep',
    time: '23:14',
    label: 'Night',
    title: 'Sleep, then wake up gently.',
    text: 'Sounds fade out as you drift off. The smart alarm wakes you in your lightest sleep within a 30-minute window, so mornings feel less like an ambush.',
    points: ['Fade-out sleep timer', 'Smart alarm window', 'Nightly sleep graph'],
    sky: ['#070919', '#141838'],
    ink: '#E9E7F7',
    night: 1,
  },
];

export const channels: { id: ChannelId; label: string; hint: string }[] = [
  { id: 'rain', label: 'Rain', hint: 'Soft rain on leaves' },
  { id: 'waves', label: 'Waves', hint: 'A slow, far-off sea' },
  { id: 'wind', label: 'Wind', hint: 'Wind through tall grass' },
  { id: 'fire', label: 'Fire', hint: 'Crackling hearth' },
  { id: 'birds', label: 'Birds', hint: 'Early-morning birdsong' },
  { id: 'brown', label: 'Brown', hint: 'Deep brown noise' },
];

export const presets: { name: string; levels: Partial<Record<ChannelId, number>> }[] = [
  { name: 'Rainy study', levels: { rain: 0.7, brown: 0.35 } },
  { name: 'Cabin night', levels: { fire: 0.75, wind: 0.4, rain: 0.25 } },
  { name: 'Seaside', levels: { waves: 0.8, wind: 0.3, birds: 0.2 } },
  { name: 'Dawn chorus', levels: { birds: 0.7, wind: 0.2, brown: 0.15 } },
  { name: 'Deep work', levels: { brown: 0.8 } },
];

export const features = {
  title: 'Small things, done carefully.',
  timer: { title: 'Sleep timer', text: 'Turn the dial. If sound is playing, Murmur fades it out when the time is up.' },
  offline: { title: 'Works offline', text: 'Nothing streams. Every sound is generated on the device, so it works on planes, trains and in cabins.' },
  privacy: { title: 'No ads. No account. No tracking.', text: 'Open it and press play. That’s the whole onboarding.' },
  alarm: { title: 'Smart alarm', text: 'Wakes you in light sleep, between 06:40 and 07:10.' },
  watch: { title: 'Wrist & lock screen', text: 'Start a mix from your watch, widgets or lock screen.' },
  streak: { title: 'Streaks without guilt', text: 'Miss a night? Streaks bend instead of breaking.' },
};

export const reviews = [
  { name: 'Maya R.', where: 'Lisbon', text: 'The rain doesn’t loop. I didn’t know how much that bothered me in other apps until it stopped.' },
  { name: 'Tom K.', where: 'Leeds', text: 'Brown noise + fire is my entire work personality now.' },
  { name: 'Eleni P.', where: 'Thessaloniki', text: 'The breathing orb is the only thing that gets my brain to shut up at night.' },
  { name: 'Jonas B.', where: 'Berlin', text: 'No account, no onboarding quiz. Opened it, pressed play, slept. Five stars.' },
  { name: 'Priya S.', where: 'Toronto', text: 'Smart alarm is genuinely gentle. I wake up before it goes off now.' },
  { name: 'Luca M.', where: 'Milan', text: 'Beautifully designed. It feels like a small, calm object rather than an app.' },
  { name: 'Hana W.', where: 'Osaka', text: 'I use the seaside mix on every flight. Works fully offline.' },
  { name: 'Sam D.', where: 'Austin', text: 'Focus timer + café hum doubled my writing hours. Not exaggerating.' },
];

export const pricing = {
  title: 'Free to start. Calm to keep.',
  plans: [
    {
      name: 'Free',
      monthly: 0,
      yearly: 0,
      note: 'No card needed',
      features: ['3 sound engines', 'Focus timer', 'Sleep timer', 'Offline'],
      cta: 'Download free',
    },
    {
      name: 'Plus',
      monthly: 4.99,
      yearly: 39.99,
      note: '7-day free trial',
      features: ['All 6 sound engines', 'Unlimited saved mixes', 'Breathing & wind-down', 'Smart alarm & sleep graph', 'Watch & widgets'],
      cta: 'Start free trial',
      featured: true,
    },
    {
      name: 'Family',
      monthly: 7.99,
      yearly: 59.99,
      note: 'Up to 6 people',
      features: ['Everything in Plus', 'Six private profiles', 'Shared family mixes'],
      cta: 'Choose Family',
    },
  ],
};

export const download = {
  title: ['Tonight', 'sounds good.'],
  text: 'Free on iPhone, iPad and Android. Plus from €3.33 a month, billed yearly.',
};

export const faq = [
  { q: 'Does Murmur need an internet connection?', a: 'No. Every sound is synthesised on your device in real time, so the app works fully offline and uses almost no storage.' },
  { q: 'Will it drain my battery overnight?', a: 'Murmur is built for long sessions: with the screen off, eight hours of sound uses roughly the same battery as a short phone call.' },
  { q: 'Can I use it with other apps?', a: 'Yes. Murmur plays alongside music, podcasts and calls, and ducks politely when something else needs attention.' },
  { q: 'Is my data shared with anyone?', a: 'There’s no account and nothing to share. Sleep and focus history stays on your device unless you export it.' },
  { q: 'How do I cancel Plus?', a: 'From your phone’s subscription settings, any time. You keep Plus until the end of the period you paid for.' },
];
