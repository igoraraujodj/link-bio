/* Micro-interações de scroll: barra de leitura, parallax de capa, botão
   magnético e limpeza do atraso herdado do reveal.

   Complementa src/scripts/reveal.js e src/scripts/nav.js — não duplica
   nem disputa nada com eles: o encolhimento do header reaproveita a
   classe .is-stuck que a nav já mantém, e o reveal continua sendo dono
   das classes .reveal/.is-in.

   Regras que valem para o arquivo inteiro:
     - nenhum getBoundingClientRect dentro do handler de scroll: toda
       medida é feita em rAF (init, load, resize) e guardada em cache;
       o quadro de scroll só lê window.pageYOffset e escreve;
     - listeners de scroll sempre { passive: true };
     - prefers-reduced-motion: reduce derruba o módulo inteiro no
       primeiro if — nada é criado, nada é observado;
     - parallax e magnetismo só em (pointer: fine) acima de 860px;
     - sem JS nada disto existe, e a página não depende de nada disto
       para ficar legível. */
(function () {
  if (!window.matchMedia || !window.requestAnimationFrame) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var root = document.documentElement;
  var body = document.body;
  if (!body) return;

  var MAX_PAR = 9;     /* deslocamento da capa: 9px para cada lado, 18px no total */
  var MAX_MAG = 6;     /* deslocamento máximo do botão magnético                  */
  var CUE_FADE = 260;  /* px de rolagem até o "role para explorar" sumir          */
  var MIN_SCROLL = 320;/* abaixo disto a barra de progresso não faz sentido       */

  var fine = window.matchMedia('(pointer: fine)');
  var wide = window.matchMedia('(min-width: 861px)');

  /* A propriedade independente `translate` é o que permite o parallax
     conviver com o `transform: scale()` do hover das capas. Sem ela,
     simplesmente não há parallax — degradação silenciosa. */
  var canTranslate = !!(window.CSS && window.CSS.supports && window.CSS.supports('translate', '0 10px'));

  var vh = window.innerHeight || 0;
  var maxScroll = 0;

  function clamp(n, min, max) {
    return n < min ? min : n > max ? max : n;
  }

  function scrollY() {
    return window.pageYOffset || root.scrollTop || 0;
  }

  /* ===================================================================
     1. REVEAL — limpeza do transition-delay depois da entrada.

     reveal.js escalona os irmãos com um transition-delay inline (até
     275ms). O delay é inline, então ele não some quando a animação
     acaba: fica valendo para TODA transição futura daquele elemento.
     Como .door, .cap, .value, .prob, .stack__row e .skillgroup animam
     transform no hover, o resultado é um hover que só reage um quarto
     de segundo depois do ponteiro chegar.

     Aqui o delay é apagado assim que a entrada termina. É o refinamento
     do escalonamento existente — refazer o cálculo de atraso seria só
     repetir, em outro arquivo, o que reveal.js já faz bem.
     =================================================================== */
  document.addEventListener(
    'transitionend',
    function (e) {
      var el = e.target;
      if (!el || !el.classList || !el.style) return;
      if (!el.classList.contains('reveal') || !el.classList.contains('is-in')) return;
      if (el.style.transitionDelay) el.style.transitionDelay = '';
    },
    true
  );

  /* ===================================================================
     2. BARRA DE PROGRESSO DE LEITURA

     Criada por JS: sem JS não há barra, e nenhum conteúdo depende dela.
     Decorativa e inerte — aria-hidden e pointer-events: none.
     =================================================================== */
  var header = document.getElementById('header');
  var bar = document.createElement('div');
  var fill = document.createElement('span');
  var lastProgress = -1;
  var lastHeaderH = -1;

  bar.className = 'mo-progress';
  bar.setAttribute('aria-hidden', 'true');
  fill.className = 'mo-progress__fill';
  bar.appendChild(fill);
  body.appendChild(bar);

  /* A altura do header muda quando ele encolhe (.is-stuck). A barra
     acompanha por variável CSS, sem nunca medir dentro do scroll. */
  function measureHeader() {
    if (!header) return;
    var h = Math.round(header.getBoundingClientRect().height * 10) / 10;
    if (h === lastHeaderH) return;
    lastHeaderH = h;
    root.style.setProperty('--mo-header-h', h + 'px');
  }

  function renderProgress(y) {
    var p = maxScroll > 0 ? clamp(y / maxScroll, 0, 1) : 0;
    p = Math.round(p * 1000) / 1000;
    if (p === lastProgress) return;
    lastProgress = p;
    fill.style.transform = 'scaleX(' + p + ')';
  }

  /* ===================================================================
     3. PARALLAX DE CAPA

     Cache: cada item guarda o topo absoluto e a altura do QUADRO (o
     contêiner), não da imagem — o quadro tem aspect-ratio e não muda de
     tamanho quando a imagem carrega. As medidas são refeitas em rAF no
     init, no load e no resize; o quadro de scroll só faz conta.

     Só os itens visíveis (IntersectionObserver, com folga de 25%)
     recebem a classe .is-par — assim as outras capas da grade não
     carregam camada de composição nem recorte extra à toa.
     =================================================================== */
  var items = [];
  var parallaxOn = false;

  (function collect() {
    var nodes = document.querySelectorAll('.pcard__media img, .spotlight__media img, .case-hero__media img');
    var i;
    for (i = 0; i < nodes.length; i++) {
      if (!nodes[i].parentElement) continue;
      items.push({
        img: nodes[i],
        frame: nodes[i].parentElement,
        top: 0,
        h: 0,
        inview: false,
        applied: false,
        last: null
      });
    }
  })();

  function applyItem(item) {
    var want = parallaxOn && item.inview;
    if (want === item.applied) return;
    item.applied = want;
    if (want) {
      item.img.classList.add('is-par');
    } else {
      item.img.classList.remove('is-par');
      item.img.style.removeProperty('--mo-par');
      item.last = null;
    }
  }

  if (items.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        var i, item;
        for (i = 0; i < entries.length; i++) {
          item = entries[i].target._moItem;
          if (!item) continue;
          item.inview = entries[i].isIntersecting;
          applyItem(item);
        }
        /* Quem acabou de entrar precisa nascer na posição certa, sem
           esperar o próximo evento de scroll. */
        onScroll();
      },
      { rootMargin: '25% 0px 25% 0px' }
    );
    for (var n = 0; n < items.length; n++) {
      items[n].frame._moItem = items[n];
      io.observe(items[n].frame);
    }
  } else {
    /* Sem IntersectionObserver, todos entram na conta: são poucos
       elementos e a atualização continua limitada a um rAF por quadro. */
    for (var m = 0; m < items.length; m++) items[m].inview = true;
  }

  function measureItems() {
    var y = scrollY();
    var i, r;
    for (i = 0; i < items.length; i++) {
      r = items[i].frame.getBoundingClientRect();
      items[i].top = r.top + y;
      items[i].h = r.height;
    }
  }

  function syncParallax() {
    var on = canTranslate && fine.matches && wide.matches && items.length > 0;
    if (on === parallaxOn) return;
    parallaxOn = on;
    root.classList.toggle('has-parallax', on);
    for (var i = 0; i < items.length; i++) applyItem(items[i]);
  }

  /* A capa anda MENOS que a página: quando o quadro está abaixo do meio
     da tela a imagem está deslocada para cima e vai descendo conforme
     sobe — a soma dá um deslocamento menor que o do scroll. */
  function renderParallax(y) {
    if (!parallaxOn || !vh) return;
    var mid = y + vh / 2;
    var i, item, rel, par;
    for (i = 0; i < items.length; i++) {
      item = items[i];
      if (!item.applied) continue;
      rel = clamp((item.top + item.h / 2 - mid) / vh, -1, 1);
      par = Math.round(-rel * MAX_PAR * 10) / 10;
      if (par === item.last) continue;
      item.last = par;
      item.img.style.setProperty('--mo-par', par + 'px');
    }
  }

  /* ===================================================================
     4. CUE DO HERO — some conforme a página rola.

     É ornamento (aria-hidden no template) e o recado dele expira no
     primeiro scroll. Volta inteiro ao voltar para o topo, e sem JS
     nunca sai da tela.
     =================================================================== */
  var cue = document.querySelector('.hero__cue');
  var lastCue = -1;

  function renderCue(y) {
    if (!cue) return;
    var o = Math.round(clamp(1 - y / CUE_FADE, 0, 1) * 100) / 100;
    if (o === lastCue) return;
    lastCue = o;
    cue.style.opacity = o;
  }

  /* ===================================================================
     5. BOTÃO MAGNÉTICO

     O retângulo é lido uma vez, no pointerenter, e reaproveitado no
     pointermove — nada de medir a cada movimento do ponteiro. O
     deslocamento é escrito em variável CSS dentro de rAF; quem anima é
     a transição de transform que .btn já tem.
     =================================================================== */
  function bindMagnet(el) {
    var rect = null;
    var px = 0;
    var py = 0;
    var queued = false;

    function apply() {
      queued = false;
      if (!rect || !rect.width || !rect.height) return;
      var dx = clamp((px - (rect.left + rect.width / 2)) / (rect.width / 2), -1, 1);
      var dy = clamp((py - (rect.top + rect.height / 2)) / (rect.height / 2), -1, 1);
      el.style.setProperty('--mo-mx', (dx * MAX_MAG).toFixed(1) + 'px');
      el.style.setProperty('--mo-my', (dy * MAX_MAG * 0.5).toFixed(1) + 'px');
    }

    function release() {
      rect = null;
      el.style.removeProperty('--mo-mx');
      el.style.removeProperty('--mo-my');
    }

    el.addEventListener(
      'pointerenter',
      function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        if (!fine.matches || !wide.matches) return;
        rect = el.getBoundingClientRect();
        el.classList.add('mo-magnet');
      },
      { passive: true }
    );

    el.addEventListener(
      'pointermove',
      function (e) {
        if (!rect) return;
        px = e.clientX;
        py = e.clientY;
        if (queued) return;
        queued = true;
        requestAnimationFrame(apply);
      },
      { passive: true }
    );

    el.addEventListener('pointerleave', release, { passive: true });
    /* Clicar num link navega e o pointerleave pode não chegar: o
       blur/click devolve o botão ao lugar de qualquer forma. */
    el.addEventListener('click', release, { passive: true });
  }

  (function magnets() {
    if (!('PointerEvent' in window)) return;
    var nodes = document.querySelectorAll('.btn--primary, .btn--ghost');
    for (var i = 0; i < nodes.length; i++) bindMagnet(nodes[i]);
  })();

  /* ===================================================================
     6. QUADRO ÚNICO — um rAF por scroll, para todos os efeitos.
     =================================================================== */
  var ticking = false;

  function render() {
    var y = scrollY();
    renderProgress(y);
    renderParallax(y);
    renderCue(y);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      render();
    });
  }

  function measure() {
    vh = window.innerHeight || 0;
    maxScroll = Math.max(0, (root.scrollHeight || 0) - vh);
    bar.style.display = maxScroll > MIN_SCROLL ? '' : 'none';
    measureHeader();
    syncParallax();
    if (parallaxOn) measureItems();
    lastProgress = -1;
  }

  var remeasuring = false;

  function remeasure() {
    if (remeasuring) return;
    remeasuring = true;
    requestAnimationFrame(function () {
      remeasuring = false;
      measure();
      render();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', remeasure, { passive: true });
  window.addEventListener('orientationchange', remeasure, { passive: true });
  /* Fontes e imagens preguiçosas mudam a altura do documento. */
  window.addEventListener('load', remeasure);

  /* O header encolhe com transição de padding: a barra acompanha a
     altura durante o movimento, não só no fim dele. */
  if (header) {
    if ('ResizeObserver' in window) {
      new ResizeObserver(measureHeader).observe(header);
    } else {
      header.addEventListener('transitionend', measureHeader);
    }
  }

  /* Altura do documento pode mudar sem resize de janela (filtro de
     projetos, fonte que carrega, acordeão). */
  if ('ResizeObserver' in window) {
    new ResizeObserver(remeasure).observe(body);
  }

  if (fine.addEventListener) {
    fine.addEventListener('change', remeasure);
    wide.addEventListener('change', remeasure);
  }

  measure();
  render();
})();
