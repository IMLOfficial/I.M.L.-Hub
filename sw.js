const CACHE = "song2video-agent-v4";
const LOGO_SCRIPT = '<script src="./custom-logo.js?v=logo-1" defer></script>';
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.svg",
  "./custom-logo.js"
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

async function injectLogoOverlay(response) {
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return response;

  let html = await response.text();
  if (!html.includes("custom-logo.js")) {
    html = html.replace("</body>", `${LOGO_SCRIPT}\n</body>`);
  }

  const headers = new Headers(response.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.headers.has("range") || /\.(mp3|mp4|m4a|wav|webm)$/i.test(url.pathname)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .then(response => injectLogoOverlay(response))
        .catch(() => caches.match("./index.html").then(response => response ? injectLogoOverlay(response.clone()) : response))
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
