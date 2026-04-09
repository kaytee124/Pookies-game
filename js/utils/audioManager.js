/**
 * Audio Manager
 * Handles background music and sound effects
 */

const AudioManager = (function() {
    // Audio contexts and elements
    let musicAudio = null;
    let sfxAudio = null;
    
    // Settings
    let musicEnabled = true;
    let sfxEnabled = true;
    let musicVolume = 0.5;
    let sfxVolume = 0.7;
    
    // Music tracks (Journey.md: warm main / romantic beats / tense doubt / happy chaos / ending swell)
    const musicTracks = {
        'theme-main': 'assets/audio/music/theme-main.mp3',
        'theme-romantic': 'assets/audio/music/theme-romantic.mp3',
        'theme-tense': 'assets/audio/music/theme-tense.mp3',
        'theme-happy': 'assets/audio/music/theme-happy.mp3',
        'theme-ending': 'assets/audio/music/theme-ending.mp3'
    };
    
    // Paths resolved with getAssetRoot() in playMusic / playSFX
    const sfxTracks = {
        'click': 'assets/audio/sfx/click.mp3',
        'choice-appear': 'assets/audio/sfx/notification.mp3',
        'choice-select': 'assets/audio/sfx/choice-select.mp3',
        'text-type': 'assets/audio/sfx/text-type.mp3',
        'heart-pop': 'assets/audio/sfx/heart-pop.mp3',
        'notification': 'assets/audio/sfx/notification.mp3',
        'transition': 'assets/audio/sfx/transition.mp3'
    };

    function resolveAssetPath(relativePath) {
        const root = (typeof window.getAssetRoot === 'function') ? window.getAssetRoot() : '';
        return root + relativePath;
    }
    
    let currentMusicTrack = null;
    let musicLoopTimeout = null;
    
    function init() {
        // Load settings from game state
        const state = GameState.getState();
        musicEnabled = state.musicEnabled;
        sfxEnabled = state.soundEnabled;
        musicVolume = state.musicVolume;
        sfxVolume = state.sfxVolume;
        
        // Create audio elements
        musicAudio = new Audio();
        musicAudio.loop = true;
        musicAudio.volume = musicVolume;
        
        sfxAudio = new Audio();
        sfxAudio.volume = sfxVolume;
    }
    
    function playMusic(trackId) {
        if (!musicEnabled || !musicAudio) return;
        if (!musicTracks[trackId]) {
            console.warn(`Music track not found: ${trackId}`);
            return;
        }
        
        // Don't restart if same track already playing
        if (currentMusicTrack === trackId && !musicAudio.paused) {
            return;
        }
        
        currentMusicTrack = trackId;
        musicAudio.src = resolveAssetPath(musicTracks[trackId]);
        musicAudio.volume = musicVolume;
        
        musicAudio.play().catch(e => {
            console.warn('Music playback failed (may need user interaction):', e);
        });
    }
    
    function pauseMusic() {
        if (musicAudio) {
            musicAudio.pause();
        }
    }
    
    function resumeMusic() {
        if (musicEnabled && musicAudio && currentMusicTrack) {
            musicAudio.play().catch(e => {
                console.warn('Music resume failed:', e);
            });
        }
    }
    
    function stopMusic() {
        if (musicAudio) {
            musicAudio.pause();
            musicAudio.currentTime = 0;
            currentMusicTrack = null;
        }
    }
    
    function playSFX(sfxId) {
        if (!sfxEnabled) return;
        if (!sfxTracks[sfxId]) {
            console.warn(`SFX track not found: ${sfxId}`);
            return;
        }
        
        // Create new audio element for overlapping sounds
        const sfx = new Audio(resolveAssetPath(sfxTracks[sfxId]));
        sfx.volume = sfxVolume;
        sfx.play().catch(e => {
            // Silently fail - SFX are optional
        });
    }
    
    function setMusicEnabled(enabled) {
        musicEnabled = enabled;
        GameState.set('musicEnabled', enabled);
        
        if (!enabled && musicAudio) {
            musicAudio.pause();
        } else if (enabled && currentMusicTrack) {
            resumeMusic();
        }
    }
    
    function setSfxEnabled(enabled) {
        sfxEnabled = enabled;
        GameState.set('soundEnabled', enabled);
    }
    
    function setMusicVolume(volume) {
        musicVolume = Math.max(0, Math.min(1, volume));
        if (musicAudio) {
            musicAudio.volume = musicVolume;
        }
        GameState.set('musicVolume', musicVolume);
    }
    
    function setSfxVolume(volume) {
        sfxVolume = Math.max(0, Math.min(1, volume));
        GameState.set('sfxVolume', sfxVolume);
    }
    
    function fadeMusic(targetVolume, duration = 1000) {
        if (!musicAudio) return;
        
        const startVolume = musicAudio.volume;
        const volumeDiff = targetVolume - startVolume;
        const startTime = performance.now();
        
        function fadeStep() {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            musicAudio.volume = startVolume + (volumeDiff * progress);
            
            if (progress < 1) {
                requestAnimationFrame(fadeStep);
            }
        }
        
        requestAnimationFrame(fadeStep);
    }
    
    function crossfadeMusic(newTrackId, duration = 2000) {
        if (!musicEnabled) {
            playMusic(newTrackId);
            return;
        }
        
        fadeMusic(0, duration / 2);
        
        setTimeout(() => {
            playMusic(newTrackId);
            musicAudio.volume = 0;
            fadeMusic(musicVolume, duration / 2);
        }, duration / 2);
    }
    
    function isMusicEnabled() {
        return musicEnabled;
    }
    
    function isSfxEnabled() {
        return sfxEnabled;
    }
    
    return {
        init,
        playMusic,
        pauseMusic,
        resumeMusic,
        stopMusic,
        playSFX,
        setMusicEnabled,
        setSfxEnabled,
        setMusicVolume,
        setSfxVolume,
        fadeMusic,
        crossfadeMusic,
        isMusicEnabled,
        isSfxEnabled
    };
})();