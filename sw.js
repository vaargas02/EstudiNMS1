// Service worker: cache-first, offline total
const CACHE = 'raiz-nervio-v2.0.0';
const FILES = ['./', './index.html', './estilos.css', './motor.js', './tema.js', './config.json',
  './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(async c => {
    await c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })));
    try {
      const r = await fetch('./img/index.json', { cache: 'reload' });
      if (r.ok) {
        await c.put('./img/index.json', r.clone());
        const idx = await r.json();
        const files = [...new Set(Object.values(idx).map(e => './' + e.file))];
        await Promise.all(files.map(f => c.add(new Request(f, { cache: 'reload' })).catch(() => {})));
      }
    } catch (e) {}
  }).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
    return res;
  }).catch(() => caches.match('./index.html'))));
});
