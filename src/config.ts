// ---------------------------------------------------------------
// EDIT THIS FILE FIRST. Everything site-wide lives here.
// ---------------------------------------------------------------

export const SITE = {
  name: 'Vincent Vi',
  title: 'Vincent Vi — Designer & Letterer',
  description:
    'Graphic designer specializing in typography, hand-lettering, and book design. Working worldwide.',
  url: 'https://vincentvi.me',
  locale: 'en',
  author: 'Vincent Vi',

  // Used in the Person structured-data block (helps Google understand
  // who you are — a step toward a name knowledge panel).
  jobTitle: 'Graphic Designer & Letterer',

  // Default social-share image (1200×630). Any page can override via the
  // `ogImage` prop; this is the fallback so no share ever renders bare.
  defaultOgImage: '/og-default.png',

  // Google Search Console "HTML tag" verification: paste ONLY the content
  // token here (the value inside content="..."). Leave '' if you verify
  // via DNS instead.
  googleSiteVerification: '',
};

// Primary navigation. Order here = order on screen. Read by BOTH the shared
// Header component and the standalone homepage (src/pages/index.astro), which
// carries its own chrome — so the two can never drift apart again.
export const NAV = [
  { label: 'Portfolio', href: '/portfolio/' },
  { label: 'Tinkering', href: '/tinkering/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contact', href: '/contact/' },
] as const;

// Shown in the footer and on /contact. Replace # with real URLs,
// remove any you do not use. Order here = order on screen.
export const SOCIALS = [
  { label: 'X', url: 'https://x.com/vincentvi86' },
  { label: 'Behance', url: 'https://www.behance.net/vincentvi' },
  { label: 'Instagram', url: 'https://www.instagram.com/vincentvi.me/' },
  { label: 'Fiverr', url: 'https://www.fiverr.com/sinsin' },
];

// Portfolio tabs. Order here = order on screen. The `id` is the URL hash
// (/portfolio/#hand-lettering) AND the value each project's `tab:` field
// must match — the content schema validates against this list, so a typo
// in a .md file breaks the build loudly instead of silently hiding work.
// To add a tab: add a line here, then set `tab:` on the relevant projects.
//
// `intro` prints BELOW that tab's wall. Leave it '' and nothing renders,
// so each tab can get its own paragraph whenever you write it.
export const PORTFOLIO_TABS = [
  {
    id: 'book-design',
    label: 'Book Design',
    intro:
      "I'm a book designer working with independent authors and small publishers — mostly interior layout and cover design for non-fiction: cookbooks, workbooks, memoirs, health and business titles. The brief is nearly always the same underneath: a manuscript that has to become something a reader will stay inside for two hundred pages. Readable first, handsome second. For a project written up end to end — cover, interior layout, and infographics — see <a href=\"/portfolio/fully-alive/\">the book design for <i>Fully Alive</i></a>.",
  },
  { id: 'hand-lettering', label: 'Hand Lettering', intro: '' },
  { id: 'logo-design', label: 'Logo Design', intro: '' },
  { id: 'infographic-sketchnote', label: 'Infographic & Sketchnote', intro: '' },
] as const;

export type PortfolioTabId = (typeof PORTFOLIO_TABS)[number]['id'];

// Get a free access key at https://web3forms.com (takes 1 minute,
// only needs your email). Paste it between the quotes.
export const WEB3FORMS_ACCESS_KEY = '6f9abc9e-b523-4cd6-9f3a-9dd2fca4300e';
