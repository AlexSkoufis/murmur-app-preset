'use client';

import { useRef, useState } from 'react';
import { features } from '@/lib/content';
import { play, sleepAfter, useAudio } from '@/lib/audio';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Moon, Plane } from './Icons';
import Orb from './Orb';

const MIN = 5;
const MAX = 120;

/** Drag (or arrow-key) the dial to pick minutes; it really schedules a fade-out on the audio engine. */
function TimerDial() {
  const { playing, sleepAt } = useAudio();
  const [v, setV] = useState(45);
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const fromPointer = (e: React.PointerEvent) => {
    const r = svg.current!.getBoundingClientRect();
    const a = Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2)));
    const deg = (a * 180) / Math.PI;
    let m = Math.round((((deg + 360) % 360) / 360) * MAX / 5) * 5;
    // Don't let a drag past twelve o'clock wrap from 120 to 0 (or back).
    setV((prev) => {
      if (prev > 100 && m < 30) m = MAX;
      if (prev < 20 && m > 90) m = MIN;
      return Math.min(MAX, Math.max(MIN, m));
    });
  };

  const angle = (v / MAX) * 360;
  const rad = ((angle - 90) * Math.PI) / 180;
  const R = 96;
  const C = 2 * Math.PI * R;
  const at = sleepAt ? new Date(sleepAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : null;

  return (
    <div className="dial">
      <svg
        ref={svg}
        viewBox="0 0 240 240"
        className="dial__svg"
        role="slider"
        tabIndex={0}
        aria-label="Sleep timer minutes"
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={v}
        aria-valuetext={`${v} minutes`}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.currentTarget as Element).setPointerCapture(e.pointerId);
          fromPointer(e);
        }}
        onPointerMove={(e) => dragging.current && fromPointer(e)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        onKeyDown={(e) => {
          const d = { ArrowUp: 5, ArrowRight: 5, ArrowDown: -5, ArrowLeft: -5, PageUp: 15, PageDown: -15 }[e.key];
          if (e.key === 'Home') setV(MIN);
          else if (e.key === 'End') setV(MAX);
          else if (d) setV((p) => Math.min(MAX, Math.max(MIN, p + d)));
          else return;
          e.preventDefault();
        }}
      >
        <defs>
          <linearGradient id="dial-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9C8CFF" />
            <stop offset=".6" stopColor="#FF8FA3" />
            <stop offset="1" stopColor="#FFB27A" />
          </linearGradient>
        </defs>
        {Array.from({ length: 24 }, (_, i) => (
          <line key={i} x1="120" y1="2" x2="120" y2={i % 6 ? 6 : 11} transform={`rotate(${i * 15} 120 120)`} className="dial__tick" />
        ))}
        <circle cx="120" cy="120" r={R} className="dial__track" />
        <circle cx="120" cy="120" r={R} className="dial__bar" style={{ strokeDasharray: C, strokeDashoffset: C * (1 - v / MAX) }} transform="rotate(-90 120 120)" />
        <circle cx={120 + Math.cos(rad) * R} cy={120 + Math.sin(rad) * R} r="13" className="dial__knob" />
      </svg>
      <div className="dial__read" aria-hidden="true">
        <b>{v}</b>
        <span>minutes</span>
      </div>
      <div className="dial__act">
        {sleepAt ? (
          <>
            <p>
              <Moon /> Fading out at {at}
            </p>
            <button type="button" className="btn btn--line btn--sm" onClick={() => sleepAfter(null)}>
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn--solid btn--sm"
            onClick={async () => {
              if (!playing) await play();
              sleepAfter(v);
            }}
          >
            {playing ? `Fade out in ${v} min` : `Play, fade out in ${v} min`}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Features() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.features__head > *', { autoAlpha: 0, y: 40, stagger: 0.1, scrollTrigger: { trigger: '.features__head', start: 'top 80%', once: true } });
      gsap.from('.card', { autoAlpha: 0, y: 60, scale: 0.96, stagger: 0.08, duration: 1.3, scrollTrigger: { trigger: '.bento', start: 'top 80%', once: true } });
      gsap.from('.streak i', { scale: 0, stagger: { each: 0.012, from: 'start' }, duration: 0.5, ease: 'back.out(2)', scrollTrigger: { trigger: '.streak', start: 'top 85%', once: true } });
    });
  });

  return (
    <section id="features" ref={root} className="features" aria-labelledby="features-title">
      <header className="features__head wrap">
        <p className="eyebrow">Features</p>
        <h2 id="features-title" className="h2">
          {features.title}
        </h2>
      </header>

      <div className="bento wrap">
        <article className="card card--timer">
          <div className="card__copy">
            <h3>{features.timer.title}</h3>
            <p>{features.timer.text}</p>
          </div>
          <TimerDial />
        </article>

        <article className="card card--offline">
          <div className="card__copy">
            <h3>{features.offline.title}</h3>
            <p>{features.offline.text}</p>
          </div>
          <div className="flight" aria-hidden="true">
            <svg viewBox="0 0 400 80" preserveAspectRatio="none">
              <path d="M0 70 C120 70 160 10 400 12" />
            </svg>
            <span className="flight__plane">
              <Plane />
            </span>
            <span className="flight__toggle">
              <i /> Airplane mode
            </span>
          </div>
        </article>

        <article className="card card--privacy">
          <h3 className="grad">{features.privacy.title}</h3>
          <p>{features.privacy.text}</p>
        </article>

        <article className="card card--alarm">
          <div className="card__copy">
            <h3>{features.alarm.title}</h3>
            <p>{features.alarm.text}</p>
          </div>
          <div className="alarm" aria-hidden="true">
            <svg viewBox="0 0 200 80" preserveAspectRatio="none">
              <rect x="140" y="0" width="40" height="80" className="alarm__win" />
              <path d="M0 20 C20 20 20 70 40 70 S60 30 80 34 100 72 120 70 140 16 160 14 180 40 200 30" />
            </svg>
            <div className="alarm__labels">
              <span>23:30</span>
              <span>06:40</span>
              <span>07:10</span>
            </div>
          </div>
        </article>

        <article className="card card--watch">
          <div className="card__copy">
            <h3>{features.watch.title}</h3>
            <p>{features.watch.text}</p>
          </div>
          <div className="watch" aria-hidden="true">
            <span className="watch__band watch__band--t" />
            <span className="watch__band watch__band--b" />
            <div className="watch__case">
              <div className="watch__screen">
                <Orb className="watch__orb" />
                <b>Seaside</b>
                <span>42 min left</span>
              </div>
              <span className="watch__crown" />
            </div>
          </div>
          <div className="widget" aria-hidden="true">
            <Moon />
            <div>
              <b>Bedtime in 40 min</b>
              <span>Cabin night is ready</span>
            </div>
          </div>
        </article>

        <article className="card card--streak">
          <div className="card__copy">
            <h3>{features.streak.title}</h3>
            <p>{features.streak.text}</p>
          </div>
          <div className="streak" aria-hidden="true">
            {Array.from({ length: 35 }, (_, i) => (
              <i key={i} className={i === 17 ? 'bend' : i > 30 ? '' : [3, 9, 22].includes(i) ? 'soft' : 'on'} />
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
