/**
 * Save Manager
 * Handles game saving and loading functionality
 */

const SaveManager = (function() {
    const MAX_SAVE_SLOTS = 5;
    const SAVE_PREFIX = 'journey_save_';
    
    async function saveGame(slotId) {
        if (slotId < 1 || slotId > MAX_SAVE_SLOTS) {
            throw new Error(`Invalid save slot: ${slotId}`);
        }
        
        const gameState = GameState.getState();
        
        const saveData = {
            slotId,
            timestamp: Date.now(),
            gameState,
            metadata: {
                scene: gameState.currentScene,
                friendship: gameState.friendshipLevel,
                trust: gameState.trustLevel,
                version: '1.0.0'
            }
        };
        
        try {
            await StorageManager.saveGame(`slot_${slotId}`, saveData);
            
            // Also save to localStorage as backup
            localStorage.setItem(`${SAVE_PREFIX}${slotId}`, JSON.stringify(saveData));
            
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    }
    
    async function loadGame(slotId) {
        if (slotId < 1 || slotId > MAX_SAVE_SLOTS) {
            throw new Error(`Invalid save slot: ${slotId}`);
        }
        
        try {
            let saveData = await StorageManager.loadGame(`slot_${slotId}`);
            
            // Fallback to localStorage
            if (!saveData) {
                const localData = localStorage.getItem(`${SAVE_PREFIX}${slotId}`);
                if (localData) {
                    saveData = JSON.parse(localData);
                }
            }
            
            if (!saveData) {
                return null;
            }
            
            // Restore game state
            GameState.update(saveData.gameState);
            
            return saveData;
        } catch (e) {
            console.error('Load failed:', e);
            return null;
        }
    }
    
    async function getAllSaves() {
        const saves = [];
        
        for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
            const localData = localStorage.getItem(`${SAVE_PREFIX}${i}`);
            if (localData) {
                try {
                    saves.push(JSON.parse(localData));
                } catch (e) {
                    console.warn(`Corrupted save in slot ${i}`);
                }
            }
        }
        
        // Try IndexedDB
        try {
            const dbSaves = await StorageManager.getAllSaves();
            dbSaves.forEach(save => {
                if (!saves.find(s => s.slotId === save.slotId)) {
                    saves.push(save);
                }
            });
        } catch (e) {
            // Fallback to localStorage only
        }
        
        return saves.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    async function deleteSave(slotId) {
        if (slotId < 1 || slotId > MAX_SAVE_SLOTS) {
            throw new Error(`Invalid save slot: ${slotId}`);
        }
        
        try {
            await StorageManager.deleteSave(`slot_${slotId}`);
            localStorage.removeItem(`${SAVE_PREFIX}${slotId}`);
            return true;
        } catch (e) {
            console.error('Delete failed:', e);
            return false;
        }
    }
    
    function hasAutoSave() {
        return localStorage.getItem(`${SAVE_PREFIX}auto`) !== null;
    }
    
    function autoSave() {
        const gameState = GameState.getState();
        const saveData = {
            slotId: 'auto',
            timestamp: Date.now(),
            gameState,
            metadata: {
                scene: gameState.currentScene,
                autoSave: true
            }
        };
        
        localStorage.setItem(`${SAVE_PREFIX}auto`, JSON.stringify(saveData));
    }
    
    function loadAutoSave() {
        const autoData = localStorage.getItem(`${SAVE_PREFIX}auto`);
        if (autoData) {
            try {
                const saveData = JSON.parse(autoData);
                GameState.update(saveData.gameState);
                return true;
            } catch (e) {
                return false;
            }
        }
        return false;
    }
    
    function formatSaveTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    function getSavePreview(saveData) {
        return {
            slotName: saveData.slotId === 'auto' ? 'Auto Save' : `Slot ${saveData.slotId}`,
            timestamp: formatSaveTime(saveData.timestamp),
            scene: getSceneDisplayName(saveData.metadata?.scene || saveData.gameState?.currentScene),
            friendship: saveData.metadata?.friendship || saveData.gameState?.friendshipLevel || 0,
            trust: saveData.metadata?.trust || saveData.gameState?.trustLevel || 0
        };
    }
    
    function getSceneDisplayName(sceneId) {
        const names = {
            'scene1': 'First Contact',
            'scene2': 'Getting to Know You',
            'scene3': 'Growing Feelings',
            'scene4': 'Trust & Doubt',
            'scene5': 'Confession',
            'scene6': 'Genshin Era',
            'scene7': 'Promise',
            'scene8': 'Assurance',
            'scene9': 'Comfort',
            'scene10': 'Protector',
            'scene11': 'Future Plans',
            'scene12': 'Vision',
            'scene13': 'Ending'
        };
        return names[sceneId] || sceneId;
    }
    
    return {
        saveGame,
        loadGame,
        getAllSaves,
        deleteSave,
        hasAutoSave,
        autoSave,
        loadAutoSave,
        getSavePreview,
        MAX_SAVE_SLOTS
    };
})();