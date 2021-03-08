// importar la funcion
importScripts("js/sw-utils.js");

// variables de los caches name
const STATIC_CACHE = "static-cache-v3";
const DYNAMIC_CACHE = "dynamic-cache-v1";
const INMUTABLE_CACHE = "inmutable-cache-v1";

// aqui vamos a instalar el service worker con toda la informacion detallada en sus respectivos caches, para llevar un orden de todo

self.addEventListener("install", (e) => {
  const cachestatic = caches.open(STATIC_CACHE).then((cache) => {
    cache.addAll([
      // "/",
      "index.html",
      "css/style.css",
      "js/app.js",
      "img/favicon.ico",
      "img/avatars/hulk.jpg",
      "img/avatars/ironman.jpg",
      "img/avatars/spiderman.jpg",
      "img/avatars/thor.jpg",
      "img/avatars/wolverine.jpg",
    ]);
  });
  const inmutablecache = caches.open(INMUTABLE_CACHE).then((cache) => {
    cache.addAll([
      "https://fonts.googleapis.com/css?family=Quicksand:300,400",
      "https://fonts.googleapis.com/css?family=Lato:400,300",
      "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
      "js/libs/jquery.js",
      "css/animate.css",
    ]);
  });
  const promiseList = Promise.all([cachestatic, inmutablecache]);
  e.waitUntil(promiseList);
});

// ELIMINAR TODO EL CACHE VIEJO
self.addEventListener("activate", (e) => {
  const deleteCache = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== STATIC_CACHE && key.includes("static")) {
        return caches.delete(key);
      }
    });
  });
  e.waitUntil(deleteCache);
});

// UTILIZAR LAS ESTRATEGIAS DEL CACHE PARA MANEJAR NUESTROS CACHES. EN ESTE CASI USAREMOS CACHE WITH NETWORK FALLBACK

self.addEventListener("fetch", (e) => {
  const cachewithnetworkfallback = caches.match(e.request).then((cacheResp) => {
    if (cacheResp) {
      return cacheResp;
    } else {
      // returna el network fallaback
      return fetch(e.request).then((webResp) => {
        if (webResp.ok) {
          updateCacheDynamic(DYNAMIC_CACHE, e.request, webResp);
          return webResp.clone();
        } else {
          console.log(
            "Hubo un error con la peticion no se encuentra hdisponible!"
          );
        }
      });
    }
  });

  e.respondWith(cachewithnetworkfallback);
});
