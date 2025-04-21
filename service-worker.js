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
// In your service-worker.js

// Register for periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'db-workouts-sync') {
    event.waitUntil(syncContent());
  }
});

// Function to handle background sync
async function syncContent() {
  // Cache key resources
  const cache = await caches.open('db-workouts-v1');
  
  // List of critical resources to update
  const resources = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/scripts/main.js',
    '/api/workouts',
    '/api/exercises'
  ];
  
  // Update cache with fresh content
  await Promise.all(
    resources.map(async (url) => {
      try {
        const response = await fetch(url, { cache: 'no-cache' });
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.error(`Failed to update ${url} in background sync:`, error);
      }
    })
  );
  
  // Update your app's data in IndexedDB if needed
  await updateAppData();
}

// Function to update app data
async function updateAppData() {
  // Add your data update logic here
  // This could involve fetching new workouts, exercises, etc.
  // and storing them in IndexedDB
}


// In your main JS file

// Register for periodic background sync when the service worker is ready
if ('serviceWorker' in navigator && 'periodicSync' in registration) {
  navigator.serviceWorker.ready.then(async (registration) => {
    try {
      // Check if permission is granted
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync',
      });
      
      if (status.state === 'granted') {
        // Register for periodic sync with a minimum interval of 24 hours
        await registration.periodicSync.register('db-workouts-sync', {
          minInterval: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        });
        console.log('Periodic background sync registered');
      }
    } catch (error) {
      console.error('Periodic background sync registration failed:', error);
    }
  });
}


// In your service-worker.js

// Handle push events
self.addEventListener('push', (event) => {
  let payload = {};
  
  try {
    payload = event.data.json();
  } catch (e) {
    payload = {
      title: 'DB Workouts',
      body: event.data ? event.data.text() : 'Time for your workout!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png'
    };
  }
  
  const options = {
    body: payload.body,
    icon: payload.icon || '/icons/icon-192x192.png',
    badge: payload.badge || '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: payload.url || '/',
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Workout',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Handle notification action clicks
  if (event.action === 'explore') {
    // Open the specific workout or page
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
  // For 'close' action or clicking the notification itself
  else {
    event.waitUntil(
      clients.matchAll({type: 'window'}).then((clientList) => {
        // If a window is already open, focus it
        if (clientList.length > 0) {
          let client = clientList[0];
          client.focus();
          return client.navigate(event.notification.data.url);
        }
        // Otherwise open a new window
        return clients.openWindow(event.notification.data.url);
      })
    );
  }
});


// In your main JS file

// Request notification permission and register for push
async function registerForPush() {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      
      // Generate VAPID keys on your server and use the public key here
      // This is a placeholder - you need to generate your own keys
      const applicationServerKey = urlBase64ToUint8Array(
        'YOUR_PUBLIC_VAPID_KEY'
      );
      
      // Subscribe the user
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });
      
      // Send the subscription to your server
      await saveSubscription(subscription);
      
      console.log('Push notification subscription successful');
      
      // You could notify the user that they've successfully subscribed
      showNotificationSuccess();
    }
  } catch (error) {
    console.error('Failed to register for push notifications:', error);
  }
}

// Helper function to convert VAPID key from base64 to Uint8Array
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

// Function to send the subscription to your server
async function saveSubscription(subscription) {
  const response = await fetch('/api/save-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });
  
  return response.json();
}

// Add a button or prompt in your UI to trigger registration
document.getElementById('enable-notifications').addEventListener('click', registerForPush);


{
  "gcm_sender_id": "YOUR_GCM_SENDER_ID"
}


// server.js
const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// VAPID keys should be generated only once
const vapidKeys = webPush.generateVAPIDKeys();

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Store subscriptions (in a real app, use a database)
const subscriptions = [];

// Endpoint to save subscriptions
app.post('/api/save-subscription', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: 'Subscription added successfully' });
});

// Endpoint to trigger push notifications (would be protected in production)
app.post('/api/send-notification', (req, res) => {
  const { title, body, url } = req.body;
  
  const payload = JSON.stringify({
    title,
    body,
    url
  });
  
  // Send to all subscriptions
  const sendPromises = subscriptions.map(subscription => 
    webPush.sendNotification(subscription, payload)
      .catch(err => console.error('Error sending notification:', err))
  );
  
  Promise.all(sendPromises)
    .then(() => res.status(200).json({ message: 'Notifications sent' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});



