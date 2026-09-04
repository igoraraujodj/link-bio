/* Visualizador de imagens.

   Faltava no site um lugar onde olhar uma peça de perto: as capas eram
   miniaturas e acabava aí. Este arquivo transforma as imagens de
   trabalho em botões e abre um diálogo em tela cheia com elas, sem
   pedir uma linha de markup aos templates: os alvos são achados por
   seletor, e sem JavaScript a página continua exatamente como era.

   Duas decisões explicam o resto do arquivo.

   Só entram imagens que não estão dentro de um link. A capa de um card
   de projeto leva para o case, e essa navegação vale mais do que ver a
   capa ampliada: roubar o clique ali trocaria a página inteira por uma
   foto. Sobram a abertura do case e a galeria, que são a peça em si e
   não levam a lugar nenhum.

   O grupo é a página, não a caixa. Num case, o herói e a galeria contam
   a mesma história; agrupar por contêiner menor deixaria o herói como
   grupo de um só e cortaria a fila no meio. Por isso o grupo é o <main>
   e as setas percorrem todas as imagens do case, na ordem em que estão
   na página. */
(function () {
  var TARGETS = [
    '.case-hero__media img',
    '.case-gallery img',
  ];

  var ICON = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
    expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3H5.5A2.5 2.5 0 0 0 3 5.5V9m12-6h3.5A2.5 2.5 0 0 1 21 5.5V9M9 21H5.5A2.5 2.5 0 0 1 3 18.5V15m12 6h3.5a2.5 2.5 0 0 0 2.5-2.5V15"/></svg>',
  };

  var groups = [];
  var found = document.querySelectorAll(TARGETS.join(','));

  Array.prototype.forEach.call(found, function (img) {
    /* Dentro de um link ou de um botão o clique já tem dono. Sem alt a
       imagem é decorativa: não há o que legendar nem por que dar a ela
       uma parada de foco. */
    if (img.closest('a, button')) return;
    if (!img.getAttribute('alt')) return;

    var root = img.closest('main') || document.body;
    var set = null;
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].root === root) set = groups[i];
    }
    if (!set) {
      set = { root: root, items: [] };
      groups.push(set);
    }

    set.items.push(img);
    arm(img, set, set.items.length - 1);
  });

  if (!groups.length) return;

  var reduce = false;
  try {
    reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  var box = null;      /* o diálogo, montado na primeira abertura */
  var view, legend, count, nav, closeBtn;
  var group = null;    /* grupo em exibição */
  var at = 0;          /* posição dentro do grupo */
  var lastFocus = null;
  var hideTimer = null;
  var warmed = {};

  /* ---- Gatilho ------------------------------------------------------
     A imagem vira o conteúdo de um botão de verdade: teclado, foco e
     papel vêm de graça, sem role nem tabindex postiços. O rótulo diz a
     ação e o alt continua dizendo o que é a peça. */
  function arm(img, set, i) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vzoom';
    /* Encaixe no cursor autoral do site: em ponteiro fino a etiqueta
       "Ampliar" aparece no lugar do ponto. */
    btn.setAttribute('data-cursor', 'Ampliar');

    img.parentNode.insertBefore(btn, img);
    btn.innerHTML = '<span class="sr-only">Ampliar:</span>';
    btn.appendChild(img);
    btn.insertAdjacentHTML(
      'beforeend',
      '<span class="go go--light vzoom__go" aria-hidden="true">' + ICON.expand + '</span>'
    );

    btn.addEventListener('click', function () { open(set, i); });
  }

  /* ---- Diálogo ------------------------------------------------------ */
  function build() {
    if (box) return;

    box = document.createElement('div');
    box.className = 'viewer';
    box.hidden = true;
    box.innerHTML =
      '<div class="viewer__dialog" role="dialog" aria-modal="true" aria-label="Visualizador de imagens">' +
        '<div class="viewer__bar">' +
          '<button class="cbtn viewer__close" type="button"><span class="sr-only">Fechar visualizador</span>' + ICON.close + '</button>' +
        '</div>' +
        '<div class="viewer__stage"><img class="viewer__img" alt=""></div>' +
        '<div class="viewer__foot">' +
          '<p class="viewer__cap" aria-live="polite">' +
            '<span class="viewer__legend"></span>' +
            '<span class="viewer__count"></span>' +
          '</p>' +
          '<div class="viewer__nav">' +
            '<button class="cbtn viewer__prev" type="button"><span class="sr-only">Imagem anterior</span>' + ICON.prev + '</button>' +
            '<button class="cbtn viewer__next" type="button"><span class="sr-only">Próxima imagem</span>' + ICON.next + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(box);

    view = box.querySelector('.viewer__img');
    legend = box.querySelector('.viewer__legend');
    count = box.querySelector('.viewer__count');
    nav = box.querySelector('.viewer__nav');
    closeBtn = box.querySelector('.viewer__close');

    closeBtn.addEventListener('click', close);
    box.querySelector('.viewer__prev').addEventListener('click', function () { show(at - 1); });
    box.querySelector('.viewer__next').addEventListener('click', function () { show(at + 1); });

    /* Clicar no vazio ao redor da peça é a saída mais usada. O arrasto
       termina em clique também, e um arrasto não pode fechar nada. */
    box.addEventListener('click', function (e) {
      var dragged = moved;
      moved = false;
      if (dragged) return;
      if (e.target.closest('button, .viewer__foot') || e.target === view) return;
      close();
    });

    /* O navegador começaria um drag-and-drop na imagem e engoliria o
       resto do gesto. */
    view.addEventListener('dragstart', function (e) { e.preventDefault(); });

    swipe(box.querySelector('.viewer__stage'));
  }

  function show(i) {
    var items = group.items;
    at = (i + items.length) % items.length;

    var src = items[at];
    var alt = src.getAttribute('alt') || '';

    view.setAttribute('alt', alt);
    /* A proporção é reservada antes do src para a peça não nascer como
       uma faixa e saltar ao carregar. A medida real do arquivo vale mais
       do que os atributos do markup: o herói do case vem recortado em
       16/9 no atributo e a peça inteira pode ser quadrada, e é a peça
       inteira que aparece aqui. */
    size(src.naturalWidth || src.getAttribute('width'), src.naturalHeight || src.getAttribute('height'));
    view.setAttribute('src', src.currentSrc || src.getAttribute('src'));

    legend.textContent = alt;
    count.textContent = items.length > 1 ? at + 1 + ' de ' + items.length : '';
    nav.hidden = items.length < 2;

    warm(at + 1);
    warm(at - 1);
  }

  function size(w, h) {
    if (w && h) {
      view.setAttribute('width', w);
      view.setAttribute('height', h);
    } else {
      view.removeAttribute('width');
      view.removeAttribute('height');
    }
  }

  /* Vizinhas na memória: quem navega com a seta não espera o download. */
  function warm(i) {
    var items = group.items;
    var img = items[(i + items.length) % items.length];
    var src = img.currentSrc || img.getAttribute('src');
    if (!src || warmed[src]) return;
    warmed[src] = new Image();
    warmed[src].src = src;
  }

  function open(g, i) {
    build();
    group = g;
    lastFocus = document.activeElement;
    show(i);

    clearTimeout(hideTimer);
    box.hidden = false;
    /* Uma leitura de layout separa o estado inicial do final; sem ela o
       navegador pinta os dois de uma vez e não há transição. */
    void box.offsetWidth;
    box.classList.add('is-open');

    shield(true);
    document.body.classList.add('is-locked');
    closeBtn.focus();
  }

  function close() {
    if (!box || box.hidden) return;

    box.classList.remove('is-open');
    shield(false);
    document.body.classList.remove('is-locked');

    /* Sai do fluxo e da árvore de acessibilidade só depois do fade; com
       menos movimento, na hora. */
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () { box.hidden = true; }, reduce ? 0 : 240);

    /* O foco volta para a peça que estava na tela, e não para o topo da
       página. Quem percorreu a galeria até a quinta imagem espera sair
       nela, não voltar para a primeira; se por algum motivo o gatilho
       tiver sumido, vale quem abriu. */
    var back = group && group.items[at] ? group.items[at].closest('.vzoom') : null;
    if (back) back.focus();
    else if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }

  /* ---- Resto da página ----------------------------------------------
     inert é o certo: tira do foco, do ponteiro e do leitor de tela de
     uma vez. Onde não existe, aria-hidden ao menos cala o leitor. */
  var canInert = 'inert' in HTMLElement.prototype;

  function shield(on) {
    var kids = document.body.children;
    for (var i = 0; i < kids.length; i++) {
      var el = kids[i];
      if (el === box) continue;
      if (canInert) el.inert = on;
      else if (on) el.setAttribute('aria-hidden', 'true');
      else el.removeAttribute('aria-hidden');
    }
  }

  /* ---- Teclado ------------------------------------------------------ */
  document.addEventListener('keydown', function (e) {
    if (!box || box.hidden) return;

    if (e.key === 'Escape') { e.preventDefault(); close(); return; }

    if (group.items.length > 1) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); return; }
      if (e.key === 'Home') { e.preventDefault(); show(0); return; }
      if (e.key === 'End') { e.preventDefault(); show(group.items.length - 1); return; }
    }

    if (e.key === 'Tab') trap(e);
  });

  function trap(e) {
    var items = [];
    Array.prototype.forEach.call(box.querySelectorAll('button:not([disabled])'), function (b) {
      /* offsetParent nulo é a forma barata de perguntar se o botão está
         mesmo na tela: as setas somem quando o grupo tem uma imagem só. */
      if (b.offsetParent !== null) items.push(b);
    });
    if (!items.length) return;

    var first = items[0];
    var last = items[items.length - 1];

    if (items.indexOf(document.activeElement) === -1) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ---- Toque e arrasto ----------------------------------------------
     Um ponteiro só. Se um segundo dedo encosta, o gesto é pinça e a
     função sai de cena: o zoom nativo do navegador é dele, não nosso.
     Quem segura o eixo é o touch-action do CSS. */
  var pointer = null;
  var sx = 0, sy = 0, moved = false;

  function swipe(stage) {
    stage.addEventListener('pointerdown', function (e) {
      if (pointer !== null) { pointer = null; return; }
      pointer = e.pointerId;
      sx = e.clientX;
      sy = e.clientY;
      moved = false;
    });

    stage.addEventListener('pointermove', function (e) {
      if (e.pointerId !== pointer) return;
      if (Math.abs(e.clientX - sx) > 10 || Math.abs(e.clientY - sy) > 10) moved = true;
    });

    stage.addEventListener('pointerup', function (e) {
      if (e.pointerId !== pointer) return;
      pointer = null;

      var dx = e.clientX - sx;
      var dy = e.clientY - sy;
      /* Só conta como troca o gesto claramente horizontal e longo o
         bastante para não ser tremida de dedo. */
      if (group.items.length > 1 && Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy)) {
        show(at + (dx < 0 ? 1 : -1));
      }
    });

    stage.addEventListener('pointercancel', function () { pointer = null; });
  }
})();
