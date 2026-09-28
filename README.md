# Ignite — 06_BUILD

New site, styled on the Daylight reference: a cream ground, a fluid 12-column
grid, large tight-tracked display type and small uppercase mono labels.
Content is Ignite's approved copy, carried over verbatim from 05_BUILD.

    npm install
    npm run dev        # http://localhost:5175

Other scripts: `npm run build`, `npm run preview`, `npm run screenshot`.

## The layout system

The one thing to understand before editing any CSS:

* `--spacing` is `0.0625rem` — 1px at a 16px root.
* The **root font-size is fluid**: `min(4.26667vw, 20.267px)` on mobile,
  `clamp(14px, 1.11111vw, 19px)` on desktop.
* Every size and space is written as `calc(var(--spacing) * N)`, where N is the
  pixel value at a 16px root.

So the whole page scales continuously with the viewport instead of snapping at
breakpoints. Breakpoints only change *proportions* (column counts, whether a
centred mobile stack releases into an asymmetric desktop split) — never the
base scale.

`--sbw` is the scrollbar width, measured in JS (inline in `index.html`, kept in
sync in `main.tsx`). The grid is derived from `vw` units, which include the
scrollbar, so without subtracting it the grid overflows by ~15px on desktop.

**If a size silently falls back to an inherited value, check that the custom
property it depends on is actually declared.** `calc()` with an undefined
variable is invalid at computed-value time and fails silently.

## Navigation

Two states, both in `src/components/Nav.css`:

* **At rest** — transparent over the full-screen hero, light ink, logo inverted.
  No CTA: the hero carries its own "Explore Our Work" button.
* **Scrolled** (past 24px) — collapses into a centred floating pill on a
  translucent cream ground, dark ink, with the orange CTA fading in.

The links are absolutely centred so they do not shift when the CTA appears.

## Ported components

Two components came from shadcn/Tailwind snippets. This project has neither, so
they were ported to plain CSS and the token system while keeping the real
libraries that do the work:

* `components/LogoCarousel.tsx` — `embla-carousel-react` in `loop` mode, so the
  rail is genuinely endless rather than snapping back at the end of the list.
  Autoplay pauses on hover, on focus within, while the tab is hidden, and during
  a drag; under `prefers-reduced-motion` it never starts. Takes the client list
  from `content.ts`, including the name-only fallback for clients with no
  approved logo file.
* `components/ShimmerText.tsx` — `motion`. The glyphs are transparent and a
  gradient is clipped to them, so the effect inherits `color` from its parent.
  That is why the hero's second line only needs `color: var(--c-orange)`.

**Bundle note:** `motion` costs ~42 kB gzipped for the one hero sweep — the JS
bundle went 81 kB → 128 kB gzipped. The same effect is a `@keyframes`
animation on `background-position` with no dependency; swap it if the weight
matters more than the API.

## Where things live

| What | Where |
| --- | --- |
| Approved copy | `src/content/content.ts` |
| Legal copy | `src/content/legal.ts` |
| Contact details, media, form endpoint | `src/config/site.ts` |
| Colour, type scale, grid, motion | `src/styles/tokens.css` |
| Grid utilities, shared type classes | `src/styles/base.css` |

Copy is locked — it is reproduced verbatim from the approved documents. Adding a
client, a transaction or a team member is a content edit in `content.ts`, not a
component edit.

## Fonts

The reference uses licensed faces (Aeonik Pro, and custom `featureDeck` /
`socialMono`). These are free substitutes, self-hosted via Fontsource:

| Role | Reference | Here |
| --- | --- | --- |
| Sans | aeonikPro | **Figtree Variable** |
| Serif | featureDeck | **Instrument Serif** (founder quote) |
| Mono | socialMono | **DM Mono** (eyebrows, labels) |

To swap in the real faces: drop the `.woff2` files in `public/fonts/`, add
`@font-face` rules, and repoint `--font-sans` / `--font-serif` / `--font-mono`
in `tokens.css`. Nothing else needs to change.

## Still outstanding

* `site.linkedinUrl` is empty — the LinkedIn entry renders as plain text, not a
  link, until a URL is supplied.
* `contactForm.endpoint` is empty — there is no contact form, only details.
* Hero and About use the placeholder photography from `media-source/`.
* `public/clients/hyfun-foods.png` had an opaque magenta background; it has been
  made transparent here so it sits on the cream. The original is untouched in
  `05_BUILD/public/clients/`.

## Screenshots

`npm run screenshot` captures the running dev server. It falls back to a system
Chrome because Puppeteer's bundled build needs a newer macOS than this machine.
Note that Chrome's `fullPage` capture stitches unreliably on very tall pages —
capture individual sections when reviewing.
