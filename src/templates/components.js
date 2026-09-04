'use strict';

const site = require('../data/site');
const { esc, icons } = require('./layout');

/* --------------------------------------------------------------------
   Cabeçalho de seção — kicker em mono, título em display.
   -------------------------------------------------------------------- */
function sectionHead(opts) {
  return `<header class="sec-head${opts.wide ? ' sec-head--wide' : ''}">
  <span class="kicker">${esc(opts.kicker)}</span>
  <h2 class="sec-head__title">${opts.title}</h2>
  ${opts.lead ? `<p class="sec-head__lead">${opts.lead}</p>` : ''}
</header>`;
}

/* --------------------------------------------------------------------
   Botões
   -------------------------------------------------------------------- */
function btn(opts) {
  const cls = 'btn btn--' + (opts.variant || 'primary');
  const attrs = opts.external ? ' target="_blank" rel="noopener noreferrer"' : '';
  const icon = opts.icon === false ? '' : ' ' + (icons[opts.icon] || icons.arrow);
  const extra = opts.attrs ? ' ' + opts.attrs : '';
  return `<a class="${cls}" href="${opts.href}"${attrs}${extra}>${esc(opts.label)}${icon}</a>`;
}

/* --------------------------------------------------------------------
   Tags
   -------------------------------------------------------------------- */
function tags(list, opts) {
  if (!list || !list.length) return '';
  const o = opts || {};
  return `<ul class="tags${o.small ? ' tags--sm' : ''}" ${o.label ? `aria-label="${esc(o.label)}"` : ''}>
  ${list.map(function (t) { return `<li class="tag">${esc(t)}</li>`; }).join('\n  ')}
</ul>`;
}

/* --------------------------------------------------------------------
   Bloco "a preencher" — honestidade explícita em vez de texto inventado.
   -------------------------------------------------------------------- */
function pending(hint) {
  return `<div class="pending" role="note">
  <span class="pending__label">A preencher</span>
  <p class="pending__hint">${esc(hint)}</p>
</div>`;
}

/* --------------------------------------------------------------------
   Card de projeto — usado na grade de /projects e nos relacionados.
   -------------------------------------------------------------------- */
function projectCard(project, prefix, opts) {
  const o = opts || {};
  const meta = [project.client, project.year].filter(Boolean).join(' · ');
  return `<article class="pcard${o.large ? ' pcard--lg' : ''}" data-categories="${esc(project.categories.join('|'))}">
  <a class="pcard__link" href="${prefix}work/${project.slug}.html" data-cursor="Ver case">
    <span class="pcard__media">
      <img src="${prefix}${esc(project.cover)}" alt="Capa do case ${esc(project.title)}, para ${esc(project.client)}" width="800" height="1000" loading="lazy" decoding="async">
    </span>
    <span class="pcard__body">
      <span class="pcard__meta">
        <span class="pcard__n">${esc(project.index)}</span>
        <span class="pcard__cat">${esc(project.category)}</span>
      </span>
      <h3 class="pcard__title">${esc(project.title)}</h3>
      <span class="pcard__client">${esc(meta)}</span>
      <span class="pcard__summary">${esc(project.summary)}</span>
      <span class="pcard__cta">Ver case ${icons.arrowUpRight}</span>
    </span>
  </a>
</article>`;
}

/* --------------------------------------------------------------------
   Ticker — fita horizontal contínua, tipografia mono.
   O grupo é duplicado para o loop; a cópia fica fora da árvore acessível.
   -------------------------------------------------------------------- */
function ticker(items, opts) {
  const o = opts || {};
  const group = items
    .map(function (item) {
      return `<span class="ticker__item">${esc(item)}</span><span class="ticker__sep" aria-hidden="true"><svg><use href="#i-lion"/></svg></span>`;
    })
    .join('');
  return `<div class="ticker${o.reverse ? ' ticker--rev' : ''}" ${o.label ? `aria-label="${esc(o.label)}"` : 'aria-hidden="true"'}>
  <div class="ticker__track">
    <div class="ticker__group">${group}</div>
    <div class="ticker__group" aria-hidden="true">${group}</div>
  </div>
</div>`;
}

/* --------------------------------------------------------------------
   Campo inline de briefing.

   A referência traz uma captura de e-mail dentro do hero. Aqui não há
   servidor para receber e-mail, então o campo faz a coisa equivalente e
   honesta: leva a frase digitada direto para a conversa.

   O truque é que isso não depende de JavaScript. Um form GET para
   wa.me/<numero> com um campo chamado `text` produz exatamente a URL
   que o WhatsApp espera. Sem JS, sem fetch, sem backend: o próprio
   navegador monta o link.
   -------------------------------------------------------------------- */
