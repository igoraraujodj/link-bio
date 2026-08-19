// Finanças.
//
// Dois modos, uma tela só:
//
// • Integrado — lê a planilha do bot do Telegram (Apps Script). O bot já lê
//   comprovante, deduplica, controla teto de orçamento e avisa no grupo.
//   Aqui é só leitura: quem lança é o bot.
//
// • Local — o protótipo, com lançamento na mão. Vale enquanto a integração
//   não estiver ligada, e continua servindo de plano B.

import { el, frag, section, button, chip, tag, empty, avatar, confirmDialog } from '../ui/dom.js';
import { openForm } from '../ui/modal.js';
import { fromCasa, fromLocal } from '../domain/finance-model.js';
import { ensure, reload, reset, snapshot } from '../domain/financas-store.js';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, SPLITS } from '../store/schema.js';
import { formatMoney, percent } from '../utils/money.js';
import { currentMonth, monthLabel, shiftMonth, today, formatDate, monthKey } from '../utils/date.js';

let viewMonth = currentMonth();
let filter = 'todos';

export function render(ctx) {
  const endpoint = ctx.state.settings.financeUrl;
  const payload = ensure(endpoint);
  const model = payload
    ? fromCasa(payload, viewMonth, ctx.scope)
    : fromLocal(ctx.state, viewMonth, ctx.scope);

  return frag(
    section('Finanças', {
      sub: subtitulo(model),
      action: monthNav(ctx),
    }),

    endpoint ? statusBar(ctx, endpoint) : convite(ctx),

    stats(model),
    model.personal && model.income === null ? avisoRendaPessoal() : null,
    model.settlement ? acerto(model.settlement) : null,
    model.categories.length ? categorias(model) : null,
    model.fixed.length ? fixos(model) : null,
    Object.keys(model.byPerson).length ? porPessoa(model) : null,

    lista(ctx, model),
  );
}

function nomeDo(scope) {
  return scope === 'igor' ? 'Igor' : scope === 'karen' ? 'Karen' : null;
}

function subtitulo(model) {
  if (model.source !== 'casa') return 'Entradas, saídas e o acerto entre vocês.';
  const nome = nomeDo(model.scope);
  return nome
    ? `O que ${nome} pagou neste mês. Contas fixas e orçamento são da casa e ficam em "Os dois".`
    : 'Os números vêm da planilha do bot. Para lançar, mande o comprovante no Telegram.';
}

// Só aparece com a ponte antiga, que soma as duas rendas antes de entregar.
function avisoRendaPessoal() {
  return el('div', { class: 'panel panel--warn' },
    el('p', { class: 'panel__note' },
      'A renda por pessoa ainda não chega até aqui: a versão atual da ponte ' +
      'soma as duas antes de enviar. Trocar o código da ponte pela versão nova ' +
      '(integracao/ApiSeparada.gs.txt) destrava isso — nada mais muda.'),
  );
}

// ── Carregamento ─────────────────────────────────────────────────────────

