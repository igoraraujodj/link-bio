#!/usr/bin/env node
'use strict';

/* =====================================================================
   BUILD — gerador estático, zero dependências.

     node build.js

   Lê src/data + src/templates e escreve os HTML na raiz, prontos para o
   GitHub Pages servir sem nenhuma etapa extra. CSS e JS são concatenados
   em um arquivo cada, com hash de conteúdo na URL para cache busting.

   Para publicar uma alteração de conteúdo: edite src/data/*.js,
   rode `node build.js`, confira e faça commit dos arquivos gerados.
   ===================================================================== */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const site = require('./src/data/site');
const { projects } = require('./src/data/projects');
const profile = require('./src/data/profile');
const layout = require('./src/templates/layout');
const covers = require('./src/covers');

const ROOT = __dirname;
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const hash = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 8);

function write(rel, content) {
  const dest = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);
  return rel;
}

/* ---------------------------------------------------------------------
   1. Bundles — ordem explícita, sem magia de glob.
   --------------------------------------------------------------------- */
const STYLES = ['tokens.css', 'base.css', 'layout.css', 'components.css', 'sections.css', 'pages.css', 'motion.css'];
const SCRIPTS = ['theme.js', 'nav.js', 'reveal.js', 'cursor.js', 'projects.js', 'stepper.js', 'form.js', 'cv.js', 'clock.js', 'cta.js', 'carousel.js', 'viewer.js', 'motion.js'];

function bundle(dir, files, banner) {
  return (
    banner +
    files
      .map(function (f) {
        return '\n/* ---- ' + f + ' ---- */\n' + read(path.join('src', dir, f)).trim() + '\n';
      })
      .join('')
  );
}

const css = bundle('styles', STYLES, '/* Igor Araujo — gerado por build.js. Edite src/styles/, não este arquivo. */\n');
const js = bundle(
  'scripts',
  SCRIPTS,
  "'use strict';\n/* Igor Araujo — gerado por build.js. Edite src/scripts/, não este arquivo. */\n"
);

const assets = { css: hash(css), js: hash(js) };

/* ---------------------------------------------------------------------
   2. Capas de projeto.

   Ordem de preferência, por projeto:

     1. Uma foto real em assets/images/work/<slug>.<jpg|png|webp|avif>.
        Basta o Igor jogar o arquivo na pasta: a build acha sozinha e
        passa a usar, sem editar nenhum dado.
     2. Um SVG que alguém colocou ali à mão (sem o marcador da build).
     3. A capa gráfica desenhada em src/covers.js, regerada a cada build.

   O marcador existe justamente para separar o caso 2 do caso 3: a build
   só sobrescreve arquivo que ela mesma escreveu.
   --------------------------------------------------------------------- */
const RASTER = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
const WORK_DIR = 'assets/images/work';

let coversMade = 0;
let coversReal = 0;

projects.forEach(function (project) {
  const real = RASTER.map(function (ext) { return WORK_DIR + '/' + project.slug + ext; })
    .find(function (rel) { return fs.existsSync(path.join(ROOT, rel)); });

  if (real) {
    project.cover = real;
    coversReal++;
    return;
  }

  const rel = WORK_DIR + '/' + project.slug + '.svg';
  const dest = path.join(ROOT, rel);
  project.cover = rel;

  if (fs.existsSync(dest) && fs.readFileSync(dest, 'utf8').indexOf(covers.MARK) === -1) return;

  const svg = covers.cover(project);
  /* Só escreve se mudou: assim a build não suja o git a cada rodada. */
  if (!fs.existsSync(dest) || fs.readFileSync(dest, 'utf8') !== svg) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, svg);
    coversMade++;
  }
});

/* ---------------------------------------------------------------------
   3. Structured data
   --------------------------------------------------------------------- */
const personLd = {
  '@type': 'Person',
  '@id': site.baseUrl + '#igor',
  name: site.name,
  jobTitle: site.role,
  description: site.seo.description,
  url: site.baseUrl,
  image: site.baseUrl + site.seo.image,
  email: 'mailto:' + site.contacts.email,
  address: { '@type': 'PostalAddress', addressLocality: 'Vitória', addressRegion: 'ES', addressCountry: 'BR' },
  knowsAbout: ['Branding', 'Identidade visual', 'Direção de arte', 'UI/UX', 'Growth design', 'Marketing digital', 'Inteligência artificial generativa'],
  sameAs: [site.contacts.linkedin, site.contacts.behance, site.contacts.instagram],
};

