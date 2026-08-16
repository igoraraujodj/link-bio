// Hábitos: uma linha por hábito, sete colunas de dias.
//
// Guardar como mapa `checks['2026-08-16'] = true` em vez de uma lista de
// datas deixa marcar/desmarcar em O(1) e não duplica registro.

import { el, frag, section, button, avatar, empty, confirmDialog } from '../ui/dom.js';
import { openForm } from '../ui/modal.js';
import { habitStreak, inScope } from '../domain/queries.js';
import { today, addDays, toISO, fromISO, WEEKDAYS, formatDate } from '../utils/date.js';

let weekOffset = 0;

export function render(ctx) {
  const { state, scope } = ctx;
  const days = weekDays(weekOffset);
  const habits = state.habits.filter((habit) => inScope(habit, scope));

  return frag(
    section('Hábitos', {
      sub: 'O que vocês querem manter constante. Toque no quadradinho do dia.',
      action: frag(
        el('div', { class: 'month-nav' },
          el('button', {
            type: 'button', class: 'icon-btn', 'aria-label': 'Semana anterior',
            onClick: () => { weekOffset--; ctx.refresh(); },
          }, '‹'),
          el('strong', { class: 'month-nav__label' },
            weekOffset === 0 ? 'Esta semana'
              : `${formatDate(days[0].iso)} – ${formatDate(days[6].iso)}`),
          el('button', {
            type: 'button', class: 'icon-btn', 'aria-label': 'Próxima semana',
            disabled: weekOffset >= 0,
            onClick: () => { weekOffset++; ctx.refresh(); },
          }, '›'),
        ),
        button('Novo hábito', { variant: 'primary', onClick: () => openHabitForm(ctx) }),
      ),
    }),

    habits.length === 0
      ? empty(
          'Nenhum hábito acompanhado ainda.',
          button('Criar o primeiro', { variant: 'primary', onClick: () => openHabitForm(ctx) }),
        )
      : el('div', { class: 'habits' },
          el('div', { class: 'habits__head' },
            el('span', { class: 'habits__spacer' }),
            days.map((day) => el('span', {
              class: `habits__day${day.iso === today() ? ' is-today' : ''}`,
            },
              el('small', {}, WEEKDAYS[day.weekday]),
              el('b', {}, day.num),
            )),
            el('span', { class: 'habits__streak-head' }, 'Seq.'),
          ),
          habits.map((habit) => habitRow(ctx, habit, days)),
        ),
  );
}

function habitRow(ctx, habit, days) {
  const streak = habitStreak(habit);

  return el('div', { class: 'habits__row' },
    el('button', {
      type: 'button', class: 'habits__name',
      onClick: () => openHabitForm(ctx, habit),
    },
      avatar(habit.scope),
      el('span', {}, habit.title),
    ),
    days.map((day) => {
      const checked = Boolean(habit.checks?.[day.iso]);
      const future = day.iso > today();
      return el('button', {
        type: 'button',
        class: `habits__cell${checked ? ' is-on' : ''}${future ? ' is-future' : ''}`,
        disabled: future,
        'aria-pressed': String(checked),
        'aria-label': `${habit.title} em ${formatDate(day.iso)}`,
        onClick: () => toggle(ctx, habit, day.iso),
      }, checked ? '✓' : '');
    }),
    el('span', { class: `habits__streak${streak >= 3 ? ' is-hot' : ''}` }, streak),
  );
}

async function toggle(ctx, habit, iso) {
  const checks = { ...(habit.checks || {}) };
  if (checks[iso]) delete checks[iso];
  else checks[iso] = true;
  await ctx.store.update('habits', habit.id, { checks });
}

function weekDays(offset) {
  const base = fromISO(today());
  base.setDate(base.getDate() - base.getDay() + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() + i);
    return { iso: toISO(date), num: date.getDate(), weekday: date.getDay() };
  });
}

export function openHabitForm(ctx, habit = {}) {
  const isEdit = Boolean(habit.id);

  openForm({
    title: isEdit ? 'Editar hábito' : 'Novo hábito',
    submitLabel: isEdit ? 'Salvar' : 'Criar',
    values: {
      title: habit.title || '',
      scope: habit.scope || (ctx.scope === 'nos' ? 'nos' : ctx.scope),
    },
    fields: [
      { name: 'title', label: 'Hábito', required: true,
        placeholder: 'Ex.: academia, leitura, beber água' },
      { name: 'scope', label: 'De quem é', type: 'segmented',
        options: [
          { id: 'igor', label: 'Igor' },
          { id: 'karen', label: 'Karen' },
          { id: 'nos', label: 'Os dois' },
        ] },
    ],
    onSubmit: async (values) => {
      if (isEdit) await ctx.store.update('habits', habit.id, values);
      else await ctx.store.insert('habits', { ...values, checks: {} });
    },
    onDelete: isEdit ? async () => {
      if (!confirmDialog('Isso apaga o hábito e todo o histórico dele. Continuar?')) return;
      await ctx.store.remove('habits', habit.id);
    } : null,
  });
}

export const quickAdd = (ctx) => openHabitForm(ctx);
