import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import PageLink from './PageLink';

type SectionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** An in-page target on the home page, e.g. "#about". */
  href: string;
  children: ReactNode;
};

/**
 * A link to a section of the home page that works from any page.
 *
 * On the home page it scrolls to the section itself, without touching the
 * URL: the hash is left alone so it can never be mistaken for a route (the
 * preview build routes through the hash) or be re-handled by whatever hosts
 * the page. The href is still the anchor, so the link is a link — it can be
 * opened in a new tab, and it works without JavaScript.
 *
 * On any other page (the legal pages) it cross-fades home carrying the hash
 * (see PageLink), and App's ScrollToTop places the home page at the section
 * before it fades in.
 */
export default function SectionLink({ href, children, onClick, ...rest }: SectionLinkProps) {
  const { pathname } = useLocation();
  const onHome = pathname === '/' || (import.meta.env.VITE_PREVIEW && !isLegalPath(pathname));

  if (onHome) {
    const scroll = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    };
    return (
      <a href={href} onClick={scroll} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <PageLink to={{ pathname: '/', hash: href }} onClick={onClick} {...rest}>
      {children}
    </PageLink>
  );
}

function isLegalPath(pathname: string) {
  return pathname === '/privacy-policy' || pathname === '/disclaimer';
}
