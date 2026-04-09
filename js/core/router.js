/**
 * Scene Router
 * Handles navigation between scenes
 */

const Router = (function() {
    const sceneMap = {
        'scene1': 'pages/scene1-intro.html',
        'scene2': 'pages/scene2-daily.html',
        'scene3': 'pages/scene3-feelings.html',
        'scene4': 'pages/scene4-picture.html',
        'scene5': 'pages/scene5-confession.html',
        'scene6': 'pages/scene6-genshin.html',
        'scene7': 'pages/scene7-promise.html',
        'scene8': 'pages/scene8-assurance.html',
        'scene9': 'pages/scene9-pony.html',
        'scene10': 'pages/scene10-protector.html',
        'scene11': 'pages/scene11-plans.html',
        'scene12': 'pages/scene12-vision.html',
        'scene13': 'pages/scene13-ending.html',
        'ending_ignore': 'pages/ending-ignore.html',
        'ending_drift': 'pages/ending-drift.html',
        'ending_fear': 'pages/ending-fear.html',
        'ending_secret': 'pages/ending-secret.html'
    };
    
    let currentScene = null;
    let transitionInProgress = false;
    
    function getSceneHref(sceneId) {
        const path = sceneMap[sceneId];
        if (!path) return null;
        const p = (location.pathname || '').replace(/\\/g, '/');
        const inPages = p.includes('/pages/');
        if (inPages && path.indexOf('pages/') === 0) {
            return path.slice(6);
        }
        return path;
    }

    function navigateTo(sceneId, saveState = true) {
        if (transitionInProgress) return;
        if (!sceneMap[sceneId]) {
            console.error(`Scene not found: ${sceneId}`);
            return;
        }
        
        transitionInProgress = true;
        currentScene = sceneId;
        
        if (saveState) {
            const cur = GameState.get('currentScene');
            if (cur && cur !== sceneId) {
                GameState.update({ previousScene: cur });
            }
            GameState.set('currentScene', sceneId);
            GameState.saveToLocalStorage();
        }
        
        document.body.classList.add('scene-transition-out');
        
        setTimeout(() => {
            const href = getSceneHref(sceneId);
            const url = new URL(href, window.location.href).href;
            const here = window.location.href.split('#')[0];
            const there = url.split('#')[0];
            if (there === here) {
                document.body.classList.remove('scene-transition-out');
                transitionInProgress = false;
                return;
            }
            window.location.assign(url);
        }, 300);
    }
    
    function getCurrentScene() {
        return currentScene;
    }
    
    function getScenePath(sceneId) {
        return sceneMap[sceneId] || null;
    }
    
    function goBack() {
        const previousScene = GameState.get('previousScene');
        if (previousScene) {
            navigateTo(previousScene);
        } else {
            navigateTo('scene1');
        }
    }
    
    function navigateWithData(sceneId, data) {
        // Store scene data for next scene
        sessionStorage.setItem('sceneTransitionData', JSON.stringify(data));
        navigateTo(sceneId);
    }
    
    function getTransitionData() {
        const data = sessionStorage.getItem('sceneTransitionData');
        sessionStorage.removeItem('sceneTransitionData');
        return data ? JSON.parse(data) : null;
    }
    
    function canGoBack() {
        return GameState.get('previousScene') !== null;
    }
    
    return {
        navigateTo,
        getCurrentScene,
        getScenePath,
        getSceneHref,
        goBack,
        navigateWithData,
        getTransitionData,
        canGoBack
    };
})();