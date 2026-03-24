const CACHE_NAME = 'doctor-simulator-v15';
const RUNTIME_CACHE = 'doctor-simulator-runtime-v15';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/data_sources.html',
    '/manifest.json',
    '/logo.png'
];

self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => {
                        return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
                    })
                    .map((cacheName) => {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET') return;

    // Skip caching for API calls
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(fetch(request));
        return;
    }

    // Skip caching for external URLs (Google Sheets, etc.)
    if (url.origin !== self.location.origin) {
        event.respondWith(fetch(request).catch(() => new Response('Offline', { status: 503 })));
        return;
    }

    if (request.headers.get('accept').includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (!response || response.status !== 200) return response;
                    const clone = response.clone();
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(request, clone);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(request) || new Response('Offline', { status: 503 });
                })
        );
        return;
    }

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            return cachedResponse || fetch(request)
                .then((response) => {
                    if (!response || response.status !== 200) return response;
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, clone);
                    });
                    return response;
                })
                .catch(() => new Response('Offline', { status: 503 }));
        })
    );
});

self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-routes') {
        event.waitUntil(
            fetch('/save-data.php', { method: 'POST', body: JSON.stringify({ action: 'sync' }) })
                .then(() => {
                    self.clients.matchAll().then((clients) => {
                        clients.forEach((client) => {
                            client.postMessage({ type: 'SYNC_COMPLETE', message: 'סונכרן!' });
                        });
                    });
                })
        );
    }
});

self.addEventListener('push', (event) => {
    if (!event.data) return;
    const options = {
        body: event.data.text(),
        icon: '/logo.png',
        badge: '/logo.png',
        tag: 'doctor-simulator'
    };
    event.waitUntil(self.registration.showNotification('Doctor Simulator', options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (let client of clientList) {
                if (client.url === '/') return client.focus();
            }
            if (clients.openWindow) return clients.openWindow('/');
        })
    );
});

console.log('Service Worker loaded');
