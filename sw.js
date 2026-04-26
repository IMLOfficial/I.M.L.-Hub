const CACHE="iml-v24";
const ASSETS=["./","./index.html","./manifest.json","./logo.svg","./video-inspired-bg.js","./video-library.js","./language-widget.js","./audio-library.js"];
const WIDGET_SCRIPTS=[
  '<script src="./video-library.js?v=24" defer></script>',
  '<script src="./audio-library.js?v=24" defer></script>',
  '<script src="./language-widget.js?v=24" defer></script>'
];

function withWidgets(html){
  const scripts=WIDGET_SCRIPTS.filter(script=>!html.includes(script.match(/\.\/(.+?)\?/)[1]));
  if(!scripts.length) return html;
  return html.replace("</body>",`${scripts.join("")}</body>`);
}

async function pageResponse(request){
  const response=await fetch(request);
  const type=response.headers.get("content-type")||"";
  if(!type.includes("text/html")) return response;
  const headers=new Headers(response.headers);
  headers.set("content-type","text/html; charset=utf-8");
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
    event.respondWith(pageResponse(event.request).catch(()=>caches.match("./").then(response=>response&&response.text?response.text().then(html=>new Response(withWidgets(html),{headers:{"content-type":"text/html; charset=utf-8"}})):caches.match("./index.html"))));
    return;
  }
  const widgetFile=["video-library.js","language-widget.js","audio-library.js"].find(file=>path.endsWith(`/${file}`));
  if(widgetFile){
    event.respondWith(fetch(event.request).catch(()=>caches.match(`./${widgetFile}`)));
    return;
  }
  event.respondWith(caches.match(event.request).then(response=>response||fetch(event.request)));
});
