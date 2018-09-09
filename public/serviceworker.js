/**
 * Chapert - 5 Embracing Offline-Fisrt
 */

/**
 * Cache Only
 * - Respond to all requests for a resource with a response from the cache
 */
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
  );
});


/**
 * Cache, falling back to network
 * - Similiar to cache only, thie pattern will respond to requests with content from the cache.
 */
 self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    });
  );
 });



/**
 * Network only
 * - The classic model of the web. Try to fetch the request from the network
 */
self.addEventListener('fetch', fetch => {
  event.respondWith(
    fetch(event.request);
  );
});

/**
 * Network, falling back to cache
 * - Always fetch the request from the network
 */
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

/**
 * Cache, then network
 * - Display data from the cache immediately while checking the network fro a more up-to-date version.
 */
// nothing


/**
 * Generic fallback
 * - When the content the user asked for could not be found in the cache, and the network is not available, 
 *   this pattern returns an alternate "default fallback" from the cache instead of returning an error.
 */
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then(response => {
        return response || caches.match('/generic.png');
      });
    })
  );
});