function statusBar(ctx, endpoint) {
  const { status, error, payload, at } = snapshot();

  if (status === 'loading' && !payload) {
    return el('p', { class: 'sync' }, 'Buscando os números na planilha…');
  }

  if (status === 'error') {
    return el('div', { class: 'panel panel--danger' },
      el('div', { class: 'panel__head' }, el('h3', {}, 'Não consegui ler a planilha')),
      el('p', { class: 'panel__note' }, error),
      payload ? el('p', { class: 'panel__note' }, 'Mostrando a última leitura que deu certo.') : null,
      el('div', { class: 'panel__actions' },
        button('Tentar de novo', { variant: 'primary', onClick: () => reload(endpoint) }),
      ),
    );
  }

  return el('p', { class: 'sync' },
    el('span', {},
      at
        ? `Atualizado às ${at.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
        : 'Conectado à planilha'),
    el('button', {
      type: 'button', class: 'link-btn', onClick: () => reload(endpoint),
    }, status === 'loading' ? 'atualizando…' : 'atualizar'),
  );
}

function convite(ctx) {
  return el('div', { class: 'panel panel--warn' },
    el('div', { class: 'panel__head' }, el('h3', {}, 'Ligar o bot do Telegram')),
    el('p', { class: 'panel__note' },
      'Você já tem um sistema que lê comprovante e lança sozinho na planilha. ' +
      'Esta tela pode mostrar aqueles números, em vez de você digitar duas vezes.'),
    el('div', { class: 'panel__actions' },
      button('Como ligar', { onClick: () => ctx.go('ajustes') }),
    ),
  );
}

// ── Blocos ───────────────────────────────────────────────────────────────

function monthNav(ctx) {
  return el('div', { class: 'month-nav' },
    el('button', {
      type: 'button', class: 'icon-btn', 'aria-label': 'Mês anterior',
      onClick: () => { viewMonth = shiftMonth(viewMonth, -1); ctx.refresh(); },
    }, '‹'),
    el('strong', { class: 'month-nav__label' }, monthLabel(viewMonth)),
    el('button', {
      type: 'button', class: 'icon-btn', 'aria-label': 'Próximo mês',
      onClick: () => { viewMonth = shiftMonth(viewMonth, 1); ctx.refresh(); },
    }, '›'),
  );
}

function stats(model) {
  const nome = nomeDo(model.scope);
  return el('div', { class: 'stats' }, [
    model.income !== null && model.income
      ? stat(nome ? `Renda de ${nome}` : 'Renda', formatMoney(model.income), 'up')
      : null,
    model.committed
      ? stat('Comprometido', formatMoney(model.committed), 'down', 'Contas fixas da casa')
      : null,
    stat(nome ? `Pago por ${nome}` : 'Saiu', formatMoney(model.expense), 'down',
      `${model.rows.length} lançamento(s)`),
    model.balance !== null
      ? stat('Sobra', formatMoney(model.balance), model.balance >= 0 ? 'up' : 'down',
          model.personal ? 'Sem contar as contas fixas da casa' : null)
      : null,
  ].filter(Boolean));
}

function stat(label, value, tone, note = null) {
  return el('div', { class: `stat stat--${tone}` },
    el('p', { class: 'stat__label' }, label),
    el('p', { class: 'stat__value' }, value),
    note && el('p', { class: 'stat__note' }, note),
  );
}

function acerto(s) {
  return el('div', { class: 'panel panel--accent' },
    el('div', { class: 'panel__head' }, el('h3', {}, 'Acerto do mês')),
    el('p', { class: 'settle' },
      avatar(s.from), ' ',
      el('strong', {}, s.from === 'igor' ? 'Igor' : 'Karen'),
      ' deve ',
      el('strong', { class: 'settle__amount' }, formatMoney(s.amount)),
      ' pra ',
      el('strong', {}, s.to === 'igor' ? 'Igor' : 'Karen'),
    ),
    s.partial
      ? el('p', { class: 'panel__note' },
          `Considerando só os lançamentos com rateio definido — ${s.partial} ainda sem.`)
      : null,
  );
}

function categorias(model) {
  const maior = Math.max(...model.categories.map((c) => c.amount), 1);

  return el('div', { class: 'panel' },
    el('div', { class: 'panel__head' }, el('h3', {}, 'Pra onde foi')),
    el('ul', { class: 'bars' },
      model.categories.map(({ category, amount, budget }) => {
        const pct = budget ? percent(amount, budget) : percent(amount, maior);
        const estourou = budget && amount > budget;
        const perto = budget && !estourou && pct >= 80;

        return el('li', { class: 'bar' },
          el('div', { class: 'bar__label' },
            el('span', {}, `${category}${estourou ? ' 🚨' : perto ? ' ⚠️' : ''}`),
            el('span', { class: 'bar__value' },
              budget
                ? `${formatMoney(amount)} de ${formatMoney(budget)}`
                : formatMoney(amount)),
          ),
          el('div', { class: 'bar__track' },
            el('div', {
              class: `bar__fill${estourou ? ' bar__fill--over' : perto ? ' bar__fill--warn' : ''}`,
              style: { width: `${Math.min(100, pct)}%` },
            })),
        );
      }),
    ),
  );
}

function fixos(model) {
  return el('details', { class: 'panel' },
    el('summary', { class: 'panel__summary' },
      `Contas fixas do mês · ${formatMoney(model.committed)}`),
    el('ul', { class: 'tx-list' },
      model.fixed.map((c) => el('li', { class: 'tx' },
        el('div', { class: 'tx__main' },
          el('p', { class: 'tx__title' }, c.name),
          el('p', { class: 'tx__meta' }, [c.group, c.category].filter(Boolean).join(' · ')),
        ),
        el('p', { class: 'tx__amount' }, formatMoney(c.amount)),
      )),
    ),
    el('p', { class: 'panel__note' },
      'Vem da aba fixos da planilha. São medianas do ano, não o último mês.'),
  );
}

function porPessoa(model) {
  const total = Object.values(model.byPerson).reduce((a, b) => a + b, 0) || 1;

  return el('div', { class: 'panel' },
    el('div', { class: 'panel__head' }, el('h3', {}, 'Quem pagou')),
    el('ul', { class: 'bars' },
      Object.entries(model.byPerson)
        .sort((a, b) => b[1] - a[1])
        .map(([nome, valor]) => el('li', { class: 'bar' },
          el('div', { class: 'bar__label' },
            el('span', {}, nome),
            el('span', { class: 'bar__value' },
              `${formatMoney(valor)} · ${percent(valor, total)}%`),
          ),
          el('div', { class: 'bar__track' },
            el('div', { class: 'bar__fill', style: { width: `${percent(valor, total)}%` } })),
        )),
    ),
    !model.settlement
      ? el('p', { class: 'panel__note' },
          'Para calcular quem deve pra quem falta a coluna de rateio na planilha — ' +
          'o passo a passo está em integracao/Api.gs.txt.')
      : null,
  );
}

function lista(ctx, model) {
  const remoto = model.source === 'casa';

  const visible = remoto
    ? model.rows
    : model.rows.filter((row) =>
        filter === 'todos' ? true :
        filter === 'fixas' ? Boolean(row.recurrence) :
        row.type === filter);

  return frag(
    el('div', { class: 'toolbar' },
      remoto
        ? el('h3', { class: 'panel__title' },
            nomeDo(model.scope) ? `Pagos por ${nomeDo(model.scope)}` : 'Lançamentos do mês')
        : el('div', { class: 'toolbar__filters' },
            ['todos', 'entrada', 'saida', 'fixas'].map((id) => chip(
              { todos: 'Tudo', entrada: 'Entradas', saida: 'Saídas', fixas: 'Fixas' }[id],
              { active: filter === id, onClick: () => { filter = id; ctx.refresh(); } },
            ))),
      remoto ? null : button('Novo lançamento', { variant: 'primary', onClick: () => openTxForm(ctx) }),
    ),

    visible.length
      ? el('ul', { class: 'tx-list' },
          visible.map((row) => (remoto ? linhaCasa(row) : linhaLocal(ctx, row))))
      : empty(
          remoto
            ? (nomeDo(model.scope)
                ? `${nomeDo(model.scope)} não pagou nada neste mês.`
                : 'Nenhum lançamento nesse mês. Mande um comprovante no Telegram.')
            : 'Nenhum lançamento nesse mês.',
          remoto ? null : button('Lançar o primeiro', {
            variant: 'primary', onClick: () => openTxForm(ctx),
          }),
        ),
  );
}

function linhaCasa(row) {
  return el('li', { class: 'tx tx--saida' },
    el('div', { class: 'tx__main' },
      el('p', { class: 'tx__title' },
        row.description,
        row.split ? tag(row.split === 'meio' ? '½' : `só ${row.split}`) : null,
      ),
      el('p', { class: 'tx__meta' },
        [row.category, formatDate(row.date), row.method, row.paidByLabel && `por ${row.paidByLabel}`]
          .filter(Boolean).join(' · ')),
    ),
    el('p', { class: 'tx__amount' }, `− ${formatMoney(row.amount)}`),
    // O link volta pra mensagem original no Telegram, onde está a foto do
    // comprovante. É o "anexar comprovante" de graça.
    row.link
      ? el('a', {
          class: 'icon-btn icon-btn--sm', href: row.link, target: '_blank',
          rel: 'noopener', 'aria-label': `Ver o comprovante de ${row.description}`,
        }, '↗')
      : null,
  );
}

function linhaLocal(ctx, row) {
  const tx = row.raw;
  return el('li', { class: `tx tx--${tx.type}` },
    el('div', { class: 'tx__main' },
      el('p', { class: 'tx__title' }, tx.description, tx.recurrence && tag('Fixa')),
      el('p', { class: 'tx__meta' },
        [
          tx.category,
          formatDate(tx.date),
          tx.type === 'saida' && tx.paidBy ? `pago por ${tx.paidBy === 'igor' ? 'Igor' : 'Karen'}` : null,
          tx.type === 'saida' ? SPLITS.find((s) => s.id === tx.split)?.label.toLowerCase() : null,
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

// ── Formulário (só no modo local) ────────────────────────────────────────

export function openTxForm(ctx, tx = {}) {
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
        span: 'half' },
      { name: 'recurrenceUntil', label: 'Repete até', type: 'date', span: 'half',
        hint: 'Deixe vazio para não ter fim.' },
    ],
    onSubmit: async (values) => {
      if (monthKey(values.date) !== viewMonth) viewMonth = monthKey(values.date);
      if (isEdit) await ctx.store.update('transactions', seriesId, values);
      else await ctx.store.insert('transactions', values);
    },
    onDelete: isEdit ? async () => {
      if (source?.recurrence && !confirmDialog(
        'Isso apaga a conta fixa e todas as repetições dela. Continuar?'
      )) return;
      await ctx.store.remove('transactions', seriesId);
    } : null,
  });
}

function swapCategories(type) {
  const select = document.querySelector('#f-category');
  if (!select) return;
  const options = type === 'saida' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  select.replaceChildren(...options.map((name) => el('option', { value: name }, name)));
}

// No modo integrado quem lança é o bot, então o botão flutuante some em vez
// de abrir um formulário que gravaria num lugar que ninguém lê.
export const canQuickAdd = (ctx) => !ctx.state.settings.financeUrl;
export const quickAdd = (ctx) => openTxForm(ctx);

// Chamado por Ajustes ao salvar ou remover o link, para a tela recarregar.
export function resetRemote() {
  reset();
}
