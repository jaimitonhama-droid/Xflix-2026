const CACHE_NAME = 'xflix-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass through all requests without caching for now
  // This just satisfies the PWA installability requirements
  event.respondWith(fetch(event.request));
});
