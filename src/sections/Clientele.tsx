import { useEffect, useRef, useState } from 'react';
import { clientele } from '../content/content';
import Reveal from '../components/Reveal';
import { logoHeight } from '../lib/logo';
import './Clientele.css';


/* Wordmarks this wide take a double cell. With the current 17 clients
   that is 7 wide and 10 compact — 24 cells, which fills 6, 4 and 3 columns
   exactly, so the grid has no gaps at any width. */
const WIDE = 2.8;

/**
 * The sector index. The headline claims "across sectors"; this shows it.
 * The sectors are listed with their client counts, beside a still grid of
 * every client's logo in soft grey. Pointing at a logo brings it into
 * colour; pointing at a sector (or focusing it, or tapping it) brings all
 * its clients into colour and eases the rest back; leaving it — or tapping it again on touch — shows everyone again.
 */
export default function Clientele() {
  const { sectors, clients } = clientele;
  /* null: every client shown in full; a number: that sector is chosen. */
  const [active, setActive] = useState<number | null>(null);

  /* A pointer or focus chooses a sector and leaving clears it. A tap has no
     leave, so tapping the chosen sector again clears it instead. */
  const isTouch = () => window.matchMedia('(hover: none)').matches;
  const choose = (i: number) => setActive(i);
  const clear = () => setActive(null);

  const lit = active === null ? null : new Set<string>(sectors[active].clients);

  /* The last row's closing pair (see Clientele.css) is centred under the
     wide column by shifting it half the difference in the two marks'
     widths — measured, since the widths depend on the cell size. */
  const logosRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const grid = logosRef.current;
    if (!grid || !('ResizeObserver' in window)) return;
    const measure = () => {
      const imgs = [...grid.querySelectorAll('img')].slice(-2);
      if (imgs.length < 2) return;
      const [a, b] = imgs.map((img) => img.getBoundingClientRect().width);
      grid.style.setProperty('--pair-shift', `${(a - b) / 2}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    grid.querySelectorAll('img').forEach((img) => img.addEventListener('load', measure));
    return () => observer.disconnect();
  }, []);


  /* On phones the sectors are a sideways row of chips: keep the leading
     one in view as the cycle moves on (the row scrolls, not the page). */
  const chipsRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const row = chipsRef.current;
    if (!row || active === null || row.scrollWidth <= row.clientWidth) return;
    const chip = row.children[active] as HTMLElement | undefined;
    if (!chip) return;
    row.scrollTo({ left: chip.offsetLeft - row.clientWidth / 2 + chip.offsetWidth / 2, behavior: 'smooth' });
  }, [active]);

  return (
    <section
      className="section section--panel section--quiet section--wash section--wash-centre clientele"
      id="clientele"
    >
      <div className="wrap">
        <Reveal as="p" className="label clientele__eyebrow">
          {clientele.heading}
        </Reveal>

        <Reveal delay={70}>
          <h2 className="h2 clientele__lead">{clientele.lead}</h2>
        </Reveal>

        <Reveal delay={120}>
          <div
            className="clientele__index"
            onMouseLeave={() => {
              if (!isTouch()) clear();
            }}
          >
            <ul className="clientele__sectors" aria-label="Sectors" ref={chipsRef}>
              {sectors.map((sector, i) => (
                <li key={sector.name}>
                  <button
                    type="button"
                    className={`clientele__sector${i === active ? ' is-active' : ''}`}
                    aria-pressed={i === active}
                    onMouseEnter={() => {
                      if (!isTouch()) choose(i);
                    }}
                    onFocus={(e) => {
                      /* Keyboard focus chooses; a tap's focus is left to
                         the tap, which toggles. */
                      if (e.currentTarget.matches(':focus-visible')) choose(i);
                    }}
                    onBlur={clear}
                    onClick={() => (isTouch() && active === i ? clear() : choose(i))}
                  >
                    <span className="clientele__sector-name">{sector.name}</span>
                    <span className="clientele__sector-count">
                      {String(sector.clients.length).padStart(2, '0')}
                    </span>
                    <span className="clientele__sector-rule" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>

            <ul className="clientele__logos" aria-label={clientele.heading} ref={logosRef}>
              {clients.map((client, i) => {
                const h = logoHeight(client.ratio, client.scale);
                return (
                  <li
                    key={client.name}
                    className={`clientele__logo${client.ratio >= WIDE ? ' is-wide' : ''}${lit ? (lit.has(client.name) ? ' is-lit' : ' is-dim') : ''}`}
                    /* Entrance order, last first: the logos rise in a wave
                       from the foot of the grid to its head. */
                    style={{ '--rise': clients.length - 1 - i } as React.CSSProperties}
                  >
                    <img
                      src={client.logo}
                      alt={client.name}
                      loading="lazy"
                      decoding="async"
                      width={Math.round(h * client.ratio)}
                      height={Math.round(h)}
                      style={
                        {
                          '--logo-h': h.toFixed(1),
                          '--logo-ratio': client.ratio,
                        } as React.CSSProperties
                      }
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
