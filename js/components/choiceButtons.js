/**
 * Choice Buttons Component
 * Handles interactive choice display and selection
 */

const ChoiceButtons = (function() {
    const choicesContainer = document.getElementById('choices-container');
    
    let currentChoices = [];
    let onChoiceSelected = null;
    let isShowing = false;
    
    // Create choice buttons
    function showChoices(choices, callback) {
        // Clear existing
        choicesContainer.innerHTML = '';
        const state = typeof GameState !== 'undefined' && GameState.getState ? GameState.getState() : {};
        const visible = (choices || []).filter((c) => {
            if (typeof c.condition === 'function') {
                try {
                    return !!c.condition(state);
                } catch (e) {
                    return true;
                }
            }
            return true;
        });
        currentChoices = visible;
        onChoiceSelected = callback;
        
        // Create buttons
        visible.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.setAttribute('data-choice-id', choice.id);
            button.setAttribute('data-choice-index', index);
            
            // Add icon if specified
            if (choice.icon) {
                const icon = document.createElement('span');
                icon.className = 'choice-icon';
                icon.textContent = choice.icon;
                button.appendChild(icon);
            }
            
            // Add text
            const text = document.createElement('span');
            text.className = 'choice-text';
            text.textContent = choice.text;
            button.appendChild(text);
            
            // Add hover/tap handlers
            button.addEventListener('click', () => handleChoiceClick(choice, index));
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                button.classList.add('choice-touch');
            });
            button.addEventListener('touchend', () => {
                button.classList.remove('choice-touch');
            });
            
            choicesContainer.appendChild(button);
            
            // Animate entrance with delay
            setTimeout(() => {
                button.classList.add('choice-visible');
            }, index * 100);
        });
        
        choicesContainer.classList.remove('hidden');
        isShowing = true;
        
        // Play choice appear sound
        AudioManager.playSFX('choice-appear');
    }
    
    function handleChoiceClick(choice, index) {
        // Visual feedback
        const button = choicesContainer.children[index];
        button.classList.add('choice-selected');
        
        // Play select sound
        AudioManager.playSFX('choice-select');
        
        // Record choice in game state
        GameState.recordChoice(choice.id, choice.text);
        
        // Update relationship variables based on choice
        if (choice.friendshipDelta) {
            GameState.addFriendship(choice.friendshipDelta);
        }
        if (choice.trustDelta) {
            GameState.addTrust(choice.trustDelta);
        }
        
        // Hide choices
        hideChoices();
        
        // Trigger callback
        if (onChoiceSelected) {
            setTimeout(() => {
                onChoiceSelected(choice.id, choice);
            }, 200);
        }
    }
    
    function hideChoices() {
        const buttons = choicesContainer.querySelectorAll('.choice-button');
        buttons.forEach((button, index) => {
            setTimeout(() => {
                button.classList.remove('choice-visible');
            }, index * 50);
        });
        
        setTimeout(() => {
            choicesContainer.classList.add('hidden');
            choicesContainer.innerHTML = '';
            isShowing = false;
        }, buttons.length * 50 + 200);
    }
    
    function isCurrentlyShowing() {
        return isShowing;
    }
    
    // Pre-defined choice templates
    const choiceTemplates = {
        // Scene 1 choices
        scene1_replyEnthusiastic: {
            id: 'reply_enthusiastic',
            text: 'hiiii!! omg yes let\'s be friends!! you seem cool too hehe~ what games do you play? 🎮✨',
            icon: '✨',
            friendshipDelta: 10,
            trustDelta: 5
        },
        scene1_replyHesitant: {
            id: 'reply_hesitant', 
            text: 'uhm... hi? i guess we can talk a bit. what made you message me? 🤔',
            icon: '🤔',
            friendshipDelta: 3,
            trustDelta: 0
        },
        scene1_ignore: {
            id: 'reply_ignore',
            text: '[Ignore message - seen but no reply]',
            icon: '👻',
            friendshipDelta: -100,
            trustDelta: -100,
            leadsToEnding: 'ignore'
        },
        
        // Scene 2 choices
        scene2_confrontCare: {
            id: 'confront_care',
            text: 'heyyy... you\'ve been kinda quiet lately. is everything okay? i miss your random yapping you know 🥺',
            icon: '🥺',
            friendshipDelta: 15,
            trustDelta: 20
        },
        scene2_fillSilence: {
            id: 'fill_silence',
            text: '[Start yapping yourself—fill the silence with YOUR chaos]',
            icon: '💬',
            friendshipDelta: 10,
            trustDelta: 10
        },
        scene2_stayQuiet: {
            id: 'stay_quiet',
            text: '[Stay quiet too—maybe he needs space]',
            icon: '🤐',
            friendshipDelta: -10,
            trustDelta: -15,
            leadsToEnding: 'drift'
        },
        scene2_anxiousQuestion: {
            id: 'anxious_question',
            text: 'did i do something wrong? you\'re not talking as much...',
            icon: '😟',
            friendshipDelta: 5,
            trustDelta: 15
        }
    };
    
    return {
        showChoices,
        hideChoices,
        isCurrentlyShowing,
        choiceTemplates
    };
})();