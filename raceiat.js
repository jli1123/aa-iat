

define(['pipAPI','./iat10lib.js'], function(APIConstructor, iatExtension){
    
    let API = new APIConstructor();
    let global = API.getGlobal();

    function getResponsiveCanvas(){
        var viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        var viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        var isLandscape = viewportWidth > viewportHeight;
        var useCompactLandscape = isLandscape && (global.$isTouch || viewportWidth <= 1024);

        if (!useCompactLandscape){
            return {
                maxWidth: 725,
                proportions: 0.7,
                background: '#ffffff',
                borderWidth: 5,
                canvasBackground: '#ffffff',
                borderColor: 'lightblue',
                css: {'touch-action': 'manipulation'}
            };
        }

        var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        var horizontalMargin = isIOS ? 8 : 24;
        var verticalMargin = isIOS ? 8 : 20;
        var maxWidth = Math.min(1200, Math.max(320, viewportWidth - horizontalMargin));
        var availableHeight = Math.max(220, viewportHeight - verticalMargin);
        var proportions = Math.min(0.62, availableHeight / maxWidth);
        proportions = Math.max(isIOS ? 0.37 : 0.42, proportions);

        return {
            maxWidth: Math.floor(maxWidth),
            proportions: proportions,
            background: '#ffffff',
            borderWidth: 5,
            canvasBackground: '#ffffff',
            borderColor: 'lightblue',
            css: {'touch-action': 'manipulation'}
        };
    }

    var responsiveCanvas = getResponsiveCanvas();
    var compactLandscape = (window.innerWidth || 0) > (window.innerHeight || 0) && (global.$isTouch || (window.innerWidth || 0) <= 1024);
      
    return iatExtension({
        canvas: responsiveCanvas,
        touchInputWidth: compactLandscape ? 34 : 30,
        blockAttributes_nTrials: 12, // trial number of block 1
		blockAttributes_nMiniBlocks: 6, // 14/7=2 trials per mini-block (must be divisible)
		
        blockCategories_nTrials: 12, // block 2
		blockCategories_nMiniBlocks: 6, // 14/7=2 trials per mini-block (must be divisible)
		
        blockFirstCombined_nTrials: 24, // block 3,6
		blockFirstCombined_nMiniBlocks: 6, // combined blocks are generated in groups of 4 trials
		
        blockSecondCombined_nTrials: 48, // block 4,7
		blockSecondCombined_nMiniBlocks: 6,
		
        blockSwitch_nTrials: 24,  // block 5, switch
		blockSwitch_nMiniBlocks: 6,

		randomAttSide: true, // Randomize whether Bad/Good Student starts on the left or right.

		//attributeFirstInBlocks: [4, 6], // make the first stimulus a word in blocks 4 and 6
		
        category1 : {
            name : global.asianLabels, //Will appear in the data.
            title : {
                media : {word : global.asianLabels}, //Name of the category presented in the task.
                css : {color:'#31940F','font-size':'1.8em'}, //Style of the category title.
                height : 4 //Used to position the "Or" in the combined block.
            }, 
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {image: 'FAS04.jpg'},
                {image: 'FAS05.jpg'},
                {image: 'FAS07.jpg'},
                {image: 'MAS01.jpg'},                
                {image: 'MAS03.jpg'},
                {image: 'MAS06.jpg'}
            ],
            //Stimulus css (style)
            stimulusCss : Object.assign({color:'#31940F','font-size':'2.3em'}, compactLandscape ? {maxWidth:'48%', maxHeight:'52%'} : {})
        },    
        category2 : {
            name : global.whiteLabels, //Will appear in the data.
            title : {
                media : {word : global.whiteLabels}, //Name of the category presented in the task.
                css : {color:'#31940F','font-size':'1.8em'}, //Style of the category title.
                height : 4 //Used to position the "Or" in the combined block.
            }, 
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {image: 'FEA15.jpg'},
                {image: 'FEA23.jpg'},
                {image: 'FEA36.jpg'},
                {image: 'MEA06b.jpg'},
                {image: 'MEA11.jpg'},
                {image: 'MEA14.jpg'},
            ],
            //Stimulus css (style)
            stimulusCss : Object.assign({color:'#31940F','font-size':'2.3em'}, compactLandscape ? {maxWidth:'48%', maxHeight:'52%'} : {})
        },
        attribute1 : {
            name : 'Bad Student',
            title : {
                media : {word : 'Bad Student'},
                css : {color:'#0000FF','font-size':'1.8em'},
                height : 4 //Used to position the "Or" in the combined block.
            },
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {word: global.negWords[0]},
                {word: global.negWords[1]},
                {word: global.negWords[2]},
                {word: global.negWords[3]},
                {word: global.negWords[4]},
                {word: global.negWords[5]},
            ],
            //Stimulus css
            stimulusCss : {color:'#0000FF','font-size':'2.3em'}
        },
        attribute2 : {
            name : 'Good Student',
            title : {
                media : {word : 'Good Student'},
                css : {color:'#0000FF','font-size':'1.8em'},
                height : 4 //Used to position the "Or" in the combined block.
            },
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {word: global.posWords[0]},
                {word: global.posWords[1]},
                {word: global.posWords[2]},
                {word: global.posWords[3]},
                {word: global.posWords[4]},
                {word: global.posWords[5]},
            ],
            //Stimulus css
            stimulusCss : {color:'#0000FF','font-size':'2.3em'}
        },
        base_url : {//Where are your images at?
            image : global.baseURL
        },
        participant_id : global.participant_id,
        isTouch : global.$isTouch
    });
});
