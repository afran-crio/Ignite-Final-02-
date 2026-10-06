import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { logoHeight } from '../lib/logo';
import './LogoCarousel.css';

export type LogoItem = {
  name: string;
  logo: string | null;
  /** The logo file's width ÷ height; sets the mark's height (lib/logo.ts). */
  ratio: number;
  /** Evens out visual weight on top of the ratio; 1 is the baseline. */
  scale: number;
};

type LogoCarouselProps = {
  items: readonly LogoItem[];
  /** Milliseconds between advances. Lower is faster. */
  interval?: number;
  /** Which way the rail travels. Two rails run opposite each other. */
  direction?: 'forward' | 'reverse';
  /** Start offset, in ms, so two rails do not step in lockstep. */
  phase?: number;
  label?: string;
};

/**
 * Continuously advancing logo rail.
 *
 * `direction` reverses the travel, so a pair of rails can run against each
 * other, and `phase` offsets the start so the two never step in lockstep.
 *
 * Embla's own `loop` handles the wrap-around, so this is genuinely endless
 * rather than snapping back to the start at the end of the list. Autoplay
 * pauses on hover, on focus within, while the tab is hidden and whenever the
 * visitor is dragging, and never starts at all under reduced motion.
 */
export default function LogoCarousel({
  items,
  interval = 1467,
  direction = 'forward',
  phase = 0,
  label = 'Clients',
}: LogoCarouselProps) {
  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    align: 'start',
    dragFree: false,
    containScroll: false,
  });

  /* Loop mode needs comfortably more slide width than the viewport, and a
     single rail now carries only half the client list. Repeat the set until
     there is enough to wrap cleanly; the repeats are hidden from assistive
     technology so each client is announced once. */
  const repeats = Math.max(1, Math.ceil(12 / Math.max(items.length, 1)));
  const slides = Array.from({ length: repeats }, () => items).flat();

  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);
  const kickoff = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
    if (kickoff.current !== null) {
      window.clearTimeout(kickoff.current);
      kickoff.current = null;
    }
  }, []);

  useEffect(() => {
    if (!embla) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const start = () => {
      clear();
      /* `embla.internalEngine()` is not needed — scrollNext/scrollPrev wrap
         because the carousel is in loop mode. */
      const advance = () =>
        direction === 'reverse' ? embla.scrollPrev() : embla.scrollNext();

      const begin = () => {
        kickoff.current = null;
        timer.current = window.setInterval(advance, interval);
      };

      if (phase > 0) {
        kickoff.current = window.setTimeout(begin, phase);
      } else {
        begin();
      }
    };

    const stop = () => clear();

    if (paused || document.hidden) {
      stop();
    } else {
      start();
    }

    const onVisibility = () => (document.hidden || paused ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    embla.on('pointerDown', stop);
    embla.on('pointerUp', start);

    return () => {
      clear();
      document.removeEventListener('visibilitychange', onVisibility);
      embla.off('pointerDown', stop);
      embla.off('pointerUp', start);
    };
  }, [embla, interval, direction, phase, paused, clear]);

  return (
    <div
      className="logos"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="logos__viewport" ref={emblaRef}>
        <div className="logos__track">
          {slides.map((item, i) => (
            <div
              className="logos__slide"
              key={`${item.name}-${i}`}
              role="group"
              aria-roledescription="slide"
              aria-hidden={i >= items.length || undefined}
            >
              <div className="logos__cell">
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    style={{ '--logo-h': logoHeight(item.ratio, item.scale).toFixed(1) } as React.CSSProperties}
                  />
                ) : (
                  /* No approved logo file supplied — the name is set
                     typographically instead. See content.ts. */
                  <span className="logos__name">{item.name}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
