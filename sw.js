const CACHE = "song2video-agent-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.headers.has("range") || /\.(mp3|mp4|m4a|wav|webm)$/i.test(url.pathname)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(fetch(request, { cache: "no-store" }).catch(() => caches.match("./index.html")));
    return;
  }

  event.respondWith(
    fetch(request, { cache: "no-store" })
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => undefined);
        return response;
      })
      .catch(() => caches.match(request))
  );
});
