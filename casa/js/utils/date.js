// Datas são tratadas como string 'YYYY-MM-DD' o tempo todo.
// Nunca `new Date('2026-03-01')` sem cuidado: isso é UTC e volta um dia
// em fuso negativo. Todas as conversões passam por aqui.

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);   // meia-noite local, sem surpresa de fuso
}

export const today = () => toISO(new Date());

export function addDays(iso, days) {
  const date = fromISO(iso);
  date.setDate(date.getDate() + days);
  return toISO(date);
}

export function addMonths(iso, months) {
  const date = fromISO(iso);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  // 31 de janeiro + 1 mês = 28/29 de fevereiro, não 3 de março.
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, lastDay));
  return toISO(date);
}

export const monthKey = (iso) => iso.slice(0, 7);          // 'YYYY-MM'
export const currentMonth = () => monthKey(today());

export function monthLabel(key) {
  const [y, m] = key.split('-').map(Number);
  return `${MONTHS[m - 1]} de ${y}`;
}

export function shiftMonth(key, delta) {
  const [y, m] = key.split('-').map(Number);
  const date = new Date(y, m - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Matriz do calendário: 6 semanas de 7 dias, começando no domingo,
// incluindo os dias vizinhos que completam a grade.
export function monthGrid(key) {
  const [y, m] = key.split('-').map(Number);
  const first = new Date(y, m - 1, 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());

  const weeks = [];
  const cursor = new Date(start);
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push({
        iso: toISO(cursor),
        day: cursor.getDate(),
        inMonth: cursor.getMonth() === m - 1,
        isToday: toISO(cursor) === today(),
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export function formatDate(iso, { weekday = false } = {}) {
  if (!iso) return '';
  const date = fromISO(iso);
  const base = `${date.getDate()} de ${MONTHS[date.getMonth()].toLowerCase()}`;
  return weekday ? `${WEEKDAYS[date.getDay()]}, ${base}` : base;
}

export function formatDateFull(iso) {
  if (!iso) return '';
  const date = fromISO(iso);
  return `${formatDate(iso, { weekday: true })} de ${date.getFullYear()}`;
}

// 'Hoje', 'Amanhã', 'Atrasada há 3 dias' — o texto que aparece nos cards.
export function relativeLabel(iso) {
  if (!iso) return '';
  const diff = daysBetween(today(), iso);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Amanhã';
  if (diff === -1) return 'Ontem';
  if (diff > 1 && diff <= 7) return `Em ${diff} dias`;
  if (diff < -1) return `Atrasada há ${Math.abs(diff)} dias`;
  return formatDate(iso);
}

export function daysBetween(fromIso, toIso) {
  const ms = fromISO(toIso) - fromISO(fromIso);
  return Math.round(ms / 86400000);
}

export const isPast = (iso) => Boolean(iso) && iso < today();
export const isToday = (iso) => iso === today();
