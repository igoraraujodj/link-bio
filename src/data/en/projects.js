'use strict';

/* =====================================================================
   PROJECTS / CASE STUDIES (EN)
   ---------------------------------------------------------------------
   English mirror of src/data/projects.js. Same objects, same order,
   same number of items. Only the visible copy is translated: `slug`
   and `cover` stay identical so URLs and image files match.

   HONESTY RULE
   Fields with real content are filled in. Fields that depend on
   information only Igor has (metrics, timelines, contracted scope,
   process detail) stay `null`, and the page renders a visible
   "TO BE FILLED" block explaining what belongs there. Nothing is made up.

   STRUCTURE
   slug        URL identifier: work/<slug>.html (never translated)
   title       project name
   client      client / brand
   year        year (null while unconfirmed)
   category    main category (used by the filter)
   categories  every category the project belongs to
   summary     one line, shown on the card and in the meta description
   role        what Igor did (required: recruiters need to know)
   tools       tools used
   tags        case study keywords
   cover       cover image (never translated)
   featured    appears in "Selected Work" on the home page
   spotlight   becomes the full-bleed highlight case on the home page (only one)
   study       the case narrative (see below)
   gallery     case images, in order
   ===================================================================== */

/* Copy reused in the "to be filled" block, by section type. */
const HINT = {
  context: "The client's situation when the project started: market, brand moment, what already existed.",
  challenge: 'The concrete problem the project had to solve.',
  objective: 'What had to be achieved, in business and communication terms.',
  strategy: 'How the problem was approached: the thinking before the design.',
  concept: 'The central idea that holds the whole execution together.',
  execution: 'Where the solution was applied: pieces, channels, touchpoints.',
  results: 'The result achieved. If there is no number, describe the qualitative result.',
};

