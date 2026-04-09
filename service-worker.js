/**
 * Service Worker for JOURNEY Game
 * Enables offline play and asset caching
 */

const CACHE_NAME = 'journey-game-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    
    // CSS
    '/css/main.css',
    '/css/components.css',
    '/css/animations.css',
    '/css/responsive.css',
    
    // JS Core
    '/js/main.js',
    '/js/core/gameState.js',
    '/js/core/storage.js',
    '/js/core/router.js',
    '/js/core/preloader.js',
    
    // JS Components
    '/js/components/avatar.js',
    '/js/components/textBox.js',
    '/js/components/choiceButtons.js',
    '/js/components/bubble.js',
    '/js/components/background.js',
    
    // JS Data
    '/js/data/dialogue.js',
    '/js/data/choices.js',
    '/js/data/paths.js',
    
    // JS Scenes
    '/js/scenes/sceneManager.js',
    
    // JS Utils
    '/js/utils/audioManager.js',
    '/js/utils/saveManager.js',
    '/js/utils/offlineHandler.js',
    
    // Assets - Avatars
    '/assets/images/avatars/guy/idle.png',
    '/assets/images/avatars/guy/happy.png',
    '/assets/images/avatars/guy/sad.png',
    '/assets/images/avatars/guy/nervous.png',
    '/assets/images/avatars/guy/excited.png',
    '/assets/images/avatars/guy/blush.png',
    '/assets/images/avatars/guy/hero.png',
    '/assets/images/avatars/guy/chef.png',
    '/assets/images/avatars/guy/sleepy.png',
    
    '/assets/images/avatars/girl/idle.png',
    '/assets/images/avatars/girl/happy.png',
    '/assets/images/avatars/girl/sad.png',
    '/assets/images/avatars/girl/nervous.png',
    '/assets/images/avatars/girl/excited.png',
    '/assets/images/avatars/girl/blush.png',
    '/assets/images/avatars/girl/princess.png',
    '/assets/images/avatars/girl/bunny.png',
    '/assets/images/avatars/girl/sleepy.png',
    
    // Assets - Backgrounds
    '/assets/images/backgrounds/discord-server.png',
    '/assets/images/backgrounds/sunset-chat.png',
    '/assets/images/backgrounds/night-call.png',
    '/assets/images/backgrounds/genshin-landscape.png',
    '/assets/images/backgrounds/fantasy-night.png',
    '/assets/images/backgrounds/food-district.png',
    '/assets/images/backgrounds/karaoke-room.png',
    '/assets/images/backgrounds/arcade.png',
    '/assets/images/backgrounds/horizon-ending.png',
    '/assets/images/backgrounds/house-building.png',
    '/assets/images/backgrounds/dreamy-hearts.png',
    '/assets/images/backgrounds/pastel-rainbow.png',
    '/assets/images/backgrounds/soft-evening.png',
    
    // Assets - Effects
    '/assets/images/effects/heart.png',
    '/assets/images/effects/sparkle.png',
    '/assets/images/effects/tear.png',
    '/assets/images/effects/confetti.png',
    '/assets/images/effects/crown.png',
    '/assets/images/effects/bunny-ears.png',
    '/assets/images/effects/sword.png',
    '/assets/images/effects/shield.png',
    
    // Fonts
    '/assets/fonts/pixel-font.woff2',
    '/assets/fonts/pixel-font-bold.woff2',
    
    // Pages
    '/pages/ending-ignore.html',
    '/pages/ending-drift.html',
    '/pages/ending-fear.html',
    '/pages/ending-secret.html'
];

// Install event - cache all assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[SW] Skip waiting');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[SW] Claiming clients');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip chrome-extension requests
    if (event.request.url.startsWith('chrome-extension://')) return;
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached response
                    return cachedResponse;
                }
                
                // Not in cache, fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Cache the new response if valid
                        if (response && response.status === 200) {
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        return response;
                    })
                    .catch(() => {
                        // Offline fallback for HTML pages
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                        
                        // Return nothing for other resources
                        return new Response('Offline', { status: 503 });
                    });
            })
    );
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});