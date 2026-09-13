'use strict';

/* =====================================================================
   PROFILE (EN): manifesto, capabilities, process, tools,
   experience, audiences, testimonials and FAQ.

   English mirror of src/data/profile.js. Same rule as the projects:
   what is verifiable is written; what depends on information only Igor
   has stays `null` and the page shows a "TO BE FILLED" block.
   Nothing is made up.
   ===================================================================== */

/* --------------------------------------------------------------------
   MANIFESTO: the voice of the site. Direct, no portfolio cliché.
   -------------------------------------------------------------------- */
const manifesto = [
  'Design is not the last step of a project. It is how a business decision becomes visible.',
  'I work where brand, communication and technology meet, because that is where the choices show up for whoever is on the other side of the screen.',
  'I do not separate strategy from execution. An idea that does not survive the final file was not a good idea.',
  'I use AI the way I use any other tool: to get to the right questions faster, not to skip the thinking.',
];

const bio =
  'I am a multidisciplinary designer with more than 11 years of work in branding, visual identity, art direction, marketing and digital products. I work from concept to execution: I build the brand, design the system that holds it up and stay with it until the piece is published. Over the last few years I brought generative AI into the process (image direction, concept exploration and production), keeping art direction judgment at the center.';

/* --------------------------------------------------------------------
   CAPABILITIES. The core difference: five fronts, one way of working.
   Each one spells out what actually comes out of it.
   -------------------------------------------------------------------- */
const capabilities = [
  {
    id: 'design',
    label: 'Design',
    line: 'The brand and the system that holds it up.',
    items: ['Branding', 'Visual identity', 'Art direction', 'Graphic design', 'Editorial', 'Visual systems'],
  },
  {
    id: 'strategy',
    label: 'Strategy',
    line: 'The decision that comes before the design.',
    items: ['Brand strategy', 'Creative strategy', 'Positioning', 'Message architecture', 'Communication'],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    line: 'The brand put into circulation.',
    items: ['Campaigns', 'Social', 'Content', 'Landing pages', 'E-commerce', 'Growth design'],
  },
  {
    id: 'technology',
    label: 'Technology',
    line: 'From the design file to the page going live.',
    items: ['Figma', 'Framer', 'HTML', 'CSS', 'JavaScript', 'No-code', 'Automation'],
  },
  {
    id: 'ai',
    label: 'AI',
    line: 'New tool, same old direction judgment.',
    items: ['Generative AI', 'Prompt engineering', 'Image direction', 'Curation', 'Assisted workflows'],
  },
];

/* --------------------------------------------------------------------
   PROCESS: seven steps, one line each. No corporate flowchart.
   -------------------------------------------------------------------- */
const process = [
  { n: '01', label: 'Discover', text: 'Understand the business, the audience and what already exists. Ask before proposing.' },
  { n: '02', label: 'Define', text: 'Turn the brief into a design problem with a scope and a success criterion.' },
  { n: '03', label: 'Concept', text: 'Find the idea that holds up everything that comes after. Reference, territory, concept.' },
  { n: '04', label: 'Design', text: 'Build the system: typography, color, grid, image, behavior.' },
  { n: '05', label: 'Prototype', text: 'Get it out of static. Test it on screen, on the piece, in real use.' },
  { n: '06', label: 'Execute', text: 'Take it all the way: files, applications, publishing, handoff.' },
  { n: '07', label: 'Optimize', text: 'Measure, adjust and document what worked for the next round.' },
];

/* --------------------------------------------------------------------
   VALUES
   -------------------------------------------------------------------- */
const values = [
  { title: 'Context before aesthetics', text: 'No visual decision defends itself. It answers a problem or it should not exist.' },
  { title: 'System before piece', text: 'A beautiful piece solves one day. A system solves the whole year.' },
  { title: 'Documented decisions', text: 'Whoever inherits the project needs to understand why it is the way it is, not just how to use it.' },
  { title: 'Execution all the way', text: 'Art direction that never reaches the final file is an opinion, not work.' },
  { title: 'New tool, old judgment', text: 'AI speeds up exploration. It does not replace the judgment of what is any good.' },
];

/* --------------------------------------------------------------------
   DESIGN × TECHNOLOGY: what he builds with each tool.
   Not a logo showcase.
   -------------------------------------------------------------------- */
