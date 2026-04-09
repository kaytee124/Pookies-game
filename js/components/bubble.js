/**
 * Emote/Thought Bubble Component
 * Handles floating bubbles above character avatars
 */

const Bubble = (function() {
    const guyBubble = document.getElementById('guy-bubble');
    const girlBubble = document.getElementById('girl-bubble');
    
    const BUBBLE_TYPES = {
        speech: '💬',
        thought: '💭',
        heart: '❤️',
        exclamation: '❗',
        question: '❓',
        music: '🎵',
        sleepy: '💤',
        anger: '💢',
        sparkle: '✨',
        sweat: '💦'
    };
    
    let activeTimeouts = new Map();
    
    // Show bubble on character
    function show(character, type, content = null, duration = 2000) {
        const bubble = character === 'guy' ? guyBubble : girlBubble;
        const container = character === 'guy' 
            ? document.getElementById('avatar-guy')
            : document.getElementById('avatar-girl');
        
        // Clear existing timeout for this character
        if (activeTimeouts.has(character)) {
            clearTimeout(activeTimeouts.get(character));
            activeTimeouts.delete(character);
        }
        
        // Set bubble content
        if (content) {
            bubble.textContent = content;
            bubble.classList.add('bubble-text');
        } else {
            bubble.textContent = BUBBLE_TYPES[type] || type;
            bubble.classList.remove('bubble-text');
        }
        
        // Set bubble type class
        bubble.className = `emote-bubble bubble-${type}`;
        
        // Position relative to container
        const containerRect = container.getBoundingClientRect();
        bubble.style.left = '50%';
        bubble.style.top = '-20px';
        
        // Show bubble
        bubble.classList.add('visible');
        
        // Add pop animation
        bubble.style.animation = 'bubblePop 0.3s ease-out';
        
        // Auto hide after duration
        if (duration > 0) {
            const timeout = setTimeout(() => {
                hide(character);
                activeTimeouts.delete(character);
            }, duration);
            activeTimeouts.set(character, timeout);
        }
    }
    
    // Hide bubble
    function hide(character) {
        const bubble = character === 'guy' ? guyBubble : girlBubble;
        bubble.classList.remove('visible');
        
        if (activeTimeouts.has(character)) {
            clearTimeout(activeTimeouts.get(character));
            activeTimeouts.delete(character);
        }
    }
    
    // Show thought bubble with internal monologue
    function showThought(character, text, duration = 3000) {
        show(character, 'thought', text, duration);
    }
    
    // Show emote reaction
    function showReaction(character, reaction, duration = 1500) {
        show(character, reaction, null, duration);
    }
    
    // Show yapping indicator (multiple speech bubbles)
    function showYapping(character) {
        const bubble = character === 'guy' ? guyBubble : girlBubble;
        bubble.textContent = '💬💬💬';
        bubble.className = 'emote-bubble bubble-yapping';
        bubble.classList.add('visible');
        
        if (activeTimeouts.has(character)) {
            clearTimeout(activeTimeouts.get(character));
        }
        
        const timeout = setTimeout(() => {
            hide(character);
        }, 3000);
        activeTimeouts.set(character, timeout);
    }
    
    // Hide all bubbles
    function hideAll() {
        hide('guy');
        hide('girl');
    }
    
    // Sequence of bubbles
    async function showSequence(character, sequence) {
        for (const item of sequence) {
            show(character, item.type, item.content, item.duration);
            await new Promise(resolve => setTimeout(resolve, item.duration || 1500));
        }
    }
    
    return {
        show,
        hide,
        showThought,
        showReaction,
        showYapping,
        hideAll,
        showSequence,
        TYPES: BUBBLE_TYPES
    };
})();