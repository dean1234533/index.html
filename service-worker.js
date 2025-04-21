// service-worker.js
const CACHE_NAME = 'db-workouts-v1';
const OFFLINE_URL = '/offline.html';

// Resources to pre-cache
const RESOURCES_TO_CACHE = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png',
  OFFLINE_URL,
];

// Install event: Cache the resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker caching app shell');
      return cache.addAll(RESOURCES_TO_CACHE);
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event: Serve cached resources or fallback to offline page
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith(self.location.origin)) {
    return; // Skip cross-origin requests
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).catch(() => {
          return caches.match(OFFLINE_URL); // Fallback to offline page
        });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'db-workouts-sync') {
    event.waitUntil(syncData());
  }
});

// Sync data to the server when online
async function syncData() {
  const dbPromise = indexedDB.open('db-workouts-store', 1);
  
  dbPromise.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('offline-data')) {
      db.createObjectStore('offline-data', { keyPath: 'id', autoIncrement: true });
    }
  };
  
  try {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('db-workouts-store', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });

    const tx = db.transaction('offline-data', 'readwrite');
    const store = tx.objectStore('offline-data');
    const items = await new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    });

    for (const item of items) {
      try {
        const response = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data),
        });

        if (response.ok) {
          store.delete(item.id); // Remove from IndexedDB
        }
      } catch (error) {
        console.error('Error syncing item:', error);
      }
    }

    await new Promise((resolve) => {
      tx.oncomplete = resolve;
    });

  } catch (error) {
    console.error('Sync operation failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  let payload = event.data ? event.data.json() : { title: 'DB Workouts', body: 'New workout available!' };
  
  const options = {
    body: payload.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: { url: payload.url || '/' },
  };
  
  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});