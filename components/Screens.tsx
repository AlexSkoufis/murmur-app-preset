'use client';

import { useEffect, useState } from 'react';
import { channels, presets } from '@/lib/content';
import { CHANNELS, setMix, toggle, useAudio } from '@/lib/audio';
import { Back, ChannelIcon, Moon, Next, Pause, Play } from './Icons';
import Orb from './Orb';

const pad = (n: number) => String(n).padStart(2, '0');

/** Seconds ticking while `on` — used for timers inside the mock screens. */
function useTicker(on: boolean, start = 0) {
  const [s, setS] = useState(start);
  useEffect(() => {
    if (!on) return;
    const id = window.setInterval(() => setS((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, [on]);
  return s;
}

/** Hero: a working "now playing" screen — the play and skip buttons drive the real audio engine. */
export function ScreenNow() {
  const { playing, levels } = useAudio();
  const [preset, setPreset] = useState(0);
  const elapsed = useTicker(playing);
  const active = CHANNELS.filter((id) => levels[id] > 0.02);

  const go = (d: number) => {
    const i = (preset + d + presets.length) % presets.length;
    setPreset(i);
    setMix(presets[i].levels);
  };

  return (
    <div className="scr scr--now">
      <p className="scr__eyebrow">Now playing</p>
      <p className="scr__title">{presets[preset].name}</p>
      <div className="scr-now__orb">
        <Orb />
      </div>
      <ul className="scr-now__layers" aria-label="Layers in this mix">
        {active.map((id) => (
          <li key={id}>
            <ChannelIcon id={id} />
            {channels.find((c) => c.id === id)!.label}
            <i style={{ ['--l' as string]: levels[id] }} />
          </li>
        ))}
      </ul>
      <div className="scr-now__time" aria-hidden="true">
        <span>{`${pad(Math.floor(elapsed / 60))}:${pad(elapsed % 60)}`}</span>
        <i className={playing ? 'on' : ''} />
        <span>∞</span>
      </div>
      <div className="scr-now__ctrl">
        <button type="button" aria-label="Previous mix" onClick={() => go(-1)}>
          <Back />
        </button>
        <button type="button" className="scr-now__play" aria-label={playing ? 'Pause sound' : 'Play sound'} aria-pressed={playing} onClick={toggle}>
          {playing ? <Pause /> : <Play />}
        </button>
        <button type="button" aria-label="Next mix" onClick={() => go(1)}>
          <Next />
        </button>
      </div>
    </div>
  );
}

/** Morning: focus timer. */
export function ScreenFocus({ active }: { active: boolean }) {
  const s = useTicker(active, 0);
  const left = 25 * 60 - 1 - (s % (25 * 60));
  const C = 2 * Math.PI * 44;
  return (
    <div className="scr scr--focus">
      <p className="scr__eyebrow">Focus · session 3 of 4</p>
      <p className="scr__title">Draft the Q4 plan</p>
      <div className="scr-focus__ring">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" className="track" />
          <circle cx="50" cy="50" r="44" className="bar" style={{ strokeDasharray: C, strokeDashoffset: C * (1 - left / 1500) }} />
          {Array.from({ length: 60 }, (_, i) => (
            <line key={i} x1="50" y1="12" x2="50" y2={i % 5 ? 13.5 : 16} transform={`rotate(${i * 6} 50 50)`} />
          ))}
        </svg>
        <div>
          <b>{`${pad(Math.floor(left / 60))}:${pad(left % 60)}`}</b>
          <span>remaining</span>
        </div>
      </div>
      <div className="scr-focus__sound">
        <ChannelIcon id="brown" />
        <div>
          <b>Café hum</b>
          <span>+ brown noise</span>
        </div>
        <i className="eq" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </i>
      </div>
      <div className="scr-focus__week" aria-hidden="true">
        <div>
          <span>Focused this week</span>
          <b>11 h 20 m</b>
        </div>
        <ol>
          {[0.5, 0.8, 0.35, 0.95, 0.7, 0.2, 0.6].map((v, i) => (
            <li key={i} style={{ ['--v' as string]: v }} className={i === 4 ? 'on' : ''} />
          ))}
        </ol>
      </div>
      <div className="scr-focus__dots" aria-hidden="true">
        <span className="done" />
        <span className="done" />
        <span className="now" />
        <span />
      </div>
    </div>
  );
}

/** Afternoon: the mixer, with faders that drift gently. */
export function ScreenMix() {
  const mix = { rain: 0.55, waves: 0.2, wind: 0.35, fire: 0.8, birds: 0.1, brown: 0.3 };
  return (
    <div className="scr scr--mix">
      <p className="scr__eyebrow">Your mix</p>
      <p className="scr__title">Cabin in the rain</p>
      <div className="scr-mix__faders">
        {channels.map((c, i) => (
          <div key={c.id} className="scr-mix__fader" style={{ ['--v' as string]: mix[c.id], ['--d' as string]: `${i * -0.7}s` }}>
            <div className="scr-mix__track">
              <i />
            </div>
            <ChannelIcon id={c.id} />
          </div>
        ))}
      </div>
      <div className="scr-mix__row">
        <span className="pill">Save mix</span>
        <span className="pill pill--ghost">Share</span>
      </div>
    </div>
  );
}

/** Evening: 4-7-8 breathing, paced entirely in CSS. */
export function ScreenBreathe() {
  return (
    <div className="scr scr--breathe">
      <p className="scr__eyebrow">Wind down · 4-7-8</p>
      <p className="scr__title">Breathe the day out</p>
      <div className="scr-breathe__stage" aria-hidden="true">
        <span className="ring r1" />
        <span className="ring r2" />
        <span className="scr-breathe__orb" />
        <div className="scr-breathe__cue">
          <span>Breathe in</span>
          <span>Hold</span>
          <span>Breathe out</span>
        </div>
      </div>
      <p className="scr-breathe__meta">Round 2 of 4 · haptics on</p>
    </div>
  );
}

/** Night: bedside clock, sleep timer and last night's graph. */
export function ScreenSleep() {
  return (
    <div className="scr scr--sleep">
      <p className="scr__eyebrow">Tuesday</p>
      <p className="scr-sleep__clock">23:14</p>
      <div className="scr-sleep__alarm">
        <span>Smart alarm</span>
        <b>06:40 – 07:10</b>
      </div>
      <div className="scr-sleep__graph" aria-hidden="true">
        <svg viewBox="0 0 200 70" preserveAspectRatio="none">
          <path pathLength={1} d="M0 10 H18 V40 H34 V58 H52 V40 H64 V24 H78 V46 H96 V62 H112 V44 H124 V26 H140 V40 H156 V20 H170 V34 H184 V8 H200" />
        </svg>
        <div>
          <span>Last night</span>
          <b>7 h 42 m</b>
        </div>
      </div>
      <div className="scr-sleep__stages" aria-hidden="true">
        <div>
          <span>Deep</span>
          <b>1 h 48</b>
        </div>
        <div>
          <span>REM</span>
          <b>1 h 36</b>
        </div>
        <div>
          <span>Score</span>
          <b>86</b>
        </div>
      </div>
      <div className="scr-sleep__now">
        <Moon />
        <div>
          <b>Seaside</b>
          <span>fades out in 45 min</span>
        </div>
      </div>
    </div>
  );
}
