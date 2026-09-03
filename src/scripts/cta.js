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
