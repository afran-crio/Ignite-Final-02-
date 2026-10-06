import { useEffect } from 'react';
import PageLink from '../components/PageLink';
import { media, site } from '../config/site';
import './LegalPage.css';

/**
 * Once the legal page is idle, fetch the home page's hero photo in the
 * background — the same file the home page's <picture> would choose — so
 * that going back home shows it at once rather than loading it then.
 */
function usePrefetchHero() {
  useEffect(() => {
    const load = () => {
      const picture = document.createElement('picture');
      const source = document.createElement('source');
      source.type = 'image/avif';
      source.srcset = media.hero.posterAvifSrcSet;
      source.sizes = media.hero.posterSizes;
      const img = document.createElement('img');
      img.sizes = media.hero.posterSizes;
      img.srcset = media.hero.posterSrcSet;
      picture.append(source, img);
    };
    /* Safari has no requestIdleCallback: a short delay stands in. */
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(load, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(load, 800);
    return () => clearTimeout(id);
  }, []);
}

/** Names the browser tab after the document, and gives the home page its
    own title back on leaving (the pre-rendered file carries it too; see
    scripts/prerender.mjs). */
export function legalTitle(title: string) {
  return `${title} | ${site.name}`;
}

function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = window.document.title;
    window.document.title = legalTitle(title);
    return () => {
      window.document.title = previous;
    };
  }, [title]);
}

/* The documents in legal.ts are `as const`, so their literal types are not
   interchangeable. This is the shape they share. */
type LegalDocument = {
  readonly index: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
};

/** Renders either approved legal document. Copy is verbatim from legal.ts. */
export default function LegalPage({ document }: { document: LegalDocument }) {
  usePrefetchHero();
  useDocumentTitle(document.title);
  return (
    <article className="section legal">
      <div className="wrap">
        <p className="mono mono--accent legal__index">{document.index}</p>
        <h1 className="display legal__title">{document.title}</h1>

        <div className="legal__body">
          {document.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <PageLink to="/" className="btn btn--ghost legal__back">
          Back to home
        </PageLink>
      </div>
    </article>
  );
}
