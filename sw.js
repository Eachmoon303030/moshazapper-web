// © 2026 Eachmoon Barman (EB). All rights reserved.

// Lets the game install and run offline. The page is fetched fresh when online (so updates
// show up) and the cached copy is used when there is no connection; everything else is cached.
const CACHE = 'mosha-v1';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png',
  'fonts/atk400.woff2', 'fonts/atk700.woff2', 'fonts/bigshoulders.woff2', 'fonts/silkscreen.woff2', 'fonts/hind700.woff2'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  const isPage = e.request.mode === 'navigate';
  e.respondWith(
    isPage
      ? fetch(e.request).then((r) => { caches.open(CACHE).then((c) => c.put(e.request, r.clone())); return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match('index.html')))
      : caches.match(e.request).then((r) => r || fetch(e.request).then((n) => { caches.open(CACHE).then((c) => c.put(e.request, n.clone())); return n; }))
  );
});
