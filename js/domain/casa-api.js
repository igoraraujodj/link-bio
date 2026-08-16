// Cliente do Apps Script "Finanças da Casa".
//
// O bot do Telegram já lê comprovante, deduplica, controla orçamento e grava
// na planilha. Este app não refaz nada disso: só lê o resultado.
//
// A URL é a mesma que o comando /painel entrega no grupo, com &json=1 no fim.

const CACHE_KEY = 'casa-de-dois/financas-cache/v1';

export function parseEndpoint(raw) {
  const url = new URL(String(raw || '').trim());
  if (!url.searchParams.get('k')) {
    throw new Error('Falta a chave (?k=...) no fim do link. Use o link do /painel.');
  }
  url.searchParams.set('json', '1');
  return url.toString();
}

// Guarda a última resposta boa. Sem isso, abrir o app no metrô mostraria
// uma tela vazia em vez dos números de sempre.
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function writeCache(payload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), payload }));
  } catch { /* cota cheia: seguir sem cache é melhor que quebrar */ }
}

export function cachedPayload() {
  return readCache()?.payload || null;
}

export function cachedAt() {
  const at = readCache()?.at;
  return at ? new Date(at) : null;
}

export async function fetchPayload(endpoint) {
  // Sem headers customizados de propósito: qualquer header extra dispara o
  // preflight OPTIONS, e o Apps Script não responde a OPTIONS. A chave vai
  // na URL — que é exatamente o esquema que o painel já usa.
  const resp = await fetch(endpoint, { method: 'GET', redirect: 'follow' });

  if (!resp.ok) {
    throw new Error(`O Apps Script respondeu ${resp.status}. Confira o link e a chave.`);
  }

  const text = await resp.text();

  // Chave errada devolve a página "Link inválido ou expirado" em HTML,
  // com status 200. Sem esta checagem, o erro apareceria como JSON inválido.
  if (text.trimStart().startsWith('<')) {
    throw new Error('A chave do link não confere — o Apps Script devolveu a página de acesso negado.');
  }

  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error('A resposta não veio em JSON. Confira se o ?json=1 foi adicionado ao doGet.');
  }

  if (!Array.isArray(payload.lancamentos)) {
    throw new Error('A resposta não tem a lista de lançamentos.');
  }

  writeCache(payload);
  return payload;
}

export function clearCache() {
  localStorage.removeItem(CACHE_KEY);
}
