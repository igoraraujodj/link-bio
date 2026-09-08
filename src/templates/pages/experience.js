'use strict';

const { esc, icons } = require('../layout');
const C = require('../components');

module.exports = function experiencePage(prefix, T, ctx) {
  const site = ctx.site;
  const projects = ctx.projects;
  const profile = ctx.profile;
  const r = profile.audiences.recruiter;

  const timeline = profile.experience
    .map(function (job) {
      const linked = (job.projects || [])
        .map(function (slug) {
          const p = projects.find(function (x) { return x.slug === slug; });
          return p ? `<a href="${prefix}work/${p.slug}.html">${esc(p.client)}: ${esc(p.title)} ${icons.arrowUpRight}</a>` : '';
        })
        .filter(Boolean)
        .join('');

      return `<li class="tl__item">
  <div class="tl__head">
    <span class="tl__period">${job.period ? esc(job.period) : '<em class="pending-inline">' + T('período a preencher') + '</em>'}</span>
    <h3 class="tl__company">${esc(job.company)}${job.current ? '<span class="tl__now">' + T('Atual') + '</span>' : ''}</h3>
    <p class="tl__role">${esc(job.role)}</p>
  </div>
  <div class="tl__body">
    <p class="tl__summary">${esc(job.summary)}</p>
    <h4 class="tl__sub">${T('Responsabilidades')}</h4>
    <ul class="tl__resp">${job.responsibilities.map(function (x) { return `<li>${esc(x)}</li>`; }).join('')}</ul>
    ${linked ? `<h4 class="tl__sub">${T('Projetos')}</h4><div class="tl__projects">${linked}</div>` : ''}
    <h4 class="tl__sub">${T('Resultados')}</h4>
    ${job.results ? `<p>${esc(job.results)}</p>` : C.pending(T('Resultados dessa passagem: entregas relevantes, ganhos de processo, números quando houver.'))}
  </div>
</li>`;
    })
    .join('\n');

  const facts = r.facts
    .map(function (f) { return `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`; })
    .join('');

  const brings = r.brings
    .map(function (b) { return `<li class="bring"><h3 class="bring__title">${esc(b.title)}</h3><p class="bring__text">${esc(b.text)}</p></li>`; })
    .join('\n');

  const caps = profile.capabilities
    .map(function (cap) {
      return `<article class="skillgroup">
  <h3 class="skillgroup__label">${esc(cap.label)}</h3>
  <ul class="skillgroup__items">${cap.items.map(function (i) { return `<li>${esc(i)}</li>`; }).join('')}</ul>
</article>`;
    })
    .join('\n');

  return `<section class="page-hero" aria-labelledby="ph-title">
  <div class="grid">
    <span class="kicker">${T('Experience')}</span>
    <h1 class="page-hero__title" id="ph-title">${T('Trajetória')}</h1>
    <p class="page-hero__lead">${T('{0} anos entre marca, comunicação e produto digital. Abaixo: onde atuei, o que fiz e o que dá para esperar de mim dentro de um time.', esc(site.experienceYears))}</p>
    <div class="page-hero__actions">
      ${C.btn({ href: prefix + site.cv.webFallback, label: T('Download CV'), icon: 'download', attrs: `data-cv="${ctx.raiz}${site.cv.file}"` })}
      ${C.btn({ href: site.contacts.linkedin, label: 'LinkedIn', variant: 'ghost', external: true, icon: 'arrowUpRight' })}
      ${C.btn({ href: site.whatsapp(r.message), label: r.cta, variant: 'quiet', external: true })}
    </div>
  </div>
</section>

<section class="section recruit" aria-labelledby="rec-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: T('For recruiters'),
      title: '<span id="rec-title">' + T('O perfil em 60 segundos') + '</span>',
    })}
    <dl class="recruit__facts">${facts}</dl>
  </div>
</section>

<section class="section section--rule" aria-labelledby="tl-title">
  <div class="grid">
    ${C.sectionHead({ kicker: T('Timeline'), title: '<span id="tl-title">' + T('Onde eu <em>estive</em>') + '</span>' })}
    <ol class="tl">${timeline}</ol>
    <p class="tl__note" role="note">${esc(profile.experienceNote)}</p>
  </div>
</section>

<section class="section" aria-labelledby="br-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: T('What I bring to a team'),
      title: '<span id="br-title">' + T('O que eu trago<br>para um time') + '</span>',
    })}
    <ul class="brings">${brings}</ul>
  </div>
</section>

<section class="section section--rule" aria-labelledby="sk-title">
  <div class="grid">
    ${C.sectionHead({
      kicker: T('Skills'),
      title: '<span id="sk-title">' + T('Competências') + '</span>',
      lead: T('Organizadas por categoria. Sem porcentagem, porque nível se demonstra em case, não em barra.'),
    })}
    <div class="skillgroups skillgroups--compact">${caps}</div>
  </div>
</section>

${C.ctaDoors(prefix, profile.audiences)}`;
};