function crumbs(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(function (it, i) {
      return { '@type': 'ListItem', position: i + 1, name: it.name, item: site.baseUrl + it.path };
    }),
  };
}

/* ---------------------------------------------------------------------
   4. Páginas
   --------------------------------------------------------------------- */
const pages = [];

pages.push({
  id: 'home',
  path: 'index.html',
  prefix: '',
  title: site.seo.title,
  description: site.seo.description,
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      personLd,
      { '@type': 'WebSite', url: site.baseUrl, name: 'Portfólio de ' + site.name, inLanguage: site.lang, publisher: { '@id': site.baseUrl + '#igor' } },
    ],
  },
  render: require('./src/templates/pages/home'),
});

pages.push({
  id: 'projects',
  path: 'projects.html',
  prefix: '',
  section: 'projects.html',
  title: 'Projetos de ' + site.name + ' | Branding, campanhas, digital e IA',
  description: 'Todos os projetos de ' + site.name + ': branding, identidade visual, campanhas, sistemas visuais, e-commerce, direção de arte e IA generativa.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      crumbs([{ name: 'Home', path: '' }, { name: 'Work', path: 'projects.html' }]),
      {
        '@type': 'ItemList',
        name: 'Projetos',
        itemListElement: projects.map(function (p, i) {
          return { '@type': 'ListItem', position: i + 1, name: p.client + ': ' + p.title, url: site.baseUrl + 'work/' + p.slug + '.html' };
        }),
      },
    ],
  },
  render: require('./src/templates/pages/projects'),
});

pages.push({
  id: 'about',
  path: 'about.html',
  prefix: '',
  title: 'Sobre ' + site.name + ' | Manifesto, processo e ferramentas',
  description: 'Manifesto, perfil profissional, especialidades, processo criativo, ferramentas e valores de ' + site.name + ', designer multidisciplinar.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [crumbs([{ name: 'Home', path: '' }, { name: 'About', path: 'about.html' }]), { '@type': 'AboutPage', mainEntity: { '@id': site.baseUrl + '#igor' } }],
  },
  render: require('./src/templates/pages/about'),
});

pages.push({
  id: 'experience',
  path: 'experience.html',
  prefix: '',
  title: 'Experiência e CV de ' + site.name + ' | Designer multidisciplinar',
  description: 'Trajetória profissional, responsabilidades, competências e currículo de ' + site.name + '. ' + site.experienceYears + ' anos em branding, marketing e produto digital.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [crumbs([{ name: 'Home', path: '' }, { name: 'Experience', path: 'experience.html' }]), { '@type': 'ProfilePage', mainEntity: { '@id': site.baseUrl + '#igor' } }],
  },
  render: require('./src/templates/pages/experience'),
});

pages.push({
  id: 'ai-lab',
  path: 'ai-lab.html',
  prefix: '',
  title: 'AI Lab de ' + site.name + ' | IA generativa com direção de arte',
  description: 'Experimentação visual e direção de arte com inteligência artificial generativa: do conceito ao prompt, da curadoria ao resultado aplicado.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [crumbs([{ name: 'Home', path: '' }, { name: 'AI Lab', path: 'ai-lab.html' }]), { '@type': 'CollectionPage', name: 'AI Lab', about: 'Inteligência artificial generativa aplicada a design e direção de arte' }],
  },
  render: require('./src/templates/pages/ailab'),
});

pages.push({
  id: 'contact',
  path: 'contact.html',
  prefix: '',
  title: 'Falar com ' + site.name + ' | Projetos e oportunidades',
  description: 'Duas portas: comece um projeto ou apresente uma oportunidade. WhatsApp, e-mail, LinkedIn e Behance de ' + site.name + '.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      crumbs([{ name: 'Home', path: '' }, { name: 'Contact', path: 'contact.html' }]),
      { '@type': 'ContactPage', mainEntity: { '@id': site.baseUrl + '#igor' } },
      {
        '@type': 'FAQPage',
        mainEntity: profile.faq.map(function (f) {
          return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } };
        }),
      },
    ],
  },
  render: require('./src/templates/pages/contact'),
});

