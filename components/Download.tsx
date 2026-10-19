'use client';

import { useRef } from 'react';
import { download } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import Orb from './Orb';
import StoreBadges from './StoreBadges';

/** Closing call to action under a huge moon-orb that still breathes with whatever is playing. */
export default function Download() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      // The orb rises like a moon over the horizon as the section scrolls in.
      gsap.fromTo('.download__rise',{ y: 220, scale: 0.85 }, { y: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } });
      gsap.from('.download__title .line', { yPercent: 60, autoAlpha: 0, stagger: 0.12, duration: 1.5, scrollTrigger: { trigger: '.download__title', start: 'top 85%', once: true } });
      gsap.from('.download__text, .download .stores', { autoAlpha: 0, y: 30, stagger: 0.1, delay: 0.3, scrollTrigger: { trigger: '.download__title', start: 'top 85%', once: true } });
    });
  });

  return (
    <section id="download" ref={root} className="download" aria-labelledby="download-title">
      <div className="download__orb" aria-hidden="true">
        {/* Inner wrapper takes the GSAP transform; the outer one keeps its CSS centring. */}
        <div className="download__rise">
          <Orb />
        </div>
      </div>
      <div className="download__inner wrap">
        <h2 id="download-title" className="download__title">
          <span className="line">{download.title[0]}</span>
          <span className="line">{download.title[1]}</span>
        </h2>
        <p className="download__text">{download.text}</p>
        <StoreBadges />
      </div>
    </section>
  );
}
