import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Cache only this build's local files. There are no external assets or API calls.
function offlineWorkshop() {
  return {
    name: 'offline-workshop',
    generateBundle(_, bundle) {
      const files = [...new Set(['/', '/index.html', '/simple-speaking-guide.html', '/facilitator-guide.html', '/activity-cards.html', '/images/event-opening.webp', '/images/coffee-packaging.webp', '/images/event-conversations.webp', '/image-credits.txt', ...Object.keys(bundle).map(name => `/${name}`)])];
      const version = Object.keys(bundle).filter(name => name.endsWith('.js')).join('-');
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: `
const CACHE = ${JSON.stringify('founder-lab-' + version)};
const FILES = ${JSON.stringify(files)};
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('founder-lab-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
` });
    },
  };
}

export default defineConfig({ plugins: [react(), offlineWorkshop()] });
