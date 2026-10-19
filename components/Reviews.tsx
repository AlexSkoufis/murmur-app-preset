'use client';

import { useRef } from 'react';
import { app, reviews } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Star } from './Icons';

function Card({ r }: { r: (typeof reviews)[number] }) {
  return (
    <figure className="review">
      <span className="stars" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} />
        ))}
      </span>
      <blockquote>{r.text}</blockquote>
      <figcaption>
        <span className="review__av" aria-hidden="true">
          {r.name[0]}
        </span>
        {r.name} <small>{r.where}</small>
      </figcaption>
    </figure>
  );
}

/** Two review rows drifting in opposite directions; hover pauses, reduced-motion makes them scrollable. */
export default function Reviews() {
  const root = useRef<HTMLElement>(null);
  const rows = [reviews.slice(0, 4), reviews.slice(4)];

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.reviews__head > *', { autoAlpha: 0, y: 40, stagger: 0.1, scrollTrigger: { trigger: '.reviews__head', start: 'top 80%', once: true } });
    });
  });

  return (
    <section ref={root} className="reviews" aria-labelledby="reviews-title">
      <header className="reviews__head wrap">
        <p className="reviews__score">
          {app.rating}
          <span className="stars" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} />
            ))}
          </span>
        </p>
        <h2 id="reviews-title" className="h2">
          Loved by light sleepers
          <br />
          and heavy thinkers.
        </h2>
      </header>
      {rows.map((row, k) => (
        <div key={k} className={`marquee${k ? ' marquee--rev' : ''}`}>
          <div className="marquee__track">
            {row.map((r) => (
              <Card key={r.name} r={r} />
            ))}
            {/* Duplicate set for a seamless loop. */}
            <div className="marquee__dupe" aria-hidden="true">
              {row.map((r) => (
                <Card key={r.name} r={r} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
