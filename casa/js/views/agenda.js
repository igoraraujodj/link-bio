// Calendário do casal. O mês inteiro à vista, e o dia selecionado aberto
// ao lado (desktop) ou logo abaixo (mobile).

import { el, frag, section, button, avatar, empty, chip } from '../ui/dom.js';
import { openForm } from '../ui/modal.js';
import { eventsOn, eventsInMonth, inScope } from '../domain/queries.js';
import { EVENT_CATEGORIES, SCOPES } from '../store/schema.js';
import {
  monthGrid, monthLabel, shiftMonth, currentMonth, today,
  formatDateFull, WEEKDAYS, monthKey,
} from '../utils/date.js';

let viewMonth = currentMonth();
let selectedDay = today();

export function render(ctx) {
  const { state, scope } = ctx;
  const weeks = monthGrid(viewMonth);
  const monthEvents = eventsInMonth(state, viewMonth, scope);

  // Índice por dia, montado uma vez: 42 células buscando no array seria
  // 42 varreduras a cada repintura.
  const byDay = new Map();
  for (const event of monthEvents) {
    if (!byDay.has(event.date)) byDay.set(event.date, []);
    byDay.get(event.date).push(event);
  }

  const grid = el('div', { class: 'cal' },
    el('div', { class: 'cal__weekdays' },
      WEEKDAYS.map((day) => el('span', { class: 'cal__weekday' }, day))),
    el('div', { class: 'cal__grid' },
      weeks.flat().map((cell) => {
        const dayEvents = byDay.get(cell.iso) || [];
        return el('button', {
          type: 'button',
          class: [
            'cal__day',
            cell.inMonth ? '' : 'is-outside',
            cell.isToday ? 'is-today' : '',
            cell.iso === selectedDay ? 'is-selected' : '',
          ].filter(Boolean).join(' '),
          'aria-label': `${formatDateFull(cell.iso)}, ${dayEvents.length} compromisso(s)`,
          'aria-current': cell.isToday ? 'date' : null,
          onClick: () => { selectedDay = cell.iso; ctx.refresh(); },
        },
          el('span', { class: 'cal__num' }, cell.day),
          dayEvents.length
            ? el('span', { class: 'cal__dots' },
                dayEvents.slice(0, 4).map((event) =>
                  el('i', { class: `cal__dot cal__dot--${event.scope}` })))
            : null,
        );
      })),
  );

  const dayEvents = eventsOn(state, selectedDay, scope);

  const panel = el('aside', { class: 'day-panel' },
    el('header', { class: 'day-panel__head' },
      el('div', {},
        el('p', { class: 'day-panel__label' },
          selectedDay === today() ? 'Hoje' : 'Dia selecionado'),
        el('h3', { class: 'day-panel__date' }, formatDateFull(selectedDay)),
      ),
      button('Adicionar', {
        variant: 'primary',
        onClick: () => openEventForm(ctx, { date: selectedDay }),
      }),
    ),
    dayEvents.length
      ? el('ul', { class: 'day-list' }, dayEvents.map((event) => eventRow(ctx, event)))
      : empty('Nada marcado nesse dia.'),
  );

  return frag(
    section(`Agenda`, {
      sub: 'Os compromissos dos dois no mesmo lugar. O ponto colorido diz de quem é.',
      action: el('div', { class: 'month-nav' },
        el('button', {
          type: 'button', class: 'icon-btn', 'aria-label': 'Mês anterior',
          onClick: () => { viewMonth = shiftMonth(viewMonth, -1); ctx.refresh(); },
        }, '‹'),
        el('strong', { class: 'month-nav__label' }, monthLabel(viewMonth)),
        el('button', {
          type: 'button', class: 'icon-btn', 'aria-label': 'Próximo mês',
          onClick: () => { viewMonth = shiftMonth(viewMonth, 1); ctx.refresh(); },
        }, '›'),
        viewMonth !== currentMonth() && chip('Hoje', {
          onClick: () => {
            viewMonth = currentMonth(); selectedDay = today(); ctx.refresh();
          },
        }),
      ),
    }),
    el('div', { class: 'agenda' }, grid, panel),
  );
}

function eventRow(ctx, event) {
  return el('li', { class: `day-item day-item--${event.scope}` },
    el('span', { class: 'day-item__time' }, event.time || '—'),
    el('div', { class: 'day-item__body' },
      el('p', { class: 'day-item__title' }, event.title),
      el('p', { class: 'day-item__meta' },
        [event.category, event.endTime && `até ${event.endTime}`]
          .filter(Boolean).join(' · ')),
      event.note && el('p', { class: 'day-item__note' }, event.note),
    ),
    avatar(event.scope),
    el('button', {
      type: 'button', class: 'icon-btn icon-btn--sm',
      'aria-label': `Editar ${event.title}`,
      onClick: () => openEventForm(ctx, event),
    }, '✎'),
  );
}

export function openEventForm(ctx, event = {}) {
  const isEdit = Boolean(event.id);

  openForm({
    title: isEdit ? 'Editar compromisso' : 'Novo compromisso',
    subtitle: isEdit ? null : 'Marque de quem é: aparece com a cor da pessoa no calendário.',
    submitLabel: isEdit ? 'Salvar' : 'Adicionar',
    values: {
      scope: event.scope || (ctx.scope === 'nos' ? 'nos' : ctx.scope),
      title: event.title || '',
      date: event.date || today(),
      time: event.time || '',
      endTime: event.endTime || '',
      category: event.category || 'Compromisso',
      note: event.note || '',
    },
    fields: [
      { name: 'scope', label: 'De quem é', type: 'segmented',
        options: [
          { id: 'igor', label: 'Igor' },
          { id: 'karen', label: 'Karen' },
          { id: 'nos', label: 'Os dois' },
        ] },
      { name: 'title', label: 'O que é', required: true,
        placeholder: 'Consulta, reunião, aniversário…' },
      { name: 'date', label: 'Dia', type: 'date', required: true, span: 'half' },
      { name: 'category', label: 'Categoria', type: 'select',
        options: EVENT_CATEGORIES, span: 'half' },
      { name: 'time', label: 'Começa', type: 'time', span: 'half' },
      { name: 'endTime', label: 'Termina', type: 'time', span: 'half' },
      { name: 'note', label: 'Observação', type: 'textarea',
        placeholder: 'Endereço, o que levar, com quem…' },
    ],
    onSubmit: async (values) => {
      if (!SCOPES.includes(values.scope)) values.scope = 'nos';
      selectedDay = values.date;
      if (monthKey(values.date) !== viewMonth) viewMonth = monthKey(values.date);
      if (isEdit) await ctx.store.update('events', event.id, values);
      else await ctx.store.insert('events', values);
    },
    onDelete: isEdit
      ? async () => { await ctx.store.remove('events', event.id); }
      : null,
  });
}

// Usado pelo botão flutuante quando a rota ativa é a agenda.
export const quickAdd = (ctx) => openEventForm(ctx, { date: selectedDay });
