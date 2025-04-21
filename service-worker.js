self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('dbworkouts-cache').then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          '/icons/icon-192x192.png',
          '/icons/icon-512x512.png'
        ]);
      })
    );
  });

  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });
// Inside your service worker (sw.js)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
      event.waitUntil(syncData());
  }
});

async function syncData() {
  // Fetch and sync data with your server
}