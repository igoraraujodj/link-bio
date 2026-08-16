// Forma dos dados do sistema.
//
// Este arquivo é a fonte da verdade do modelo. Quando o Supabase entrar,
// cada coleção aqui vira uma tabela com as mesmas colunas — os nomes foram
// escolhidos pensando nisso (snake_case seria o único ajuste).

export const VERSION = 1;

export const PEOPLE = [
  { id: 'igor', name: 'Igor', short: 'I' },
  { id: 'karen', name: 'Karen', short: 'K' },
];

// 'nos' não é uma pessoa: é o escopo compartilhado. Vale como dono de um
// evento ("jantar dos dois"), de uma tarefa ("ligar pro encanador") e é o
// escopo padrão de finanças, metas, compras e memórias.
export const SCOPES = ['igor', 'karen', 'nos'];

export const TASK_STATUS = [
  { id: 'backlog', label: 'Backlog', hint: 'Anotado, sem data pra começar' },
  { id: 'proxima', label: 'Próxima', hint: 'É a próxima da fila' },
  { id: 'andamento', label: 'Em andamento', hint: 'Rolando agora' },
  { id: 'concluida', label: 'Concluída', hint: 'Encerrada' },
];

export const GOAL_STATUS = [
  { id: 'ideia', label: 'Ideia' },
  { id: 'andamento', label: 'Em andamento' },
  { id: 'concluida', label: 'Concluída' },
];

export const PRIORITIES = [
  { id: 'baixa', label: 'Baixa' },
  { id: 'media', label: 'Média' },
  { id: 'alta', label: 'Alta' },
];

export const EVENT_CATEGORIES = [
  'Compromisso', 'Trabalho', 'Saúde', 'Casa', 'Lazer', 'Financeiro', 'Viagem',
];

export const EXPENSE_CATEGORIES = [
  'Moradia', 'Mercado', 'Transporte', 'Saúde', 'Lazer', 'Assinaturas',
  'Educação', 'Pets', 'Presentes', 'Outros',
];

export const INCOME_CATEGORIES = ['Salário', 'Freela', 'Rendimento', 'Outros'];

// Quem absorve a despesa, independente de quem pagou.
export const SPLITS = [
  { id: 'meio', label: 'Meio a meio' },
  { id: 'igor', label: 'Só Igor' },
  { id: 'karen', label: 'Só Karen' },
];

export const SHOPPING_LISTS = [
  { id: 'mercado', label: 'Mercado' },
  { id: 'casa', label: 'Casa' },
  { id: 'farmacia', label: 'Farmácia' },
];

export const COLLECTIONS = [
  'events', 'tasks', 'transactions', 'goals', 'shopping', 'habits', 'memories',
];

export function emptyState() {
  return {
    version: VERSION,
    events: [],
    tasks: [],
    transactions: [],
    goals: [],
    shopping: [],
    habits: [],
    memories: [],
    settings: {
      theme: 'auto',
      scope: 'nos',
      // Reserva mensal que o casal quer guardar. Alimenta o painel de finanças.
      monthlyTarget: null,
    },
  };
}

// Migrações futuras entram aqui. Cada função sobe uma versão.
const MIGRATIONS = {
  // 1: (state) => { ...; state.version = 2; return state; },
};

export function migrate(state) {
  let out = { ...emptyState(), ...state };
  while (MIGRATIONS[out.version]) out = MIGRATIONS[out.version](out);
  out.settings = { ...emptyState().settings, ...(out.settings || {}) };
  for (const key of COLLECTIONS) {
    if (!Array.isArray(out[key])) out[key] = [];
  }
  return out;
}
