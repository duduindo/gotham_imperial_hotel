
const CACHE_NAME = 'gith-cache';
const CACHE_URLS = [
	'/index-offline.html',
	'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css',
	'/css/gih-offline.css',
	'/img/jumbo-background-sm.jpg',
	'/img/logo-header.png',
];


self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			console.log(cache);

			return cache.addAll(CACHE_URLS);
		})
	);
});


self.addEventListener('fetch', event => {
	event.respondWith(
		// Fetch
		fetch(event.request).catch(() => {

			// Cache
			return caches.match(event.request).then(response => {
				console.warn('Response:', response);
				console.warn('Event: ', event.request.headers.get('accept').includes('text/html'));

				if (response) {
					return response;
				} else if (event.request.headers.get('accept').includes('text/html')) {
					return caches.match('/index-offline.html');
				}
			});


		})
	);
});
