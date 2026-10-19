'use client';

import { app, nav } from '@/lib/content';
import { useAudio } from '@/lib/audio';
import { Logo } from './Nav';
import { scrollToTarget } from './SmoothScroll';

/** Footer with a giant wordmark whose letters ripple like a sound wave (faster while playing). */
export default function Footer() {
  const { playing } = useAudio();
  const word = app.name.toLowerCase();
  return (
    <footer className={`ft${playing ? ' is-playing' : ''}`}>
      <div className="ft__top wrap">
        <div className="ft__brand">
          <Logo />
          <p>
            {app.name} — {app.tagline.toLowerCase()}.
          </p>
          <a href={`mailto:${app.email}`}>{app.email}</a>
        </div>
        <nav className="ft__nav" aria-label="Footer">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={(e) => (e.preventDefault(), scrollToTarget(n.href, { offset: n.href === '#story' ? 0 : -90 }))}>
              {n.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="ft__mark" aria-hidden="true">
        {word.split('').map((ch, i) => (
          <span key={i} style={{ ['--i' as string]: i }}>
            {ch}
          </span>
        ))}
      </p>
      <div className="ft__legal wrap">
        <p>{app.disclaimer}</p>
        <p>
          © {new Date().getFullYear()} {app.name} · Concept by{' '}
          <a href={app.credit.href} target="_blank" rel="noreferrer">
            {app.credit.label}
          </a>
        </p>
      </div>
    </footer>
  );
}
