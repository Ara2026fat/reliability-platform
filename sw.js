/* HIRZ service worker: network first, cached copy when offline. Required for install on Android.
   The app shell is precached on install so home and tools open offline after the first visit.
   Large promo/media videos are never cached. */
var C='hirz-v6';
var SHELL=['./','index.html','manifest.webmanifest','owner.jpg','hirz-logo.png','hirz-mark.png','hirz-big.jpg','platform-favicon-32.png?v=5','platform-apple-touch.png?v=5','platform-icon-192.png?v=5','platform-icon-512.png?v=5','platform-icon-maskable-512.png?v=5'];
function big(r,u){return /\.(mp4|webm|mov|m4v|mp3|wav)$/i.test(u.pathname)||u.pathname.indexOf('/promo/vid/')>-1||r.destination==='video'||r.destination==='audio'||r.headers.has('range')}
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return Promise.all(SHELL.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
  if(big(r,u))return;
  e.respondWith(fetch(r).then(function(res){if(res&&res.ok&&res.status===200){var c=res.clone();caches.open(C).then(function(x){x.put(r,c)}).catch(function(){})}return res}).catch(function(){return caches.match(r).then(function(m){return m||caches.match(r,{ignoreSearch:true})}).then(function(m){return m||(r.mode==='navigate'?caches.match('index.html').then(function(h){return h||caches.match('./')}):Response.error())})}))});
