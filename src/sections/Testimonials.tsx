import { useEffect, useRef, useState } from 'react';
import { testimonials } from '../content/content';
import Reveal from '../components/Reveal';
import './Testimonials.css';

/** How long each quote holds before the next one takes over (when the
    page scroll is not driving the quotes). */
const INTERVAL = 8000;

/* The page scroll moves through the quotes on every device; only where the
   reader has asked for reduced motion do they switch by timer and swipe. */
const PINNED = '(prefers-reduced-motion: no-preference)';

/** How much page scroll each quote holds for, as a share of the screen. */
const STEP = 0.7;

/**
 * One quote at a time on the white ground, set large, over a large faint
 * orange quotation mark. The progress bars beneath switch
 * between the quotes; the current one fills as the timer.
 *
 * The page scroll moves through them: the section holds in place while the
 * reader scrolls, one quote after another, then the page carries on — so
 * every visitor reads all three. Each quote arrives word by word, rising
 * into place, and closes with a large faint orange quotation mark. The bars
 * show where the reader is, filling with the scroll, and take them to a
 * quote; a sideways swipe, drag or trackpad scroll moves to the next or
 * previous one. Under reduced motion the section does not hold: the quote
 * advances on a timer instead (pausing under the pointer). The quotes share one
 * grid cell and cross-fade, so the block keeps the height of the longest
 * and never jumps the page. Under reduced motion nothing advances by itself.
 *
 * Quotation marks are added by the layout, never stored in the copy.
 */
export default function Testimonials() {
  const { items } = testimonials;
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(PINNED);
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  /* Pinned: where the page scroll is in the held section picks the quote,
     and fills the current bar with the progress through it. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !pinned) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = section.getBoundingClientRect();
        const run = r.height - window.innerHeight;
        const p = run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
        const at = Math.min(items.length - 1, Math.floor(p * items.length));
        setActive(at);
        barsRef.current?.style.setProperty(
          '--fill',
          String(Math.min(1, Math.max(0, p * items.length - at))),
        );
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pinned, items.length]);

  /* Pinned: scroll the page to the start of quote i's stretch. */
  const showPinned = (i: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const run = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((i + 0.02) / items.length) * run, behavior: 'smooth' });
  };

  useEffect(() => {
    const node = rootRef.current;
    if (!node || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (pinned || held || !inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % items.length), INTERVAL);
    return () => window.clearTimeout(timer);
  }, [active, held, inView, items.length, pinned]);

  /* Scroll between quotes: a sideways swipe or drag, or a sideways
     trackpad scroll, moves to the next or previous one. Up-and-down
     scrolling is left to the page. */
  const go = (step: number) => {
    if (pinned) {
      showPinned(Math.min(items.length - 1, Math.max(0, active + step)));
      return;
    }
    setActive((i) => (i + step + items.length) % items.length);
  };
  const drag = useRef<{ x: number; y: number } | null>(null);
  const wheelLock = useRef(0);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = drag.current;
    drag.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < 30 || Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
    /* One step per gesture: a trackpad swipe fires a stream of events. */
    const now = Date.now();
    if (now - wheelLock.current < 700) return;
    wheelLock.current = now;
    go(e.deltaX > 0 ? 1 : -1);
  };

  return (
    <section
      className={`section section--quiet testimonials${pinned ? ' is-pinned' : ''}`}
      id="testimonials"
      ref={sectionRef}
      style={{ '--quotes': items.length, '--step': STEP } as React.CSSProperties}
    >
      <div className="wrap">
        <Reveal as="p" className="label testimonials__eyebrow">
          {testimonials.heading}
        </Reveal>

        <Reveal delay={80}>
          <div
            className={`testimonials__body${held ? ' is-held' : ''}`}
            ref={rootRef}
            style={{ '--interval': `${INTERVAL}ms` } as React.CSSProperties}
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
            onFocusCapture={() => setHeld(true)}
            onBlurCapture={() => setHeld(false)}
          >
            <span className="testimonials__mark" aria-hidden="true">
              &ldquo;
            </span>

            <div
              className="testimonials__slides"
              aria-live="polite"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (drag.current = null)}
              onWheel={onWheel}
            >
              {items.map((item, i) => (
                <figure
                  key={item.name}
                  className={`testimonials__slide${i === active ? ' is-active' : ''}`}
                  aria-hidden={i !== active}
                >
                  {/* Word by word, so each can rise into place in turn; the
                      whole quote is read out once, from the label. */}
                  <blockquote className="testimonials__quote" aria-label={item.quote}>
                    {item.quote.split(' ').map((word, w) => (
                      <span
                        key={w}
                        className="testimonials__word"
                        aria-hidden="true"
                        style={{ '--w': w } as React.CSSProperties}
                      >
                        {word}{' '}
                      </span>
                    ))}
                    <span className="testimonials__close" aria-hidden="true">
                      &rdquo;
                    </span>
                  </blockquote>
                  <figcaption className="testimonials__attribution">
                    <p className="testimonials__name">{item.name}</p>
                    <p className="testimonials__designation">{item.designation}</p>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="testimonials__bars" ref={barsRef}>
              {items.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  className={`testimonials__bar${i === active ? ' is-current' : ''}`}
                  aria-label={`Testimonial ${i + 1} of ${items.length}: ${item.name}`}
                  aria-current={i === active}
                  onClick={() => (pinned ? showPinned(i) : setActive(i))}
                >
                  <span className="testimonials__bar-fill" />
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