function briefForm(opts) {
  const o = opts || {};
  const id = o.id || 'brief';
  return `<form class="brief" action="https://wa.me/${site.contacts.whatsapp}" method="get" target="_blank" rel="noopener noreferrer">
  <label class="sr-only" for="${id}">${esc(o.label || 'Conte em uma linha o que você precisa')}</label>
  <input class="brief__field" id="${id}" name="text" type="text" required maxlength="180"
         placeholder="${esc(o.placeholder || 'O que você quer construir?')}" autocomplete="off" enterkeyhint="send">
  <button class="brief__go" type="submit">
    <span class="sr-only">Abrir conversa no WhatsApp</span>
    <span aria-hidden="true">${icons.arrow}</span>
  </button>
</form>
<p class="brief__note">${esc(o.note || 'Abre o WhatsApp com a sua mensagem já escrita.')}</p>`;
}

/* --------------------------------------------------------------------
   Carrossel.

   Scroll-snap horizontal com setas circulares. A rolagem é nativa: sem
   JavaScript o bloco continua sendo uma lista que desliza no dedo e no
   trackpad, e as setas (que só existem com script) ficam escondidas.
   O viewport recebe foco para quem navega por teclado.
   -------------------------------------------------------------------- */
function carousel(opts) {
  const slides = opts.items
    .map(function (html) { return `<li class="carousel__slide">${html}</li>`; })
    .join('\n    ');

  return `<div class="carousel" data-carousel>
  <div class="carousel__viewport" tabindex="0" role="group" aria-label="${esc(opts.label)}">
    <ul class="carousel__track">
    ${slides}
    </ul>
  </div>
  <div class="carousel__ctrl">
    <span class="carousel__bar" aria-hidden="true"><i></i></span>
    <span class="carousel__arrows">
      <button class="cbtn" type="button" data-carousel-prev>
        <span class="sr-only">Anterior</span>${icons.chevronLeft}
      </button>
      <button class="cbtn" type="button" data-carousel-next>
        <span class="sr-only">Próximo</span>${icons.chevronRight}
      </button>
    </span>
  </div>
</div>`;
}

/* --------------------------------------------------------------------
   Depoimento em card. O primeiro da fila vira bloco invertido para
   ancorar a fileira; os outros ficam em superfície.
   -------------------------------------------------------------------- */
function quoteCard(t, opts) {
  const o = opts || {};
  return `<figure class="quote${o.feature ? ' quote--feature' : ''}">
  <blockquote>${esc(t.quote)}</blockquote>
  <figcaption>
    <span class="quote__avatar" aria-hidden="true">${esc(t.initials)}</span>
    <span><span class="quote__name">${esc(t.author)}</span><span class="quote__company">${esc(t.company)}</span></span>
  </figcaption>
</figure>`;
}

/* --------------------------------------------------------------------
   CTA final — as duas portas do site, cliente e recrutador.
   -------------------------------------------------------------------- */
function ctaDoors(prefix, audiences) {
  const c = audiences.client;
  const r = audiences.recruiter;
  return `<section class="doors" aria-labelledby="doors-title">
  <div class="grid">
    <header class="doors__head">
      <span class="kicker">Let's build something</span>
      <h2 class="doors__title" id="doors-title">Duas portas.<br>Escolha a <em>sua</em>.</h2>
    </header>

    <a class="door" href="${site.whatsapp(c.message)}" target="_blank" rel="noopener noreferrer" data-cursor="Conversar">
      <span class="door__kicker">${esc(c.kicker)}</span>
      <span class="door__title">${esc(c.title)}</span>
      <span class="door__line">${esc(c.line)}</span>
      <span class="door__cta">${esc(c.cta)} ${icons.arrow}</span>
    </a>

    <a class="door" href="${site.whatsapp(r.message)}" target="_blank" rel="noopener noreferrer" data-cursor="Conversar">
      <span class="door__kicker">${esc(r.kicker)}</span>
      <span class="door__title">${esc(r.title)}</span>
      <span class="door__line">${esc(r.line)}</span>
      <span class="door__cta">${esc(r.cta)} ${icons.arrow}</span>
    </a>

    <p class="doors__alt">
      Prefere e-mail? <a href="mailto:${site.contacts.email}">${esc(site.contacts.email)}</a> ·
      <a href="${prefix}contact.html">Ver todas as formas de contato ${icons.arrowUpRight}</a>
    </p>
  </div>
</section>`;
}

module.exports = {
  sectionHead: sectionHead,
  btn: btn,
  tags: tags,
  pending: pending,
  projectCard: projectCard,
  ticker: ticker,
  briefForm: briefForm,
  carousel: carousel,
  quoteCard: quoteCard,
  ctaDoors: ctaDoors,
};
