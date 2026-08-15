'use strict';

const ailab = require('../../data/ailab');
const profile = require('../../data/profile');
const { projects } = require('../../data/projects');
const { esc, icons } = require('../layout');
const C = require('../components');

module.exports = function aiLabPage(prefix) {
  /* Stepper: botões controlam painéis. Sem JS, todos os painéis ficam visíveis. */
  const steps = ailab.pipeline
    .map(function (s, i) {
      return `<button class="stepper__btn${i === 0 ? ' is-active' : ''}" type="button" role="tab" id="tab-${s.n}" aria-controls="panel-${s.n}" aria-selected="${i === 0}" tabindex="${i === 0 ? '0' : '-1'}">
  <span class="stepper__n">${esc(s.n)}</span>
  <span class="stepper__label">${esc(s.label)}</span>
</button>`;
    })
    .join('\n');

  const panels = ailab.pipeline
    .map(function (s, i) {
      return `<div class="panel${i === 0 ? ' is-active' : ''}" id="panel-${s.n}" role="tabpanel" aria-labelledby="tab-${s.n}">
  <span class="panel__n">${esc(s.n)} / ${String(ailab.pipeline.length).padStart(2, '0')}</span>
  <h3 class="panel__title">${esc(s.title)}</h3>
  <p class="panel__text">${esc(s.text)}</p>
  <div class="sample sample--${esc(s.sample.kind)}">
    <span class="sample__label">${esc(s.sample.label)}</span>
    <code class="sample__value">${esc(s.sample.value)}</code>
  </div>
</div>`;
    })
    .join('\n');

  const experiments = ailab.experiments
    .map(function (x) {
      const media = x.cover
        ? `<img src="${prefix}${esc(x.cover)}" alt="${esc(x.title)}, experimento de ${esc(x.kind)}" width="800" height="1000" loading="lazy" decoding="async">`
        : `<span class="xcard__slot"><span class="xcard__slot-label">Imagem a subir</span><span class="xcard__slot-path">assets/images/ai-lab/${esc(x.slug)}.jpg</span></span>`;
      return `<article class="xcard">
  <span class="xcard__media">${media}</span>
  <span class="xcard__kind">${esc(x.kind)}</span>
  <h3 class="xcard__title">${esc(x.title)}</h3>
  <p class="xcard__text">${esc(x.text)}</p>
</article>`;
    })
    .join('\n');

  const aiProject = projects.find(function (p) { return p.category === 'IA'; });

  return `<section class="page-hero page-hero--lab" aria-labelledby="ph-title">
  <div class="grid">
    <span class="kicker">AI Lab</span>
    <h1 class="page-hero__title" id="ph-title">A IA gera.<br>A direção decide.</h1>
    <p class="page-hero__lead">${esc(ailab.intro)}</p>
  </div>
</section>

<section class="section" aria-labelledby="pipe-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: 'Pipeline',
      title: '<span id="pipe-title">Do conceito ao resultado</span>',
      lead: 'Seis etapas entre uma ideia e uma imagem que pode ir para o ar. A ferramenta cobre uma delas.',
    })}
    <div class="stepper" data-stepper>
      <div class="stepper__rail" role="tablist" aria-label="Etapas do processo com IA">${steps}</div>
      <div class="stepper__panels">${panels}</div>
    </div>
  </div>
</section>

<section class="section section--rule" aria-labelledby="ex-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: 'Experimentos',
      title: '<span id="ex-title">Explorações</span>',
      lead: 'Estrutura pronta para receber as imagens de cada frente de experimentação.',
    })}
    <div class="xgrid">${experiments}</div>
  </div>
</section>

${aiProject ? `<section class="section" aria-labelledby="aic-title">
  <div class="grid">
    ${C.sectionHead({ kicker: 'Case', title: '<span id="aic-title">IA aplicada a projeto real</span>' })}
    <div class="pgrid pgrid--1">${C.projectCard(aiProject, prefix, { large: true })}</div>
  </div>
</section>` : ''}

${C.ctaDoors(prefix, profile.audiences)}`;
};
