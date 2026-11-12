'use strict';

/* =====================================================================
   SHELL: head, header, footer e JSON-LD.

   Uma página, um idioma. Não há prefixo de caminho a calcular nem raiz
   de idioma a distinguir: index.html e 404.html moram na raiz, junto
   com style.css, script.js e assets/, então todo link é relativo
   simples.
   ===================================================================== */

const site = require('../data/site');

/* Escape para qualquer texto vindo dos arquivos de dados. */
function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* Ícones inline: nenhum request extra, herdam currentColor. */
const icons = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  arrowUpRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  behance: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
};

/* Marca: o leão do site, como símbolo reutilizável. */
const sprite = `<svg class="sprite" aria-hidden="true" focusable="false"><symbol id="i-lion" viewBox="0 0 24 24"><g fill="currentColor"><ellipse cx="12" cy="5.6" rx="2.3" ry="3.5"/><ellipse cx="12" cy="5.6" rx="2.3" ry="3.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="5.6" rx="2.3" ry="3.5" transform="rotate(120 12 12)"/><ellipse cx="12" cy="5.6" rx="2.3" ry="3.5" transform="rotate(180 12 12)"/><ellipse cx="12" cy="5.6" rx="2.3" ry="3.5" transform="rotate(240 12 12)"/><ellipse cx="12" cy="5.6" rx="2.3" ry="3.5" transform="rotate(300 12 12)"/><circle cx="12" cy="12" r="4.6"/></g></symbol></svg>`;

/* Uma única requisição de fonte, subset latino, pesos mínimos. */
const FONTS =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=swap';

function head(page, assets) {
  const canonical = site.baseUrl + (page.path === 'index.html' ? '' : page.path);
  const image = site.baseUrl + site.seo.image;

  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="author" content="${esc(site.name)}">
<meta name="robots" content="${page.noindex ? 'noindex, follow' : 'index, follow'}">
<meta name="theme-color" content="#0B0B0C" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#F3F2EE" media="(prefers-color-scheme: light)">
<link rel="canonical" href="${esc(canonical)}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:locale" content="${site.locale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${esc(image)}">

<link rel="icon" type="image/svg+xml" href="assets/icons/favicon.svg">
<link rel="apple-touch-icon" href="assets/images/profile.jpg">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="${FONTS}">
<link rel="stylesheet" href="${FONTS}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="${FONTS}"></noscript>

<script>(function(){var r=document.documentElement;r.classList.add('js');try{var t=localStorage.getItem('theme');r.setAttribute('data-theme',t||'dark');}catch(e){r.setAttribute('data-theme','dark');}})();</script>

<link rel="stylesheet" href="style.css?v=${assets.css}">

<script type="application/ld+json">${JSON.stringify(page.jsonLd, null, 0)}</script>`;
}

function analytics() {
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.analytics.ga}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${site.analytics.ga}');</script>
<script>(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${site.analytics.clarity}");</script>`;
}

/* Header colado no topo por CSS (position: sticky), sem JavaScript.
   Com três destinos, a navegação cabe na tela em qualquer largura, e
   por isso não existe mais menu mobile: era uma tela cheia, com foco
   preso e Esc, para esconder três links. No 404 as âncoras não levam a
   nada, então lá a navegação não é impressa. */
function header(page) {
  const av = site.availability;
  const nav = page.anchors === false
    ? ''
    : `<nav class="nav" aria-label="Seções do site">
      <ul class="nav__list">${site.nav
        .map(function (item) { return `<li><a class="nav__link" href="${item.href}">${esc(item.label)}</a></li>`; })
        .join('')}</ul>
    </nav>`;

  return `<a class="skip-link" href="#main">Pular para o conteúdo</a>
<header class="header" id="header">
  <div class="header__inner">
    <a class="brand" href="${page.path === 'index.html' ? '#header' : 'index.html'}" aria-label="${esc(site.name)}, início">
      <span class="brand__mark" aria-hidden="true"><svg><use href="#i-lion"/></svg></span>
      <span class="brand__name">Igor Araujo</span>
    </a>

    ${nav}

    <div class="header__actions">
      <span class="status${av.open ? ' is-open' : ''}" title="${esc(av.open ? av.labelOpen : av.labelClosed)}">
        <span class="status__dot" aria-hidden="true"></span>
        <span class="status__text">${av.open ? 'Disponível' : 'Agenda fechada'}</span>
      </span>
      <button class="icon-btn" id="themeToggle" type="button" aria-label="Alternar tema claro e escuro">
        <span class="icon-btn__sun">${icons.sun}</span>
        <span class="icon-btn__moon">${icons.moon}</span>
      </button>
    </div>
  </div>
</header>`;
}

function footer() {
  const year = new Date().getFullYear();
  const c = site.contacts;

  return `<footer class="footer" id="footer">
  <div class="footer__top">
    <div class="footer__brand">
      <p class="footer__statement">${esc(site.statement)}</p>
      <span class="status${site.availability.open ? ' is-open' : ''}">
        <span class="status__dot" aria-hidden="true"></span>
        <span class="status__text">${esc(site.availability.open ? site.availability.labelOpen : site.availability.labelClosed)}</span>
      </span>
    </div>

    <nav class="footer__col" aria-label="Redes e contato">
      <h2 class="footer__title">Contato</h2>
      <ul>
        <li><a href="${site.whatsapp('Olá, Igor! Vim pelo seu portfólio.')}" target="_blank" rel="noopener noreferrer">WhatsApp ${icons.arrowUpRight}</a></li>
        <li><a href="mailto:${c.email}">E-mail ${icons.arrowUpRight}</a></li>
        <li><a href="${c.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ${icons.arrowUpRight}</a></li>
        <li><a href="${c.behance}" target="_blank" rel="noopener noreferrer">Behance ${icons.arrowUpRight}</a></li>
        <li><a href="${c.instagram}" target="_blank" rel="noopener noreferrer">Instagram ${icons.arrowUpRight}</a></li>
      </ul>
    </nav>

    <div class="footer__col">
      <h2 class="footer__title">Colofão</h2>
      <ul class="footer__colophon">
        <li>Space Grotesk · Instrument Serif · Inter · JetBrains Mono</li>
        <li>HTML, CSS e JavaScript escritos à mão</li>
        <li>Sem framework, sem dependência</li>
        <li>${esc(site.location)}</li>
      </ul>
    </div>
  </div>

  <div class="footer__bottom">
    <p>© ${year} ${esc(site.name)}</p>
    <p class="footer__meta">${esc(site.locationShort)}</p>
    <a class="footer__top-link" href="#header">Voltar ao topo ${icons.arrow}</a>
  </div>
</footer>`;
}

/* A ordem aqui não é estética.

   O charset tem que ser a primeira coisa do <head>: a especificação
   pede ele dentro dos primeiros 1024 bytes, e quando não é, o navegador
   pode ter que jogar fora o que já parseou e recomeçar com outra
   codificação.

   E medição de audiência não é recurso crítico: os dois scripts se
   injetam sozinhos e funcionam em qualquer ponto do documento, então
   vão para o fim do body, depois do script do próprio site. Assim
   nenhum request de terceiro disputa a fila com o que desenha a
   página. */
function render(page, assets) {
  return `<!doctype html>
<html lang="${site.lang}" data-page="${esc(page.id)}">
<head>
${head(page, assets)}
</head>
<body>
${sprite}
${header(page)}
<main id="main" class="main">
${page.body}
</main>
${footer()}
<script src="script.js?v=${assets.js}" defer></script>
${analytics()}
</body>
</html>
`;
}

module.exports = { render: render, esc: esc, icons: icons };
