// Bộ nhớ đệm (Cache) để App chạy nhanh hơn
const CACHE_NAME = 'moto-app-v1';
const ASSETS = [
  './',
  './index.html',
  './icon.png',
  './manifest.json'
];

// 1. Cài đặt Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 2. Lấy dữ liệu (Nếu mất mạng thì lấy từ Cache)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
