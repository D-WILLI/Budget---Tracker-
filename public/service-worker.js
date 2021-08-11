const FILES_TO_CACHE = 
[
    "/", "/index.html", "index.js", "/db.js", "/style.css"
];
const DATA_CACHE_NAME = "data-cache-v1";

const CACHE_NAME = "static-cache-v2";


self.addEventListener("install", function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
    );
  });
  self.addEventListener("fetch", evt => {
    if (evt.request.url.includes('/api/')) {
        console.log('[Service Worker] Fetch(data)', evt.request.url);

        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                    .then(response => {
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }
                        return response;
                    })
                    .catch(err => {
                        return cache.match(evt.request);
                    });
            })
        );
        return;
    }
  
    evt.respondWith(
      fetch(evt.request).catch(function() {
        return caches.match(evt.request).then(function(response) {
          if (response) {
            return response;
          } else if (evt.request.headers.get("accept").includes("text/html")) {
            return caches.match("/");
          }
        });
      })
    );
  });
  