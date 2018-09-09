// https://github.com/duduindo/gotham_imperial_hotel/blob/ch04-start/public/serviceworker.js

// Exemplo: https://www.talater.com/adderall/
// In your service worker
/** 
 * importScripts é uma função nativa:
 *  - https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts 
 */
importScripts('https://cdnjs.cloudflare.com/ajax/libs/cache.adderall/1.0.0/cache.adderall.js');


var STATIC_FILES = [
  'video/cache.adderall.demo.mp4',
  '/bootstrap/3.3.7/css/bootstrap.min.css',
  '/js/2.6.0/annyang.min.js'
];

var MUTABLE_FILES = [
  'app-settings.json',
  'index.html'
];


self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('cache-v2').then(cache => {
      return adderall.addAll(cache, STATIC_FILES, MUTABLE_FILES);
    })
  );
});