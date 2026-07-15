// ---------------------------------------------------------------
// EDIT THIS FILE FIRST. Everything site-wide lives here.
// ---------------------------------------------------------------

export const SITE = {
  name: 'Vincent Vi',
  title: 'Vincent Vi — Designer & Letterer',
  description:
    'Graphic designer specializing in typography, hand-lettering, and book design. Based in Ho Chi Minh City, working worldwide.',
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

// Shown in the footer and on /contact. Replace # with real URLs,
// remove any you do not use. Order here = order on screen.
export const SOCIALS = [
  { label: 'Behance', url: 'https://www.behance.net/vincentvi' },
  { label: 'Instagram', url: 'https://www.instagram.com/vincentvi.me/' },
  { label: 'Fiverr', url: 'https://www.fiverr.com/sinsin' },
];

// Get a free access key at https://web3forms.com (takes 1 minute,
// only needs your email). Paste it between the quotes.
export const WEB3FORMS_ACCESS_KEY = '6f9abc9e-b523-4cd6-9f3a-9dd2fca4300e';
