/**
 * Scene 6 Controller - Genshin Era
 */

(function() {
    document.addEventListener('DOMContentLoaded', () => {
        SceneManager.loadScene('scene6');
        GameState.set('genshinEraUnlocked', true);
    });
})();