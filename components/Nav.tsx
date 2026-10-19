'use client';

import { useEffect, useState } from 'react';
import { app, nav } from '@/lib/content';
import { toggle, useAudio } from '@/lib/audio';
import { scrollToTarget } from './SmoothScroll';

export function Logo() {
  return (
    <svg className="logo" viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9C8CFF" />
          <stop offset="1" stopColor="#FF9E7A" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="currentColor" />
      <path d="M8 22c2.5 0 2.5-6 5-6s2.5 10 5 10 2.5-14 5-14 2.5 10 5 10 2.5-4 4-4" fill="none" stroke="url(#lg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Equalizer glyph — bars dance while sound plays. */
export function Eq({ on }: { on: boolean }) {
  return (
    <i className={`eq${on ? ' on' : ''}`} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </i>
  );
}

/** Floating glass pill. Its colours come from the sky variables, so it turns from day to night with the page. */
export default function Nav() {
  const { playing } = useAudio();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToTarget(href, { offset: href === '#story' ? 0 : -90 });
  };

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="nav__pill">
        <a href="#top" className="nav__brand" onClick={(e) => (e.preventDefault(), scrollToTarget(0))} aria-label={`${app.name} — back to top`}>
          <Logo />
          <span>{app.name.toLowerCase()}</span>
        </a>
        <nav className="nav__links" aria-label="Main">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={go(n.href)}>
              {n.label}
            </a>
          ))}
        </nav>
        <button type="button" className={`nav__player${playing ? ' on' : ''}`} onClick={toggle} aria-pressed={playing} aria-label={playing ? 'Pause sound' : 'Play sound'}>
          <Eq on={playing} />
          <span>{playing ? 'Playing' : 'Play'}</span>
        </button>
        <a href="#download" className="btn btn--solid btn--sm nav__cta" onClick={go('#download')}>
          Get the app
        </a>
        <button type="button" className="nav__menu" aria-expanded={open} aria-controls="nav-sheet" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          <span />
          <span />
        </button>
      </div>
      <div id="nav-sheet" className="nav__sheet" hidden={!open}>
        {nav.map((n) => (
          <a key={n.href} href={n.href} onClick={go(n.href)}>
            {n.label}
          </a>
        ))}
        <a href="#download" className="btn btn--solid" onClick={go('#download')}>
          Get the app
        </a>
      </div>
    </header>
  );
}
