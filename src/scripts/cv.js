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
