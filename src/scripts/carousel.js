/* Carrossel.

   A rolagem em si é do navegador: scroll-snap no CSS, dedo e trackpad
   funcionando sem uma linha daqui. Este arquivo só acrescenta o atalho
   das setas e a barra que diz onde a pessoa está na fila.

   Por isso os controles nascem escondidos no CSS quando não há JS: um
   botão que não move nada é pior do que botão nenhum.

   Quando todos os cards já cabem na tela, os controles somem: não há
   fila para percorrer. */
(function () {
  var carousels = document.querySelectorAll('[data-carousel]');
  if (!carousels.length) return;

  var reduce = false;
  try {
    reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  function setup(root) {
    var view = root.querySelector('.carousel__viewport');
    var track = root.querySelector('.carousel__track');
    var ctrl = root.querySelector('.carousel__ctrl');
    var bar = root.querySelector('.carousel__bar i');
    var prev = root.querySelector('[data-carousel-prev]');
    var next = root.querySelector('[data-carousel-next]');
    if (!view || !track || !ctrl) return;

    /* Um passo é a largura de um card mais o intervalo entre eles. Medir
       dois slides é mais confiável do que ler o gap do CSS computado,
       que vem em px só depois do layout e muda com o clamp. */
    function step() {
      var slides = track.children;
      if (slides.length < 2) return view.clientWidth;
      return slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left;
    }

    function go(dir) {
      view.scrollBy({ left: step() * dir, behavior: reduce ? 'auto' : 'smooth' });
    }

    var ticking = false;
    function sync() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var max = view.scrollWidth - view.clientWidth;

        /* Nada a percorrer: os controles saem do fluxo e da ordem de foco. */
        if (max <= 1) {
          ctrl.hidden = true;
          return;
        }
        ctrl.hidden = false;

        var x = view.scrollLeft;
        if (prev) prev.disabled = x <= 1;
        if (next) next.disabled = x >= max - 1;

        if (bar) {
          var seen = view.clientWidth / view.scrollWidth;
          bar.style.setProperty('--seen', (seen * 100).toFixed(2) + '%');
          /* O preenchimento anda dentro do trilho: a folga é o que sobra
             da barra depois da fatia visível. */
          var slack = (1 - seen) * 100;
          bar.style.setProperty('--at', ((x / max) * slack).toFixed(2) + '%');
        }
      });
    }

    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });

    /* Setas do teclado quando o foco está na área deslizante. O
       navegador já rola com elas, mas em passos de pixel: aqui o passo
       é um card, igual ao dos botões. */
    view.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });

    view.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });

    sync();
    /* As fontes chegam depois do primeiro layout e mudam a altura e a
       largura dos cards; sem esta segunda medida a barra nasce errada. */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
    window.addEventListener('load', sync);
  }

  Array.prototype.forEach.call(carousels, setup);
})();
