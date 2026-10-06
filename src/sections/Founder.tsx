import { useEffect, useRef } from 'react';
import { founder } from '../content/content';
import Reveal from '../components/Reveal';
import './Founder.css';

/**
 * The founder's word, following the Leadership Team on a white band of its
 * own — no label, no portrait, no graphic
 * (client feedback, Sep and Oct 2026). Set as an epigraph: the opening
 * quotation mark, the quotation centred and spread wide, its first sentence
 * a shade firmer, and beneath a short rule with the name and title. The
 * full approved quotation is in content.ts; the two parts read as it, word
 * for word.
 *
 * The quotation is revealed by the reader's scroll as one sequence (Oct
 * 2026): the mark fades in as the quotation enters, the body after the first
 * sentence turns from grey to ink behind a soft edge some five words wide,
 * and as its last words land the rule draws out and the name and title rise
 * beneath it. It completes as the quotation's middle reaches the middle of
 * the screen, where the eye rests. It only moves forward: scrolling back up
 * leaves what has been revealed in place, and once complete it stays so.
 * Nothing is hidden for good: without script, or under reduced motion, it
 * is all shown at once in ink.
 */

/** Grey and ink, as RGB, for the colour each word is mixed between. */
const GREY = [170, 179, 186];
const INK = [20, 24, 29];
/** How many words the edge between ink and grey is spread across. */
const SOFT = 5;

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export default function Founder() {
  const bodyRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    const figure = body?.closest<HTMLElement>('.founder__body');
    if (!body || !figure || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const words = Array.from(body.querySelectorAll<HTMLElement>('.founder__word'));
    figure.classList.add('is-scrubbing');

    /* Starts as the body's top passes 92% down the screen; complete when
       its middle reaches the middle of the screen. */
    let frame = 0;
    /* The furthest the reveal has reached; it never goes back. */
    let reached = 0;
    const update = () => {
      frame = 0;
      const box = body.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.92;
      const end = vh * 0.5;
      const progress = Math.max(
        reached,
        clamp((start - box.top) / (start - end + box.height / 2)),
      );
      if (progress === reached && reached > 0) return;
      reached = progress;

      const front = progress * (words.length + SOFT);
      words.forEach((word, i) => {
        const t = clamp((front - i) / SOFT);
        word.style.color = `rgb(${GREY.map((g, j) => Math.round(g + (INK[j] - g) * t)).join(', ')})`;
      });

      figure.style.setProperty('--mark', String(clamp(progress / 0.18)));
      figure.style.setProperty('--rule', String(clamp((progress - 0.8) / 0.15)));
      figure.style.setProperty('--who', String(clamp((progress - 0.92) / 0.08)));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.cancelAnimationFrame(frame);
      figure.classList.remove('is-scrubbing');
      words.forEach((word) => word.style.removeProperty('color'));
    };
  }, []);

  return (
    <section className="section founder" id="founder">
      <div className="wrap">
        <Reveal as="figure" className="founder__body">
          <span className="founder__mark" aria-hidden="true">
            “
          </span>

          <blockquote className="founder__quote" cite={founder.name}>
            <p>
              <span className="founder__lead">{founder.quoteLead}</span>{' '}
              <span className="founder__rest" ref={bodyRef}>
                {founder.quoteBody.split(' ').map((word, i) => (
                  <span key={i} className="founder__word">
                    {i > 0 && ' '}
                    {word}
                  </span>
                ))}
              </span>
            </p>
          </blockquote>

          <figcaption className="founder__attribution">
            <p className="founder__name">{founder.name}</p>
            <p className="founder__title">{founder.title}</p>
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
