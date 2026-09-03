'use strict';
/* Igor Araujo — gerado por build.js. Edite src/scripts/, não este arquivo. */

/* ---- theme.js ---- */
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

/* ---- nav.js ---- */
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

/* ---- reveal.js ---- */
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
    '.pindex__row',
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

/* ---- cursor.js ---- */
/* Cursor autoral: um ponto que vira etiqueta sobre elementos com
   data-cursor. Só existe em ponteiro fino — no toque, nada muda. */
(function () {
  var el = document.getElementById('cursor');
  if (!el) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var label = el.querySelector('.cursor__label');
  var tx = -100, ty = -100, cx = -100, cy = -100;
  var running = false;

  document.body.classList.add('has-cursor');

  document.addEventListener(
    'pointermove',
    function (e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!running) { running = true; requestAnimationFrame(frame); }
    },
    { passive: true }
  );

  /* Interpolação: o ponto persegue o ponteiro em vez de colar nele. */
  function frame() {
    cx += (tx - cx) * 0.22;
    cy += (ty - cy) * 0.22;
    el.style.setProperty('--cx', cx.toFixed(2) + 'px');
    el.style.setProperty('--cy', cy.toFixed(2) + 'px');

    if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) requestAnimationFrame(frame);
    else running = false;
  }

  document.addEventListener('pointerover', function (e) {
    var target = e.target.closest ? e.target.closest('[data-cursor]') : null;
    if (!target) return;
    label.textContent = target.getAttribute('data-cursor');
    el.classList.add('is-active');
  });

  document.addEventListener('pointerout', function (e) {
    var target = e.target.closest ? e.target.closest('[data-cursor]') : null;
    if (target && !target.contains(e.relatedTarget)) el.classList.remove('is-active');
  });

  /* Sair da janela não pode deixar a etiqueta presa na tela. */
  document.addEventListener('pointerleave', function () { el.classList.remove('is-active'); });
})();

/* ---- projects.js ---- */
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

/* ---- stepper.js ---- */
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

