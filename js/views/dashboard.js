// Painel inicial. Responde "o que importa hoje" sem obrigar ninguém a
// abrir as seis telas.

import { el, frag, button, avatar, tag, empty } from '../ui/dom.js';
import {
  eventsOn, upcomingEvents, overdueTasks, tasksDueSoon,
  goalsByStatus, pendingShopping, inScope, habitStreak,
} from '../domain/queries.js';
import { fromCasa, fromLocal } from '../domain/finance-model.js';
import { ensure } from '../domain/financas-store.js';
import { formatMoney } from '../utils/money.js';
import {
  today, formatDateFull, formatDate, relativeLabel, currentMonth, monthLabel,
} from '../utils/date.js';
import { openEventForm } from './agenda.js';
import { openTaskForm } from './tarefas.js';

export function render(ctx) {
  const { state, scope, go } = ctx;
  const iso = today();

  const todayEvents = eventsOn(state, iso, scope);
  const soon = upcomingEvents(state, { scope, days: 7 }).filter((e) => e.date !== iso);
  const late = overdueTasks(state, scope);
  const due = tasksDueSoon(state, { scope }).filter((task) => !late.includes(task));
  // Mesma fonte que a tela de Finanças usa. Antes daqui sair do storage
  // local, esta caixa mostrava zero mesmo com a planilha ligada — o app
  // parecia quebrado sem estar.
  const payload = ensure(state.settings.financeUrl);
  const month = payload
    ? fromCasa(payload, currentMonth(), scope)
    : fromLocal(state, currentMonth(), scope);
  const goals = goalsByStatus(state, 'andamento');
  const shopping = pendingShopping(state);
  const habits = state.habits.filter((habit) => inScope(habit, scope));
  const habitsToday = habits.filter((habit) => !habit.checks?.[iso]);

  const isEmpty = state.events.length === 0 && state.tasks.length === 0
    && state.transactions.length === 0 && state.goals.length === 0
    && !month.rows.length;

  if (isEmpty) return frag(header(iso), firstRun(ctx));

  return frag(
    header(iso),

    el('div', { class: 'dash' },

      // ── Hoje ───────────────────────────────────────────────────────
      panel('Hoje', {
        action: button('Marcar algo', { onClick: () => openEventForm(ctx, { date: iso }) }),
        onOpen: () => go('agenda'),
      },
        todayEvents.length
          ? el('ul', { class: 'mini-list' }, todayEvents.map((event) =>
              el('li', { class: `mini mini--${event.scope}` },
                el('span', { class: 'mini__time' }, event.time || '—'),
                el('span', { class: 'mini__title' }, event.title),
                avatar(event.scope),
              )))
          : el('p', { class: 'panel__note' }, 'Dia livre. Aproveitem.'),

        soon.length ? frag(
          el('p', { class: 'list-divider' }, 'Nos próximos dias'),
          el('ul', { class: 'mini-list' }, soon.map((event) =>
            el('li', { class: `mini mini--${event.scope}` },
              el('span', { class: 'mini__time' }, formatDate(event.date)),
              el('span', { class: 'mini__title' }, event.title),
              avatar(event.scope),
            ))),
        ) : null,
      ),

      // ── Tarefas ────────────────────────────────────────────────────
      panel('Tarefas', {
        badge: late.length ? `${late.length} atrasada(s)` : null,
        badgeTone: 'late',
        action: button('Nova', { onClick: () => openTaskForm(ctx) }),
        onOpen: () => go('tarefas'),
      },
        late.length || due.length
          ? el('ul', { class: 'mini-list' },
              [...late, ...due].slice(0, 6).map((task) =>
                el('li', { class: 'mini' },
                  el('span', { class: 'mini__title' }, task.title),
                  tag(relativeLabel(task.dueDate), task.dueDate < iso ? 'late' : null),
                  avatar(task.scope),
                )))
          : el('p', { class: 'panel__note' }, 'Nada vencendo nos próximos dias.'),
      ),

      // ── Finanças ───────────────────────────────────────────────────
      panel(`Finanças · ${monthLabel(currentMonth())}`, { onOpen: () => go('financas') },
        el('div', { class: 'stats stats--tight' },
          [
            month.income
              ? verba('up', scope === 'nos' ? 'Renda' : `Renda de ${nomeDo(scope)}`,
                      formatMoney(month.income))
              : null,
            month.committed
              ? verba('down', 'Comprometido', formatMoney(month.committed))
              : null,
            verba('down', scope === 'nos' ? 'Saiu' : `Pago por ${nomeDo(scope)}`,
                  formatMoney(month.expense)),
            month.balance !== null
              ? verba(month.balance >= 0 ? 'up' : 'down', 'Sobra', formatMoney(month.balance))
              : null,
          ].filter(Boolean),
        ),
        month.settlement
          ? el('p', { class: 'panel__note' },
              `Acerto do mês: ${month.settlement.from === 'igor' ? 'Igor' : 'Karen'} deve ` +
              `${formatMoney(month.settlement.amount)} pra ` +
              `${month.settlement.to === 'igor' ? 'Igor' : 'Karen'}.`)
          : null,
        month.source === 'local' && !state.settings.financeUrl
          ? el('p', { class: 'panel__note' },
              'Modo manual. Ligue a planilha do bot em Ajustes para ver os números reais.')
          : null,
      ),

      // ── Metas ──────────────────────────────────────────────────────
      panel('Metas em andamento', { onOpen: () => go('metas') },
        goals.length
          ? el('ul', { class: 'mini-list' }, goals.slice(0, 4).map((goal) =>
              el('li', { class: 'mini mini--goal' },
                el('span', { class: 'mini__title' }, goal.title),
                el('div', { class: 'bar__track bar__track--sm' },
                  el('div', { class: 'bar__fill', style: { width: `${goal.progress || 0}%` } })),
                el('span', { class: 'mini__pct' }, `${goal.progress || 0}%`),
              )))
          : el('p', { class: 'panel__note' }, 'Nenhuma meta em andamento.'),
      ),

      // ── Compras ────────────────────────────────────────────────────
      panel('Compras', {
        badge: shopping.length ? String(shopping.length) : null,
        onOpen: () => go('compras'),
      },
        shopping.length
          ? el('ul', { class: 'mini-list' }, shopping.slice(0, 6).map((item) =>
              el('li', { class: 'mini' },
                el('span', { class: 'mini__title' }, item.title),
                tag(item.list),
              )))
          : el('p', { class: 'panel__note' }, 'Nada na lista.'),
      ),

      // ── Hábitos ────────────────────────────────────────────────────
      habits.length ? panel('Hábitos de hoje', { onOpen: () => go('habitos') },
        habitsToday.length
          ? el('ul', { class: 'mini-list' }, habitsToday.map((habit) =>
              el('li', { class: 'mini' },
                el('span', { class: 'mini__title' }, habit.title),
                avatar(habit.scope),
                el('button', {
                  type: 'button', class: 'btn btn--ghost btn--xs',
                  onClick: () => ctx.store.update('habits', habit.id, {
                    checks: { ...(habit.checks || {}), [iso]: true },
                  }),
                }, 'Feito'),
              )))
          : el('p', { class: 'panel__note' },
              `Tudo marcado hoje. Maior sequência: ${
                Math.max(...habits.map((h) => habitStreak(h)))} dias.`),
      ) : null,
    ),
  );
}

