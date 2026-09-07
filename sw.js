


const CACHE = "pwa-v1";

const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});








// const CACHE_NAME = 'pwa-v1';
// const ASSETS_TO_CACHE = [
//   '/',
//   '/index.html',
//   '/manifest.json',
//   "./icons/icon-192.png",
//   "./icons/icon-512.png"
// ];

// // Instalação: Salva os arquivos essenciais no Cache Storage
// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log('[Service Worker] Caching App Shell');
//       return cache.addAll(ASSETS_TO_CACHE);
//     })
//   );
//   self.skipWaiting();
// });

// // Ativação: Limpa caches antigos se a versão mudar
// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     caches.keys().then((keyList) => {
//       return Promise.all(
//         keyList.map((key) => {
//           if (key !== CACHE_NAME) {
//             console.log('[Service Worker] Removendo cache antigo:', key);
//             return caches.delete(key);
//           }
//         })
//       );
//     })
//   );
//   self.clients.claim();
// });

// // Interceptação de requisições: Estratégia Cache First, fallback Network
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       if (cachedResponse) {
//         return cachedResponse;
//       }
//       return fetch(event.request);
//     })
//   );
// });