'use strict';

/* A única outra página que existe. Precisa existir: sem ela o GitHub
   Pages mostra a própria tela de erro dele, que não é este site.

   O site tem uma página só, então não há "seção que você procurava".
   Os três destinos levam para as âncoras da home, e por isso são
   caminhos absolutos a partir de index.html, não âncoras soltas: uma
   âncora nesta página não encontraria nada. */

const site = require('../../data/site');
const { esc, icons } = require('../layout');
const C = require('../components');

module.exports = function notFound() {
  const destinos = site.nav
    .map(function (item) {
      return `<li><a href="index.html${item.href}">${esc(item.label)} ${icons.arrowUpRight}</a></li>`;
    })
    .join('\n      ');

  return `<section class="nf" aria-labelledby="nf-title">
  <p class="nf__code" aria-hidden="true">404</p>
  <h1 class="nf__title" id="nf-title">Esta página <em>não existe</em></h1>
  <p class="nf__lead">O portfólio tem uma página só, e tudo está nela.</p>

  <div class="nf__actions">
    ${C.btn({ href: 'index.html', label: 'Ir para o início' })}
  </div>

  <nav class="nf__nav" aria-label="Seções do portfólio">
    <ul>
      ${destinos}
    </ul>
  </nav>
</section>`;
};
