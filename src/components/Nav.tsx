import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SectionLink from './SectionLink';
import { site } from '../config/site';
import { contact, nav } from '../content/content';
import './Nav.css';

/**
 * Fixed nav. On the home page it starts transparent over the dark hero and
 * picks up a cream backdrop once the hero has been scrolled past, matching
 * the reference. The legal pages have no hero — their ground is white — so
 * there it wears the backdrop from the start, or its light type would be
 * invisible and the way back home with it.
 * Over a dark section further down (any element marked
 * `data-nav-tone="dark"`) it switches to light type on a dark ground.
 */
/* "Start A Conversation" opens an email to the office, subject filled in. */
const mailto = `mailto:${site.email}?subject=${encodeURIComponent(contact.ctaSubject)}`;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const noHero = pathname === '/privacy-policy' || pathname === '/disclaimer';
  const solid = scrolled || noHero;

  /* The click also copies the address, with a brief "Email copied" note —
     for visitors with no mail app set up, where it would otherwise seem to
     do nothing. The link still opens the mail app as usual. */
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(0);
  const copyEmail = () => {
    navigator.clipboard
      ?.writeText(site.email)
      .then(() => {
        setCopied(true);
        window.clearTimeout(copyTimer.current);
        copyTimer.current = window.setTimeout(() => setCopied(false), 2200);
      })
      .catch(() => {});
  };
  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      /* Dark if the line through the middle of the bar crosses a dark
         section. */
      const line = document.querySelector('.nav')?.getBoundingClientRect();
      const y = line ? line.top + line.height / 2 : 40;
      setOnDark(
        [...document.querySelectorAll('[data-nav-tone="dark"]')].some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= y && r.bottom >= y;
        }),
      );
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
    /* Re-read on a change of page, which lands at a new scroll position. */
  }, [pathname]);

  /* Lock the page behind the open mobile menu. */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`nav ${solid ? 'is-scrolled' : ''} ${solid && onDark && !open ? 'is-on-dark' : ''} ${open ? 'is-open' : ''}`}
    >
      <div className="nav__inner wrap">
        <SectionLink href="#top" className="nav__brand" onClick={() => setOpen(false)}>
          {/* The white logo over the hero and the colour one on the pill,
              stacked and cross-faded, so each is drawn as designed rather
              than the colour one being filtered to white. */}
          <img
            className="nav__logo nav__logo--light"
            src="/brand/ignite-logo-white.svg"
            alt="Ignite Advisers &amp; Consultants"
            width={254}
            height={127}
          />
          <img
            className="nav__logo nav__logo--colour"
            src="/brand/ignite-logo.svg"
            alt=""
            aria-hidden="true"
            width={254}
            height={127}
          />
        </SectionLink>

        <nav className="nav__links" aria-label="Primary">
          {nav.items.map((item) => (
            <SectionLink key={item.href} href={item.href} className="nav__link">
              {item.label}
            </SectionLink>
          ))}
        </nav>

        <div className="nav__actions">
          <a href={mailto} className="btn nav__cta" onClick={copyEmail}>
            {nav.cta.label}
          </a>
          <span className={`nav__copied${copied ? ' is-shown' : ''}`} aria-live="polite">
            {copied ? 'Email copied' : ''}
          </span>

          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="nav__menu" id="nav-menu" hidden={!open}>
        <nav className="nav__menu-links" aria-label="Mobile">
          {nav.items.map((item, i) => (
            <SectionLink
              key={item.href}
              href={item.href}
              className="nav__menu-link"
              style={{ '--i': i } as React.CSSProperties}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </SectionLink>
          ))}
        </nav>
        <a
          href={mailto}
          className="btn nav__menu-cta"
          onClick={() => {
            copyEmail();
            setOpen(false);
          }}
        >
          {nav.cta.label}
        </a>
      </div>
    </header>
  );
}
