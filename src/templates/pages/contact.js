'use strict';

const site = require('../../data/site');
const profile = require('../../data/profile');
const { esc, icons } = require('../layout');
const C = require('../components');

module.exports = function contactPage(prefix) {
  const c = profile.audiences.client;
  const r = profile.audiences.recruiter;

  const problems = c.problems
    .map(function (p) { return `<li class="prob"><h3 class="prob__q">${esc(p.q)}</h3><p class="prob__a">${esc(p.a)}</p></li>`; })
    .join('\n');

  const brings = r.brings
    .map(function (b) { return `<li class="bring"><h3 class="bring__title">${esc(b.title)}</h3><p class="bring__text">${esc(b.text)}</p></li>`; })
    .join('\n');

  const faq = profile.faq
    .map(function (item) {
      return `<details class="faq-item">
  <summary class="faq-item__q">${esc(item.q)}<span class="faq-item__icon" aria-hidden="true">${icons.chevron}</span></summary>
  <div class="faq-item__a"><p>${esc(item.a)}</p></div>
</details>`;
    })
    .join('\n');

  const channels = [
    { key: 'whatsapp', title: 'WhatsApp', desc: 'Resposta mais rápida', href: site.whatsapp('Olá, Igor! Vim pelo seu portfólio.'), icon: icons.whatsapp, external: true },
    { key: 'email', title: 'E-mail', desc: esc(site.contacts.email), href: 'mailto:' + site.contacts.email, icon: icons.mail, external: false },
    { key: 'linkedin', title: 'LinkedIn', desc: 'Rede profissional', href: site.contacts.linkedin, icon: icons.linkedin, external: true },
    { key: 'behance', title: 'Behance', desc: 'Projetos e cases', href: site.contacts.behance, icon: icons.behance, external: true },
    { key: 'instagram', title: 'Instagram', desc: 'Processo e bastidor', href: site.contacts.instagram, icon: icons.instagram, external: true },
  ]
    .map(function (ch) {
      return `<a class="channel" href="${ch.href}"${ch.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>
  <span class="channel__icon" aria-hidden="true">${ch.icon}</span>
  <span class="channel__body"><span class="channel__title">${esc(ch.title)}</span><span class="channel__desc">${ch.desc}</span></span>
  <span class="channel__go" aria-hidden="true">${icons.arrowUpRight}</span>
</a>`;
    })
    .join('\n');

  /* Formulário sem backend: monta a mensagem e abre no WhatsApp ou no e-mail.
     Sem JS, os botões de contato direto acima continuam funcionando. */
  const form = `<form class="cform" id="contactForm" novalidate data-wa="${esc(site.contacts.whatsapp)}" data-email="${esc(site.contacts.email)}">
  <fieldset class="cform__modes">
    <legend class="sr-only">Você é cliente ou recrutador?</legend>
    <label class="cform__mode">
      <input type="radio" name="mode" value="client" checked>
      <span><strong>Tenho um projeto</strong><em>Sou cliente</em></span>
    </label>
    <label class="cform__mode">
      <input type="radio" name="mode" value="recruiter">
      <span><strong>Tenho uma oportunidade</strong><em>Sou recrutador</em></span>
    </label>
  </fieldset>

  <div class="cform__row">
    <label class="field">
      <span class="field__label">Nome <i aria-hidden="true">*</i></span>
      <input class="field__input" type="text" name="name" required autocomplete="name" placeholder="Como devo te chamar">
      <span class="field__error" data-error></span>
    </label>
    <label class="field">
      <span class="field__label">Empresa</span>
      <input class="field__input" type="text" name="company" autocomplete="organization" placeholder="Opcional">
    </label>
  </div>

  <div class="cform__row" data-when="client">
    <label class="field">
      <span class="field__label">Tipo de projeto</span>
      <select class="field__input" name="scope">
        <option>Branding / identidade visual</option>
        <option>Campanha</option>
        <option>Site / landing page</option>
        <option>E-commerce</option>
        <option>Social media / direção de arte</option>
        <option>IA aplicada ao processo criativo</option>
        <option>Ainda não sei, quero conversar</option>
      </select>
    </label>
    <label class="field">
      <span class="field__label">Prazo</span>
      <select class="field__input" name="deadline">
        <option>Sem pressa</option>
        <option>Nas próximas semanas</option>
        <option>Urgente</option>
      </select>
    </label>
  </div>

  <div class="cform__row" data-when="recruiter" hidden>
    <label class="field">
      <span class="field__label">Vaga / cargo</span>
      <input class="field__input" type="text" name="position" placeholder="Ex.: Designer Sênior">
    </label>
    <label class="field">
      <span class="field__label">Modelo</span>
      <select class="field__input" name="model">
        <option>Remoto</option>
        <option>Híbrido</option>
        <option>Presencial</option>
      </select>
    </label>
  </div>

  <label class="field">
    <span class="field__label">Mensagem <i aria-hidden="true">*</i></span>
    <textarea class="field__input field__input--area" name="message" rows="5" required placeholder="Conte o contexto em duas ou três linhas."></textarea>
    <span class="field__error" data-error></span>
  </label>

  <div class="cform__actions">
    <button class="btn btn--primary" type="submit" data-send="whatsapp">Enviar pelo WhatsApp ${icons.whatsapp}</button>
    <button class="btn btn--ghost" type="button" data-send="email">Enviar por e-mail ${icons.mail}</button>
  </div>
  <p class="cform__note">O formulário monta a mensagem e abre no seu WhatsApp ou cliente de e-mail. Nenhum dado é enviado ou armazenado por este site.</p>
  <p class="cform__status" role="status" aria-live="polite" data-form-status></p>
</form>`;

  return `<section class="page-hero" aria-labelledby="ph-title">
  <div class="grid">
    <span class="kicker">Contact</span>
    <h1 class="page-hero__title" id="ph-title">Duas portas.<br>Escolha a <em>sua</em>.</h1>
    <p class="page-hero__lead">Se você tem um projeto ou uma oportunidade, o caminho mais curto está aqui embaixo.</p>
  </div>
</section>

<section class="section" aria-label="Formulário de contato">
  <div class="grid contact-grid">
    <div class="contact-form">${form}</div>
    <aside class="contact-side" aria-label="Canais diretos">
      <h2 class="contact-side__title">Contato direto</h2>
      <div class="channels">${channels}</div>
      <p class="contact-side__meta">${esc(site.location)}<br><span data-clock="time">Hora local</span></p>
    </aside>
  </div>
</section>

<section class="section section--rule" id="for-clients" aria-labelledby="fc-title">
  <div class="grid">
    ${C.sectionHead({ kicker: 'For clients', title: '<span id="fc-title">Problemas que eu <em>resolvo</em></span>' })}
    <ul class="probs">${problems}</ul>
    <p class="section__foot">${C.btn({ href: site.whatsapp(c.message), label: c.cta, external: true })}</p>
  </div>
</section>

<section class="section" id="for-recruiters" aria-labelledby="fr-title">
  <div class="grid">
    ${C.sectionHead({ kicker: 'For recruiters', title: '<span id="fr-title">O que eu trago para um <em>time</em></span>' })}
    <ul class="brings">${brings}</ul>
    <p class="section__foot">
      ${C.btn({ href: prefix + 'experience.html', label: 'Ver experiência e CV' })}
      ${C.btn({ href: site.whatsapp(r.message), label: r.cta, variant: 'ghost', external: true })}
    </p>
  </div>
</section>

<section class="section section--rule" aria-labelledby="faq-title">
  <div class="grid">
    ${C.sectionHead({ kicker: 'FAQ', title: '<span id="faq-title">Perguntas <em>frequentes</em></span>' })}
    <div class="faq">${faq}</div>
  </div>
</section>`;
};
