
/* Service Worker for PWA support */

// Force instant activation
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim any clients immediately so they are controlled by the SW
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Network-only strategy (passthrough) to ensure data is always fresh
  // This is critical for data-heavy apps to avoid stale caches
  event.respondWith(fetch(event.request));
});
