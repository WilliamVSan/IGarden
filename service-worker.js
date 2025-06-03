const CACHE_NAME = 'igarden-cache-v1';
const urlsToCache = [
    'home.html',
    'CSS/home.css',
    'scripts/script.js',
    'manifest.json',
    'assets/icons/icon-192x192.png',
    'assets/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            try {
                await cache.addAll(urlsToCache);
            } catch (err) {
                for (const url of urlsToCache) {
                    try {
                        await cache.add(url);
                    } catch (e) {
                        console.error('Falha ao adicionar ao cache:', url, e);
                    }
                }
            }
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
