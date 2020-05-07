self.addEventListener('install', function (event) {
  console.log('service worker has been installed');
});

self.addEventListener('fetch', event => {
  console.log('service worker has fetched a resource');
});
