/* Pipeline do AI Lab: abas com navegação por setas, padrão ARIA.
   Sem JS, todos os painéis ficam empilhados e legíveis (ver pages.css). */
(function () {
  var stepper = document.querySelector('[data-stepper]');
  if (!stepper) return;

  var tabs = Array.prototype.slice.call(stepper.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(stepper.querySelectorAll('[role="tabpanel"]'));
  if (!tabs.length) return;

  function select(i, focus) {
    tabs.forEach(function (tab, n) {
      var active = n === i;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach(function (panel, n) {
      panel.classList.toggle('is-active', n === i);
    });
    if (focus) tabs[i].focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(i); });

    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      e.preventDefault();
      select(next, true);
    });
  });

  select(0);
})();
