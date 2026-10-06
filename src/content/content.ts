/**
 * LOCKED WEBSITE COPY
 * ---------------------------------------------------------------------------
 * Source of truth: 02_CONTENT/Ignite_Final_Website_Flow_and_Copy.docx
 *
 * Every string below is reproduced verbatim from the approved document.
 * Do not rewrite, shorten, expand or paraphrase. Do not add supporting
 * sentences, alternate headlines, statistics, titles or claims. Structural
 * edits (adding a client, a transaction, a team member) are servicing tasks
 * and are made here - not in the components.
 */

export const nav = {
  items: [
    { label: 'About', href: '#about' },
    { label: 'Solutions', href: '#expertise' },
    { label: 'Our Work', href: '#our-works' },
    { label: 'Team', href: '#team' },
    { label: 'Contact', href: '#contact' },
  ],
  /* The pill that appears in the nav once the page is scrolled. It opens
     an email to the office (see Nav.tsx). */
  cta: { label: 'Start A Conversation' },
} as const;

export const hero = {
  headline: { line1: 'Structuring Capital.', line2: 'Empowering Growth.' },
  positioning:
    'Ignite is a trusted capital advisory firm delivering bespoke and sustainable financing solutions aligned with business objectives.',
  cta: { label: 'Explore Our Work', href: '#our-works' },
} as const;

export const about = {
  heading: 'About Ignite',
  statement: 'The capable co-pilot for growth.',
  /* Shortened from two paragraphs to one sentence, trimmed from the
     approved first paragraph (client feedback, Oct 2026: "the copy needs
     shortening aggressively"). Awaiting the client's sign-off. */
  body: [
    'From structuring the solution to navigating execution, we bring the judgement and relationships that make complex capital decisions work.',
  ],
} as const;

/* The proof points, set beside the About statement (see About.tsx) rather
   than as a section of their own (client feedback, Oct 2026). */
export const metrics = {
  lead: {
    value: '$2 Bn',
    label: 'Capital Facilitated',
    support: 'Capital solutions structured across diverse sectors and business requirements.',
  },
  /** `lines` is the label as it is set: each entry is one line. */
  supporting: [
    { value: '100+', lines: ['Years Combined', 'Leadership Experience'] },
    { value: '75+', lines: ['Marquee Client', 'Relationships'] },
    { value: '15+', lines: ['Sectors', 'Served'] },
    { value: '12+', lines: ['Cities Serviced', 'in India'] },
  ],
} as const;

export const clientele = {
  heading: 'Marquee Clientele',
  lead: 'Trusted by market leaders across sectors.',
  /**
   * 16 approved clients, dealt alternately onto the two rails (see
   * Clientele.tsx) — the order alternates compact marks with wide wordmarks
   * so each rail carries a mix.
   *
   * `logo` is a file in public/clients/: the client's artwork (Oct 2026),
   * trimmed to its edges, and where it came white-on-dark (ESL, Pristine,
   * Shrem, and the names under the Ashwin Sheth and J Kumar marks) its
   * white set in ink for the light band. KP is its mark alone.
   *
   * `ratio` is the logo file's width ÷ height; the rail sizes each mark
   * from it, so wide wordmarks and square marks carry a similar visual
   * weight (see lib/logo.ts). Update it when a logo file is replaced.
   * `scale` evens out visual weight on top of that: a heavy solid mark
   * (KP) is set a little smaller, a light one (Taj's thin gold) larger.
   */
  clients: [
    { name: 'Hiranandani', logo: '/clients/hiranandani.png', ratio: 1.10, scale: 1.08 },
    { name: 'ESL, Vedanta Group', logo: '/clients/esl-vedanta.png', ratio: 6.64, scale: 1.0 },
    { name: 'NDR InvIT', logo: '/clients/ndr-invit.png', ratio: 2.22, scale: 0.97 },
    { name: 'Hyfun Foods', logo: '/clients/hyfun-foods.png', ratio: 1.91, scale: 1.09 },
    { name: 'One Source, Strides Pharma Group', logo: '/clients/one-source.png', ratio: 9.41, scale: 0.7 },
    { name: 'KP Group', logo: '/clients/kp-group.png', ratio: 0.92, scale: 1.06 },
    { name: 'Gayatrishakti Paper', logo: '/clients/gayatrishakti-paper.png', ratio: 3.23, scale: 1.05 },
    { name: 'Taj Aravalli', logo: '/clients/taj-aravali.png', ratio: 2.52, scale: 1.35 },
    { name: 'Sanathan Textiles', logo: '/clients/sanathan-textiles.png', ratio: 5.33, scale: 1.02 },
    { name: 'J Kumar', logo: '/clients/j-kumar.png', ratio: 0.70, scale: 1.15 },
    { name: 'Ashwin Sheth Group', logo: '/clients/ashwin-sheth.png', ratio: 1.61, scale: 1.25 },
    { name: 'SLMG', logo: '/clients/slmg.png', ratio: 2.31, scale: 1.11 },
    { name: 'MediBuddy', logo: '/clients/medibuddy.png', ratio: 4.81, scale: 1.0 },
    { name: 'Pristine Logistics', logo: '/clients/pristine-logistics.png', ratio: 1.52, scale: 1.0 },
    { name: 'Shrem InvIT', logo: '/clients/shrem-invit.png', ratio: 2.65, scale: 1.04 },
    { name: 'NDR Warehousing', logo: '/clients/ndr-warehousing.png', ratio: 1.44, scale: 0.9 },
  ],
} as const;