const projects = [
  {
    slug: 'cpaps-mes-do-sono',
    title: 'Sleep Month',
    client: 'CPAPS',
    year: null,
    category: 'Campaign',
    categories: ['Campaign', 'Branding', 'Digital', 'Marketing'],
    summary:
      'Seasonal sleep awareness campaign, from concept to running across digital channels.',
    role: ['Art direction', 'Campaign concept', 'Design', 'Digital', 'Production'],
    tools: ['Figma', 'Photoshop', 'Illustrator', 'After Effects', 'Generative AI'],
    tags: ['Seasonal campaign', 'Health', 'Content', 'Performance'],
    cover: 'assets/images/work/cpaps-mes-do-sono.svg',
    featured: true,
    spotlight: true,
    study: {
      context: null,
      challenge: null,
      objective: null,
      strategy: null,
      concept: null,
      execution: null,
      results: null,
    },
    gallery: [],
  },

  {
    slug: 'avante-telecom',
    title: 'Avante Telecom Rebranding',
    client: 'Avante Telecom',
    year: null,
    category: 'Branding',
    categories: ['Branding', 'Visual identity', 'Art direction'],
    summary:
      'Rebuilding the visual identity of a regional carrier, from brand to application.',
    role: ['Branding', 'Visual identity', 'Art direction', 'Applications'],
    tools: ['Illustrator', 'Figma', 'Photoshop'],
    tags: ['Rebrand', 'Telecom', 'Visual system', 'Application'],
    cover: 'assets/images/work/avante-telecom.svg',
    featured: true,
    study: {
      context: null,
      challenge: null,
      objective: null,
      strategy: null,
      concept: null,
      execution: null,
      // Real qualitative result, in the client's own words (same testimonial shown on the site).
      results: {
        type: 'qualitative',
        quote:
          'Igor redid the whole visual identity of Avante Telecom. It turned out much more modern and professional, and clients noticed right away.',
        author: 'Hudson',
        company: 'Avante Telecom',
      },
    },
    gallery: [],
  },

  {
    slug: 'dom-campanholi',
    title: 'Dom Campanholi Identity',
    client: 'Dom Campanholi',
    year: null,
    category: 'Branding',
    categories: ['Branding', 'Visual identity', 'Art direction'],
    summary:
      'Brand and visual system built to reposition the business in how people see it.',
    role: ['Branding', 'Visual identity', 'Art direction'],
    tools: ['Illustrator', 'Photoshop', 'Figma'],
    tags: ['Brand', 'Visual system', 'Repositioning'],
    cover: 'assets/images/work/dom-campanholi.svg',
    featured: true,
    study: {
      context: null,
      challenge: null,
      objective: null,
      strategy: null,
      concept: null,
      execution: null,
      results: {
        type: 'qualitative',
        quote:
          'The branding Igor did for Dom Campanholi gave the business a whole new face. We got a lot of compliments after the change.',
        author: 'Domingos',
        company: 'Dom Campanholi',
      },
    },
    gallery: [],
  },

  {
    slug: 'rn-telecom',
    title: 'RN Telecom Visual System',
    client: 'RN Telecom',
    year: null,
    category: 'Visual system',
    categories: ['Visual system', 'Branding', 'Art direction'],
    summary:
      'Brand overhaul focused on solidity and consistency across every touchpoint.',
    role: ['Branding', 'Visual system', 'Art direction'],
    tools: ['Illustrator', 'Figma'],
    tags: ['Rebrand', 'Telecom', 'Consistency', 'Guidelines'],
    cover: 'assets/images/work/rn-telecom.svg',
    featured: true,
    study: {
      context: null,
      challenge: null,
      objective: null,
      strategy: null,
      concept: null,
      execution: null,
      results: {
        type: 'qualitative',
        quote:
          'We hired Igor to rework the RN Telecom brand and the result beat our expectations. It looks much more solid and trustworthy.',
        author: 'RN Telecom',
        company: 'Telecommunications',
      },
    },
    gallery: [],
  },

  {
    slug: 'top-burger',
    title: 'Top Burger',
    client: 'Top Burger',
    year: null,
    category: 'Art direction',
    categories: ['Art direction', 'Branding', 'Social'],
    summary:
      'Identity and art direction for social, focused on recognition and visual appetite.',
    role: ['Visual identity', 'Art direction', 'Social media'],
    tools: ['Illustrator', 'Photoshop', 'Figma'],
    tags: ['Food', 'Social', 'Identity', 'Art direction'],
    cover: 'assets/images/work/top-burger.svg',
    featured: true,
    study: {
      context: null,
      challenge: null,
      objective: null,
      strategy: null,
      concept: null,
      execution: null,
      results: {
        type: 'qualitative',
        quote:
          'The new visual identity brought Top Burger a lot more recognition. The social channels look much more appealing too.',
        author: 'Top Burger',
        company: 'Burger joint',
      },
    },
    gallery: [],
  },

  {
    slug: 'cpaps-ecommerce',
    title: 'E-commerce experience',
    client: 'CPAPS',
    year: null,
    category: 'Digital',
    categories: ['Digital', 'UI/UX', 'Marketing'],
    summary:
      'Interface and purchase journey designed to cut friction and hold the brand up in digital.',
    role: ['UI design', 'UX', 'Visual direction', 'Landing pages', 'CRO'],
    tools: ['Figma', 'HTML', 'CSS', 'No-code'],
    tags: ['E-commerce', 'UI', 'Journey', 'Conversion'],
    cover: 'assets/images/work/cpaps-ecommerce.svg',
    featured: true,
    study: {
      context: null,
      challenge: null,
      objective: null,
      strategy: null,
      concept: null,
      execution: null,
      results: null,
    },
    gallery: [],
  },

  {
    slug: 'ai-direcao-de-imagem',
    title: 'Image direction with AI',
    client: 'Self-initiated project',
    year: null,
    category: 'AI',
    categories: ['AI', 'Art direction', 'Digital'],
    summary:
      'Generative AI as a step in art direction: from reference to the final approved frame.',
    role: ['Art direction', 'Prompt engineering', 'Curation', 'Post-production'],
    tools: ['Midjourney', 'Photoshop', 'Runway', 'ChatGPT'],
    tags: ['Generative AI', 'Concept', 'Image direction', 'Workflow'],
    cover: 'assets/images/work/ai-direcao-de-imagem.svg',
    featured: true,
    study: {
      context:
        'Generative AI stopped being a novelty and became a production step. What separates a usable result from generic stock is not the model, it is the direction.',
      challenge: null,
      objective: null,
      strategy:
        'Treat the model like a hired photographer: a clear brief, light and framing references, several rounds, and hard curation. The prompt is the brief, not the work.',
      concept: null,
      execution: null,
      results: null,
    },
    gallery: [],
  },
];

/* --------------------------------------------------------------------
   Derived: calculated, never written by hand.
   -------------------------------------------------------------------- */

/* Editorial index: 01, 02, 03… in the order they appear above. */
projects.forEach(function (project, i) {
  project.index = String(i + 1).padStart(2, '0');

  /* A case study is "complete" once the whole narrative is filled in. */
  project.pending = Object.keys(project.study).filter(function (key) {
    return project.study[key] === null;
  });
  project.complete = project.pending.length === 0;
});

/* Unique categories, in order of first appearance, for the filters. */
const categories = [];
projects.forEach(function (project) {
  project.categories.forEach(function (category) {
    if (categories.indexOf(category) === -1) categories.push(category);
  });
});

module.exports = { projects: projects, categories: categories, HINT: HINT };
