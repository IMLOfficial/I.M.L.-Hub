const CACHE="iml-v51";
const ASSETS=["./","./index.html","./manifest.json","./logo.svg","./video-inspired-bg.js","./video-library.js","./language-widget.js","./audio-library.js","./playlist-toggle.js","./music-theme.js","./music-polish.js","./site-features.js","./mobile-music-app.js","./promo-ads.js","./promo-live-files.js"];
const BG_SCRIPT='<script src="./video-inspired-bg.js?v=51"></script>';
const WIDGET_SCRIPTS=[
  '<script src="./video-library.js?v=51" defer></script>',
  '<script src="./audio-library.js?v=51" defer></script>',
  '<script src="./playlist-toggle.js?v=51" defer></script>',
  '<script src="./language-widget.js?v=51" defer></script>',
  '<script src="./music-theme.js?v=51" defer></script>',
  '<script src="./music-polish.js?v=51" defer></script>',
  '<script src="./site-features.js?v=51" defer></script>',
  '<script src="./mobile-music-app.js?v=51" defer></script>',
  '<script src="./promo-ads.js?v=51" defer></script>'
];

function withWidgets(html){
  const withoutBg=html.replace(/<script\s+src="\.\/video-inspired-bg\.js\?v=\d+"\s*><\/script>/g,"");
  const cleaned=withoutBg.replace(/<script\s+src="\.\/(video-library|audio-library|playlist-toggle|language-widget|music-theme|music-polish|site-features|mobile-music-app|promo-ads|promo-live-files)\.js\?v=\d+"\s*(defer)?\s*><\/script>/g,"");
  return cleaned.replace("</body>",`${BG_SCRIPT}${WIDGET_SCRIPTS.join("")}</body>`);
}

async function pageResponse(request){
  const response=await fetch(request,{cache:"no-store"});
  const type=response.headers.get("content-type")||"";
  if(!type.includes("text/html")) return response;
  const headers=new Headers(response.headers);
  headers.set("content-type","text/html; charset=utf-8");
  headers.set("cache-control","no-store");
  return new Response(withWidgets(await response.text()),{status:response.status,statusText:response.statusText,headers});
}

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
  const path=new URL(event.request.url).pathname;
  if(event.request.mode==="navigate"){
    event.respondWith(pageResponse(event.request).catch(()=>caches.match("./index.html").then(response=>response&&response.text?response.text().then(html=>new Response(withWidgets(html),{headers:{"content-type":"text/html; charset=utf-8"}})):response)));
    return;
  }
  const widgetFile=["video-library.js","language-widget.js","audio-library.js","playlist-toggle.js","video-inspired-bg.js","music-theme.js","music-polish.js","site-features.js","mobile-music-app.js","promo-ads.js","promo-live-files.js"].find(file=>path.endsWith(`/${file}`));
  if(widgetFile){
    event.respondWith(fetch(event.request,{cache:"no-store"}).catch(()=>caches.match(`./${widgetFile}`)));
    return;
  }
  event.respondWith(caches.match(event.request).then(response=>response||fetch(event.request)));
});
