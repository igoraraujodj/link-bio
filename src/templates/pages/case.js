'use strict';

const site = require('../../data/site');
const { projects, HINT } = require('../../data/projects');
const profile = require('../../data/profile');
const { esc, icons } = require('../layout');
const C = require('../components');

/* Uma seção da narrativa: rende o texto real ou o bloco "a preencher". */
function chapter(n, label, content, hint) {
  return `<section class="chap" aria-labelledby="chap-${n}">
  <span class="chap__n">${esc(n)}</span>
  <h2 class="chap__label" id="chap-${n}">${esc(label)}</h2>
  <div class="chap__body">
    ${content ? `<p>${esc(content)}</p>` : C.pending(hint)}
  </div>
</section>`;
}

module.exports = function casePage(project, prefix) {
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
    <nav class="crumbs" aria-label="Você está em">
      <a href="${prefix}index.html">Home</a> <span aria-hidden="true">/</span>
      <a href="${prefix}projects.html">Work</a> <span aria-hidden="true">/</span>
      <span aria-current="page">${esc(project.title)}</span>
    </nav>

    <p class="case-hero__client">${esc(project.client)}</p>
    <h1 class="case-hero__title" id="case-title">${esc(project.title)}</h1>
    <p class="case-hero__summary">${esc(project.summary)}</p>

    <dl class="case-facts">
      <div><dt>Categoria</dt><dd>${esc(project.category)}</dd></div>
      <div><dt>Ano</dt><dd>${project.year ? esc(project.year) : '<em class="pending-inline">a preencher</em>'}</dd></div>
      <div><dt>Cliente</dt><dd>${esc(project.client)}</dd></div>
      <div><dt>Índice</dt><dd>${esc(project.index)} / ${String(projects.length).padStart(2, '0')}</dd></div>
    </dl>
  </div>

  <figure class="case-hero__media">
    <img src="${prefix}${esc(project.cover)}" alt="Imagem principal do case ${esc(project.title)} para ${esc(project.client)}" width="1600" height="900" fetchpriority="high" decoding="async">
  </figure>
</section>`;

  /* ---------------- STATUS ----------------
     Case incompleto não pode ser um beco sem saída: quem chega aqui
     precisa de um caminho para o trabalho que já está publicado. */
  const status = project.complete
    ? ''
    : `<div class="grid"><div class="case-status" role="note">
    <p><strong>Case em preenchimento.</strong> A estrutura da narrativa está pronta; ${project.pending.length} ${project.pending.length === 1 ? 'seção aguarda' : 'seções aguardam'} o conteúdo real do projeto. Nada aqui foi preenchido com texto fictício.</p>
    <p class="case-status__out">Enquanto isso, os projetos publicados estão no <a href="${site.contacts.behance}" target="_blank" rel="noopener noreferrer">Behance ${icons.arrowUpRight}</a>, ou <a href="${site.whatsapp('Olá, Igor! Vi o case ' + project.client + ': ' + project.title + ' no seu site e queria saber mais.')}" target="_blank" rel="noopener noreferrer">peça os detalhes deste projeto ${icons.arrowUpRight}</a>.</p>
  </div></div>`;

  /* ---------------- NARRATIVA ---------------- */
  const chapters = `<div class="grid case-body">
  <div class="case-body__main">
    ${chapter('01', 'Contexto', study.context, HINT.context)}
    ${chapter('02', 'Desafio', study.challenge, HINT.challenge)}
    ${chapter('03', 'Objetivo', study.objective, HINT.objective)}
    ${chapter('04', 'Estratégia', study.strategy, HINT.strategy)}
    ${chapter('05', 'Conceito', study.concept, HINT.concept)}
  </div>

  <aside class="case-aside" aria-label="Ficha técnica">
    <div class="case-aside__block">
      <h2 class="case-aside__title">Minha participação</h2>
      <ul class="case-role">${project.role.map(function (r) { return `<li>${esc(r)}</li>`; }).join('')}</ul>
    </div>
    <div class="case-aside__block">
      <h2 class="case-aside__title">Ferramentas</h2>
      ${C.tags(project.tools, { small: true, label: 'Ferramentas usadas' })}
    </div>
    <div class="case-aside__block">
      <h2 class="case-aside__title">Tags</h2>
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
      kicker: 'Processo',
      title: '<span id="proc-title">Como o projeto foi conduzido</span>',
      lead: 'O método aplicado do briefing à entrega. Abaixo entram as anotações específicas deste projeto: pesquisa, referências, moodboard e testes.',
    })}
    <ol class="cproc">${processSteps}</ol>
    <div class="case-fill">${C.pending('Pesquisa, referências, moodboard, sketches e testes deste projeto: imagens e notas do processo.')}</div>
  </div>
</section>`;

  /* ---------------- EXECUÇÃO + GALERIA ---------------- */
  const gallery = project.gallery && project.gallery.length
    ? `<div class="case-gallery">${project.gallery
        .map(function (img) {
          return `<figure class="case-gallery__item"><img src="${prefix}${esc(img.src)}" alt="${esc(img.alt)}" loading="lazy" decoding="async">${img.caption ? `<figcaption>${esc(img.caption)}</figcaption>` : ''}</figure>`;
        })
        .join('\n')}</div>`
    : C.pending('Aplicações reais do projeto: peças, telas, mockups e fotos de uso. Suba as imagens em assets/images/work/ e liste em gallery[].');

  const execution = `<section class="section" aria-labelledby="exec-title">
  <div class="grid">
    ${C.sectionHead({ kicker: 'Execução', title: '<span id="exec-title">Onde a solução foi aplicada</span>' })}
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
  <p class="case-result__note">Resultado qualitativo, na palavra do cliente. Métricas do projeto podem ser somadas aqui quando disponíveis.</p>
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
    ${C.sectionHead({ kicker: 'Resultado', title: '<span id="res-title">O que mudou</span>' })}
    ${resultBlock}
  </div>
</section>`;

  /* ---------------- RELACIONADOS + PRÓXIMO ---------------- */
  const relatedBlock = `<section class="section" aria-labelledby="rel-title">
  <div class="grid">
    ${C.sectionHead({ kicker: 'Related', title: '<span id="rel-title">Projetos relacionados</span>' })}
    <div class="pgrid pgrid--3">${related.map(function (p) { return C.projectCard(p, prefix); }).join('\n')}</div>
  </div>
</section>

<a class="next-case" href="${prefix}work/${next.slug}.html" data-cursor="Próximo">
  <span class="grid next-case__inner">
    <span class="kicker">Próximo case</span>
    <span class="next-case__title">${esc(next.client)}: ${esc(next.title)}</span>
    <span class="next-case__go" aria-hidden="true">${icons.arrow}</span>
  </span>
</a>`;

  return hero + status + chapters + processBlock + execution + results + relatedBlock + C.ctaDoors(prefix, profile.audiences);
};
