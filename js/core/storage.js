/**
 * Enhanced Storage Management
 * Handles IndexedDB for larger assets and LocalStorage for state
 */

const StorageManager = (function() {
    const DB_NAME = 'JourneyGameDB';
    const DB_VERSION = 1;
    let db = null;
    
    // Initialize IndexedDB
    async function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                db = request.result;
                resolve(db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Store for cached images
                if (!db.objectStoreNames.contains('images')) {
                    db.createObjectStore('images', { keyPath: 'url' });
                }
                
                // Store for dialogue data
                if (!db.objectStoreNames.contains('dialogue')) {
                    db.createObjectStore('dialogue', { keyPath: 'sceneId' });
                }
                
                // Store for save files
                if (!db.objectStoreNames.contains('saves')) {
                    const saveStore = db.createObjectStore('saves', { keyPath: 'slotId' });
                    saveStore.createIndex('timestamp', 'timestamp');
                }
            };
        });
    }
    
    // Cache image for offline use
    async function cacheImage(url, blob) {
        if (!db) await initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['images'], 'readwrite');
            const store = transaction.objectStore('images');
            const request = store.put({ url, blob, timestamp: Date.now() });
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
    
    // Get cached image
    async function getCachedImage(url) {
        if (!db) await initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['images'], 'readonly');
            const store = transaction.objectStore('images');
            const request = store.get(url);
            
            request.onsuccess = () => resolve(request.result?.blob || null);
            request.onerror = () => reject(request.error);
        });
    }
    
    // Save game to slot
    async function saveGame(slotId, saveData) {
        if (!db) await initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['saves'], 'readwrite');
            const store = transaction.objectStore('saves');
            const request = store.put({
                slotId,
                data: saveData,
                timestamp: Date.now(),
                scene: saveData.currentScene
            });
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
    
    // Load game from slot
    async function loadGame(slotId) {
        if (!db) await initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['saves'], 'readonly');
            const store = transaction.objectStore('saves');
            const request = store.get(slotId);
            
            request.onsuccess = () => resolve(request.result?.data || null);
            request.onerror = () => reject(request.error);
        });
    }
    
    // Get all save slots
    async function getAllSaves() {
        if (!db) await initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['saves'], 'readonly');
            const store = transaction.objectStore('saves');
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }
    
    // Delete save slot
    async function deleteSave(slotId) {
        if (!db) await initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['saves'], 'readwrite');
            const store = transaction.objectStore('saves');
            const request = store.delete(slotId);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
    
    // Clear all cached data
    async function clearCache() {
        if (!db) await initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['images', 'dialogue'], 'readwrite');
            
            transaction.objectStore('images').clear();
            transaction.objectStore('dialogue').clear();
            
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }
    
    return {
        initDB,
        cacheImage,
        getCachedImage,
        saveGame,
        loadGame,
        getAllSaves,
        deleteSave,
        clearCache
    };
})();