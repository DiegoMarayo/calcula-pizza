
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('meu-pwa-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/script.js',
                '/calcula-pizza/Pizzaa-192.png',
                '/calcula-pizza/Pizzaa512.png',
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
