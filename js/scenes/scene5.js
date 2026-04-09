/**
 * Scene 5 Controller - Confession / official
 */

(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const cur = GameState.get('currentScene');
        if (cur === 'scene5_romance') {
            SceneManager.loadScene('scene5_romance');
        } else if (cur === 'scene5_platonic') {
            SceneManager.loadScene('scene5_platonic');
        } else {
            SceneManager.loadScene('scene5');
        }
    });
})();
