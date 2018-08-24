
self.addEventListener('install', event => {
	event.waitUntil(
			caches.open('gith-cache').then(cache => {
				return cache.add('/index-offline.html');
			})
	);
});


self.addEventListener('fetch', event => {
	event.respondWith(
		fetch(event.request).catch(() => {
			return caches.match('/index-offline.html');
		})
	);
});