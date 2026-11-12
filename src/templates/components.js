'use strict';

/* =====================================================================
   COMPONENTES

   O site tem uma página só, então este arquivo guarda apenas o que
   aparece mais de uma vez nela. Não há estado de idioma aqui: o site
   sai em português e os templates escrevem em português direto.
   ===================================================================== */

const site = require('../data/site');
const { esc, icons } = require('./layout');

/* --------------------------------------------------------------------
   Cabeçalho de seção — kicker em mono, título em display.
   -------------------------------------------------------------------- */
function sectionHead(opts) {
  return `<header class="sec-head">
  <span class="kicker">${esc(opts.kicker)}</span>
  <h2 class="sec-head__title"${opts.id ? ` id="${esc(opts.id)}"` : ''}>${opts.title}</h2>
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
  return `<a class="${cls}" href="${opts.href}"${attrs}>${esc(opts.label)}${icon}</a>`;
}

/* --------------------------------------------------------------------
   Tags
   -------------------------------------------------------------------- */
function tags(list, opts) {
  if (!list || !list.length) return '';
  const o = opts || {};
  return `<ul class="tags"${o.label ? ` aria-label="${esc(o.label)}"` : ''}>
  ${list.map(function (t) { return `<li class="tag">${esc(t)}</li>`; }).join('\n  ')}
</ul>`;
}

/* --------------------------------------------------------------------
   Card de projeto.

   Não é link. Antes cada card levava para uma página de case, e as sete
   páginas eram estrutura de narrativa com os campos vazios: quem
   clicava chegava num esqueleto. Sem elas, o card entrega o que
   realmente se sabe do projeto (capa, cliente, categoria, resumo,
   papel) e a seção termina com um caminho único para o trabalho
   publicado, no Behance.
   -------------------------------------------------------------------- */
function projectCard(project) {
  return `<article class="pcard">
  <figure class="pcard__media">
    <img src="${esc(project.cover)}" alt="Capa do projeto ${esc(project.title)}, para ${esc(project.client)}" width="800" height="600" loading="lazy" decoding="async">
  </figure>
  <div class="pcard__body">
    <span class="pcard__meta">
      <span class="pcard__n">${esc(project.index)}</span>
      <span class="pcard__cat">${esc(project.category)}</span>
    </span>
    <h3 class="pcard__title">${esc(project.title)}</h3>
    <p class="pcard__client">${esc(project.client)}</p>
    <p class="pcard__summary">${esc(project.summary)}</p>
    ${tags(project.role, { label: 'Minha participação em ' + project.title })}
  </div>
</article>`;
}

/* --------------------------------------------------------------------
   Depoimento em card.
   -------------------------------------------------------------------- */
function quoteCard(t) {
  /* Com link, a assinatura inteira vira o alvo e ganha a seta de saída:
     o depoimento passa a ser verificável. Sem link, fica texto simples.
     Nada de href vazio nem de destino inventado. */
  const assinatura = `<span class="quote__name">${esc(t.author)}</span><span class="quote__company">${esc(t.company)}${t.link ? ' ' + icons.arrowUpRight : ''}</span>`;

  const corpo = t.link
    ? `<a class="quote__who quote__who--link" href="${esc(t.link)}" target="_blank" rel="noopener noreferrer">${assinatura}</a>`
    : `<span class="quote__who">${assinatura}</span>`;

  return `<figure class="quote">
  <blockquote>${esc(t.quote)}</blockquote>
  <figcaption>
    <span class="quote__avatar" aria-hidden="true">${esc(t.initials)}</span>
    ${corpo}
  </figcaption>
</figure>`;
}

/* --------------------------------------------------------------------
   Campo de briefing.

   Não há servidor para receber formulário, então o campo faz a coisa
   equivalente e honesta: leva a frase digitada direto para a conversa.

   E não depende de JavaScript. Um form GET para wa.me/<numero> com um
   campo chamado `text` produz exatamente a URL que o WhatsApp espera:
   o próprio navegador monta o link.
   -------------------------------------------------------------------- */
function briefForm(opts) {
  const o = opts || {};
  const id = o.id || 'brief';
  return `<form class="brief" action="https://wa.me/${site.contacts.whatsapp}" method="get" target="_blank" rel="noopener noreferrer">
  <label class="sr-only" for="${id}">Conte em uma linha o que você precisa</label>
  <input class="brief__field" id="${id}" name="text" type="text" required maxlength="180"
         placeholder="O que você quer construir?" autocomplete="off" enterkeyhint="send">
  <button class="brief__go" type="submit">
    <span class="sr-only">Abrir conversa no WhatsApp</span>
    <span aria-hidden="true">${icons.arrow}</span>
  </button>
</form>
<p class="brief__note">Abre o WhatsApp com a sua mensagem já escrita.</p>`;
}

module.exports = {
  sectionHead: sectionHead,
  btn: btn,
  tags: tags,
  projectCard: projectCard,
  quoteCard: quoteCard,
  briefForm: briefForm,
};
