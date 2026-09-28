import { metrics } from '../../content/content';
import CountUp from '../CountUp';
import Reveal from '../Reveal';
import './stats-bold.css';

/**
 * "Experience Demonstrated Through Scale" — label and headline like every
 * other section, then a bento on the grid: $2B on a dark panel in the first
 * six columns, the lead of the section, with an accent glow rising through
 * it; and the supporting figures as tiles, two by two, in the last six.
 * Every figure counts up the first time it scrolls into view, its suffix in
 * the accent.
 *
 * Ported from a shadcn/Tailwind snippet ("BoldStats") to plain CSS on the
 * site's tokens; the shadcn-style path is kept so it sits where such
 * components are expected.
 */
export function BoldStats() {
  const { label, heading, lead, supporting } = metrics;

  return (
    <section className="section section--deep section--lead section--wash section--wash-right stats-bold" id="metrics">
      <div className="wrap">
        <Reveal as="p" className="label stats-bold__eyebrow">
          {label}
        </Reveal>

        <Reveal delay={60}>
          <h2 className="h2 stats-bold__heading">{heading}</h2>
        </Reveal>

        <div className="stats-bold__body">
          <Reveal delay={120} className="stats-bold__lead">
            <p className="stats-bold__value">
              <CountUp value={lead.value} duration={6000} fromMillions />
            </p>
            <div>
              <h3 className="stats-bold__label">{lead.label}</h3>
              <p className="stats-bold__support">{lead.support}</p>
            </div>
          </Reveal>

          <ul className="stats-bold__tiles">
            {supporting.map((item, i) => (
              <Reveal as="li" key={item.value} delay={140 + i * 55} className="stats-bold__tile">
                <p className="stats-bold__item-value">
                  <CountUp value={item.value} />
                </p>
                <p className="stats-bold__item-label">{item.lines.join(' ')}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default BoldStats;
