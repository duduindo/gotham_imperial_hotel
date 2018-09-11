
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
	event.respondWith(
		fetch(event.request).catch(() => {
			return caches.match(event.request).then(response => {				
				if (response) {
					return response;
				} else if (event.request.headers.get('accept').includes('text/html')) {					
					return caches.match('/index.html');
				}
			});
		})
	);
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