const stack = [
  { name: 'Figma', kind: 'Design', text: 'Design systems, component libraries, clickable prototypes and handoff to dev.' },
  { name: 'Framer', kind: 'Web', text: 'Sites and landing pages that go live without waiting in a development queue.' },
  { name: 'HTML & CSS', kind: 'Code', text: 'Layout, typography and responsiveness controlled down to the detail. This site is hand-written.' },
  { name: 'JavaScript', kind: 'Code', text: 'Interface behavior: states, interactions, components and simple integrations.' },
  { name: 'No-code', kind: 'Product', text: 'Quickly assembling flows, forms and pages to validate before investing in a build.' },
  { name: 'Automation', kind: 'Process', text: 'Getting repetitive work out of the way: generating pieces, versioning, delivery.' },
  { name: 'Midjourney', kind: 'AI', text: 'Image direction, concept art and visual exploration at scale, with control over style.' },
  { name: 'ChatGPT & Claude', kind: 'AI', text: 'Structuring content, copy, research and code prototyping inside the workflow.' },
  { name: 'Runway', kind: 'AI', text: 'Movement out of a still image: teasers, transitions and video studies.' },
  { name: 'DALL·E', kind: 'AI', text: 'One-off generation and variation of graphic elements inside a direction already set.' },
  { name: 'Adobe CC', kind: 'Design', text: 'Illustrator, Photoshop and After Effects for brand, image treatment and motion.' },
  { name: 'Analytics', kind: 'Data', text: 'GA4 and Clarity to read real behavior and back design decisions with evidence.' },
];

/* --------------------------------------------------------------------
   EXPERIENCE: timeline.
   `period` and `titleRole` stay null while unconfirmed: the page shows
   the field marked as to be filled instead of guessing a date.
   -------------------------------------------------------------------- */
const experience = [
  {
    company: 'CPAPS',
    role: 'Designer · Marketing',
    period: null,
    current: true,
    summary:
      'Design and marketing in the sleep therapy market, covering brand, campaigns and digital channels.',
    responsibilities: [
      'Branding and visual system',
      'Campaigns and content',
      'Digital and e-commerce',
      'Landing pages',
      'AI applied to creative production',
    ],
    projects: ['cpaps-mes-do-sono', 'cpaps-ecommerce'],
    results: null,
  },
  {
    company: 'Client projects',
    role: 'Designer · Art direction',
    period: null,
    current: false,
    summary:
      'Brand, visual identity and art direction for telecom, food and service businesses.',
    responsibilities: [
      'Branding and rebranding',
      'Visual identity and applications',
      'Art direction for social',
      'Communication material',
    ],
    projects: ['avante-telecom', 'dom-campanholi', 'rn-telecom', 'top-burger'],
    results: null,
  },
];

/* Explicit slot for the earlier history, instead of leaving a hole in the timeline. */
const experienceNote =
  'Earlier history to be filled in: companies, roles and dates from the first years of work.';

/* --------------------------------------------------------------------
   NUMBERS. Only what is verifiable goes here. No invented vanity
   metrics: if a number cannot be backed up, it does not show up.
   To add one (projects delivered, brands served, awards), just add
   an object to this list.
   -------------------------------------------------------------------- */
const numbers = [
  { value: '11+', label: 'Years working' },
  { value: '5', label: 'Fronts, one process' },
  { value: '7', label: 'Documented case studies' },
  { value: '2', label: 'Doors: client and recruiter' },
];

/* --------------------------------------------------------------------
   AUDIENCES: the two doors into the site.
   -------------------------------------------------------------------- */
const audiences = {
  recruiter: {
    id: 'recruiter',
    kicker: 'For recruiters',
    title: 'I have an opportunity',
    line: 'Profile, experience and tools in under a minute.',
    cta: "Let's talk",
    message: 'Hi Igor! I have an opportunity and I would like to talk to you.',
    facts: [
      { label: 'Role', value: 'Multidisciplinary designer · Art direction' },
      { label: 'Experience', value: '11+ years' },
      { label: 'Location', value: 'Vitória, ES, Brazil' },
      { label: 'Work model', value: 'Remote · Hybrid' },
      { label: 'Languages', value: 'Portuguese' },
    ],
    brings: [
      { title: 'Strategic thinking', text: 'I get into the business problem before opening the file.' },
      { title: 'Visual direction', text: 'I set a visual standard and hold it across an entire project.' },
      { title: 'Autonomy', text: 'I take a project from brief to delivery without needing to be led.' },
      { title: 'Collaboration', text: 'I work with marketing, product and dev, speaking the language of each one.' },
      { title: 'Speed of execution', text: 'Short cycles between idea, piece and publication.' },
      { title: 'Technical command', text: 'From Figma to published HTML, with nobody translating in between.' },
      { title: 'Applied AI', text: 'I use AI in the creative process with direction judgment, not as a shortcut.' },
    ],
  },
  client: {
    id: 'client',
    kicker: 'For clients',
    title: 'I have a project',
    line: 'From brand positioning to the page going live.',
    cta: 'Start a project',
    message: 'Hi Igor! I have a project and I would like to talk.',
    problems: [
      { q: 'Need to create or reposition a brand?', a: 'Branding, visual identity and the system that keeps everything consistent after delivery.' },
      { q: 'Need to structure a campaign?', a: 'Concept, art direction and rollout across every piece and channel.' },
      { q: 'Need to improve your communication?', a: 'A visual standard, message hierarchy and material that speaks the same language everywhere.' },
      { q: 'Need a digital experience?', a: 'Landing pages, e-commerce and interfaces designed to convert, not just to please.' },
      { q: 'Need to speed up the creative process with AI?', a: 'Image generation and curation workflows that shorten production without losing direction.' },
    ],
  },
};

