import { metrics } from '../../content/content';
import CountUp from '../CountUp';
import Reveal from '../Reveal';
import './stats-bold.css';

/**
 * The proof points, set in the About section beside its statement: $2B on
 * a dark panel with an accent glow rising through it, and the supporting
 * figures as tiles on the soft grey. Every figure counts up the first time
 * it scrolls into view, its suffix in the accent. It was a section of its
 * own ("Experience demonstrated through scale") until the client asked for
 * the experience to read as evidence for About (feedback, Oct 2026).
 *
 * Ported from a shadcn/Tailwind snippet ("BoldStats") to plain CSS on the
 * site's tokens; the shadcn-style path is kept so it sits where such
 * components are expected.
 */
export function BoldStats() {
  const { lead, supporting } = metrics;

  return (
    <div className="stats-bold stats-bold__body">
      <Reveal delay={120} className="stats-bold__lead">
        <p className="stats-bold__value">
          <CountUp value={lead.value} duration={6000} fromMillions />
        </p>
        <div className="stats-bold__caption">
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
  );
}

export default BoldStats;