export const approach = {
  heading: 'The Ignite Approach',
  lead: 'We bring the right strategy, the right relationships and disciplined execution to every mandate.',
  /** The lead as it breaks on desktop — the same sentence, unchanged, split
      where the client asked the line to turn. Joined with a space it is
      `lead` exactly. */
  leadLines: [
    'We bring the right strategy, the right relationships',
    'and disciplined execution to every mandate.',
  ],
  /** Titles only. The approved copy carries no descriptions for these. */
  principles: ['Strategic Advisory', 'Bespoke Solutions', 'Trusted Partnerships', 'Sustainable Growth'],
} as const;

export const expertise = {
  heading: 'Our Expertise',
  /* Headline + supporting line, replacing the original single lead
     sentence at the client's request (design review, Sep 2026). */
  headline: 'We structure capital for the moments that define growth.',
  lead: 'From acquisitions and infrastructure to real estate and global capital access, we structure financing around the requirements of each mandate.',
  /* Descriptions cut to one line each, trimmed from the approved copy, so
     the panels can be shallower (client feedback, Oct 2026). Awaiting the
     client's sign-off. */
  capabilities: [
    {
      number: '01',
      title: 'Structured Capital',
      description:
        'Promoter funding, shareholder liquidity, growth capital and special situations.',
    },
    {
      number: '02',
      title: 'Acquisition Financing',
      description:
        'Domestic and cross-border acquisitions, and sponsor-backed structures.',
    },
    {
      number: '03',
      /* Shortened from "Project & Infrastructure Finance" at the client's
         request (feedback, Sep 2026). */
      title: 'Infrastructure Finance',
      description:
        'Large-ticket financing for infrastructure, manufacturing, logistics and renewables.',
    },
    {
      number: '04',
      title: 'Real Estate Financing',
      description:
        'Land acquisition, last mile financing, refinancing and asset monetisation.',
    },
    {
      number: '05',
      title: 'Sponsor Capital',
      description:
        'Bridge capital, portfolio company growth and leveraged buyouts.',
    },
    {
      number: '06',
      /* "(ECA & DFI)" dropped at the client's request (feedback, Sep 2026);
         the description still names both. */
      title: 'Global Capital',
      description:
        'International lenders, Export Credit Agencies and Development Finance Institutions.',
    },
  ],
} as const;

export const works = {
  heading: 'Our Work',
  /** A sentence with a full stop, like every section's headline. */
  lead: 'Representative transactions.',
  /**
   * `segment` names the sector the transaction sits in; it titles the tile
   * and says what its photograph should show. `solution` is the transaction
   * type, revealed with the description when the tile is hovered. `image` is
   * that photograph, null until artwork is supplied - the tile falls back to
   * a tinted ground rather than to whatever picture happens to be to hand.
   * Dropping a file into public/media/works/ and naming it here is the only
   * edit needed.
   *
   * Ordered by deal value, highest first (client feedback, Sep 2026); where
   * two are level, the "+" figure leads. Keep that order when adding one.
   */
  transactions: [
    {
      amount: '$365 Mn',
      description:
        'Single-lender leveraged acquisition financing supporting a landmark cross-border acquisition across seven international jurisdictions.',
      segment: 'Cross-Border Acquisition',
      solution: 'Leveraged Buyout',
      image: '/media/works/01-cross-border.jpg' as string | null,
    },
    {
      amount: '$250 Mn',
      description:
        'Aggregate debt financing across multiple instruments for a AAA-rated InvIT, supporting successive phases of business growth.',
      segment: 'Infrastructure & Logistics',
      solution: 'Structured Debt',
      image: '/media/works/04-logistics.jpg' as string | null,
    },
    {
      amount: '$200+ Mn',
      description:
        'Aggregate ECA-backed financing for capital equipment imports across the food processing, pharmaceutical and textile sectors.',
      segment: 'Capital Equipment',
      solution: 'ECA Financing',
      image: '/media/works/05-equipment.jpg' as string | null,
    },
    {
      amount: '$100+ Mn',
      description:
        'Single-lender project financing for a large hybrid renewable energy project based out of Gujarat.',
      segment: 'Renewable Energy',
      solution: 'Project Finance',
      image: '/media/works/02-renewable.jpg' as string | null,
    },
    {
      amount: '$100 Mn',
      description:
        'Sustainability-linked financing arranged from the International Finance Corporation (IFC) for a listed, AA+ rated automotive related manufacturing company.',
      segment: 'Automotive Manufacturing',
      solution: 'ESG Financing',
      image: '/media/works/07-automotive.jpg' as string | null,
    },
    {
      amount: '$80 Mn',
      description:
        'Quasi-equity financing supporting the expansion of a leading mid-sized food processing company.',
      segment: 'Food Processing',
      solution: 'Quasi Equity',
      image: '/media/works/03-food.jpg' as string | null,
    },
    {
      amount: '$50+ Mn',
      description:
        'Structured pre-IPO financing supporting the balance sheet recapitalisation of a leading healthcare platform.',
      segment: 'Healthcare',
      solution: 'Pre-IPO Financing',
      image: '/media/works/06-healthcare.jpg' as string | null,
    },
  ],
} as const;

