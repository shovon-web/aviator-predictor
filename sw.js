const CACHE_NAME = 'aviator-forecast-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',

  // CDN libs
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/client',
  'https://aistudiocdn.com/react@^19.1.1/jsx-runtime',
  'https://aistudiocdn.com/@google/genai@^1.20.0',
  'https://aistudiocdn.com/recharts@^3.2.1',
  'https://aistudiocdn.com/tesseract.js@^5.1.0',

  // Local Scripts & Assets
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/services/geminiService.ts',
  '/hooks/useDraggable.ts',
  '/locales/translations.ts',
  '/hooks/useLocalization.ts',
  '/hooks/useOcr.ts',
  '/hooks/useScreenCapture.ts',
  '/ocr.worker.ts',
  
  // Components
  '/components/icons.tsx',
  '/components/WelcomeModal.tsx',
  '/components/Header.tsx',
  '/components/PredictionDisplay.tsx',
  '/components/HistoryView.tsx',
  '/components/Controls.tsx',
  '/components/Settings.tsx',
  '/components/About.tsx',
  '/components/Overlay.tsx',
  '/components/RoiSelector.tsx',
  '/components/ExpertInsights.tsx',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use { cache: 'reload' } to ensure we are not caching a cached response from http cache
        const requests = urlsToCache.map(url => new Request(url, { cache: 'reload' }));
        return cache.addAll(requests);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
