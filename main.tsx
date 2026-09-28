import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';

import '@fontsource-variable/figtree';
/* A drawn italic for the founder's quote — the browser's synthesised oblique
   is a slant, not an italic, and it shows at display size. */
import '@fontsource-variable/figtree/wght-italic.css';

import './styles/tokens.css';
import './styles/base.css';
import App from './App';

/* Keep --sbw accurate across resizes and zoom changes. */
const syncScrollbarWidth = () => {
  const sbw = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--sbw', `${sbw}px`);
};
syncScrollbarWidth();
window.addEventListener('resize', syncScrollbarWidth);

/* The preview build (VITE_PREVIEW=1, see README) is hosted as a static page
   under a path it does not own, where deep links cannot fall back to
   index.html — so it routes through the hash instead. Production uses real
   paths. */
const Router = import.meta.env.VITE_PREVIEW ? HashRouter : BrowserRouter;

const app = (
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);

/* The production build arrives pre-rendered (scripts/prerender.mjs): take
   over that HTML rather than drawing the page again — if it is this page's
   HTML. Otherwise (the dev server and the preview build send an empty root;
   a host may serve the home page for another path) draw it here. */
const root = document.getElementById('root')!;
const path = window.location.pathname.replace(/(.)\/$/, '$1');
if (root.hasChildNodes() && root.dataset.route === path) {
  hydrateRoot(root, app);
} else {
  root.replaceChildren();
  createRoot(root).render(app);
}
