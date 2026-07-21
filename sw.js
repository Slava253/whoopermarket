const CACHE_NAME = 'whoper-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/client/index.html',
  '/seller/index.html',
  '/pvz/index.html',
  '/support/index.html',
  '/admin/index.html',
  '/css/style.css',
  '/js/firebase-config.js',
  '/js/utils.js',
  '/js/qr-helper.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/index.html'))
  );
});

console.log('📦 Service Worker загружен');