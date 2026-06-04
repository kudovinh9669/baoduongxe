const CACHE_NAME = 'vision-manager-v2'; // Đổi tên cache để ép trình duyệt xóa bản cũ
const urlsToCache = [
    '/',
    '/index.html',
    '/icon.png',
    '/manifest.json'
];

// Cài đặt Service Worker
self.addEventListener('install', event => {
    self.skipWaiting(); // Ép cập nhật ngay lập tức
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Xóa bộ nhớ đệm cũ khi có phiên bản mới
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Chiến lược "Network First, Fallback to Cache" (Ưu tiên mạng trước, mất mạng mới dùng Cache)
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Nếu tải thành công từ mạng, lưu ngay một bản copy mới nhất vào Cache
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, responseToCache));
                }
                return response;
            })
            .catch(() => {
                // Nếu mất mạng, lôi bản web đã lưu trong máy ra dùng tạm
                return caches.match(event.request);
            })
    );
});
