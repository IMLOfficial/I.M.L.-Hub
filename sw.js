const CACHE="iml-v10";
const ASSETS=["./","./index.html","./manifest.json","./logo.svg","./video-inspired-bg.js"];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch",event=>{
  event.respondWith(caches.match(event.request).then(response=>response||fetch(event.request)));
});
