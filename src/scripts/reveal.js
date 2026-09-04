/* Entrada por scroll. Os templates não carregam classe de animação —
   ela é aplicada aqui, para que sem JS o conteúdo já nasça visível. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SELECTORS = [
    '.sec-head',
    '.caps > .cap',
    '.stack__row',
    '.pipe',
    '.about-strip__portrait',
    '.about-strip__text',
    '.xp__row',
    '.clients',
    '.quote',
    '.prob',
    '.bring',
    '.value',
    '.proc__step',
    '.skillgroup',
    '.tl__item',
    '.pcard',
    '.wcard',
    '.door',
    '.doors__head',
    '.chap',
    '.xcard',
    '.case-facts',
    '.recruit__facts',
    '.spotlight__media',
  ];

  var targets = document.querySelectorAll(SELECTORS.join(','));
  if (!targets.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );

  targets.forEach(function (el, i) {
    el.classList.add('reveal');
    /* Escalonamento leve entre irmãos, limitado para não atrasar a leitura. */
    var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.transitionDelay = Math.min(siblings, 5) * 55 + 'ms';
    observer.observe(el);
  });
})();
