import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { team } from '../content/content';
import Reveal from '../components/Reveal';
import LinkedInIcon from '../components/LinkedInIcon';
import './Team.css';

type Member = (typeof team.members)[number];

/**
 * The whole team in one grid of portrait cards, one style for everyone —
 * the members with an approved designation (the Managing Partner and the
 * Senior Advisor) first, their title in place of the one-line introduction.
 * Each card turns over to show the full profile; below 1280px, where the
 * cards are too narrow for it, the profile opens in a panel instead (from
 * the right on tablets and small laptops, from the foot of the screen on
 * phones), where the arrow keys move through the team.
 *
 * `title` is populated only where a designation has been approved; profiles
 * without one show the first line of their credentials rather than a
 * placeholder.
 */
export default function Team() {
  const members = [...team.members].sort((a, b) => Number(!!b.title) - Number(!!a.title));

  /* The member open in the panel (an index into `members`), and whether the
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
    (by: number) => setOpen((i) => (i === null ? i : (i + by + members.length) % members.length)),
    [members.length],
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
     at a time. Below 1280px, where the cards are too narrow to hold it,
     the profile opens in the panel instead. */
  const [flipped, setFlipped] = useState<number | null>(null);
  const closeButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const isNarrow = () => window.matchMedia('(max-width: 1279px)').matches;

  const view = (i: number) => {
    if (isNarrow()) {
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

  /* As the cards come into view, the first card lifts and its portrait
     shows in colour for two seconds, then settles back with the rest — a
     hint of what the cards do under the pointer. Once. */
  const gridRef = useRef<HTMLUListElement>(null);

  /* On wide screens the intro is held in view beside the portraits and
     comes to rest with its top level with the third row's. Its wrapper is
     sized to end exactly there — from its own top to the third row's top,
     plus the intro's height — and re-measured whenever the layout moves. */
  const introRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = gridRef.current;
    const intro = introRef.current;
    if (!grid || !intro || !('ResizeObserver' in window)) return;
    const wide = window.matchMedia('(min-width: 1280px)');
    const fit = () => {
      /* The third row's portrait itself, not its card: the card has
         padding, and the heading should land level with the photograph. */
      const third = grid.children[6]?.querySelector<HTMLElement>('.team__member-photo') ?? undefined;
      const text = intro.firstElementChild as HTMLElement | null;
      if (!wide.matches || !third || !text) {
        intro.style.height = '';
        return;
      }
      /* The intro stops when its foot meets the wrapper's, so the wrapper
         ends one intro-height below the third row's portrait: it comes to
         rest level with Krishnendu's and Nikhil's photographs. */
      /* Layout positions (offsetTop), not on-screen ones: a card that has
         not yet revealed is drawn lower by its entrance transform. */
      const pageTop = (el: HTMLElement) => {
        let y = 0;
        for (let e: HTMLElement | null = el; e; e = e.offsetParent as HTMLElement | null) y += e.offsetTop;
        return y;
      };
      const rest = pageTop(third) - pageTop(intro);
      intro.style.height = `${Math.round(rest + text.offsetHeight)}px`;
    };
    fit();
    /* The grid's own size, and the page's (content above settling — fonts,
       photographs — moves the intro without resizing the grid). */
    const observer = new ResizeObserver(fit);
    observer.observe(grid);
    observer.observe(document.body);
    wide.addEventListener('change', fit);
    window.addEventListener('load', fit);
    return () => {
      observer.disconnect();
      wide.removeEventListener('change', fit);
      window.removeEventListener('load', fit);
    };
  }, []);
  const [intro, setIntro] = useState(false);
  useEffect(() => {
    const list = gridRef.current;
    if (!list || !('IntersectionObserver' in window)) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        /* The colour follows once the cards have revealed (~0.8s): ~0.9s
           to rise, held in full colour for two seconds, then back down. */
        const settle = reduced ? 0 : 800;
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

  const member = open === null ? null : members[open];

  return (
    <section className="section section--quiet team" id="team">
      <div className="wrap centered centered--release">
        <Reveal as="p" className="label team__eyebrow">
          {team.heading}
        </Reveal>

        {/* A wrapper for the intro: on wide screens it is sized (above) so
            the intro, held in view inside it, comes to rest level with the
            third row. */}
        <div className="team__intro" ref={introRef}>
          <Reveal delay={70} className="team__intro-text">
            <h2 className="h2 team__lead measure-title">{team.lead}</h2>
          </Reveal>
        </div>

        {/* The intro's class sits on the list, not the card: the card's own
            class carries the reveal's `is-visible`, set outside React. */}
        <ul className={`team__grid${intro ? ' is-intro' : ''}`} ref={gridRef}>
          {members.map((m, i) => (
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
                    </span>
                    <span className="team__member-name">{m.name}</span>
                    {/* The designation where there is one; otherwise the first
                        line of the profile, as a one-line introduction. */}
                    {m.title ? (
                      <span className="team__member-line team__member-line--title">{m.title}</span>
                    ) : (
                      <span className="team__member-line">{m.credentials[0]}</span>
                    )}
                    {/* The quiet, always-visible invitation; the button's own
                        label already says it to assistive technology. */}
                    <span className="team__member-more" aria-hidden="true">
                      View profile
                    </span>
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
                  {m.title ? <p className="mono team__back-title">{m.title}</p> : null}
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
              {member.title ? <p className="mono mono--accent team__title">{member.title}</p> : null}
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
    <span
      className={`team__wash ${className}`.trim()}
      style={{ '--frame': member.frame } as React.CSSProperties}
    >
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
      <LinkedInIcon className="team__linkedin-icon" />
      <span className="team__linkedin-label">LinkedIn</span>
    </a>
  );
}
