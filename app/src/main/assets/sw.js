// mastereng-pwa-v28 Service Worker Network-First with Auto-Cache Cleanup
const CACHE_NAME = 'mastereng-pwa-v28-' + Date.now();
const CORE_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './css/styles.css',
  './css/pet_profile.css',
  './css/soccer_tactics.css',
  './js/app.js',
  './js/world3d.js',
  './js/world3d_nature_space.js',
  './js/world3d_dating_hotel.js',
  './js/world3d_market_rest.js',
  './js/karaoke.js',
  './js/jest_game.js',
  './js/social_chat.js',
  './js/pet_minigames_2d.js',
  './js/pet_engine_2d.js',
  './js/pet_sanctuary.js',
  './js/profile_social.js',
  './js/soccer_tactics_3d.js',
  './js/asset_download_manager.js',
  './manifest.json',
  './icon.png',
  './icon-512.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS).catch(() => {})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith('http')) return;
  
  // Excluir paquetes .glb pesados para que AssetDownloadManager los gestione bajo demanda en IndexedDB
  if (e.request.url.includes('.glb')) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((netRes) => {
        const clone = netRes.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
        return netRes;
      })
      .catch(() => caches.match(e.request).then((cached) => cached || caches.match('./index.html')))
  );
});
