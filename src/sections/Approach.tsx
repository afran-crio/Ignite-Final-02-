import { useEffect, useRef, useState } from 'react';
import { approach } from '../content/content';
import Reveal from '../components/Reveal';
import './Approach.css';

/** How long each step leads before the next takes over. */
const INTERVAL = 3200;

/**
 * The four approved principles on a timeline: a step number over a hairline
 * with a marker on it, and the title beneath, flush with the number.
 *
 * While the section is on screen the lead moves through the steps on its
 * own, 01 → 04 and round again: the leading step's number grows and turns
 * orange, its title firms up, and an orange line fills along its hairline as
 * the timer. The pointer (or focus, or a tap) takes over at once and holds
 * the step it is on; the cycle resumes from there when it leaves. So all
 * four get their moment, and nothing moves under a reader's hand.
 *
 * The approved copy supplies titles only, no descriptions.
 */
export default function Approach() {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const trackRef = useRef<HTMLOListElement>(null);
  const count = approach.principles.length;

  /* Cycle only while the track is on screen, so the reader arrives at the
     section with 01 leading rather than somewhere mid-cycle. */
  useEffect(() => {
    const node = trackRef.current;
    if (!node || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (held || !inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % count), INTERVAL);
    return () => window.clearTimeout(timer);
  }, [active, held, inView, count]);

  const take = (i: number) => {
    setHeld(true);
    setActive(i);
  };

  return (
    <section className="section section--panel section--wash approach" id="approach">
      <div className="wrap">
        <Reveal as="p" className="label approach__eyebrow">
          {approach.heading}
        </Reveal>

        <Reveal delay={70}>
          {/* One sentence; the spans fix where it turns on desktop, where
              the client asked the line to break. */}
          <h2 className="h2 approach__lead" aria-label={approach.lead}>
            {approach.leadLines.map((line, i) => (
              <span key={line} className="approach__lead-line">
                {i > 0 && ' '}
                {line}
              </span>
            ))}
          </h2>
        </Reveal>

        <ol
          className={`approach__track${held ? ' is-held' : ''}`}
          ref={trackRef}
          style={{ '--interval': `${INTERVAL}ms` } as React.CSSProperties}
          onMouseLeave={() => setHeld(false)}
        >
          {approach.principles.map((principle, i) => (
            <Reveal as="li" key={principle} delay={100 + i * 55} className="approach__step">
              {/* The active class lives here, not on the Reveal above: the
                  reveal's `is-visible` is set on the DOM outside React, and a
                  re-render that rewrote that element's className would drop
                  it and hide the step. */}
              <div
                className={`approach__card${i === active ? ' is-active' : ''}`}
                onMouseEnter={() => take(i)}
                onFocus={() => take(i)}
                onBlur={() => setHeld(false)}
                onClick={(e) => {
                  /* A tap has no hover to end it, so on touch the tapped
                     step leads and the cycle carries on from it. */
                  if ((e.nativeEvent as PointerEvent).pointerType === 'touch') {
                    setActive(i);
                    setHeld(false);
                  } else {
                    take(i);
                  }
                }}
                tabIndex={0}
                aria-label={principle}
                aria-current={i === active ? 'step' : undefined}
              >
                <span className="approach__number" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="approach__rule" aria-hidden="true">
                  <span className="approach__fill" />
                  <span className="approach__dot" />
                </span>

                <h3 className="approach__title">{principle}</h3>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
