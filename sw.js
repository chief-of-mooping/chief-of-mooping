
const CACHE_NAME = "research-assistant-cache-v1";
const urlsToCache = [
  "index.html",
  "core_theories.json",
  "research_methods.json",
  "stats_tools.json",
  "sdgs.json",
  "logic.js",
  "render.js",
  "ResultBlock.js",
  "icons/app-icon.png"
];

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
