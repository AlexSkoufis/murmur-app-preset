import { StatusIcons } from './Icons';

/**
 * A phone drawn entirely in CSS. Everything inside is sized in container-query units (cqw),
 * so the same screen renders crisply at any size — hero, sticky story stage or mobile card.
 */
export default function Phone({
  time = '9:41',
  theme = 'dark',
  className = '',
  children,
}: {
  time?: string;
  theme?: 'dark' | 'light';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`phone phone--${theme} ${className}`}>
      <span className="phone__btn phone__btn--a" aria-hidden="true" />
      <span className="phone__btn phone__btn--b" aria-hidden="true" />
      <span className="phone__btn phone__btn--c" aria-hidden="true" />
      <span className="phone__btn phone__btn--d" aria-hidden="true" />
      <div className="phone__body">
        <div className="phone__screen">
          <div className="phone__ui">
            <div className="phone__status" aria-hidden="true">
              <span>{time}</span>
              <StatusIcons />
            </div>
            {children}
          </div>
          <span className="phone__island" aria-hidden="true" />
          <span className="phone__glare" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
