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
// Function to handle link clicks
function handleLinks(event) {
  // Prevent the default link behavior
  event.preventDefault();
  
  // Get the link's href attribute
  const url = event.currentTarget.getAttribute('href');
  
  // Update the browser's URL without reloading the page
  window.history.pushState({}, '', url);
  
  // Load the new content based on the URL
  loadContent(url);
}

// Function to load content for the given URL
function loadContent(url) {
  fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text();
      })
      .then(html => {
          // Update the page content
          document.getElementById('app').innerHTML = html;
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      });
}

// Attach event listeners to all links
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', handleLinks);
});
const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    // Add other assets you want to cache
];

// Install the service worker and cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching app shell');
                return cache.addAll(urlsToCache);
            })
    );
});

// Serve cached assets when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached response if available, else fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});