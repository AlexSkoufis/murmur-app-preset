import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Geist, Geist_Mono } from 'next/font/google';
import { app } from '@/lib/content';
import './globals.css';

// Bricolage Grotesque: variable display face (weight + optical size + width), set light and large.
const display = Bricolage_Grotesque({ subsets: ['latin'], axes: ['opsz', 'wdth'], variable: '--font-display', display: 'swap' });
const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: `${app.name} — ${app.tagline}`,
  description: `${app.name} mixes living, generated soundscapes for focus by day and sleep by night. A fictional app landing page design concept.`,
};

export const viewport: Viewport = { themeColor: '#F4E6DB', width: 'device-width', initialScale: 1 };

const motionFlag = `try{if(matchMedia('(prefers-reduced-motion: no-preference)').matches)document.documentElement.classList.add('motion')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script adds `motion` to <html>, and GSAP writes sky colours onto it.
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
