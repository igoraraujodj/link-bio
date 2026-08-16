// Finanças do casal, mês a mês.
//
// Três perguntas que a tela responde na ordem: quanto entrou e saiu, onde
// foi parar, e quem deve pra quem no fim do mês.

import { el, frag, section, button, chip, tag, empty, avatar, confirmDialog } from '../ui/dom.js';
import { openForm } from '../ui/modal.js';
import { monthTotals, byCategory, settlement } from '../domain/queries.js';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, SPLITS } from '../store/schema.js';
import { formatMoney, formatMoneyShort, percent } from '../utils/money.js';
import {
  currentMonth, monthLabel, shiftMonth, today, formatDate, monthKey,
} from '../utils/date.js';

let viewMonth = currentMonth();
let filter = 'todos';

export function render(ctx) {
  const { state } = ctx;
  const { rows, income, expense, balance } = monthTotals(state, viewMonth);
  const expenses = byCategory(rows, 'saida');
  const acerto = settlement(rows);
  const target = state.settings.monthlyTarget;

  const visible = rows.filter((tx) =>
    filter === 'todos' ? true :
    filter === 'fixas' ? Boolean(tx.recurrence) :
    tx.type === filter);

  return frag(
    section('Finanças', {
      sub: 'Entradas, saídas e o acerto entre vocês. Contas fixas se repetem sozinhas todo mês.',
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
      ),
    }),

    el('div', { class: 'stats' },
      stat('Entrou', formatMoney(income), 'up'),
      stat('Saiu', formatMoney(expense), 'down'),
      stat('Sobrou', formatMoney(balance), balance >= 0 ? 'up' : 'down',
        target ? `Meta de reserva: ${formatMoney(target)}` : null),
    ),

    target && balance > 0 ? el('div', { class: 'panel' },
      el('div', { class: 'panel__head' },
        el('h3', {}, 'Reserva do mês'),
        el('span', { class: 'panel__value' }, `${Math.min(100, percent(balance, target))}%`),
      ),
      progressBar(Math.min(100, percent(balance, target))),
      el('p', { class: 'panel__note' },
        balance >= target
          ? 'Meta batida. O que passou disso é ganho.'
          : `Faltam ${formatMoney(target - balance)} pra fechar a meta.`),
    ) : null,

    // ── Acerto ─────────────────────────────────────────────────────────
    acerto.amount > 0 ? el('div', { class: 'panel panel--accent' },
      el('div', { class: 'panel__head' },
        el('h3', {}, 'Acerto do mês'),
      ),
      el('p', { class: 'settle' },
        avatar(acerto.from), ' ',
        el('strong', {}, acerto.from === 'igor' ? 'Igor' : 'Karen'),
        ' deve ',
        el('strong', { class: 'settle__amount' }, formatMoney(acerto.amount)),
        ' pra ',
        el('strong', {}, acerto.to === 'igor' ? 'Igor' : 'Karen'),
      ),
      el('p', { class: 'panel__note' },
        `Igor pagou ${formatMoney(acerto.paid.igor)} e devia ${formatMoney(acerto.owed.igor)}. ` +
        `Karen pagou ${formatMoney(acerto.paid.karen)} e devia ${formatMoney(acerto.owed.karen)}.`),
    ) : null,

    // ── Categorias ─────────────────────────────────────────────────────
    expenses.length ? el('div', { class: 'panel' },
      el('div', { class: 'panel__head' }, el('h3', {}, 'Pra onde foi')),
      el('ul', { class: 'bars' },
        expenses.map(({ category, amount }) => el('li', { class: 'bar' },
          el('div', { class: 'bar__label' },
            el('span', {}, category),
            el('span', { class: 'bar__value' },
              `${formatMoney(amount)} · ${percent(amount, expense)}%`),
          ),
          el('div', { class: 'bar__track' },
            el('div', { class: 'bar__fill', style: { width: `${percent(amount, expense)}%` } })),
        )),
      ),
    ) : null,

    // ── Lançamentos ────────────────────────────────────────────────────
    el('div', { class: 'toolbar' },
      el('div', { class: 'toolbar__filters' },
        ['todos', 'entrada', 'saida', 'fixas'].map((id) => chip(
          { todos: 'Tudo', entrada: 'Entradas', saida: 'Saídas', fixas: 'Fixas' }[id],
          { active: filter === id, onClick: () => { filter = id; ctx.refresh(); } },
        )),
      ),
      button('Novo lançamento', { variant: 'primary', onClick: () => openTxForm(ctx) }),
    ),

    visible.length
      ? el('ul', { class: 'tx-list' }, visible.map((tx) => txRow(ctx, tx)))
      : empty(
          rows.length
            ? 'Nenhum lançamento com esse filtro.'
            : 'Nenhum lançamento nesse mês.',
          button('Lançar o primeiro', { variant: 'primary', onClick: () => openTxForm(ctx) }),
        ),
  );
}

