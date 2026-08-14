/* Tema claro/escuro. O estado inicial já foi aplicado pelo script inline
   no <head>, então aqui só tratamos a troca e a mudança de preferência. */
(function () {
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');

  function set(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    if (toggle) toggle.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      set(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var onChange = function (e) {
    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch (err) {}
    if (!saved) root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange);
})();
