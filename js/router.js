// Roteador por hash. Escolha deliberada: funciona em qualquer hospedagem
// estática (GitHub Pages, Vercel) sem regra de rewrite, e o link
// #/financas continua válido se um dia o app mudar de endereço.

export function createRouter({ routes, fallback, onChange }) {
  function parse() {
    const raw = location.hash.replace(/^#\/?/, '');
    const [path, query] = raw.split('?');
    const id = path || fallback;
    return {
      id: routes[id] ? id : fallback,
      params: new URLSearchParams(query || ''),
    };
  }

  function handle() {
    onChange(parse());
  }

  return {
    start() {
      window.addEventListener('hashchange', handle);
      handle();
    },
    current: parse,
    go(id, params = {}) {
      const query = new URLSearchParams(params).toString();
      const next = `#/${id}${query ? `?${query}` : ''}`;
      if (location.hash === next) handle();       // mesma rota: força repintura
      else location.hash = next;
    },
  };
}
