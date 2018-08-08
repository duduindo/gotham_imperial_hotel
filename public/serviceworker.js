
const cssCache = `
	.hotel-slogan { 
		background-color: black; 
	} 

	nav { 
		display: none;
	}
`;

self.addEventListener('fetch', event => {
	if (event.request.url.includes('bootstrap.min.css')) {
		event.respondWith(new Response(cssCache, {headers: {'Content-Type': 'text/css'}} ));
	}
});

