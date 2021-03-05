/// here goes the other code

function updateCacheDynamic(cacheName, req, res) {
  return caches.open(cacheName).then((cache) => {
    cache.put(req, res.clone());
  });
}
// // esta funcion guarda los archivos en el cache dynamico

// function setDynamicCaches(dynamicName, req, res) {
//   if (res.ok) {
//     // retornar y actualizar nuestro cache dynamico
//     return caches.open(dynamicName).then((cache) => {
//       cache.put(req, res.clone());
//       return res.clone();
//     });
//   } else {
//     // no podemos hacer nada porque el usuario no pudo ir ni a la web ni al cache a obtener la info
//     console.log("No se puede alcanzar la peticion requerida");
//     return res;
//   }
// }
