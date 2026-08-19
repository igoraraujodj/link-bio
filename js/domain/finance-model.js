// Um modelo só de finanças, duas origens possíveis.
//
// A tela não sabe se os números vieram da planilha do bot ou do storage
// local. Isso é o que evita manter duas telas quase iguais — e é o que
// permite ligar e desligar a integração sem tocar na view.

import { monthTotals, byCategory, settlement, transactionsInMonth } from './queries.js';

// A planilha guarda reais com decimais; o app trabalha em centavos.
// A conversão acontece só aqui, na fronteira.
const toCents = (reais) => Math.round((Number(reais) || 0) * 100);

const PESSOA = { igor: 'Igor', karen: 'Karen' };

// Casa o nome que veio do Telegram (msg.from.first_name) com igor/karen.
// Qualquer outro nome fica de fora do acerto, sem sumir dos totais.
function quemPara(nome) {
  const limpo = String(nome || '').trim().toLowerCase();
  if (limpo.startsWith('igor')) return 'igor';
  if (limpo.startsWith('karen')) return 'karen';
  return null;
}

/**
 * Modelo a partir do payload do Apps Script.
 *
 * `scope` é o seletor Igor / Karen / Os dois. Em finanças ele filtra pelo
 * QUEM PAGOU, que é o único sinal de pessoa que a planilha tem hoje. Não é
 * o mesmo que "de quem é a despesa" — por isso os rótulos dizem "pago por"
 * e não "gastos de", e o acerto do mês só aparece no escopo dos dois.
 */
export function fromCasa(payload, monthKey, scope = 'nos') {
  const todas = (payload.lancamentos || [])
    .filter((l) => String(l.d || '').slice(0, 7) === monthKey)
    .map((l) => ({
      id: `${l.d}|${l.v}|${l.e || l.t}`,
      date: l.d,
      amount: toCents(l.v),
      category: l.c || 'Outros',
      description: l.t || l.e || 'Sem descrição',
      merchant: l.e || '',
      method: l.m || '',
      paidBy: quemPara(l.q),
      paidByLabel: l.q || '',
      split: l.r || null,
      link: l.l || '',
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const pessoal = scope === 'igor' || scope === 'karen';
  const rows = pessoal ? todas.filter((r) => r.paidBy === scope) : todas;

  const expense = rows.reduce((total, row) => total + row.amount, 0);

  const fixos = payload.fixos || { contas: [], renda: 0, fixo: 0 };

  // A ponte v2 devolve a renda separada por pessoa. Na v1 ela vinha só
  // somada — aí o escopo pessoal fica sem renda em vez de mostrar a do
  // casal como se fosse de um só.
  const porPessoa = fixos.rendaPorPessoa || null;
  const income = pessoal
    ? (porPessoa ? toCents(porPessoa[scope] || 0) : null)
    : toCents(fixos.renda);

  // Contas fixas não têm dono na planilha: são da casa. Mostrar o valor
  // cheio dentro do campo de uma pessoa faria parecer que é dela.
  const committed = pessoal ? null : toCents(fixos.fixo);

  const budgets = {};
  for (const [cat, valor] of Object.entries(payload.orcamento || {})) {
    budgets[cat] = toCents(valor);
  }

  const porCategoria = new Map();
  const byPerson = {};
  for (const row of todas) {
    const label = row.paidByLabel || 'não informado';
    byPerson[label] = (byPerson[label] || 0) + row.amount;
  }
  for (const row of rows) {
    porCategoria.set(row.category, (porCategoria.get(row.category) || 0) + row.amount);
  }

  const categories = [...porCategoria.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      // Teto de orçamento é da casa. Comparar o gasto de uma pessoa com o
      // teto do casal acusaria estouro que não existe.
      budget: pessoal ? null : (budgets[category] || null),
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    source: 'casa',
    scope,
    personal: pessoal,
    month: monthKey,
    income,
    expense,
    committed,
    balance: income === null ? null : income - (committed || 0) - expense,
    rows,
    categories,
    byPerson: pessoal ? {} : byPerson,
    fixed: pessoal ? [] : (fixos.contas || []).map((c) => ({
      name: c.nome, group: c.grupo, category: c.categoria, amount: toCents(c.valor),
    })),
    // Sem rateio não dá para dizer quem deve a quem, e o acerto é uma
    // conta do casal — não faz sentido dentro do campo de uma pessoa.
    settlement: pessoal ? null : acertoCasa(todas),
    availableCategories: payload.categorias || [],
    today: payload.hoje || null,
  };
}

// Só calcula o acerto quando a planilha já tem a coluna de rateio. Chutar
// meio a meio em tudo produziria um número errado com cara de certo.
function acertoCasa(rows) {
  const comRateio = rows.filter((r) => r.split && r.paidBy);
  if (!comRateio.length) return null;

  const pago = { igor: 0, karen: 0 };
  const devido = { igor: 0, karen: 0 };

  for (const row of comRateio) {
    pago[row.paidBy] += row.amount;
    if (row.split === 'meio') {
      devido.igor += row.amount / 2;
      devido.karen += row.amount / 2;
    } else if (devido[row.split] !== undefined) {
      devido[row.split] += row.amount;
    }
  }

  const diff = Math.round(pago.igor - devido.igor);
  if (!diff) return null;
  return {
    from: diff > 0 ? 'karen' : 'igor',
    to: diff > 0 ? 'igor' : 'karen',
    amount: Math.abs(diff),
    partial: comRateio.length < rows.length ? rows.length - comRateio.length : 0,
  };
}

/** Modelo a partir do storage local (modo protótipo, sem integração). */
export function fromLocal(state, monthKey, scope = 'nos') {
  const { rows, income, expense, balance } = monthTotals(state, monthKey);
  const acerto = settlement(rows);

  return {
    source: 'local',
    scope,
    personal: false,
    month: monthKey,
    income,
    expense,
    committed: 0,
    balance,
    rows: rows.map((tx) => ({
      id: tx.id,
      date: tx.date,
      amount: tx.amount,
      category: tx.category,
      description: tx.description,
      merchant: '',
      method: '',
      paidBy: tx.paidBy,
      paidByLabel: PESSOA[tx.paidBy] || '',
      split: tx.split,
      link: '',
      type: tx.type,
      recurrence: tx.recurrence,
      raw: tx,
    })),
    categories: byCategory(rows, 'saida')
      .map(({ category, amount }) => ({ category, amount, budget: null })),
    byPerson: {},
    fixed: [],
    settlement: acerto.amount ? acerto : null,
    availableCategories: [],
    today: null,
  };
}

export { transactionsInMonth };
