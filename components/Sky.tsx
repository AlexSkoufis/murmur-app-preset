'use client';

import { useEffect, useRef } from 'react';
import { fitCanvas, rng } from '@/lib/motion';

/**
 * The page's fixed backdrop. Its colours are CSS variables (--s1, --s2, --glow, --night) that the
 * Story section scrubs from dawn to midnight, so every section above it changes with the "time".
 */
export default function Sky() {
  const a = useRef<HTMLCanvasElement>(null);
  const b = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const draw = () => {
      [a.current, b.current].forEach((c, layer) => {
        if (!c) return;
        const { ctx, w, h } = fitCanvas(c, 1.5);
        const r = rng(11 + layer);
        const n = Math.round((w * h) / (layer ? 26000 : 5200));
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < n; i++) {
          const x = r() * w;
          const y = r() ** 1.4 * h;
          const s = layer ? 0.9 + r() * 1.1 : 0.3 + r() * 0.8;
          ctx.globalAlpha = layer ? 0.9 : 0.25 + r() * 0.6;
          ctx.fillStyle = r() > 0.85 ? '#FFD9C7' : '#FFFFFF';
          ctx.beginPath();
          ctx.arc(x, y, s, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };
    draw();
    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(draw, 200);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="sky" aria-hidden="true">
      <div className="sky__glow" />
      <canvas ref={a} className="sky__stars" />
      <canvas ref={b} className="sky__stars sky__stars--twinkle" />
      <span className="sky__shoot" />
    </div>
  );
}
