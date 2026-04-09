/**
 * Scene Manager
 * Orchestrates scene loading and progression
 */

const SceneManager = (function() {
    let currentSceneId = 'scene1';
    let sceneData = null;
    let dialogueQueue = [];
    let currentDialogueIndex = 0;
    let isProcessingScene = false;
    let sceneCompleteCallback = null;
    let dialogueGen = 0;

    function assignTopLocation(href) {
        const url = new URL(href, window.location.href).href;
        window.location.assign(url);
    }

    const SCENE_PAGE_MAP = {
        scene1: 'pages/scene1-intro.html',
        scene2: 'pages/scene2-daily.html',
        scene3: 'pages/scene3-feelings.html',
        scene4: 'pages/scene4-picture.html',
        scene5: 'pages/scene5-confession.html',
        scene6: 'pages/scene6-genshin.html',
        scene7: 'pages/scene7-promise.html',
        scene8: 'pages/scene8-assurance.html',
        scene9: 'pages/scene9-pony.html',
        scene10: 'pages/scene10-protector.html',
        scene11: 'pages/scene11-plans.html',
        scene12: 'pages/scene12-vision.html',
        scene13: 'pages/scene13-ending.html',
        ending_ignore: 'pages/ending-ignore.html',
        ending_drift: 'pages/ending-drift.html',
        ending_fear: 'pages/ending-fear.html',
        ending_secret: 'pages/ending-secret.html'
    };

    function resolveSceneHref(sceneId) {
        const path = SCENE_PAGE_MAP[sceneId];
        if (!path) return null;
        const p = (location.pathname || '').replace(/\\/g, '/');
        const inPages = p.includes('/pages/');
        if (inPages && path.indexOf('pages/') === 0) {
            return path.slice(6);
        }
        return path;
    }

    function sceneHasHtmlPage(sceneId) {
        if (typeof Router !== 'undefined' && Router.getScenePath) {
            return !!Router.getScenePath(sceneId);
        }
        return !!SCENE_PAGE_MAP[sceneId];
    }

    function navigateToScenePage(sceneId, saveState) {
        if (typeof Router !== 'undefined' && Router.navigateTo) {
            Router.navigateTo(sceneId, saveState !== false);
            return;
        }
        const save = saveState !== false;
        if (!SCENE_PAGE_MAP[sceneId]) {
            console.error('Scene not found:', sceneId);
            return;
        }
        if (save && typeof GameState !== 'undefined') {
            const cur = GameState.get('currentScene');
            if (cur && cur !== sceneId) {
                GameState.update({ previousScene: cur });
            }
            GameState.set('currentScene', sceneId);
            GameState.saveToLocalStorage();
        }
        document.body.classList.add('scene-transition-out');
        setTimeout(() => {
            const href = resolveSceneHref(sceneId);
            const url = new URL(href, window.location.href).href;
            const here = window.location.href.split('#')[0];
            const there = url.split('#')[0];
            if (there === here) {
                document.body.classList.remove('scene-transition-out');
                return;
            }
            window.location.assign(url);
        }, 300);
    }

    function hrefForSceneOrEnding(sceneId) {
        if (typeof Router !== 'undefined' && Router.getSceneHref) {
            const h = Router.getSceneHref(sceneId);
            if (h) return h;
        }
        return resolveSceneHref(sceneId);
    }

    function wrapResolve(resolve) {
        const g = dialogueGen;
        return function wrapped() {
            if (g !== dialogueGen) return;
            resolve();
        };
    }

    function branchScriptKey(sceneId, branch) {
        if (!branch) return null;
        const key = `${sceneId}_branch${branch}`;
        return sceneScripts[key] ? key : null;
    }

    function handleChoiceNavigation(choiceId, choice, resolve) {
        const done = wrapResolve(resolve);
        PathManager.applyChoiceEffects(choice);
        PathManager.applyChoiceBranch(choice);

        const nextScene = PathManager.getNextScene(currentSceneId, choiceId);
        if (!nextScene) {
            done();
            return;
        }

        if (nextScene.indexOf('ending_') === 0) {
            loadScene(nextScene);
            done();
            return;
        }

        if (currentSceneId === 'scene1' && nextScene === 'scene2' && choice.branch && choice.branch !== 'C') {
            const key = branchScriptKey('scene1', choice.branch);
            if (key) {
                loadScene('scene1', choice.branch);
                done();
                return;
            }
        }

        if (currentSceneId === 'scene2' && nextScene === 'scene3') {
            const key = branchScriptKey('scene2', choice.branch);
            if (key) {
                loadScene('scene2', choice.branch);
                done();
                return;
            }
            navigateToScenePage('scene3');
            done();
            return;
        }

        if (currentSceneId === 'scene3' && nextScene === 'scene4' && choice.branch) {
            const key = branchScriptKey('scene3', choice.branch);
            if (key) {
                loadScene('scene3', choice.branch);
                done();
                return;
            }
        }

        if (currentSceneId === 'scene6' && nextScene === 'scene7' && choice.branch) {
            const key = branchScriptKey('scene6', choice.branch);
            if (key) {
                loadScene('scene6', choice.branch);
                done();
                return;
            }
        }

        if (nextScene && sceneScripts[nextScene] && !sceneHasHtmlPage(nextScene)) {
            loadScene(nextScene);
            done();
            return;
        }

        if (sceneHasHtmlPage(nextScene)) {
            navigateToScenePage(nextScene);
            done();
            return;
        }

        loadScene(nextScene);
        done();
    }

    function rewindDialogue() {
        if (!isProcessingScene || ChoiceButtons.isCurrentlyShowing()) return;
        if (typeof TextBox !== 'undefined' && TextBox.isCurrentlyTyping()) return;

        if (currentDialogueIndex >= 2) {
            dialogueGen++;
            currentDialogueIndex -= 2;
            TextBox.clear();
            processNextDialogue();
            return;
        }

        const prevChapter = GameState.get('previousScene');
        if (prevChapter && sceneHasHtmlPage(prevChapter)) {
            const ok = confirm('Return to the previous chapter? You will restart that chapter from the beginning when it loads.');
            if (!ok) return;
            navigateToScenePage(prevChapter);
        }
    }
    
    // Scene definitions with their dialogue sequences
    const sceneScripts = {
        scene1: {
            background: 'discord-server',
            music: 'theme-main',
            sequence: [
                // Show both avatars
                { action: 'showAvatars', both: true },
                { action: 'expression', girl: 'excited', guy: 'nervous' },
                { action: 'bubble', girl: { type: 'sparkle', duration: 1500 } },
                { action: 'narration', text: 'scene1.narration1' },
                { action: 'bubble', guy: { type: 'sweat', duration: 1500 } },
                { action: 'dialogue', speaker: 'Guy', text: 'scene1.guyIntro' },
                { action: 'expression', guy: 'blush' },
                { action: 'choice', choices: 'scene1' }
            ]
        },
        
        // Branch A sequence
        scene1_branchA: {
            sequence: [
                { action: 'expression', girl: 'excited' },
                { action: 'bubble', girl: { type: 'sparkle' } },
                { action: 'dialogue', speaker: 'Girl', text: 'scene1.branchA_girlReply' },
                { action: 'expression', guy: 'excited' },
                { action: 'bubble', guy: { type: 'exclamation' } },
                { action: 'dialogue', speaker: 'Guy', text: 'scene1.branchA_guyBurst' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene1.branchA_guyResponse' },
                { action: 'bubble', both: { type: 'speech' } },
                { action: 'narration', text: 'scene1.branchA_narration' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene1.passage_guyFood' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene1.passage_girlFood' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene1.passage_guyScience' },
                { action: 'narration', text: 'scene1.passage_narration' },
                { action: 'pause', duration: 2200 },
                { action: 'narration', text: 'scene1.monthLaterCard' },
                { action: 'pause', duration: 2800 },
                { action: 'narration', text: 'scene1.montage_dm1' },
                { action: 'pause', duration: 1400 },
                { action: 'narration', text: 'scene1.montage_dm2' },
                { action: 'pause', duration: 1400 },
                { action: 'narration', text: 'scene1.montage_dm3' },
                { action: 'pause', duration: 1600 },
                { action: 'narration', text: 'scene1.montage_dm4' },
                { action: 'pause', duration: 1400 },
                { action: 'narration', text: 'scene1.montage_dm5' },
                { action: 'pause', duration: 1600 },
                { action: 'narration', text: 'scene1.montage_dm6' },
                { action: 'pause', duration: 1600 },
                { action: 'narration', text: 'scene1.montage_dm7' },
                { action: 'pause', duration: 1400 },
                { action: 'narration', text: 'scene1.montage_dm8' },
                { action: 'pause', duration: 1800 },
                { action: 'narration', text: 'scene1.montage_beforeScene2' },
                { action: 'pause', duration: 2400 },
                { action: 'transition', to: 'scene2' }
            ]
        },
        
        // Branch B sequence
        scene1_branchB: {
            sequence: [
                { action: 'expression', girl: 'nervous' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene1.branchB_girlReply' },
                { action: 'expression', guy: 'happy' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene1.branchB_guyResponse' },
                { action: 'expression', girl: 'happy' },
                { action: 'accessory', girl: 'bunny' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene1.branchB_girlFollowup' },
                { action: 'expression', guy: 'nervous' },
                { action: 'bubble', guy: { type: 'sweat' } },
                { action: 'dialogue', speaker: 'Guy', text: 'scene1.branchB_guyGenshin' },
                { action: 'bubble', both: { type: 'heart' } },
                { action: 'narration', text: 'scene1.branchB_narration' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene1.passageB_girlGenshin' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene1.passageB_guyLore' },
                { action: 'narration', text: 'scene1.passageB_narration' },
                { action: 'pause', duration: 2200 },
                { action: 'narration', text: 'scene1.monthLaterCard' },
                { action: 'pause', duration: 2800 },
                { action: 'narration', text: 'scene1.montageB_dm1' },
                { action: 'pause', duration: 1400 },
                { action: 'narration', text: 'scene1.montageB_dm2' },
                { action: 'pause', duration: 1400 },
                { action: 'narration', text: 'scene1.montageB_dm3' },
                { action: 'pause', duration: 1600 },
                { action: 'narration', text: 'scene1.montageB_dm4' },
                { action: 'pause', duration: 1400 },
                { action: 'narration', text: 'scene1.montageB_dm5' },
                { action: 'pause', duration: 1600 },
                { action: 'narration', text: 'scene1.montageB_dm6' },
                { action: 'pause', duration: 1400 },
                { action: 'narration', text: 'scene1.montageB_dm7' },
                { action: 'pause', duration: 1800 },
                { action: 'narration', text: 'scene1.montageB_beforeScene2' },
                { action: 'pause', duration: 2400 },
                { action: 'transition', to: 'scene2' }
            ]
        },
        
        scene2: {
            background: 'sunset-chat',
            music: 'theme-happy',
            sequence: [
                { action: 'expression', guy: 'happy', girl: 'happy' },
                { action: 'narration', text: 'scene2.narration1' },
                { action: 'bubble', guy: { type: 'yapping' } },
                { action: 'dialogue', speaker: 'Guy', text: 'scene2.guyYap1' },
                { action: 'expression', girl: 'excited' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene2.girlResponse1' },
                { action: 'expression', guy: 'excited' },
                { action: 'bubble', guy: { type: 'sparkle' } },
                { action: 'dialogue', speaker: 'Guy', text: 'scene2.guyResponse1' },
                { action: 'accessory', girl: 'crown' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene2.girlPrincess' },
                { action: 'narration', text: 'scene2.narration2' },
                { action: 'expression', guy: 'nervous' },
                { action: 'narration', text: 'scene2.narration_lull' },
                { action: 'thought', guy: 'scene2.guyInternalMonologue' },
                { action: 'expression', girl: 'sad' },
                { action: 'choice', choices: 'scene2_lull' }
            ]
        },
        
        // Scene 2 Branch A sequence
        scene2_branchA: {
            sequence: [
                { action: 'expression', girl: 'nervous' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene2_branchA.girlConfront' },
                { action: 'expression', guy: 'sad' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene2_branchA.guyResponse' },
                { action: 'expression', girl: 'determined' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene2_branchA.girlDefense' },
                { action: 'expression', guy: 'blush' },
                { action: 'bubble', guy: { type: 'heart' } },
                { action: 'dialogue', speaker: 'Guy', text: 'scene2_branchA.guyTouched' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene2_branchA.girlCommand' },
                { action: 'expression', guy: 'excited' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene2_branchA.guyYapReturns' },
                { action: 'bubble', both: { type: 'heart' } },
                { action: 'narration', text: 'scene2_branchA.narration' },
                { action: 'transition', to: 'scene3' }
            ]
        },

        scene2_branchB: {
            sequence: [
                { action: 'expression', girl: 'excited' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene2_branchB.girlYap' },
                { action: 'expression', guy: 'excited' },
                { action: 'bubble', guy: { type: 'heart' } },
                { action: 'dialogue', speaker: 'Guy', text: 'scene2_branchB.guyInterrupt' },
                { action: 'expression', girl: 'blush' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene2_branchB.girlSurprise' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene2_branchB.guyApology' },
                { action: 'accessory', girl: 'crown' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene2_branchB.girlSoup' },
                { action: 'narration', text: 'scene2_branchB.narration' },
                { action: 'transition', to: 'scene3' }
            ]
        },

        scene2_branchD: {
            sequence: [
                { action: 'expression', girl: 'nervous' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene2_branchD.girlAnxious' },
                { action: 'expression', guy: 'nervous' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene2_branchD.guyPanic' },
                { action: 'expression', girl: 'sad' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene2_branchD.girlRelief' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene2_branchD.guyPromise' },
                { action: 'bubble', both: { type: 'heart' } },
                { action: 'narration', text: 'scene2_branchD.narration' },
                { action: 'transition', to: 'scene3' }
            ]
        },
        
        scene3: {
            background: 'sunset-chat',
            music: 'theme-romantic',
            sequence: [
                { action: 'narration', text: 'scene3.narration1' },
                { action: 'expression', girl: 'blush' },
                { action: 'thought', girl: 'scene3.girlInternal' },
                { action: 'narration', text: 'scene3.narrationMeanwhile' },
                { action: 'expression', guy: 'blush' },
                { action: 'thought', guy: 'scene3.guyInternal' },
                { action: 'narration', text: 'scene3.narration2' },
                { action: 'expression', guy: 'nervous' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene3.guyConfessionLead' },
                { action: 'choice', choices: 'scene3_confession' }
            ]
        },

        scene3_branchA: {
            background: 'sunset-chat',
            music: 'theme-romantic',
            sequence: [
                { action: 'expression', girl: 'nervous' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene3_branchA.girlNervousYes' },
                { action: 'pause', duration: 1400 },
                { action: 'expression', guy: 'nervous' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene3_branchA.guyConfession' },
                { action: 'expression', girl: 'excited' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene3_branchA.girlRelief' },
                { action: 'expression', guy: 'shock' },
                { action: 'bubble', guy: { type: 'sparkle' } },
                { action: 'dialogue', speaker: 'Guy', text: 'scene3_branchA.guyShock' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene3_branchA.girlConfirm' },
                { action: 'expression', guy: 'happy', girl: 'happy' },
                { action: 'bubble', both: { type: 'heart' } },
                { action: 'narration', text: 'scene3_branchA.narrationCelebrate' },
                { action: 'pause', duration: 1800 },
                { action: 'choice', choices: 'scene3_commitment' }
            ]
        },

        scene3_branchB: {
            background: 'sunset-chat',
            music: 'theme-romantic',
            sequence: [
                { action: 'expression', girl: 'happy' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene3_branchB.girlPlayful' },
                { action: 'expression', guy: 'nervous' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene3_branchB.guyTease' },
                { action: 'expression', girl: 'nervous' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene3_branchB.girlWorried' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene3_branchB.guySerious' },
                { action: 'expression', girl: 'happy' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene3_branchB.girlConfess' },
                { action: 'expression', guy: 'determined' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene3_branchB.guyInterrupt' },
                { action: 'bubble', both: { type: 'heart' } },
                { action: 'narration', text: 'scene3_branchB.narrationCelebrate' },
                { action: 'pause', duration: 1800 },
                { action: 'choice', choices: 'scene3_commitment' }
            ]
        },

        scene3_branchC: {
            background: 'sunset-chat',
            music: 'theme-romantic',
            sequence: [
                { action: 'expression', girl: 'blush' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene3_branchC.girlMutual' },
                { action: 'expression', guy: 'shock' },
                { action: 'pause', duration: 900 },
                { action: 'dialogue', speaker: 'Guy', text: 'scene3_branchC.guyStunned' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene3_branchC.guyDoubleCheck' },
                { action: 'expression', girl: 'happy' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene3_branchC.girlSpeech' },
                { action: 'expression', guy: 'happy' },
                { action: 'bubble', guy: { type: 'heart' } },
                { action: 'dialogue', speaker: 'Guy', text: 'scene3_branchC.guyEmotional' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene3_branchC.girlSoft' },
                { action: 'bubble', both: { type: 'heart' } },
                { action: 'narration', text: 'scene3_branchC.narrationCelebrate' },
                { action: 'pause', duration: 1800 },
                { action: 'choice', choices: 'scene3_commitment' }
            ]
        },

        scene3_fearPath: {
            background: 'sunset-chat',
            music: 'theme-tense',
            sequence: [
                { action: 'expression', girl: 'sad' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene3_fear.girlPull' },
                { action: 'expression', guy: 'sad' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene3_fear.guyUnderstand' },
                { action: 'narration', text: 'scene3_fear.narrationFade' },
                { action: 'pause', duration: 2200 },
                { action: 'ending', type: 'fear' }
            ]
        },
        
        scene4: {
            background: 'night-call',
            music: 'theme-tense',
            sequence: [
                { action: 'narration', text: 'scene4.narration_buildup' },
                { action: 'expression', girl: 'nervous' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene4.girlSendsPic' },
                { action: 'expression', guy: 'shock' },
                { action: 'pause', duration: 1000 },
                { action: 'expression', guy: 'sad' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene4.guySuspicious' },
                { action: 'expression', girl: 'sad' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene4.girlConfused' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene4.guyHurt' },
                { action: 'narration', text: 'scene4.narration_incoming' },
                { action: 'choice', choices: 'scene4_picture' }
            ]
        },
        
        scene4_call: {
            background: 'night-call',
            music: 'theme-tense',
            sequence: [
                { action: 'dialogue', speaker: 'Girl (Voice)', text: 'scene4.girlVoice' },
                { action: 'expression', guy: 'blush' },
                { action: 'bubble', guy: { type: 'heart' } },
                { action: 'dialogue', speaker: 'Guy (Voice)', text: 'scene4.guyVoiceRelieved' },
                { action: 'dialogue', speaker: 'Girl (Voice)', text: 'scene4.girlVoiceReassure' },
                { action: 'dialogue', speaker: 'Guy (Voice)', text: 'scene4.guyVoicePromise' },
                { action: 'expression', girl: 'happy' },
                { action: 'dialogue', speaker: 'Girl (Voice)', text: 'scene4.girlVoicePlayful' },
                { action: 'bubble', both: { type: 'heart' } },
                { action: 'narration', text: 'scene4.narration_end' },
                { action: 'transition', to: 'scene5' }
            ]
        },
        
        scene5: {
            background: 'sunset-chat',
            music: 'theme-romantic',
            sequence: [
                { action: 'narration', text: 'scene5.narration' },
                { action: 'expression', girl: 'nervous' },
                { action: 'accessory', girl: 'crown' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene5.girlNervous' },
                { action: 'expression', guy: 'happy' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene5.guyEncouraging' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene5.girlConfession' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene5.girlAsks' },
                { action: 'choice', choices: 'scene5_official' }
            ]
        },

        scene5_romance: {
            background: 'sunset-chat',
            music: 'theme-romantic',
            sequence: [
                { action: 'expression', guy: 'shock' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene5.guyShock' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene5.girlConfirm' },
                { action: 'expression', guy: 'blush' },
                { action: 'bubble', guy: { type: 'heart' } },
                { action: 'dialogue', speaker: 'Guy', text: 'scene5.guyYes' },
                { action: 'expression', girl: 'excited' },
                { action: 'bubble', girl: { type: 'sparkle' } },
                { action: 'dialogue', speaker: 'Girl', text: 'scene5.girlCelebrate' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene5.guyHappy' },
                { action: 'bubble', both: { type: 'heart' } },
                { action: 'banner', text: 'OFFICIAL!' },
                { action: 'narration', text: 'scene5.narration_end' },
                { action: 'expression', guy: 'excited', girl: 'excited' },
                { action: 'bubble', both: { type: 'sparkle' } },
                { action: 'dialogue', speaker: 'Guy', text: 'scene5.afterOfficial_guy' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene5.afterOfficial_girl' },
                { action: 'narration', text: 'scene5.montageOfficial1' },
                { action: 'pause', duration: 1400 },
                { action: 'narration', text: 'scene5.montageOfficial2' },
                { action: 'pause', duration: 1400 },
                { action: 'narration', text: 'scene5.montageOfficial3' },
                { action: 'pause', duration: 1600 },
                { action: 'narration', text: 'scene5.montageOfficial4' },
                { action: 'pause', duration: 1800 },
                { action: 'transition', to: 'scene6' }
            ]
        },

        scene5_platonic: {
            background: 'sunset-chat',
            music: 'theme-happy',
            sequence: [
                { action: 'expression', guy: 'happy', girl: 'happy' },
                { action: 'narration', text: 'scene5_platonic.narration' },
                { action: 'bubble', both: { type: 'sparkle' } },
                { action: 'dialogue', speaker: 'Guy', text: 'scene5_platonic.guyMHA' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene5_platonic.girlClover' },
                { action: 'narration', text: 'scene5_platonic.narrationEnd' },
                { action: 'pause', duration: 2000 },
                { action: 'ending', type: 'secret' }
            ]
        },
        
        scene6: {
            background: 'genshin-landscape',
            music: 'theme-happy',
            sequence: [
                { action: 'narration', text: 'scene6.narration' },
                { action: 'expression', girl: 'excited' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene6.girlUnleash' },
                { action: 'expression', guy: 'happy' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene6.guyReady' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene6.girlWanderer' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene6.guyInterested' },
                { action: 'expression', girl: 'blush' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene6.girlTouched' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene6.guySincere' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene6.girlShock' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene6.guyResearched' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene6.girlExcited' },
                { action: 'narration', text: 'scene6.narrationEra' },
                { action: 'bubble', guy: { type: 'sparkle' } },
                { action: 'choice', choices: 'scene6_shipping' }
            ]
        },

        scene6_branchA: {
            background: 'genshin-landscape',
            music: 'theme-happy',
            sequence: [
                { action: 'expression', girl: 'excited' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene6_branchA.girlShip' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene6_branchA.guyShip' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene6_branchA.girlHappy' },
                { action: 'bubble', both: { type: 'heart' } },
                { action: 'pause', duration: 1200 },
                { action: 'transition', to: 'scene7' }
            ]
        },

        scene6_branchB: {
            background: 'genshin-landscape',
            music: 'theme-happy',
            sequence: [
                { action: 'expression', girl: 'excited' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene6_branchB.girlChars' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene6_branchB.guyNotes' },
                { action: 'pause', duration: 1200 },
                { action: 'transition', to: 'scene7' }
            ]
        },

        scene6_branchC: {
            background: 'genshin-landscape',
            music: 'theme-happy',
            sequence: [
                { action: 'expression', girl: 'shock' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene6_branchC.girlDad' },
                { action: 'expression', guy: 'happy' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene6_branchC.guyDad' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene6_branchC.girlLove' },
                { action: 'bubble', both: { type: 'heart' } },
                { action: 'pause', duration: 1200 },
                { action: 'transition', to: 'scene7' }
            ]
        },
        
        scene7: {
            background: 'soft-evening',
            music: 'theme-romantic',
            sequence: [
                { action: 'narration', text: 'scene7.narration' },
                { action: 'expression', girl: 'nervous' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene7.girlNotice' },
                { action: 'expression', guy: 'nervous' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene7.guyDeflect' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene7.girlPush' },
                { action: 'expression', guy: 'sad' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene7.guyVulnerable' },
                { action: 'expression', girl: 'determined' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene7.girlReassure' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene7.guyApologize' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene7.girlSupport' },
                { action: 'expression', guy: 'determined' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene7.guyPromise' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene7.girlAffirm' },
                { action: 'narration', text: 'scene7.narration_printer' },
                { action: 'narration', text: 'scene7.narration_end' },
                { action: 'transition', to: 'scene8' }
            ]
        },
        
        scene8: {
            background: 'dreamy-hearts',
            music: 'theme-romantic',
            sequence: [
                { action: 'narration', text: 'scene8.narration' },
                { action: 'expression', girl: 'sad' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene8.girlVulnerable' },
                { action: 'expression', guy: 'happy' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene8.guyOpen' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene8.girlInsecure' },
                { action: 'expression', guy: 'determined' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene8.guyIntense' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene8.girlOkay' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene8.guyAssurance' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene8.guyContinue' },
                { action: 'expression', girl: 'blush' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene8.girlUsagi' },
                { action: 'accessory', girl: 'bunny' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene8.guyUsagi' },
                { action: 'bubble', girl: { type: 'heart' } },
                { action: 'dialogue', speaker: 'Girl', text: 'scene8.girlLove' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene8.guyStay' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene8.girlSafe' },
                { action: 'narration', text: 'scene8.narration_end' },
                { action: 'animation', type: 'house-building' },
                { action: 'transition', to: 'scene9' }
            ]
        },
        
        scene9: {
            background: 'pastel-rainbow',
            music: 'theme-happy',
            sequence: [
                { action: 'expression', guy: 'nervous', girl: 'sad' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene9.guyNotice' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene9.girlSad' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene9.guyIdea' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene9.girlCurious' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene9.guyPony' },
                { action: 'expression', girl: 'shock' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene9.girlSurprise' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene9.guyLayers' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene9.girlBrony' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene9.guyPinkie' },
                { action: 'expression', girl: 'blush' },
                { action: 'bubble', girl: { type: 'heart' } },
                { action: 'dialogue', speaker: 'Girl', text: 'scene9.girlCry' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene9.guyWatch' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene9.girlYes' },
                { action: 'transition', to: 'scene10' }
            ]
        },
        
        scene10: {
            background: 'fantasy-night',
            music: 'theme-tense',
            sequence: [
                { action: 'narration', text: 'scene10.narration' },
                { action: 'expression', girl: 'sad' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene10.girlNightmare' },
                { action: 'expression', guy: 'determined' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene10.guyAwake' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene10.girlCall' },
                { action: 'dialogue', speaker: 'Guy (Voice)', text: 'scene10.guyVoice' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene10.girlWhy' },
                { action: 'dialogue', speaker: 'Guy (Voice)', text: 'scene10.guyProtect' },
                { action: 'heroSequence' },
                { action: 'dialogue', speaker: 'Guy (Voice)', text: 'scene10.guyAfter' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene10.girlSafe' },
                { action: 'dialogue', speaker: 'Guy (Voice)', text: 'scene10.guyYap' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene10.girlYap' },
                { action: 'dialogue', speaker: 'Guy (Voice)', text: 'scene10.guyScience' },
                { action: 'expression', girl: 'sleepy' },
                { action: 'dialogue', speaker: 'Guy (Voice, whispered)', text: 'scene10.guyWhisper' },
                { action: 'transition', to: 'scene11' }
            ]
        },
        
        scene11: {
            background: 'food-district',
            music: 'theme-happy',
            sequence: [
                { action: 'narration', text: 'scene11.narration' },
                { action: 'expression', guy: 'excited', girl: 'excited' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene11.guyPlan' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene11.girlHungry' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene11.guyPho' },
                { action: 'expression', girl: 'blush' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene11.girlRemember' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene11.guyMemory' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene11.girlMore' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene11.guyKaraoke' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene11.girlSerenade' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene11.guySecret' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene11.girlArcade' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene11.guyArcade' },
                { action: 'accessory', girl: 'crown' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene11.girlTaro' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene11.guyPrincess' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene11.girlHis' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene11.guyFuture' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene11.girlTogether' },
                { action: 'transition', to: 'scene12' }
            ]
        },
        
        scene12: {
            background: 'house-building',
            music: 'theme-romantic',
            sequence: [
                { action: 'narration', text: 'scene12.narration' },
                { action: 'expression', guy: 'happy', girl: 'happy' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene12.guyVision' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene12.girlListen' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene12.guyReal' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene12.guyBuild' },
                { action: 'expression', girl: 'blush' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene12.girlCry' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene12.guyGoodTears' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene12.girlBest' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene12.guyContinue' },
                { action: 'animation', type: 'house-building' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene12.guyMarry' },
                { action: 'expression', girl: 'shock' },
                { action: 'bubble', girl: { type: 'heart' } },
                { action: 'dialogue', speaker: 'Girl', text: 'scene12.girlMarry' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene12.guyYesMarry' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene12.girlDream' },
                { action: 'bubble', both: { type: 'heart' } },
                { action: 'transition', to: 'scene13' }
            ]
        },
        
        scene13: {
            background: 'horizon-ending',
            music: 'theme-ending',
            sequence: [
                { action: 'narration', text: 'scene13.narration' },
                { action: 'expression', guy: 'happy', girl: 'happy' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene13.guyPromise' },
                { action: 'accessory', girl: 'bunny' },
                { action: 'accessory', girl: 'crown' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene13.girlPromise' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene13.guyBrick' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene13.girlLayer' },
                { action: 'animation', type: 'path-forward' },
                { action: 'dialogue', speaker: 'Guy', text: 'scene13.guyFinal' },
                { action: 'dialogue', speaker: 'Girl', text: 'scene13.girlFinal' },
                { action: 'ending', type: 'true' }
            ]
        }
    };
    
    // Load and run a scene
    async function loadScene(sceneId, branch = null) {
        if (sceneId && sceneId.indexOf('ending_') === 0) {
            isProcessingScene = false;
            const href = hrefForSceneOrEnding(sceneId);
            if (href) {
                assignTopLocation(href);
            } else {
                console.error('No route for ending:', sceneId);
            }
            return;
        }

        dialogueGen++;
        currentSceneId = sceneId;
        isProcessingScene = true;

        if (typeof TextBox !== 'undefined' && TextBox.init) {
            TextBox.init();
        }
        
        GameState.set('currentScene', sceneId);
        
        let scriptKey = sceneId;
        if (branch) {
            scriptKey = `${sceneId}_branch${branch}`;
        }
        
        const script = sceneScripts[scriptKey];
        if (!script) {
            console.error(`Scene script not found: ${scriptKey}`);
            isProcessingScene = false;
            return;
        }
        
        // Set background
        if (script.background) {
            Background.set(script.background);
        }
        
        // Set music
        if (script.music) {
            AudioManager.playMusic(script.music);
        }
        
        // Process sequence
        dialogueQueue = script.sequence;
        currentDialogueIndex = 0;
        
        processNextDialogue();
    }
    
    function processNextDialogue() {
        if (!isProcessingScene) return;
        if (currentDialogueIndex >= dialogueQueue.length) {
            isProcessingScene = false;
            if (sceneCompleteCallback) {
                sceneCompleteCallback();
            }
            return;
        }

        const stepGen = dialogueGen;
        const action = dialogueQueue[currentDialogueIndex];
        currentDialogueIndex++;

        executeAction(action).then(() => {
            if (stepGen !== dialogueGen) return;
            if (action.action !== 'choice') {
                processNextDialogue();
            }
        });
    }
    
    async function executeAction(action) {
        return new Promise((resolve) => {
            switch (action.action) {
                case 'showAvatars':
                    Avatar.showGuy(action.both || action.guy);
                    Avatar.showGirl(action.both || action.girl);
                    resolve();
                    break;
                    
                case 'expression':
                    if (action.guy) Avatar.setGuyExpression(action.guy);
                    if (action.girl) Avatar.setGirlExpression(action.girl);
                    resolve();
                    break;
                    
                case 'bubble':
                    if (action.guy) {
                        Bubble.show('guy', action.guy.type, action.guy.text, action.guy.duration);
                    }
                    if (action.girl) {
                        Bubble.show('girl', action.girl.type, action.girl.text, action.girl.duration);
                    }
                    if (action.both) {
                        Bubble.show('guy', action.both.type, null, action.both.duration);
                        Bubble.show('girl', action.both.type, null, action.both.duration);
                    }
                    resolve();
                    break;
                    
                case 'thought':
                    if (action.guy) {
                        Bubble.showThought('guy', getDialogueText(action.guy), 3000);
                    }
                    if (action.girl) {
                        Bubble.showThought('girl', getDialogueText(action.girl), 3000);
                    }
                    resolve();
                    break;
                    
                case 'accessory':
                    if (action.guy) Avatar.addAccessory('guy', action.guy);
                    if (action.girl) Avatar.addAccessory('girl', action.girl);
                    resolve();
                    break;
                    
                case 'narration':
                    TextBox.showNarration(getDialogueText(action.text), wrapResolve(resolve));
                    break;
                    
                case 'dialogue':
                    TextBox.showText(
                        action.speaker,
                        getDialogueText(action.text),
                        wrapResolve(resolve)
                    );
                    break;
                    
                case 'pause':
                    setTimeout(wrapResolve(resolve), action.duration || 1000);
                    break;
                    
                case 'choice': {
                    const treeKey = action.choices || PathManager.getChoiceTreeKey(currentSceneId);
                    const choiceList = ChoiceTree[treeKey]?.choices || PathManager.getChoices(currentSceneId);
                    ChoiceButtons.showChoices(choiceList, (choiceId, choice) => {
                        handleChoiceNavigation(choiceId, choice, resolve);
                    });
                    break;
                }
                    
                case 'transition':
                    if (sceneHasHtmlPage(action.to)) {
                        navigateToScenePage(action.to);
                        resolve();
                    } else {
                        loadScene(action.to).then(() => resolve());
                    }
                    break;
                    
                case 'heroSequence':
                    Avatar.playHeroSequence();
                    setTimeout(resolve, 2000);
                    break;
                    
                case 'animation':
                    playSceneAnimation(action.type);
                    resolve();
                    break;
                    
                case 'banner':
                    showBanner(action.text);
                    resolve();
                    break;
                    
                case 'ending':
                    showEnding(action.type);
                    resolve();
                    break;
                    
                default:
                    resolve();
            }
        });
    }
    
    function getDialogueText(key) {
        // Parse dot notation keys like 'scene1.narration1'
        const parts = key.split('.');
        let value = DialogueDB;
        for (const part of parts) {
            value = value?.[part];
        }
        return value || key;
    }
    
    function playSceneAnimation(type) {
        // Trigger CSS animations
        document.body.setAttribute('data-animation', type);
        setTimeout(() => {
            document.body.removeAttribute('data-animation');
        }, 3000);
    }
    
    function showBanner(text) {
        const banner = document.createElement('div');
        banner.className = 'game-banner';
        banner.textContent = text;
        document.getElementById('game-container').appendChild(banner);
        
        setTimeout(() => banner.remove(), 3000);
    }
    
    function showEnding(type) {
        const ending = Endings[type] || (type === 'true' ? Endings.true : null);
        if (!ending) return;
        const seen = GameState.get('endingsSeen') || [];
        const typeKey = type === true ? 'true' : type;
        GameState.update({ endingsSeen: seen.includes(typeKey) ? seen : [...seen, typeKey] });

        if (typeKey === 'true') {
            return;
        }

        const sceneId = `ending_${typeKey}`;
        let href = hrefForSceneOrEnding(sceneId);
        if (!href) {
            href = (location.pathname || '').replace(/\\/g, '/').includes('/pages/')
                ? `ending-${typeKey}.html`
                : `pages/ending-${typeKey}.html`;
        }
        assignTopLocation(href);
    }
    
    function onSceneComplete(callback) {
        sceneCompleteCallback = callback;
    }
    
    function skipCurrentDialogue() {
        if (isProcessingScene) {
            TextBox.skipTyping();
        }
    }
    
    if (typeof document !== 'undefined') {
        document.addEventListener('dialogue:rewind', () => rewindDialogue());
    }

    return {
        loadScene,
        rewindDialogue,
        skipCurrentDialogue,
        onSceneComplete,
        isProcessingScene: () => isProcessingScene
    };
})();