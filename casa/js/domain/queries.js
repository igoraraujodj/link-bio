// Consultas sobre o estado. Ficam fora das views porque o dashboard e as
// telas de cada módulo perguntam as mesmas coisas.

import { today, monthKey, addMonths, daysBetween } from '../utils/date.js';

export const inScope = (item, scope) =>
  scope === 'nos' ? true : item.scope === scope || item.scope === 'nos';

// ── Agenda ───────────────────────────────────────────────────────────────

export function eventsOn(state, iso, scope = 'nos') {
  return state.events
    .filter((event) => event.date === iso && inScope(event, scope))
    .sort(byTime);
}

export function eventsInMonth(state, key, scope = 'nos') {
  return state.events
    .filter((event) => monthKey(event.date) === key && inScope(event, scope))
    .sort((a, b) => a.date.localeCompare(b.date) || byTime(a, b));
}

export function upcomingEvents(state, { days = 7, scope = 'nos', limit = 6 } = {}) {
  const from = today();
  return state.events
    .filter((event) =>
      event.date >= from &&
      daysBetween(from, event.date) <= days &&
      inScope(event, scope))
    .sort((a, b) => a.date.localeCompare(b.date) || byTime(a, b))
    .slice(0, limit);
}

const byTime = (a, b) => (a.time || '99:99').localeCompare(b.time || '99:99');

// ── Tarefas ──────────────────────────────────────────────────────────────

export function tasksByStatus(state, statusId, scope = 'nos') {
  return state.tasks
    .filter((task) => task.status === statusId && inScope(task, scope))
    .sort((a, b) => {
      const weight = { alta: 0, media: 1, baixa: 2 };
      const byPriority = (weight[a.priority] ?? 1) - (weight[b.priority] ?? 1);
      if (byPriority) return byPriority;
      return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
    });
}

export function openTasks(state, scope = 'nos') {
  return state.tasks.filter((task) => task.status !== 'concluida' && inScope(task, scope));
}

export function tasksDueSoon(state, { days = 7, scope = 'nos' } = {}) {
  const from = today();
  return openTasks(state, scope)
    .filter((task) => task.dueDate && daysBetween(from, task.dueDate) <= days)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export const overdueTasks = (state, scope = 'nos') =>
  openTasks(state, scope).filter((task) => task.dueDate && task.dueDate < today());

// ── Finanças ─────────────────────────────────────────────────────────────

// Lançamentos recorrentes existem uma vez só no banco. As ocorrências dos
// meses seguintes são calculadas na hora, marcadas com `virtual: true`.
// Sem isso, cada conta fixa viraria 12 registros por ano na mão.
export function transactionsInMonth(state, key) {
  const out = [];

  for (const tx of state.transactions) {
    const start = monthKey(tx.date);

    if (!tx.recurrence) {
      if (start === key) out.push(tx);
      continue;
    }

    if (key < start) continue;
    if (tx.recurrenceUntil && key > monthKey(tx.recurrenceUntil)) continue;

    if (start === key) {
      out.push(tx);
    } else {
      const months = monthsBetween(start, key);
      const step = tx.recurrence === 'anual' ? 12 : 1;
      if (months % step !== 0) continue;
      out.push({
        ...tx,
        id: `${tx.id}@${key}`,
        date: addMonths(tx.date, months),
        virtual: true,
        seriesId: tx.id,
      });
    }
  }

  return out.sort((a, b) => b.date.localeCompare(a.date));
}

function monthsBetween(fromKey, toKey) {
  const [fy, fm] = fromKey.split('-').map(Number);
  const [ty, tm] = toKey.split('-').map(Number);
  return (ty - fy) * 12 + (tm - fm);
}

export function monthTotals(state, key) {
  const rows = transactionsInMonth(state, key);
  const income = sum(rows.filter((tx) => tx.type === 'entrada'));
  const expense = sum(rows.filter((tx) => tx.type === 'saida'));
  return { rows, income, expense, balance: income - expense };
}

const sum = (rows) => rows.reduce((total, tx) => total + (tx.amount || 0), 0);

export function byCategory(rows, type = 'saida') {
  const map = new Map();
  for (const tx of rows.filter((row) => row.type === type)) {
    map.set(tx.category, (map.get(tx.category) || 0) + tx.amount);
  }
  return [...map.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

// Quem pagou quanto, e quanto cada um deveria ter pago. A diferença é o
// acerto do mês — a pergunta que todo casal faz no fim do mês.
export function settlement(rows) {
  const paid = { igor: 0, karen: 0 };
  const owed = { igor: 0, karen: 0 };

  for (const tx of rows) {
    if (tx.type !== 'saida') continue;
    if (tx.paidBy === 'igor' || tx.paidBy === 'karen') paid[tx.paidBy] += tx.amount;

    if (tx.split === 'meio') {
      owed.igor += tx.amount / 2;
      owed.karen += tx.amount / 2;
    } else if (tx.split === 'igor' || tx.split === 'karen') {
      owed[tx.split] += tx.amount;
    }
  }

  const diff = Math.round(paid.igor - owed.igor);
  return {
    paid,
    owed: { igor: Math.round(owed.igor), karen: Math.round(owed.karen) },
    // diff > 0: Igor adiantou, Karen deve. diff < 0: o contrário.
    from: diff > 0 ? 'karen' : 'igor',
    to: diff > 0 ? 'igor' : 'karen',
    amount: Math.abs(diff),
  };
}

// ── Metas, compras, hábitos ──────────────────────────────────────────────

export const goalsByStatus = (state, statusId) =>
  state.goals
    .filter((goal) => goal.status === statusId)
    .sort((a, b) => (a.targetDate || '9999').localeCompare(b.targetDate || '9999'));

export const pendingShopping = (state, list = null) =>
  state.shopping.filter((item) => !item.done && (!list || item.list === list));

export function habitStreak(habit, upTo = today()) {
  let streak = 0;
  let cursor = upTo;
  // Se hoje ainda não foi marcado, a sequência conta a partir de ontem —
  // senão o número zera às 00h de todo dia e desmotiva.
  if (!habit.checks?.[cursor]) cursor = shift(cursor, -1);
  while (habit.checks?.[cursor]) {
    streak++;
    cursor = shift(cursor, -1);
  }
  return streak;
}

function shift(iso, days) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
