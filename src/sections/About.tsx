import { about } from '../content/content';
import Reveal from '../components/Reveal';
import './About.css';

/**
 * The page's opening statement, on the same pattern as every section after
 * it — label, headline, supporting copy, one left edge — so the page reads
 * as one system from the first section on.
 *
 * Beside the copy on desktop (beneath it on mobile), a growth figure: the
 * stages the copy names, as four bars stepping up in the accent, capped by
 * the logo's two-square mark. It is the logo's own gesture — squares
 * stepping up and to the right — drawn out as the client's journey.
 */
export default function About() {
  return (
    <section className="section section--panel section--lead section--wash section--wash-left about" id="about">
      <div className="wrap about__grid">
        <div className="about__text">
          <Reveal as="p" className="label about__label">
            {about.heading}
          </Reveal>

          <Reveal delay={60}>
            <h2 className="h2 about__statement">{about.statement}</h2>
          </Reveal>

          <div className="about__copy">
            {about.body.map((paragraph, i) => (
              <Reveal as="p" key={paragraph} delay={120 + i * 60} className="support about__paragraph">
                {paragraph}
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={180} className="about__figure">
          <ol className="about__steps" aria-label="From requirement to growth">
            {about.stages.map((stage, i) => (
              <li
                key={stage}
                className="about__step"
                style={{ '--i': i } as React.CSSProperties}
              >
                <span className="about__bar" aria-hidden="true">
                  {i === about.stages.length - 1 && (
                    <span className="about__mark">
                      <span className="about__mark-back" />
                      <span className="about__mark-front" />
                    </span>
                  )}
                </span>
                <span className="about__stage">
                  <span className="mono mono--figure about__stage-number" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {stage}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
