const CACHE='mercado-facil-pro-v15-1';
const ASSETS=['./styles.css?v=15.1','./app.js?v=15.1','./firebase-config.js?v=15.1','./firebase-bridge.js?v=15.1','./manifest.json','./icons/icon-192.svg','./icons/icon-512.svg'];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).catch(()=>{}));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;

  if(req.mode==='navigate'){
    event.respondWith(
      fetch(req,{cache:'no-store'})
        .then(resp=>resp)
        .catch(()=>caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    fetch(req)
      .then(resp=>{
        const copy=resp.clone();
        caches.open(CACHE).then(cache=>cache.put(req,copy));
        return resp;
      })
      .catch(()=>caches.match(req))
  );
});
