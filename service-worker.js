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