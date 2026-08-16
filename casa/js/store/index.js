// Store da aplicação.
//
// Nenhuma view toca em localStorage nem em rede. Todo mundo passa por aqui.
// É isso que faz a troca pro Supabase ser um arquivo só.

import { migrate, emptyState, COLLECTIONS } from './schema.js';

export function createStore(adapter) {
  let state = emptyState();
  let ready = false;
  const listeners = new Set();

  function notify() {
    for (const fn of listeners) fn(state);
  }

  async function persist() {
    notify();                 // pinta a tela antes de gravar: parece instantâneo
    await adapter.save(state);
  }

  return {
    get adapterName() { return adapter.name; },
    get ready() { return ready; },

    async init() {
      const loaded = await adapter.load();
      state = migrate(loaded || {});
      ready = true;

      // Mudou em outra aba: reflete sem recarregar.
      adapter.subscribe?.((incoming) => {
        state = migrate(incoming);
        notify();
      });

      notify();
      return state;
    },

    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    getState() { return state; },

    all(collection) {
      return state[collection] || [];
    },

    find(collection, id) {
      return (state[collection] || []).find((item) => item.id === id) || null;
    },

    async insert(collection, record) {
      const now = new Date().toISOString();
      const item = { id: uid(), createdAt: now, updatedAt: now, ...record };
      state = { ...state, [collection]: [...state[collection], item] };
      await persist();
      return item;
    },

    async update(collection, id, patch) {
      state = {
        ...state,
        [collection]: state[collection].map((item) =>
          item.id === id
            ? { ...item, ...patch, updatedAt: new Date().toISOString() }
            : item
        ),
      };
      await persist();
      return this.find(collection, id);
    },

    async remove(collection, id) {
      state = {
        ...state,
        [collection]: state[collection].filter((item) => item.id !== id),
      };
      await persist();
    },

    async setSetting(key, value) {
      state = { ...state, settings: { ...state.settings, [key]: value } };
      await persist();
    },

    // Substitui o estado inteiro. Usado por importação e dados de exemplo.
    async replace(next) {
      state = migrate(next);
      await persist();
    },

    async wipe() {
      state = emptyState();
      await persist();
    },

    exportJSON() {
      return JSON.stringify(state, null, 2);
    },

    async importJSON(text) {
      const parsed = JSON.parse(text);
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Arquivo inválido.');
      }
      const hasSomething = COLLECTIONS.some((key) => Array.isArray(parsed[key]));
      if (!hasSomething) throw new Error('Não parece um backup do Nossa Casa.');
      await this.replace(parsed);
    },
  };
}

export function uid() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
