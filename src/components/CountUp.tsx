import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './CountUp.css';

/** The first numeral in the string — "100+ Years" counts the 100, keeps the rest. */
const NUMBER = /\d[\d,]*/;

type Props = {
  /** The approved figure, verbatim. Only the numeral inside it is animated. */
  value: string;
  duration?: number;
  /**
   * For a figure in billions ("$2 Bn"): count up through the millions first
   * — $50 Mn, $400 Mn, $900 Mn — turn over into billions at a thousand, and
   * slow through the tenths ($1.8 Bn, $1.9 Bn) to land on the figure. Counting the 2
   * alone would be over in three steps.
   */
  fromMillions?: boolean;
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
/* An even, unhurried climb that eases off toward the end: the millions go
   by in the first third, and the last tenths of the billions are seen to
   slow down one by one rather than snapping into place. */
const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2);

/**
 * Counts the figure up from zero the first time it scrolls into view, in the
 * manner of the reference's track-record numbers. The approved copy is never
 * re-authored: the string is split around its numeral, the numeral is
 * animated, and the prefix and suffix are rendered unchanged.
 */
export default function CountUp({ value, duration = 1800, fromMillions = false }: Props) {
  const match = value.match(NUMBER);
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  const raw = match?.[0] ?? '';
  const target = raw ? Number(raw.replace(/,/g, '')) : 0;
  const grouped = raw.includes(',');
  const head = match ? value.slice(0, match.index) : value;
  const tail = match ? value.slice((match.index ?? 0) + raw.length) : '';

  /* The suffix ("+", "B") is wrapped so a section can colour it apart. */
  const format = (n: number) =>
    `${head}${grouped ? n.toLocaleString('en-US') : String(n)}${tail}`;

  /* Start at zero before the first paint, so the figure never flashes its
     final value and then rewinds. */
  useLayoutEffect(() => {
    if (!match) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    setText(fromMillions ? `${head}0 Mn` : format(0));
    if (fromMillions && ref.current) ref.current.dataset.unit = 'M';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !match) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    let frame = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        let t = Math.min((now - start) / duration, 1);
        if (fromMillions) {
          /* The amount in millions; below a thousand it reads in Mn, in
             steps of ten, and from a thousand in Bn to one decimal. The
             last frame is the figure exactly as approved. */
          const millions = easeOutSine(t) * target * 1000;
          const billions = (millions / 1000).toFixed(1);
          /* `data-unit` lets the section size each phase — the millions,
             the tenths of a billion, the landed figure — so it grows as it
             climbs. */
          node.dataset.unit = millions < 1000 ? 'M' : 'B';
          if (t === 1 || Number(billions) === target) {
            setText(value);
            node.dataset.unit = 'done';
            t = 1;
          } else if (millions < 1000) {
            setText(`${head}${Math.min(Math.round(millions / 10) * 10, 990)} Mn`);
          }
          else setText(`${head}${billions}${tail}`);
        } else {
          setText(format(Math.round(easeOutExpo(t) * target)));
        }
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          run();
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, fromMillions]);

  return (
    <span className="countup" ref={ref}>
      <span className="countup__ghost" aria-hidden="true">
        {value}
      </span>
      <span className="countup__live" aria-hidden="true">
        {/* The trailing unit or sign ("+", "B", or "M" mid-climb) is
            wrapped so a section can colour it apart. */}
        {text.replace(/[^\d.]+$/, '')}
        {/[^\d.]+$/.test(text) && (
          <span className="countup__affix">{text.match(/[^\d.]+$/)?.[0]}</span>
        )}
      </span>
      <span className="visually-hidden">{value}</span>
    </span>
  );
}
