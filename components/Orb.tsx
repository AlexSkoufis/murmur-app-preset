'use client';

import { useEffect, useRef } from 'react';
import { gsap, fitCanvas, useInView, MQ } from '@/lib/motion';
import { level, spectrum } from '@/lib/audio';

const HUES = [
  ['#B7A9FF', '#5B45E0'],
  ['#FFB08F', '#F2557F'],
  ['#9EEBDA', '#3F8FF0'],
];

/**
 * A living blob drawn on canvas. It drifts on its own, swells with the loudness of whatever
 * Murmur is playing, and (with `bars`) wears a ring of frequency bars like a halo.
 */
export default function Orb({ bars = false, className = '' }: { bars?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const inView = useInView(ref);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !inView) return;
    const still = window.matchMedia(MQ.reduced).matches;
    let { ctx, w, h } = fitCanvas(canvas);
    const ro = new ResizeObserver(() => ({ ctx, w, h } = fitCanvas(canvas)));
    ro.observe(canvas);
    const bins = new Uint8Array(256);
    const smooth = new Float32Array(72);
    let lv = 0;
    let t = 0;

    const draw = (_time: number, dt: number) => {
      if (!still) t += dt / 1000;
      lv += ((still ? 0 : level()) - lv) * 0.12;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * (bars ? 0.27 : 0.36) * (1 + lv * 0.12);
      ctx.clearRect(0, 0, w, h);

      // Soft halo — always fades out before the canvas edge, so no box shows.
      const halo = ctx.createRadialGradient(cx, cy, R * 0.5, cx, cy, Math.min(w, h) / 2);
      halo.addColorStop(0, `rgba(156,140,255,${0.3 + lv * 0.3})`);
      halo.addColorStop(0.45, `rgba(255,143,163,${0.1 + lv * 0.15})`);
      halo.addColorStop(1, 'rgba(255,143,163,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      // Three offset, semi-transparent blobs: overlaps mix into new hues rather than blowing out to white.
      HUES.forEach(([a, b], k) => {
        ctx.beginPath();
        for (let i = 0; i <= 96; i++) {
          const th = (i / 96) * Math.PI * 2;
          const r =
            R *
            (0.86 +
              (0.05 + lv * 0.1) * Math.sin(3 * th + t * (0.7 + k * 0.2) + k * 2.1) +
              0.035 * Math.sin(5 * th - t * (1.1 + k * 0.15) + k) +
              lv * 0.05 * Math.sin(9 * th + t * 3));
          const x = cx + Math.cos(th) * r + Math.cos(t * 0.5 + k * 2.1) * R * 0.12;
          const y = cy + Math.sin(th) * r + Math.sin(t * 0.4 + k * 2.1) * R * 0.12;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        const ox = Math.cos(k * 2.1 + t * 0.3) * R * 0.5;
        const oy = Math.sin(k * 2.1 + t * 0.3) * R * 0.5;
        const g = ctx.createRadialGradient(cx + ox, cy + oy, R * 0.05, cx, cy, R * 1.15);
        g.addColorStop(0, a);
        g.addColorStop(1, b);
        ctx.globalAlpha = k === 0 ? 0.95 : 0.55;
        ctx.fillStyle = g;
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Specular highlight.
      const hi = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, 0, cx - R * 0.35, cy - R * 0.4, R * 0.75);
      hi.addColorStop(0, 'rgba(255,255,255,.4)');
      hi.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = hi;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.92, 0, Math.PI * 2);
      ctx.fill();

      if (bars) {
        spectrum(bins);
        const n = smooth.length;
        for (let i = 0; i < n; i++) {
          // Mirror the low half of the spectrum around the circle.
          const bin = Math.floor((i < n / 2 ? i : n - i) * 2.2) + 2;
          smooth[i] += (bins[bin] / 255 - smooth[i]) * 0.25;
          const th = (i / n) * Math.PI * 2 - Math.PI / 2;
          const r0 = R * 1.28;
          const len = 3 + smooth[i] * R * 0.75 + (still ? 0 : Math.sin(t * 1.5 + i * 0.5) * 1.5 + 1.5);
          ctx.strokeStyle = `rgba(255,255,255,${0.25 + smooth[i] * 0.6})`;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(th) * r0, cy + Math.sin(th) * r0);
          ctx.lineTo(cx + Math.cos(th) * (r0 + len), cy + Math.sin(th) * (r0 + len));
          ctx.stroke();
        }
      }
    };

    gsap.ticker.add(draw);
    return () => {
      gsap.ticker.remove(draw);
      ro.disconnect();
    };
  }, [inView, bars]);

  return <canvas ref={ref} className={`orb ${className}`} aria-hidden="true" />;
}
