
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

