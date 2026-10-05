define(['managerAPI',
		'https://cdn.jsdelivr.net/gh/minnojs/minno-datapipe@1.*/datapipe.min.js'], function(Manager){

	//You can use the commented-out code to get parameters from the URL.
	//const queryString = window.location.search;
    //const urlParams = new URLSearchParams(queryString);
    //const pt = urlParams.get('pt');

	var API    = new Manager();
	//const subid = Date.now().toString(16)+Math.floor(Math.random()*10000).toString(16);
	API.addSettings('file_type','csv');

	init_data_pipe(API, '3z7am8N0OpTH', {file_type:'csv'});

    API.setName('mgr');
    API.addSettings('skip',true);


    function createParticipantId(){
        if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(char){
            var random = Math.random() * 16 | 0;
            var value = char === 'x' ? random : (random & 0x3 | 0x8);
            return value.toString(16);
        });
    }

    function getOrCreateParticipantId(){
        var key = 'iat_participant_id';

        if (window.getIatParticipantId) return window.getIatParticipantId();

        try {
            var existingId = localStorage.getItem(key);
            if (existingId) return existingId;

            var newId = createParticipantId();
            localStorage.setItem(key, newId);
            return newId;
        } catch (error) {
            return createParticipantId();
        }
    }

    var participantId = getOrCreateParticipantId();
    window.iatParticipantId = participantId;
    window.getIatParticipantId = function(){ return participantId; };

    var currentSectionKey = 'iat_current_section';

    function getCurrentSection(){
        try {
            return localStorage.getItem(currentSectionKey) || 'demographics';
        } catch (error) {
            return 'demographics';
        }
    }

    function rememberSection(section){
        try {
            localStorage.setItem(currentSectionKey, section);
        } catch (error) {}
    }

    //Randomly select which of two sets of category labels to use.
    let raceSet = API.shuffle(['a','b'])[0];
    let asianLabels = [];
    let whiteLabels = [];

    if (raceSet == 'a') {
      asianLabels.push('Asian American');
      whiteLabels.push('White American');
    } else {
    	asianLabels.push('Asian American');
        whiteLabels.push('White American');
    }

	//let asianLabels = ['Asian American'];
	//let whiteLabels = ['White American'];

    API.addGlobal({
        participant_id: participantId,
        raceiat:{},
        //YBYB: change when copying back to the correct folder
        baseURL: './images/',
        raceSet:raceSet,
        asianLabels:asianLabels,
        whiteLabels:whiteLabels,
        //Select randomly what attribute words to see.
        //Based on Axt, Feng, & Bar-Anan (2021).
        posWords : API.shuffle([
            'Successful', 'Hard-working', 'Intelligent', 'Studious', 'Focused', 'Smart'
        ]),
        negWords : API.shuffle([
            'Rebellious', 'Lazy', 'Distracted', 'Irresponsible', 'Disengaged', 'Slacker'
        ])
    });

    API.addTasksSet({
        instructions: [{
            type: 'message',
            buttonText: 'Continue'
        }],

        intro: [{
            inherit: 'instructions',
            name: 'intro',
            templateUrl: 'intro.jst',
            title: 'Intro',
            header: 'Welcome'
        }],

        raceiat_instructions: [{
            inherit: 'instructions',
            name: 'raceiat_instructions',
            templateUrl: 'raceiat_instructions.jst',
            title: 'Task Instructions',
            header: 'Task Instructions',
            pre: function(){ rememberSection('raceiat_instructions'); }
        }],

        demographics: [{
            type: 'quest',
            name: 'demographics',
            scriptUrl: 'demographics.js?v=20261005-1',
            pre: function(){ rememberSection('demographics'); }
        }],

        screening_ineligible: [{
            type: 'message',
            name: 'screening_ineligible',
            title: 'Thank You',
            header: 'Thank You',
            template: '<div></div>',
            pre: function(){
                rememberSection('screening_ineligible');
                setTimeout(function(){
                    if (window.showDemographicsScreenOutPage) window.showDemographicsScreenOutPage();
                }, 0);
            },
            last: true
        }],

        consent: [{
            inherit: 'instructions',
            name: 'consent',
            templateUrl: 'consent.jst?v=20261005-2',
            title: 'Consent',
            header: 'Consent to Participate',
            pre: function(){ rememberSection('consent'); }
        }],

        invitation: [{
            inherit: 'instructions',
            name: 'invitation',
            templateUrl: 'invitation.jst',
            title: 'Study Invitation',
            header: 'Study Invitation',
            pre: function(){ rememberSection('invitation'); }
        }],

        studydata: [{
            type: 'post',
            name: 'studydata',
            path: [
                'participant_id',
                'study_blurb_response',
                'study_blurb_timestamp',
                'consent_response',
                'consent_timestamp'
            ],
            pre: function(){
                var global = API.getGlobal();

                function getSessionValue(key, fallback){
                    var value = '';
                    if (typeof sessionStorage !== 'undefined') value = sessionStorage.getItem(key) || '';
                    if (!value && typeof localStorage !== 'undefined') value = localStorage.getItem(key) || '';
                    return value || fallback || '';
                }

                global.participant_id = participantId;
                global.study_blurb_response = getSessionValue('screening_blurb_response');
                global.study_blurb_timestamp = getSessionValue('screening_blurb_timestamp');
                global.consent_response = getSessionValue('consent_response');
                global.consent_timestamp = getSessionValue('consent_timestamp');
            }
        }],

        consent_declined: [{
            type: 'message',
            name: 'consent_declined',
            title: 'Thank You',
            header: 'Thank You',
            template: '<div></div>',
            pre: function(){
                rememberSection('consent_declined');
                setTimeout(function(){
                    if (window.showStudyExitPage) window.showStudyExitPage();
                }, 0);
            },
            last: true
        }],

        item_validation: [{
            type: 'quest',
            name: 'item_validation',
            scriptUrl: 'item_validation.js?v=20261005-1',
            pre: function(){ rememberSection('item_validation'); }
        }],

        iat_restart: [{
            type: 'quest',
            name: 'iat_restart',
            scriptUrl: 'iat_restart.js'
        }],

        raceiat: [{
            type: 'time',
            name: 'raceiat',
            scriptUrl: 'raceiat.js',
            pre: function(){ rememberSection('raceiat_active'); }
        }],

        IM4: [{
            type: 'quest',
            name: 'IM4',
            scriptUrl: 'im4.js?v=20261005-1',
            pre: function(){ rememberSection('IM4'); }
        }],

        lastpage: [{
            type: 'message',
            name: 'lastpage',
            templateUrl: 'lastpage.jst',
            title: 'End',
            //Uncomment the following if you want to end the study here.
            //last:true,
            header: 'You have completed the study'
        }],

        debriefing: [{
            type: 'message',
            name: 'debriefing',
            templateUrl: 'debriefing.jst',
            title: 'Deception Debriefing Form',
            header: 'Deception Debriefing Form',
            pre: function(){ rememberSection('debriefing'); }
        }],

        //Use if you want to redirect the participants elsewhere at the end of the study
        redirect:
        [{
			//Replace with any URL you need to put at the end of your study, or just remove this task from the sequence below
            type:'redirect', name:'redirecting', url: 'https://www.google.com/search'
        }],

		//This task waits until the data are sent to the server.
        uploading: uploading_task({header: 'just a moment', body:'Please wait, sending data... '})
    });

    var sequence = [
        { type: 'isTouch' }, //Use Minno's internal touch detection mechanism.

        { type: 'post', path: ['$isTouch', 'participant_id', 'raceSet', 'asianLabels', 'whiteLabels'] },

        // apply touch only styles
        {
            mixer:'branch',
            conditions: {compare:'global.$isTouch', to: true},
            data: [
                {
                    type: 'injectStyle',
                    css: [
                        '[piq-page] {background-color: #fff; border: 1px solid transparent; border-radius: 4px; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); margin-bottom: 20px; border-color: #bce8f1;}',
                        '[piq-page] > ol {margin: 15px;}',
                        '[piq-page] > .btn-group {margin: 0px 15px 15px 15px;}',
                        '.container {padding:5px;}',
                        '[pi-quest]::before, [pi-quest]::after {content: " ";display: table;}',
                        '[pi-quest]::after {clear: both;}',
                        '[pi-quest] h3 { border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px; padding: 10px 15px; color: inherit; font-size: 2em; margin-bottom: 20px; margin-top: 0;background-color: #d9edf7;border-color: #bce8f1;color: #31708f;}',
                        '[pi-quest] .form-group > label {font-size:1.2em; font-weight:normal;}',

                        '[pi-quest] .btn-toolbar {margin:15px;float:none !important; text-align:center;position:relative;}',
                        '[pi-quest] [ng-click="decline($event)"] {position:absolute;right:0;bottom:0}',
                        '[pi-quest] [ng-click="submit()"] {width:30%;line-height: 1.3333333;border-radius: 6px;}',
                        // larger screens
                        '@media (min-width: 480px) {',
                        ' [pi-quest] [ng-click="submit()"] {width:30%;padding: 10px 16px;font-size: 1.6em;}',
                        '}',
                        // phones and smaller screens
                        '@media (max-width: 480px) {',
                        ' [pi-quest] [ng-click="submit()"] {padding: 8px 13px;font-size: 1.2em;}',
                        ' [pi-quest] [ng-click="decline($event)"] {font-size: 0.9em;padding:3px 6px;}',
                        '}'
                    ]
                }
            ]
        },


    ];

    var resumeOrder = ['demographics', 'invitation', 'consent', 'item_validation', 'raceiat_instructions', 'raceiat_active', 'IM4', 'debriefing'];
    var resumeSection = getCurrentSection();
    if (resumeSection === 'raceiat') resumeSection = 'raceiat_instructions';
    var resumeIndex = resumeOrder.indexOf(resumeSection);
    if (resumeIndex === -1) resumeIndex = 0;

    function includeFrom(section){
        return resumeIndex <= resumeOrder.indexOf(section);
    }

    if (resumeSection === 'screening_ineligible'){
        sequence.push({inherit: 'screening_ineligible'});
    } else if (resumeSection === 'consent_declined'){
        sequence.push({inherit: 'consent_declined'});
    } else {
        if (includeFrom('demographics')){
            sequence.push({inherit: 'demographics'});
            sequence.push({
                mixer: 'branch',
                conditions: {compare: 'global.screening_status', to: 'ineligible'},
                data: [{inherit: 'screening_ineligible'}]
            });
        }
        if (includeFrom('invitation')) sequence.push({inherit: 'invitation'});
        if (includeFrom('consent')){
            sequence.push({inherit: 'consent'});
            sequence.push({inherit: 'studydata'});
            sequence.push({
                mixer: 'branch',
                conditions: {compare: 'global.consent_response', to: 'no'},
                data: [{inherit: 'consent_declined'}]
            });
        }
        if (includeFrom('item_validation')) sequence.push({inherit: 'item_validation'});
        if (includeFrom('raceiat_active')){
            if (resumeSection === 'raceiat_active') sequence.push({inherit: 'iat_restart'});
            sequence.push({
                mixer: 'wrapper',
                data: [
                    {inherit: 'raceiat_instructions'},
                    {inherit: 'raceiat'}
                ]
            });
        }
        if (includeFrom('IM4')) sequence.push({inherit: 'IM4'});
        if (includeFrom('debriefing')){
            sequence.push({inherit: 'uploading'});
            sequence.push({inherit: 'debriefing'});
            sequence.push({inherit: 'redirect'});
        }
    }

    API.addSequence(sequence);

    return API.script;
});
