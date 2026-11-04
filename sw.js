/* Infettiva: online carica sempre la versione piu recente, offline usa l'ultima salvata */
var C='infettiva-cache';
var FILES=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){self.skipWaiting();e.waitUntil(caches.open(C).then(function(c){return Promise.all(FILES.map(function(f){return fetch(f,{cache:'no-cache'}).then(function(r){if(r.ok)return c.put(f,r);}).catch(function(){});}));}));});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',function(e){
  var q=e.request;if(q.method!=='GET'||new URL(q.url).origin!==location.origin)return;
  e.respondWith(fetch(q,{cache:'no-cache'}).then(function(r){
    if(r.ok){var k=r.clone();caches.open(C).then(function(c){c.put(q,k);});}
    return r;
  }).catch(function(){return caches.match(q,{ignoreSearch:true}).then(function(m){return m||caches.match('index.html');});}));
});
