import { useEffect, useRef, useState } from 'react';
import PageLink from './PageLink';
import SectionLink from './SectionLink';
import { contact, nav } from '../content/content';
import { site } from '../config/site';
import './Footer.css';

const mailto = `mailto:${site.email}?subject=${encodeURIComponent(contact.ctaSubject)}`;

export default function Footer() {
  const year = new Date().getFullYear();

  /* A click on the email opens the visitor's mail app, and also copies the
     address, with a brief "Copied" note — for visitors with no mail app set
     up, where the click would otherwise seem to do nothing. The link is
     left to open as usual. */
  const [copied, setCopied] = useState<'cta' | 'list' | null>(null);
  const copyTimer = useRef(0);
  const copyEmail = (where: 'cta' | 'list') => {
    navigator.clipboard
      ?.writeText(site.email)
      .then(() => {
        setCopied(where);
        window.clearTimeout(copyTimer.current);
        copyTimer.current = window.setTimeout(() => setCopied(null), 2200);
      })
      .catch(() => {});
  };
  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  /* Size and place the wordmark (see Footer.css and below). */
  const footerRef = useRef<HTMLElement>(null);

  /* The entrance: once the footer comes into view, the headline rises in
     word by word, the line and email beneath follow, and the wordmark's
     letters rise in turn (see Footer.css). The footer is armed — its
     parts set back — only here, so without scripts it simply shows. */
  const [armed, setArmed] = useState(false);
  const [inView, setInView] = useState(false);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setArmed(true);
    let settleTimer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setInView(true);
        io.disconnect();
        /* Once the letters have risen, they answer the pointer at once. */
        settleTimer = window.setTimeout(() => setSettled(true), 2400);
      },
      { threshold: 0.25 },
    );
    io.observe(footer);
    return () => {
      io.disconnect();
      window.clearTimeout(settleTimer);
    };
  }, []);

  /* Under the pointer (where there is one): each letter of the wordmark
     warms to the accent and lifts as the pointer nears it (--near, 0 → 1,
     falling off over ~420px; see Footer.css). */
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const letters = [...footer.querySelectorAll<HTMLElement>('.footer__letter')];
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        for (const l of letters) {
          const b = l.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (b.left + b.width / 2), (e.clientY - (b.top + b.height * 0.6)) * 0.6);
          l.style.setProperty('--near', Math.max(0, 1 - d / 420).toFixed(3));
        }
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      letters.forEach((l) => l.style.setProperty('--near', '0'));
    };
    footer.addEventListener('pointermove', onMove);
    footer.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      footer.removeEventListener('pointermove', onMove);
      footer.removeEventListener('pointerleave', onLeave);
    };
  }, []);
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer || !('ResizeObserver' in window)) return;
    /* The wordmark spans the grid, margin to margin, centred behind the
       footer's content; the footer is at least tall enough to show the
       word, its tallest ink (the i's dots) inside the top once the word
       is set down into the foot (see Footer.css). */
    const fit = () => {
      const grid = footer.querySelector<HTMLElement>('.wrap')?.offsetWidth ?? 0;
      const size = grid / 2.1697;
      footer.style.setProperty('--wm', `${size.toFixed(1)}px`);
      footer.style.minHeight = `${Math.ceil(24 + size * (0.721 + 0.02))}px`;
      /* Where the footer's text ends, measured from the wordmark's top: the
         word is held back behind the text and comes up to full strength
         below it (see Footer.css). */
      const word = footer.querySelector<HTMLElement>('.footer__wordmark');
      const text = footer.querySelector<HTMLElement>('.footer__inner');
      const cta = footer.querySelector<HTMLElement>('.footer__cta');
      if (word && text && cta) {
        const top = word.getBoundingClientRect().top;
        const fade = text.getBoundingClientRect().bottom - top;
        const rule = cta.getBoundingClientRect().bottom - top;
        footer.style.setProperty('--wm-fade', `${Math.max(0, fade).toFixed(0)}px`);
        /* And kept clear of the headline: nothing above the rule under it. */
        footer.style.setProperty('--wm-rule', `${rule.toFixed(0)}px`);
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`footer${armed ? ' is-armed' : ''}${inView ? ' is-in' : ''}${settled ? ' is-settled' : ''}`}
      data-nav-tone="dark"
      /* The nav's Contact link lands here: the email, office and LinkedIn. */
      id="contact"
    >
      {/* The invitation: the headline and the line beneath it; beside them
          the email, labelled, with the response note beneath. */}
      <div className="wrap footer__cta">
        <div className="footer__cta-text">
          <h2 className="footer__cta-heading">
            {contact.closing.lead.split(' ').map((word, w) => (
              <span key={w} className="footer__word" style={{ '--w': w } as React.CSSProperties}>
                {word}{' '}
              </span>
            ))}
            <span className="footer__cta-rest">
              {contact.closing.rest.split(' ').map((word, w, all) => (
                <span
                  key={w}
                  className="footer__word"
                  style={{ '--w': w + contact.closing.lead.split(' ').length } as React.CSSProperties}
                >
                  {word}
                  {w < all.length - 1 ? ' ' : ''}
                </span>
              ))}
            </span>
          </h2>
          <p className="footer__cta-support">{contact.support}</p>
        </div>
        <div className="footer__cta-contact">
          <p className="mono mono--on-dark">Email us</p>
          <a href={mailto} className="footer__cta-mail" onClick={() => copyEmail('cta')}>
            {site.email}
          </a>
          <p className={`footer__cta-note${copied === 'cta' ? ' is-copied' : ''}`}>
            <span>{contact.response}</span>
            <span className="footer__copied-text" aria-hidden="true">
              Email copied
            </span>
          </p>
        </div>
      </div>

      <div className="wrap footer__inner">
        <div className="footer__brand">
          {/* The full logo, with the brand line "Dreams. Ambition. Growth." as
              drawn in it (vector, from the supplied artwork), the line lightened
              to read on the dark ground. */}
          <img
            src="/brand/ignite-logo-dag-light.svg"
            alt={`${site.shortName} — Dreams. Ambition. Growth.`}
            className="footer__logo"
            width={254}
            height={152}
          />
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <p className="mono mono--on-dark footer__nav-heading">Navigate</p>
          {nav.items.map((item) => (
            <SectionLink key={item.href} href={item.href} className="footer__link">
              {item.label}
            </SectionLink>
          ))}
        </nav>

        <div className="footer__nav">
          <p className="mono mono--on-dark footer__nav-heading">Legal</p>
          <PageLink to="/privacy-policy" className="footer__link">
            Privacy Policy
          </PageLink>
          <PageLink to="/disclaimer" className="footer__link">
            Disclaimer
          </PageLink>
        </div>

        <div className="footer__nav">
          <p className="mono mono--on-dark footer__nav-heading">Contact</p>
          {/* Labelled "Email": the address itself is set large in the
              headline row above. */}
          <a href={mailto} className="footer__link" onClick={() => copyEmail('list')}>
            Email
            <span className={`footer__copied${copied === 'list' ? ' is-shown' : ''}`} aria-hidden="true">
              Copied
            </span>
          </a>
          {/* Labelled "LinkedIn" rather than by the page name, which is the
              company name again and read as a duplicate of the address line
              directly below. Plain text until site.linkedinUrl is filled in —
              see config/site.ts. */}
          {site.linkedinUrl ? (
            <a
              href={site.linkedinUrl}
              className="footer__link"
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`LinkedIn — ${site.linkedinLabel}`}
            >
              LinkedIn
            </a>
          ) : (
            <span className="footer__muted">LinkedIn</span>
          )}
          <address className="footer__address">
            {site.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        </div>
      </div>

      {/* Read out once when the address is copied. */}
      <p className="visually-hidden" aria-live="polite">
        {copied ? `${site.email} copied` : ''}
      </p>

      <div className="wrap footer__base">
        {/* The year is set at build time in the pre-rendered page; after a
            new year begins the page corrects it quietly. */}
        <p className="mono mono--on-dark" suppressHydrationWarning>
          © {year} {site.name}
        </p>
        <p className="mono mono--on-dark">All rights reserved</p>
      </div>

      {/* The sign-off: the name set across the full width, faint, and
          cropped by the page's foot. Live text, so it stays sharp at any
          size (the supplied logo file is too small to enlarge). */}
      <p className="footer__wordmark" aria-hidden="true">
        {[...'ignite'].map((letter, l) => (
          <span key={l} className="footer__letter" style={{ '--l': l } as React.CSSProperties}>
            {letter}
          </span>
        ))}
      </p>
    </footer>
  );
}
