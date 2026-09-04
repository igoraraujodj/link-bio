'use strict';

const { projects, categories } = require('../../data/projects');
const profile = require('../../data/profile');
const { esc } = require('../layout');
const C = require('../components');

module.exports = function projectsPage(prefix) {
  const filters = ['Todos'].concat(categories)
    .map(function (cat, i) {
      return `<button class="filter${i === 0 ? ' is-active' : ''}" type="button" data-filter="${esc(cat === 'Todos' ? '*' : cat)}" aria-pressed="${i === 0}">${esc(cat)}</button>`;
    })
    .join('\n');

  const cards = projects.map(function (p) { return C.projectCard(p, prefix); }).join('\n');

  return `<section class="page-hero" aria-labelledby="ph-title">
  <div class="grid">
    <span class="kicker">Work</span>
    <h1 class="page-hero__title" id="ph-title">Todos os <em>projetos</em></h1>
    <p class="page-hero__lead">${projects.length} projetos entre branding, campanha, sistema visual, digital, direção de arte e IA. Cada um abre um case com contexto, decisão, execução e resultado.</p>
  </div>
</section>

<section class="section" aria-label="Projetos">
  <div class="grid">
    <div class="filters" role="group" aria-label="Filtrar projetos por categoria">
      ${filters}
    </div>
    <p class="filters__count" data-filter-count aria-live="polite">${projects.length} projetos</p>
    <div class="pgrid" data-project-grid>${cards}</div>
    <p class="pgrid__empty" data-filter-empty hidden>Nenhum projeto nessa categoria ainda.</p>
  </div>
</section>

${C.ctaDoors(prefix, profile.audiences)}`;
};
