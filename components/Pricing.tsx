'use client';

import { useRef, useState } from 'react';
import { pricing } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Check } from './Icons';

const euro = (v: number) => (v === 0 ? '€0' : `€${v.toFixed(2)}`);

export default function Pricing() {
  const root = useRef<HTMLElement>(null);
  const [yearly, setYearly] = useState(true);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.pricing__head > *', { autoAlpha: 0, y: 40, stagger: 0.1, scrollTrigger: { trigger: '.pricing__head', start: 'top 80%', once: true } });
      gsap.from('.plan', { autoAlpha: 0, y: 70, stagger: 0.12, duration: 1.3, scrollTrigger: { trigger: '.plans', start: 'top 80%', once: true } });
    });
  });

  return (
    <section id="pricing" ref={root} className="pricing" aria-labelledby="pricing-title">
      <header className="pricing__head wrap">
        <p className="eyebrow">Pricing</p>
        <h2 id="pricing-title" className="h2">
          {pricing.title}
        </h2>
        <div className="billing" role="radiogroup" aria-label="Billing period">
          <span className={`billing__pill${yearly ? ' r' : ''}`} aria-hidden="true" />
          <button type="button" role="radio" aria-checked={!yearly} onClick={() => setYearly(false)}>
            Monthly
          </button>
          <button type="button" role="radio" aria-checked={yearly} onClick={() => setYearly(true)}>
            Yearly <small>−33%</small>
          </button>
        </div>
      </header>

      <div className="plans wrap">
        {pricing.plans.map((p) => {
          const price = yearly ? p.yearly : p.monthly;
          return (
            <article key={p.name} className={`plan${p.featured ? ' plan--featured' : ''}`}>
              {p.featured && <span className="plan__badge">Most loved</span>}
              <h3>{p.name}</h3>
              <p className="plan__price">
                <b key={`${p.name}-${yearly}`}>{euro(price)}</b>
                <span>{price === 0 ? 'forever' : yearly ? '/ year' : '/ month'}</span>
              </p>
              <p className="plan__note">{price && yearly ? `${euro(price / 12)} a month · ${p.note}` : p.note}</p>
              <ul>
                {p.features.map((f) => (
                  <li key={f}>
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#download" className={`btn ${p.featured ? 'btn--grad' : 'btn--line'}`}>
                {p.cta}
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
