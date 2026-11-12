'use strict';

/* =====================================================================
   A PÁGINA.

   O site inteiro é esta função. São cinco blocos em rolagem única:
   quem é, o trabalho, o perfil, a palavra de quem contratou e o
   contato. Nada abre em outra página.

   O corte foi deliberado. Antes eram 28 páginas em dois idiomas, com
   sete páginas de case cuja narrativa estava vazia, aba de pipeline,
   filtro de categoria, carrossel e visualizador. Um portfólio que
   ainda não tem foto das peças não precisa de sete páginas para
   mostrar sete projetos.
   ===================================================================== */

const { esc, icons } = require('../layout');
const C = require('../components');

module.exports = function home(ctx) {
  const site = ctx.site;
  const projects = ctx.projects;
  const profile = ctx.profile;

  /* ---------------- HERO ----------------
     Tipográfico, sem retrato: o retrato trabalha melhor ao lado da bio,
     onde há texto para ele acompanhar. Aqui o que importa é o nome, o
     que ele faz e os dois caminhos de saída. */
  const hero = `<section class="hero" aria-labelledby="hero-title">
  <p class="hero__kicker">${site.disciplines.map(function (d) { return esc(d); }).join(' <span aria-hidden="true">·</span> ')}</p>

  <h1 class="hero__title" id="hero-title">Igor<br>Araujo</h1>

  <p class="hero__role">${esc(site.roleLong)}</p>
  <p class="hero__lead">${esc(site.statement)}</p>

  <div class="hero__actions">
    ${C.btn({ href: '#trabalho', label: 'Ver o trabalho', icon: 'arrowDown' })}
    ${C.btn({ href: site.whatsapp('Olá, Igor! Vim pelo seu portfólio e queria conversar.'), label: 'Falar no WhatsApp', variant: 'ghost', icon: 'whatsapp', external: true })}
  </div>

  <dl class="hero__facts">
    <div><dt>Base</dt><dd>${esc(site.location)}</dd></div>
    <div><dt>Atuação</dt><dd>${esc(site.experienceYears)} anos</dd></div>
    <div><dt>Modelo</dt><dd>Remoto e híbrido</dd></div>
  </dl>
</section>`;

  /* ---------------- TRABALHO ----------------
     As capas são composições gráficas geradas a partir do conteúdo de
     cada projeto (src/covers.js), não fotos das peças entregues. Por
     isso a seção termina no Behance: é lá que o trabalho publicado
     está, e é um destino real, não um texto dizendo que falta algo.
     Quando a foto entrar em assets/images/work/, ela substitui a capa
     gerada sozinha. */
  const trabalho = `<section class="section" id="trabalho" aria-labelledby="trabalho-title">
  ${C.sectionHead({
    kicker: 'Trabalho',
    id: 'trabalho-title',
    title: 'Projetos <em>selecionados</em>',
    lead: 'Branding, identidade visual, campanhas, sistemas visuais, digital e direção de imagem com IA.',
  })}

  <div class="pgrid">
    ${projects.map(function (p) { return C.projectCard(p); }).join('\n    ')}
  </div>

  <div class="section__foot">
    ${C.btn({ href: site.contacts.behance, label: 'Ver tudo no Behance', icon: 'arrowUpRight', external: true })}
  </div>
</section>`;

  /* ---------------- SOBRE ---------------- */
  const capabilities = profile.capabilities
    .map(function (cap) {
      return `<article class="cap">
      <h3 class="cap__label">${esc(cap.label)}</h3>
      <p class="cap__line">${esc(cap.line)}</p>
      ${C.tags(cap.items, { label: cap.label })}
    </article>`;
    })
    .join('\n    ');

  /* Períodos e resultados de cada passagem continuam `null` nos dados,
     porque só o Igor tem essa informação. Em vez de imprimir um aviso
     de campo vazio no meio da página, o bloco mostra o que é sabido
     (empresa, papel, escopo) e os campos seguem esperando em
     src/data/profile.js. */
  const experiencia = profile.experience
    .map(function (job) {
      return `<li class="job">
      <h4 class="job__company">${esc(job.company)}${job.current ? ' <span class="job__now">agora</span>' : ''}</h4>
      <p class="job__role">${esc(job.role)}</p>
      <p class="job__summary">${esc(job.summary)}</p>
    </li>`;
    })
    .join('\n    ');

  const sobre = `<section class="section section--rule" id="sobre" aria-labelledby="sobre-title">
  ${C.sectionHead({ kicker: 'Sobre', id: 'sobre-title', title: 'Como eu <em>trabalho</em>' })}

  <div class="about">
    <figure class="about__portrait">
      <img src="assets/images/profile.jpg" alt="Retrato de ${esc(site.name)}" width="800" height="1000" loading="lazy" decoding="async">
    </figure>

    <div class="about__text">
      <p class="about__bio">${esc(profile.bio)}</p>
      <ul class="manifesto">
        ${profile.manifesto.map(function (m) { return `<li>${esc(m)}</li>`; }).join('\n        ')}
      </ul>
    </div>
  </div>

  <div class="caps">
    ${capabilities}
  </div>

  <div class="jobs">
    <h3 class="jobs__title">Onde atuei</h3>
    <ul class="jobs__list">
      ${experiencia}
    </ul>
  </div>

  <p class="clients">
    <span class="clients__label">Marcas atendidas</span>
    ${profile.clients.map(function (n) { return `<span class="clients__name">${esc(n)}</span>`; }).join('')}
  </p>
</section>`;

  /* ---------------- DEPOIMENTOS ----------------
     Conteúdo real, já validado. O campo `link` de cada um segue `null`:
     quando o Igor colar a URL do LinkedIn da pessoa, a assinatura vira
     link sozinha. */
  const depoimentos = `<section class="section section--rule" aria-labelledby="vozes-title">
  ${C.sectionHead({ kicker: 'Clientes', id: 'vozes-title', title: 'O que <em>disseram</em>' })}
  <div class="quotes">
    ${profile.testimonials.map(function (t) { return C.quoteCard(t); }).join('\n    ')}
  </div>
</section>`;

  /* ---------------- CONTATO ---------------- */
  const c = site.contacts;
  const canais = [
    { href: site.whatsapp('Olá, Igor! Vim pelo seu portfólio e queria conversar.'), label: 'WhatsApp', value: 'Resposta mais rápida', icon: 'whatsapp', external: true },
    { href: 'mailto:' + c.email, label: 'E-mail', value: c.email, icon: 'mail', external: false },
    { href: c.linkedin, label: 'LinkedIn', value: 'Perfil profissional', icon: 'linkedin', external: true },
    { href: c.behance, label: 'Behance', value: 'Trabalho publicado', icon: 'behance', external: true },
    { href: c.instagram, label: 'Instagram', value: 'Processo e bastidor', icon: 'instagram', external: true },
  ]
    .map(function (ch) {
      const attrs = ch.external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<li><a class="channel" href="${ch.href}"${attrs}>
      <span class="channel__icon" aria-hidden="true">${icons[ch.icon]}</span>
      <span class="channel__label">${esc(ch.label)}</span>
      <span class="channel__value">${esc(ch.value)}</span>
      <span class="channel__go" aria-hidden="true">${icons.arrowUpRight}</span>
    </a></li>`;
    })
    .join('\n    ');

  const contato = `<section class="section section--rule" id="contato" aria-labelledby="contato-title">
  ${C.sectionHead({
    kicker: 'Contato',
    id: 'contato-title',
    title: 'Vamos <em>conversar</em>',
    lead: 'Projeto de marca, campanha, digital ou uma oportunidade de trabalho: escreva em uma linha o que você precisa.',
  })}

  <div class="contact">
    <div class="contact__brief">
      ${C.briefForm({ id: 'brief' })}
    </div>
    <ul class="channels">
      ${canais}
    </ul>
  </div>
</section>`;

  return hero + trabalho + sobre + depoimentos + contato;
};
