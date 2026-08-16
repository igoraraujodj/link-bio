// Dinheiro é guardado em centavos (inteiro). Ponto flutuante em finanças
// gera 0.1 + 0.2 = 0.30000000000000004, e isso vira erro de saldo.

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const formatMoney = (cents) => BRL.format((cents || 0) / 100);

// Compacto pros cards: R$ 3,2 mil
export function formatMoneyShort(cents) {
  const value = Math.abs((cents || 0) / 100);
  const sign = cents < 0 ? '-' : '';
  if (value >= 1000000) return `${sign}R$ ${(value / 1000000).toFixed(1).replace('.', ',')} mi`;
  if (value >= 10000) return `${sign}R$ ${(value / 1000).toFixed(1).replace('.', ',')} mil`;
  return formatMoney(cents);
}

// Aceita '1.234,56', '1234.56', 'R$ 89,90' e devolve centavos.
export function parseMoney(input) {
  if (typeof input === 'number') return Math.round(input * 100);
  if (!input) return 0;

  let text = String(input).replace(/[^\d,.-]/g, '').trim();
  if (!text) return 0;

  const lastComma = text.lastIndexOf(',');
  const lastDot = text.lastIndexOf('.');

  if (lastComma > lastDot) {
    // Padrão brasileiro: ponto é milhar, vírgula é decimal.
    text = text.replace(/\./g, '').replace(',', '.');
  } else if (lastDot > lastComma) {
    text = text.replace(/,/g, '');
  }

  const value = Number.parseFloat(text);
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

export const percent = (part, whole) =>
  whole > 0 ? Math.round((part / whole) * 100) : 0;
