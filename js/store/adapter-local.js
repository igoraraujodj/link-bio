// Adaptador de persistência: localStorage.
//
// Implementa o contrato que o store espera:
//   load()            -> Promise<state | null>
//   save(state)       -> Promise<void>
//   subscribe(fn)     -> unsubscribe   (avisa quando o dado mudou FORA daqui)
//
// Trocar por Supabase é escrever outro arquivo com essas três funções.
// Ver adapter-supabase.example.js.

const KEY = 'nina/v1';

// O app já se chamou "Nina". Trocar a chave sem olhar pra trás
// abriria vazio no aparelho de quem já tinha digitado, e pareceria que os
// dados sumiram — eles continuariam lá, só fora de alcance.
const KEY_ANTERIOR = 'casa-de-dois/v1';

export function createLocalAdapter({ key = KEY } = {}) {
  return {
    name: 'local',

    async load() {
      try {
        let raw = localStorage.getItem(key);
        if (!raw) {
          raw = localStorage.getItem(KEY_ANTERIOR);
          if (raw) localStorage.setItem(key, raw);   // herda uma vez e segue
        }
        return raw ? JSON.parse(raw) : null;
      } catch (err) {
        console.error('[store] não consegui ler o localStorage', err);
        return null;
      }
    },

    async save(state) {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (err) {
        // Cota estourada é o erro real aqui (fotos em base64 nas memórias).
        console.error('[store] não consegui gravar', err);
        throw new Error(
          'Não deu pra salvar. O armazenamento do navegador encheu — ' +
          'apague alguma foto das memórias.'
        );
      }
    },

    // Sincroniza abas abertas no mesmo navegador. É o mais perto de
    // "tempo real" que dá pra chegar sem servidor.
    subscribe(fn) {
      const onStorage = (event) => {
        if (event.key !== key || !event.newValue) return;
        try {
          fn(JSON.parse(event.newValue));
        } catch { /* valor corrompido: ignora */ }
      };
      window.addEventListener('storage', onStorage);
      return () => window.removeEventListener('storage', onStorage);
    },

    async clear() {
      localStorage.removeItem(key);
    },
  };
}
