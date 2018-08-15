
const responseContent = `
	<html>
		<head>
			<style>
				body { text-align: center; background-color: #333; color: #eee; }
			</style>
		</head>
		<body>
			<h1>Gotham Imperial Hotel</h1>
			<p>There seems to be a problem with your connection.</p>
			<p>We look forward to telling you about our hotel as sons as you go online.</p>
		</body>
	</html>				
`;


self.addEventListener('fetch', event => {
	event.respondWith(
		fetch(event.request).catch(() => {
			return new Response(responseContent, { headers: {'Content-Type': 'text/html'} });
		})
	);
});

