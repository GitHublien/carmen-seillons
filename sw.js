// Service worker Carmen Seillons — pages à jour quand en ligne, fonctionne hors-ligne après une visite
const CACHE = 'carmen-seillons-v2';
const COEUR = [
  './', 'index.html', 'technique.html',
  'avatar-carmen.jpg', 'avatar-jose.jpg', 'avatar-micaela.jpg', 'avatar-escamillo.jpg',
  'avatar-zuniga.jpg', 'avatar-frasquita.jpg', 'avatar-mercedes.jpg', 'avatar-narrateur.jpg'
];

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

  const estPage = e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  if (estPage) {
    // PAGES : réseau d'abord (toujours la dernière version) → cache si hors-ligne
    e.respondWith(
      fetch(e.request).then(r => {
        const copie = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copie));
        return r;
      }).catch(() => caches.match(e.request, { ignoreSearch: true }))
    );
  } else {
    // IMAGES/SCHÉMAS : cache d'abord (rapide) → réseau sinon
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then(rep => rep || fetch(e.request).then(r => {
        const copie = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copie));
        return r;
      }))
    );
  }
});
