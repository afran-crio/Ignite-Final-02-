/**
 * Ignite Advisers & Consultants LLP - site configuration.
 *
 * Single place for the values a servicing update is most likely to touch.
 * Copy lives in src/content/. Visual values live in src/styles/tokens.css.
 */

export const site = {
  name: 'Ignite Advisers & Consultants LLP',
  shortName: 'Ignite Advisers & Consultants',
  title: 'Ignite Advisers & Consultants LLP | Structuring Capital. Empowering Growth.',
  description:
    'Ignite is a trusted capital advisory firm delivering bespoke & sustainable financing solutions aligning to business objectives.',

  /**
   * Set once the production domain is confirmed. An empty string suppresses
   * the canonical tag and absolute Open Graph URLs.
   */
  canonicalUrl: '',

  email: 'contact@igniteadv.com',

  /** The company page. If this is ever emptied, the footer's LinkedIn entry
      renders as plain text rather than a dead link. */
  linkedinUrl: 'https://www.linkedin.com/company/ignite-advisers-and-consultants/',
  linkedinLabel: 'Ignite Advisers & Consultants',

  address: ['Ignite Advisers & Consultants', '1101 Sapphire Plaza', 'Vile Parle (W), Mumbai – 400056'],
} as const;

/**
 * Hero / editorial media. Drop the approved files into public/media/ and point
 * these at them - nothing else needs to change. While a value is null the
 * MediaFrame component renders a clearly-marked temporary placeholder.
 */
export const media = {
  hero: {
    /** Approved film. While null the poster still carries the composition. */
    video: null as string | null,
    videoWebm: null as string | null,
    poster: '/media/hero/hero-1400.jpg' as string | null,
    posterSrcSet:
      '/media/hero/hero-900.jpg 900w, /media/hero/hero-1400.jpg 1400w, ' +
      '/media/hero/hero-2000.jpg 2000w, /media/hero/hero-2800.jpg 2800w',
    /** The same frames as AVIF — about a quarter lighter at the same
        quality; browsers without AVIF take the JPEGs above. */
    posterAvifSrcSet:
      '/media/hero/hero-900.avif 900w, /media/hero/hero-1400.avif 1400w, ' +
      '/media/hero/hero-2000.avif 2000w, /media/hero/hero-2800.avif 2800w',
    /* The photo covers a full-height hero: on a screen narrower than the
       photo's shape (about 1.7 : 1, so every phone and most tablets) it is
       shown by the height, at 1.7 × the screen's height — so the browser
       picks by that, not the width. */
    posterSizes: '(max-aspect-ratio: 17/10) 170vh, 100vw',
    label: 'Hero film',
    note: 'India growth / infrastructure - awaiting final approved film',
    alt: 'The Bandra-Worli Sea Link curving across Mahim Bay, with the South Mumbai skyline beyond',
  },
} as const;

/** Contact form submission (not yet used: the site's "Start a Conversation" button, in Founder.tsx, opens a mail). */
export const contactForm = {
  /**
   * AWAITING CLIENT DECISION - no form endpoint has been provided. Until one
   * exists the form opens the visitor's mail client addressed to `site.email`.
   * Set this to a POST endpoint (Formspree, SES, custom) to switch behaviour.
   */
  endpoint: '' as string,
} as const;
