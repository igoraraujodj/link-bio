'use strict';

const { projects } = require('../../data/projects');
const { esc, icons } = require('../layout');
const C = require('../components');

module.exports = function notFoundPage(prefix) {
  const featured = projects.filter(function (p) { return p.featured; }).slice(0, 3);

  return `<section class="page-hero page-hero--404" aria-labelledby="ph-title">
  <div class="grid">
    <span class="kicker">Erro 404</span>
    <h1 class="page-hero__title" id="ph-title">Essa página<br><em>não existe</em>.</h1>
    <p class="page-hero__lead">O link pode ter mudado de lugar. Abaixo, os caminhos que valem a pena.</p>
    <div class="page-hero__actions">
      ${C.btn({ href: prefix + 'index.html', label: 'Voltar ao início' })}
      ${C.btn({ href: prefix + 'projects.html', label: 'Ver projetos', variant: 'ghost' })}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="nf-title">
  <div class="grid">
    ${C.sectionHead({ kicker: 'Selected work', title: '<span id="nf-title">Comece <em>por aqui</em></span>' })}
    <div class="pgrid pgrid--3">${featured.map(function (p) { return C.projectCard(p, prefix); }).join('\n')}</div>
  </div>
</section>`;
};
