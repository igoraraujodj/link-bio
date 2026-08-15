'use strict';

/* =====================================================================
   SITE: identidade, contatos, navegação e SEO padrão.
   Fonte única de verdade. Nenhum componente inventa esses valores.
   ===================================================================== */

const site = {
  baseUrl: 'https://igoraraujodj.github.io/link-bio/',
  lang: 'pt-BR',
  locale: 'pt_BR',

  name: 'Igor Araujo',
  role: 'Designer multidisciplinar',
  roleLong: 'Designer multidisciplinar · Direção de arte · Creative technologist',
  disciplines: ['Branding', 'Marketing', 'Technology', 'AI'],
  statement:
    'Transformo estratégia em marcas, campanhas e produtos digitais, do conceito à execução.',
  location: 'Vitória, ES, Brasil',
  locationShort: 'Vitória, ES',
  timezone: 'America/Sao_Paulo',
  experienceYears: '11+',

  // Disponibilidade exibida no header e no hero. Troque para false quando fechar agenda.
  availability: {
    open: true,
    labelOpen: 'Disponível para projetos e oportunidades',
    labelClosed: 'Agenda fechada no momento',
  },

  contacts: {
    whatsapp: '5527988112354',
    email: 'mkt.igor2022@gmail.com',
    linkedin: 'https://www.linkedin.com/in/igor-araujo-rafael-299566207/',
    behance: 'https://www.behance.net/igoraraujo8',
    instagram: 'https://www.instagram.com/igoraraujo_dg/',
  },

  // PDF opcional. Se o arquivo não existir, o botão cai na versão web da experiência
  // (checagem em tempo de clique, ver src/scripts/cv.js).
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
    title: 'Igor Araujo, Designer Multidisciplinar | Branding, Marketing, Tecnologia e IA',
    description:
      'Designer multidisciplinar especializado em branding, direção de arte, marketing, experiências digitais, tecnologia e inteligência artificial.',
    image: 'assets/images/profile.jpg',
  },
};

/* Mensagens pré-preenchidas do WhatsApp, por contexto. */
site.whatsapp = function (message) {
  return 'https://wa.me/' + site.contacts.whatsapp + '?text=' + encodeURIComponent(message);
};

module.exports = site;
