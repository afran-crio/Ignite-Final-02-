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
  /* The statement carries the section; the body sits alongside it, set as
     separate paragraphs rather than one block. */
  statement: 'The capable co-pilot for growth.',
  body: [
    'From understanding the requirement to structuring the solution and navigating execution, we bring the judgement and relationships needed to make complex capital decisions work.',
    'Anchored in trust, our deep network and commitment to execution allow us to support clients through every stage of their growth journey.',
  ],
  /* The growth figure beside the copy: the stages the body names, in order,
     rising to growth. Taken from the copy above, not new claims. */
  stages: ['Requirement', 'Structure', 'Execution', 'Growth'],
} as const;

export const metrics = {
  /* The short label over the headline, as every section has. New copy —
     the approved line below is now the headline itself. */
  label: 'By the Numbers',
  heading: 'Experience demonstrated through scale.',
  lead: {
    value: '$2B',
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
   * 17 approved clients. The order alternates compact marks with wide
   * wordmarks (ratio ≥ 2.8), which take a double cell in the grid — that is
   * what lets the grid fill every row exactly at 3, 4 and 6 columns. Keep
   * the alternation when adding or reordering clients.
   *
   * `logo` is a file in public/clients/.
   *
   * `ratio` is the logo file's width ÷ height; the rail sizes each mark
   * from it, so wide wordmarks and square marks carry a similar visual
   * weight (see Clientele.tsx). Update it when a logo file is replaced.
   * `scale` evens out visual weight on top of that: a heavy solid mark
   * (KP) is set a little smaller, a light one (Taj's thin gold) larger.
   */
  clients: [
    { name: 'Hiranandani', logo: '/clients/hiranandani.png', ratio: 1.09, scale: 0.99 },
    { name: 'ESL, Vedanta Group', logo: '/clients/esl-vedanta.png', ratio: 6.64, scale: 1.03 },
    { name: 'NDR InvIT', logo: '/clients/ndr-invit.png', ratio: 2.22, scale: 0.97 },
    { name: 'BKT', logo: '/clients/bkt.png', ratio: 2.87, scale: 0.86 },
    { name: 'Hyfun Foods', logo: '/clients/hyfun-foods.png', ratio: 1.91, scale: 1.09 },
    { name: 'One Source, Strides Pharma Group', logo: '/clients/one-source.svg', ratio: 9.58, scale: 0.68 },
    { name: 'KP Group', logo: '/clients/kp-group.png', ratio: 0.90, scale: 0.96 },
    { name: 'Gayatrishakti Paper', logo: '/clients/gayatrishakti-paper.png', ratio: 3.24, scale: 0.93 },
    { name: 'Taj Aravalli', logo: '/clients/taj.svg', ratio: 1.15, scale: 1.32 },
    { name: 'Sanathan Textiles', logo: '/clients/sanathan-textiles.png', ratio: 5.43, scale: 1.02 },
    { name: 'J Kumar', logo: '/clients/j-kumar.png', ratio: 0.71, scale: 1.08 },
    { name: 'Ashwin Sheth Group', logo: '/clients/ashwin-sheth.png', ratio: 4.04, scale: 0.96 },
    { name: 'SLMG', logo: '/clients/slmg.png', ratio: 2.32, scale: 1.11 },
    { name: 'MediBuddy', logo: '/clients/medibuddy.svg', ratio: 3.91, scale: 1.16 },
    { name: 'Pristine Logistics', logo: '/clients/pristine-logistics.png', ratio: 2.21, scale: 1.05 },
    { name: 'Shrem InvIT', logo: '/clients/shrem-invit.png', ratio: 2.63, scale: 1.04 },
    { name: 'NDR Warehousing', logo: '/clients/ndr-warehousing.png', ratio: 1.44, scale: 0.9 },
  ],
  /**
   * The clients grouped by sector, for the sector index. PROPOSED — these
   * groupings are Ignite's own claim about its work and need the client's
   * confirmation. Every name must match a `clients` entry exactly.
   */
  sectors: [
    { name: 'Real estate', clients: ['Hiranandani', 'Ashwin Sheth Group'] },
    { name: 'Infrastructure & InvITs', clients: ['J Kumar', 'NDR InvIT', 'Shrem InvIT'] },
    { name: 'Logistics & warehousing', clients: ['NDR Warehousing', 'Pristine Logistics'] },
    { name: 'Energy', clients: ['KP Group'] },
    {
      name: 'Industrials & manufacturing',
      clients: ['BKT', 'ESL, Vedanta Group', 'Gayatrishakti Paper', 'Sanathan Textiles'],
    },
    { name: 'Consumer & hospitality', clients: ['Hyfun Foods', 'SLMG', 'Taj Aravalli'] },
    { name: 'Healthcare & pharma', clients: ['One Source, Strides Pharma Group', 'MediBuddy'] },
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
  capabilities: [
    {
      number: '01',
      title: 'Structured Capital',
      description:
        'Designing bespoke capital structures for promoter funding, shareholder liquidity, growth capital and special situations.',
    },
    {
      number: '02',
      title: 'Acquisition Financing',
      description:
        'Supporting domestic and cross-border acquisitions through tailored financing structures and sponsor-backed solutions.',
    },
    {
      number: '03',
      title: 'Project & Infrastructure Finance',
      description:
        'Advising on large-ticket financing for infrastructure, manufacturing, logistics and renewable energy projects.',
    },
    {
      number: '04',
      title: 'Real Estate Financing',
      description:
        'Supporting developers across land acquisition, last mile financing, refinancing and asset monetisation.',
    },
    {
      number: '05',
      title: 'Sponsor Capital',
      description:
        'Working alongside promoters and investors on bridge capital, portfolio company growth and leveraged buyouts.',
    },
    {
      number: '06',
      title: 'Global Capital (ECA & DFI)',
      description:
        'Connecting Indian businesses with international lenders, Export Credit Agencies and Development Finance Institutions.',
    },
  ],
} as const;

export const works = {
  heading: 'Our Works',
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
   */
  transactions: [
    {
      amount: '$365 million',
      description:
        'Single-lender leveraged acquisition financing supporting a landmark cross-border acquisition across seven international jurisdictions.',
      segment: 'Cross-border acquisition',
      solution: 'Leveraged buyout',
      image: '/media/works/01-cross-border.jpg' as string | null,
    },
    {
      amount: '$100+ million',
      description:
        'Single-lender project financing for a large hybrid renewable energy project based out of Gujarat.',
      segment: 'Renewable energy',
      solution: 'Project finance',
      image: '/media/works/02-renewable.jpg' as string | null,
    },
    {
      amount: '$80 million',
      description:
        'Quasi-equity financing supporting the expansion of a leading mid-sized food processing company.',
      segment: 'Food processing',
      solution: 'Quasi equity',
      image: '/media/works/03-food.jpg' as string | null,
    },
    {
      amount: '$250 million',
      description:
        'Aggregate debt financing across multiple instruments for a AAA-rated InvIT, supporting successive phases of business growth.',
      segment: 'Infrastructure & logistics',
      solution: 'Structured debt',
      image: '/media/works/04-logistics.jpg' as string | null,
    },
    {
      amount: '$200+ million',
      description:
        'Aggregate ECA-backed financing for capital equipment imports across the food processing, pharmaceutical and textile sectors.',
      segment: 'Capital equipment',
      solution: 'ECA financing',
      image: '/media/works/05-equipment.jpg' as string | null,
    },
    {
      amount: '$50+ million',
      description:
        'Structured pre-IPO financing supporting the balance sheet recapitalisation of a leading healthcare platform.',
      segment: 'Healthcare',
      solution: 'Pre-IPO financing',
      image: '/media/works/06-healthcare.jpg' as string | null,
    },
    {
      amount: '$100 million',
      description:
        'Sustainability-linked financing arranged from the International Finance Corporation (IFC) for a listed, AA+ rated automotive related manufacturing company.',
      segment: 'Automotive manufacturing',
      solution: 'ESG financing',
      image: '/media/works/07-automotive.jpg' as string | null,
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
      credentials: [
        'Chartered Accountant',
        'Former PL Capital & CRISIL',
        'Experience in financial research, analytics and transaction support, with a research-driven approach to corporate finance.',
      ],
    },
  ],
} as const;

export const founder = {
  eyebrow: "Founder's Perspective",
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
  /** The rings beside the statement: what a financing decision rests on,
      in the words of the statement itself — outermost to innermost, trust
      at the core. */
  rings: ['Structure', 'Partnership', 'Judgement', 'Trust'],
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
      in grey. CONFIRM WITH CLIENT (proposed in the design review, Sep 2026). */
  closing: { lead: 'Let’s talk about', rest: 'your next stage of growth.' },
  /** Beneath the footer's email. CONFIRM WITH CLIENT: a promise of response
      time (proposed in the design review, Sep 2026). */
  response: 'We respond within one business day.',
  /** Pre-filled subject line on the mail the CTA opens. */
  ctaSubject: 'Start a conversation with Ignite',
} as const;
