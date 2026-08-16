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

/** Modelo a partir do payload do Apps Script. */
export function fromCasa(payload, monthKey) {
  const rows = (payload.lancamentos || [])
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
      // `r` só existe depois que a coluna de rateio for criada na planilha.
      split: l.r || null,
      link: l.l || '',
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const expense = rows.reduce((total, row) => total + row.amount, 0);

  const fixos = payload.fixos || { contas: [], renda: 0, fixo: 0 };
  const income = toCents(fixos.renda);
  const committed = toCents(fixos.fixo);

  // Teto por categoria vem da aba `orcamento`.
  const budgets = {};
  for (const [cat, valor] of Object.entries(payload.orcamento || {})) {
    budgets[cat] = toCents(valor);
  }

  const porCategoria = new Map();
  const porPessoa = {};
  for (const row of rows) {
    porCategoria.set(row.category, (porCategoria.get(row.category) || 0) + row.amount);
    const label = row.paidByLabel || 'não informado';
    porPessoa[label] = (porPessoa[label] || 0) + row.amount;
  }

  const categories = [...porCategoria.entries()]
    .map(([category, amount]) => ({ category, amount, budget: budgets[category] || null }))
    .sort((a, b) => b.amount - a.amount);

  return {
    source: 'casa',
    month: monthKey,
    income,
    expense,
    committed,
    // O que sobra depois do que já está comprometido e do que já saiu.
    balance: income - committed - expense,
    rows,
    categories,
    byPerson: porPessoa,
    fixed: (fixos.contas || []).map((c) => ({
      name: c.nome, group: c.grupo, category: c.categoria, amount: toCents(c.valor),
    })),
    settlement: acertoCasa(rows),
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
export function fromLocal(state, monthKey) {
  const { rows, income, expense, balance } = monthTotals(state, monthKey);
  const acerto = settlement(rows);

  return {
    source: 'local',
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
