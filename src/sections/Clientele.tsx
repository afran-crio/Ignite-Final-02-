import { clientele } from '../content/content';
import LogoCarousel from '../components/LogoCarousel';
import Reveal from '../components/Reveal';
import Testimonials from './Testimonials';
import './Clientele.css';

/**
 * The approved clients run on two rails travelling against each other — the
 * earlier treatment, restored in place of the sector index (client feedback,
 * Sep 2026). The list is dealt alternately into the two so each rail carries
 * a mix rather than one half of the list, and the lower rail starts half a
 * beat later so the pair never steps in lockstep. Beneath the rails, on the
 * same panel, what those clients say: the rotating testimonials.
 */
const upper = clientele.clients.filter((_, i) => i % 2 === 0);
const lower = clientele.clients.filter((_, i) => i % 2 === 1);

/* 1.5x the previous 2200ms cadence. */
const INTERVAL = 1467;

export default function Clientele() {
  return (
    <section
      className="section section--quiet clientele"
      id="clientele"
    >
      <div className="wrap">
        <Reveal as="p" className="label clientele__eyebrow">
          {clientele.heading}
        </Reveal>

        <Reveal delay={70}>
          <h2 className="h2 clientele__lead">{clientele.lead}</h2>
        </Reveal>
      </div>

      <Reveal delay={110} className="clientele__rails">
        <LogoCarousel
          items={upper}
          interval={INTERVAL}
          direction="forward"
          label={`${clientele.heading} — first rail`}
        />
        <LogoCarousel
          items={lower}
          interval={INTERVAL}
          direction="reverse"
          phase={INTERVAL / 2}
          label={`${clientele.heading} — second rail`}
        />
      </Reveal>

      <div className="wrap clientele__quotes">
        <Testimonials />
      </div>
    </section>
  );
}
