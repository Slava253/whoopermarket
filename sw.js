// ========== SERVICE WORKER ==========
const CACHE_NAME = 'whoper-v1.0.0';
const OFFLINE_URL = '/index.html';

// Файлы для кеширования
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

// Внешние ресурсы (CDN)
const EXTERNAL_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js'
];

// Установка Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Установка...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Кеширование файлов...');
        // Кешируем статику
        return cache.addAll([...STATIC_ASSETS, ...EXTERNAL_ASSETS]);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Активация...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Удаление старого кеша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Перехват запросов
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Пропускаем запросы к Firebase (они и так не кешируются)
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis')) {
    event.respondWith(fetch(request));
    return;
  }

  // Стратегия: сначала кеш, потом сеть
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          // Обновляем кеш в фоне
          event.waitUntil(
            fetch(request).then(networkResponse => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(request, networkResponse.clone());
                });
              }
            }).catch(() => {})
          );
          return response;
        }
        return fetch(request).catch(() => {
          // Если нет ни кеша, ни сети - показываем офлайн страницу
          if (request.headers.get('accept').includes('text/html')) {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});

// Push уведомления (опционально)
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Новое уведомление',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'WHOPPER', options)
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

console.log('📦 Service Worker загружен');
