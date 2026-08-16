// ─────────────────────────────────────────────────────────────────────────
// ESTE ARQUIVO NÃO RODA. É o mapa da virada de localStorage para Supabase.
//
// Hoje o sistema é um protótipo: o dado vive no navegador de quem abriu.
// Igor não vê a agenda da Karen. Pra virar "sistema do casal" de verdade,
// só este arquivo entra no lugar de adapter-local.js — nenhuma view muda.
//
// PASSO A PASSO
//
// 1. Crie um projeto em supabase.com (plano free serve de sobra).
//
// 2. No SQL Editor, crie uma tabela por coleção. Exemplo com eventos:
//
//      create table events (
//        id          uuid primary key default gen_random_uuid(),
//        home_id     uuid not null references homes(id),
//        scope       text not null,        -- 'igor' | 'karen' | 'nos'
//        title       text not null,
//        date        date not null,
//        time        text,
//        end_time    text,
//        category    text,
//        note        text,
//        created_at  timestamptz default now(),
//        updated_at  timestamptz default now()
//      );
//
//    A tabela `homes` é o truque que faz o compartilhamento funcionar:
//    uma linha só, com os dois usuários apontando pra ela. Todo registro
//    carrega `home_id`.
//
// 3. Ligue Row Level Security em cada tabela, com a mesma política:
//
//      alter table events enable row level security;
//
//      create policy "casal lê e escreve a própria casa" on events
//        for all using (
//          home_id in (select home_id from memberships where user_id = auth.uid())
//        );
//
//    Sem isso, qualquer um com a chave anon lê tudo. Com isso, a chave anon
//    pode ir pro repositório sem problema — é feita pra ser pública.
//
// 4. Auth: e-mail + magic link. Dois usuários, um `memberships` cada.
//
// 5. Troque a linha em js/app.js:
//
//      import { createLocalAdapter } from './store/adapter-local.js';
//      const adapter = createLocalAdapter();
//    →
//      import { createSupabaseAdapter } from './store/adapter-supabase.js';
//      const adapter = createSupabaseAdapter({ url, anonKey, homeId });
//
// ─────────────────────────────────────────────────────────────────────────

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { COLLECTIONS } from './schema.js';

export function createSupabaseAdapter({ url, anonKey, homeId }) {
  const db = createClient(url, anonKey);

  return {
    name: 'supabase',

    // Puxa todas as coleções de uma vez e remonta o mesmo formato de estado
    // que as views já consomem.
    async load() {
      const results = await Promise.all(
        COLLECTIONS.map((table) =>
          db.from(table).select('*').eq('home_id', homeId)
        )
      );
      const state = { version: 1, settings: {} };
      COLLECTIONS.forEach((table, i) => {
        if (results[i].error) throw results[i].error;
        state[table] = results[i].data.map(fromRow);
      });
      return state;
    },

    // Diferente do localStorage, aqui NÃO se grava o estado inteiro a cada
    // mudança. O store precisaria ganhar um caminho por operação
    // (insert/update/remove viram upsert/delete numa tabela só).
    // É a única mudança real fora deste arquivo — umas 20 linhas em
    // store/index.js, atrás de `if (adapter.supportsGranularWrites)`.
    async save() {
      throw new Error('Use as escritas granulares: upsert(table, row).');
    },

    async upsert(table, row) {
      const { error } = await db
        .from(table)
        .upsert({ ...toRow(row), home_id: homeId });
      if (error) throw error;
    },

    async delete(table, id) {
      const { error } = await db.from(table).delete().eq('id', id);
      if (error) throw error;
    },

    // Aqui mora o ganho de verdade: o que a Karen digita no celular dela
    // aparece na tela do Igor sem ninguém apertar nada.
    subscribe(fn) {
      const channel = db.channel(`home:${homeId}`);
      for (const table of COLLECTIONS) {
        channel.on(
          'postgres_changes',
          { event: '*', schema: 'public', table, filter: `home_id=eq.${homeId}` },
          () => fn(null) // sinal de "mudou"; o store recarrega
        );
      }
      channel.subscribe();
      return () => db.removeChannel(channel);
    },
  };
}

const toRow = ({ startDate, dueDate, endTime, createdAt, updatedAt, ...rest }) => ({
  ...rest,
  start_date: startDate,
  due_date: dueDate,
  end_time: endTime,
  created_at: createdAt,
  updated_at: updatedAt,
});

const fromRow = ({ start_date, due_date, end_time, created_at, updated_at, home_id, ...rest }) => ({
  ...rest,
  startDate: start_date,
  dueDate: due_date,
  endTime: end_time,
  createdAt: created_at,
  updatedAt: updated_at,
});
