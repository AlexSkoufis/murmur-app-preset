'use client';

import { useRef, useState } from 'react';
import { story } from '@/lib/content';
import { gsap, ScrollTrigger, useGsap, MQ } from '@/lib/motion';
import Phone from './Phone';
import { ScreenBreathe, ScreenFocus, ScreenMix, ScreenSleep } from './Screens';
import { Check } from './Icons';

const GLOW = ['rgba(255,168,120,.55)', 'rgba(255,255,255,.7)', 'rgba(255,140,130,.5)', 'rgba(130,115,255,.22)'];
const MINUTES = story.map((c) => {
  const [h, m] = c.time.split(':').map(Number);
  return h * 60 + m;
});

function Screen({ i, active }: { i: number; active: boolean }) {
  if (i === 0) return <ScreenFocus active={active} />;
  if (i === 1) return <ScreenMix />;
  if (i === 2) return <ScreenBreathe />;
  return <ScreenSleep />;
}

/**
 * A day with Murmur. Scrolling through the four chapters scrubs the whole page's sky from dawn to
 * midnight, spins a clock through the hours, and swaps the sticky phone's screen (whose own theme
 * follows the time of day too).
 */
export default function Story() {
  const root = useRef<HTMLElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const sun = useRef<SVGCircleElement>(null);
  const [active, setActive] = useState(0);

  useGsap(root, () => {
    const html = document.documentElement;
    const vars = (i: number) => ({ '--s1': story[i].sky[0], '--s2': story[i].sky[1], '--ink': story[i].ink, '--night': story[i].night, '--glow': GLOW[i] });

    // Sky: each chapter boundary is a short colour transition, with a hold in between.
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.story__chapters',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onUpdate: (self) => {
          // Clock + sun follow the same progress.
          // Hold on each chapter's time, then run the clock across the boundary (same window as the colours).
          const p = self.progress;
          const seg = Math.min(2.999, Math.max(0, p * 4 - 0.5));
          const k = Math.floor(seg);
          const f = Math.min(1, Math.max(0, (seg - k - 0.25) / 0.5));
          const mins = Math.round(MINUTES[k] + (MINUTES[k + 1] - MINUTES[k]) * (p * 4 < 0.5 ? 0 : f));
          if (clock.current) clock.current.textContent = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
          if (sun.current) {
            const a = Math.PI * (1 - p);
            sun.current.setAttribute('cx', String(60 + Math.cos(a) * 50));
            sun.current.setAttribute('cy', String(56 - Math.sin(a) * 50));
          }
        },
      },
    });
    tl.set(html, vars(0), 0);
    for (let i = 1; i < story.length; i++) tl.to(html, { ...vars(i), duration: 0.5 }, i - 0.25);
    tl.set({}, {}, story.length);

    story.forEach((_, i) => {
      ScrollTrigger.create({
        trigger: `.chapter[data-i="${i}"]`,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && setActive(i),
      });
    });

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.utils.toArray<HTMLElement>('.chapter__copy').forEach((el) => {
        gsap.from(el.children, { autoAlpha: 0, y: 40, stagger: 0.08, duration: 1.2, scrollTrigger: { trigger: el, start: 'top 75%', once: true } });
      });
      gsap.from('.story__head > *', { autoAlpha: 0, y: 40, stagger: 0.1, scrollTrigger: { trigger: '.story__head', start: 'top 80%', once: true } });
    });
  });

  return (
    <section id="story" ref={root} className="story" aria-labelledby="story-title">
      <header className="story__head wrap">
        <p className="eyebrow">A day with Murmur</p>
        <h2 id="story-title" className="h2">
          From first coffee
          <br />
          to last light.
        </h2>
      </header>

      <div className="story__grid wrap">
        <div className="story__chapters">
          {story.map((c, i) => (
            <article key={c.id} className="chapter" data-i={i} aria-labelledby={`ch-${c.id}`}>
              <div className="chapter__copy">
                <p className="chapter__time">
                  <span>{c.time}</span>
                  {c.label}
                </p>
                <h3 id={`ch-${c.id}`} className="h3">
                  {c.title}
                </h3>
                <p className="chapter__text">{c.text}</p>
                <ul className="chapter__points">
                  {c.points.map((p) => (
                    <li key={p}>
                      <Check />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="chapter__phone" aria-hidden="true">
                <Phone time={c.time} theme={i < 2 ? 'light' : 'dark'}>
                  <Screen i={i} active={active === i} />
                </Phone>
              </div>
            </article>
          ))}
        </div>

        <div className="story__stage" aria-hidden="true">
          <div className="story__clock">
            <svg viewBox="0 0 120 62">
              <path d="M10 56a50 50 0 0 1 100 0" />
              <circle ref={sun} cx="10" cy="56" r="5" className={active === 3 ? 'is-moon' : ''} />
            </svg>
            <span ref={clock}>{story[0].time}</span>
          </div>
          <Phone className="story__phone" time={story[active].time} theme={active < 2 ? 'light' : 'dark'}>
            {story.map((c, i) => (
              <div key={c.id} className={`story__screen${active === i ? ' is-on' : ''}`}>
                <Screen i={i} active={active === i} />
              </div>
            ))}
          </Phone>
          <ol className="story__dots">
            {story.map((c, i) => (
              <li key={c.id} className={active === i ? 'on' : ''}>
                {c.label}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
