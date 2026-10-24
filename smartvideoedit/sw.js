/* SMARTVIDEOEDIT — l'interface reste disponible hors connexion ; le moteur vidéo vient du CDN */
const C='smartvideoedit-v3', F=['./','index.html','worker.js','manifest.json','icone-180.png','icone-192.png','icone-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(C).then(c=>c.addAll(F))); self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('smartvideoedit')&&x!==C).map(x=>caches.delete(x))))); self.clients.claim(); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin) return;
  e.respondWith(fetch(e.request).then(r=>{ const cp=r.clone(); caches.open(C).then(c=>c.put(e.request,cp)); return r; }).catch(()=>caches.match(e.request))); });
