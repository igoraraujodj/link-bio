'use strict';

const { esc, icons } = require('../layout');
const C = require('../components');

/* Uma seção da narrativa: rende o texto real ou o bloco "a preencher". */
function chapter(n, label, content, hint, card) {
  return `<section class="chap${card ? ' chap--card' : ''}" aria-labelledby="chap-${n}">
  <span class="chap__n">${esc(n)}</span>
  <h2 class="chap__label" id="chap-${n}">${esc(label)}</h2>
  <div class="chap__body">
    ${content ? `<p>${esc(content)}</p>` : C.pending(hint)}
  </div>
</section>`;
}

module.exports = function casePage(project, prefix, T, ctx) {
  const site = ctx.site;
  const projects = ctx.projects;
  const profile = ctx.profile;
  const HINT = ctx.projectsData.HINT;
  const study = project.study;

  /* Relacionados: mesma categoria primeiro, completa com os vizinhos do índice. */
  const related = projects
    .filter(function (p) {
      return p.slug !== project.slug;
    })
    .sort(function (a, b) {
      const sharedA = a.categories.filter(function (c) { return project.categories.indexOf(c) > -1; }).length;
      const sharedB = b.categories.filter(function (c) { return project.categories.indexOf(c) > -1; }).length;
      return sharedB - sharedA;
    })
    .slice(0, 3);

  const pos = projects.indexOf(project);
  const next = projects[(pos + 1) % projects.length];

  /* ---------------- HERO ---------------- */
  const hero = `<section class="case-hero" aria-labelledby="case-title">
  <div class="grid case-hero__grid">
    <nav class="crumbs" aria-label="${T('Você está em')}">
      <a href="${prefix}index.html">${T('Home')}</a> <span aria-hidden="true">/</span>
      <a href="${prefix}projects.html">${T('Work')}</a> <span aria-hidden="true">/</span>
      <span aria-current="page">${esc(project.title)}</span>
    </nav>

    <p class="case-hero__client">${esc(project.client)}</p>
    <h1 class="case-hero__title" id="case-title">${esc(project.title)}</h1>
    <p class="case-hero__summary">${esc(project.summary)}</p>

    <dl class="case-facts">
      <div><dt>${T('Categoria')}</dt><dd>${esc(project.category)}</dd></div>
      <div><dt>${T('Ano')}</dt><dd>${project.year ? esc(project.year) : '<em class="pending-inline">' + T('a preencher') + '</em>'}</dd></div>
      <div><dt>${T('Cliente')}</dt><dd>${esc(project.client)}</dd></div>
      <div><dt>${T('Índice')}</dt><dd>${esc(project.index)} / ${String(projects.length).padStart(2, '0')}</dd></div>
    </dl>
  </div>

  <figure class="case-hero__media">
    <img src="${ctx.raiz}${esc(project.cover)}" alt="${T('Imagem principal do case {0} para {1}', esc(project.title), esc(project.client))}" width="1600" height="900" fetchpriority="high" decoding="async">
  </figure>
</section>`;

  /* ---------------- STATUS ----------------
     Case incompleto não pode ser um beco sem saída: quem chega aqui
     precisa de um caminho para o trabalho que já está publicado. */
  const status = project.complete
    ? ''
    : `<div class="grid"><div class="case-status" role="note">
    <p>${project.pending.length === 1
      ? T('<strong>Case em preenchimento.</strong> A estrutura da narrativa está pronta; {0} seção aguarda o conteúdo real do projeto. Nada aqui foi preenchido com texto fictício.', project.pending.length)
      : T('<strong>Case em preenchimento.</strong> A estrutura da narrativa está pronta; {0} seções aguardam o conteúdo real do projeto. Nada aqui foi preenchido com texto fictício.', project.pending.length)}</p>
    <p class="case-status__out">${T('Enquanto isso, os projetos publicados estão no')} <a href="${site.contacts.behance}" target="_blank" rel="noopener noreferrer">Behance ${icons.arrowUpRight}</a>, ${T('ou')} <a href="${site.whatsapp(T('Olá, Igor! Vi o case {0}: {1} no seu site e queria saber mais.', project.client, project.title))}" target="_blank" rel="noopener noreferrer">${T('peça os detalhes deste projeto')} ${icons.arrowUpRight}</a>.</p>
  </div></div>`;

  /* ---------------- NARRATIVA ----------------
     Desafio e objetivo saem lado a lado: a referência mostra o problema e
     a resposta como um par, não como dois parágrafos empilhados. Esta
     explicação vive aqui, e não num comentário de HTML, porque comentário
     de HTML é baixado pelo leitor sem servir para nada. */
  const chapters = `<div class="grid case-body">
  <div class="case-body__main">
    ${chapter('01', T('Contexto'), study.context, HINT.context)}
    <div class="chap-duo">
      ${chapter('02', T('Desafio'), study.challenge, HINT.challenge, true)}
      ${chapter('03', T('Objetivo'), study.objective, HINT.objective, true)}
    </div>
    ${chapter('04', T('Estratégia'), study.strategy, HINT.strategy)}
    ${chapter('05', T('Conceito'), study.concept, HINT.concept)}
  </div>

  <aside class="case-aside" aria-label="${T('Ficha técnica')}">
    <div class="case-aside__block">
      <h2 class="case-aside__title">${T('Minha participação')}</h2>
      <ul class="case-role">${project.role.map(function (r) { return `<li>${esc(r)}</li>`; }).join('')}</ul>
    </div>
    <div class="case-aside__block">
      <h2 class="case-aside__title">${T('Ferramentas')}</h2>
      ${C.tags(project.tools, { small: true, label: T('Ferramentas usadas') })}
    </div>
    <div class="case-aside__block">
      <h2 class="case-aside__title">${T('Tags')}</h2>
      ${C.tags(project.tags, { small: true })}
    </div>
  </aside>
</div>`;

  /* ---------------- PROCESSO ---------------- */
  const processSteps = profile.process
    .map(function (s) {
      return `<li class="cproc__step"><span class="cproc__n">${esc(s.n)}</span><span class="cproc__label">${esc(s.label)}</span><span class="cproc__text">${esc(s.text)}</span></li>`;
    })
    .join('\n');

  const processBlock = `<section class="section section--rule" aria-labelledby="proc-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: T('Processo'),
      title: '<span id="proc-title">' + T('Como o projeto foi <em>conduzido</em>') + '</span>',
      lead: T('O método aplicado do briefing à entrega. Abaixo entram as anotações específicas deste projeto: pesquisa, referências, moodboard e testes.'),
    })}
    <ol class="cproc">${processSteps}</ol>
    <div class="case-fill">${C.pending(T('Pesquisa, referências, moodboard, sketches e testes deste projeto: imagens e notas do processo.'))}</div>
  </div>
</section>`;

  /* ---------------- EXECUÇÃO + GALERIA ---------------- */
  const gallery = project.gallery && project.gallery.length
    ? `<div class="case-gallery">${project.gallery
        .map(function (img) {
          return `<figure class="case-gallery__item"><img src="${ctx.raiz}${esc(img.src)}" alt="${esc(img.alt)}" loading="lazy" decoding="async">${img.caption ? `<figcaption>${esc(img.caption)}</figcaption>` : ''}</figure>`;
        })
        .join('\n')}</div>`
    : C.pending(T('Aplicações reais do projeto: peças, telas, mockups e fotos de uso. Suba as imagens em assets/images/work/ e liste em gallery[].'));

  const execution = `<section class="section" aria-labelledby="exec-title">
  <div class="grid">
    ${C.sectionHead({ kicker: T('Execução'), title: '<span id="exec-title">' + T('Onde a solução foi <em>aplicada</em>') + '</span>' })}
    <div class="case-exec">${study.execution ? `<p class="case-exec__text">${esc(study.execution)}</p>` : C.pending(HINT.execution)}</div>
    ${gallery}
  </div>
</section>`;

  /* ---------------- RESULTADO ---------------- */
  let resultBlock;
  if (study.results && study.results.type === 'qualitative') {
    resultBlock = `<figure class="case-result">
  <blockquote>${esc(study.results.quote)}</blockquote>
  <figcaption>${esc(study.results.author)}, ${esc(study.results.company)}</figcaption>
  <p class="case-result__note">${T('Resultado qualitativo, na palavra do cliente. Métricas do projeto podem ser somadas aqui quando disponíveis.')}</p>
</figure>`;
  } else if (study.results && study.results.type === 'metrics') {
    resultBlock = `<ul class="case-metrics">${study.results.items
      .map(function (m) { return `<li><span class="case-metrics__v">${esc(m.value)}</span><span class="case-metrics__l">${esc(m.label)}</span></li>`; })
      .join('')}</ul>`;
  } else {
    resultBlock = C.pending(HINT.results);
  }

  const results = `<section class="section section--rule" aria-labelledby="res-title">
  <div class="grid">
    ${C.sectionHead({ kicker: T('Resultado'), title: '<span id="res-title">' + T('O que <em>mudou</em>') + '</span>' })}
    ${resultBlock}
  </div>
</section>`;

  /* ---------------- RELACIONADOS + PRÓXIMO ---------------- */
  const relatedBlock = `<section class="section" aria-labelledby="rel-title">
  <div class="grid">
    ${C.sectionHead({ kicker: T('Related'), title: '<span id="rel-title">' + T('Projetos <em>relacionados</em>') + '</span>' })}
    <div class="pgrid pgrid--3">${related.map(function (p) { return C.projectCard(p, prefix); }).join('\n')}</div>
  </div>
</section>

<a class="next-case" href="${prefix}work/${next.slug}.html" data-cursor="${T('Próximo')}">
  <span class="grid next-case__inner">
    <span class="kicker">${T('Próximo case')}</span>
    <span class="next-case__title">${esc(next.client)}: ${esc(next.title)}</span>
    <span class="next-case__go" aria-hidden="true">${icons.arrow}</span>
  </span>
</a>`;

  return hero + status + chapters + processBlock + execution + results + relatedBlock + C.ctaDoors(prefix, profile.audiences);
};
