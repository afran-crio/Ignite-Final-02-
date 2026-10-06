import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { privacyPolicy, disclaimer } from './content/legal';
import { legalTitle } from './pages/LegalPage';

/** The <title> for each pre-rendered route other than the home page, whose
    title is already in index.html. */
export const titles: Record<string, string> = {
  '/privacy-policy': legalTitle(privacyPolicy.title),
  '/disclaimer': legalTitle(disclaimer.title),
};

/**
 * Renders a route to HTML at build time (see scripts/prerender.mjs), so the
 * page's text is in the file the browser receives and shows before the
 * scripts load; main.tsx then hydrates it rather than drawing it afresh.
 */
export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}
