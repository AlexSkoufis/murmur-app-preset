'use client';

import { useState } from 'react';
import { faq } from '@/lib/content';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="faq wrap" aria-labelledby="faq-title">
      <header>
        <p className="eyebrow">FAQ</p>
        <h2 id="faq-title" className="h2">
          Good questions.
        </h2>
        <p className="faq__mail">
          Anything else? <a href="mailto:hello@murmur.example">hello@murmur.example</a>
        </p>
      </header>
      <dl className="faq__list">
        {faq.map((f, i) => (
          <div key={f.q} className={`faq__item${open === i ? ' is-open' : ''}`}>
            <dt>
              <button type="button" aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? null : i)}>
                <span>{f.q}</span>
                <i aria-hidden="true" />
              </button>
            </dt>
            <dd id={`faq-${i}`}>
              <div>
                <p>{f.a}</p>
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
