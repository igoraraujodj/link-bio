/* MB Motos — comportamento da página.
   Lê window.MB (assets/js/config.js) e preenche links, horários, promoção e
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
     Cada CTA manda o serviço no texto e uma UTM no link, para saber depois
     qual bloco da página gerou a conversa. */
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

  /* ---------- Rota ---------- */
  var rota = MB.googleMaps ||
    'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(MB.nome + ', ' + enderecoCompleto);
  $$('[data-rota]').forEach(function (el) {
    el.setAttribute('href', rota);
    el.addEventListener('click', function () { medir('clique_rota', 'mapa'); });
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
      ? 'Aberto agora, fecha às ' + h.fecha
      : 'Fechado agora, ' + proximaAbertura();
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

  /* ---------- Oferta da semana ---------- */
  var secaoOferta = $('[data-oferta]');
  if (secaoOferta) {
    var promo = MB.promocao;
    if (!promo || !promo.ativa) {
      secaoOferta.hidden = true;
    } else {
      $('[data-oferta-selo]').textContent = promo.selo;
      $('[data-oferta-titulo]').textContent = promo.titulo;
      $('[data-oferta-descricao]').textContent = promo.descricao;

      var ul = $('[data-oferta-itens]');
      (promo.itens || []).forEach(function (txt) {
        var li = document.createElement('li');
        li.textContent = txt;
        ul.appendChild(li);
      });

      var faltam = (promo.diaSemana - hoje + 7) % 7;
      var data = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + faltam);
      var quando = faltam === 0 ? 'É hoje.' : faltam === 1 ? 'É amanhã.' : 'Próxima: ' +
        data.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) + '.';
      $('[data-oferta-quando]').textContent = quando + ' Agende pelo WhatsApp para garantir a vaga.';
    }
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
    })
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
