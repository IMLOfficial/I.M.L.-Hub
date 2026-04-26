const CACHE="iml-v21";
const ASSETS=["./","./index.html","./manifest.json","./logo.svg","./video-inspired-bg.js","./language-widget.js"];
const LANGUAGE_WIDGET='<script src="./language-widget.js?v=21" defer></script>';

function withLanguageWidget(html){
  if(html.includes("language-widget.js")) return html;
  return html.replace("</body>",`${LANGUAGE_WIDGET}</body>`);
}

async function pageResponse(request){
  const response=await fetch(request);
  const type=response.headers.get("content-type")||"";
  if(!type.includes("text/html")) return response;
  const headers=new Headers(response.headers);
  headers.set("content-type","text/html; charset=utf-8");
  return new Response(withLanguageWidget(await response.text()),{status:response.status,statusText:response.statusText,headers});
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
  if(event.request.mode==="navigate"){
    event.respondWith(pageResponse(event.request).catch(()=>caches.match("./").then(response=>response&&response.text?response.text().then(html=>new Response(withLanguageWidget(html),{headers:{"content-type":"text/html; charset=utf-8"}})):caches.match("./index.html"))));
    return;
  }
  if(new URL(event.request.url).pathname.endsWith("/language-widget.js")){
    event.respondWith(fetch(event.request).catch(()=>caches.match("./language-widget.js")));
    return;
  }
  event.respondWith(caches.match(event.request).then(response=>response||fetch(event.request)));
});
