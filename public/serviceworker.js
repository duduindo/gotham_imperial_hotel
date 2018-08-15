
const cssCache = `
	.hotel-slogan { 
		background-color: black; 
	} 

	nav { 
		display: none;
	}
`;

self.addEventListener('fetch', event => {
	event.respondWith(
		fetch(event.request).catch(() => {
			return new Response(`
				Welcome to the Gotham Imperial Hotel.
				There seems to be a problem with your connection.
				We look forward to telling you about our hotel as sons as you go online
			`)
		})
	);
});

