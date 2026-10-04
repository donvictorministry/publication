var CACHE = 'dvpw-v8';
var FILES = ['./', 'index.html', 'contents.html', 'foreword.html', 'preface.html', 'introduction-the-unclaimed-mantle.html', 'chapter-1-the-prophetic-witness.html', 'chapter-2-mapping-the-terrain.html', 'chapter-3-a-framework-for-formation.html', 'chapter-4-from-theory-to-practice.html', 'chapter-5-interpreting-the-outcomes.html', 'chapter-6-writing-the-vision.html', 'chapter-7-conclusion.html', 'about-the-author.html', 'references.html', 'contact.html', 'engage.html', 'search.js', 'engage.js', 'styles.css', 'app.js', '404.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (n) { return n !== CACHE; }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
    var net = fetch(e.request).then(function (r) {
      if (r && r.ok) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, cp); }); }
      return r;
    }).catch(function () { return hit; });
    return hit || net;
  }));
});