/* ---- form.js ---- */
/* Formulário sem backend: valida, monta a mensagem e entrega ao
   WhatsApp ou ao cliente de e-mail. Nada trafega por servidor nenhum. */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var wa = form.getAttribute('data-wa');
  var mail = form.getAttribute('data-email');
  var status = form.querySelector('[data-form-status]');
  var rows = form.querySelectorAll('[data-when]');

  /* Alterna os campos conforme a porta escolhida. */
  function mode() {
    var checked = form.querySelector('input[name="mode"]:checked');
    return checked ? checked.value : 'client';
  }

  function syncRows() {
    var current = mode();
    rows.forEach(function (row) {
      var show = row.getAttribute('data-when') === current;
      row.hidden = !show;
      /* Campo escondido não deve ser enviado nem receber foco. */
      row.querySelectorAll('input, select, textarea').forEach(function (field) {
        field.disabled = !show;
      });
    });
  }

  form.querySelectorAll('input[name="mode"]').forEach(function (radio) {
    radio.addEventListener('change', syncRows);
  });
  syncRows();

  /* ---- Validação ------------------------------------------------- */
  function validate() {
    var ok = true;

    form.querySelectorAll('[required]').forEach(function (field) {
      var wrap = field.closest('.field');
      var error = wrap ? wrap.querySelector('[data-error]') : null;
      var empty = !field.value.trim();

      if (wrap) wrap.classList.toggle('is-invalid', empty);
      if (error) error.textContent = empty ? 'Preencha este campo' : '';
      field.setAttribute('aria-invalid', String(empty));

      if (empty && ok) { field.focus(); ok = false; }
    });

    return ok;
  }

  form.querySelectorAll('[required]').forEach(function (field) {
    field.addEventListener('input', function () {
      if (!field.value.trim()) return;
      var wrap = field.closest('.field');
      if (wrap) wrap.classList.remove('is-invalid');
      var error = wrap ? wrap.querySelector('[data-error]') : null;
      if (error) error.textContent = '';
      field.setAttribute('aria-invalid', 'false');
    });
  });

  /* ---- Composição da mensagem ------------------------------------ */
  function value(name) {
    var field = form.elements[name];
    return field && !field.disabled ? String(field.value).trim() : '';
  }

  function compose() {
    var isClient = mode() === 'client';
    var lines = [];

    lines.push(isClient ? 'Olá, Igor! Tenho um projeto.' : 'Olá, Igor! Tenho uma oportunidade.');
    lines.push('');
    lines.push('Nome: ' + value('name'));
    if (value('company')) lines.push('Empresa: ' + value('company'));

    if (isClient) {
      if (value('scope')) lines.push('Projeto: ' + value('scope'));
      if (value('deadline')) lines.push('Prazo: ' + value('deadline'));
    } else {
      if (value('position')) lines.push('Vaga: ' + value('position'));
      if (value('model')) lines.push('Modelo: ' + value('model'));
    }

    lines.push('');
    lines.push(value('message'));

    return {
      subject: isClient ? 'Projeto — ' + value('name') : 'Oportunidade — ' + value('name'),
      body: lines.join('\n'),
    };
  }

  function send(channel) {
    if (!validate()) {
      if (status) status.textContent = 'Faltou preencher os campos obrigatórios.';
      return;
    }

    var msg = compose();
    var url =
      channel === 'email'
        ? 'mailto:' + mail + '?subject=' + encodeURIComponent(msg.subject) + '&body=' + encodeURIComponent(msg.body)
        : 'https://wa.me/' + wa + '?text=' + encodeURIComponent(msg.body);

    if (status) status.textContent = channel === 'email' ? 'Abrindo seu cliente de e-mail…' : 'Abrindo o WhatsApp…';

    if (channel === 'email') window.location.href = url;
    else window.open(url, '_blank', 'noopener');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    send('whatsapp');
  });

  var emailBtn = form.querySelector('[data-send="email"]');
  if (emailBtn) emailBtn.addEventListener('click', function () { send('email'); });
})();

/* ---- cv.js ---- */
/* O PDF do currículo é opcional.
   O href já nasce apontando para a versão web da experiência — link
   sempre válido, inclusive para quem chega sem JS e para crawlers.
   Aqui checamos uma única vez se o PDF existe e, se existir, promovemos
   os botões para baixá-lo. Melhora progressiva, nunca 404. */
(function () {
  var links = document.querySelectorAll('[data-cv]');
  if (!links.length || !window.fetch) return;

  var pdf = links[0].getAttribute('data-cv');
  if (!pdf) return;

  fetch(pdf, { method: 'HEAD' })
    .then(function (res) {
      if (!res.ok) return;
      links.forEach(function (link) {
        link.href = link.getAttribute('data-cv');
        link.setAttribute('download', '');
      });
    })
    .catch(function () {
      /* Sem rede ou bloqueado: o link web continua valendo. */
    });
})();

/* ---- clock.js ---- */
/* Relógio local de Vitória. Detalhe pequeno, mas diz que tem alguém
   do outro lado — e que o site está vivo. */
(function () {
  var nodes = document.querySelectorAll('[data-clock]');
  if (!nodes.length) return;

  var fmt;
  try {
    fmt = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return;
  }

  function tick() {
    var time = fmt.format(new Date());
    nodes.forEach(function (node) {
      /* data-clock="time" só mostra a hora, para onde o local já está escrito. */
      node.textContent = node.getAttribute('data-clock') === 'time' ? 'Hora local · ' + time : 'Vitória, ES · ' + time;
    });
  }

  tick();
  setInterval(tick, 30000);
})();

