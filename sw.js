// Service worker Carmen Seillons — la page fonctionne SANS INTERNET après une première visite
const CACHE = 'carmen-seillons-v1';
const COEUR = [
  './', 'index.html', 'technique.html',
  'avatar-carmen.jpg', 'avatar-jose.jpg', 'avatar-micaela.jpg', 'avatar-escamillo.jpg',
  'avatar-zuniga.jpg', 'avatar-frasquita.jpg', 'avatar-mercedes.jpg', 'avatar-narrateur.jpg',
  'schemas/schema-dispositif.jpg', 'schemas/schema-n1.jpg', 'schemas/schema-n5.jpg',
  'schemas/schema-n6.jpg', 'schemas/schema-n6bis.jpg', 'schemas/schema-n8.jpg',
  'schemas/schema-n10.jpg', 'schemas/schema-n12.jpg', 'schemas/schema-n14.jpg',
  'schemas/schema-n14fin.jpg', 'schemas/schema-n17.jpg', 'schemas/schema-n18.jpg',
  'schemas/schema-n18b.jpg', 'schemas/schema-n18fin.jpg', 'schemas/schema-n19.jpg',
  'schemas/schema-n19fin.jpg', 'schemas/schema-n20.jpg', 'schemas/schema-n22.jpg',
  'schemas/schema-n23.jpg', 'schemas/schema-n23b.jpg', 'schemas/schema-n24.jpg',
  'schemas/schema-n26.jpg', 'schemas/schema-n27.jpg'
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
  // Les musiques (autre domaine + .mp3) : réseau uniquement, jamais en cache
  if (url.pathname.endsWith('.mp3') || url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(rep => rep || fetch(e.request).then(r => {
      const copie = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copie));
      return r;
    }))
  );
});
