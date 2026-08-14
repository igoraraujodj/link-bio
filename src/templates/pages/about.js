'use strict';

const site = require('../../data/site');
const profile = require('../../data/profile');
const { esc, icons } = require('../layout');
const C = require('../components');

module.exports = function aboutPage(prefix) {
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
    <span class="kicker">About</span>
    <h1 class="page-hero__title" id="ph-title">Manifesto</h1>
  </div>
</section>

<section class="section manifesto-sec" aria-label="Manifesto">
  <div class="grid manifesto-grid">
    <div class="manifesto">${manifesto}</div>
    <figure class="portrait">
      <img src="${prefix}assets/images/profile.jpg" alt="Retrato de ${esc(site.name)}" width="640" height="800" loading="lazy" decoding="async">
      <figcaption>
        <span>${esc(site.name)}</span>
        <span>${esc(site.location)}</span>
      </figcaption>
    </figure>
  </div>
</section>

<section class="section section--rule" aria-labelledby="bio-title">
  <div class="grid bio-grid">
    ${C.sectionHead({ kicker: 'Perfil', title: '<span id="bio-title">O profissional</span>' })}
    <div class="bio">
      <p>${esc(profile.bio)}</p>
      <ul class="bio__facts">
        <li><span>Atuação</span><strong>${esc(site.roleLong)}</strong></li>
        <li><span>Experiência</span><strong>${esc(site.experienceYears)} anos</strong></li>
        <li><span>Base</span><strong>${esc(site.location)}</strong></li>
        <li><span>Modelo</span><strong>Remoto · Híbrido</strong></li>
      </ul>
      <div class="bio__actions">
        ${C.btn({ href: prefix + 'experience.html', label: 'Ver experiência' })}
        ${C.btn({ href: prefix + site.cv.webFallback, label: 'Download CV', variant: 'ghost', icon: 'download', attrs: `data-cv="${prefix}${site.cv.file}"` })}
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="sk-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: 'Especialidades',
      title: '<span id="sk-title">O que eu faço</span>',
      lead: 'Sem barra de progresso, sem porcentagem. Categorias e o que sai de cada uma.',
    })}
    <div class="skillgroups">${caps}</div>
  </div>
</section>

<section class="section section--rule" aria-labelledby="pr-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: 'Processo criativo',
      title: '<span id="pr-title">Sete etapas,<br>do briefing à otimização</span>',
    })}
    <ol class="proc">${process}</ol>
  </div>
</section>

<section class="section" aria-labelledby="tools-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: 'Ferramentas',
      title: '<span id="tools-title">Com o que eu construo</span>',
    })}
    <ul class="stack">${stack}</ul>
  </div>
</section>

<section class="section section--rule" aria-labelledby="val-title">
  <div class="grid">
    ${C.sectionHead({ kicker: 'Valores', title: '<span id="val-title">Como eu trabalho</span>' })}
    <ul class="values">${values}</ul>
  </div>
</section>

${C.ctaDoors(prefix, profile.audiences)}`;
};
