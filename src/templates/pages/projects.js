'use strict';

const { esc } = require('../layout');
const C = require('../components');

module.exports = function projectsPage(prefix, T, ctx) {
  const projects = ctx.projects;
  const profile = ctx.profile;
  const categories = ctx.projectsData.categories;
  /* O rótulo do primeiro filtro é traduzido, mas o valor que o script lê
     continua sendo o coringa `*`, decidido pela posição e não pelo texto:
     comparar com a palavra 'Todos' quebraria assim que ela virasse 'All'. */
  const filters = [T('Todos')].concat(categories)
    .map(function (cat, i) {
      return `<button class="filter${i === 0 ? ' is-active' : ''}" type="button" data-filter="${esc(i === 0 ? '*' : cat)}" aria-pressed="${i === 0}">${esc(cat)}</button>`;
    })
    .join('\n');

  const cards = projects.map(function (p) { return C.projectCard(p, prefix); }).join('\n');

  return `<section class="page-hero" aria-labelledby="ph-title">
  <div class="grid">
    <span class="kicker">${T('Work')}</span>
    <h1 class="page-hero__title" id="ph-title">${T('Todos os <em>projetos</em>')}</h1>
    <p class="page-hero__lead">${T('{0} projetos entre branding, campanha, sistema visual, digital, direção de arte e IA. Cada um abre um case com contexto, decisão, execução e resultado.', projects.length)}</p>
  </div>
</section>

<section class="section" aria-label="${T('Projetos')}">
  <div class="grid">
    <div class="filters" role="group" aria-label="${T('Filtrar projetos por categoria')}">
      ${filters}
    </div>
    <p class="filters__count" data-filter-count aria-live="polite">${T('{0} projetos', projects.length)}</p>
    <div class="pgrid" data-project-grid>${cards}</div>
    <p class="pgrid__empty" data-filter-empty hidden>${T('Nenhum projeto nessa categoria ainda.')}</p>
  </div>
</section>

${C.ctaDoors(prefix, profile.audiences)}`;
};