function stat(label, value, tone, note = null) {
  return el('div', { class: `stat stat--${tone}` },
    el('p', { class: 'stat__label' }, label),
    el('p', { class: 'stat__value' }, value),
    note && el('p', { class: 'stat__note' }, note),
  );
}

function progressBar(value) {
  return el('div', { class: 'bar__track bar__track--lg' },
    el('div', { class: 'bar__fill', style: { width: `${value}%` } }));
}

function txRow(ctx, tx) {
  return el('li', { class: `tx tx--${tx.type}` },
    el('div', { class: 'tx__main' },
      el('p', { class: 'tx__title' },
        tx.description,
        tx.recurrence && tag('Fixa'),
      ),
      el('p', { class: 'tx__meta' },
        [
          tx.category,
          formatDate(tx.date),
          tx.type === 'saida' && tx.paidBy
            ? `pago por ${tx.paidBy === 'igor' ? 'Igor' : 'Karen'}`
            : null,
          tx.type === 'saida'
            ? SPLITS.find((s) => s.id === tx.split)?.label.toLowerCase()
            : null,
        ].filter(Boolean).join(' · ')),
    ),
    el('p', { class: 'tx__amount' },
      `${tx.type === 'saida' ? '−' : '+'} ${formatMoney(tx.amount)}`),
    el('button', {
      type: 'button', class: 'icon-btn icon-btn--sm',
      'aria-label': `Editar ${tx.description}`,
      onClick: () => openTxForm(ctx, tx),
    }, '✎'),
  );
}

export function openTxForm(ctx, tx = {}) {
  // Ocorrência calculada de uma conta fixa: editar mexe na série toda.
  const seriesId = tx.seriesId || tx.id;
  const isEdit = Boolean(seriesId);
  const source = tx.virtual ? ctx.store.find('transactions', seriesId) : tx;
  const type = tx.type || 'saida';

  openForm({
    title: isEdit ? 'Editar lançamento' : 'Novo lançamento',
    subtitle: tx.virtual
      ? 'Esta é uma repetição de uma conta fixa — a alteração vale pra série inteira.'
      : null,
    submitLabel: isEdit ? 'Salvar' : 'Lançar',
    values: {
      type,
      description: source?.description || '',
      amount: source?.amount || null,
      date: source?.date || today(),
      category: source?.category || (type === 'saida' ? 'Mercado' : 'Salário'),
      paidBy: source?.paidBy || 'igor',
      split: source?.split || 'meio',
      recurrence: source?.recurrence || '',
      recurrenceUntil: source?.recurrenceUntil || '',
    },
    fields: [
      { name: 'type', label: 'Tipo', type: 'segmented',
        options: [{ id: 'saida', label: 'Saída' }, { id: 'entrada', label: 'Entrada' }],
        onChange: (value) => swapCategories(value) },
      { name: 'description', label: 'Descrição', required: true,
        placeholder: 'Ex.: aluguel, mercado do mês, salário' },
      { name: 'amount', label: 'Valor', type: 'money', required: true, span: 'half' },
      { name: 'date', label: 'Data', type: 'date', required: true, span: 'half' },
      { name: 'category', label: 'Categoria', type: 'select',
        options: type === 'saida' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES },
      { name: 'paidBy', label: 'Quem pagou / recebeu', type: 'segmented',
        options: [{ id: 'igor', label: 'Igor' }, { id: 'karen', label: 'Karen' }] },
      { name: 'split', label: 'De quem é a despesa', type: 'segmented', options: SPLITS,
        hint: 'É isso que calcula o acerto do fim do mês.' },
      { name: 'recurrence', label: 'Repete', type: 'select',
        options: [
          { id: '', label: 'Não repete' },
          { id: 'mensal', label: 'Todo mês' },
          { id: 'anual', label: 'Todo ano' },
        ],
        span: 'half',
        hint: 'Conta fixa: lança uma vez e aparece nos meses seguintes.' },
      { name: 'recurrenceUntil', label: 'Repete até', type: 'date', span: 'half',
        hint: 'Deixe vazio para não ter fim.' },
    ],
    onSubmit: async (values) => {
      if (monthKey(values.date) !== viewMonth) viewMonth = monthKey(values.date);
      if (isEdit) await ctx.store.update('transactions', seriesId, values);
      else await ctx.store.insert('transactions', values);
    },
    onDelete: isEdit ? async () => {
      const isSeries = Boolean(source?.recurrence);
      if (isSeries && !confirmDialog(
        'Isso apaga a conta fixa e todas as repetições dela. Continuar?'
      )) return;
      await ctx.store.remove('transactions', seriesId);
    } : null,
  });
}

// Trocar entrada/saída troca a lista de categorias do select ao lado.
function swapCategories(type) {
  const select = document.querySelector('#f-category');
  if (!select) return;
  const options = type === 'saida' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  select.replaceChildren(
    ...options.map((name) => el('option', { value: name }, name))
  );
}

export const quickAdd = (ctx) => openTxForm(ctx);
