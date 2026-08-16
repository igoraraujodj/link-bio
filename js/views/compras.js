// Lista de compras e pendências da casa.
//
// É a tela mais usada no celular, então o campo de adicionar fica sempre à
// mão e não abre formulário: digita e dá Enter.

import { el, frag, section, button, chip, empty, avatar } from '../ui/dom.js';
import { SHOPPING_LISTS } from '../store/schema.js';

let activeList = 'mercado';

export function render(ctx) {
  const { state, scope } = ctx;
  const items = state.shopping.filter((item) => item.list === activeList);
  const pending = items.filter((item) => !item.done);
  const done = items.filter((item) => item.done);

  const input = el('input', {
    class: 'input quick__input',
    type: 'text',
    placeholder: 'O que falta? Enter para adicionar',
    'aria-label': 'Novo item',
    enterkeyhint: 'done',
  });

  async function add() {
    const title = input.value.trim();
    if (!title) return;
    input.value = '';
    await ctx.store.insert('shopping', {
      title,
      list: activeList,
      done: false,
      addedBy: scope === 'nos' ? 'nos' : scope,
    });
    // Repintura recria o campo; devolver o foco mantém o ritmo de digitar
    // cinco itens seguidos.
    setTimeout(() => document.querySelector('.quick__input')?.focus(), 0);
  }

  return frag(
    section('Compras e casa', {
      sub: 'Marcar e desmarcar sem abrir nada.',
      action: pending.length
        ? el('span', { class: 'section-count' }, `${pending.length} pendente(s)`)
        : null,
    }),

    el('div', { class: 'toolbar' },
      el('div', { class: 'toolbar__filters' },
        SHOPPING_LISTS.map((list) => chip(list.label, {
          active: activeList === list.id,
          onClick: () => { activeList = list.id; ctx.refresh(); },
        })),
      ),
      done.length
        ? button(`Limpar marcados (${done.length})`, {
            onClick: async () => {
              for (const item of done) await ctx.store.remove('shopping', item.id);
            },
          })
        : null,
    ),

    el('form', {
      class: 'quick',
      onSubmit: (event) => { event.preventDefault(); add(); },
    },
      input,
      el('button', { type: 'submit', class: 'btn btn--primary' }, 'Adicionar'),
    ),

    pending.length
      ? el('ul', { class: 'check-list' }, pending.map((item) => row(ctx, item)))
      : empty('Lista limpa.'),

    done.length ? frag(
      el('p', { class: 'list-divider' }, `Já pegamos (${done.length})`),
      el('ul', { class: 'check-list check-list--done' }, done.map((item) => row(ctx, item))),
    ) : null,
  );
}

function row(ctx, item) {
  return el('li', { class: `check-item${item.done ? ' is-done' : ''}` },
    el('label', { class: 'check' },
      el('input', {
        type: 'checkbox',
        checked: item.done,
        onChange: (event) =>
          ctx.store.update('shopping', item.id, { done: event.target.checked }),
      }),
      el('span', { class: 'check-item__title' }, item.title),
    ),
    item.addedBy && item.addedBy !== 'nos' ? avatar(item.addedBy) : null,
    el('button', {
      type: 'button', class: 'icon-btn icon-btn--sm',
      'aria-label': `Remover ${item.title}`,
      onClick: () => ctx.store.remove('shopping', item.id),
    }, '✕'),
  );
}

export const quickAdd = () => document.querySelector('.quick__input')?.focus();
