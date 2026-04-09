/**
 * Choice Tree Definitions
 * Maps all possible choices and their outcomes
 */

const ChoiceTree = {
    // Scene 1 Choices
    scene1: {
        choices: [
            {
                id: 'enthusiastic',
                text: 'hiiii!! omg yes let\'s be friends!! you seem cool too hehe~ what games do you play? 🎮✨',
                nextScene: 'scene2',
                branch: 'A',
                effects: {
                    friendship: 10,
                    trust: 5,
                    flag: 'enthusiastic_start'
                }
            },
            {
                id: 'hesitant',
                text: 'uhm... hi? i guess we can talk a bit. what made you message me? 🤔',
                nextScene: 'scene2',
                branch: 'B',
                effects: {
                    friendship: 3,
                    trust: 0,
                    flag: 'hesitant_start',
                    platonicPath: 1
                }
            },
            {
                id: 'ignore',
                text: '[Ignore message - seen but no reply]',
                nextScene: 'ending_ignore',
                branch: 'C',
                effects: {
                    friendship: -100,
                    trust: -100,
                    ending: 'ignore'
                }
            }
        ]
    },
    
    // Scene 2 Choices (The Lull)
    scene2_lull: {
        choices: [
            {
                id: 'confront_care',
                text: 'heyyy... you\'ve been kinda quiet lately. is everything okay? i miss your random yapping you know 🥺',
                nextScene: 'scene3',
                branch: 'A',
                effects: {
                    friendship: 15,
                    trust: 20,
                    flag: 'communicated_care',
                    platonicPath: 1
                }
            },
            {
                id: 'fill_silence',
                text: '[Start yapping yourself—fill the silence with YOUR chaos]',
                nextScene: 'scene3',
                branch: 'B',
                effects: {
                    friendship: 10,
                    trust: 10,
                    flag: 'filled_silence',
                    platonicPath: 1
                }
            },
            {
                id: 'stay_quiet',
                text: '[Stay quiet too—maybe he needs space]',
                nextScene: 'ending_drift',
                branch: 'C',
                effects: {
                    friendship: -10,
                    trust: -15,
                    ending: 'drift'
                }
            },
            {
                id: 'anxious_question',
                text: 'did i do something wrong? you\'re not talking as much...',
                nextScene: 'scene3',
                branch: 'D',
                effects: {
                    friendship: 5,
                    trust: 15,
                    flag: 'anxious_communication'
                }
            }
        ]
    },
    
    // Scene 3 Choices (Confession Lead-up)
    scene3_confession: {
        choices: [
            {
                id: 'nervous_yes',
                text: 'yes... what is it? 🥺',
                nextScene: 'scene4',
                branch: 'A',
                effects: {
                    romance: 20,
                    flag: 'mutual_feelings'
                }
            },
            {
                id: 'playful_deflect',
                text: 'uh oh should i be scared?? 👀',
                nextScene: 'scene4',
                branch: 'B',
                effects: {
                    romance: 15,
                    flag: 'playful_confession',
                    platonicPath: 1
                }
            },
            {
                id: 'mutual_confess',
                text: 'wait... before you say anything... i think i know what it is. and i feel the same way.',
                nextScene: 'scene4',
                branch: 'C',
                effects: {
                    romance: 25,
                    trust: 15,
                    flag: 'mutual_immediate',
                    platonicPath: 1
                }
            }
        ]
    },

    scene3_commitment: {
        choices: [
            {
                id: 'commit_forward',
                text: 'I\'m all in. Whatever comes next—we face it together. 💕',
                nextScene: 'scene4',
                effects: {
                    trust: 10,
                    flag: 'chose_commitment_after_confession'
                }
            },
            {
                id: 'commit_fear',
                text: 'Actually... I\'m scared. The distance, the uncertainty... what if I get hurt? I don\'t know if I can do this. 😔',
                nextScene: 'scene3_fearPath',
                effects: {
                    trust: -5,
                    ending: 'fear'
                }
            }
        ]
    },
    
    // Scene 4 Choices (Picture Response)
    scene4_picture: {
        choices: [
            {
                id: 'answer_nervous',
                text: '[Answer nervously]',
                nextScene: 'scene4_call',
                effects: {
                    trust: 10
                }
            },
            {
                id: 'stare_shock',
                text: '[Stare at screen in shock]',
                nextScene: 'scene4_call',
                effects: {
                    trust: 10
                }
            },
            {
                id: 'answer_crying',
                text: '[Answer while crying a little]',
                nextScene: 'scene4_call',
                effects: {
                    trust: 10
                }
            }
        ]
    },
    
    // Scene 6 Choices (Genshin Shipping)
    scene6_shipping: {
        choices: [
            {
                id: 'shipping_chaos',
                text: 'okay but who do you ship wanderer WITH?? 👀',
                nextScene: 'scene7',
                branch: 'A',
                effects: {
                    friendship: 10,
                    flag: 'shipping_discussion'
                }
            },
            {
                id: 'more_characters',
                text: 'teach me about your other favorite characters too!',
                nextScene: 'scene7',
                branch: 'B',
                effects: {
                    friendship: 10,
                    flag: 'character_discussion',
                    platonicPath: 1
                }
            },
            {
                id: 'become_dad',
                text: 'so if wanderer is your son... does that make me his dad?? 🤔',
                nextScene: 'scene7',
                branch: 'C',
                effects: {
                    friendship: 15,
                    romance: 5,
                    flag: 'wanderer_stepdad'
                }
            }
        ]
    },

    scene5_official: {
        choices: [
            {
                id: 'official_yes',
                text: 'YES. I want YOU to be my boyfriend. 🥺💕',
                nextScene: 'scene5_romance',
                effects: {
                    trust: 10,
                    flag: 'said_yes_official'
                }
            },
            {
                id: 'official_platonic',
                text: 'I love what we have SO much... can we stay legendary best friends who yap about anime instead of dating? I don\'t want distance to break us. 🤝✨',
                nextScene: 'scene5_platonic',
                condition: (s) => (s.platonicPathScore || 0) >= 2,
                effects: {
                    platonicBesties: true,
                    friendship: 15
                }
            }
        ]
    }
};

// Ending definitions
const Endings = {
    ignore: {
        id: 'ignore',
        title: 'Missed Connection',
        message: 'Some connections are missed chances. 🌙 Would you like to try a different path?',
        image: 'ending-ignore'
    },
    drift: {
        id: 'drift',
        title: 'The Slow Fade',
        message: 'Some friendships need someone to break the silence. Neither of you did. 🌙 Try again?',
        image: 'ending-drift'
    },
    fear: {
        id: 'fear',
        title: 'Fear Wins',
        message: 'Some fears protect us. Some fears keep us from the best things. 🌙 Try again?',
        image: 'ending-fear'
    },
    secret: {
        id: 'secret',
        title: 'Anime Soulmates',
        message: 'Not every journey is romantic. Some are just... legendary friendships. ✨ Try the romance path next time!',
        image: 'ending-secret'
    },
    true: {
        id: 'true',
        title: 'Brick by Brick',
        message: 'I love you Danh and hope as our story grows i can extend this game to be longer and have our real pictures in oneday.',
        image: 'ending-true'
    }
};