export const testimonials = {
  heading: 'Testimonials',
  /** Attributed client quotes - never edit. Quotation marks are added by the
      layout. `client` names the matching `clientele.clients` entry, whose
      logo is shown with the attribution. */
  items: [
    {
      quote:
        "Ignite's expertise in structuring loan agreements and negotiating terms was helpful in securing favourable terms for our greenfield project. Their professionalism and integrity has been valuable to our relationship.",
      name: 'Mr. Shridhar Narayan',
      designation: 'CEO, Hiranandani Group',
      client: 'Hiranandani',
    },
    {
      quote:
        'The Ignite team has been instrumental in managing our finances and fostering our business expansion for more than five years. Consistently, the team has delivered the most cost-effective structure in a timely manner.',
      name: 'Mr. Mahesh Jalan',
      designation: 'Director, Gayatrishakti Paper and Boards Ltd.',
      client: 'Gayatrishakti Paper',
    },
    {
      quote:
        'Ignite has been facilitating financing for our warehousing and logistics business, serving as a key associate in our journey of expansion. Their expertise in business intricacies, RBI regulations and banking solutions has helped us optimise our debt structure.',
      name: 'Mr. Sandeep Jain',
      designation: 'CFO, NDR Warehousing',
      client: 'NDR Warehousing',
    },
  ],
} as const;

