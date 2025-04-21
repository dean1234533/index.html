self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('db-cache-v1').then((cache) =>
        cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          '/icons/icon-192x192.png',
          '/icons/icon-512x512.png',
        ])
      )
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    );
  });
  // service-worker.js
const CACHE_NAME = 'db-workouts-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/main.js',
  // Add other important assets
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        // Try network and cache the response
        return fetch(fetchRequest).then(
          response => {
            // Check if valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          }
        );
      })
  );
});

// Background sync for offline capabilities
self.addEventListener('sync', event => {
  if (event.tag === 'db-workouts-sync') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Your sync logic here to process any pending data
  // This gets triggered when connection is restored
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
        
        // Register for periodic sync if supported
        if ('periodicSync' in registration) {
          const syncOptions = {
            tag: 'db-workouts-periodic-sync',
            minInterval: 24 * 60 * 60 * 1000 // Once per day
          };
          
          registration.periodicSync.register(syncOptions)
            .catch(error => {
              console.log('Periodic sync registration failed:', error);
            });
        }
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}
// Push event handler
self.addEventListener('push', function(event) {
  const title = 'DB Workouts';
  const options = {
    body: event.data ? event.data.text() : 'New workout available!',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    data: {
      url: 'https://yourdomain.com/workouts'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
function setupPushNotifications() {
  if ('Notification' in window && 'PushManager' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        // Subscribe user to push notifications
        navigator.serviceWorker.ready.then(registration => {
          // You'll need to create a VAPID key pair
          const applicationServerKey = urlBase64ToUint8Array(
            'YOUR_PUBLIC_VAPID_KEY'
          );
          
          registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
          })
          .then(subscription => {
            // Send subscription to your server
            return sendSubscriptionToServer(subscription);
          })
          .catch(error => {
            console.error('Failed to subscribe to push:', error);
          });
        });
      }
    });
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Function to send subscription to your server
function sendSubscriptionToServer(subscription) {
  return fetch('/api/save-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });
}

// Call when your app initializes
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
        setupPushNotifications();
        
        // Rest of your service worker code
      });
  });
}

function handleProtocol() {
  const url = new URL(window.location.href);
  const workoutParam = url.searchParams.get('workout');
  
  if (workoutParam) {
    // Process the protocol data
    console.log('Protocol data:', workoutParam);
    // Open the appropriate workout or exercise
  }
}

// Call this when your app initializes
if (window.location.pathname === '/handle-protocol') {
  handleProtocol();
}
// In your service worker
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Handle share target requests
  if (url.pathname === '/share-target' && event.request.method === 'POST') {
    event.respondWith((async () => {
      const formData = await event.request.formData();
      const title = formData.get('title') || '';
      const text = formData.get('text') || '';
      const url = formData.get('url') || '';
      const files = formData.getAll('workout');
      
      // Store the shared data
      await storeSharedData({ title, text, url, files });
      
      // Redirect to a page that will display the shared content
      return Response.redirect('/shared-workout', 303);
    })());
  }
  
  // Handle other fetch events
  // ...
});

async function storeSharedData(data) {
  // Store in IndexedDB or other storage
  const db = await openDB('db-workouts', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('shared')) {
        db.createObjectStore('shared', { keyPath: 'id', autoIncrement: true });
      }
    }
  });
  
  await db.add('shared', {
    timestamp: new Date().toISOString(),
    ...data
  });
}

