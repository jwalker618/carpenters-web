/* Site-wide settings. Editing this one file updates the name, contact
   details and Instagram handle everywhere on the site. */
export const site = {
  /** Business name — header wordmark, footer, browser tab. */
  name: 'AVM Timber Design',
  /** Maker's name, used in the About section and footer credit. */
  carpenterName: 'Anne van Mansvelt',
  /** One-line description used for SEO / social cards. */
  tagline: 'Bespoke joinery and fitted furniture, made by hand in North London.',

  /** Contact details — shown once, in the Contact/Instagram section. */
  email: 'anne@avmtimberdesign.co.uk',
  phone: '07990 641277',
  phoneIntl: '+447990641277',
  workshopLocation: 'North London · by appointment',

  /** Instagram — the primary "latest work" channel, surfaced via a QR card. */
  instagramHandle: 'avm_timberdesign',
};

/* Single-page nav: every link is an in-page anchor. */
export const nav = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#about', label: 'About' },
];
