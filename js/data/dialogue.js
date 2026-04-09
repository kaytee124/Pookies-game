/**
 * Dialogue Database
 * Contains all game dialogue organized by scene
 */

const DialogueDB = {
    // Scene 1: Introduction
    scene1: {
        narration1: "*You've just posted your intro in the server! You mentioned you love yapping, food adventures, Genshin Impact, and osu! A few people wave hello... but then a new DM notification pops up.*",
        
        guyIntro: "hey! saw your intro and you seem really cool :D i'd love to get to know you and be friends if you're open to it!",
        
        // Branch A: Enthusiastic reply
        branchA_girlReply: "hiiii!! omg yes let's be friends!! you seem cool too hehe~ what games do you play? 🎮✨",
        branchA_guyBurst: "WAIT REALLY?? okay okay i'm doing a little victory dance in my chair you can't see it but it's happening!! you just made my whole week actually!!",
        branchA_guyResponse: "OH YAY okay awesome!! hmm i play lots of stuff! mostly osu when my fingers cooperate, some genshin (AR 32 even though i have been playing for years lol), and i'm a sucker for any good RPG! wbu??",
        branchA_narration: "*And just like that, the conversation flows. You learn he's a bit older, a total nerd for science stuff and superheroes. He learns you're from Vietnam, studying, and absolutely adorable when you get excited about food.*",
        
        // Branch B: Hesitant reply
        branchB_girlReply: "uhm... hi? i guess we can talk a bit. what made you message me? 🤔",
        branchB_guyResponse: "honestly? your intro made me smile. you seem like someone who brings good energy, and you mentioned yapping which is basically my secret talent too 😭 plus food and genshin?? that's like the holy trinity of conversation topics! no pressure though! if you're not feeling it, that's totally okay too!",
        branchB_girlFollowup: "...okay that was actually a really sweet answer. fineee you pass the vibe check! so... what's your favorite genshin character? this determines if we can be friends or not 👀",
        branchB_guyGenshin: "OH NO THE PRESSURE. okay okay... i gotta be honest... Kazuha. poetic sad boy with autumn leaves?? i'm weak. BUT ALSO i have a soft spot for Itto because he's just... a big dumb oni with a heart of gold and i respect that energy.",
        branchB_narration: "*He passed the test. Barely. The conversation continues into the night...*",
        
        passage_guyFood: "okay but you HAVE to try this ramen place i found. i will literally write you a powerpoint on why their broth is life-changing.",
        passage_girlFood: "you're going to make me book a flight with food pics alone 😭 also YES send the powerpoint. i live for this.",
        passage_guyScience: "also random but did you know your brain can process images in like 13 milliseconds?? which means you technically saw my dumb meme before you consciously decided to judge me for it.",
        passage_narration: "*The DMs stack up: memes at 2am, voice notes laughing too loud, screenshots of games you both swear you'll finish someday. The timezone difference stops mattering.*",
        
        passageB_girlGenshin: "if you ever visit i'm dragging you to every genshin collab cafe. non-negotiable. cosplay optional but encouraged.",
        passageB_guyLore: "deal. i'll bring my terrible takes on fontaine politics and you can veto them in real time.",
        passageB_narration: "*Some nights you talk until the birds are loud outside. Some nights it's just 'you good?' and a heart react. Either way, the thread never really ends—only pauses.*",
        
        monthLaterCard: "📅 *One month later...*",
        
        montage_dm1: "💬 *Guy — 9:12am* \"good morning!! did you eat something real or are we doing chaos cereal again\"",
        montage_dm2: "💬 *You — 9:14am* \"cereal IS real. it has a bowl. it has milk. that's structure.\"",
        montage_dm3: "💬 *Guy — 11:03pm* \"okay hear me out—what if we watched ONE episode and then definitely sleep\"",
        montage_dm4: "💬 *You — 2:47am* \"we said that 4 episodes ago 👀\"",
        montage_dm5: "💬 *Guy — 3:01am* \"...worth it. also you're gonna hate how right i am about this plot twist\"",
        montage_dm6: "💬 *You — 8:30am* \"i stayed up for YOU and your anime crimes. now pay your tax: good morning yap.\"",
        montage_dm7: "💬 *Guy — 4:18pm* \"emergency. i need you to settle this: is a hot dog a sandwich. my coworker is wrong and i need a witness.\"",
        montage_dm8: "💬 *You — 4:21pm* \"this is the dumbest court case and i'm honored to be your lawyer. verdict: yes with terms and conditions.\"",
        montage_beforeScene2: "*More weeks of this. The chat log gets longer. His walls of text about cartoons and science facts start to feel like part of the weather—predictable, ridiculous, and weirdly comforting.*",

        montageB_dm1: "💬 *You — 6:02pm* \"sent u food. eat before you hyperfixate on work again\"",
        montageB_dm2: "💬 *Guy — 6:09pm* \"you're literally saving my life. also this looks illegal levels of good\"",
        montageB_dm3: "💬 *Guy — 1:22am* \"can't sleep. sent you a voice note that's 90% laugh 10% actual words\"",
        montageB_dm4: "💬 *You — 1:25am* \"your laugh fixed my whole week actually\"",
        montageB_dm5: "💬 *Narration* *Somewhere between day-shift check-ins and 3am tangents, the chat log becomes its own little world—yours.*",
        montageB_dm6: "💬 *Guy — 10:41pm* \"okay i know i said i'd sleep but—ONE ben 10 thought and then i'll go. promise.\"",
        montageB_dm7: "💬 *You — 10:43pm* \"you say that every night and every night it's a whole essay. i'd be mad if i wasn't smiling.\"",
        montageB_beforeScene2: "*The slow-burn friendship turns into something louder: memes at lunch, voice notes between classes, and him treating every tangent like it matters—because to both of you, it does.*"
    },
    
    // Scene 2: Daily Chaos (1-2 months in)
    scene2: {
        narration1: "*Weeks blur into a comfortable rhythm. Morning texts. Random voice calls while gaming. Screenshot sharing. He yaps about the most random things—and somehow makes all of it interesting.*",
        
        guyYap1: "okay but hear me out—Ben 10 is literally a masterclass in power scaling done right. like, the omnitrix isn't just 'strong alien go brrr' it's about adaptation and problem solving! and don't get me STARTED on the worldbuilding in MHA. quirk society has SO many implications like—what if someone's quirk is just 'makes really good toast'? where do they fit in hero society??",
        
        girlResponse1: "you're literally the biggest nerd i've ever met and it's SO funny how your brain just DOES THIS. but also... what if the toast quirk person could make toast so good it heals people?? then they'd be a support hero!! see i'm learning from your yapping!! 🍞✨",
        
        guyResponse1: "YOU'RE A GENIUS. see this is why we're friends. your brain is AMAZING. you took my chaos and made it MAKE SENSE.",
        
        girlPrincess: "hehe~ i know i'm amazing~ but also tell me more about the quirk society thing! what about people with villainous quirks? do they get a choice??",
        
        narration2: "*The days become measured in 'have you eaten yet?' texts and 'watch this clip!!' spam. He learns your class schedule. You learn his coffee addiction. Somewhere between the yapping sessions and the 3am conversations, a foundation builds—brick by invisible brick.*",
        
        narration_lull: "*You notice it one Tuesday. He hasn't sent a random science fact in three days. No sudden 'WAIT THINK ABOUT THIS' messages. He's still there—quick to reply, warm as always—but the unprompted chaos has quieted. Something feels... different.*",
        
        guyInternalMonologue: "am i talking too much? she has school and a life... i don't want to overwhelm her. but i miss telling her stuff. maybe i should just... wait for her to start conversations. give her space. that's the mature thing right? ...right?"
    },
    
    // Branch A responses
    scene2_branchA: {
        girlConfront: "heyyy... you've been kinda quiet lately. is everything okay? i miss your random yapping you know 🥺 like who's gonna tell me about why sodium explodes in water or whatever was living in your brain rent free??",
        guyResponse: "...you noticed? ah geez. okay honestly? i was worried i was being Too Much™. like, i know i talk a LOT and my brain just throws random stuff at you all day and i thought maybe... you'd want some quiet? that i was overwhelming you? i didn't want to be annoying.",
        girlDefense: "LISTEN HERE YOU SILLY GOOSE. you are NEVER too much!! i literally posted 'i like yapping' in my intro?? that was an INVITATION. your random chaos is my favorite part of the day!! i get sad when i don't get my daily 'hey so i was thinking about black holes' text!! 😤",
        guyTouched: "oh... oh i'm gonna cry in this discord chat. okay. OKAY. noted. i will resume yapping operations immediately. i'm so sorry i got in my own head about this. i just... care a lot. about not messing this up. you're really important to me.",
        girlCommand: "you CAN'T mess this up by being yourself you dummy!! that's literally why we're friends!! now tell me something weird you learned today. STAT. 🎤",
        guyYapReturns: "OKAY SO. did you know that octopuses have THREE hearts?? AND two of them stop beating when they swim?? nature is WILD. also i was thinking about how in Black Clover, Asta's whole thing is literally 'i have no magic in a magic world' and he just SAID 'bet' and got SWOLE. that's the energy we need in 2024.",
        narration: "*And just like that, the yapping returns. But something shifted—a new understanding. He promises himself to never dim his light again, not when it makes her this happy. And she realizes... his chaos had become her comfort.*"
    },

    scene2_branchB: {
        girlYap: "OKAY SO TODAY IN CLASS. my professor literally said 'the mitochondria is the powerhouse of the cell' like it was a PROFOUND REVELATION and i had to stop myself from laughing because all i could think was you'd give a TED talk on why that's oversimplified?? and my rice was dry which is a CRIME and i thought 'he would understand my pain' and also—",
        guyInterrupt: "WAIT WAIT WAIT. you're yapping!!! YOU'RE YAPPING TO ME!!! THIS IS THE BEST DAY EVER ACTUALLY???",
        girlSurprise: "—wait did you just get excited about me yapping?? 😳",
        guyApology: "I LITERALLY COULD CRY. i've been quiet because i was scared of overwhelming you and here you are filling the silence yourself. i'm sorry. please continue about the dry rice. i need EVERYTHING.",
        girlSoup: "hehe~ noted. okay the rice was dry BUT the soup was good and it reminded me of when you argued soup is technically a beverage AND a food for an hour—",
        narration: "*Comfortable chaos creeps back in—messy, loud, and theirs.*"
    },

    scene2_branchD: {
        girlAnxious: "did i do something wrong? you're not talking as much... if i messed up please tell me 🥺",
        guyPanic: "NO NO NO oh my god no. you didn't do ANYTHING wrong. i'm sorry i made you feel that way. i was scared *I* was doing too much. you're perfect. i was trying to give you space and instead i made you anxious.",
        girlRelief: "oh you big dummy. you're not overwhelming!! i like when you talk a lot!! i thought maybe you were bored of me...",
        guyPromise: "BORED?? of YOU?? impossible. i could listen to you talk about paint drying. i'll yap more. i promise. it's never you.",
        narration: "*The yapping returns—and so does a quiet understanding: they both need reassurance sometimes.*"
    },
    
    // Scene 3: Three Months - Feelings
    scene3: {
        narration1: "*Three months. It hits you on a random Thursday. He sends a voice message laughing about something stupid that happened at work, and your heart does this weird flutter thing. Oh no. Oh NO. You like him. Like... LIKE like him.*",
        
        girlInternal: "wait. WAIT. since WHEN?? why is my face hot?? it's just his dumb laugh!! ...the dumb laugh i look forward to every day. the dumb laugh that makes ME laugh. the dumb laugh that i've memorized. ...oh i'm in TROUBLE trouble.",
        
        guyInternal: "i am so unbelievably doomed. i think about her constantly. her laugh. the way she says 'hewwwwo' instead of hello. how she gets excited about food like it's a spiritual experience. i want to protect her from every bad day. i want to make her smile forever. ...this is more than friendship isn't it.",
        
        narration2: "*The tension builds over weeks. The 'good morning' texts feel heavier. The 'good night' texts linger. Every call ends with neither wanting to hang up first. Something has to give.*",
        
        guyConfessionLead: "hey... can i tell you something? it's kind of important and i'm really nervous but i can't keep it in anymore",
        narrationMeanwhile: "*Meanwhile, on his end...*"
    },

    scene3_branchA: {
        girlNervousYes: "yes... what is it? 🥺",
        guyConfession: "okay. okay here goes. over the past three months... you've become my favorite person. i wake up excited to talk to you. i go to sleep smiling because of something you said. your laugh is my favorite sound. your chaos makes my chaos make sense. and i know we're online and there's distance and this is scary to say but... i've developed feelings for you. real ones. the kind that make me want to protect you from bad days and bring you soup when you're sick and listen to you yap about your hyperfixations forever. i like you. a lot. more than a lot. and i understand if you don't feel the same—",
        girlRelief: "STOP. stop right there. you absolute DORK. i've been waiting WEEKS for you to say something!! i like you too!! i like you SO much!! i was starting to think i was crazy and reading into everything!! 😭💕",
        guyShock: "WAIT REALLY?? ACTUALLY?? THIS ISN'T A DREAM?? SOMEONE PINCH ME??",
        girlConfirm: "YES REALLY YOU SILLY GOOSE. who else would let you yap about ben 10 lore at 2am?? who else sends you pictures of their food before eating?? who else gets excited when your name pops up on their phone?? IT'S ME. I LIKE YOU. I LIKE YOU A LOT. 😤💖",
        narrationCelebrate: "*Both of you are crying happy tears in your separate rooms, hearts exploding in emoji form. Nothing else matters right now—only that you said it, and they said it back.*"
    },

    scene3_branchB: {
        girlPlayful: "uh oh should i be scared?? 👀",
        guyTease: "maybe?? depends on how you feel about someone catching major feelings for you over the course of three months of chaotic yapping sessions and 3am calls 🙈",
        girlWorried: "...wait. are you saying what i think you're saying?? because if you're joking i will CRY.",
        guySerious: "i'm not joking. i've never been more serious about anything. i like you. i really really like you. you make my boring life feel like an adventure. you make me want to be better. you make me want to protect you from everything bad in the world. and also feed you good food. lots of good food.",
        girlConfess: "YOU IDIOT I LIKE YOU TOO. i was so scared to say anything!! you're older and cool and smart and i thought there's no way you'd like someone like me who just yaps about food and genshin and—",
        guyInterrupt: "STOP. 'someone like you'?? you mean someone who makes every day brighter? someone who gets adorably excited about pixels on a screen? someone whose laugh cures my depression?? THAT SOMEONE?? because yeah. i like THAT someone. a lot.",
        narrationCelebrate: "*The confession celebration scene—messy, loud, and completely yours—spills across the screen before the world can catch up.*"
    },

    scene3_branchC: {
        girlMutual: "wait... before you say anything... i think i know what it is. and i feel the same way.",
        guyStunned: "...huh?",
        guyDoubleCheck: "...you... you do?? you feel... the same??",
        girlSpeech: "i like you. i've liked you for weeks. i was too scared to say anything because what if you didn't feel the same?? what if i ruined our friendship?? but the way you look out for me, the way you remember little things i say, the way you make me laugh when i'm sad... i couldn't NOT fall for you. you're literally the best person i've ever met. 🥺💕",
        guyEmotional: "i'm literally crying in my room right now. you have no idea how scared i was to tell you. i had a whole speech prepared and everything. you just... you make everything better. you make ME better. i want to be the person who makes you smile every single day. i want to protect you from bad dreams and bad days and bad people. i want to take you to every good food spot i know. i want to be YOURS.",
        girlSoft: "then be mine, dummy. 💖",
        narrationCelebrate: "*No speeches needed after that—only the quiet certainty that you both chose each other.*"
    },

    scene3_fear: {
        girlPull: "actually... i don't know if i can do this. the distance. the uncertainty. what if it doesn't work? what if i get hurt? 😔",
        guyUnderstand: "...i understand. i really do. it's scary. i'm scared too. but i'd rather be scared WITH you than safe without you. but... i won't push. if you need time, take it. if you need space, have it. i'll be here. waiting. hoping. but no pressure. never pressure.",
        narrationFade: "*She pulls back. The calls become less frequent. The texts grow short. He waits, but eventually... the connection fades. Not with anger. Just with the quiet sadness of \"what could have been.\"*"
    },

    scene5_platonic: {
        narration: "*Instead of labels and long-distance pressure, you choose something just as rare: the kind of friendship that never runs out of things to yap about. Anime posters and snack crumbs optional but implied.*",
        guyMHA: "okay but MHA season 6?? the animation?? the EMOTIONS??",
        girlClover: "WE'RE NOT DONE WITH BLACK CLOVER YET. asta's determination?? the way he never gives up?? that's US energy.",
        narrationEnd: "*Platonic soulmates. The yapping never stopped. The friendship became legendary.*"
    },
    
    // Scene 4: The Picture and Call
    scene4: {
        narration_buildup: "*In the days following the confession, the energy is electric. Flirty texts. Soft good nights. Building up to voice calls that last until sunrise. Then one night, without prompting...*",
        girlSendsPic: "this is me btw... i realized i never actually showed you what i look like properly and you've been so patient and sweet and i wanted you to know who you're talking to 🥺",
        guySuspicious: "...you're beautiful. like... really beautiful. like... model beautiful. ...this is where you tell me it's not really you, right?",
        girlConfused: "...what? what do you mean?? of course it's me?? why would you think it's not??",
        guyHurt: "because... because look at you. and look at me. people who look like you don't... they don't talk to people like me for three months. they don't develop feelings. they don't stay on discord. i've seen this before. i've BEEN this before. i really thought... i really thought this time was different.",
        narration_incoming: "*Incoming Call...*",
        girlVoice: "hi. it's me. SEE? IT'S ME. i'm real. i'm not a catfish. i'm just... me. and i'm so sorry people made you feel like you couldn't trust this. like you couldn't trust ME. but i'm here. i'm real. and i really, REALLY like you. okay?",
        guyVoiceRelieved: "...your voice. i know your voice. it's really you. oh my god it's really you. i'm so sorry. i'm so so sorry i doubted you. i just... i've been hurt before. people have pretended before. and you're so beautiful i couldn't believe... i couldn't believe someone like you would want someone like me.",
        girlVoiceReassure: "well BELIEVE IT dummy. because i do. i want you. not some fake version, not some ideal—YOU. the guy who yaps about ben 10 and chemistry. the guy who asks if i've eaten. the guy who stays up late just to say goodnight. THAT guy. he's the one i like. okay?",
        guyVoicePromise: "okay. okay. i believe you. i'm sorry again. i promise i'll make it up to you. i'll never doubt you again.",
        girlVoicePlayful: "you better not. now... can we go back to being disgustingly cute?? because i was enjoying that era. 💅✨",
        narration_end: "*They talk until the sun comes up. Not about anything important—just everything. And somewhere in that call, the last walls come down.*"
    },
    
    // Scene 5: Girl Asks - Unconventional Confession
    scene5: {
        narration: "*Things are different now. Lighter. Realer. The pictures and calls flow freely. There's no more doubt—only this growing certainty that whatever this is, it's special.*",
        girlNervous: "hey. i have a question. and it's kind of a big one. and you can say no if you want!! no pressure!! but i've been thinking and i can't stop thinking and—",
        guyEncouraging: "hey hey. breathe. whatever it is, you can ask me. i'm here. 🫂",
        girlConfession: "okay. OKAY. here goes. so we've been talking for months. and we like each other. and we've confessed. and we call every day. and you make me really happy. like... REALLY happy. like 'smiling at my phone like an idiot' happy. and i know we're online and there's distance but... i don't care about any of that. i just care about YOU.",
        girlAsks: "so... will you be my boyfriend? 🥺👉👈",
        guyShock: "...you... you're asking ME?? wait. WAIT. you want ME to be YOUR boyfriend???",
        girlConfirm: "yes?? obviously?? who else would i be asking?? you're the one i like you silly goose!! so... is that a yes?? or do i need to bribe you with food pics??",
        guyYes: "YES. YES. A THOUSAND TIMES YES. i would be HONORED to be your boyfriend. i was going to ask YOU but you beat me to it and honestly?? that's so on brand for you and i LOVE it. i love YOU. yes. i'm yours. 🥹💖",
        girlCelebrate: "YAYYYYYY!!! i have a boyfriend now!! everyone say hello to my boyfriend!! he's the best and he's MINE!! 💕👑",
        guyHappy: "and i have the most amazing girlfriend who asked ME out because she's brave and wonderful and i'm never going to stop talking about this. ever. you made my whole life.",
        narration_end: "*And just like that—unconventionally, perfectly, THEM—they became official. No games. No waiting. Just two people who found each other in a discord server and decided to hold on.*",
        afterOfficial_guy: "i'm gonna say good morning with way too many emojis every day and you're gonna have to deal with it. that's the law now.",
        afterOfficial_girl: "good. make it obnoxious. i dare you. 💕",
        montageOfficial1: "💬 *Day 3* — Good morning voice note: 4 minutes of him hyping up your coffee.",
        montageOfficial2: "💬 *Night* — \"send me a pic of the sky there. i wanna see what your stars look like.\"",
        montageOfficial3: "💬 *Weekend* — Half a conversation is just memes. The other half is \"did you eat.\" \"did YOU eat.\"",
        montageOfficial4: "💬 *Narration* *The chat log gets softer and louder by turns—official, ridiculous, and completely them—before the next era even starts.*"
    },
    
    // Scene 6: Genshin Era
    scene6: {
        narration: "*A few days into dating, the topic shifts to Genshin Impact. Turns out, she's been holding back her true power level...*",
        girlUnleash: "okay so since you're my boyfriend now i can FINALLY unleash my full genshin brainrot on you. you've been warned. there's no escape now. 💅",
        guyReady: "oh no... OH NO... what have i signed up for?? (i'm kidding please unleash it i want to know everything you love)",
        girlWanderer: "OKAY SO. wanderer. SCARAMOUCHE. my BABY. my SON. my everything. do you know his lore?? do you KNOW what he's been through?? the BETRAYALS?? the CHARACTER DEVELOPMENT?? and his relationship with nahida?? found family TROPE done RIGHT. i could write ESSAYS.",
        guyInterested: "tell me everything. i want to understand why you love him so much. i want to see him through your eyes.",
        girlTouched: "...you really mean that?? you actually want to hear my genshin rants??",
        guySincere: "of course i do. it's something you love. that automatically makes it important to me. plus... i may have looked up wanderer lore after you mentioned him once... 👀",
        girlShock: "YOU DID???",
        guyResearched: "I WANTED TO UNDERSTAND YOUR REFERENCES OKAY. also his design is actually really cool and his story is TRAGIC and i get why you love him. he's like... the ultimate 'i was made to be a weapon but chose to be human' story. and his dynamic with the traveler? 'you're planning to use me?' 'oh no, i'm asking for help' THAT SCENE??",
        girlExcited: "OH MY GOD YOU ACTUALLY WATCHED HIS SCENES?? MARRY ME?? wait we just started dating. okay. BUT CONSIDER: OTP. SCARAMONA. the enemies to lovers pipeline?? when she was the ONLY ONE who didn't abandon him?? i'm UNWELL.",
        narrationEra: "*And thus began the Genshin era. Screenshots shared. Team comps discussed. \"Look at this wanderer fanart\" at 2am. He doesn't just tolerate her interests—he dives into them. Because her happiness is his happiness.*"
    },

    scene6_branchA: {
        girlShip: "SCARAMONA. scaramona forever. mona was the ONLY one who saw through his lies in that event?? she was the only one who didn't just blindly follow him?? the BANTER. the 'i see right through you' energy. i'm FERAL about them.",
        guyShip: "okay okay i see the vision. the astrologer who sees fate and the puppet who defied his?? thematically THAT HITS. also they're both kind of dramatic and would absolutely bicker like an old married couple.",
        girlHappy: "YOU GET IT. YOU ACTUALLY GET IT. i love having a boyfriend who understands my ships. 😭💕"
    },

    scene6_branchB: {
        girlChars: "OKAY SO. besides wanderer. i also love furina!! the DRAMA. the PERFORMANCE. the 'girlfailure who's actually trying her best' energy. she's so annoying in the best way and i adore her. and navia?? GEO GIRLBOSS with a heart of gold?? and her tragic backstory?? i cry every time.",
        guyNotes: "i'm learning so much. please continue. i'm taking notes for future reference. also furina's hat is iconic and i respect it."
    },

    scene6_branchC: {
        girlDad: "WAIT. DOES THAT MAKE YOU HIS DAD?? oh my god. oh my GOD. you're wanderer's step-dad now. congratulations. you have a traumatized puppet son.",
        guyDad: "i accept this responsibility. i will protect our son. i will make sure he drinks water and processes his emotions in healthy ways. we're co-parenting now. this is our life.",
        girlLove: "this is the most unhinged relationship i've ever been in and i LOVE it here. 😭💖"
    },
    
    // Scene 7: Promise to Do Better
    scene7: {
        narration: "*Even in the happiness of new love, old habits linger. The yapping has returned, but sometimes... he still hesitates. Still worries about being too much. She notices the pauses. The self-editing.*",
        girlNotice: "hey. you're doing it again.",
        guyDeflect: "doing what? 😅",
        girlPush: "that thing where you type something and delete it because you think it's 'too much.' i SEE you. talk to me. what were you gonna say?",
        guyVulnerable: "...i was gonna tell you about this really boring thing that happened at work. and then i realized it was boring and you have actual interesting things going on in your life and i didn't want to waste your time with my nothing stories.",
        girlReassure: "okay. listen to me. really LISTEN. nothing you say is a waste of my time. NOTHING. i don't care if it's 'boring.' i care about YOU. your day. your thoughts. your little moments. they matter to me because YOU matter to me. you're not 'too much.' you never were. and the fact that you still think that makes me so sad because you deserve to take up space.",
        guyApologize: "...i'm sorry. i'm trying. old habits are hard to break. i spent so long making myself smaller so i wouldn't annoy people and now with you i want to be BIG and LOUD and MYSELF but sometimes the fear creeps back.",
        girlSupport: "then let me help you fight it. every time you hesitate, i'll remind you. you are WANTED here. your chaos is WELCOME. your boring stories are MY boring stories now. we're a team. okay?",
        guyPromise: "okay. okay. i promise to do better. to let myself be fully ME with you. no more editing. no more shrinking. you deserve all of me, not just the 'safe' parts.",
        girlAffirm: "that's all i've ever wanted. 🥺💕 now TELL ME ABOUT THE BORING WORK THING. i'm invested now.",
        narration_printer: "*He launches into a story about a printer jam that somehow becomes the funniest thing you've heard all week. You're laughing—really laughing—and he's glowing because he made you happy.*",
        narration_end: "*And that becomes their thing. When he hesitates, she notices. When she notices, she pulls him back. Brick by brick, they build a space where neither of them has to be small.*"
    },
    
    // Scene 8: Assurances - Never Too Much
    scene8: {
        narration: "*Some nights, the conversations go deeper. Past the surface. Into the insecurities they both carry.*",
        girlVulnerable: "can i be honest about something? something i worry about sometimes?",
        guyOpen: "always. i'm here. what's on your mind? 🫂",
        girlInsecure: "sometimes i worry i'm too much. like... i yap so much. and i get excited about dumb things. and i can be childish. and bratty. and i judge people's genshin teams even though i shouldn't. and sometimes i feel like i'm just... a lot to handle. and one day you'll get tired of it.",
        guyIntense: "can i tell you something? and i need you to really hear it?",
        girlOkay: "...okay 🥺",
        guyAssurance: "your yapping is my favorite podcast. your excitement about 'dumb things' is the purest joy i've ever witnessed. your childish side? the one that gets bouncy about food and makes cute noises and acts like a princess? i ADORE it. your bratty moments? they make me laugh. your genshin judgments? VALID. i've seen some questionable team comps and they deserved it.",
        guyContinue: "you are not 'a lot to handle.' you are exactly the right amount for ME. you're not too much. you're everything i didn't know i needed. all those things you think are flaws? they're features. they're YOU. and i fell for YOU. all of you. the yapping, judging, childish, bratty, princess-energy, usagi-from-chiikawa-core YOU.",
        girlUsagi: "you think i'm like usagi from chiikawa?? 😭",
        guyUsagi: "the CUTEST usagi. the one who tries her best and gets excited about little things and deserves all the good food in the world. YES. that's you. my little usagi. 🐰💕",
        girlLove: "i love you. i love you so much. thank you for seeing all of me and staying.",
        guyStay: "i'm not going anywhere. ever. we're building something here. trust. safety. a space where you can always talk to me about ANYTHING. no judgment. just us. i want to be your safe place. your home base. the person you come to with everything—the good, the messy, the 'this is so dumb but.' ALL of it. okay?",
        girlSafe: "okay. 🥺💖 and same for you. you can tell me anything too. i want to be YOUR safe place too.",
        narration_end: "*That night, something solidifies. Not just love—but trust. The foundation of something that could actually last.*"
    },
    
    // Scene 9: My Little Pony References
    scene9: {
        guyNotice: "hey. you seem down today. want to talk about it? or want distraction? i can do either. or both. 🫂",
        girlSad: "...both maybe? 🥺 just having a rough brain day. everything feels heavy.",
        guyIdea: "okay. i'm going to do something. and you can't judge me.",
        girlCurious: "...what are you doing?? 👀",
        guyPony: "so when i was younger and felt sad, i watched my little pony. specifically the episodes where pinkie pie tries to make everyone smile. and i know it's 'for kids' but something about the sincerity of it... it helped. so i'm going to tell you about why twilight sparkle is actually a really good allegory for anxiety and perfectionism and learning that friendship isn't about being 'useful'—it's about being YOU.",
        girlSurprise: "you... you watch my little pony??",
        guyLayers: "I HAVE LAYERS OKAY. also fluttershy is my spirit animal. 'yay' but whispered? that's me. that's my energy. and rainbow dash is cool but we all know applejack is the REAL backbone of the group. i will die on this hill.",
        girlBrony: "oh my god. OH MY GOD. you're a secret brony?? this is the best thing i've ever learned about you. tell me MORE. who's best pony?? this is a test.",
        guyPinkie: "objectively? pinkie pie. because she chooses joy. actively CHOOSES it. even when it's hard. even when she's sad herself. she makes others smile because she knows how much a smile can save someone. that's who i want to be. for you especially.",
        girlCry: "you already ARE that for me. you make me smile every single day. even on heavy brain days. ESPECIALLY on heavy brain days. i love you.",
        guyWatch: "i love you too. now... want to watch some mlp together? i'll screen share. we can make fun of the animation but also secretly enjoy it.",
        girlYes: "YES. absolutely yes. 🥺💖"
    },
    
    // Scene 10: The Protector - Slaying Monsters
    scene10: {
        narration: "*One night, she has a nightmare. She texts him at 3am, shaky. He's awake immediately.*",
        girlNightmare: "sorry for waking you... just had a really bad dream and couldn't go back to sleep...",
        guyAwake: "don't apologize. ever. i'm here. want to talk about it? or want me to just... be here? voice call?",
        girlCall: "voice call please 🥺",
        guyVoice: "i'm here. i've got you. whatever was in that dream can't get you. you know why?",
        girlWhy: "...why? 🥺",
        guyProtect: "because i won't let it. nightmares? i'll fight them. monsters under the bed? i'll slay them. clowns? GONE. i'll get a tiny pixel sword and just—",
        narration_fight: "[Hero mode activates - fighting sequence]",
        guyAfter: "see? all defeated. you're safe. and even when i can't physically be there yet, i'm ALWAYS in your corner. always fighting for your smile. always protecting your peace. that's my job now. and i take it very seriously.",
        girlSafe: "...you're ridiculous. and wonderful. and i love you. thank you for slaying my brain monsters. 🥺💖",
        guyYap: "anytime. EVERY time. now... want me to yap about something boring until you fall asleep? i have a whole mental list of 'weird science facts that make no sense.'",
        girlYap: "yes please. tell me about... why is water wet? or whatever science thing you have.",
        guyScience: "OKAY SO. water isn't actually wet. wetness is a sensation we perceive when water adheres to our skin. water itself is just... water. it MAKES things wet but isn't wet itself. WILD right??",
        guyWhisper: "goodnight my little usagi. i'll keep watch. always. 🐰💕"
    },
    
    // Scene 11: Future Plans - Foodie Dreams
    scene11: {
        narration: "*As weeks pass, the conversations turn to the future. To 'when' not 'if.'*",
        guyPlan: "okay so i've been thinking. when we finally meet up—and we WILL—i have a whole plan. a FOOD plan. because we're both foodies and i want to take you EVERYWHERE.",
        girlHungry: "TELL ME EVERYTHING. i'm already hungry thinking about it. 🍜✨",
        guyPho: "OKAY SO. day one: breakfast at that vietnamese place you told me about. the one with the pho that 'tastes like home.' i want to see your face when you eat food that makes you happy. then lunch? KBBQ. unlimited meat. we'll be in a food coma but it'll be WORTH IT.",
        girlRemember: "YOU REMEMBERED THE PHO PLACE?? i mentioned that ONCE months ago!! 😭",
        guyMemory: "i remember EVERYTHING you say. every little thing. it's all filed away in the 'important: girlfriend lore' section of my brain.",
        girlMore: "you're actually insane and i love you. okay keep going. what's after KBBQ??",
        guyKaraoke: "KARAOKE. private room. we sing our hearts out. anime openings. disney songs. that one weird song you showed me that got stuck in my head for a WEEK. no judgment zone. just chaos. and maybe i'll serenade you. badly. but sincerely.",
        girlSerenade: "you?? serenading ME?? i need to see this. what song??",
        guySecret: "i'm not telling. it's a surprise. but it's cheesy and you'll probably cry and i'll probably cry and it'll be a MESS. a beautiful mess.",
        girlArcade: "what else?? there's more right??",
        guyArcade: "GAME STATIONS. arcade date. i will win you the UGLIEST stuffed animal from the claw machine. it will be our son. we will name it something ridiculous. and then we'll get boba after and argue about which flavor is superior.",
        girlTaro: "taro. the answer is taro. but i'll let you think you have a choice.",
        guyPrincess: "see. THIS is why i love you. the princess energy. you KNOW what you want and you're not afraid to claim it. that's my girl. 👑",
        girlHis: "your girl. i like being your girl. 🥺💕",
        guyFuture: "and i like being YOURS. so much. and all these plans? they're just the START. i want to do EVERYTHING with you. try every food. visit every place. build a lifetime of memories. i know it's online right now but... it won't always be. i'm saving up. i'm planning. i'm serious about this. about US.",
        girlTogether: "me too. i'm serious too. let's make it happen. together. 🐰💖"
    },
    
    // Scene 12: The Vision - Brick by Brick
    scene12: {
        narration: "*On a quiet evening, they're both just... existing together. In call. Not saying much. Just being. And in that stillness, he speaks from his heart.*",
        guyVision: "hey. can i tell you something? something i've been thinking about?",
        girlListen: "always. what's on your mind? 🥺",
        guyReal: "i know we started in a discord server. just two strangers who liked yapping and food and games. and i know some people might not understand—might say online relationships aren't 'real.' but what we have... it's the realest thing i've ever felt.",
        guyBuild: "every conversation was a brick. every late night call was a layer. every time you made me laugh, every time i made you smile, every time we chose each other even when it was scary—we were BUILDING something. brick by brick. layer by layer. and now... i look at what we have and i see something solid. something REAL. a foundation that can hold whatever comes next.",
        girlCry: "...you're gonna make me cry again. 😭💕",
        guyGoodTears: "good tears i hope??",
        girlBest: "the BEST tears. keep going. i want to hear all of it.",
        guyContinue: "i want to keep building with you. i want to add more bricks. more layers. i want to see what we can become. i want to have the kind of relationship neither of us had before—the kind where we actually TALK about things, where we're SAFE with each other, where we grow TOGETHER instead of apart.",
        guyMarry: "and i know it's early to say this but... i don't just want to date you. i want this to lead somewhere. i want to meet you. i want to marry you someday. i want to build a LIFE with you. a happy one. a chaotic one. full of food adventures and karaoke nights and genshin discussions and you being a bratty princess and me yapping about science until you fall asleep. i want ALL of it. i want YOU. forever.",
        girlMarry: "you... you want to MARRY me someday?? 🥺😭💖",
        guyYesMarry: "i do. i really do. when we're ready. when the time is right. i want to stand in front of you—REALLY in front of you—and promise to protect you forever. to make you smile every day. to slay your monsters and feed you good food and listen to your yapping for the rest of our lives. that's my dream. YOU are my dream.",
        girlDream: "i want that too. i want ALL of that. with YOU. only you. you're my favorite person. my safe place. my home. 🐰💕"
    },
    
    // Scene 13: Ending - Looking to the Distance
    scene13: {
        narration: "*They stand together—pixelated, digital, separated by screens for now. But looking at the same horizon. Dreaming the same dream.*",
        guyPromise: "i promise you. right here, right now. i will always stay by your side. i will always protect you—from bad days, from mean people, from your own doubts. i will always make you smile, no matter what i have to do. i will yap about nonsense to make you laugh. i will learn every genshin character's lore so i can understand your excitement. i will be your pinkie pie—choosing joy, choosing YOU, every single day.",
        girlPromise: "and i promise... i'll always be your usagi. your princess. your chaos. i'll yap about my hyperfixations and judge people's team comps and be bratty sometimes but i'll also be SOFT for you. only for you. i'll be your safe place too. your home. always. 🐰💕👑",
        guyBrick: "brick by brick, right?",
        girlLayer: "layer by layer. 🧱✨",
        guyFinal: "here's to our journey. past, present, and all the chapters we haven't written yet. i love you. more than science can explain. more than words can hold. i love you. 🐰💖🗡️",
        girlFinal: "i love you too, my protector, my nerd, my home. now let's go eat something delicious and argue about genshin ships. forever starts now. 👑✨"
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DialogueDB;
}