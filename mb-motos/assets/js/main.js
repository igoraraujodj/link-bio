/* MB Motos — comportamento da página.
   Lê window.MB (assets/js/config.js) e preenche links, horários, ofertas e
   dados estruturados. Sem dependência externa. */

(function () {
  'use strict';

  var MB = window.MB;
  if (!MB) return;

  var $  = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  var enderecoCompleto = [
    MB.endereco.logradouro,
    MB.endereco.bairro,
    MB.endereco.cidade + ' - ' + MB.endereco.estado
  ].filter(Boolean).join(', ');

  /* ---------- WhatsApp ----------
     Cada CTA manda o serviço no texto da mensagem, para saber depois qual
     bloco da página gerou a conversa. */
  function linkZap(servico) {
    var texto = servico && servico !== 'atendimento geral'
      ? 'Olá! Vim pelo site e quero saber sobre ' + servico + '.'
      : MB.mensagemPadrao;
    return 'https://wa.me/' + MB.whatsapp + '?text=' + encodeURIComponent(texto);
  }

  $$('[data-zap]').forEach(function (el) {
    var servico = el.getAttribute('data-servico') || 'atendimento geral';
    el.setAttribute('href', linkZap(servico));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
    el.addEventListener('click', function () { medir('contato_whatsapp', servico); });
  });

  /* ---------- Telefone ---------- */
  $$('[data-tel]').forEach(function (el) {
    el.setAttribute('href', 'tel:' + MB.telefone);
    el.textContent = formatarTelefone(MB.telefone);
  });
  $$('[data-tel-linha]').forEach(function (el) {
    el.textContent = 'Ou ligue: ' + formatarTelefone(MB.telefone);
  });
  $$('[data-tel-simples]').forEach(function (el) {
    el.setAttribute('href', 'tel:' + MB.telefone);
    el.addEventListener('click', function () { medir('contato_telefone', 'barra fixa'); });
  });

  function formatarTelefone(t) {
    var d = String(t).replace(/\D/g, '').replace(/^55/, '');
    if (d.length === 11) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
    if (d.length === 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return t;
  }

  /* ---------- Rota e mapa ----------
     Dois aplicativos, porque motociclista costuma ter preferência forte
     entre um e outro. */
  var destino = MB.nome + ', ' + enderecoCompleto;

  var rota = MB.googleMaps ||
    'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(destino);
  $$('[data-rota]').forEach(function (el) {
    el.setAttribute('href', rota);
    el.addEventListener('click', function () { medir('clique_rota', 'google maps'); });
  });

  $$('[data-waze]').forEach(function (el) {
    el.setAttribute('href', 'https://waze.com/ul?q=' + encodeURIComponent(destino) + '&navigate=yes');
    el.addEventListener('click', function () { medir('clique_rota', 'waze'); });
  });

  $$('[data-mapa]').forEach(function (el) {
    el.setAttribute('src', MB.mapaEmbed ||
      'https://www.google.com/maps?q=' + encodeURIComponent(destino) + '&z=16&output=embed');
  });

  /* ---------- Endereço ---------- */
  $$('[data-endereco]').forEach(function (el) { el.textContent = enderecoCompleto; });
  $$('[data-endereco-curto]').forEach(function (el) {
    el.textContent = MB.endereco.bairro + ', ' + MB.endereco.cidade + '/' + MB.endereco.estado;
  });
  if (MB.endereco.referencia) {
    $$('[data-referencia]').forEach(function (el) { el.textContent = MB.endereco.referencia; });
  }

  /* ---------- Instagram ---------- */
  if (MB.instagram) {
    $$('[data-insta]').forEach(function (el) {
      el.setAttribute('href', 'https://instagram.com/' + MB.instagram.replace('@', ''));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
      el.hidden = false;
    });
  }

  /* ---------- Horários e status aberto/fechado ---------- */
  var agora = new Date();
  var hoje = agora.getDay();
  var minutosAgora = agora.getHours() * 60 + agora.getMinutes();

  function paraMinutos(hhmm) {
    var p = hhmm.split(':');
    return Number(p[0]) * 60 + Number(p[1]);
  }

  var tbody = $('[data-horarios]');
  if (tbody) {
    MB.horarios.forEach(function (h, i) {
      var tr = document.createElement('tr');
      if (i === hoje) tr.setAttribute('data-hoje', '');
      var td1 = document.createElement('td');
      td1.textContent = h.dia;
      var td2 = document.createElement('td');
      td2.textContent = h.abre ? h.abre + ' às ' + h.fecha : 'Fechado';
      tr.appendChild(td1); tr.appendChild(td2);
      tbody.appendChild(tr);
    });
  }

  var statusEl = $('[data-status]');
  if (statusEl) {
    var h = MB.horarios[hoje];
    var aberto = !!(h && h.abre) && minutosAgora >= paraMinutos(h.abre) && minutosAgora < paraMinutos(h.fecha);
    statusEl.setAttribute('data-aberto', aberto ? 'sim' : 'nao');
    $('[data-status-texto]', statusEl).textContent = aberto
      ? 'Loja aberta agora. Fale com o nosso time'
      : 'Loja fechada agora. Deixe sua mensagem';

    var nota = $('[data-status-nota]');
    if (nota) {
      nota.textContent = aberto
        ? 'Atendimento até às ' + h.fecha + ', de segunda a sábado.'
        : 'Mande sua mensagem agora: assim que um atendente assumir, ele monta seu orçamento. ' +
          proximaAbertura().charAt(0).toUpperCase() + proximaAbertura().slice(1) + '.';
    }
  }

  function proximaAbertura() {
    for (var i = 0; i < 7; i++) {
      var d = (hoje + i) % 7;
      var h = MB.horarios[d];
      if (!h || !h.abre) continue;
      if (i === 0 && minutosAgora >= paraMinutos(h.abre)) continue;
      if (i === 0) return 'abre hoje às ' + h.abre;
      if (i === 1) return 'abre amanhã às ' + h.abre;
      return 'abre ' + h.dia.toLowerCase() + ' às ' + h.abre;
    }
    return 'consulte pelo WhatsApp';
  }

  /* ---------- Provas do topo ---------- */
  var provasEl = $('[data-provas]');
  if (provasEl && MB.provas) {
    MB.provas.forEach(function (p) {
      var li = document.createElement('li');
      var strong = document.createElement('strong');
      strong.textContent = p.numero;
      var span = document.createElement('span');
      span.textContent = p.texto;
      li.appendChild(strong); li.appendChild(span);
      provasEl.appendChild(li);
    });
  }

  /* ---------- Ofertas ----------
     Cada oferta vira um card, e a primeira marcada como destaque ocupa a
     largura toda. O CTA já leva o nome da oferta para o WhatsApp, para saber
     depois qual delas puxou a conversa. */
  var ofertas = (MB.ofertas || []).filter(function (o) { return o.ativa; });
  var caixaOfertas = $('[data-ofertas]');

  if (caixaOfertas) {
    if (!ofertas.length) {
      $('#ofertas').hidden = true;
    } else {
      ofertas.forEach(function (o) {
        caixaOfertas.appendChild(montarOferta(o));
      });
    }
  }

  function montarOferta(o) {
    var art = document.createElement('article');
    art.className = 'oferta' + (o.destaque ? ' oferta--destaque' : '');

    var selo = document.createElement('p');
    selo.className = 'oferta__selo';
    selo.textContent = o.selo;
    art.appendChild(selo);

    var h3 = document.createElement('h3');
    h3.textContent = o.titulo;
    art.appendChild(h3);

    if (o.resumo) {
      var resumo = document.createElement('p');
      resumo.className = 'oferta__resumo';
      resumo.textContent = o.resumo;
      art.appendChild(resumo);
    }

    var preco = document.createElement('p');
    preco.className = 'oferta__preco';
    if (o.precoDe) {
      var de = document.createElement('s');
      de.textContent = o.precoDe;
      preco.appendChild(de);
    }
    var valor = document.createElement('strong');
    valor.textContent = o.preco;
    preco.appendChild(valor);
    if (o.precoNota) {
      var nota = document.createElement('span');
      nota.textContent = o.precoNota;
      preco.appendChild(nota);
    }
    art.appendChild(preco);

    if (o.itens && o.itens.length) {
      var ul = document.createElement('ul');
      ul.className = 'lista-check';
      o.itens.forEach(function (txt) {
        var li = document.createElement('li');
        li.textContent = txt;
        ul.appendChild(li);
      });
      art.appendChild(ul);
    }

    var cta = document.createElement('a');
    cta.className = 'btn btn--zap' + (o.destaque ? ' btn--g' : '');
    cta.setAttribute('href', linkZap(o.titulo));
    cta.setAttribute('target', '_blank');
    cta.setAttribute('rel', 'noopener');
    cta.textContent = o.cta || 'Quero essa oferta';
    cta.addEventListener('click', function () { medir('contato_whatsapp', 'oferta ' + o.id); });
    art.appendChild(cta);

    var quando = proximaData(o.diaSemana);
    if (quando) {
      var p = document.createElement('p');
      p.className = 'oferta__quando';
      p.textContent = quando;
      art.appendChild(p);
    }

    if (o.obs) {
      var obs = document.createElement('p');
      obs.className = 'oferta__obs';
      obs.textContent = o.obs;
      art.appendChild(obs);
    }

    return art;
  }

  /* Texto da próxima data de uma oferta que acontece num dia fixo. */
  function proximaData(diaSemana) {
    if (diaSemana === null || diaSemana === undefined) return '';
    var faltam = (diaSemana - hoje + 7) % 7;
    if (faltam === 0) return 'É hoje. Corre que o estoque é o da loja.';
    if (faltam === 1) return 'É amanhã.';
    var data = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + faltam);
    return 'Próxima: ' + data.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) + '.';
  }

  /* ---------- Marcas ---------- */
  var caixaMarcas = $('[data-marcas]');
  if (caixaMarcas && MB.marcas) {
    MB.marcas.forEach(function (m) {
      var li = document.createElement('li');
      if (m.logo) {
        var img = document.createElement('img');
        img.src = m.logo;
        img.alt = m.nome;
        img.loading = 'lazy';
        li.appendChild(img);
      } else {
        li.textContent = m.nome;
      }
      caixaMarcas.appendChild(li);
    });
  }

  /* ---------- Balão flutuante do mascote ----------
     Aparece depois de um respiro, para não brigar com o hero logo na
     chegada. Quem fecha não vê de novo na mesma visita. */
  var mascote = $('[data-mascote]');
  if (mascote && MB.mascote && MB.mascote.ativo && !leu('mb_mascote_fechado')) {
    $('[data-mascote-nome]').textContent = MB.mascote.nome;
    $('[data-mascote-fala]').textContent = MB.mascote.fala;

    var foto = $('[data-mascote-foto]');
    if (MB.mascote.foto) foto.style.backgroundImage = 'url("' + MB.mascote.foto + '")';

    var link = $('[data-mascote-link]');
    link.setAttribute('href', 'https://wa.me/' + MB.whatsapp + '?text=' + encodeURIComponent(MB.mascote.mensagem));
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
    link.addEventListener('click', function () { medir('contato_whatsapp', 'balão flutuante'); });

    $('[data-mascote-fechar]').addEventListener('click', function () {
      mascote.hidden = true;
      escreveu('mb_mascote_fechado', '1');
    });

    /* Só aparece depois que a pessoa rola para fora do topo: no celular o
       balão cobriria justamente o botão principal do hero. */
    var mostrar = function () {
      if (window.scrollY < 500) return;
      mascote.hidden = false;
      window.removeEventListener('scroll', mostrar);
    };
    window.addEventListener('scroll', mostrar, { passive: true });
    mostrar();
  }

  /* sessionStorage pode estourar em aba anônima: nunca deixa quebrar a página */
  function leu(chave) {
    try { return sessionStorage.getItem(chave); } catch (e) { return null; }
  }
  function escreveu(chave, valor) {
    try { sessionStorage.setItem(chave, valor); } catch (e) { /* segue o jogo */ }
  }

  /* ---------- Ano e CNPJ no rodapé ---------- */
  $$('[data-ano]').forEach(function (el) { el.textContent = agora.getFullYear(); });
  if (MB.cnpj) {
    $$('[data-cnpj]').forEach(function (el) { el.textContent = ', CNPJ ' + MB.cnpj; });
  }

  /* ---------- Menu mobile ---------- */
  var btnMenu = $('.hamburguer');
  var lista = $('#menu-lista');
  if (btnMenu && lista) {
    btnMenu.addEventListener('click', function () {
      var aberto = lista.classList.toggle('aberto');
      btnMenu.setAttribute('aria-expanded', String(aberto));
      btnMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });
    lista.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        lista.classList.remove('aberto');
        btnMenu.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Entrada por scroll ---------- */
  var alvos = $$('.card, .item, .passos li, .depo, .selo, .foto, .secao__topo');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('visivel');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    alvos.forEach(function (el) { el.classList.add('revela'); obs.observe(el); });
  }

  /* ---------- Medição ----------
     Dispara para GA4 e para o Pixel da Meta quando eles existirem na página.
     Enquanto as tags não forem instaladas, não faz nada e não quebra. */
  function medir(evento, rotulo) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', evento, { origem: rotulo });
    }
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', evento, { origem: rotulo });
    }
  }

  /* ---------- Dados estruturados (SEO local) ---------- */
  var diasSchema = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var schema = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: MB.nome,
    description: 'Oficina de motos em Cariacica, ES. Revisão, manutenção, troca de kit relação, pneus, carenagem e peças em estoque.',
    url: location.href.split('#')[0],
    telephone: MB.telefone,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: MB.endereco.logradouro,
      addressLocality: MB.endereco.cidade,
      addressRegion: MB.endereco.estado,
      postalCode: MB.endereco.cep || undefined,
      addressCountry: 'BR'
    },
    geo: { '@type': 'GeoCoordinates', latitude: MB.endereco.lat, longitude: MB.endereco.lng },
    areaServed: ['Cariacica', 'Vila Velha', 'Vitória', 'Serra', 'Viana'],
    openingHoursSpecification: MB.horarios
      .map(function (h, i) {
        if (!h.abre) return null;
        return {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: diasSchema[i],
          opens: h.abre,
          closes: h.fecha
        };
      })
      .filter(Boolean),
    makesOffer: $$('#servicos .card h3').map(function (h3) {
      return { '@type': 'Offer', itemOffered: { '@type': 'Service', name: h3.textContent.trim() } };
    }).concat(ofertas.map(function (o) {
      var oferta = { '@type': 'Offer', name: o.titulo, description: o.resumo };
      /* Só vira preço o que está em reais. Desconto percentual não é preço e
         publicar como tal daria dado errado no resultado de busca. */
      var reais = String(o.preco).match(/R\$\s*([\d.]+(?:,\d{2})?)/);
      if (reais) {
        oferta.priceCurrency = 'BRL';
        oferta.price = reais[1].replace(/\./g, '').replace(',', '.');
      }
      return oferta;
    }))
  };

  var faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: $$('.faq details').map(function (d) {
      return {
        '@type': 'Question',
        name: $('summary', d).textContent.trim(),
        acceptedAnswer: { '@type': 'Answer', text: $('div', d).textContent.trim() }
      };
    })
  };

  var tag = $('[data-schema]');
  if (tag) tag.textContent = JSON.stringify([schema, faq]);
})();
