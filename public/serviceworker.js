
const CACHE_NAME = 'gih-cache-v5';
const CACHED_URLS = [
	// Our HTML
	'/index.html',
  '/my-account.html',

	// Stylesheets
	'/css/gih.css',
	'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css',
	'https://fonts.googleapis.com/css?family=Lato:300,600,900',

	// JavaScript
	'https://code.jquery.com/jquery-3.0.0.min.js',
	'/js/app.js',
	'/js/offline-map.js',
  '/js/my-account.js',
  '/reservations.json',

	// Images
	'/img/about-hotel-luxury.jpg',
	'/img/about-hotel-spa.jpg',
	'/img/event-calendar-link.jpg',
	'/img/event-default.jpg',
	'/img/jumbo-background.jpg',
	'/img/logo-header.png',
	'/img/logo.png',
	'/img/logo-top-background.png',
	'/img/map-offline.jpg',
	'/img/reservation-gih.jpg',
	'/img/switch.png',
];

const googleMapsAIPJS = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDm9jndhfbcWByQnrivoaWAEQA8jy3COdE&callback=initMap';


self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll(CACHED_URLS);
		})
	);
});


self.addEventListener('fetch', event => {
	const requestURL = new URL(event.request.url);

	if (requestURL.pathname === '/' || requestURL.pathname === '/index.html') {
		event.respondWith(
			caches.open(CACHE_NAME).then(cache => {
				return cache.match('/index.html').then(cacheResponse => {
					const fetchPromise = fetch('/index.html').then(networkResponse => {
						cache.put('/index.html', networkResponse.clone());

						return networkResponse;
					});

					return cacheResponse || fetchPromise;
				});
			})
		);
	}


  // My account
  else if (requestURL.pathname === '/my-account') {
    event.respondWith(
      caches.match('/my-account.html').then(response => {
        return response || fetch('/my-account.html');
      })
    );
  }

  // Reservation json
  else if (requestURL.pathname === '/reservations.json') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());

          return networkResponse;
        }).catch(() => {
          return caches.match(event.request);
        });
      })
    );
  }

	// Handle requests for Google Maps JavaScript API file
	else if (requestURL.href === googleMapsAIPJS) {
		event.respondWith(
			fetch(`${googleMapsAIPJS}&${Date.now()}`, {mode: 'no-cors', cache: 'no-store'})
				.catch(() => {
					return caches.match('/js/offline-map.js');
				})
		);
	}

	// Handle requests for events JSON file
	else if (requestURL.pathname === '/events.json') {
		event.respondWith(
			caches.open(CACHE_NAME).then(cache => {
				return fetch(event.request).then(networkResponse => {
					cache.put(event.request, networkResponse.clone());

					return networkResponse;
				}).catch(() => {
					return caches.match(event.request);
				});
			})
		);
	}

	// Handle request for event images
	else if (requestURL.pathname.startsWith('/img/event-')) {
		event.respondWith(
			caches.open(CACHE_NAME).then(cache => {
				return cache.match(event.request).then(cacheResponse => {
					return cacheResponse || fetch(event.request).then(networkResponse => {
						cache.put(event.request, networkResponse.clone());

						return networkResponse;
					}).catch(() => {
						return cache.match('/img/event-default.jpg');
					});
				});
			})
		);
	}

	// Handle analytics requests
	else if (requestURL.host === 'www.google-analytics.com') {
		event.respondWith(fetch(event.request));
	}

	// Handle requests for files cached during installation
	else if (CACHED_URLS.includes(requestURL.href) || CACHED_URLS.includes(requestURL.pathname)) {
		event.respondWith(
			caches.open(CACHE_NAME).then(cache => {
				return cache.match(event.request).then(response => {
					return response || fetch(event.request);
				});
			})
		);
	}
});


self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					if (CACHE_NAME !== cacheName && cacheName.startsWith('gih-cache')) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});
