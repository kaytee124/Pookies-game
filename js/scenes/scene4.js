/**
 * Scene 4 Controller - Picture
 */

(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const resume = GameState.get('currentScene');
        if (resume === 'scene4_call') {
            SceneManager.loadScene('scene4_call');
        } else {
            SceneManager.loadScene('scene4');
        }
    });
})();
