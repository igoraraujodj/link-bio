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
