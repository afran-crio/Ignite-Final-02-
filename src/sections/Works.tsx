import { useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { works } from '../content/content';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';
import './Works.css';

/**
 * Transactions as a rail of blocks the reader moves themselves, dragged or
 * swiped. Three and a bit sit on screen at once, so the next one is always
 * visibly waiting rather than hidden.
 *
 * The rail does not loop and does not advance on its own: this is a list of
 * record, and the reader should be able to reach the end of it and know that
 * is the end.
 *
 * On desktop the page scroll drives it: the section holds in place while
 * the reader scrolls, the rail glides sideways with the scroll until the
 * last tile has arrived, and then the page carries on — so every visitor
 * passes all seven without having to drag. This runs on every device; only
 * reduced motion keeps the ordinary swipeable rail.
 *
 * A tile at rest shows only the sector and the amount over its photograph.
 * The active tile also shows the mandate's solution and description, risen
 * into view on an accent glow. When the rail first scrolls into view the
 * first tile opens on its own, holds for three seconds, and closes again —
 * a one-time demonstration of what the tiles do. After that a tile is active
 * only under the pointer (or keyboard focus, or when tapped), and none is
 * when the pointer leaves the rail.
 */
/* The page scroll drives the rail on every device. Only where the reader
   has asked for reduced motion does the ordinary swipeable carousel run. */
const PINNED = '(prefers-reduced-motion: no-preference)';

export default function Works() {
  /* A sideways swipe on a trackpad (or shift + wheel) moves the rail; an
     up-and-down scroll still scrolls the page. Switched off where the page
     scroll drives the rail instead. */
  const [emblaRef, embla] = useEmblaCarousel(
    {
      loop: false,
      align: 'start',
      containScroll: 'trimSnaps',
      breakpoints: { [PINNED]: { active: false } },
    },
    [WheelGesturesPlugin()],
  );

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  /* How far the rail travels in pinned mode, in px. */
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia(PINNED);
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  /* Measure the travel: the rail's full width less what the screen shows. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !pinned) return;
    const measure = () => {
      const view = track.parentElement!;
      setDistance(Math.max(0, track.scrollWidth - view.clientWidth));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(track.parentElement!);
    return () => observer.disconnect();
  }, [pinned]);

  /* Pinned: the page scroll through the held section moves the rail. */
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    if (!pinned) {
      track.style.transform = '';
      return;
    }
    /* The rail eases towards the scroll position rather than jumping to
       it: a mouse wheel scrolls in steps of ~100px, and following each step
       exactly made the rail judder. Each frame closes a share of the gap
       until it has settled, then the loop stops. */
    let target = 0;
    let current: number | null = null;
    let frame = 0;
    const tick = () => {
      if (current === null) current = target;
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.3) current = target;
      track.style.transform = `translate3d(${current.toFixed(2)}px, 0, 0)`;
      /* While the rail moves the tiles ignore the pointer: a still pointer
         would otherwise open each tile as it slid beneath it, running the
         colour and zoom transition on one tile after another. */
      const moving = current !== target;
      /* A tile left open under the pointer closes as the rail sets off. */
      if (moving && !track.classList.contains('is-moving')) setActive(null);
      track.classList.toggle('is-moving', moving);
      frame = moving ? requestAnimationFrame(tick) : 0;
    };
    const onScroll = () => {
      const r = section.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      const p = run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
      target = -p * distance;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pinned, distance]);

  /* Pinned: the rail can also be dragged sideways (mouse, pen or finger).
     A drag moves the page scroll by the matching amount, so the rail and
     the page never disagree; on release the rail carries on a little with
     the drag's speed. A drag that was mostly vertical is left to the page. */
  const drag = useRef<{
    x: number;
    y: number;
    scroll: number;
    ratio: number;
    axis: 'x' | 'y' | null;
    lastX: number;
    lastT: number;
    v: number;
  } | null>(null);
  const dragged = useRef(false);

  const onDragStart = (e: React.PointerEvent) => {
    if (!pinned || e.button !== 0) return;
    const section = sectionRef.current;
    if (!section || distance <= 0) return;
    const run = section.offsetHeight - window.innerHeight;
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      scroll: window.scrollY,
      ratio: run / distance,
      axis: null,
      lastX: e.clientX,
      lastT: performance.now(),
      v: 0,
    };
    dragged.current = false;
  };

  const onDragMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.axis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (d.axis === 'y') {
        drag.current = null;
        return;
      }
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      trackRef.current?.classList.add('is-dragging');
      dragged.current = true;
    }
    const now = performance.now();
    d.v = (e.clientX - d.lastX) / Math.max(1, now - d.lastT);
    d.lastX = e.clientX;
    d.lastT = now;
    window.scrollTo({ top: d.scroll - dx * d.ratio, behavior: 'instant' });
  };

  const onDragEnd = () => {
    const d = drag.current;
    drag.current = null;
    trackRef.current?.classList.remove('is-dragging');
    if (!d || d.axis !== 'x') return;
    /* A short glide in the direction of the throw, at most a third of a
       tile, so a quick flick carries on a little but never overshoots. */
    /* No glide if the pointer had come to rest before it let go. */
    const v = performance.now() - d.lastT > 80 ? 0 : d.v;
    const glide = Math.max(-140, Math.min(140, -v * 120));
    if (Math.abs(glide) > 8) {
      window.scrollTo({ top: window.scrollY + glide * d.ratio, behavior: 'smooth' });
    }
  };

  /* Pinned: bring slide i into view by scrolling the page to the point in
     the held section where the rail shows it, its left edge on the page
     margin (the first slide carries the margin as its padding). */
  const showPinned = (i: number) => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || distance <= 0) return;
    const slide = track.children[i] as HTMLElement | undefined;
    if (!slide) return;
    const tile = slide.querySelector<HTMLElement>('.works__tile')!;
    const margin = parseFloat(getComputedStyle(track.children[0] as HTMLElement).paddingLeft);
    const shift = Math.min(distance, Math.max(0, slide.offsetLeft + tile.offsetLeft - margin));
    const run = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (shift / distance) * run, behavior: 'smooth' });
  };

  const [active, setActive] = useState<number | null>(null);
  /* The tile whose intro is descending: it closes slowly, unlike a hover. */
  const [closing, setClosing] = useState<number | null>(null);

  /* The intro: once, when the rail enters the viewport, open the first tile
     after the cards have glided in, hold it, and close it — unless the
     visitor has already taken over with the pointer, in which case leave
     their choice alone. */
  const carouselRef = useRef<HTMLDivElement>(null);
  const introRan = useRef(false);
  const introOpen = useRef(false);
  useEffect(() => {
    const node = carouselRef.current;
    if (!node || introRan.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const timers: number[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || introRan.current) return;
        introRan.current = true;
        observer.disconnect();
        timers.push(
          window.setTimeout(() => {
            introOpen.current = true;
            setActive((current) => (current === null ? 0 : current));
          }, 1100),
          window.setTimeout(() => {
            if (!introOpen.current) return;
            introOpen.current = false;
            setActive((current) => (current === 0 ? null : current));
            setClosing(0);
          }, 1100 + 600 + 3000),
          window.setTimeout(() => setClosing(null), 1100 + 600 + 3000 + 1500),
        );
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  /* Pointer takes precedence over the intro: hovering any tile ends it. */
  const choose = (i: number | null) => {
    introOpen.current = false;
    setClosing(null);
    setActive(i);
  };


  return (
    <section
      className={`section section--lead section--wash section--wash-right works${pinned ? ' is-pinned' : ''}`}
      id="our-works"
      data-nav-tone="dark"
      ref={sectionRef}
      style={pinned ? ({ '--travel': `${distance}px` } as React.CSSProperties) : undefined}
    >
      <div className="wrap centered centered--release">
        <Reveal as="p" className="label works__eyebrow">
          {works.heading}
        </Reveal>

        <Reveal delay={70}>
          <h2 className="h2 works__title measure-title">{works.lead}</h2>
        </Reveal>

        <Reveal delay={120}>
          <div
            className="works__carousel"
            ref={carouselRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Representative transactions"
          >
            <div
              className="works__viewport"
              ref={emblaRef}
              onPointerDown={onDragStart}
              onPointerMove={onDragMove}
              onPointerUp={onDragEnd}
              onPointerCancel={onDragEnd}
              onClickCapture={(e) => {
                /* A drag is not a click: don't open the tile it ended on. */
                if (dragged.current) {
                  e.stopPropagation();
                  dragged.current = false;
                }
              }}
              onKeyDown={(e) => {
                /* With a tile focused, the arrow keys move the rail. */
                const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
                if (!step) return;
                e.preventDefault();
                if (pinned) {
                  const tiles = [...(trackRef.current?.querySelectorAll('.works__tile') ?? [])];
                  const i = tiles.indexOf(document.activeElement as Element);
                  const next = Math.min(tiles.length - 1, Math.max(0, i + step));
                  (tiles[next] as HTMLElement | undefined)?.focus({ preventScroll: true });
                } else if (step > 0) embla?.scrollNext();
                else embla?.scrollPrev();
              }}
            >
              {/* The slides are groups of the carousel (not list items), as
                  the carousel pattern has them. */}
              <div className="works__track" ref={trackRef} onMouseLeave={() => choose(null)}>
                {works.transactions.map((t, i) => (
                  <div
                    className="works__slide"
                    key={t.description}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${works.transactions.length}`}
                    style={{ '--i': i } as React.CSSProperties}
                  >
                    <div
                      className={`works__tile${t.image ? ' has-image' : ''}${i === active ? ' is-active' : ''}${i === closing ? ' is-closing' : ''}`}
                      style={
                        t.image ? ({ '--tile-image': `url(${t.image})` } as React.CSSProperties) : undefined
                      }
                      tabIndex={0}
                      onMouseEnter={() => choose(i)}
                      onFocus={(e) => {
                        choose(i);
                        if (pinned) {
                          /* Only keyboard focus moves the rail; a pointer
                             pressing on a tile (to drag, say) leaves it. */
                          if (!e.currentTarget.matches(':focus-visible')) return;
                          /* Undo the browser's own scroll of the clipped
                             rail and scroll the page to the tile instead. */
                          const view = trackRef.current?.parentElement;
                          if (view) view.scrollLeft = 0;
                          showPinned(i);
                          return;
                        }
                        /* The browser scrolls a focused tile into view by
                           scrolling the clipped viewport itself, behind the
                           carousel's back; undo that and let the carousel
                           bring the tile's snap into place instead. */
                        if (!embla) return;
                        embla.rootNode().scrollLeft = 0;
                        const snap = embla
                          .internalEngine()
                          .slideRegistry.findIndex((group) => group.includes(i));
                        if (snap >= 0) embla.scrollTo(snap);
                      }}
                      onBlur={() => choose(null)}
                      onClick={() => choose(i)}
                    >
                      {/* The accent that rises from the foot of the tile under
                          the pointer. A real element rather than a pseudo, as
                          both pseudos are the legibility scrims. */}
                      {/* The photograph on its own layer, so it can push in
                          under the pointer without resizing the tile. */}
                      <span className="works__photo" aria-hidden="true" />
                      <span className="works__glow" aria-hidden="true" />

                      <div className="works__top">
                        <p className="works__industry">{t.segment}</p>
                      </div>

                      {/* The foot: the figure, the deal type beneath it, and
                          the description, which opens below them and lifts
                          them as it does. */}
                      <div className="works__foot">
                        {/* The figure large and its unit smaller beside it,
                            on one baseline: "$365" then "million". */}
                        <p className="works__amount">
                          <CountUp value={t.amount.split(' ')[0]} duration={1600} />
                          {t.amount.includes(' ') && (
                            <span className="works__unit"> {t.amount.split(' ').slice(1).join(' ')}</span>
                          )}
                        </p>
                        <p className="works__solution">{t.solution}</p>
                        <div className="works__detail">
                          <div className="works__detail-inner">
                            <p className="works__description">{t.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}
