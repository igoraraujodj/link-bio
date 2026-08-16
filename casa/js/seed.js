// Dados de EXEMPLO, explicitamente fictícios.
//
// Servem pra ver as telas cheias antes de digitar a vida real. Nada aqui
// é um valor, uma conta ou um compromisso de verdade de ninguém — o botão
// que carrega isso avisa, e Ajustes apaga tudo.

import { uid } from './store/index.js';
import { today, addDays, currentMonth } from './utils/date.js';

export function sampleState() {
  const d = (offset) => addDays(today(), offset);
  const stamp = () => {
    const now = new Date().toISOString();
    return { id: uid(), createdAt: now, updatedAt: now };
  };

  return {
    version: 1,
    settings: { theme: 'auto', scope: 'nos', monthlyTarget: 120000 },

    events: [
      { ...stamp(), scope: 'karen', title: 'Dentista', date: d(0), time: '09:30',
        category: 'Saúde', note: 'Levar o encaminhamento.' },
      { ...stamp(), scope: 'igor', title: 'Reunião de projeto', date: d(0), time: '14:00',
        endTime: '15:00', category: 'Trabalho', note: null },
      { ...stamp(), scope: 'nos', title: 'Jantar com a família', date: d(2), time: '20:00',
        category: 'Lazer', note: null },
      { ...stamp(), scope: 'nos', title: 'Vencimento do aluguel', date: d(5),
        category: 'Financeiro', note: null },
      { ...stamp(), scope: 'karen', title: 'Aula de inglês', date: d(6), time: '19:00',
        category: 'Compromisso', note: null },
    ],

    tasks: [
      { ...stamp(), scope: 'igor', title: 'Renovar o seguro do carro',
        description: 'Cotar em três seguradoras antes de fechar.',
        status: 'andamento', priority: 'alta', startDate: d(-3), dueDate: d(2) },
      { ...stamp(), scope: 'karen', title: 'Agendar check-up',
        description: null, status: 'proxima', priority: 'media',
        startDate: null, dueDate: d(9) },
      { ...stamp(), scope: 'nos', title: 'Trocar a resistência do chuveiro',
        description: 'Comprar a peça de 220V.',
        status: 'backlog', priority: 'baixa', startDate: null, dueDate: null },
      { ...stamp(), scope: 'igor', title: 'Declarar o imposto',
        description: null, status: 'concluida', priority: 'alta',
        startDate: d(-20), dueDate: d(-6), completedAt: d(-7) },
      { ...stamp(), scope: 'nos', title: 'Pesquisar passagens pro fim do ano',
        description: 'Comparar saída de Guarulhos e de Viracopos.',
        status: 'proxima', priority: 'media', startDate: null, dueDate: d(14) },
    ],

    transactions: [
      { ...stamp(), type: 'entrada', description: 'Salário Igor', amount: 620000,
        date: `${currentMonth()}-05`, category: 'Salário', paidBy: 'igor',
        split: 'meio', recurrence: 'mensal', recurrenceUntil: null },
      { ...stamp(), type: 'entrada', description: 'Salário Karen', amount: 580000,
        date: `${currentMonth()}-05`, category: 'Salário', paidBy: 'karen',
        split: 'meio', recurrence: 'mensal', recurrenceUntil: null },
      { ...stamp(), type: 'saida', description: 'Aluguel', amount: 250000,
        date: `${currentMonth()}-05`, category: 'Moradia', paidBy: 'igor',
        split: 'meio', recurrence: 'mensal', recurrenceUntil: null },
      { ...stamp(), type: 'saida', description: 'Mercado do mês', amount: 98000,
        date: d(-4), category: 'Mercado', paidBy: 'karen', split: 'meio',
        recurrence: null, recurrenceUntil: null },
      { ...stamp(), type: 'saida', description: 'Internet', amount: 12990,
        date: `${currentMonth()}-10`, category: 'Moradia', paidBy: 'igor',
        split: 'meio', recurrence: 'mensal', recurrenceUntil: null },
      { ...stamp(), type: 'saida', description: 'Academia da Karen', amount: 14900,
        date: `${currentMonth()}-08`, category: 'Saúde', paidBy: 'karen',
        split: 'karen', recurrence: 'mensal', recurrenceUntil: null },
      { ...stamp(), type: 'saida', description: 'Cinema', amount: 9600,
        date: d(-2), category: 'Lazer', paidBy: 'igor', split: 'meio',
        recurrence: null, recurrenceUntil: null },
    ],

    goals: [
      { ...stamp(), title: 'Reserva de emergência', scope: 'nos',
        description: 'Seis meses de custo fixo guardados.',
        status: 'andamento', progress: 45, amount: 3000000, targetDate: null },
      { ...stamp(), title: 'Viagem no fim do ano', scope: 'nos',
        description: 'Duas semanas, passagem e hospedagem.',
        status: 'andamento', progress: 20, amount: 800000, targetDate: `${new Date().getFullYear()}-12-15` },
      { ...stamp(), title: 'Trocar o sofá', scope: 'nos', description: null,
        status: 'ideia', progress: 0, amount: 350000, targetDate: null },
      { ...stamp(), title: 'Quitar o cartão', scope: 'nos', description: null,
        status: 'concluida', progress: 100, amount: null, targetDate: null },
    ],

    shopping: [
      { ...stamp(), title: 'Café', list: 'mercado', done: false, addedBy: 'karen' },
      { ...stamp(), title: 'Detergente', list: 'mercado', done: false, addedBy: 'igor' },
      { ...stamp(), title: 'Arroz', list: 'mercado', done: true, addedBy: 'karen' },
      { ...stamp(), title: 'Lâmpada da cozinha', list: 'casa', done: false, addedBy: 'igor' },
    ],

    habits: [
      { ...stamp(), title: 'Academia', scope: 'igor',
        checks: { [d(-1)]: true, [d(-2)]: true, [d(-4)]: true } },
      { ...stamp(), title: 'Leitura', scope: 'karen',
        checks: { [d(0)]: true, [d(-1)]: true, [d(-2)]: true, [d(-3)]: true } },
      { ...stamp(), title: 'Caminhada juntos', scope: 'nos',
        checks: { [d(-2)]: true, [d(-5)]: true } },
    ],

    memories: [],
  };
}
