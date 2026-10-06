import { about } from '../content/content';
import Reveal from '../components/Reveal';
import BoldStats from '../components/ui/stats-bold';
import './About.css';

/**
 * The page's opening statement and the evidence for it: label, headline
 * and a short line of copy on the left, and in the right-hand half the
 * proof points — $2B on a dark panel, the four supporting figures two by
 * two beside it. The figures were a section of their own; folding them in turns
 * the experience into evidence rather than another section (client
 * feedback, Oct 2026). Below desktop the figures follow the copy.
 */
export default function About() {
  return (
    <section className="section section--lead about" id="about">
      <div className="wrap about__layout">
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

        <BoldStats />
      </div>
    </section>
  );
}