pages.push({
  id: 'not-found',
  path: '404.html',
  prefix: '',
  noindex: true,
  title: 'Página não encontrada | ' + site.name,
  description: 'A página que você procurava não existe. Volte ao portfólio de ' + site.name + '.',
  jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: '404' },
  render: require('./src/templates/pages/notfound'),
});

/* Um HTML por case — metadata individual, como o brief pede. */
const casePage = require('./src/templates/pages/case');
projects.forEach(function (project) {
  pages.push({
    id: 'case',
    path: 'work/' + project.slug + '.html',
    prefix: '../',
    section: 'projects.html',
    ogType: 'article',
    image: project.cover,
    title: project.client + ': ' + project.title + ' | ' + site.name,
    description: project.summary + ' Case de ' + site.name + ': ' + project.categories.join(', ').toLowerCase() + '.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        crumbs([{ name: 'Home', path: '' }, { name: 'Work', path: 'projects.html' }, { name: project.title, path: 'work/' + project.slug + '.html' }]),
        {
          '@type': 'CreativeWork',
          name: project.client + ': ' + project.title,
          description: project.summary,
          url: site.baseUrl + 'work/' + project.slug + '.html',
          image: site.baseUrl + project.cover,
          creator: { '@id': site.baseUrl + '#igor' },
          keywords: project.tags.join(', '),
          genre: project.category,
        },
      ],
    },
    render: function (prefix) {
      return casePage(project, prefix);
    },
  });
});

/* ---------------------------------------------------------------------
   5. Escrita
   --------------------------------------------------------------------- */
const written = [];

written.push(write('style.css', css));
written.push(write('script.js', js));

pages.forEach(function (page) {
  page.body = page.render(page.prefix);
  written.push(write(page.path, layout.render(page, assets)));
});

/* Sitemap — só páginas indexáveis.

   Sem `lastmod`, de propósito. A build precisa ser determinística para
   o CI conferir que os arquivos gerados batem com src/, e qualquer data
   automática quebra isso:

     - "hoje" muda a cada build;
     - a data do último commit é circular — o commit que grava o sitemap
       vira o último commit, então o build seguinte gera outra data.
       Foi exatamente assim que o CI quebrou uma vez.

   `lastmod` é opcional no protocolo e tratado como dica fraca pelos
   buscadores, então sai barato. Se um dia fizer falta, o caminho é
   declarar a data por página nos arquivos de dados, à mão. */
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages
    .filter(function (p) { return !p.noindex; })
    .map(function (p) {
      const loc = site.baseUrl + (p.path === 'index.html' ? '' : p.path);
      const priority = p.path === 'index.html' ? '1.0' : p.id === 'case' ? '0.7' : '0.8';
      return `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n') +
  '\n</urlset>\n';
written.push(write('sitemap.xml', sitemap));

written.push(
  write('robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: ' + site.baseUrl + 'sitemap.xml\n')
);

/* ---------------------------------------------------------------------
   6. Relatório
   --------------------------------------------------------------------- */
const kb = (n) => (n / 1024).toFixed(1) + ' kB';
const pending = projects.filter(function (p) { return !p.complete; }).length;

console.log('\n  Igor Araujo — build\n  ' + '─'.repeat(52));
written.forEach(function (f) {
  console.log('  ✓ ' + f.padEnd(38) + kb(fs.statSync(path.join(ROOT, f)).size).padStart(10));
});
console.log('  ' + '─'.repeat(52));
console.log('  ' + pages.length + ' páginas · ' + projects.length + ' cases · css ' + assets.css + ' · js ' + assets.js);
if (coversMade) console.log('  ' + coversMade + ' capa(s) grafica(s) escrita(s) em ' + WORK_DIR + '/');
if (coversReal) console.log('  ' + coversReal + ' capa(s) com imagem real');
if (coversReal < projects.length) console.log('  ' + (projects.length - coversReal) + ' case(s) ainda sem foto do trabalho: solte o arquivo em ' + WORK_DIR + '/<slug>.jpg');
if (pending) console.log('  ⚠ ' + pending + ' case(s) com seções a preencher — ver src/data/projects.js');
console.log('');
