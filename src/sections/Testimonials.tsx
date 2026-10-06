import { useEffect, useRef, useState } from 'react';
import { testimonials } from '../content/content';
import Reveal from '../components/Reveal';
import './Testimonials.css';

/** How long each quote holds before the next one takes over (it was 8s;
    brought to 5s, then 4s, Oct 2026). */
const INTERVAL = 4000;

/**
 * The client quotes, set inside the Marquee Clientele section beneath the
 * logos (client feedback, Sep 2026) rather than as a section of their own —
 * the clients, then what they say. One quote at a time, set large, opened
 * by an orange quotation mark. The quotes rotate by themselves on a timer while
 * the section is in view — passive, never tied to the page scroll (client
 * feedback, Sep 2026) — pausing under the pointer or keyboard focus. Each
 * quote arrives word by word, rising into place. The bars beneath show where the rotation is,
 * the current one filling as the timer, and take the reader to a quote; a
 * sideways swipe, drag or trackpad scroll moves to the next or previous one.
 * The quotes share one grid cell and cross-fade, so the block keeps the
 * height of the longest and never jumps the page. Under reduced motion
 * nothing advances by itself.
 *
 * Quotation marks are added by the layout, never stored in the copy.
 */
export default function Testimonials() {
  const { items } = testimonials;
  const [active, setActive] = useState(0);
  /* The rotation holds while a mouse is over the quotes, while a control in
     them has keyboard focus, or while a finger presses and holds them on a
     phone (Oct 2026). Kept apart, so one ending doesn't release the others. */
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const held = hovered || focused || pressed;
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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
    if (held || !inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % items.length), INTERVAL);
    return () => window.clearTimeout(timer);
  }, [active, held, inView, items.length]);

  /* Scroll between quotes: a sideways swipe or drag, or a sideways
     trackpad scroll, moves to the next or previous one. Up-and-down
     scrolling is left to the page. */
  const go = (step: number) => setActive((i) => (i + step + items.length) % items.length);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const wheelLock = useRef(0);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY };
    if (e.pointerType !== 'mouse') setPressed(true);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = drag.current;
    drag.current = null;
    setPressed(false);
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
    <div className="testimonials" id="testimonials">
      <Reveal delay={80}>
          <div
            className={`testimonials__body${held ? ' is-held' : ''}`}
            role="region"
            aria-label={testimonials.heading}
            ref={rootRef}
            style={{ '--interval': `${INTERVAL}ms` } as React.CSSProperties}
            /* Pointer events, not mouse events: a tap on a phone also fires
               mouseenter, which would hold the rotation after the finger
               lifts. Focus holds only when it's from the keyboard. */
            onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(false)}
            onFocusCapture={(e) => setFocused(e.target.matches(':focus-visible'))}
            onBlurCapture={() => setFocused(false)}
          >
            <div
              className="testimonials__slides"
              aria-live="polite"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => {
                /* The page took the gesture over to scroll: not a hold. */
                drag.current = null;
                setPressed(false);
              }}
              onContextMenu={(e) => pressed && e.preventDefault()}
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
                  </blockquote>
                  <figcaption className="testimonials__attribution">
                    <p className="testimonials__name">{item.name}</p>
                    <p className="testimonials__designation">{item.designation}</p>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="testimonials__bars">
              {items.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  className={`testimonials__bar${i === active ? ' is-current' : ''}`}
                  aria-label={`Testimonial ${i + 1} of ${items.length}: ${item.name}`}
                  aria-current={i === active}
                  onClick={() => setActive(i)}
                >
                  <span className="testimonials__bar-fill" />
                </button>
              ))}
            </div>
          </div>
      </Reveal>
    </div>
  );
}