/* ---- cta.js ---- */
/* Atalho fixo de conversa: some enquanto a pessoa desce a página e
   volta quando ela sobe.

   Motivo: é um botão flutuante, então em algum ponto da rolagem ele
   sempre fica por cima de alguma coisa. Numa auditoria de layout ele
   apareceu cobrindo card de projeto, aba do AI Lab e os próprios
   canais de contato. Escondê-lo durante a descida elimina quase toda
   sobreposição sem tirar o atalho de quem procura por ele: subir a
   página é justamente o gesto de quem está voltando para decidir.

   Também some de vez quando o CTA final entra em cena, porque ali as
   duas portas já estão na tela e o botão só competiria com elas.

   Sem JavaScript nada disto roda e o botão fica sempre visível, que é
   o comportamento seguro. */
(function () {
  var wa = document.querySelector('.wa');
  if (!wa) return;

  var lastY = window.pageYOffset || 0;
  var hidden = false;
  var atEnd = false;
  var ticking = false;
  var THRESHOLD = 6; /* ignora tremidas de trackpad */

  function setHidden(next) {
    if (next === hidden) return;
    hidden = next;
    wa.classList.toggle('is-away', hidden);
    /* Fora da tela também sai da ordem de foco: ninguém tabula para um
       botão que não está visível. */
    if (hidden) wa.setAttribute('tabindex', '-1');
    else wa.removeAttribute('tabindex');
  }

  /* Um botão flutuante sempre acaba por cima de alguma coisa. Quando o
     que está embaixo é clicável, ele deixa de ser atalho e vira
     obstáculo: na auditoria ele chegou a tapar uma aba do AI Lab no
     celular, tornando-a inalcançável. Aqui olhamos a pilha de
     elementos sob o centro do botão e saímos da frente se houver um
     link ou botão ali. */
  /* Nem toda sobreposição atrapalha. Cobrir o canto de um card largo
     não impede ninguém de clicar nele; cobrir uma aba do tamanho do
     próprio botão, sim. Por isso a decisão é por proporção: só sai da
     frente quando engole um pedaço relevante do alvo. */
  var COVER_LIMIT = 0.3;

  function coveringSomething() {
    if (!document.elementsFromPoint) return false;
    var r = wa.getBoundingClientRect();
    var stack = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2);

    for (var i = 0; i < stack.length; i++) {
      var el = stack[i];
      if (el === wa || wa.contains(el)) continue;

      var hit = el.closest && el.closest('a, button, input, select, textarea, summary, [role="tab"]');
      if (!hit) break; /* o que está embaixo não é clicável */

      var t = hit.getBoundingClientRect();
      var area = t.width * t.height;
      if (!area) break;

      var ox = Math.max(0, Math.min(r.right, t.right) - Math.max(r.left, t.left));
      var oy = Math.max(0, Math.min(r.bottom, t.bottom) - Math.max(r.top, t.top));
      return (ox * oy) / area > COVER_LIMIT;
    }
    return false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.pageYOffset || 0;
      var delta = y - lastY;
      var moved = Math.abs(delta) >= THRESHOLD;
      if (moved) lastY = y;
      /* No fim da página quem manda é o observador. */
      if (atEnd) return;
      if (moved && y > 240 && delta > 0) { setHidden(true); return; }
      /* Subindo ou parado: só volta se não estiver atrapalhando. */
      setHidden(coveringSomething());
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* CTA final ou rodapé na tela: o atalho sai de cena. */
  var end = document.querySelector('.doors') || document.querySelector('.footer');
  if (end && 'IntersectionObserver' in window) {
    new IntersectionObserver(
      function (entries) {
        atEnd = entries[0].isIntersecting;
        setHidden(atEnd || coveringSomething());
      },
      { rootMargin: '0px 0px -25% 0px' }
    ).observe(end);
  }

  /* O estado inicial também importa: ao abrir a página o botão já pode
     estar por cima de um card, sem que nenhum scroll tenha acontecido. */
  function settle() { setHidden(atEnd || coveringSomething()); }
  if (document.readyState === 'complete') settle();
  else window.addEventListener('load', settle);
  window.addEventListener('resize', settle, { passive: true });
})();

/* ---- carousel.js ---- */
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

