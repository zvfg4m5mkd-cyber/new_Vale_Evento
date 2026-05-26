const CACHE_VERSION = 'vale-ehm-pwa-v1.0.0';
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;

const scopeUrl = self.registration.scope;
const staticAssets = [
  scopeUrl,
  `${scopeUrl}index.html`,
  `${scopeUrl}manifest.webmanifest`,
  `${scopeUrl}offline.html`,
  `${scopeUrl}favicon.svg`,
  `${scopeUrl}pwa-192.png`,
  `${scopeUrl}pwa-512.png`,
  `${scopeUrl}pwa-maskable-512.png`,
  `${scopeUrl}apple-touch-icon.png`
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(staticAssets))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match(`${scopeUrl}index.html`) || caches.match(`${scopeUrl}offline.html`);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const responseClone = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
        return response;
      });
    })
  );
});
