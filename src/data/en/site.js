'use strict';

/* =====================================================================
   SITE (EN): identity, contacts, navigation and default SEO.
   English mirror of src/data/site.js. Same keys, same order, same
   types. Only the visible copy changes, plus `lang` and `locale`.
   ===================================================================== */

const site = {
  baseUrl: 'https://igoraraujodj.github.io/link-bio/',
  lang: 'en',
  locale: 'en_US',

  name: 'Igor Araujo',
  role: 'Multidisciplinary designer',
  roleLong: 'Multidisciplinary designer · Art direction · Creative technologist',
  disciplines: ['Branding', 'Marketing', 'Technology', 'AI'],
  statement:
    'I turn strategy into brands, campaigns and digital products, from concept to execution.',
  location: 'Vitória, ES, Brazil',
  locationShort: 'Vitória, ES',
  timezone: 'America/Sao_Paulo',
  experienceYears: '11+',

  // Availability shown in the header and the hero. Switch to false when the books close.
  availability: {
    open: true,
    labelOpen: 'Available for projects and opportunities',
    labelClosed: 'Books closed at the moment',
  },

  contacts: {
    whatsapp: '5527988112354',
    email: 'mkt.igor2022@gmail.com',
    linkedin: 'https://www.linkedin.com/in/igor-araujo-rafael-299566207/',
    behance: 'https://www.behance.net/igoraraujo8',
    instagram: 'https://www.instagram.com/igoraraujo_dg/',
  },

  // Optional PDF. If the file is missing, the button falls back to the web version
  // of the experience page (checked at click time, see src/scripts/cv.js).
  cv: {
    file: 'assets/cv/igor-araujo-cv.pdf',
    webFallback: 'experience.html',
  },

  analytics: {
    ga: 'G-9B9CF7047F',
    clarity: 'xr9glcqi1r',
  },

  nav: [
    { label: 'Work', href: 'projects.html' },
    { label: 'About', href: 'about.html' },
    { label: 'Experience', href: 'experience.html' },
    { label: 'AI Lab', href: 'ai-lab.html' },
    { label: 'Contact', href: 'contact.html' },
  ],

  seo: {
    title: 'Igor Araujo, Multidisciplinary Designer | Branding, Marketing, Technology and AI',
    description:
      'Multidisciplinary designer specialized in branding, art direction, marketing, digital experiences, technology and artificial intelligence.',
    image: 'assets/images/profile.jpg',
  },
};

/* Pre-filled WhatsApp messages, by context. */
site.whatsapp = function (message) {
  return 'https://wa.me/' + site.contacts.whatsapp + '?text=' + encodeURIComponent(message);
};

module.exports = site;
