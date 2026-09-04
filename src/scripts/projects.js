/* Filtros da página de projetos. Degradam para grade estática: sem
   JavaScript os sete cards continuam todos na tela. */

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
