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
const STYLES = ['tokens.css', 'base.css', 'layout.css', 'components.css', 'sections.css', 'pages.css'];
const SCRIPTS = ['theme.js', 'nav.js', 'reveal.js', 'cursor.js', 'projects.js', 'stepper.js', 'form.js', 'cv.js', 'clock.js'];

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
   2. Capas de projeto — placeholders gerados só quando o arquivo
      real ainda não existe. Assim o site nunca mostra imagem quebrada,
      e no dia em que a arte real subir, o gerador não sobrescreve nada.
   --------------------------------------------------------------------- */
/* Placa editorial discreta. Duas exigências:
   1. Baixa saturação — é marcador de conteúdo ausente, não arte.
   2. Toda informação dentro da faixa central vertical (y 420–780), para
      sobreviver ao corte 21:9 do case destaque e ao 4:5 dos cards.      */
function placeholderCover(project) {
  /* A cor rotaciona pelo índice do projeto, não pelo hash do slug:
     hash colide e produz dois cards da mesma cor lado a lado na grade. */
  const i = parseInt(project.index, 10) - 1;
  const ink = '#0B0B0C';

  /* Mesma paleta de cards dos tokens: a grade de projetos ganha o ritmo
     de cor das referências mesmo antes da arte real subir. Todos os tons
     são claros o bastante para carregar texto preto nos dois temas. */
  const tones = ['#C9BCF2', '#FFD2B0', '#BFD9CA', '#D9F63E', '#C7D8F2', '#E8DCC8'];
  const bg = tones[i % tones.length];

  const marks = [
    `<circle cx="600" cy="600" r="250" fill="none" stroke="${ink}" stroke-width="2" opacity=".35"/>`,
    `<g fill="none" stroke="${ink}" stroke-width="2" opacity=".28"><rect x="360" y="360" width="480" height="480" rx="80"/><rect x="440" y="440" width="320" height="320" rx="60"/></g>`,
    `<path d="M350 720a250 250 0 0 1 500 0" fill="none" stroke="${ink}" stroke-width="2" opacity=".35"/><path d="M350 720h500" stroke="${ink}" stroke-width="1" opacity=".2"/>`,
    `<rect x="425" y="425" width="350" height="350" rx="60" fill="none" stroke="${ink}" stroke-width="2" opacity=".32" transform="rotate(45 600 600)"/>`,
  ][i % 4];

  const rules = [240, 480, 720, 960]
    .map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="1200" stroke="${ink}" stroke-width="1" opacity=".05"/>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200" role="img" aria-label="${project.client} — ${project.title}. Capa provisória.">
  <rect width="1200" height="1200" fill="${bg}"/>
  ${rules}
  ${marks}
  <g font-family="'JetBrains Mono',ui-monospace,monospace" text-anchor="middle" fill="${ink}">
    <text x="600" y="545" font-size="26" letter-spacing="8" opacity=".55">${project.index} · ${project.category.toUpperCase()}</text>
    <text x="600" y="615" font-size="52" letter-spacing="2">${project.client.toUpperCase()}</text>
    <text x="600" y="672" font-size="24" letter-spacing="6" opacity=".5">CAPA A SUBSTITUIR</text>
  </g>
</svg>
`;
}

let coversMade = 0;
projects.forEach(function (project) {
  const dest = path.join(ROOT, project.cover);
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, placeholderCover(project));
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
      { '@type': 'WebSite', url: site.baseUrl, name: site.name + ' — Portfólio', inLanguage: site.lang, publisher: { '@id': site.baseUrl + '#igor' } },
    ],
  },
  render: require('./src/templates/pages/home'),
});

pages.push({
  id: 'projects',
  path: 'projects.html',
  prefix: '',
  section: 'projects.html',
  title: 'Projetos — ' + site.name + ' | Branding, campanhas, digital e IA',
  description: 'Todos os projetos de ' + site.name + ': branding, identidade visual, campanhas, sistemas visuais, e-commerce, direção de arte e IA generativa.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      crumbs([{ name: 'Home', path: '' }, { name: 'Work', path: 'projects.html' }]),
      {
        '@type': 'ItemList',
        name: 'Projetos',
        itemListElement: projects.map(function (p, i) {
          return { '@type': 'ListItem', position: i + 1, name: p.client + ' — ' + p.title, url: site.baseUrl + 'work/' + p.slug + '.html' };
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
  title: 'Sobre — ' + site.name + ' | Manifesto, processo e ferramentas',
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
  title: 'Experiência e CV — ' + site.name + ' | Designer multidisciplinar',
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
  title: 'AI Lab — ' + site.name + ' | IA generativa com direção de arte',
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
  title: 'Contato — ' + site.name + ' | Projetos e oportunidades',
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
  title: 'Página não encontrada — ' + site.name,
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
    title: project.client + ' — ' + project.title + ' | ' + site.name,
    description: project.summary + ' Case de ' + site.name + ': ' + project.categories.join(', ').toLowerCase() + '.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        crumbs([{ name: 'Home', path: '' }, { name: 'Work', path: 'projects.html' }, { name: project.title, path: 'work/' + project.slug + '.html' }]),
        {
          '@type': 'CreativeWork',
          name: project.client + ' — ' + project.title,
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
   `lastmod` sai da data do último commit, não de "hoje": assim dois
   builds do mesmo código geram exatamente o mesmo arquivo, e o sitemap
   não anuncia mudança para o Google toda vez que alguém roda o build. */
let today;
try {
  today = require('child_process').execSync('git log -1 --format=%cs', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
} catch (e) {
  today = '';
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) today = new Date().toISOString().slice(0, 10);
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages
    .filter(function (p) { return !p.noindex; })
    .map(function (p) {
      const loc = site.baseUrl + (p.path === 'index.html' ? '' : p.path);
      const priority = p.path === 'index.html' ? '1.0' : p.id === 'case' ? '0.7' : '0.8';
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
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
if (coversMade) console.log('  ' + coversMade + ' capa(s) placeholder gerada(s) em assets/images/work/');
if (pending) console.log('  ⚠ ' + pending + ' case(s) com seções a preencher — ver src/data/projects.js');
console.log('');
