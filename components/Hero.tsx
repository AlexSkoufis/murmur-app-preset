'use client';

import { useRef } from 'react';
import { app, hero } from '@/lib/content';
import { useAudio } from '@/lib/audio';
import { gsap, SplitText, useGsap, MQ } from '@/lib/motion';
import Phone from './Phone';
import { ScreenNow } from './Screens';
import { Eq } from './Nav';
import { Star } from './Icons';
import StoreBadges from './StoreBadges';

/**
 * Hero: giant light type behind a CSS phone that tilts toward the pointer. Floating glass
 * chips sit at different depths, so the tilt gives real parallax. The phone's play button works.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const { playing } = useAudio();
  const tilt = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const split = SplitText.create('.hero__title .line', { type: 'chars' });
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from(split.chars, { yPercent: 70, rotationX: -80, autoAlpha: 0, transformOrigin: '50% 100%', duration: 1.6, stagger: 0.03 }, 0.1)
        .from('.hero__phone', { y: '45vh', rotateX: 28, duration: 1.8, ease: 'expo.out' }, 0.25)
        .from('.hero__phone .scr', { autoAlpha: 0, scale: 1.08, duration: 1.2, ease: 'power3.out' }, 1.1)
        .from('.hero__chip', { autoAlpha: 0, scale: 0.6, y: 30, stagger: 0.09, duration: 1.1, ease: 'back.out(1.6)' }, 1.2)
        .from('.hero__foot > *, .hero__callout', { autoAlpha: 0, y: 24, stagger: 0.08, duration: 1 }, 1.3);

      // Scroll away: the two title lines drift apart while the phone sinks back.
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.5 } })
        .to('.hero__title .l1', { xPercent: -14, ease: 'none' }, 0)
        .to('.hero__title .l2', { xPercent: 14, ease: 'none' }, 0)
        .to('.hero__stage', { scale: 0.86, yPercent: 10, ease: 'none' }, 0)
        .to('.hero__foot', { autoAlpha: 0, y: -40, ease: 'none' }, 0);
      return () => split.revert();
    });

    mm.add(`${MQ.motion} and ${MQ.fine}`, () => {
      tilt.current = {
        x: gsap.quickTo(rig.current, 'rotationY', { duration: 0.9, ease: 'power3.out' }),
        y: gsap.quickTo(rig.current, 'rotationX', { duration: 0.9, ease: 'power3.out' }),
      };
      return () => (tilt.current = null);
    });
  });

  const onMove = (e: React.PointerEvent) => {
    if (!tilt.current) return;
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    tilt.current.x(nx * 18);
    tilt.current.y(-ny * 12);
  };

  return (
    <section id="top" ref={root} className={`hero${playing ? ' is-playing' : ''}`} aria-labelledby="hero-title" onPointerMove={onMove} onPointerLeave={() => tilt.current && (tilt.current.x(0), tilt.current.y(0))}>
      <h1 id="hero-title" className="hero__title">
        <span className="line l1">{hero.title[0]}</span>
        <span className="line l2">{hero.title[1]}</span>
      </h1>

      <div className="hero__stage">
        <div ref={rig} className="hero__rig">
          <div className="hero__float">
            <span className="hero__rings" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <Phone className="hero__phone" time="9:41">
              <ScreenNow />
            </Phone>
            <div className="hero__chip hero__chip--a" aria-hidden="true">
              <Eq on={playing} />
              <div>
                <b>Rain</b>
                <span>{playing ? 'Live · never loops' : 'Generated live'}</span>
              </div>
            </div>
            <div className="hero__chip hero__chip--b" aria-hidden="true">
              <b className="big">86</b>
              <div>
                <b>Sleep score</b>
                <span>+9 this week</span>
              </div>
            </div>
            <div className="hero__chip hero__chip--c" aria-hidden="true">
              <span className="dot" />
              <div>
                <b>Focus 25:00</b>
                <span>Café hum</span>
              </div>
            </div>
          </div>
        </div>
        <p className="hero__callout">
          <svg viewBox="0 0 120 70" aria-hidden="true">
            <path d="M116 8C86 4 52 12 34 34 24 46 18 56 8 62" />
            <path d="M8 62l3-12M8 62l12-2" />
          </svg>
          {hero.callout}
        </p>
      </div>

      <div className="hero__foot">
        <div className="hero__lede">
          <p>{hero.lede}</p>
          <StoreBadges />
        </div>
        <div className="hero__rating">
          <span className="stars" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} />
            ))}
          </span>
          <p>
            <b>{app.rating}</b> · {app.ratings}
          </p>
          <span className="hero__scroll" aria-hidden="true">
            Scroll through a day
          </span>
        </div>
      </div>
    </section>
  );
}
