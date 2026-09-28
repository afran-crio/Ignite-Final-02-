/**
 * The cross-fade between pages (the home page and the legal pages).
 *
 * Leaving: the page's content fades out (the nav stays), then the route
 * changes. Arriving: App places the new page — at the top, or already at
 * the section a link named — while it is still faded out, then fades it in.
 * So moving between pages never flashes the hero or races down the whole
 * home page to reach a section.
 *
 * The fade is the `page-out` class on <html>; see base.css.
 */
const CLASS = 'page-out';
/** Matches the fade-out in base.css. */
const OUT_MS = 140;

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Fade the page out, then run `go` (the navigation). */
export function leavePage(go: () => void) {
  if (reduced()) return go();
  document.documentElement.classList.add(CLASS);
  window.setTimeout(go, OUT_MS);
}

/** Hide the page at once, with no fade out (a Back or Forward arrival,
    which has already switched): `page-cut` drops the fade's duration. */
export function hidePage() {
  if (reduced()) return;
  document.documentElement.classList.add(CLASS, 'page-cut');
}

/** Fade the (placed) page back in. After an instant hide, wait for the
    hidden state to be drawn once, or there would be nothing to fade from. */
export function showPage() {
  const root = document.documentElement;
  if (!root.classList.contains('page-cut')) return root.classList.remove(CLASS);
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove(CLASS, 'page-cut')));
}

/** A click the browser should handle itself: a new tab or window, a
    download, or anything but a plain primary click. */
export function isModifiedClick(e: React.MouseEvent) {
  return e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
}
