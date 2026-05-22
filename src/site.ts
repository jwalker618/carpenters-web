/* Site-wide settings. Editing this one file updates Anne's name,
   contact details and social links everywhere on the site. */
export const site = {
  /** Business / site name shown in the header brand and browser tab. */
  name: 'AVM Timber Design',
  /** Anne's name, used on the About page and footer copyright. */
  carpenterName: 'Anne van Mansvelt',
  /** One-line tagline shown on the home page hero. */
  tagline: 'Bespoke timber joinery, drawn and made in London.',

  /** Contact details — shown on the Contact page and in the footer. */
  email: 'anne@avmtimberdesign.co.uk',
  phone: '07990 641277',
  workshopLocation: 'London',
  /** Full address, rendered as separate lines on the Contact page. */
  addressLines: ['3 Ardilaun Road', 'London N5 2QR'],

  /* Web3Forms access key for the contact form. Get a free key at
     https://web3forms.com (just enter your email — no account needed),
     then paste it here. Until then the form will not send. */
  web3formsAccessKey: 'YOUR_WEB3FORMS_ACCESS_KEY',

  /* Social links. Leave a value as an empty string to hide that link. */
  social: {
    instagram: '',
    facebook: '',
    pinterest: '',
  },

  /* Instagram feed (Behold.so). Free to set up:
       1. Sign in at https://behold.so with the Instagram account.
       2. Behold gives you a Feed ID — paste it below.
     Until then, the "From the workshop" strip on the home page shows
     setup instructions instead of photos. The Instagram handle is also
     used to render an "@handle →" link next to the strip. */
  beholdFeedId: 'YOUR_BEHOLD_FEED_ID',
  instagramHandle: '',
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact' },
];
