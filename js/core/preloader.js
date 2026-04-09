/**
 * Asset Preloader
 * Ensures all required assets are loaded before game starts
 */

const Preloader = (function() {
    const criticalAssets = [
        'assets/images/avatars/guy/idle.png',
        'assets/images/avatars/girl/idle.png',
        'assets/images/backgrounds/discord-server.png'
    ];
    
    const allAssets = [
        // Guy expressions
        'assets/images/avatars/guy/happy.png',
        'assets/images/avatars/guy/sad.png',
        'assets/images/avatars/guy/nervous.png',
        'assets/images/avatars/guy/excited.png',
        'assets/images/avatars/guy/blush.png',
        'assets/images/avatars/guy/hero.png',
        'assets/images/avatars/guy/chef.png',
        'assets/images/avatars/guy/sleepy.png',
        
        // Girl expressions
        'assets/images/avatars/girl/happy.png',
        'assets/images/avatars/girl/sad.png',
        'assets/images/avatars/girl/nervous.png',
        'assets/images/avatars/girl/excited.png',
        'assets/images/avatars/girl/blush.png',
        'assets/images/avatars/girl/princess.png',
        'assets/images/avatars/girl/bunny.png',
        'assets/images/avatars/girl/sleepy.png',
        
        // Backgrounds
        'assets/images/backgrounds/sunset-chat.png',
        'assets/images/backgrounds/night-call.png',
        'assets/images/backgrounds/genshin-landscape.png',
        'assets/images/backgrounds/fantasy-night.png',
        'assets/images/backgrounds/food-district.png',
        'assets/images/backgrounds/horizon-ending.png',
        'assets/images/backgrounds/house-building.png',
        'assets/images/backgrounds/dreamy-hearts.png',
        'assets/images/backgrounds/pastel-rainbow.png',
        'assets/images/backgrounds/soft-evening.png',
        
        // Effects
        'assets/images/effects/heart.png',
        'assets/images/effects/sparkle.png',
        'assets/images/effects/crown.png',
        'assets/images/effects/bunny-ears.png',
        'assets/images/effects/sword.png'
    ];
    
    let loadedCount = 0;
    let totalAssets = 0;
    let progressCallback = null;
    
    async function preloadCritical() {
        totalAssets = criticalAssets.length;
        loadedCount = 0;
        
        const promises = criticalAssets.map(url => loadAsset(url));
        await Promise.all(promises);
        
        return true;
    }
    
    async function preloadAll(onProgress) {
        progressCallback = onProgress;
        totalAssets = allAssets.length;
        loadedCount = 0;
        
        // Load in batches to not overwhelm browser
        const batchSize = 5;
        for (let i = 0; i < allAssets.length; i += batchSize) {
            const batch = allAssets.slice(i, i + batchSize);
            const promises = batch.map(url => loadAsset(url));
            await Promise.all(promises);
        }
        
        return true;
    }
    
    function resolveUrl(url) {
        if (/^https?:\/\//i.test(url)) return url;
        const root = (typeof window.getAssetRoot === 'function') ? window.getAssetRoot() : '';
        return root + url;
    }

    function loadAsset(url) {
        return new Promise((resolve, reject) => {
            const fullUrl = resolveUrl(url);
            if (url.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    updateProgress();
                    resolve(url);
                };
                img.onerror = () => {
                    console.warn(`Failed to load: ${fullUrl}`);
                    loadedCount++;
                    updateProgress();
                    resolve(url);
                };
                img.src = fullUrl;
            } else {
                fetch(fullUrl)
                    .then(() => {
                        loadedCount++;
                        updateProgress();
                        resolve(url);
                    })
                    .catch(() => {
                        loadedCount++;
                        updateProgress();
                        resolve(url);
                    });
            }
        });
    }
    
    function updateProgress() {
        const progress = (loadedCount / totalAssets) * 100;
        
        // Update loading bar if exists
        const progressBar = document.getElementById('loading-progress');
        const loadingText = document.getElementById('loading-text');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        if (loadingText) {
            loadingText.textContent = `Loading assets... ${Math.round(progress)}%`;
        }
        
        if (progressCallback) {
            progressCallback(progress, loadedCount, totalAssets);
        }
    }
    
    function getProgress() {
        return totalAssets > 0 ? (loadedCount / totalAssets) * 100 : 0;
    }
    
    return {
        preloadCritical,
        preloadAll,
        getProgress
    };
})();