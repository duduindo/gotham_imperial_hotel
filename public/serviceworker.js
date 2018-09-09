// https://github.com/duduindo/gotham_imperial_hotel/blob/ch04-start/public/serviceworker.js


const immutableRequests = [
  '/fancy__header_background.mp4',
  '/vendor/bootstrap/3.3.7/bootstrap.min.css',
  '/css/style-v355.css',
];

const mutableRequests = [
  'app-settings.json',
  'index.html',
];


self.addEventListener('install', event => {    
  event.waitUntil(
    caches.open('cache-v2').then(cache => {
      const newImmutableRequests = [];

      return Promise.all(
        immutableRequests.map(url => {
          return caches.match(url).then(response => {
            if (response) {
              return cache.put(url, response);
            } else {
              newImmutableRequests.push(url);
              return Promise.resolve();
            }
          });
        })
      ).then(() => {
        return cache.addAll(newImmutableRequests.concat(mutableRequests));
      })
    })
  );
});