/* MB Motos — comportamento da página.
   Lê window.MB (assets/js/config.js) e preenche links, horários, ofertas,
   formulário e dados estruturados. Sem dependência externa. */

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

  /* Ícone do sprite, para os blocos montados por JS. */
  function icone(id, classe) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', classe || 'ic');
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#' + id);
    svg.appendChild(use);
    return svg;
  }

  /* ---------- WhatsApp ----------
     Cada CTA manda o serviço no texto da mensagem, para saber depois qual
     bloco da página gerou a conversa. */
  function linkZap(texto) {
    return 'https://wa.me/' + MB.whatsapp + '?text=' + encodeURIComponent(texto || MB.mensagemPadrao);
  }

  function mensagemServico(servico) {
    return servico && servico !== 'atendimento geral'
      ? 'Olá! Vim pelo site e quero saber sobre ' + servico + '.'
      : MB.mensagemPadrao;
  }

  $$('[data-zap]').forEach(function (el) {
    var servico = el.getAttribute('data-servico') || 'atendimento geral';
    el.setAttribute('href', linkZap(mensagemServico(servico)));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
    el.addEventListener('click', function () { medir('contato_whatsapp', servico, 'Contact'); });
  });

  /* ---------- Telefone ---------- */
  function formatarTelefone(t) {
    var d = String(t).replace(/\D/g, '').replace(/^55/, '');
    if (d.length === 11) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
    if (d.length === 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return t;
  }

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

  /* ---------- Rota e mapa ---------- */
  var destino = MB.nome + ', ' + enderecoCompleto;

  $$('[data-rota]').forEach(function (el) {
    el.setAttribute('href', MB.googleMaps ||
      'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(destino));
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

  /* ---------- Endereço e redes ---------- */
  $$('[data-endereco]').forEach(function (el) { el.textContent = enderecoCompleto; });
  $$('[data-endereco-curto]').forEach(function (el) {
    el.textContent = MB.endereco.bairro + ', ' + MB.endereco.cidade + '/' + MB.endereco.estado;
  });
  if (MB.endereco.referencia) {
    $$('[data-referencia]').forEach(function (el) { el.textContent = MB.endereco.referencia; });
  }
  if (MB.instagram) {
    $$('[data-insta]').forEach(function (el) {
      el.setAttribute('href', 'https://instagram.com/' + MB.instagram.replace('@', ''));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
      el.hidden = false;
    });
  }

  /* ---------- Horários e status ---------- */
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

  var statusEl = $('[data-status]');
  if (statusEl) {
    var h = MB.horarios[hoje];
    var aberto = !!(h && h.abre) && minutosAgora >= paraMinutos(h.abre) && minutosAgora < paraMinutos(h.fecha);
    statusEl.setAttribute('data-aberto', aberto ? 'sim' : 'nao');
    $('[data-status-texto]', statusEl).textContent = aberto
      ? 'Loja aberta agora, até às ' + h.fecha + '. Fale com o time'
      : 'Loja fechada, ' + proximaAbertura() + '. Deixe sua mensagem';
    statusEl.setAttribute('href', linkZap(aberto
      ? 'Olá! Vim pelo site e quero falar com o time.'
      : 'Olá! Vim pelo site fora do horário e gostaria de um orçamento.'));
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

  /* ---------- Formulário de orçamento ----------
     Não envia para servidor nenhum: monta a mensagem e abre o WhatsApp já
     preenchido, que é onde o atendimento da oficina realmente acontece. */
  var form = $('[data-form]');
  if (form) {
    var erroEl = $('[data-form-erro]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nome = form.nome.value.trim();
      var moto = form.moto.value.trim();
      var servico = form.servico.value;
      var obs = form.obs.value.trim();

      var faltando = [];
      marcar(form.nome, !nome); if (!nome) faltando.push('seu nome');
      marcar(form.moto, !moto); if (!moto) faltando.push('o modelo da moto');
      marcar(form.servico, !servico); if (!servico) faltando.push('o serviço');

      if (faltando.length) {
        erroEl.textContent = 'Falta preencher ' + listar(faltando) + '.';
        erroEl.hidden = false;
        var primeiro = form.querySelector('[data-invalido] input, [data-invalido] select');
        if (primeiro) primeiro.focus();
        return;
      }

      erroEl.hidden = true;

      var texto = 'Olá! Meu nome é ' + nome + '. Tenho uma ' + moto +
        ' e gostaria de: ' + servico + '.';
      if (obs) texto += '\n\nObservação: ' + obs;
      texto += '\n\n(enviado pelo site)';

      medir('contato_whatsapp', 'formulário: ' + servico, 'Lead');
      window.open(linkZap(texto), '_blank', 'noopener');
    });

    /* limpa o aviso de erro assim que a pessoa corrige o campo */
    $$('input, select, textarea', form).forEach(function (campo) {
      campo.addEventListener('input', function () { marcar(campo, false); });
      campo.addEventListener('change', function () { marcar(campo, false); });
    });
  }

  function marcar(campo, invalido) {
    var caixa = campo.closest('.campo');
    if (!caixa) return;
    if (invalido) caixa.setAttribute('data-invalido', '');
    else caixa.removeAttribute('data-invalido');
  }

  function listar(itens) {
    if (itens.length === 1) return itens[0];
    return itens.slice(0, -1).join(', ') + ' e ' + itens[itens.length - 1];
  }

  /* ---------- Ofertas ---------- */
  var ofertas = (MB.ofertas || []).filter(function (o) { return o.ativa; });
  var caixaOfertas = $('[data-ofertas]');

  if (caixaOfertas) {
    if (!ofertas.length) $('#ofertas').hidden = true;
    else ofertas.forEach(function (o) { caixaOfertas.appendChild(montarOferta(o)); });
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
    if (o.precoPrefixo) {
      var prefixo = document.createElement('span');
      prefixo.className = 'oferta__prefixo';
      prefixo.textContent = o.precoPrefixo;
      preco.appendChild(prefixo);
    }
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
        li.appendChild(icone('ic-check'));
        var span = document.createElement('span');
        span.textContent = txt;
        li.appendChild(span);
        ul.appendChild(li);
      });
      art.appendChild(ul);
    }

    var cta = document.createElement('a');
    cta.className = 'btn ' + (o.destaque ? 'btn--zap btn--g' : 'btn--claro');
    cta.setAttribute('href', linkZap('Olá! Vim pelo site e quero a oferta: ' + o.titulo + '.'));
    cta.setAttribute('target', '_blank');
    cta.setAttribute('rel', 'noopener');
    cta.appendChild(icone('ic-whats'));
    cta.appendChild(document.createTextNode(o.cta || 'Quero essa oferta'));
    cta.addEventListener('click', function () { medir('contato_whatsapp', 'oferta ' + o.id, 'Contact'); });
    art.appendChild(cta);

    if (o.contador) art.appendChild(montarContador());

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

  /* Contador regressivo até o fim do dia de hoje. A condição é diária de
     verdade, então o relógio zera e recomeça sem enganar quem chega. */
  function montarContador() {
    var caixa = document.createElement('p');
    caixa.className = 'contador';

    var rotulo = document.createElement('span');
    rotulo.className = 'contador__rotulo';
    rotulo.textContent = 'A condição de hoje termina em';
    caixa.appendChild(rotulo);

    var relogio = document.createElement('strong');
    relogio.className = 'contador__relogio';
    caixa.appendChild(relogio);

    function tique() {
      var agora = new Date();
      var fim = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1);
      var resta = Math.max(0, Math.floor((fim - agora) / 1000));
      var hh = String(Math.floor(resta / 3600)).padStart(2, '0');
      var mm = String(Math.floor((resta % 3600) / 60)).padStart(2, '0');
      var ss = String(resta % 60).padStart(2, '0');
      relogio.textContent = hh + ':' + mm + ':' + ss;
    }

    tique();
    setInterval(tique, 1000);
    return caixa;
  }

  /* Texto da próxima data de uma oferta que acontece num dia fixo. */
  function proximaData(diaSemana) {
    if (diaSemana === null || diaSemana === undefined) return '';
    var faltam = (diaSemana - hoje + 7) % 7;
    if (faltam === 0) return 'É hoje';
    if (faltam === 1) return 'É amanhã';
    var data = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + faltam);
    return 'Próxima: ' + data.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
  }

  /* ---------- Marcas ---------- */
  var caixaMarcas = $('[data-marcas]');
  if (caixaMarcas && MB.marcas) {
    /* A lista entra duas vezes: quando a primeira cópia termina de passar,
       a segunda já está no lugar dela e o loop não tem emenda. */
    [0, 1].forEach(function (copia) {
      MB.marcas.forEach(function (m) {
        var li = document.createElement('li');
        if (copia === 1) li.setAttribute('aria-hidden', 'true');
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
    });
  }

  /* ---------- Vitrine do estoque ----------
     Cada categoria abre o WhatsApp com a pergunta daquela categoria. */
  var caixaEstoque = $('[data-estoque]');
  if (caixaEstoque && MB.estoque) {
    MB.estoque.forEach(function (cat) {
      var art = document.createElement('article');
      art.className = 'item';

      var h3 = document.createElement('h3');
      h3.textContent = cat.nome;
      art.appendChild(h3);

      var p = document.createElement('p');
      p.textContent = cat.texto;
      art.appendChild(p);

      var a = document.createElement('a');
      a.className = 'link-seta';
      a.setAttribute('href', linkZap(cat.mensagem));
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
      a.appendChild(document.createTextNode(cat.cta));
      a.appendChild(icone('ic-seta'));
      a.addEventListener('click', function () { medir('contato_whatsapp', 'estoque: ' + cat.nome, 'Contact'); });
      art.appendChild(a);

      caixaEstoque.appendChild(art);
    });
  }

  /* ---------- Feedback dos clientes ---------- */
  var caixaDepos = $('[data-depoimentos]');
  if (caixaDepos && MB.depoimentos) {
    MB.depoimentos.forEach(function (d) {
      var item = document.createElement('li');
      var art = document.createElement('article');
      art.className = 'depo';

      var estrelas = document.createElement('p');
      estrelas.className = 'depo__estrelas';
      estrelas.setAttribute('aria-label', d.nota + ' de 5 estrelas');
      estrelas.textContent = '★★★★★'.slice(0, d.nota);
      art.appendChild(estrelas);

      var tag = document.createElement('p');
      tag.className = 'depo__tag';
      tag.textContent = d.tag;
      art.appendChild(tag);

      var texto = document.createElement('p');
      texto.className = 'depo__texto';
      texto.textContent = d.texto;
      art.appendChild(texto);

      var rodape = document.createElement('footer');
      var inicial = document.createElement('span');
      inicial.className = 'depo__inicial';
      inicial.setAttribute('aria-hidden', 'true');
      inicial.textContent = iniciais(d.nome);
      rodape.appendChild(inicial);

      var cite = document.createElement('cite');
      cite.appendChild(document.createTextNode(d.nome));
      var small = document.createElement('small');
      small.textContent = d.moto;
      cite.appendChild(small);
      rodape.appendChild(cite);

      art.appendChild(rodape);
      item.appendChild(art);
      caixaDepos.appendChild(item);
    });
  }

  /* ---------- Carrossel de avaliações ----------
     O trilho é uma rolagem horizontal com encaixe: no celular a pessoa
     arrasta, no desktop as setas empurram um cartão por vez. */
  var carrossel = $('[data-carrossel]');
  if (carrossel) {
    var trilho = $('.carrossel__trilho', carrossel);
    var ant = $('[data-carrossel-ant]');
    var prox = $('[data-carrossel-prox]');

    var passo = function () {
      var primeiro = trilho.firstElementChild;
      if (!primeiro) return trilho.clientWidth;
      var gap = parseFloat(getComputedStyle(trilho).columnGap) || 0;
      return primeiro.getBoundingClientRect().width + gap;
    };

    var anda = function (direcao) {
      trilho.scrollBy({ left: passo() * direcao, behavior: 'smooth' });
    };

    if (ant)  ant.addEventListener('click', function () { anda(-1); });
    if (prox) prox.addEventListener('click', function () { anda(1); });

    /* desativa a seta quando não há mais para onde ir */
    var limites = function () {
      var fim = trilho.scrollWidth - trilho.clientWidth - 4;
      if (ant)  ant.disabled = trilho.scrollLeft <= 4;
      if (prox) prox.disabled = trilho.scrollLeft >= fim;
    };
    trilho.addEventListener('scroll', limites, { passive: true });
    window.addEventListener('resize', limites);
    limites();
  }

  /* "Lucas Barbosa" vira "LB" */
  function iniciais(nome) {
    return nome.split(/\s+/).slice(0, 2).map(function (p) { return p.charAt(0); }).join('').toUpperCase();
  }

  /* ---------- Balão flutuante ----------
     Só aparece depois que a pessoa rola para fora do topo: no celular ele
     cobriria justamente o formulário. Quem fecha não vê de novo na visita. */
  var mascote = $('[data-mascote]');
  if (mascote && MB.mascote && MB.mascote.ativo && !leu('mb_mascote_fechado')) {
    $('[data-mascote-nome]').textContent = MB.mascote.nome;
    $('[data-mascote-fala]').textContent = MB.mascote.fala;

    if (MB.mascote.foto) {
      $('[data-mascote-foto]').style.backgroundImage = 'url("' + MB.mascote.foto + '")';
    }

    var link = $('[data-mascote-link]');
    link.setAttribute('href', linkZap(MB.mascote.mensagem));
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
    link.addEventListener('click', function () { medir('contato_whatsapp', 'balão flutuante', 'Contact'); });

    $('[data-mascote-fechar]').addEventListener('click', function () {
      mascote.hidden = true;
      escreveu('mb_mascote_fechado', '1');
    });

    var mostrar = function () {
      if (window.scrollY < 600) return;
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

  /* ---------- Ano e CNPJ ---------- */
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

  /* ---------- Entrada por scroll ----------
     Os itens de uma mesma grade entram em cascata, com atraso proporcional
     à posição, o que dá o movimento sem travar a rolagem. */
  var alvos = $$('.secao__topo, .card, .item, .selo, .passos li, .carrossel, .oferta, .local__mapa, .cartao-form');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('visivel');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    alvos.forEach(function (el) {
      el.classList.add('revela');
      var irmaos = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty('--i', Math.min(irmaos, 6));
      obs.observe(el);
    });
  }

  /* ---------- Medição ----------
     As tags entram só quando há ID na config. Sem ID, a página não faz
     nenhuma requisição para Meta ou Google.

     Cada conversa gerada dispara dois eventos: o padrão da Meta, que é o
     que o algoritmo usa para otimizar a campanha, e um evento nosso com
     a origem do clique, que é o que mostra qual bloco da página trouxe o
     cliente. */
  function carregarTags() {
    var ids = MB.medicao || {};

    if (ids.metaPixel) {
      /* snippet oficial do Pixel, encurtado */
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = true; t.src = v;
        s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', ids.metaPixel);
      window.fbq('track', 'PageView');
    }

    if (ids.ga4) {
      var g = document.createElement('script');
      g.async = true;
      g.src = 'https://www.googletagmanager.com/gtag/js?id=' + ids.ga4;
      document.head.appendChild(g);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', ids.ga4);
    }
  }
  carregarTags();

  function medir(evento, rotulo, padraoMeta) {
    if (typeof window.gtag === 'function') window.gtag('event', evento, { origem: rotulo });
    if (typeof window.fbq === 'function') {
      if (padraoMeta) window.fbq('track', padraoMeta, { origem: rotulo });
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
    openingHoursSpecification: MB.horarios.map(function (h, i) {
      if (!h.abre) return null;
      return { '@type': 'OpeningHoursSpecification', dayOfWeek: diasSchema[i], opens: h.abre, closes: h.fecha };
    }).filter(Boolean),
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
