// Service worker: deixa o app abrir sem internet.
//
// Estratégia: cache-first para a casca (HTML, CSS, JS), rede depois.
// Os dados nunca passam por aqui — vivem no localStorage.

const CACHE = 'casa-de-dois-v1';

const SHELL = [
  './',
  './index.html',
  './app.css',
  './manifest.webmanifest',
  './js/app.js',
  './js/router.js',
  './js/seed.js',
  './js/store/index.js',
  './js/store/schema.js',
  './js/store/adapter-local.js',
  './js/domain/queries.js',
  './js/ui/dom.js',
  './js/ui/modal.js',
  './js/utils/date.js',
  './js/utils/money.js',
  './js/views/dashboard.js',
  './js/views/agenda.js',
  './js/views/tarefas.js',
  './js/views/financas.js',
  './js/views/metas.js',
  './js/views/compras.js',
  './js/views/habitos.js',
  './js/views/memorias.js',
  './js/views/ajustes.js',
  './assets/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // addAll falha inteiro se um arquivo faltar; individual é mais tolerante.
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached || caches.match('./index.html'));

      // Serve do cache na hora e atualiza por baixo pro próximo load.
      return cached || network;
    })
  );
});