export const team = {
  heading: 'Leadership Team',
  lead: 'An ambitious team bringing together complementary expertise, fuelled by the vision to drive corporate growth.',
  /**
   * `title` is only populated where a designation has been approved.
   * Do not add titles for the remaining profiles.
   *
   * `frame` scales the portrait within its card so every head reads at
   * the same size: the supplied photographs were cropped looser or tighter
   * (heads from 26% to 33% of the frame), and each is brought up to the
   * tightest, Amit Malpani's (client feedback, Oct 2026). Only ever 1 or
   * more — the photographs end at the shoulders, so a smaller portrait
   * would show the cut. Re-measure when a photograph is replaced.
   *
   * `linkedin` is the member's public profile, found by web search on
   * 2026-09-20 and to be confirmed by each member before launch; null where
   * no profile could be identified with confidence.
   */
  members: [
    {
      name: 'Nikhil Poddar',
      linkedin: 'https://www.linkedin.com/in/nikhil-poddar-312513257' as string | null,
      title: 'Managing Partner',
      photo: '/team/nikhil-poddar.webp',
      photo2x: '/team/nikhil-poddar@2x.webp',
      frame: 1.22,
      credentials: [
        'Founded Ignite Advisers in 2009',
        '17+ years of experience in corporate debt advisory and fundraising',
        'Has built long-standing relationships across corporates, financial institutions and capital providers over the past two decades.',
      ],
    },
    {
      name: 'Vinod Kumar',
      linkedin: 'https://www.linkedin.com/in/vinod-kumar-89867319' as string | null,
      title: 'Senior Advisor',
      photo: '/team/vinod-kumar.webp',
      photo2x: '/team/vinod-kumar@2x.webp',
      frame: 1.14,
      credentials: [
        'Former Chief General Manager, State Bank of India',
        '30+ years of leadership experience in banking',
        "Brings decades of institutional banking experience and deep relationships across India's banking ecosystem.",
      ],
    },
    {
      name: 'Amit Malpani',
      linkedin: 'https://www.linkedin.com/in/amit-malpani' as string | null,
      title: null,
      photo: '/team/amit-malpani.webp',
      photo2x: '/team/amit-malpani@2x.webp',
      frame: 1,
      credentials: [
        'Former ICICI Bank, YES Bank & RBL Bank',
        '15+ years of corporate banking experience',
        'Experience across infrastructure financing, project finance and structured capital solutions.',
      ],
    },
    {
      name: 'Krutika Maniar',
      linkedin: 'https://www.linkedin.com/in/krutika-maniar-8885276b' as string | null,
      title: null,
      photo: '/team/krutika-maniar.webp',
      photo2x: '/team/krutika-maniar@2x.webp',
      frame: 1.1,
      credentials: [
        'Former Axis Bank & Kotak Mahindra Bank',
        '15+ years of corporate banking experience',
        'Has built and nurtured relationships with large corporates and institutional partners, with experience in structured capital solutions.',
      ],
    },
    {
      name: 'Venkatesh G',
      linkedin: 'https://www.linkedin.com/in/venkatesh-g-599a684' as string | null,
      title: null,
      photo: '/team/venkatesh-g.webp',
      photo2x: '/team/venkatesh-g@2x.webp',
      frame: 1.06,
      credentials: [
        'Former Standard Chartered, Axis Bank & Kotak Mahindra Bank',
        '18+ years of corporate banking experience',
        'Extensive experience in corporate credit assessment, financial diligence and real estate financing.',
      ],
    },
    {
      name: 'Kinjal Shah',
      linkedin: 'https://www.linkedin.com/in/kinjal-shah-b8136438' as string | null,
      title: null,
      photo: '/team/kinjal-shah.webp',
      photo2x: '/team/kinjal-shah@2x.webp',
      frame: 1.14,
      credentials: [
        'Former Citi, HDFC Bank, RBL Bank & YES Bank',
        '14+ years of corporate banking experience',
        'Experience across corporate banking, relationship management and financing solutions for SME and mid-market businesses.',
      ],
    },
    {
      name: 'Krishnendu Biswas',
      linkedin: 'https://www.linkedin.com/in/krishnendu-biswas-a40752237' as string | null,
      title: null,
      photo: '/team/krishnendu-biswas.webp',
      photo2x: '/team/krishnendu-biswas@2x.webp',
      frame: 1.27,
      credentials: [
        'Former EY & Grant Thornton',
        '12+ years of investment banking experience',
        'Experience across transaction advisory, equity capital, financial structuring and complex deal execution.',
      ],
    },
    {
      name: 'Nikhil Jethani',
      linkedin: 'https://www.linkedin.com/in/nikhil-jethani-401481167' as string | null,
      title: null,
      photo: '/team/nikhil-jethani.webp',
      photo2x: '/team/nikhil-jethani@2x.webp',
      frame: 1.27,
      credentials: [
        'Chartered Accountant',
        'Former PL Capital & CRISIL',
        'Experience in financial research, analytics and transaction support, with a research-driven approach to corporate finance.',
      ],
    },
  ],
} as const;

export const founder = {
  /** Approved quotation - never edit. */
  quote:
    'A financing decision is rarely only about price. It is about a structure that works for the business over the long term, and a capital partner who understands its journey. At Ignite, that perspective shapes every mandate. It is the judgement we are engaged for and the trust that brings clients back.',
  /**
   * The same quotation in the two levels the layout sets it at: the anchor
   * line, and the rest as one paragraph. Read in order they are `quote`,
   * word for word.
   */
  quoteLead: 'A financing decision is rarely only about price.',
  quoteBody:
    'It is about a structure that works for the business over the long term, and a capital partner who understands its journey. At Ignite, that perspective shapes every mandate. It is the judgement we are engaged for and the trust that brings clients back.',
  name: 'Nikhil Poddar',
  title: 'Managing Partner',
  photo: '/team/nikhil-poddar.webp',
  photo2x: '/team/nikhil-poddar@2x.webp',
} as const;

export const contact = {
  heading: 'Contact',
  labels: { email: 'EMAIL', linkedin: 'LINKEDIN', office: 'OFFICE' },
  /** Beneath the footer's headline (added in the design review, Sep 2026;
      its ending changed so it no longer repeats the headline's "next stage
      of growth"). CONFIRM WITH CLIENT. */
  support:
    'Capital requirements are rarely one-size-fits-all. Speak with our team about the right structure for your business.',
  cta: 'Start a Conversation',
  /** The footer's headline, above the email: the lead in white, the rest
      in grey — "Let's talk" white, "about…" grey, as the client asked
      (feedback, Sep 2026). */
  closing: { lead: 'Let’s talk', rest: 'about your next stage of growth.' },
  /** Pre-filled subject line on the mail the CTA opens. */
  ctaSubject: 'Start a conversation with Ignite',
} as const;
