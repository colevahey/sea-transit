const CACHE_NAME = 'sea-transit-v2';
const PRECACHE = ['/icons/icon-192.png', '/icons/icon-512.png', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-only for API calls
  if (url.hostname.includes('onebusaway.org')) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: 'Offline — no cached data' }), {
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  // Network-first for app shell (HTML, CSS, JS)
  if (['/', '/index.html', '/js/app.js', '/css/style.css'].some((p) => url.pathname === p || url.pathname.endsWith(p))) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        fetch(request)
          .then((res) => { cache.put(request, res.clone()); return res; })
          .catch(() => caches.match(request))
      )
    );
    return;
  }

  // Cache-first for everything else (icons, manifest, etc.)
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
