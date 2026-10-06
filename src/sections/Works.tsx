import { useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { works } from '../content/content';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';
import './Works.css';

/**
 * Transactions as a rail of blocks the reader moves themselves: a
 * two-finger sideways swipe on a trackpad, a drag, or a swipe on a phone;
 * from the keyboard, the arrow keys with a tile focused. There are no
 * arrow buttons (Oct 2026). Three and a bit sit on screen at once, so the next one is
 * always visibly waiting rather than hidden. The page scroll no longer
 * drives the rail (client feedback, Sep 2026): the section scrolls past like
 * any other.
 *
 * The rail does not loop and does not advance on its own: this is a list of
 * record, ordered by deal value, and the reader should be able to reach the
 * end of it and know that is the end.
 *
 * A tile at rest shows only the sector and the amount over its photograph.
 * The active tile also shows the mandate's solution and description, risen
 * into view on an accent glow. When the rail first scrolls into view the
 * first tile opens on its own, holds for three seconds, and closes again —
 * a one-time demonstration of what the tiles do. After that a tile is active
 * only under the pointer (or keyboard focus, or when tapped), and none is
 * when the pointer leaves the rail.
 */
/**
 * The tile's photograph, as CSS custom properties: the JPEG as named in
 * content.ts, and — for a .jpg — the AVIF and WebP made beside it (in
 * public/media/works/), which browsers that read a typed image-set take
 * instead, at around half the weight (Oct 2026). See .works__photo.
 */
function tileImage(src: string) {
  const vars: Record<string, string> = { '--tile-image': `url(${src})` };
  if (/\.jpg$/i.test(src)) {
    const base = src.replace(/\.jpg$/i, '');
    vars['--tile-set'] =
      `image-set(url(${base}.avif) type("image/avif"), url(${base}.webp) type("image/webp"), url(${src}) type("image/jpeg"))`;
  }
  return vars;
}

export default function Works() {
  /* A two-finger sideways swipe on a trackpad (or shift + wheel) moves the
     rail; an up-and-down scroll still scrolls the page. */
  const [emblaRef, embla] = useEmblaCarousel(
    { loop: false, align: 'start', containScroll: 'trimSnaps' },
    [WheelGesturesPlugin()],
  );

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
      className="section section--lead works"
      id="our-works"
      data-nav-tone="dark"
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
              onKeyDown={(e) => {
                /* With a tile focused, the arrow keys move the rail. */
                const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
                if (!step) return;
                e.preventDefault();
                if (step > 0) embla?.scrollNext();
                else embla?.scrollPrev();
              }}
            >
              {/* The slides are groups of the carousel (not list items), as
                  the carousel pattern has them. */}
              <div className="works__track" onMouseLeave={() => choose(null)}>
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
                      style={t.image ? (tileImage(t.image) as React.CSSProperties) : undefined}
                      tabIndex={0}
                      onMouseEnter={() => choose(i)}
                      onFocus={() => {
                        choose(i);
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
                            on one baseline: "$365" then "Mn". */}
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
