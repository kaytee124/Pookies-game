/**
 * Avatar Component
 * Handles character sprite changes, expressions, and animations
 */

const Avatar = (function() {
    // DOM Elements
    const guySprite = document.getElementById('guy-sprite');
    const girlSprite = document.getElementById('girl-sprite');
    const guyContainer = document.getElementById('avatar-guy');
    const girlContainer = document.getElementById('avatar-girl');
    
    function spriteBase() {
        const root = (typeof window.getAssetRoot === 'function') ? window.getAssetRoot() : '';
        return root + 'assets/images/avatars/';
    }

    function effectAsset(pathFromEffectsFolder) {
        const root = (typeof window.getAssetRoot === 'function') ? window.getAssetRoot() : '';
        return root + 'assets/images/effects/' + pathFromEffectsFolder;
    }
    
    // Expression mapping (filenames must match assets/images/avatars/{guy|girl}/)
    const GUY_EXPRESSIONS = {
        idle: 'idle.png',
        happy: 'happy.png',
        sad: 'sad.png',
        nervous: 'nervous.png',
        excited: 'excited.png',
        blush: 'blush.png',
        hero: 'hero.png',
        chef: 'chef.png',
        sleepy: 'sleepy.png',
        determined: 'hero.png',
        shock: 'excited.png'
    };
    
    const GIRL_EXPRESSIONS = {
        idle: 'idle.png',
        happy: 'happy.png',
        sad: 'sad.png',
        nervous: 'nervous.png',
        excited: 'excited.png',
        blush: 'blush.png',
        princess: 'princess.png',
        bunny: 'bunny.png',
        sleepy: 'sleepy.png',
        determined: 'princess.png',
        shock: 'excited.png'
    };
    
    // Current expressions
    let currentGuyExpression = 'idle';
    let currentGirlExpression = 'idle';
    
    // Animation queue
    let animationQueue = [];
    let isAnimating = false;
    
    // Set guy expression
    function setGuyExpression(expression) {
        if (GUY_EXPRESSIONS[expression]) {
            currentGuyExpression = expression;
            guySprite.src = `${spriteBase()}guy/${GUY_EXPRESSIONS[expression]}`;
            
            // Add animation class
            guyContainer.classList.add('avatar-bounce');
            setTimeout(() => guyContainer.classList.remove('avatar-bounce'), 300);
        }
    }
    
    // Set girl expression
    function setGirlExpression(expression) {
        if (GIRL_EXPRESSIONS[expression]) {
            currentGirlExpression = expression;
            girlSprite.src = `${spriteBase()}girl/${GIRL_EXPRESSIONS[expression]}`;
            
            // Add animation class
            girlContainer.classList.add('avatar-bounce');
            setTimeout(() => girlContainer.classList.remove('avatar-bounce'), 300);
        }
    }
    
    // Show/hide avatars
    function showGuy(show = true) {
        guyContainer.style.opacity = show ? '1' : '0';
        guyContainer.style.pointerEvents = show ? 'auto' : 'none';
    }
    
    function showGirl(show = true) {
        girlContainer.style.opacity = show ? '1' : '0';
        girlContainer.style.pointerEvents = show ? 'auto' : 'none';
    }
    
    // Add accessory/effect to avatar
    function addAccessory(character, accessoryType) {
        const container = character === 'guy' ? guyContainer : girlContainer;
        
        const accessory = document.createElement('div');
        accessory.className = `avatar-accessory accessory-${accessoryType}`;
        accessory.innerHTML = getAccessorySVG(accessoryType);
        
        container.appendChild(accessory);
        
        // Auto-remove after animation
        setTimeout(() => accessory.remove(), 2000);
    }
    
    function getAccessorySVG(type) {
        // Return SVG or img tag for accessory
        const accessories = {
            crown: `<img src="${effectAsset('crown.png')}" alt="crown" class="effect-sprite">`,
            bunny: `<img src="${effectAsset('bunny-ears.png')}" alt="bunny ears" class="effect-sprite">`,
            heart: `<img src="${effectAsset('heart.png')}" alt="heart" class="effect-sprite">`,
            sparkle: `<img src="${effectAsset('sparkle.png')}" alt="sparkle" class="effect-sprite">`,
            sword: `<img src="${effectAsset('sword.png')}" alt="sword" class="effect-sprite">`
        };
        return accessories[type] || '';
    }
    
    // Animation sequences
    async function playSequence(sequence) {
        for (const action of sequence) {
            await new Promise(resolve => {
                setTimeout(() => {
                    if (action.character === 'guy') {
                        setGuyExpression(action.expression);
                        if (action.accessory) {
                            addAccessory('guy', action.accessory);
                        }
                    } else if (action.character === 'girl') {
                        setGirlExpression(action.expression);
                        if (action.accessory) {
                            addAccessory('girl', action.accessory);
                        }
                    } else if (action.character === 'both') {
                        setGuyExpression(action.guyExpression);
                        setGirlExpression(action.girlExpression);
                    }
                    resolve();
                }, action.delay || 0);
            });
        }
    }
    
    // Hero transformation sequence
    function playHeroSequence() {
        const sequence = [
            { character: 'guy', expression: 'hero', delay: 100 },
            { character: 'guy', accessory: 'sword', delay: 200 },
            { character: 'guy', expression: 'hero', delay: 100 }
        ];
        playSequence(sequence);
    }
    
    // Reset both to idle
    function resetBoth() {
        setGuyExpression('idle');
        setGirlExpression('idle');
    }
    
    // Get current expressions
    function getCurrentExpressions() {
        return {
            guy: currentGuyExpression,
            girl: currentGirlExpression
        };
    }
    
    return {
        setGuyExpression,
        setGirlExpression,
        showGuy,
        showGirl,
        addAccessory,
        playSequence,
        playHeroSequence,
        resetBoth,
        getCurrentExpressions
    };
})();