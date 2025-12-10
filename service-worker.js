const CACHE_NAME = 'survey-v3'; // Đổi tên cache để đảm bảo cache mới được tải
const urlsToCache = [
    './',
    'index.html', 
    'manifest.json',
    // Cập nhật đường dẫn icon mới
    'DIM.png', 
    // Các tài nguyên khác
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

// Sự kiện: Cài đặt Service Worker (Lưu trữ tài nguyên tĩnh)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Sự kiện: Kích hoạt Service Worker (Dọn dẹp cache cũ)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Sự kiện: Fetch (Phục vụ từ Cache trước khi tìm nạp mạng)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - trả về response từ cache
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});