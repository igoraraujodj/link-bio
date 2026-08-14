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
