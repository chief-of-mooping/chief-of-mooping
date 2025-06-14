const CACHE_NAME = "blockchain-trace-cache-v1";
const urlsToCache = ["index.html", "blockchain.js", "style.css", "manifest.json", "app-icon.png"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
