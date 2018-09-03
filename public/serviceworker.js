

self.addEventListener('install', () => {
  console.log('install');
});

self.addEventListener('activate', () => {
  console.log('activate');
});

self.addEventListener('fetch', event => {
  const hasBootstrap = event.request.url.includes('bootstrap.min.css');

  if (hasBootstrap) {
    console.log(`Fetch request for: ${event.request.url}`);

    event.respondWith(
      new Response('.hotel-slogan { background: green !important; } nav { display: none; }', { headers: { 'Content-Type': 'text/css' } })
    );
  }
});