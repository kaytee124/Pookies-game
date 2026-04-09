/**
 * Offline Handler
 * Manages offline functionality and network status
 */

const OfflineHandler = (function() {
    let isOnline = navigator.onLine;
    let offlineReady = false;
    let statusCallback = null;
    let offlineBanner = null;
    
    function init() {
        // Check initial status
        isOnline = navigator.onLine;
        
        // Set up event listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        if ('serviceWorker' in navigator &&
            (location.protocol === 'http:' || location.protocol === 'https:')) {
            navigator.serviceWorker.ready.then(() => {
                offlineReady = true;
                console.log('Offline mode ready');
            }).catch(() => {});
        }
        
        createOfflineBanner();
    }
    
    function handleOnline() {
        isOnline = true;
        hideOfflineBanner();
        
        if (statusCallback) {
            statusCallback(true);
        }
        
        // Attempt to sync any pending data
        syncPendingData();
        
        console.log('App is online');
    }
    
    function handleOffline() {
        isOnline = false;
        showOfflineBanner();
        
        if (statusCallback) {
            statusCallback(false);
        }
        
        console.log('App is offline - using cached data');
    }
    
    function createOfflineBanner() {
        offlineBanner = document.createElement('div');
        offlineBanner.className = 'offline-banner';
        offlineBanner.textContent = '📡 Offline Mode - Game progress will be saved locally';
        offlineBanner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #FF6B6B;
            color: white;
            text-align: center;
            padding: 8px;
            font-size: 14px;
            z-index: 1000;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        `;
        document.body.appendChild(offlineBanner);
    }
    
    function showOfflineBanner() {
        if (offlineBanner) {
            offlineBanner.style.transform = 'translateY(0)';
            setTimeout(() => {
                if (isOnline) {
                    hideOfflineBanner();
                }
            }, 3000);
        }
    }
    
    function hideOfflineBanner() {
        if (offlineBanner) {
            offlineBanner.style.transform = 'translateY(-100%)';
        }
    }
    
    function syncPendingData() {
        // Check for any actions queued while offline
        const pendingActions = JSON.parse(localStorage.getItem('pendingActions') || '[]');
        
        if (pendingActions.length > 0) {
            console.log(`Syncing ${pendingActions.length} pending actions...`);
            // Process pending actions here
            // For now, just clear them
            localStorage.setItem('pendingActions', '[]');
        }
    }
    
    function queueAction(action) {
        if (!isOnline) {
            const pendingActions = JSON.parse(localStorage.getItem('pendingActions') || '[]');
            pendingActions.push({
                ...action,
                timestamp: Date.now()
            });
            localStorage.setItem('pendingActions', JSON.stringify(pendingActions));
            return true;
        }
        return false;
    }
    
    function isAppOnline() {
        return isOnline;
    }
    
    function isOfflineReady() {
        return offlineReady;
    }
    
    function onStatusChange(callback) {
        statusCallback = callback;
    }
    
    function setOnline(status) {
        if (status && !isOnline) {
            handleOnline();
        } else if (!status && isOnline) {
            handleOffline();
        }
    }
    
    return {
        init,
        isAppOnline,
        isOfflineReady,
        onStatusChange,
        queueAction,
        setOnline
    };
})();