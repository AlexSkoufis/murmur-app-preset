import { Download, Phone } from './Icons';

/** Generic store buttons (no brand marks) — swap for official badges on a real project. */
export default function StoreBadges({ className = '' }: { className?: string }) {
  return (
    <div className={`stores ${className}`}>
      <a className="store" href="#download">
        <Phone />
        <span>
          <small>Download on the</small>
          App Store
        </span>
      </a>
      <a className="store store--ghost" href="#download">
        <Download />
        <span>
          <small>Get it on</small>
          Google Play
        </span>
      </a>
    </div>
  );
}
