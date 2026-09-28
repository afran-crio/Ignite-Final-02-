import { useLayoutEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';

import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import LegalPage from './pages/LegalPage';
import { privacyPolicy, disclaimer } from './content/legal';
import { useReveal } from './lib/useReveal';
import { hidePage, showPage } from './lib/pageTransition';

/**
 * Places each page as it arrives, then fades it in (see lib/pageTransition):
 * at the top, or — when a section link from another page carried a hash —
 * already at that section, so the home page never races down to it. In the
 * hash-routed preview build the in-page anchors (#about, #team …) arrive
 * here as routes, so a path that names an element is placed at it instead.
 *
 * Back and Forward return to where the reader was on that page. The site
 * keeps those positions itself (the browser's own restoration would scroll
 * there smoothly, racing down the page, since the page scrolls smoothly),
 * and puts the page back at its position while it is hidden.
 *
 * On first load the page is already showing, so a hash is simply honoured.
 */
function ScrollToTop() {
  const location = useLocation();
  const { pathname, hash, key } = location;
  const navigationType = useNavigationType();
  const first = useRef(true);
  const positions = useRef(new Map<string, number>());
  const current = useRef(key);

  /* Remember where the reader is on each page (by its history entry). */
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const onScroll = () => positions.current.set(current.current, window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => {
    const initial = first.current;
    first.current = false;
    current.current = key;

    if (navigationType === 'POP' && !initial) {
      /* Read once: the swap of pages clamps the scroll, and that would be
         recorded over the saved position. */
      const saved = positions.current.get(key) ?? 0;
      hidePage();
      return placeWhenSettled(() => saved, showPage);
    }
    const target =
      (hash && document.getElementById(hash.slice(1))) ||
      (import.meta.env.VITE_PREVIEW ? document.getElementById(pathname.slice(1)) : null);
    if (!target) {
      if (!initial) window.scrollTo({ top: 0, behavior: 'instant' });
      showPage();
      return;
    }
    /* Less the section's scroll margin (base.css), as a link would. */
    const margin = () => parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    return placeWhenSettled(() => target.getBoundingClientRect().top + window.scrollY - margin(), showPage);
  }, [pathname, hash, key, navigationType]);
  return null;
}

/**
 * Scroll a page that has only just mounted to a position (`at`, measured
 * afresh each frame). Its layout is still settling for a moment — the
 * pinned sections take their full height once their effects run — so wait
 * until the position and the page's height hold still for two frames (at
 * most ~0.7s), go there at once, then call `done`. Returns a cleanup.
 */
function placeWhenSettled(at: () => number, done: () => void) {
  let frame = 0;
  let last = '';
  let still = 0;

  const wait = (budget: number) => {
    const now = `${Math.round(at())}:${document.documentElement.scrollHeight}`;
    still = now === last ? still + 1 : 0;
    last = now;
    if (still >= 2 || budget <= 0) {
      window.scrollTo({ top: at(), behavior: 'instant' });
      done();
      return;
    }
    frame = requestAnimationFrame(() => wait(budget - 1));
  };
  frame = requestAnimationFrame(() => wait(40));

  return () => cancelAnimationFrame(frame);
}

export default function App() {
  useReveal();

  return (
    <>
      <ScrollToTop />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy-policy" element={<LegalPage document={privacyPolicy} />} />
          <Route path="/disclaimer" element={<LegalPage document={disclaimer} />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
