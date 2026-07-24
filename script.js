'use strict';

/* ===================================
   Theme Management
=================================== */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

themeToggle.addEventListener('click', toggleTheme);

// Sync with system preference changes (only when no saved preference)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
  if (!localStorage.getItem('theme')) {
    html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
});

/* ===================================
   Footer Year
=================================== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===================================
   Hero live clock (Vitória, ES)
=================================== */
const heroClock = document.getElementById('heroClock');
if (heroClock) {
  const clockFormatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
  });
  function updateHeroClock() {
    heroClock.textContent = 'Vitória, ES · ' + clockFormatter.format(new Date());
  }
  updateHeroClock();
  setInterval(updateHeroClock, 30000);
}

/* ===================================
   Ripple Effect on Link Cards
=================================== */
document.querySelectorAll('.link-card').forEach(function (card) {
  card.addEventListener('pointerdown', function (e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + x + 'px;top:' + y + 'px;';
    this.appendChild(ripple);

    ripple.addEventListener('animationend', function () { ripple.remove(); }, { once: true });
  });
});

/* ===================================
   Project Modal (case detail)
=================================== */
/* Placeholder data: troque título/categoria/ano/descrição/imagens pelos seus projetos reais.
   O índice de cada item bate com o atributo data-project do botão correspondente no HTML.
   "images" é a galeria do case: pode ter quantas fotos quiser, a primeira é a que abre selecionada. */
const PROJECTS = [
  {
    title: 'Identidade Visual 01',
    tag: 'Branding',
    year: '2025',
    images: ['assets/images/work-1.svg', 'assets/images/work-2.svg', 'assets/images/work-3.svg'],
    description: 'Este é um espaço reservado. Substitua por um resumo real do desafio, do processo criativo e do resultado que esse projeto entregou pro cliente.',
  },
  {
    title: 'Identidade Visual 02',
    tag: 'Naming & Logo',
    year: '2025',
    images: ['assets/images/work-2.svg', 'assets/images/work-3.svg', 'assets/images/work-1.svg'],
    description: 'Este é um espaço reservado. Substitua por um resumo real do desafio, do processo criativo e do resultado que esse projeto entregou pro cliente.',
  },
  {
    title: 'Identidade Visual 03',
    tag: 'UI/UX',
    year: '2025',
    images: ['assets/images/work-3.svg', 'assets/images/work-4.svg', 'assets/images/work-1.svg'],
    description: 'Este é um espaço reservado. Substitua por um resumo real do desafio, do processo criativo e do resultado que esse projeto entregou pro cliente.',
  },
  {
    title: 'Identidade Visual 04',
    tag: 'Social Media',
    year: '2025',
    images: ['assets/images/work-4.svg', 'assets/images/work-1.svg', 'assets/images/work-2.svg'],
    description: 'Este é um espaço reservado. Substitua por um resumo real do desafio, do processo criativo e do resultado que esse projeto entregou pro cliente.',
  },
];

const projectModal = document.getElementById('projectModal');
let lastFocusedTrigger = null;

function openProjectModal(index) {
  const project = PROJECTS[index];
  if (!project || !projectModal) return;

  document.getElementById('projectModalImg').src = project.images[0];
  document.getElementById('projectModalImg').alt = project.title;
  document.getElementById('projectModalTag').textContent = project.tag;
  document.getElementById('projectModalTitle').textContent = project.title;
  document.getElementById('projectModalMeta').textContent = project.tag + ' · ' + project.year;
  document.getElementById('projectModalDesc').textContent = project.description;

  // Resto da galeria, empilhada em largura total abaixo do texto (tipo scroll de case no Behance)
  const galleryEl = document.getElementById('projectModalGallery');
  galleryEl.innerHTML = '';
  project.images.slice(1).forEach(function (src) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = project.title;
    img.loading = 'lazy';
    galleryEl.appendChild(img);
  });

  projectModal.classList.add('is-open');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  projectModal.querySelector('.project-modal__panel').scrollTop = 0;
  projectModal.querySelector('.project-modal__close').focus();
}

function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.remove('is-open');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocusedTrigger) lastFocusedTrigger.focus();
}

document.querySelectorAll('.work-banner[data-project]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    lastFocusedTrigger = btn;
    openProjectModal(Number(btn.dataset.project));
  });
});

if (projectModal) {
  projectModal.querySelectorAll('[data-close-modal]').forEach(function (el) {
    el.addEventListener('click', closeProjectModal);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && projectModal.classList.contains('is-open')) {
      closeProjectModal();
    }
  });
}

/* ===================================
   Scroll Reveal (About / Work sections)
=================================== */
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });
} else {
  document.querySelectorAll('.reveal').forEach(function (el) {
    el.classList.add('is-visible');
  });
}

/* ===================================
   Hero ambient video (once a real source is added)
=================================== */
const heroVideo = document.querySelector('.hero__video');
if (heroVideo && heroVideo.querySelector('source')) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
  }
}

/* ===================================
   Trigger animations after fonts load
=================================== */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(function () {
    document.body.classList.add('fonts-loaded');
  });
}
