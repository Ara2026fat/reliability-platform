/* HIRZ service worker: network first, cached copy when offline. Required for install on Android. */
var C='hirz-v1';
self.addEventListener('install',function(e){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r).then(function(res){if(res&&res.ok){var c=res.clone();caches.open(C).then(function(x){x.put(r,c)})}return res}).catch(function(){return caches.match(r).then(function(m){return m||caches.match('./')})}))});
