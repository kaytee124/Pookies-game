/**
 * Scene 3 Controller - Feelings
 */

(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const cur = GameState.get('currentScene');
        if (cur === 'scene3_fearPath') {
            SceneManager.loadScene('scene3_fearPath');
        } else {
            SceneManager.loadScene('scene3');
        }
    });
})();