const nomeDo = (scope) => (scope === 'igor' ? 'Igor' : scope === 'karen' ? 'Karen' : null);

function verba(tone, label, value) {
  return el('div', { class: `stat stat--${tone}` },
    el('p', { class: 'stat__label' }, label),
    el('p', { class: 'stat__value' }, value),
  );
}

function header(iso) {
  const hour = new Date().getHours();
  const greeting = hour < 5 ? 'Boa madrugada'
    : hour < 12 ? 'Bom dia'
    : hour < 18 ? 'Boa tarde'
    : 'Boa noite';

  return el('header', { class: 'hero' },
    el('p', { class: 'hero__date' }, formatDateFull(iso)),
    el('h1', { class: 'hero__title' }, `${greeting}.`),
  );
}

function panel(title, options = {}, ...children) {
  const { action = null, badge = null, badgeTone = null, onOpen = null } = options;

  return el('section', { class: 'dash__panel' },
    el('header', { class: 'panel__head' },
      el('h2', { class: 'panel__title' },
        onOpen
          ? el('button', { type: 'button', class: 'panel__link', onClick: onOpen }, title)
          : title,
        badge && tag(badge, badgeTone),
      ),
      action,
    ),
    ...children,
  );
}

function firstRun(ctx) {
  return el('section', { class: 'first-run' },
    el('h2', {}, 'Bem-vindos ao sistema de vocês.'),
    el('p', {},
      'Ainda não tem nada aqui. Comece pelo que for mais urgente — dá pra ' +
      'preencher o resto aos poucos.'),
    el('div', { class: 'first-run__actions' },
      button('Marcar um compromisso', {
        variant: 'primary', onClick: () => openEventForm(ctx, { date: today() }),
      }),
      button('Criar uma tarefa', { onClick: () => openTaskForm(ctx) }),
      button('Ver como fica com dados de exemplo', {
        onClick: () => ctx.loadSample(),
      }),
    ),
    el('p', { class: 'first-run__note' },
      'Os dados de exemplo são fictícios e dá pra apagar tudo depois em Ajustes.'),
  );
}

export const quickAdd = (ctx) => openTaskForm(ctx);
