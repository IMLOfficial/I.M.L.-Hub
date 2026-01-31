const CACHE="iml-v3";
const ASSETS=[
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.png"
];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate",e=>{
  e.waitUntil(
    caches.keys().then(k=>Promise.all(
      k.filter(x=>x!==CACHE).map(x=>caches.delete(x))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch",e=>{
  e.respondWith(
    fetch(e.request).catch(()=>caches.match(e.request))
  );
});
