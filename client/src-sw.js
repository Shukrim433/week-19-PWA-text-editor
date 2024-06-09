const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

// precache assets will be listed in self.__WB_MANIFEST in the dist service worker (essentially a place holder for the precache assets)
// The precacheAndRoute() method takes an array of URLs to precache. The self._WB_MANIFEST is an array that contains the list of URLs to precache.
precacheAndRoute(self.__WB_MANIFEST);

// check cache first
const pageCache = new CacheFirst({ 
  cacheName: 'page-cache',
  plugins: [
    // caches only successful responses (status 0 or 200).
    new CacheableResponsePlugin({
      statuses: [0, 200], 
    }),
    
    // limits the age of cached responses to 30 days.
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,  
    }),
  ],
});

//  applies the 'pageCache' strategy to specified URLs (e.g., /index.html, /) during the service worker installation to ensure they are available offline immediately.
warmStrategyCache({ 
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// applies the 'pageCache' strategy to all navigation requests, meaning any request for a new page/refresh page will use the caching strategy defined (CacheFirst in this case).
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
registerRoute(
  // Here we define the callback function that will filter the requests we want to cache (in this case, JS and CSS files)
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    // Name of the cache storage.
    cacheName: 'asset-cache',
    plugins: [
      // This plugin will cache responses with these headers to a maximum-age of 30 days
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);



// ** service worker installation - happens in the browser when the user visits the website for the first time or refreshes the page. 
// During this process, the browser registers the service worker script and installs it in the background.

// **  StaleWhileRevalidate strategy means that the service worker will first try to serve the requested files from the cache.
// If the files are found in the cache, they are served to the browser immediately, even if they are stale (outdated). 
// At the same time, the service worker will also check the network for newer versions of these files. If newer versions are available, 
// the service worker will update the cache with the fresh content from the network.