import { useEffect, useRef } from 'react';
import { founder } from '../content/content';
import Reveal from '../components/Reveal';
import './Founder.css';

/**
 * The founder's conviction, set as a composition rather than a quote block:
 * the label, then the quotation in two levels — the anchor line large, and
 * the rest as one paragraph running the width beneath it — with a faint
 * oversized quotation mark behind the words, and the attribution beneath
 * with the founder's portrait. The full approved quotation is in
 * content.ts; the two parts read as it, word for word.
 */
export default function Founder() {
  /* Each ring's line opens at the top around its name: the angle of the
     opening is measured from the name's width and the ring's radius, and
     kept up to date as the rings resize. */
  const ringsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = ringsRef.current;
    if (!box || !('ResizeObserver' in window)) return;
    const measure = () => {
      box.querySelectorAll<HTMLElement>('.founder__ring').forEach((ring) => {
        const name = ring.querySelector<HTMLElement>('.founder__ring-name');
        const r = ring.offsetWidth / 2;
        if (!name || !r) return;
        const half = name.offsetWidth / 2 + 8;
        const angle = (2 * Math.asin(Math.min(1, half / r)) * 180) / Math.PI;
        ring.style.setProperty('--gap', `${angle.toFixed(2)}deg`);
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section section--wash section--wash-right founder" id="founder">
      <div className="wrap founder__grid">
        <div className="founder__text">
        <Reveal as="p" className="label founder__eyebrow">
          {founder.eyebrow}
        </Reveal>

        <figure className="founder__body">
          <span className="founder__mark" aria-hidden="true">
            “
          </span>

          <blockquote className="founder__quote" cite={founder.name}>
            <Reveal as="p" delay={80} className="founder__lead">
              {founder.quoteLead}
            </Reveal>

            <Reveal as="p" delay={160} className="founder__thought">
              {founder.quoteBody}
            </Reveal>
          </blockquote>

          {/* The attribution. */}
          <Reveal delay={280} className="founder__foot">
            <figcaption className="founder__attribution">
              <img
                className="founder__photo"
                src={founder.photo}
                srcSet={`${founder.photo} 1x, ${founder.photo2x} 2x`}
                alt={founder.name}
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="founder__name">{founder.name}</p>
                <p className="mono mono--accent founder__title">{founder.title}</p>
              </div>
            </figcaption>

          </Reveal>
        </figure>
        </div>

        {/* The statement drawn: four fine rings closing in on the logo's
            mark — structure, partnership, judgement, and trust at the core.
            They draw themselves in from the outside when revealed. */}
        <Reveal delay={200} className="founder__figure">
          <div className="founder__rings" ref={ringsRef} role="img" aria-label={`At the core: ${founder.rings.join(', ')}`}>
            {founder.rings.map((ring, i) => (
              <div
                key={ring}
                className="founder__ring"
                style={{ '--i': i, '--n': founder.rings.length } as React.CSSProperties}
                aria-hidden="true"
              >
                <span className="founder__ring-name">{ring}</span>
              </div>
            ))}
            <span className="founder__core" aria-hidden="true">
              <span className="founder__core-back" />
              <span className="founder__core-front" />
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
