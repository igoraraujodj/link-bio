'use strict';

const { esc, icons } = require('../layout');
const C = require('../components');

module.exports = function aboutPage(prefix, T, ctx) {
  const site = ctx.site;
  const profile = ctx.profile;
  const manifesto = profile.manifesto
    .map(function (line, i) {
      return `<p class="manifesto__line" style="--i:${i}">${esc(line)}</p>`;
    })
    .join('\n');

  const caps = profile.capabilities
    .map(function (cap) {
      return `<article class="skillgroup">
  <h3 class="skillgroup__label">${esc(cap.label)}</h3>
  <p class="skillgroup__line">${esc(cap.line)}</p>
  <ul class="skillgroup__items">${cap.items.map(function (i) { return `<li>${esc(i)}</li>`; }).join('')}</ul>
</article>`;
    })
    .join('\n');

  const process = profile.process
    .map(function (s) {
      return `<li class="proc__step">
  <span class="proc__n">${esc(s.n)}</span>
  <h3 class="proc__label">${esc(s.label)}</h3>
  <p class="proc__text">${esc(s.text)}</p>
</li>`;
    })
    .join('\n');

  const values = profile.values
    .map(function (v) {
      return `<li class="value"><h3 class="value__title">${esc(v.title)}</h3><p class="value__text">${esc(v.text)}</p></li>`;
    })
    .join('\n');

  const stack = profile.stack
    .map(function (t) {
      return `<li class="stack__row"><span class="stack__name">${esc(t.name)}</span><span class="stack__kind">${esc(t.kind)}</span><span class="stack__text">${esc(t.text)}</span></li>`;
    })
    .join('\n');

  return `<section class="page-hero" aria-labelledby="ph-title">
  <div class="grid">
    <span class="kicker">${T('About')}</span>
    <h1 class="page-hero__title" id="ph-title">${T('Manifesto')}</h1>
  </div>
</section>

<section class="section manifesto-sec" aria-label="${T('Manifesto')}">
  <div class="grid manifesto-grid">
    <div class="manifesto">${manifesto}</div>
    <figure class="portrait">
      <img src="${ctx.raiz}assets/images/profile.jpg" alt="Retrato de ${esc(site.name)}" width="640" height="800" loading="lazy" decoding="async">
      <figcaption>
        <span>${esc(site.name)}</span>
        <span>${esc(site.location)}</span>
      </figcaption>
    </figure>
  </div>
</section>

<section class="section section--rule" aria-labelledby="bio-title">
  <div class="grid bio-grid">
    ${C.sectionHead({ kicker: T('Perfil'), title: '<span id="bio-title">' + T('O <em>profissional</em>') + '</span>' })}
    <div class="bio">
      <p>${esc(profile.bio)}</p>
      <ul class="bio__facts">
        <li><span>${T('Atuação')}</span><strong>${esc(site.roleLong)}</strong></li>
        <li><span>${T('Experiência')}</span><strong>${T('{0} anos', esc(site.experienceYears))}</strong></li>
        <li><span>${T('Base')}</span><strong>${esc(site.location)}</strong></li>
        <li><span>${T('Modelo')}</span><strong>${T('Remoto · Híbrido')}</strong></li>
      </ul>
      <div class="bio__actions">
        ${C.btn({ href: prefix + 'experience.html', label: T('Ver experiência') })}
        ${C.btn({ href: prefix + site.cv.webFallback, label: T('Download CV'), variant: 'ghost', icon: 'download', attrs: `data-cv="${ctx.raiz}${site.cv.file}"` })}
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="sk-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: T('Especialidades'),
      title: '<span id="sk-title">' + T('O que eu <em>faço</em>') + '</span>',
      lead: T('Sem barra de progresso, sem porcentagem. Categorias e o que sai de cada uma.'),
    })}
    <div class="skillgroups">${caps}</div>
  </div>
</section>

<section class="section section--rule" aria-labelledby="pr-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: T('Processo criativo'),
      title: '<span id="pr-title">' + T('Sete etapas,<br>do briefing à <em>otimização</em>') + '</span>',
    })}
    <ol class="proc">${process}</ol>
  </div>
</section>

<section class="section" aria-labelledby="tools-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: T('Ferramentas'),
      title: '<span id="tools-title">' + T('Com o que eu <em>construo</em>') + '</span>',
    })}
    <ul class="stack">${stack}</ul>
  </div>
</section>

<section class="section section--rule" aria-labelledby="val-title">
  <div class="grid">
    ${C.sectionHead({ kicker: T('Valores'), title: '<span id="val-title">' + T('Como eu <em>trabalho</em>') + '</span>' })}
    <ul class="values">${values}</ul>
  </div>
</section>

${C.ctaDoors(prefix, profile.audiences)}`;
};
