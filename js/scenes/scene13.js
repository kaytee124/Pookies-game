/**
 * Scene 13 Controller - Ending
 */

(function() {
    function rootToTitle() {
        const base = typeof window.getAssetRoot === 'function' ? window.getAssetRoot() : '';
        window.location.assign(base + 'Index.html');
    }

    function showEndingOverlay() {
        const endingScreen = document.getElementById('ending-screen');
        if (!endingScreen) return;
        endingScreen.classList.remove('hidden');
        endingScreen.setAttribute('aria-hidden', 'false');

        const playAgain = document.getElementById('play-again-btn');
        const memories = document.getElementById('memories-btn');

        if (playAgain) {
            playAgain.onclick = function() {
                if (typeof GameState !== 'undefined' && GameState.reset) {
                    GameState.reset();
                }
                rootToTitle();
            };
        }

        if (memories && typeof MemoriesGallery !== 'undefined') {
            memories.onclick = function() {
                MemoriesGallery.open();
            };
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (typeof AudioManager !== 'undefined' && AudioManager.init) {
            AudioManager.init();
        }

        SceneManager.onSceneComplete(() => {
            showEndingOverlay();
        });

        SceneManager.loadScene('scene13');
    });
})();
