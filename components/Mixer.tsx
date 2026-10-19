'use client';

import { useRef } from 'react';
import { channels, presets } from '@/lib/content';
import { CHANNELS, play, setLevel, setMix, toggle, useAudio, type ChannelId } from '@/lib/audio';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { ChannelIcon, Pause, Play } from './Icons';
import Orb from './Orb';

/**
 * The real thing: six synthesised layers (Web Audio) with a spectrum halo. Touching any
 * slider starts playback, so the section works as a toy even without reading a word.
 */
export default function Mixer() {
  const root = useRef<HTMLElement>(null);
  const { playing, levels } = useAudio();
  const memory = useRef<Partial<Record<ChannelId, number>>>({});

  const activePreset = presets.findIndex((p) => CHANNELS.every((id) => Math.abs((p.levels[id] ?? 0) - levels[id]) < 0.001));

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.mixer__head > *', { autoAlpha: 0, y: 40, stagger: 0.1, scrollTrigger: { trigger: '.mixer__head', start: 'top 80%', once: true } });
      gsap.from('.mixer__stage', { autoAlpha: 0, scale: 0.85, duration: 1.6, scrollTrigger: { trigger: '.mixer__grid', start: 'top 80%', once: true } });
      gsap.from('.strip', { autoAlpha: 0, x: 40, stagger: 0.06, duration: 1.1, scrollTrigger: { trigger: '.mixer__grid', start: 'top 75%', once: true } });
    });
  });

  const mute = (id: ChannelId) => {
    if (levels[id] > 0.01) {
      memory.current[id] = levels[id];
      setLevel(id, 0);
    } else {
      setLevel(id, memory.current[id] || 0.6);
      if (!playing) play();
    }
  };

  return (
    <section id="mixer" ref={root} className="mixer" aria-labelledby="mixer-title">
      <header className="mixer__head wrap">
        <p className="eyebrow">Try it · right here</p>
        <h2 id="mixer-title" className="h2">
          Make it rain.
          <br />
          <em>Literally.</em>
        </h2>
        <p className="lede">These are Murmur’s sound engines running live in your browser. Nothing is a recording. Headphones recommended, and keep the volume low to start.</p>
      </header>

      <div className="mixer__grid wrap">
        <div className="mixer__stage">
          <Orb bars className="mixer__orb" />
          <button type="button" className={`mixer__play${playing ? ' on' : ''}`} onClick={toggle} aria-pressed={playing} aria-label={playing ? 'Pause sound' : 'Play sound'}>
            {playing ? <Pause /> : <Play />}
          </button>
          <p className="mixer__status" aria-live="polite">
            {playing ? 'Playing live' : 'Press play or move a slider'}
          </p>
        </div>

        <div className="mixer__panel">
          <div className="mixer__presets" role="group" aria-label="Preset mixes">
            {presets.map((p, i) => (
              <button
                key={p.name}
                type="button"
                className={`chip${activePreset === i ? ' on' : ''}`}
                aria-pressed={activePreset === i}
                onClick={() => {
                  setMix(p.levels);
                  if (!playing) play();
                }}
              >
                {p.name}
              </button>
            ))}
          </div>

          <ul className="mixer__strips">
            {channels.map((c) => {
              const v = levels[c.id];
              return (
                <li key={c.id} className={`strip${v > 0.01 ? ' is-on' : ''}`} style={{ ['--v' as string]: v }}>
                  <button type="button" className="strip__icon" onClick={() => mute(c.id)} aria-label={`${v > 0.01 ? 'Mute' : 'Unmute'} ${c.label}`}>
                    <ChannelIcon id={c.id} />
                  </button>
                  <label className="strip__label" htmlFor={`ch-${c.id}`}>
                    <b>{c.label}</b>
                    <span>{c.hint}</span>
                  </label>
                  <input
                    id={`ch-${c.id}`}
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(v * 100)}
                    onChange={(e) => {
                      setLevel(c.id, +e.target.value / 100);
                      if (!playing) play();
                    }}
                    aria-valuetext={`${Math.round(v * 100)} percent`}
                  />
                  <output htmlFor={`ch-${c.id}`}>{Math.round(v * 100)}</output>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
