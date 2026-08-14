/* Header fixo + menu mobile em tela cheia, com foco preso e Esc. */
(function () {
  var header = document.getElementById('header');
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('mobileMenu');

  /* Fio inferior só depois que a página sai do topo. */
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (!toggle || !menu) return;

  var lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
    document.body.classList.add('is-locked');
    var first = menu.querySelector('a, button');
    if (first) first.focus();
  }

  function close() {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  }

  toggle.addEventListener('click', function () {
    if (menu.hidden) open(); else close();
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (menu.hidden) return;

    if (e.key === 'Escape') { close(); return; }

    if (e.key === 'Tab') {
      var items = menu.querySelectorAll('a[href], button:not([disabled])');
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Ao voltar para o desktop, o menu não pode continuar travando o scroll. */
  window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) {
    if (e.matches && !menu.hidden) close();
  });
})();
