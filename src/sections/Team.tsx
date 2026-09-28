import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { team } from '../content/content';
import Reveal from '../components/Reveal';
import './Team.css';

type Member = (typeof team.members)[number];

/**
 * Leadership first. The members with an approved designation (the Managing
 * Partner and the Senior Advisor) lead the section as feature cards, their
 * credentials in full beside the portrait — nothing to click to learn who
 * leads the firm. The rest of the team follows in a single row of
 * portraits, names beneath; each opens the member's profile in a panel
 * (from the right on larger screens, from the foot of the screen on
 * phones), where the arrow keys move through the team.
 *
 * `title` is populated only where a designation has been approved, and it
 * is what places a member among the leaders: profiles without one join the
 * team row rather than inventing a placeholder.
 */
export default function Team() {
  const leaders = team.members.filter((m) => m.title);
  const others = team.members.filter((m) => !m.title);

  /* The member open in the panel (an index into `others`), and whether the
     panel is on its way out (so it can animate before it unmounts). */
  const [open, setOpen] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const closeTimer = useRef(0);

  const close = useCallback(() => {
    if (open === null || closing) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      /* Back to the portrait that opened it, for keyboard users. */
      triggers.current[open]?.focus({ preventScroll: true });
      setOpen(null);
      setClosing(false);
    }, 320);
  }, [open, closing]);

  const step = useCallback(
    (by: number) => setOpen((i) => (i === null ? i : (i + by + others.length) % others.length)),
    [others.length],
  );

  /* While open: Escape closes, the arrow keys move through the team, and
     the page behind is held still. */
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, step]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  /* The team's cards turn over to show the profile on their reverse — one
     at a time. On phones, where the cards are too small to hold it, the
     profile opens in the sheet (the panel) instead. */
  const [flipped, setFlipped] = useState<number | null>(null);
  const closeButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const isPhone = () => window.matchMedia('(max-width: 767px)').matches;

  const view = (i: number) => {
    if (isPhone()) {
      setOpen(i);
      return;
    }
    setFlipped(i);
    /* Focus the reverse's close button once the card has begun to turn. */
    window.setTimeout(() => closeButtons.current[i]?.focus({ preventScroll: true }), 60);
  };

  const unflip = (i: number) => {
    setFlipped(null);
    window.setTimeout(() => triggers.current[i]?.focus({ preventScroll: true }), 60);
  };

  /* Escape turns the open card back. */
  useEffect(() => {
    if (flipped === null) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && unflip(flipped);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped]);

  /* The leaders' entrance: as the cards come into view each portrait,
     starting over the text, sweeps from right to left into its place and the
     profile is revealed behind it (see Team.css). The cards are set back
     (`armed`) only here, so without scripts — or under reduced motion — they
     simply show. Then the first leader's portrait shows in colour for two
     seconds and settles to black and white with the rest — a hint that the
     portraits come into colour. Once. */
  const leadersRef = useRef<HTMLUListElement>(null);
  const [armed, setArmed] = useState(false);
  const [swiped, setSwiped] = useState(false);
  const [intro, setIntro] = useState(false);
  useEffect(() => {
    const list = leadersRef.current;
    if (!list || !('IntersectionObserver' in window)) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) setArmed(true);
    const timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setSwiped(true);
        /* The colour follows once the portraits have settled (~1.3s): ~0.9s
           to rise, held in full colour for two seconds, then back down. */
        const settle = reduced ? 0 : 1300;
        timers.push(
          window.setTimeout(() => setIntro(true), settle),
          window.setTimeout(() => setIntro(false), settle + 2900),
        );
      },
      { threshold: 0.35 },
    );
    observer.observe(list);
    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const member = open === null ? null : others[open];

  return (
    <section className="section section--quiet section--wash section--wash-left team" id="team">
      <div className="wrap centered centered--release">
        <Reveal as="p" className="label team__eyebrow">
          {team.heading}
        </Reveal>

        <Reveal delay={70}>
          <h2 className="h2 team__lead measure-title">{team.lead}</h2>
        </Reveal>

        {/* The intro's class sits on the list, not the card: the card's own
            class carries the reveal's `is-visible`, set outside React. */}
        <ul
          className={`team__leaders${armed ? ' is-armed' : ''}${swiped ? ' is-swiped' : ''}${intro ? ' is-intro' : ''}`}
          ref={leadersRef}
        >
          {leaders.map((m, i) => (
            <Reveal as="li" key={m.name} delay={100 + i * 80} className="team__leader">
              <WashPortrait member={m} className="team__leader-photo" />
              <div className="team__leader-body">
                <h3 className="team__name">{m.name}</h3>
                <p className="mono mono--accent team__title">{m.title}</p>
                <div className="team__rule" />
                <Credentials member={m} />
                <LinkedIn member={m} />
              </div>
            </Reveal>
          ))}
        </ul>

        <ul className="team__grid">
          {others.map((m, i) => (
            <Reveal as="li" key={m.name} delay={80 + i * 45} className="team__member">
              <div className={`team__flip${flipped === i ? ' is-flipped' : ''}`}>
                <div className="team__face team__face--front" inert={flipped === i}>
                  <button
                    type="button"
                    className="team__member-button"
                    ref={(el) => {
                      triggers.current[i] = el;
                    }}
                    aria-expanded={flipped === i}
                    aria-controls={`team-back-${i}`}
                    aria-label={`${m.name} — view profile`}
                    onClick={() => view(i)}
                  >
                    <span className="team__member-photo">
                      <WashPortrait member={m} />
                      <span className="team__member-cue" aria-hidden="true">
                        View profile
                      </span>
                    </span>
                    <span className="team__member-name">{m.name}</span>
                    {/* The first line of the profile, as a one-line introduction. */}
                    <span className="team__member-line">{m.credentials[0]}</span>
                  </button>
                </div>

                {/* The reverse: the profile in full. */}
                <div
                  className="team__face team__face--back"
                  id={`team-back-${i}`}
                  inert={flipped !== i}
                  aria-label={`${m.name} — profile`}
                  role="region"
                >
                  <button
                    type="button"
                    className="team__back-close"
                    aria-label={`Close ${m.name}'s profile`}
                    ref={(el) => {
                      closeButtons.current[i] = el;
                    }}
                    onClick={() => unflip(i)}
                  >
                    ×
                  </button>
                  {/* The member in colour, small, so the face stays in view
                      with the card turned. */}
                  <img
                    className="team__back-photo"
                    src={m.photo}
                    srcSet={`${m.photo} 1x, ${m.photo2x} 2x`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <h3 className="team__name">{m.name}</h3>
                  <Credentials member={m} />
                  <LinkedIn member={m} />
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* On the page's top layer (a portal to <body>), so no section's
          stacking — nor the nav — can show through it. */}
      {member ? createPortal(
        <div
          className={`team__panel${closing ? ' is-closing' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-panel-name"
        >
          <button type="button" className="team__panel-backdrop" aria-label="Close" tabIndex={-1} onClick={close} />
          <div className="team__panel-sheet">
            <button type="button" className="team__panel-close" aria-label="Close profile" onClick={close} autoFocus>
              ×
            </button>

            {/* Keyed by member, so moving through the team replays the
                panel's content entrance. */}
            <div className="team__panel-content" key={member.name}>
              <Portrait member={member} className="team__panel-photo" eager />
              <h3 className="team__name team__panel-name" id="team-panel-name">
                {member.name}
              </h3>
              <div className="team__rule" />
              <Credentials member={member} />
              <LinkedIn member={member} />
            </div>
          </div>
        </div>,
        document.body,
      ) : null}
    </section>
  );
}

function Portrait({ member, className = '', eager = false }: { member: Member; className?: string; eager?: boolean }) {
  return (
    <img
      className={`team__photo ${className}`.trim()}
      src={member.photo}
      srcSet={`${member.photo} 1x, ${member.photo2x} 2x`}
      alt={member.name}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

/**
 * A card's portrait: the black-and-white photograph, with the colour one
 * laid over it and wiped up from the foot — under the pointer, and for the
 * first leader's intro — rather than the whole image simply fading.
 */
function WashPortrait({ member, className = '' }: { member: Member; className?: string }) {
  return (
    <span className={`team__wash ${className}`.trim()}>
      <Portrait member={member} />
      <img
        className="team__photo team__photo--colour"
        src={member.photo}
        srcSet={`${member.photo} 1x, ${member.photo2x} 2x`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

function Credentials({ member }: { member: Member }) {
  return (
    <ul className="team__credentials">
      {member.credentials.map((c) => (
        <li key={c}>{c}</li>
      ))}
    </ul>
  );
}

function LinkedIn({ member }: { member: Member }) {
  if (!member.linkedin) return null;
  return (
    <a
      className="mono team__linkedin"
      href={member.linkedin}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`${member.name} on LinkedIn`}
    >
      LinkedIn
    </a>
  );
}
