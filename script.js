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
