/* Índice de projetos com preview seguindo o cursor, e filtros da
   página de projetos. Ambos degradam para lista/grade estática. */

/* ---- Preview do índice editorial ---------------------------------- */
(function () {
  var index = document.querySelector('[data-project-index]');
  if (!index) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var preview = index.querySelector('.pindex__preview');
  var img = preview.querySelector('img');
  var tx = 0, ty = 0, cx = 0, cy = 0;
  var running = false;
  var loaded = {};

  /* Pré-carrega ao aproximar, para a capa não piscar no primeiro hover. */
  function warm(src) {
    if (loaded[src]) return;
    loaded[src] = new Image();
    loaded[src].src = src;
  }

  index.querySelectorAll('.pindex__link').forEach(function (link) {
    var src = link.getAttribute('data-preview');

    link.addEventListener('pointerenter', function () {
      warm(src);
      img.src = src;
      index.classList.add('is-previewing');
    });

    link.addEventListener('pointerleave', function () {
      index.classList.remove('is-previewing');
    });

    /* Teclado não tem posição de ponteiro: some com a preview e mantém o foco limpo. */
    link.addEventListener('focus', function () { index.classList.remove('is-previewing'); });
  });

  index.addEventListener(
    'pointermove',
    function (e) {
      var rect = preview.getBoundingClientRect();
      tx = e.clientX - rect.width / 2;
      ty = e.clientY - rect.height / 2;
      if (!running) { running = true; requestAnimationFrame(frame); }
    },
    { passive: true }
  );

  function frame() {
    cx += (tx - cx) * 0.14;
    cy += (ty - cy) * 0.14;
    preview.style.setProperty('--px', cx.toFixed(2) + 'px');
    preview.style.setProperty('--py', cy.toFixed(2) + 'px');

    if (Math.abs(tx - cx) > 0.2 || Math.abs(ty - cy) > 0.2) requestAnimationFrame(frame);
    else running = false;
  }
})();

/* ---- Filtros da página de projetos -------------------------------- */
(function () {
  var grid = document.querySelector('[data-project-grid]');
  if (!grid) return;

  var buttons = document.querySelectorAll('[data-filter]');
  var cards = grid.querySelectorAll('.pcard');
  var count = document.querySelector('[data-filter-count]');
  var empty = document.querySelector('[data-filter-empty]');

  function apply(value) {
    var shown = 0;

    cards.forEach(function (card) {
      var cats = (card.getAttribute('data-categories') || '').split('|');
      var match = value === '*' || cats.indexOf(value) > -1;
      card.hidden = !match;
      if (match) shown++;
    });

    if (count) count.textContent = shown + (shown === 1 ? ' projeto' : ' projetos');
    if (empty) empty.hidden = shown > 0;
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      apply(btn.getAttribute('data-filter'));
    });
  });
})();
