/**
 * Global Game State Management
 * Handles all persistent state across scenes
 */

const GameState = (function() {
    // Private state
    let state = {
        // Player Progress
        currentScene: 'scene1',
        previousScene: null,
        
        // Relationship Variables (Affect dialogue/options)
        friendshipLevel: 0,        // 0-100
        trustLevel: 0,            // 0-100
        romanceFlag: false,
        
        // Flags for branching
        confessedFeelings: false,
        pictureShared: false,
        callHappened: false,
        officiallyDating: false,
        genshinEraUnlocked: false,
        endingTriggered: null,
        enthusiastic_start: false,
        hesitant_start: false,
        platonicBesties: false,
        platonicPathScore: 0,
        
        // Choice History (for debugging/achievements)
        choicesMade: [],
        
        // Timestamps
        gameStartTime: null,
        lastSaveTime: null,
        
        scene1Branch: 'A',
        scene2Branch: 'A',
        scene3Branch: 'A',
        scene6Branch: 'A',
        
        // Settings
        textSpeed: 52,            // ms per character (slower = easier to read)
        dialogueAdvanceWaitMs: 20000, // auto-advance after this many ms; set 0 for click-only
        autoAdvance: false,
        soundEnabled: true,
        musicEnabled: true,
        sfxVolume: 0.7,
        musicVolume: 0.5,
        
        // Unlocked content
        galleryUnlocked: [],
        endingsSeen: []
    };
    
    // Getters
    function getState() {
        return { ...state };
    }
    
    function get(key) {
        return state[key];
    }
    
    // Setters
    function set(key, value) {
        if (state.hasOwnProperty(key)) {
            state[key] = value;
            saveToLocalStorage();
            return true;
        }
        return false;
    }
    
    function update(updates) {
        Object.keys(updates).forEach(key => {
            if (state.hasOwnProperty(key)) {
                state[key] = updates[key];
            }
        });
        saveToLocalStorage();
    }
    
    // Friendship/Relationship modifiers
    function addFriendship(amount) {
        state.friendshipLevel = Math.min(100, Math.max(0, state.friendshipLevel + amount));
        saveToLocalStorage();
    }
    
    function addTrust(amount) {
        state.trustLevel = Math.min(100, Math.max(0, state.trustLevel + amount));
        saveToLocalStorage();
    }
    
    // Choice tracking
    function recordChoice(choiceId, choiceText) {
        state.choicesMade.push({
            id: choiceId,
            text: choiceText,
            timestamp: Date.now(),
            scene: state.currentScene
        });
        saveToLocalStorage();
    }
    
    // Reset game
    function reset() {
        const startTime = state.gameStartTime;
        state = {
            currentScene: 'scene1',
            previousScene: null,
            friendshipLevel: 0,
            trustLevel: 0,
            romanceFlag: false,
            confessedFeelings: false,
            pictureShared: false,
            callHappened: false,
            officiallyDating: false,
            genshinEraUnlocked: false,
            endingTriggered: null,
            enthusiastic_start: false,
            hesitant_start: false,
            platonicBesties: false,
            platonicPathScore: 0,
            choicesMade: [],
            gameStartTime: startTime || Date.now(),
            lastSaveTime: null,
            textSpeed: 52,
            dialogueAdvanceWaitMs: 20000,
            autoAdvance: false,
            scene1Branch: 'A',
            scene2Branch: 'A',
            scene3Branch: 'A',
            scene6Branch: 'A',
            soundEnabled: true,
            musicEnabled: true,
            sfxVolume: 0.7,
            musicVolume: 0.5,
            galleryUnlocked: state.galleryUnlocked || [],
            endingsSeen: state.endingsSeen || []
        };
        saveToLocalStorage();
    }
    
    // LocalStorage persistence
    function saveToLocalStorage() {
        try {
            state.lastSaveTime = Date.now();
            localStorage.setItem('journeyGameState', JSON.stringify(state));
        } catch (e) {
            console.warn('Failed to save game state:', e);
        }
    }
    
    function loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('journeyGameState');
            if (saved) {
                const parsed = JSON.parse(saved);
                state = { ...state, ...parsed };
                return true;
            }
        } catch (e) {
            console.warn('Failed to load game state:', e);
        }
        return false;
    }
    
    function hasSavedGame() {
        return localStorage.getItem('journeyGameState') !== null;
    }
    
    // Initialize
    function init() {
        if (!state.gameStartTime) {
            state.gameStartTime = Date.now();
        }
        saveToLocalStorage();
    }
    
    // Public API
    return {
        getState,
        get,
        set,
        update,
        addFriendship,
        addTrust,
        recordChoice,
        reset,
        saveToLocalStorage,
        loadFromLocalStorage,
        hasSavedGame,
        init
    };
})();