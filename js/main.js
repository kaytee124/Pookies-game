/**
 * Main Entry Point
 * Initializes the game and handles global events
 */

(function() {
    'use strict';
    
    // DOM Elements
    const loadingScreen = document.getElementById('loading-screen');
    const titleScreen = document.getElementById('title-screen');
    const gameContainer = document.getElementById('game-container');
    const pauseMenu = document.getElementById('pause-menu');
    const menuButton = document.getElementById('menu-button');
    
    // Buttons
    const startBtn = document.getElementById('start-game');
    const continueBtn = document.getElementById('continue-game');
    const resumeBtn = document.getElementById('resume-btn');
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    const restartBtn = document.getElementById('restart-btn');
    const quitBtn = document.getElementById('quit-btn');
    const galleryBtn = document.getElementById('gallery-btn');
    
    // Game state
    let gameStarted = false;
    let isPaused = false;
    
    // Initialize game
    async function init() {
        // Initialize core systems
        GameState.init();
        OfflineHandler.init();
        await StorageManager.initDB();
        
        // Initialize components
        TextBox.init();
        AudioManager.init();
        
        // Check for saved game
        if (GameState.hasSavedGame() || SaveManager.hasAutoSave()) {
            if (continueBtn) {
                continueBtn.classList.remove('hidden');
            }
        }
        
        // Set up event listeners
        setupEventListeners();
        
        // Preload critical assets
        await Preloader.preloadCritical();
        
        // Hide loading screen, show title
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        if (titleScreen) {
            titleScreen.classList.remove('hidden');
        }
        
        // Autoplay is blocked until user gesture (file:// or https)
        setupTitleMusicOnFirstInteraction();
        
        // Start preloading remaining assets in background
        Preloader.preloadAll((progress) => {
            console.log(`Asset loading: ${Math.round(progress)}%`);
        });
    }
    
    function setupTitleMusicOnFirstInteraction() {
        const title = document.getElementById('title-screen');
        if (!title) return;
        title.addEventListener('click', function startTitleMusic() {
            AudioManager.playMusic('theme-main');
        }, { capture: true, once: true });
    }
    
    function setupEventListeners() {
        // Start new game
        if (startBtn) {
            startBtn.addEventListener('click', startNewGame);
        }
        
        // Continue saved game
        if (continueBtn) {
            continueBtn.addEventListener('click', continueGame);
        }
        
        // Menu button
        if (menuButton) {
            menuButton.addEventListener('click', togglePause);
        }
        
        // Pause menu buttons
        if (resumeBtn) resumeBtn.addEventListener('click', togglePause);
        if (saveBtn) saveBtn.addEventListener('click', showSaveMenu);
        if (loadBtn) loadBtn.addEventListener('click', showLoadMenu);
        if (restartBtn) restartBtn.addEventListener('click', confirmRestart);
        if (quitBtn) quitBtn.addEventListener('click', quitToTitle);

        if (galleryBtn && typeof MemoriesGallery !== 'undefined') {
            galleryBtn.addEventListener('click', () => MemoriesGallery.open());
        }
        
        document.addEventListener('dialogue:advance', () => {
            if (typeof TextBox !== 'undefined' && TextBox.confirmAdvanceIfNeeded()) return;
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                togglePause();
            }
        });
    }
    
    function startNewGame() {
        GameState.reset();
        gameStarted = true;
        
        if (titleScreen) titleScreen.classList.add('hidden');
        if (gameContainer) gameContainer.classList.remove('hidden');
        
        // Navigate to first scene
        Router.navigateTo('scene1');
    }
    
    function continueGame() {
        if (SaveManager.loadAutoSave() || GameState.loadFromLocalStorage()) {
            const savedScene = GameState.get('currentScene');
            gameStarted = true;
            
            if (titleScreen) titleScreen.classList.add('hidden');
            if (gameContainer) gameContainer.classList.remove('hidden');
            
            Router.navigateTo(savedScene);
        }
    }
    
    function togglePause() {
        isPaused = !isPaused;
        
        if (isPaused) {
            if (pauseMenu) pauseMenu.classList.remove('hidden');
            AudioManager.pauseMusic();
        } else {
            if (pauseMenu) pauseMenu.classList.add('hidden');
            AudioManager.resumeMusic();
        }
    }
    
    function showSaveMenu() {
        const slotId = prompt('Enter save slot (1-5):', '1');
        if (slotId && /^[1-5]$/.test(slotId)) {
            SaveManager.saveGame(parseInt(slotId)).then(success => {
                if (success) {
                    alert('Game saved successfully!');
                    togglePause();
                } else {
                    alert('Failed to save game.');
                }
            });
        }
    }
    
    function showLoadMenu() {
        SaveManager.getAllSaves().then(saves => {
            if (saves.length === 0) {
                alert('No saved games found.');
                return;
            }
            
            const saveInfo = saves.map(s => {
                const preview = SaveManager.getSavePreview(s);
                return `${preview.slotName}: ${preview.scene} (${preview.timestamp})`;
            }).join('\n');
            
            const slotNum = prompt(`Select slot to load:\n${saveInfo}`, '1');
            if (slotNum && /^[1-5]$/.test(slotNum)) {
                SaveManager.loadGame(parseInt(slotNum)).then(saveData => {
                    if (saveData) {
                        gameStarted = true;
                        if (pauseMenu) pauseMenu.classList.add('hidden');
                        isPaused = false;
                        Router.navigateTo(saveData.gameState.currentScene);
                    } else {
                        alert('Failed to load game.');
                    }
                });
            }
        });
    }
    
    function confirmRestart() {
        if (confirm('Are you sure you want to restart? All unsaved progress will be lost.')) {
            startNewGame();
            if (pauseMenu) pauseMenu.classList.add('hidden');
            isPaused = false;
        }
    }
    
    function quitToTitle() {
        if (confirm('Quit to title screen? Unsaved progress will be lost.')) {
            // Auto-save before quitting
            SaveManager.autoSave();
            
            gameStarted = false;
            isPaused = false;
            if (pauseMenu) pauseMenu.classList.add('hidden');
            if (gameContainer) gameContainer.classList.add('hidden');
            if (titleScreen) titleScreen.classList.remove('hidden');
            
            // Check for saved game
            if (GameState.hasSavedGame() || SaveManager.hasAutoSave()) {
                if (continueBtn) continueBtn.classList.remove('hidden');
            }
        }
    }
    
    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();