/* --------------------------------------------------------------------
   TESTIMONIALS: real content, already validated by Igor.

   `link` is optional and exists for one specific reason: a testimonial
   with nothing verifiable in it is the weakest form of social proof.
   The reader has no way of knowing whether Hudson exists. With a link
   to the person's LinkedIn or the company's site, the testimonial stops
   being text and becomes a reference.

   While it is `null`, the card renders exactly as it did before: no
   broken link, no invented destination. Igor just pastes the URL here
   and the link shows up on its own.
   -------------------------------------------------------------------- */
const testimonials = [
  {
    quote: 'Igor redid the whole visual identity of Avante Telecom. It turned out much more modern and professional, and clients noticed right away.',
    author: 'Hudson',
    company: 'Avante Telecom',
    initials: 'H',
    link: null,
  },
  {
    quote: 'The branding Igor did for Dom Campanholi gave the business a whole new face. We got a lot of compliments after the change.',
    author: 'Domingos',
    company: 'Dom Campanholi',
    initials: 'D',
    link: null,
  },
  {
    quote: 'The new visual identity brought Top Burger a lot more recognition. The social channels look much more appealing too.',
    author: 'Top Burger',
    company: 'Burger joint',
    initials: 'TB',
    link: null,
  },
  {
    quote: 'We hired Igor to rework the RN Telecom brand and the result beat our expectations. It looks much more solid and trustworthy.',
    author: 'RN Telecom',
    company: 'Telecommunications',
    initials: 'RN',
    link: null,
  },
];

/* Brands served: real names, taken from the testimonials and the work history. */
const clients = ['CPAPS', 'Avante Telecom', 'Dom Campanholi', 'RN Telecom', 'Top Burger'];

/* --------------------------------------------------------------------
   FAQ
   -------------------------------------------------------------------- */
const faq = [
  {
    q: 'What services do you offer?',
    a: 'Branding, visual identity, art direction, campaigns, UI/UX and growth design, with generative AI applied to the creative process when it makes sense for the project.',
  },
  {
    q: 'How does the process work?',
    a: 'It starts with a brief to understand the business and the goal, goes through research and concept, then refinement based on your feedback, up to the final delivery of the files and follow-up on how they are applied.',
  },
  {
    q: 'How long does a project usually take?',
    a: 'It depends on the scope. After the brief I give a specific deadline, but it averages between two and six weeks depending on complexity.',
  },
  {
    q: 'Do you work outside your region?',
    a: 'I work remotely, anywhere in Brazil. Communication happens over WhatsApp and video calls.',
  },
  {
    q: 'How many rounds of revision are included?',
    a: 'Every stage goes through rounds of adjustment based on your feedback, to make sure the final result reflects what you need.',
  },
  {
    q: 'How does pricing work?',
    a: 'Every project has a different scope, so the price is set after understanding the need. Send me a message telling me what you need and I will come back with a proposal.',
  },
  {
    q: 'How does AI come into the projects?',
    a: 'As a tool for exploration and production: generating references, concepts and images, always with curation and art direction on top. The judgment of what goes to the client stays human.',
  },
];

module.exports = {
  manifesto: manifesto,
  numbers: numbers,
  bio: bio,
  capabilities: capabilities,
  process: process,
  values: values,
  stack: stack,
  experience: experience,
  experienceNote: experienceNote,
  audiences: audiences,
  testimonials: testimonials,
  clients: clients,
  faq: faq,
};
