/**
 * TextBox — typewriter, then wait for Next / click / Space / timer, or Previous line (dialogue rewind)
 */

const TextBox = (function() {
    function getDialogueBox() {
        return document.getElementById('dialogue-box');
    }

    function getSpeakerNameEl() {
        return document.getElementById('speaker-name');
    }

    function getDialogueTextEl() {
        return document.getElementById('dialogue-text');
    }

    function getContinueIndicator() {
        return document.getElementById('continue-indicator');
    }

    let currentText = '';
    let isTyping = false;
    let typewriterTimer = null;
    let pendingAdvanceCallback = null;
    let advanceTimer = null;
    let typeSoundEnabled = true;
    let audioContext = null;
    let cornerNav = null;
    let listenersAttached = false;

    function choicesAreVisible() {
        const cc = document.getElementById('choices-container');
        return cc && !cc.classList.contains('hidden');
    }

    function getAdvanceWaitMs() {
        const ms = GameState.get('dialogueAdvanceWaitMs');
        return typeof ms === 'number' ? ms : 20000;
    }

    function clearAdvanceTimer() {
        if (advanceTimer) {
            clearTimeout(advanceTimer);
            advanceTimer = null;
        }
    }

    function cancelPendingAdvance() {
        clearAdvanceTimer();
        pendingAdvanceCallback = null;
        const continueIndicator = getContinueIndicator();
        if (continueIndicator) continueIndicator.classList.add('hidden');
        updateCornerNavVisibility();
    }

    function finishAdvance() {
        if (choicesAreVisible()) return;
        if (!pendingAdvanceCallback) return;
        clearAdvanceTimer();
        const cb = pendingAdvanceCallback;
        pendingAdvanceCallback = null;
        const continueIndicator = getContinueIndicator();
        if (continueIndicator) continueIndicator.classList.add('hidden');
        updateCornerNavVisibility();
        cb();
    }

    function updateCornerNavVisibility() {
        if (!cornerNav) return;
        const show = !!pendingAdvanceCallback && !isTyping && !choicesAreVisible();
        cornerNav.classList.toggle('hidden', !show);
    }

    function beginAdvanceWait() {
        const continueIndicator = getContinueIndicator();
        if (continueIndicator) continueIndicator.classList.remove('hidden');
        updateCornerNavVisibility();

        const waitMs = getAdvanceWaitMs();
        clearAdvanceTimer();
        if (waitMs > 0) {
            advanceTimer = setTimeout(finishAdvance, waitMs);
        }
    }

    function initAudio() {
        /* Context is created on first user gesture via touchAudio — avoids autoplay policy warnings. */
    }

    function touchAudio() {
        if (!typeSoundEnabled) return;
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioContext.state === 'suspended') {
                audioContext.resume().catch(() => {});
            }
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    function playTypeSound() {
        if (!typeSoundEnabled || !audioContext || audioContext.state !== 'running') return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.03);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.03);
    }

    function showText(speaker, text, onComplete, speed = null) {
        const speakerNameEl = getSpeakerNameEl();
        const dialogueTextEl = getDialogueTextEl();
        if (!speakerNameEl || !dialogueTextEl) return;

        cancelPendingAdvance();
        if (typewriterTimer) {
            clearTimeout(typewriterTimer);
            typewriterTimer = null;
        }

        currentText = text;
        pendingAdvanceCallback = onComplete;
        const textSpeed = speed || GameState.get('textSpeed') || 52;

        speakerNameEl.textContent = speaker || '---';
        speakerNameEl.className = `speaker-tag speaker-${(speaker || 'narration').toLowerCase().replace(/\s+/g, '-')}`;

        const continueIndicator = getContinueIndicator();
        if (continueIndicator) continueIndicator.classList.add('hidden');
        updateCornerNavVisibility();

        dialogueTextEl.textContent = '';
        isTyping = true;

        function typeNextCharacter(index) {
            if (index < currentText.length) {
                dialogueTextEl.textContent += currentText[index];
                if (index % 3 === 0) playTypeSound();
                index++;
                typewriterTimer = setTimeout(() => typeNextCharacter(index), textSpeed);
            } else {
                isTyping = false;
                typewriterTimer = null;
                beginAdvanceWait();
            }
        }

        typeNextCharacter(0);
    }

    function skipTyping() {
        if (!isTyping) return;
        const dialogueTextEl = getDialogueTextEl();
        if (typewriterTimer) {
            clearTimeout(typewriterTimer);
            typewriterTimer = null;
        }
        if (dialogueTextEl) dialogueTextEl.textContent = currentText;
        isTyping = false;
        beginAdvanceWait();
    }

    function isCurrentlyTyping() {
        return isTyping;
    }

    function clear() {
        cancelPendingAdvance();
        if (typewriterTimer) {
            clearTimeout(typewriterTimer);
            typewriterTimer = null;
        }
        isTyping = false;
        const speakerNameEl = getSpeakerNameEl();
        const dialogueTextEl = getDialogueTextEl();
        const continueIndicator = getContinueIndicator();
        if (speakerNameEl) speakerNameEl.textContent = '';
        if (dialogueTextEl) dialogueTextEl.textContent = '';
        if (continueIndicator) continueIndicator.classList.add('hidden');
        updateCornerNavVisibility();
    }

    function showNarration(text, onComplete) {
        showText('', text, onComplete);
    }

    function setTypeSoundEnabled(enabled) {
        typeSoundEnabled = enabled;
    }

    function confirmAdvanceIfNeeded() {
        if (choicesAreVisible()) return false;
        if (pendingAdvanceCallback && !isTyping) {
            finishAdvance();
            return true;
        }
        return false;
    }

    function ensureCornerNav() {
        const dialogueBox = getDialogueBox();
        if (cornerNav || !dialogueBox) return;
        cornerNav = document.createElement('div');
        cornerNav.className = 'dialogue-corner-nav hidden';
        cornerNav.innerHTML =
            '<button type="button" class="dialogue-corner-btn dialogue-corner-prev" id="dialogue-prev-btn" aria-label="Previous line; at scene start, return to previous chapter">◀ Prev</button>' +
            '<button type="button" class="dialogue-corner-btn dialogue-corner-next" id="dialogue-next-btn" aria-label="Next line">Next ▶</button>';
        dialogueBox.insertBefore(cornerNav, dialogueBox.firstChild);

        document.getElementById('dialogue-next-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (choicesAreVisible() || isTyping) return;
            touchAudio();
            confirmAdvanceIfNeeded();
        });

        document.getElementById('dialogue-prev-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (choicesAreVisible() || isTyping) return;
            touchAudio();
            document.dispatchEvent(new CustomEvent('dialogue:rewind'));
        });
    }

    function init() {
        initAudio();
        ensureCornerNav();
        const dialogueBox = getDialogueBox();
        if (!dialogueBox || listenersAttached) return;
        listenersAttached = true;

        const onFirstGesture = () => touchAudio();
        window.addEventListener('pointerdown', onFirstGesture, { capture: true, passive: true });
        window.addEventListener('keydown', onFirstGesture, { capture: true, passive: true });

        dialogueBox.addEventListener('click', (e) => {
            if (e.target.closest('.dialogue-corner-btn')) return;

            if (choicesAreVisible()) return;

            touchAudio();
            if (isTyping) {
                skipTyping();
            } else {
                confirmAdvanceIfNeeded();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (choicesAreVisible()) return;
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                touchAudio();
                if (isTyping) {
                    skipTyping();
                } else {
                    confirmAdvanceIfNeeded();
                }
            }
        });
    }

    return {
        init,
        showText,
        showNarration,
        skipTyping,
        isCurrentlyTyping,
        clear,
        setTypeSoundEnabled,
        confirmAdvanceIfNeeded,
        cancelPendingAdvance
    };
})();
