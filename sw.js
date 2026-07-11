// Service worker Carmen Seillons — TOUJOURS à jour quand en ligne, marche hors-ligne après une visite
const CACHE = 'carmen-seillons-v3';
const COEUR = ['./', 'index.html', 'technique.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(COEUR)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(cles => Promise.all(
    cles.filter(k => k !== CACHE).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.endsWith('.mp3') || url.origin !== self.location.origin) return;
  // RÉSEAU D'ABORD pour tout (pages + schémas + avatars) : dernière version si en ligne,
  // sinon on ressert la copie en cache (fonctionne hors-ligne).
  e.respondWith(
    fetch(e.request).then(r => {
      const copie = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copie));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
