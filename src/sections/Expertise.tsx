import { useState } from 'react';
import { expertise } from '../content/content';
import Reveal from '../components/Reveal';
import './Expertise.css';

/**
 * Six capabilities in About's block format: on the left the dark panel with
 * the accent glow rising through it — as the $2 Bn panel is — showing one
 * capability's title and description; on the right all six as grey tiles,
 * two by three, the chosen one set on white in an accent ring that traces
 * round it as it is chosen (Oct 2026). A tile is chosen by clicking or
 * tapping it (or Enter / Space from the keyboard) and stays chosen until
 * another is: the pointer passing over the grid does not move the choice.
 *
 * The tiles are toggle buttons for the panel, which is announced politely
 * as it changes.
 */
export default function Expertise() {
  const [active, setActive] = useState(0);
  const cap = expertise.capabilities[active];

  return (
    <section className="section section--deep expertise" id="expertise">
      <div className="wrap">
        <Reveal as="p" className="label expertise__eyebrow">
          {expertise.heading}
        </Reveal>

        <Reveal delay={70}>
          <h2 className="h2 expertise__headline">{expertise.headline}</h2>
        </Reveal>

        <Reveal delay={130}>
          <p className="support expertise__lead">{expertise.lead}</p>
        </Reveal>

        <Reveal delay={180} className="expertise__body-grid">
          <div className="expertise__panel" id="expertise-panel" aria-live="polite">
            {/* Keyed on the capability, so each arrives with a fade. */}
            <div className="expertise__panel-text" key={cap.number}>
              <h3 className="expertise__panel-title">{cap.title}</h3>
              <p className="expertise__panel-body">{cap.description}</p>
            </div>
          </div>

          <ul className="expertise__tiles">
            {expertise.capabilities.map((c, i) => (
              <li key={c.number}>
                <button
                  type="button"
                  className={`expertise__tile${i === active ? ' is-active' : ''}`}
                  aria-pressed={i === active}
                  aria-controls="expertise-panel"
                  onClick={() => setActive(i)}
                >
                  {c.title}
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
