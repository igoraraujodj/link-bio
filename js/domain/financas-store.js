// Fonte única das finanças.
//
// Antes, a leitura da planilha vivia dentro de views/financas.js. A tela
// Início não tinha como alcançar aquilo, então lia o storage local e
// mostrava zero mesmo com a integração ligada — o app parecia quebrado
// sem estar.
//
// Agora quem precisa de finanças pede aqui. Uma leitura, um cache, todas
// as telas enxergando o mesmo número.

import { fetchPayload, cachedPayload, cachedAt } from './casa-api.js';

const state = {
  status: 'idle',   // idle | loading | ok | error
  payload: null,
  error: null,
};

const listeners = new Set();

const notify = () => listeners.forEach((fn) => fn(state));

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function snapshot() {
  return {
    status: state.status,
    payload: state.payload,
    error: state.error,
    at: cachedAt(),
  };
}

/**
 * Chamado por qualquer tela que queira finanças. Dispara a leitura na
 * primeira vez e devolve o que já tiver — inclusive o cache do disco,
 * para a tela nunca aparecer vazia enquanto a rede responde.
 */
export function ensure(endpoint) {
  if (!endpoint) return null;
  if (!state.payload) state.payload = cachedPayload();
  if (state.status === 'idle') load(endpoint);
  return state.payload;
}

export function reload(endpoint) {
  state.status = 'idle';
  ensure(endpoint);
}

/** Esquece tudo. Usado ao trocar ou desligar o link em Ajustes. */
export function reset() {
  state.status = 'idle';
  state.payload = null;
  state.error = null;
}

async function load(endpoint) {
  state.status = 'loading';
  state.error = null;
  notify();
  try {
    state.payload = await fetchPayload(endpoint);
    state.status = 'ok';
  } catch (err) {
    state.status = 'error';
    state.error = err.message;
  }
  notify();
}