/* ---- viewer.js ---- */
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
      if (moved) return;
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
    var full = src.currentSrc || src.getAttribute('src');
    var alt = src.getAttribute('alt') || '';

    view.setAttribute('src', full);
    view.setAttribute('alt', alt);
    /* Reserva a proporção antes de o arquivo chegar, para a peça não
       nascer como uma faixa e saltar ao carregar. A medida real do
       arquivo vale mais do que os atributos do markup: o herói do case
       vem recortado em 16/9 no atributo e a peça inteira pode ser
       quadrada, e é a peça inteira que aparece aqui. */
    size(src.naturalWidth || src.getAttribute('width'), src.naturalHeight || src.getAttribute('height'));

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

    /* O foco volta para a imagem que abriu, não para o topo da página. */
    if (lastFocus && lastFocus.focus) lastFocus.focus();
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

/* ---- motion.js ---- */
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
     6. NÚMEROS QUE CONTAM

     Só a faixa .num__v, e só quando o valor é um inteiro simples
     ("11+", "7"): qualquer outro formato fica intocado. O sufixo é
     preservado e, no fim, o texto original é restaurado caractere por
     caractere — o DOM termina exatamente como veio do build.

     Dois observadores em série, para o DOM nunca ficar zerado à toa:
     o primeiro zera o número pouco antes de ele chegar à viewport, o
     segundo dispara a contagem quando ele aparece de fato. Se o número
     já estiver visível quando o observador acorda (abertura da página,
     rolagem de baixo para cima), a contagem é abandonada e o valor real
     fica onde está — piscar de 11 para 0 é pior que não animar.
     Sem JS, sem IntersectionObserver ou com movimento reduzido, o
     número simplesmente já está lá.
     =================================================================== */
  (function counters() {
    if (!('IntersectionObserver' in window)) return;

    var nodes = document.querySelectorAll('.num__v');
    var list = [];
    var i, raw, match, item;

    for (i = 0; i < nodes.length; i++) {
      raw = (nodes[i].textContent || '').trim();
      match = /^([0-9]{1,4})([^0-9]{0,3})$/.exec(raw);
      if (!match) continue;
      if (parseInt(match[1], 10) < 2) continue; /* contar até 1 não é animação */
      list.push({ el: nodes[i], raw: raw, target: parseInt(match[1], 10), suffix: match[2] });
    }
    if (!list.length) return;

    function run(it) {
      var start = 0;
      var dur = 900;
      function step(now) {
        if (!start) start = now;
        var t = clamp((now - start) / dur, 0, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        if (t < 1) {
          it.el.textContent = Math.round(eased * it.target) + it.suffix;
          requestAnimationFrame(step);
        } else {
          it.el.textContent = it.raw; /* volta ao texto original, exato */
        }
      }
      requestAnimationFrame(step);
    }

    /* Já visível de verdade (sem contar a folga do rootMargin)? */
    function onScreen(entry) {
      var r = entry.boundingClientRect;
      return r.bottom > 0 && r.top < (window.innerHeight || 0);
    }

    var ioRun = new IntersectionObserver(
      function (entries) {
        var k;
        for (k = 0; k < entries.length; k++) {
          if (!entries[k].isIntersecting) continue;
          ioRun.unobserve(entries[k].target);
          run(entries[k].target._moNum);
        }
      },
      { threshold: 0.45 }
    );

    var ioPrime = new IntersectionObserver(
      function (entries) {
        var k, entry, target;
        for (k = 0; k < entries.length; k++) {
          entry = entries[k];
          target = entry.target._moNum;
          if (!target || !entry.isIntersecting) continue;
          ioPrime.unobserve(entry.target);
          if (onScreen(entry)) continue; /* já está sendo lido: não mexe */
          entry.target.textContent = '0' + target.suffix;
          ioRun.observe(entry.target);
        }
      },
      { rootMargin: '0px 0px 45% 0px' }
    );

    for (i = 0; i < list.length; i++) {
      item = list[i];
      item.el._moNum = item;
      ioPrime.observe(item.el);
    }
  })();

  /* ===================================================================
     7. QUADRO ÚNICO — um rAF por scroll, para todos os efeitos.
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
