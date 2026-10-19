# Murmur — app presentation preset

A landing page for a fictional focus & sleep sound app. No photography: every visual is drawn in code.

- **Day → night scroll.** The whole page's sky (`--s1`, `--s2`, `--ink`, `--night`, `--glow` on `<html>`) is scrubbed from dawn to midnight by the Story section; a clock and sun/moon arc run with it, and the sticky phone swaps screens (and its own light/dark theme).
- **Real sound.** `lib/audio.ts` synthesises six layers (rain, waves, wind, fire, birds, brown noise) with the Web Audio API — no audio files. The hero phone's play/skip buttons, the nav mini-player, the mixer and the sleep-timer dial all drive the same engine.
- **CSS phone.** `components/Phone.tsx` is sized with container-query units, so the screens in `components/Screens.tsx` render at any size.
- **Living orb.** `components/Orb.tsx` is a canvas blob that swells with the playing sound's loudness (plus a spectrum halo in the mixer).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to /out
```

## Customise

- Copy, chapters, sky colours, presets, pricing, reviews, FAQ: `lib/content.ts`.
- Brand gradient and tokens: top of `app/globals.css`.
- Store buttons are generic (no brand marks) — swap in official badges for a real app.

Motion respects `prefers-reduced-motion` (no intro/scroll animation, static orb). Built with Next.js 15, GSAP 3 (ScrollTrigger, SplitText) and Lenis.
