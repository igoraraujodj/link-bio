'use strict';

const site = require('../../data/site');
const { projects } = require('../../data/projects');
const profile = require('../../data/profile');
const ailab = require('../../data/ailab');
const { esc, icons } = require('../layout');
const C = require('../components');

/* Nome em display, letra a letra, para o reveal escalonado do hero. */
function splitChars(word) {
  return word
    .split('')
    .map(function (ch, i) {
      return `<span class="ch" style="--i:${i}">${esc(ch)}</span>`;
    })
    .join('');
}

module.exports = function home(prefix) {
  const featured = projects.filter(function (p) { return p.featured; });
  const spotlight = projects.find(function (p) { return p.spotlight; }) || projects[0];

  /* ---------------- HERO ---------------- */
  const hero = `<section class="hero" aria-labelledby="hero-title">
  <div class="grid hero__grid">
    <p class="hero__meta">
      <span>${esc(site.role)}</span>
      <span id="heroClock" data-clock>${esc(site.locationShort)}</span>
      <span class="status${site.availability.open ? ' is-open' : ''}">
        <span class="status__dot" aria-hidden="true"></span>
        <span class="status__text">${esc(site.availability.open ? site.availability.labelOpen : site.availability.labelClosed)}</span>
      </span>
    </p>

    <h1 class="hero__title" id="hero-title">
      <span class="hero__word" aria-hidden="true">${splitChars('IGOR')}</span>
      <span class="hero__word hero__word--2" aria-hidden="true">${splitChars('ARAUJO')}</span>
      <span class="sr-only">Igor Araujo, designer multidisciplinar</span>
    </h1>

    <p class="hero__disciplines">${site.disciplines.map(function (d) { return `<span>${esc(d)}</span>`; }).join('<i aria-hidden="true">·</i>')}</p>

    <p class="hero__statement">${esc(site.statement)}</p>

    <div class="hero__brief">
      ${C.briefForm({ id: 'heroBrief', placeholder: 'O que você quer construir?', label: 'Conte em uma linha o que você quer construir' })}
    </div>

    <div class="hero__actions">
      ${C.btn({ href: prefix + 'projects.html', label: 'Ver projetos' })}
      ${C.btn({ href: prefix + 'about.html', label: 'Sobre mim', variant: 'ghost' })}
      ${C.btn({ href: prefix + site.cv.webFallback, label: 'Download CV', variant: 'quiet', icon: 'download', attrs: `data-cv="${prefix}${site.cv.file}"` })}
    </div>

    <span class="hero__cue" aria-hidden="true">Role para explorar ${icons.arrowDown}</span>
  </div>
  <span class="hero__ghost" aria-hidden="true" data-text="${esc(site.experienceYears)} anos"></span>
</section>

${C.ticker(['Branding', 'Identidade visual', 'Direção de arte', 'Campanhas', 'Marketing', 'UI/UX', 'E-commerce', 'IA generativa', 'Creative technology'], { label: 'Áreas de atuação' })}`;

  /* ---------------- SELECTED WORK ---------------- */
  const work = `<section class="section" id="work" aria-labelledby="work-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: 'Selected work',
      title: '<span id="work-title">Projetos <em>selecionados</em></span>',
      lead: 'Cada projeto representa uma competência diferente: marca, campanha, sistema visual, digital e IA. Todos abrem um case com contexto, decisão e resultado.',
    })}
  </div>
  <div class="grid">
    ${C.projectIndex(featured, prefix)}
    <p class="section__foot">
      <a class="link-arrow" href="${prefix}projects.html">Ver todos os projetos ${icons.arrowUpRight}</a>
    </p>
  </div>
</section>`;

  /* ---------------- ESPECIALIDADES ---------------- */
  const caps = profile.capabilities
    .map(function (cap) {
      /* A badge no topo do card vem da referência de card com selo. O que
         ela mostra é contagem real da lista, não rótulo de marketing. */
      return `<article class="cap">
  <span class="cap__badge">${cap.items.length} entregas</span>
  <h3 class="cap__label">${esc(cap.label)}</h3>
  <p class="cap__line">${esc(cap.line)}</p>
  <ul class="cap__items">${cap.items.map(function (i) { return `<li>${esc(i)}</li>`; }).join('')}</ul>
</article>`;
    })
    .join('\n');

  const capabilities = `<section class="section section--rule" id="capabilities" aria-labelledby="cap-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: 'Especialidades',
      title: '<span id="cap-title">Cinco frentes,<br>um <em>jeito</em> de trabalhar</span>',
      lead: 'Design, estratégia, marketing, tecnologia e IA não são serviços separados aqui. São etapas da mesma decisão.',
    })}
    <div class="caps">${caps}</div>
  </div>
</section>`;

  /* ---------------- CASE DESTAQUE ---------------- */
  const featuredCase = `<section class="spotlight" aria-labelledby="spot-title">
  <a class="spotlight__link" href="${prefix}work/${spotlight.slug}.html" data-cursor="Ver case">
    <div class="spotlight__media">
      <img src="${prefix}${esc(spotlight.cover)}" alt="Capa do case ${esc(spotlight.title)}, para ${esc(spotlight.client)}" width="1600" height="900" loading="lazy" decoding="async">
    </div>
    <div class="grid spotlight__body">
      <span class="kicker">Case destaque</span>
      <h2 class="spotlight__title" id="spot-title">${esc(spotlight.client)}<br>${esc(spotlight.title)}</h2>
      <p class="spotlight__summary">${esc(spotlight.summary)}</p>
      <p class="spotlight__meta">${esc(spotlight.categories.join(' · '))}</p>
      <span class="spotlight__cta">Ver case completo ${icons.arrow}</span>
    </div>
  </a>
</section>`;

  /* ---------------- DESIGN × TECHNOLOGY ---------------- */
  const stackRows = profile.stack
    .map(function (tool) {
      return `<li class="stack__row">
  <span class="stack__name">${esc(tool.name)}</span>
  <span class="stack__kind">${esc(tool.kind)}</span>
  <span class="stack__text">${esc(tool.text)}</span>
</li>`;
    })
    .join('\n');

  const tech = `<section class="section section--rule" id="tech" aria-labelledby="tech-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: 'Design × Technology',
      title: '<span id="tech-title">Ferramenta é meio.<br>O que importa é o que <em>sai</em> dela.</span>',
      lead: 'Trabalho na interseção entre criatividade, design e tecnologia. Abaixo, o que consigo construir com cada uma. Não é uma parede de logos.',
    })}
    <ul class="stack">${stackRows}</ul>
  </div>
</section>`;

  /* ---------------- AI LAB ---------------- */
  const steps = ailab.pipeline
    .map(function (s) {
      return `<li class="pipe__step"><span class="pipe__n">${esc(s.n)}</span><span class="pipe__label">${esc(s.label)}</span></li>`;
    })
    .join('\n');

  const lab = `<section class="section lab-teaser" id="ai" aria-labelledby="ai-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: 'AI Lab',
      title: '<span id="ai-title">A IA gera.<br>A direção <em>decide</em>.</span>',
      lead: esc(ailab.intro),
    })}
    <ol class="pipe">${steps}</ol>
    <p class="section__foot">
      <a class="link-arrow" href="${prefix}ai-lab.html">Entrar no AI Lab ${icons.arrowUpRight}</a>
    </p>
  </div>
</section>`;

  /* ---------------- NÚMEROS ---------------- */
  const numbers = `<section class="numbers" aria-label="O perfil em números">
  <div class="grid numbers__grid">
    ${profile.numbers
      .map(function (n) {
        return `<div class="num"><span class="num__v">${esc(n.value)}</span><span class="num__l">${esc(n.label)}</span></div>`;
      })
      .join('\n    ')}
  </div>
</section>`;

  /* ---------------- SOBRE ---------------- */
  const about = `<section class="section section--rule about-strip" id="about" aria-labelledby="about-title">
  <div class="grid about-strip__grid">
    <figure class="about-strip__portrait">
      <!-- A moldura existe para ancorar os widgets à imagem, e não à
           figura inteira: assim eles não flutuam sobre a legenda. -->
      <span class="about-strip__frame">
        <img src="${prefix}assets/images/profile.jpg" alt="Retrato de ${esc(site.name)}" width="640" height="800" loading="lazy" decoding="async">
        <!-- Widgets sobre a foto, como nas referências. Só entram dados
             verificáveis e que não se repetem em outro ponto da página:
             hora local e estado da agenda. -->
        <span class="widget widget--now">
          <span class="widget__label">Agora</span>
          <span class="widget__value" data-clock="time">Hora local</span>
        </span>
        <span class="widget widget--status">
          <span class="status${site.availability.open ? ' is-open' : ''}">
            <span class="status__dot" aria-hidden="true"></span>
            <span class="status__text">${esc(site.availability.open ? 'Aceitando projetos' : 'Agenda fechada')}</span>
          </span>
        </span>
      </span>
      <figcaption>${esc(site.location)}</figcaption>
    </figure>
    <div class="about-strip__text">
      <span class="kicker">About</span>
      <h2 class="about-strip__title" id="about-title">${esc(profile.manifesto[0])}</h2>
      <p>${esc(profile.manifesto[1])}</p>
      <p>${esc(profile.manifesto[2])}</p>
      <p class="section__foot"><a class="link-arrow" href="${prefix}about.html">Ler o manifesto completo ${icons.arrowUpRight}</a></p>
    </div>
  </div>
</section>`;

  /* ---------------- EXPERIÊNCIA (resumo) ---------------- */
  const expRows = profile.experience
    .map(function (job) {
      return `<li class="xp__row">
  <span class="xp__period">${job.period ? esc(job.period) : '<em class="pending-inline">período a preencher</em>'}</span>
  <span class="xp__company">${esc(job.company)}${job.current ? '<span class="xp__now">Atual</span>' : ''}</span>
  <span class="xp__role">${esc(job.role)}</span>
  <span class="xp__summary">${esc(job.summary)}</span>
</li>`;
    })
    .join('\n');

  const experience = `<section class="section" id="experience" aria-labelledby="xp-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: 'Experience',
      title: '<span id="xp-title">Onde isso foi <em>aplicado</em></span>',
      lead: 'Mais de ' + esc(site.experienceYears) + ' anos entre marca, comunicação e produto digital.',
    })}
    <ul class="xp">${expRows}</ul>
    <p class="section__foot">
      <a class="link-arrow" href="${prefix}experience.html">Ver experiência completa e CV ${icons.arrowUpRight}</a>
    </p>
  </div>
</section>`;

  /* ---------------- CLIENTES ---------------- */
  const testimonials = C.carousel({
    label: 'Depoimentos de clientes',
    items: profile.testimonials.map(function (t, i) {
      return C.quoteCard(t, { feature: i === 0 });
    }),
  });

  const clients = `<section class="section section--rule" id="clients" aria-labelledby="clients-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: 'Clients',
      title: '<span id="clients-title">Marcas que <em>passaram</em> por aqui</span>',
    })}
    <ul class="clients">${profile.clients.map(function (c) { return `<li>${esc(c)}</li>`; }).join('')}</ul>
  </div>
  <div class="grid quotes-row">
    ${testimonials}
  </div>
</section>`;

  /* ---------------- PARA CLIENTES ---------------- */
  const problems = profile.audiences.client.problems
    .map(function (p) {
      return `<li class="prob"><h3 class="prob__q">${esc(p.q)}</h3><p class="prob__a">${esc(p.a)}</p></li>`;
    })
    .join('\n');

  const forClients = `<section class="section" id="for-clients" aria-labelledby="fc-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: 'For clients',
      title: '<span id="fc-title">Problemas que eu <em>resolvo</em></span>',
    })}
    <ul class="probs">${problems}</ul>
  </div>
</section>`;

  return hero + work + capabilities + featuredCase + numbers + tech + lab + about + experience + clients + forClients + C.ctaDoors(prefix, profile.audiences);
};
