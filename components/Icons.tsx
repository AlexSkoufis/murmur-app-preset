import type { SVGProps } from 'react';
import type { ChannelId } from '@/lib/audio';

type P = SVGProps<SVGSVGElement>;
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export const Play = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none" />
  </svg>
);
export const Pause = (p: P) => (
  <svg {...base} {...p}>
    <rect x="6.5" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" stroke="none" />
    <rect x="13.9" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" stroke="none" />
  </svg>
);
export const Back = (p: P) => (
  <svg {...base} {...p}>
    <path d="M18 6v12L9 12zM6 6v12" />
  </svg>
);
export const Next = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6v12l9-6zM18 6v12" />
  </svg>
);
export const Star = (p: P) => (
  <svg {...base} {...p}>
    <path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" fill="currentColor" stroke="none" />
  </svg>
);
export const Check = (p: P) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.2 4L19 7" />
  </svg>
);
export const Arrow = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14m-5-5 5 5-5 5" />
  </svg>
);
export const Moon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
  </svg>
);
export const Plane = (p: P) => (
  <svg {...base} {...p}>
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
);
export const Phone = (p: P) => (
  <svg {...base} {...p}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M10.5 5h3" />
  </svg>
);
export const Download = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3.5v11m-4.5-4.5 4.5 4.5 4.5-4.5M4.5 19.5h15" />
  </svg>
);

const channel: Record<ChannelId, (p: P) => React.ReactElement> = {
  rain: (p) => (
    <svg {...base} {...p}>
      <path d="M7 14.5a4 4 0 0 1-.5-8 5.5 5.5 0 0 1 10.6 1.3A3.4 3.4 0 0 1 17 14.5z" />
      <path d="m8.5 17.5-1 2.5m5-2.5-1 2.5m5-2.5-1 2.5" />
    </svg>
  ),
  waves: (p) => (
    <svg {...base} {...p}>
      <path d="M2.5 9c2.4 0 2.4-2 4.75-2S9.6 9 12 9s2.4-2 4.75-2S19.1 9 21.5 9M2.5 14c2.4 0 2.4-2 4.75-2S9.6 14 12 14s2.4-2 4.75-2 2.35 2 4.75 2M2.5 19c2.4 0 2.4-2 4.75-2S9.6 19 12 19s2.4-2 4.75-2 2.35 2 4.75 2" />
    </svg>
  ),
  wind: (p) => (
    <svg {...base} {...p}>
      <path d="M3 9h11a3 3 0 1 0-3-3M3 13h15a3 3 0 1 1-3 3M3 17h6" />
    </svg>
  ),
  fire: (p) => (
    <svg {...base} {...p}>
      <path d="M12 21.5c-3.9 0-6.5-2.6-6.5-6.2 0-3.9 3.2-5.6 3.7-9.8 2.3 1.4 3.4 3.4 3.3 5.6 1-.6 1.7-1.8 1.9-3 2.4 1.9 4.1 4.5 4.1 7.2 0 3.6-2.6 6.2-6.5 6.2z" />
      <path d="M12 21.5c-1.6 0-2.7-1.1-2.7-2.6 0-1.8 1.5-2.5 2.2-4 1.9 1 3.2 2.3 3.2 4 0 1.5-1.1 2.6-2.7 2.6z" />
    </svg>
  ),
  birds: (p) => (
    <svg {...base} {...p}>
      <path d="M2.5 9.5c2-1.8 4.2-1.8 5.5 0 1.3-1.8 3.5-1.8 5.5 0M11 16c2-1.8 4.2-1.8 5.5 0 1.3-1.8 3.5-1.8 5.5 0" />
    </svg>
  ),
  brown: (p) => (
    <svg {...base} {...p}>
      <path d="M2.5 12h2l1.5-4 2 9 2-12 2 14 2-10 2 6 1.5-3h4" />
    </svg>
  ),
};
export const ChannelIcon = ({ id, ...p }: P & { id: ChannelId }) => channel[id](p);

/** Status-bar glyphs (signal, wifi, battery) for the phone mockup. */
export const StatusIcons = () => (
  <svg viewBox="0 0 68 12" aria-hidden="true" fill="currentColor">
    <rect x="0" y="8" width="3" height="4" rx="1" />
    <rect x="4.5" y="6" width="3" height="6" rx="1" />
    <rect x="9" y="3.5" width="3" height="8.5" rx="1" />
    <rect x="13.5" y="1" width="3" height="11" rx="1" />
    <path d="M29 3.2a9.5 9.5 0 0 1 12.4 0l-1.3 1.4a7.6 7.6 0 0 0-9.8 0zm2.4 2.6a6 6 0 0 1 7.6 0l-1.3 1.4a4.1 4.1 0 0 0-5 0zM35.2 12l-2-2.1a2.9 2.9 0 0 1 4 0z" />
    <rect x="45" y="1.5" width="19.5" height="9.5" rx="3" fill="none" stroke="currentColor" strokeOpacity=".45" />
    <rect x="46.8" y="3.3" width="14" height="5.9" rx="1.6" />
    <rect x="65.5" y="4.4" width="1.6" height="3.6" rx=".8" fillOpacity=".45" />
  </svg>
);
