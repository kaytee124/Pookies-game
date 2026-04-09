/**
 * Branching Path Logic
 * Determines scene flow based on choices and state
 */

const PathManager = (function() {
    // Scene flow mapping
    const sceneFlow = {
        // Main path
        scene1: {
            next: 'scene2',
            choices: 'scene1'
        },
        scene2: {
            next: 'scene3',
            choices: 'scene2_lull',
            beforeChoices: (state) => {
                // Check if we should show lull choices
                return state.friendshipLevel >= 20;
            }
        },
        scene3: {
            next: 'scene4',
            choices: 'scene3_confession',
            condition: (state) => state.romanceFlag
        },
        scene4: {
            next: 'scene5',
            choices: 'scene4_picture'
        },
        scene5: {
            next: 'scene6'
        },
        scene6: {
            next: 'scene7',
            choices: 'scene6_shipping'
        },
        scene7: {
            next: 'scene8'
        },
        scene8: {
            next: 'scene9'
        },
        scene9: {
            next: 'scene10'
        },
        scene10: {
            next: 'scene11'
        },
        scene11: {
            next: 'scene12'
        },
        scene12: {
            next: 'scene13'
        },
        scene13: {
            next: 'ending_true',
            isEnding: true
        }
    };
    
    // Ending mappings
    const endingScenes = {
        ending_ignore: 'ignore',
        ending_drift: 'drift',
        ending_fear: 'fear',
        ending_secret: 'secret',
        ending_true: 'true'
    };
    
    function getChoiceTreeKey(currentScene) {
        return sceneFlow[currentScene]?.choices || currentScene;
    }

    function findChoiceInTree(choiceId) {
        for (const key of Object.keys(ChoiceTree)) {
            const ch = ChoiceTree[key]?.choices?.find(c => c.id === choiceId);
            if (ch) return ch;
        }
        return null;
    }

    // Get next scene based on choice (searches all trees so e.g. scene3_commitment works while on scene3)
    function getNextScene(currentScene, choiceId) {
        const treeKey = getChoiceTreeKey(currentScene);
        const primary = ChoiceTree[treeKey]?.choices?.find(c => c.id === choiceId);
        if (primary?.nextScene) return primary.nextScene;

        const anywhere = findChoiceInTree(choiceId);
        if (anywhere?.nextScene) return anywhere.nextScene;

        return sceneFlow[currentScene]?.next || null;
    }
    
    // Check if current scene is an ending
    function isEnding(sceneId) {
        return sceneId.startsWith('ending_') || sceneFlow[sceneId]?.isEnding === true;
    }
    
    // Get ending data
    function getEnding(sceneId) {
        const endingKey = endingScenes[sceneId] || 'true';
        return Endings[endingKey];
    }
    
    // Check if scene should show choices
    function shouldShowChoices(sceneId, state) {
        const scene = sceneFlow[sceneId];
        if (!scene?.choices) return false;
        
        // Check condition if exists
        if (scene.beforeChoices && !scene.beforeChoices(state)) {
            return false;
        }
        
        return true;
    }
    
    // Get choices for current scene
    function getChoices(sceneId) {
        const scene = sceneFlow[sceneId];
        if (!scene?.choices) return null;
        
        return ChoiceTree[scene.choices]?.choices || null;
    }
    
    // Apply choice effects to game state
    function applyChoiceEffects(choice) {
        if (!choice.effects) return;
        
        const effects = choice.effects;
        
        if (effects.friendship) {
            GameState.addFriendship(effects.friendship);
        }
        if (effects.trust) {
            GameState.addTrust(effects.trust);
        }
        if (effects.romance) {
            // Handle romance flag
            if (effects.romance > 0) {
                GameState.set('romanceFlag', true);
            }
        }
        if (effects.flag) {
            GameState.set(effects.flag, true);
        }
        if (effects.ending) {
            GameState.set('endingTriggered', effects.ending);
        }
        if (effects.platonicPath) {
            const cur = GameState.get('platonicPathScore') || 0;
            GameState.update({ platonicPathScore: cur + effects.platonicPath });
        }
        if (effects.platonicBesties) {
            GameState.update({ platonicBesties: true, romanceFlag: false });
        }
    }

    function applyChoiceBranch(choice) {
        if (!choice || !choice.branch) return;
        const scene = GameState.get('currentScene');
        if (scene === 'scene1') GameState.update({ scene1Branch: choice.branch });
        else if (scene === 'scene2') GameState.update({ scene2Branch: choice.branch });
        else if (scene === 'scene3') GameState.update({ scene3Branch: choice.branch });
        else if (scene === 'scene6') GameState.update({ scene6Branch: choice.branch });
    }
    
    return {
        getNextScene,
        getChoiceTreeKey,
        isEnding,
        getEnding,
        shouldShowChoices,
        getChoices,
        applyChoiceEffects,
        applyChoiceBranch,
        sceneFlow,
        endingScenes
    };
})();