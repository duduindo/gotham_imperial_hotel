
const CACHE_NAME = 'gih-cache-v4';
const CACHED_URLS = [
	// Our HTML
	'index.html',

	// Stylesheets
	'/css/gih.css',
	'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css',
	'https://fonts.googleapis.com/css?family=Lato:300,600,900',

	// JavaScript
	'https://code.jquery.com/jquery-3.0.0.min.js',
	'/js/app.js',

	// Images
	'/img/about-hotel-luxury.jpg',
	'/img/about-hotel-spa.jpg',
	'/img/event-calendar-link.jpg',
	'/img/jumbo-background.jpg',
	'/img/logo-header.png',
	'/img/logo.png',
	'/img/logo-top-background.png',
	'/img/reservation-gih.jpg',
	'/img/switch.png',
];


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
				return cache.match('/index.html').then(cachedResponse => {
					const fetchPromise = fetch('/index.html').then(networkResponse => {
						cache.put('/index.html', networkResponse.clone());
						
						return networkResponse;
					});

					return cachedResponse || fetchPromise;
				});
			})
		);

	} else if (CACHED_URLS.includes(requestURL.href) || CACHED_URLS.includes(requestURL.pathname)) {
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