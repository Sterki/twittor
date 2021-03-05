// imports
importScripts("js/sw-utils.js");

const STATIC_CACHE = "static-v4";
const DYNAMIC_CACHE = "dynamic-v1";
const INMUTABLE_CACHE = "inmutable-v1";

// proceso de instalacion del service worker y de todos los archivos que vamos a necesitar
self.addEventListener("install", (e) => {
  const cachestatic = caches
    .open(STATIC_CACHE)
    .then((cache) => {
      cache
        .addAll([
          "/",
          "index.html",
          "css/style.css",
          "js/app.js",
          "img/favicon.ico",
          "img/avatars/hulk.jpg",
          "img/avatars/ironman.jpg",
          "img/avatars/spiderman.jpg",
          "img/avatars/thor.jpg",
          "img/avatars/wolverine.jpg",
        ])
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });

  const cacheinmutable = caches
    .open(INMUTABLE_CACHE)
    .then((cache) => {
      cache
        .addAll([
          "https://fonts.googleapis.com/css?family=Quicksand:300,400",
          "https://fonts.googleapis.com/css?family=Lato:400,300",
          "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
          "js/libs/jquery.js",
          "css/animate.css",
        ])
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });

  const promisecaches = Promise.all([cachestatic, cacheinmutable]);
  e.waitUntil(promisecaches);
});
// ahora vamos a crear un listener para borrar los caches viejos que no serviran y que seran versiones viejas

self.addEventListener("activate", (e) => {
  // this is to delete the old cache from our cache storage
  const cacheToDelete = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== STATIC_CACHE && key.includes("static")) {
        return caches.delete(key);
      }
    });
  });
  e.waitUntil(cacheToDelete);
});

// estrategies cache with network fallback

self.addEventListener("fetch", (e) => {
  const cacheOnly = caches.match(e.request).then((resp) => {
    if (resp) {
      return resp;
    } else {
      return fetch(e.request).then((newResp) => {
        if (newResp.ok) {
          updateCachedynamic(DYNAMIC_CACHE, e.request, newResp);
          return newResp.clone();
        }
      });
    }
  });
  e.respondWith(cacheOnly);
});
