import { useState } from 'react';
import { expertise } from '../content/content';
import Reveal from '../components/Reveal';
import './Expertise.css';

/**
 * Six capabilities as expanding panels. On desktop they stand side by side:
 * closed, a panel shows its number with its title running up the side; the
 * open one widens to four times the others, turns to the dark ground with
 * the accent glow rising through it, and shows its title and description.
 * Below desktop the panels stack as rows and the open one expands downward.
 *
 * One panel is always open — the first on arrival — and the pointer, focus
 * or a tap opens another. When the panels arrive, a soft band of light
 * rises once through the closed ones in a left-to-right wave, as a cue that
 * each can be opened.
 * Each panel's header is a real button with `aria-expanded`, so the set
 * works as an accordion from the keyboard and for assistive technology.
 */
export default function Expertise() {
  const [open, setOpen] = useState(0);
  /* Once the reader has opened a panel, the arrival sweep has done its job;
     `is-settled` stops it replaying on a panel that closes again. */
  const [settled, setSettled] = useState(false);
  const choose = (i: number) => {
    setOpen(i);
    if (i !== open) setSettled(true);
  };

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

        <Reveal delay={180}>
          <ul className={`expertise__panels${settled ? ' is-settled' : ''}`}>
            {expertise.capabilities.map((cap, i) => {
              const isOpen = i === open;
              const detailId = `expertise-detail-${cap.number}`;
              return (
                <li
                  key={cap.number}
                  className={`expertise__panel${isOpen ? ' is-open' : ''}`}
                  style={{ '--i': i } as React.CSSProperties}
                  onMouseEnter={() => choose(i)}
                >
                  <h3 className="expertise__heading">
                    <button
                      type="button"
                      className="expertise__trigger"
                      aria-expanded={isOpen}
                      aria-controls={detailId}
                      onClick={() => choose(i)}
                      onFocus={() => choose(i)}
                    >
                      <span className="expertise__number">{cap.number}</span>
                      <span className="expertise__spine">{cap.title}</span>
                    </button>
                  </h3>

                  <div className="expertise__detail" id={detailId}>
                    <div className="expertise__detail-inner">
                      {/* The title again, set across the open panel on
                          desktop; the heading above already names it. */}
                      <p className="expertise__title" aria-hidden="true">
                        {cap.title}
                      </p>
                      <p className="expertise__body">{cap.description}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
