// Arranque do sistema: monta a casca, liga o store e o roteador.

import { createStore } from './store/index.js';
import { createLocalAdapter } from './store/adapter-local.js';
import { createRouter } from './router.js';
import { el, clear, $, toast } from './ui/dom.js';
import { closeForm } from './ui/modal.js';
import { sampleState } from './seed.js';

import * as dashboard from './views/dashboard.js';
import * as agenda from './views/agenda.js';
import * as tarefas from './views/tarefas.js';
import * as financas from './views/financas.js';
import * as metas from './views/metas.js';
import * as compras from './views/compras.js';
import * as habitos from './views/habitos.js';
import * as memorias from './views/memorias.js';
import * as ajustes from './views/ajustes.js';

const ROUTES = {
  dashboard: { label: 'Início',   icon: '◆', view: dashboard, scoped: true  },
  agenda:    { label: 'Agenda',   icon: '▦', view: agenda,    scoped: true  },
  tarefas:   { label: 'Tarefas',  icon: '☰', view: tarefas,   scoped: true  },
  financas:  { label: 'Finanças', icon: '$', view: financas,  scoped: false },
  metas:     { label: 'Metas',    icon: '↑', view: metas,     scoped: false },
  compras:   { label: 'Compras',  icon: '✓', view: compras,   scoped: false },
  habitos:   { label: 'Hábitos',  icon: '⟳', view: habitos,   scoped: true  },
  memorias:  { label: 'Memórias', icon: '♥', view: memorias,  scoped: false },
  ajustes:   { label: 'Ajustes',  icon: '⚙', view: ajustes,   scoped: false },
};

// No mobile a barra de baixo só comporta cinco. O resto entra no "Mais".
const PRIMARY = ['dashboard', 'agenda', 'tarefas', 'financas'];

const store = createStore(createLocalAdapter());
let current = 'dashboard';
let scope = 'nos';

const outlet = $('#outlet');
const navHost = $('#nav');
const bottomHost = $('#bottom-nav');
const scopeHost = $('#scope');

const router = createRouter({
  routes: ROUTES,
  fallback: 'dashboard',
  onChange: ({ id }) => {
    current = id;
    closeForm();
    closeMenu();
    paint();
    window.scrollTo({ top: 0 });
  },
});

function toggleMenu(open) {
  const scrim = $('#scrim');
  document.body.classList.toggle('is-menu-open', open);
  if (open) {
    scrim.hidden = false;
  } else {
    // Espera a transição de opacidade antes de tirar do fluxo, senão o
    // fundo some de estalo.
    setTimeout(() => { if (!document.body.classList.contains('is-menu-open')) scrim.hidden = true; }, 200);
  }
}

const closeMenu = () => toggleMenu(false);

function ctx() {
  return {
    store,
    state: store.getState(),
    scope,
    go: (id) => router.go(id),
    refresh: paint,
    applyTheme,
    loadSample: async () => {
      await store.replace(sampleState());
      toast('Dados de exemplo carregados. Dá pra apagar em Ajustes.');
    },
  };
}

function paint() {
  if (!store.ready) return;
  const route = ROUTES[current];
  const context = ctx();

  document.title = `${route.label} · Casa de Dois`;

  clear(outlet).append(route.view.render(context));
  paintNav();
  paintScope(route.scoped);
  paintFab(route, context);
}

function paintNav() {
  clear(navHost).append(
    ...Object.entries(ROUTES).map(([id, route]) =>
      el('a', {
        class: `nav__item${id === current ? ' is-active' : ''}`,
        href: `#/${id}`,
        'aria-current': id === current ? 'page' : null,
      },
        el('span', { class: 'nav__icon', 'aria-hidden': 'true' }, route.icon),
        el('span', { class: 'nav__label' }, route.label),
      )),
  );

  const inBottom = PRIMARY.includes(current) ? PRIMARY : [...PRIMARY.slice(0, 3), current];

  clear(bottomHost).append(
    ...inBottom.map((id) =>
      el('a', {
        class: `bottom__item${id === current ? ' is-active' : ''}`,
        href: `#/${id}`,
        'aria-current': id === current ? 'page' : null,
      },
        el('span', { class: 'bottom__icon', 'aria-hidden': 'true' }, ROUTES[id].icon),
        el('span', { class: 'bottom__label' }, ROUTES[id].label),
      )),
    el('button', {
      class: 'bottom__item',
      type: 'button',
      'aria-label': 'Mais telas',
      'aria-expanded': String(document.body.classList.contains('is-menu-open')),
      onClick: () => toggleMenu(!document.body.classList.contains('is-menu-open')),
    },
      el('span', { class: 'bottom__icon', 'aria-hidden': 'true' }, '⋯'),
      el('span', { class: 'bottom__label' }, 'Mais'),
    ),
  );
}

// O seletor Igor / Karen / Os dois. É o "campo" de cada um: filtra agenda,
// tarefas e hábitos, e define o dono padrão do que for criado a partir dali.
function paintScope(visible) {
  scopeHost.hidden = !visible;
  if (!visible) return;

  clear(scopeHost).append(
    el('div', { class: 'scope', role: 'radiogroup', 'aria-label': 'Filtrar por pessoa' },
      [
        { id: 'igor', label: 'Igor' },
        { id: 'karen', label: 'Karen' },
        { id: 'nos', label: 'Os dois' },
      ].map((option) => el('button', {
        type: 'button',
        class: `scope__item scope__item--${option.id}${scope === option.id ? ' is-active' : ''}`,
        role: 'radio',
        'aria-checked': String(scope === option.id),
        onClick: async () => {
          scope = option.id;
          await store.setSetting('scope', scope);
          paint();
        },
      }, option.label)),
    ),
  );
}

function paintFab(route, context) {
  const fab = $('#fab');
  const canAdd = typeof route.view.quickAdd === 'function' && current !== 'ajustes';
  fab.hidden = !canAdd;
  if (!canAdd) return;
  fab.onclick = () => route.view.quickAdd(context);
}

function applyTheme() {
  const preference = store.getState().settings.theme || 'auto';
  const dark = preference === 'dark' || (
    preference === 'auto' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  $('meta[name="theme-color"]')?.setAttribute('content', dark ? '#14131A' : '#F6F4F0');
}

// Fechar a gaveta: tocando no fundo, escolhendo um item ou com Esc.
$('#scrim').addEventListener('click', closeMenu);

document.addEventListener('click', (event) => {
  if (event.target.closest('.nav__item')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('is-menu-open')) closeMenu();
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

store.subscribe(() => {
  applyTheme();
  paint();
});

(async function start() {
  try {
    await store.init();
    scope = store.getState().settings.scope || 'nos';
    applyTheme();
    router.start();
    $('#boot')?.remove();
  } catch (err) {
    console.error(err);
    clear(outlet).append(
      el('div', { class: 'empty' },
        el('p', { class: 'empty__text' },
          'Não consegui carregar os dados guardados neste navegador.'),
        el('p', { class: 'empty__text' }, String(err.message || err)),
      ),
    );
    $('#boot')?.remove();
  }
})();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => { /* offline é bônus */ });
  });
}
