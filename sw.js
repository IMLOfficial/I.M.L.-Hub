const CACHE = "iml-v64";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.svg",
  "./video-inspired-bg.js",
  "./video-library.js",
  "./language-widget.js",
  "./audio-library.js",
  "./playlist-toggle.js",
  "./music-theme.js",
  "./music-polish.js",
  "./site-features.js",
  "./mobile-music-app.js",
  "./promo-ads.js",
  "./promo-live-files.js",
  "./youtube-music-redesign.js",
  "./mobile-ytm-experience.js",
  "./mobile-compact-fix.js"
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

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .catch(() => caches.match("./index.html"))
    );
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
