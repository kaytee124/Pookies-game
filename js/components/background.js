/**
 * Background Manager Component
 * Handles scene background changes and effects
 */

const Background = (function() {
    const backgroundLayer = document.getElementById('background-layer');
    
    const bgMap = {
        'discord-server': 'discord-server',
        'sunset-chat': 'sunset-chat',
        'night-call': 'night-call',
        'genshin-landscape': 'genshin-landscape',
        'fantasy-night': 'fantasy-night',
        'food-district': 'food-district',
        'house-building': 'house-building',
        'horizon-ending': 'horizon-ending',
        'dreamy-hearts': 'dreamy-hearts',
        'pastel-rainbow': 'pastel-rainbow',
        'soft-evening': 'soft-evening'
    };
    
    let currentBg = null;
    let transitionTimer = null;
    
    function set(backgroundId, transition = true) {
        if (!backgroundLayer) return;
        if (!bgMap[backgroundId]) {
            console.warn(`Background not found: ${backgroundId}`);
            return;
        }
        
        currentBg = backgroundId;
        
        if (transition) {
            // Fade out
            backgroundLayer.style.opacity = '0';
            
            if (transitionTimer) clearTimeout(transitionTimer);
            
            transitionTimer = setTimeout(() => {
                // Change background
                backgroundLayer.setAttribute('data-bg', bgMap[backgroundId]);
                
                // Fade in
                setTimeout(() => {
                    backgroundLayer.style.opacity = '1';
                }, 50);
                
                transitionTimer = null;
            }, 200);
        } else {
            backgroundLayer.setAttribute('data-bg', bgMap[backgroundId]);
        }
    }
    
    function getCurrent() {
        return currentBg;
    }
    
    function addEffect(effectType) {
        if (!backgroundLayer) return;
        
        const effectLayer = document.createElement('div');
        effectLayer.className = `bg-effect bg-effect-${effectType}`;
        backgroundLayer.appendChild(effectLayer);
        
        // Auto-remove after animation
        setTimeout(() => effectLayer.remove(), 5000);
    }
    
    function setOverlay(color, opacity) {
        if (!backgroundLayer) return;
        
        const overlay = backgroundLayer.querySelector('.bg-overlay') || document.createElement('div');
        overlay.className = 'bg-overlay';
        overlay.style.backgroundColor = color;
        overlay.style.opacity = opacity;
        
        if (!backgroundLayer.contains(overlay)) {
            backgroundLayer.appendChild(overlay);
        }
    }
    
    function removeOverlay() {
        const overlay = backgroundLayer?.querySelector('.bg-overlay');
        if (overlay) overlay.remove();
    }
    
    function fadeTo(backgroundId, duration = 500) {
        return new Promise((resolve) => {
            set(backgroundId, false);
            backgroundLayer.style.transition = `opacity ${duration}ms ease`;
            backgroundLayer.style.opacity = '0';
            
            setTimeout(() => {
                backgroundLayer.setAttribute('data-bg', bgMap[backgroundId]);
                backgroundLayer.style.opacity = '1';
                
                setTimeout(() => {
                    backgroundLayer.style.transition = '';
                    resolve();
                }, duration);
            }, duration);
        });
    }
    
    return {
        set,
        getCurrent,
        addEffect,
        setOverlay,
        removeOverlay,
        fadeTo
    };
})();