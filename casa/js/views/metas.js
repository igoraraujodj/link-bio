// Metas do casal. Só visualização e movimento entre três estados —
// era exatamente o pedido: ver o que já foi concluído e o que vai entrar.

import { el, frag, section, button, tag, empty, avatar } from '../ui/dom.js';
import { openForm } from '../ui/modal.js';
import { goalsByStatus } from '../domain/queries.js';
import { GOAL_STATUS } from '../store/schema.js';
import { formatMoney } from '../utils/money.js';
import { formatDate, relativeLabel, today } from '../utils/date.js';

export function render(ctx) {
  const { state } = ctx;
  const done = goalsByStatus(state, 'concluida').length;
  const total = state.goals.length;

  return frag(
    section('Metas', {
      sub: 'O que vocês querem alcançar, em que pé está cada uma.',
      action: button('Nova meta', { variant: 'primary', onClick: () => openGoalForm(ctx) }),
    }),

    total > 0 ? el('div', { class: 'stats stats--tight' },
      el('div', { class: 'stat' },
        el('p', { class: 'stat__label' }, 'Concluídas'),
        el('p', { class: 'stat__value' }, `${done} de ${total}`),
      ),
      el('div', { class: 'stat' },
        el('p', { class: 'stat__label' }, 'Em andamento'),
        el('p', { class: 'stat__value' }, goalsByStatus(state, 'andamento').length),
      ),
      el('div', { class: 'stat' },
        el('p', { class: 'stat__label' }, 'Na fila'),
        el('p', { class: 'stat__value' }, goalsByStatus(state, 'ideia').length),
      ),
    ) : null,

    total === 0
      ? empty(
          'Nenhuma meta ainda. Comece pela mais óbvia — a viagem, a reserva, a mudança.',
          button('Criar a primeira', { variant: 'primary', onClick: () => openGoalForm(ctx) }),
        )
      : el('div', { class: 'lanes' },
          GOAL_STATUS.map((status) => {
            const goals = goalsByStatus(state, status.id);
            return el('section', { class: `lane lane--${status.id}` },
              el('header', { class: 'lane__head' },
                el('h3', {}, status.label),
                el('span', { class: 'lane__count' }, goals.length),
              ),
              goals.length
                ? el('div', { class: 'lane__body' }, goals.map((goal) => goalCard(ctx, goal)))
                : el('p', { class: 'column__empty' }, '—'),
            );
          }),
        ),
  );
}

function goalCard(ctx, goal) {
  const progress = goal.status === 'concluida' ? 100 : (goal.progress || 0);
  const index = GOAL_STATUS.findIndex((s) => s.id === goal.status);
  const late = goal.targetDate && goal.targetDate < today() && goal.status !== 'concluida';

  return el('article', {
    class: `goal${goal.status === 'concluida' ? ' is-done' : ''}`,
    tabindex: '0',
    onClick: (event) => {
      if (event.target.closest('.card__move')) return;
      openGoalForm(ctx, goal);
    },
  },
    el('header', { class: 'goal__head' },
      el('h4', { class: 'goal__title' }, goal.title),
      goal.scope && goal.scope !== 'nos' ? avatar(goal.scope) : null,
    ),
    goal.description && el('p', { class: 'card__desc' }, goal.description),

    goal.status !== 'ideia' ? el('div', { class: 'goal__progress' },
      el('div', { class: 'bar__track' },
        el('div', { class: 'bar__fill', style: { width: `${progress}%` } })),
      el('span', { class: 'goal__pct' }, `${progress}%`),
    ) : null,

    el('div', { class: 'card__meta' },
      goal.amount ? tag(formatMoney(goal.amount)) : null,
      goal.targetDate
        ? tag(goal.status === 'concluida'
            ? `Prazo era ${formatDate(goal.targetDate)}`
            : relativeLabel(goal.targetDate), late ? 'late' : null)
        : null,
    ),

    el('div', { class: 'card__move' },
      el('button', {
        type: 'button', class: 'icon-btn icon-btn--sm', disabled: index === 0,
        'aria-label': 'Voltar de estado',
        onClick: () => ctx.store.update('goals', goal.id, { status: GOAL_STATUS[index - 1].id }),
      }, '‹'),
      el('button', {
        type: 'button', class: 'icon-btn icon-btn--sm',
        disabled: index === GOAL_STATUS.length - 1,
        'aria-label': 'Avançar de estado',
        onClick: () => ctx.store.update('goals', goal.id, {
          status: GOAL_STATUS[index + 1].id,
          ...(GOAL_STATUS[index + 1].id === 'concluida' ? { progress: 100, doneAt: today() } : {}),
        }),
      }, '›'),
    ),
  );
}

export function openGoalForm(ctx, goal = {}) {
  const isEdit = Boolean(goal.id);

  openForm({
    title: isEdit ? 'Editar meta' : 'Nova meta',
    submitLabel: isEdit ? 'Salvar' : 'Criar',
    values: {
      title: goal.title || '',
      description: goal.description || '',
      status: goal.status || 'ideia',
      scope: goal.scope || 'nos',
      progress: goal.progress ?? 0,
      amount: goal.amount || null,
      targetDate: goal.targetDate || '',
    },
    fields: [
      { name: 'title', label: 'Meta', required: true,
        placeholder: 'Ex.: viagem pro Chile, entrada do apartamento' },
      { name: 'description', label: 'O que envolve', type: 'textarea',
        placeholder: 'O que precisa acontecer pra essa meta sair do papel.' },
      { name: 'scope', label: 'De quem é', type: 'segmented',
        options: [
          { id: 'nos', label: 'Os dois' },
          { id: 'igor', label: 'Igor' },
          { id: 'karen', label: 'Karen' },
        ] },
      { name: 'status', label: 'Estado', type: 'select', options: GOAL_STATUS, span: 'half' },
      { name: 'progress', label: 'Progresso (%)', type: 'number',
        min: 0, max: 100, step: 5, span: 'half' },
      { name: 'amount', label: 'Valor envolvido', type: 'money', span: 'half',
        hint: 'Opcional. Quanto essa meta custa.' },
      { name: 'targetDate', label: 'Prazo', type: 'date', span: 'half' },
    ],
    onSubmit: async (values) => {
      values.progress = Math.max(0, Math.min(100, values.progress ?? 0));
      if (values.status === 'concluida') values.progress = 100;
      if (isEdit) await ctx.store.update('goals', goal.id, values);
      else await ctx.store.insert('goals', values);
    },
    onDelete: isEdit ? async () => { await ctx.store.remove('goals', goal.id); } : null,
  });
}

export const quickAdd = (ctx) => openGoalForm(ctx);
