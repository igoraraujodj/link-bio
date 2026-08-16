// Adaptador de persistência: localStorage.
//
// Implementa o contrato que o store espera:
//   load()            -> Promise<state | null>
//   save(state)       -> Promise<void>
//   subscribe(fn)     -> unsubscribe   (avisa quando o dado mudou FORA daqui)
//
// Trocar por Supabase é escrever outro arquivo com essas três funções.
// Ver adapter-supabase.example.js.

const KEY = 'nossa-casa/v1';

export function createLocalAdapter({ key = KEY } = {}) {
  return {
    name: 'local',

    async load() {
      try {
        const raw = localStorage.getItem(key);
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
