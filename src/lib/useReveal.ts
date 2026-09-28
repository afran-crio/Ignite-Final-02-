import { useEffect } from 'react';

/**
 * Adds `is-visible` to every `.reveal` element as it enters the viewport.
 * One observer for the whole document rather than one per component, and it
 * unobserves on first reveal so elements never animate twice.
 *
 * Pages change without a reload (home ↔ legal pages), and a page arriving
 * brings new `.reveal` elements; so the observer stays for the life of the
 * app and picks up any added to the document, rather than only those present
 * when it started — otherwise the home page, reached from a legal page,
 * would stay hidden until a refresh.
 */
export function useReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const show = (n: Element) => n.classList.add('is-visible');

    const observer =
      reduced || !('IntersectionObserver' in window)
        ? null
        : new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                show(entry.target);
                observer?.unobserve(entry.target);
              });
            },
            /* As soon as an element is on screen, so it is never waited for. */
            { rootMargin: '0px 0px -4% 0px', threshold: 0 },
          );

    const watch = (root: ParentNode) => {
      const nodes = [
        ...(root instanceof Element && root.matches('.reveal:not(.is-visible)') ? [root] : []),
        ...root.querySelectorAll('.reveal:not(.is-visible)'),
      ];
      nodes.forEach((n) => (observer ? observer.observe(n) : show(n)));
    };

    watch(document);
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) watch(node);
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer?.disconnect();
    };
  }, []);
}
