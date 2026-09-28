import { useEffect, useRef, useState } from 'react';
import './FlipText.css';

type Props = {
  /** The approved figure, verbatim. Rendered character by character. */
  value: string;
  /** Stagger between characters, in ms. */
  stagger?: number;
  /** Time each intermediate digit is held while a numeral steps up, in ms. */
  step?: number;
  className?: string;
};

const DIGIT = /\d/;

/**
 * Split-flap entrance for a figure. Each character flips up into place in
 * turn, and every numeral then steps up through the digits below it before
 * settling — "$2 Billion" arrives as $0 → $1 → $2 — in the manner of a
 * departures board. The approved string is never re-authored: it is only
 * split into characters, and the final state is the string as supplied.
 *
 * Runs once, the first time the figure scrolls into view. Under
 * prefers-reduced-motion the final string is rendered with no animation.
 */
export default function FlipText({ value, stagger = 55, step = 220, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const chars = Array.from(value);
  const targets = chars.map((c) => (DIGIT.test(c) ? Number(c) : null));

  const [live, setLive] = useState(false);
  const [still, setStill] = useState(false);
  const [digits, setDigits] = useState<number[]>(() => targets.map(() => 0));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      setStill(true);
      setDigits(targets.map((t) => t ?? 0));
      return;
    }

    const timers: number[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        setLive(true);

        /* Once a numeral has flipped in showing 0, step it up to its value. */
        targets.forEach((target, i) => {
          if (target === null || target === 0) return;
          const start = i * stagger + 420;
          for (let d = 1; d <= target; d += 1) {
            timers.push(
              window.setTimeout(() => {
                setDigits((prev) => {
                  const next = prev.slice();
                  next[i] = d;
                  return next;
                });
              }, start + (d - 1) * step),
            );
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.2 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span
      ref={ref}
      className={`flip ${live ? 'is-live' : ''} ${still ? 'is-still' : ''} ${className}`.trim()}
      aria-label={value}
    >
      {chars.map((c, i) => {
        const isDigit = targets[i] !== null;
        const shown = isDigit ? String(digits[i]) : c;
        /* A numeral remounts on every step, which restarts its flip. */
        const key = isDigit ? `${i}-${shown}` : String(i);
        const stepping = isDigit && digits[i] > 0;
        return (
          <span
            key={key}
            aria-hidden="true"
            className={`flip__char ${stepping ? 'flip__char--step' : ''}`.trim()}
            style={{ '--i': i } as React.CSSProperties}
          >
            {/* The glyph is a separate box so colour effects (the hover
                shimmer in Metrics.css) can animate it without touching the
                flap's own transform and opacity. */}
            <span className="flip__glyph">{shown === ' ' ? '\u00A0' : shown}</span>
          </span>
        );
      })}
    </span>
  );
}
