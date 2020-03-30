const FILES_TO_CACHE = [
    "/",
    "/db.js",
    "/index.js",
    "/manifest.json",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
  ];
  
  const CACHE_NAME = "super-cache-name";
  const DATA_CACHE_NAME = "super-data-cache-name";
  

  self.addEventListener('install', function(evt) {
    evt.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        console.log("Your files were pre-cached successfully!");
        return cache.addAll(FILES_TO_CACHE);
      })
    );

    self.skipWaiting();
  });

  self.addEventListener("fetch", function(event){
      if(event.request.url.includes("/api")){
          event.respondWith(
              caches.open(DATA_CACHE_NAME).then(cache =>{
                  return fetch(event.request)
                  .then(response => {

                    if(response.status === 200){
                        cache.put(event.request.url, response.clone());
                    }
                    return response;
                  })
                  .catch(err => console.log(err))
              })
          );
              return;
        }

        event.respondWith(
            fetch(event.request).catch(function() {
              return caches.match(event.request).then(function(response) {
                if (response) {
                  return response;
                } else if (event.request.headers.get("accept").includes("text/html")) {
                  return caches.match("/");
                }
              });
            })
          );
  })