define(['questAPI'], function(Quest){
    var API = new Quest();

    function enhanceItemValidationUi(){
        if (typeof document === 'undefined') return;

        if (!document.getElementById('item-validation-style')){
            var style = document.createElement('style');
            style.id = 'item-validation-style';
            style.textContent = [
                '[piq-page] li { list-style-type: none; }',
                '[piq-page] li::marker { content: ""; font-size: 0; }',
                '[piq-page] [ng-click="decline($event)"], [piq-page] [data-ng-click="decline($event)"] { display: none !important; }',
                '[piq-page] .item-validation-question-stem, [piq-page] .item-validation-required-stem { display: block; width: auto; margin: 0 0 0.5em; padding: 0 !important; color: #222 !important; background: transparent !important; border: 0 !important; box-shadow: none !important; text-align: left; white-space: normal; position: static; font-weight: 700 !important; }',
                '[piq-page] .item-validation-question-stem::before, [piq-page] .item-validation-required-stem::before, [piq-page] .item-validation-question-stem::after, [piq-page] .item-validation-required-stem::after { content: none !important; display: none !important; }',
                '[piq-page] .item-validation-required-star { display: inline-block; margin-right: 6px; color: #c9302c; font-weight: 700; }',
                '[piq-page] .item-validation-choice-option, [piq-page] .item-validation-choice-option:hover, [piq-page] .item-validation-choice-option:focus, [piq-page] .item-validation-choice-option:active, [piq-page] .item-validation-choice-option.active, [piq-page] .item-validation-choice-option.btn-primary, [piq-page] .item-validation-choice-option.btn-info { display: block; width: 100%; margin: 6px 0; padding: 6px 10px 6px 34px !important; color: #222 !important; background: #fff !important; border: 0 !important; box-shadow: none !important; text-align: left; white-space: normal; position: relative; }',
                '[piq-page] .item-validation-choice-option::before { content: ""; position: absolute; left: 8px; top: 50%; width: 16px; height: 16px; margin-top: -8px; border: 1.5px solid #777; border-radius: 50%; background: #fff; }',
                '[piq-page] .item-validation-choice-option.active::after, [piq-page] .item-validation-choice-option.btn-primary::after, [piq-page] .item-validation-choice-option.btn-info::after, [piq-page] .item-validation-choice-option[aria-pressed="true"]::after, [piq-page] .item-validation-choice-option[aria-checked="true"]::after { content: ""; position: absolute; left: 12px; top: 50%; width: 8px; height: 8px; margin-top: -4px; border-radius: 50%; background: #337ab7; }',
                '[piq-page] .glyphicon-warning-sign, [piq-page] .glyphicon-exclamation-sign, [piq-page] .text-danger::before, [piq-page] .alert-danger::before, [piq-page] .help-block::before { content: none !important; display: none !important; }',
                '.item-validation-scroll-target { outline: 2px solid rgba(201, 48, 44, 0.35); outline-offset: 4px; }',
                '@media (min-width: 700px) { [piq-page] .item-validation-matrix-source { display: none !important; } }',
                '.item-validation-matrix-shell { margin: 0 0 20px; overflow-x: auto; }',
                '.item-validation-matrix { min-width: 680px; border: 1px solid #d7dde3; border-radius: 4px; overflow: hidden; }',
                '.item-validation-matrix-header, .item-validation-matrix-row { display: grid; grid-template-columns: minmax(240px, 2.2fr) repeat(7, minmax(78px, 1fr)); align-items: stretch; }',
                '.item-validation-matrix-header { position: sticky; top: 0; z-index: 2; background: #eef5f8; border-bottom: 1px solid #c8d5dc; }',
                '.item-validation-matrix-heading, .item-validation-matrix-column, .item-validation-matrix-question { padding: 12px 10px; }',
                '.item-validation-matrix-heading { font-weight: 700; }',
                '.item-validation-matrix-column { display: flex; align-items: center; justify-content: center; min-height: 70px; text-align: center; line-height: 1.2; font-size: 0.92em; }',
                '.item-validation-matrix-row { border-bottom: 1px solid #e2e6e9; background: #fff; }',
                '.item-validation-matrix-row:last-child { border-bottom: 0; }',
                '.item-validation-matrix-row:nth-child(odd) { background: #fafbfc; }',
                '.item-validation-matrix-question { display: flex; align-items: center; line-height: 1.35; font-weight: 600; }',
                '.item-validation-matrix-required { margin-right: 6px; color: #c9302c; font-weight: 700; }',
                '.item-validation-matrix-choice { position: relative; min-height: 58px; padding: 0; border: 0; border-left: 1px solid #edf0f2; border-radius: 0; background: transparent; }',
                '.item-validation-matrix-choice:hover, .item-validation-matrix-choice:focus { background: #eef6fb; outline: 0; }',
                '.item-validation-matrix-choice::before { content: ""; position: absolute; left: 50%; top: 50%; width: 18px; height: 18px; margin: -9px 0 0 -9px; border: 1.5px solid #666; border-radius: 50%; background: #fff; }',
                '.item-validation-matrix-choice.is-selected::after { content: ""; position: absolute; left: 50%; top: 50%; width: 10px; height: 10px; margin: -5px 0 0 -5px; border-radius: 50%; background: #337ab7; }',
                '.item-validation-matrix-row.is-incomplete { background: #f9e5e5; box-shadow: inset 4px 0 0 #c9302c; }',
                '.item-validation-matrix-error { display: none; margin-left: 8px; color: #c9302c; font-weight: 400; font-size: 0.9em; }',
                '.item-validation-matrix-row.is-incomplete .item-validation-matrix-error { display: inline; }',
                '@media (min-width: 700px) and (max-width: 999px) { .item-validation-matrix-header, .item-validation-matrix-row { grid-template-columns: minmax(190px, 2fr) repeat(7, minmax(68px, 1fr)); } .item-validation-matrix-column { min-height: 82px; padding: 8px 4px; font-size: 0.78em; } .item-validation-matrix-question { padding: 9px 8px; font-size: 0.92em; } .item-validation-matrix-choice { min-height: 54px; } }',
                '@media (max-width: 699px) { .item-validation-matrix-shell { display: none !important; } }'
            ].join('\n');
            document.head.appendChild(style);
        }

        var familiarityAnswers = [
            'Extremely Familiar',
            'Very Familiar',
            'Familiar',
            'Moderately Familiar',
            'Somewhat Familiar',
            'Slightly Familiar',
            'Not At All Familiar'
        ];

        var meaningAnswers = [
            'Talks a lot',
            'Fails often',
            'Does well',
            'Breaks rules',
            'Studies often',
            'Resists rules',
            'Works hard',
            'Follows rules',
            'Gets distracted',
            'Avoids effort',
            'Makes noise',
            'Pays attention',
            'Avoids work',
            'Full of energy',
            'Learns quickly',
            'Not interested',
            'Makes mistakes',
            'Talks loudly',
            'Causes trouble',
            'Cannot focus',
            'Quiet and calm',
            'Not reliable',
            'Very reliable',
            'Not involved',
            'Very interested',
            'Careless',
            'Thinks quickly',
            'Lazy',
            'Loud',
            'Very focused',
            'Lacks effort'
        ];

        function cleanText(element){
            return (element && element.textContent || '').replace(/\s+/g, ' ').trim();
        }

        function visible(element){
            return !!(element && (element.offsetWidth || element.offsetHeight || element.getClientRects().length));
        }

        function controlCount(element){
            return element.querySelectorAll('input:not([type="hidden"]), textarea, select, button, .btn').length;
        }

        function textIsOneOf(text, values){
            for (var i = 0; i < values.length; i++){
                if (text === values[i]) return true;
            }
            return false;
        }

        function selected(option){
            return option.classList.contains('active') ||
                option.classList.contains('btn-primary') ||
                option.classList.contains('btn-info') ||
                option.getAttribute('aria-pressed') === 'true' ||
                option.getAttribute('aria-checked') === 'true';
        }

        function findQuestionContainer(element){
            var selectors = ['li', '[pi-question]', '[piq-question]', '.form-group'];
            for (var i = 0; i < selectors.length; i++){
                var container = element.closest(selectors[i]);
                if (container && container.closest('[piq-page]')) return container;
            }
            return element;
        }

        function questionAnswered(container){
            var options = container.querySelectorAll('.item-validation-choice-option');
            for (var i = 0; i < options.length; i++){
                if (selected(options[i])) return true;
            }
            return false;
        }

        function firstIncompleteStem(){
            var matrixRows = document.querySelectorAll('[piq-page] .item-validation-matrix-row');
            for (var matrixIndex = 0; matrixIndex < matrixRows.length; matrixIndex++){
                if (!questionAnswered(matrixRows[matrixIndex]._sourceContainer)) return matrixRows[matrixIndex];
            }

            var stemsInPage = document.querySelectorAll('[piq-page] .item-validation-question-stem, [piq-page] .item-validation-required-stem');
            for (var i = 0; i < stemsInPage.length; i++){
                if (!visible(stemsInPage[i])) continue;
                if (!questionAnswered(findQuestionContainer(stemsInPage[i]))) return stemsInPage[i];
            }
            return null;
        }

        function scrollToElement(element){
            if (!element) return;

            element.scrollIntoView({behavior: 'smooth', block: 'center'});
            element.classList.add('item-validation-scroll-target');
            setTimeout(function(){
                element.classList.remove('item-validation-scroll-target');
            }, 1200);
        }

        function markStems(){
            var candidates = document.querySelectorAll('[piq-page] .item-validation-question-stem, [piq-page] label, [piq-page] p, [piq-page] span, [piq-page] div');
            Array.prototype.forEach.call(candidates, function(candidate){
                if (!visible(candidate) || controlCount(candidate) !== 0) return;
                if (candidate.classList.contains('item-validation-question-stem')){
                    candidate.classList.remove('demographics-choice-option', 'radio-choice-option', 'multi-choice-option');
                    candidate.classList.add('item-validation-required-stem');
                }
            });
        }

        function markChoiceOptions(){
            var candidates = document.querySelectorAll('[piq-page] .btn, [piq-page] button, [piq-page] label, [piq-page] [role="button"]');
            Array.prototype.forEach.call(candidates, function(option){
                var action = option.getAttribute('ng-click') || option.getAttribute('data-ng-click') || '';
                if (action.indexOf('submit') !== -1 || !visible(option)) return;
                if (option.classList.contains('item-validation-required-stem') || option.querySelector('.item-validation-question-stem')) return;
                if (!textIsOneOf(cleanText(option), familiarityAnswers) && !textIsOneOf(cleanText(option), meaningAnswers)) return;

                option.classList.remove('demographics-choice-option', 'radio-choice-option', 'multi-choice-option');
                option.classList.add('item-validation-choice-option');
            });
        }

        function syncFamiliarityMatrix(page){
            var choices = page.querySelectorAll('.item-validation-matrix-choice');
            Array.prototype.forEach.call(choices, function(choice){
                var isSelected = selected(choice._sourceOption);
                choice.classList.toggle('is-selected', isSelected);
                choice.setAttribute('aria-checked', isSelected ? 'true' : 'false');
                if (isSelected && choice.closest('.item-validation-matrix-row')){
                    choice.closest('.item-validation-matrix-row').classList.remove('is-incomplete');
                }
            });
        }

        function markFamiliarityMatrixIncompleteRows(page){
            var rows = page.querySelectorAll('.item-validation-matrix-row');
            Array.prototype.forEach.call(rows, function(row){
                row.classList.toggle('is-incomplete', !questionAnswered(row._sourceContainer));
            });
        }

        function removeFamiliarityMatrix(page){
            var shell = page.querySelector('.item-validation-matrix-shell');
            if (shell && shell.parentNode) shell.parentNode.removeChild(shell);
            var sources = page.querySelectorAll('.item-validation-matrix-source');
            Array.prototype.forEach.call(sources, function(source){ source.classList.remove('item-validation-matrix-source'); });
            page.removeAttribute('data-item-validation-matrix-built');
        }

        function renderFamiliarityMatrix(){
            var page = document.querySelector('[piq-page]');
            if (!page) return;
            var isFamiliarityPage = cleanText(page).indexOf('Instructions: Please rate your familiarity') !== -1;

            if (!window.matchMedia('(min-width: 700px)').matches || !isFamiliarityPage){
                removeFamiliarityMatrix(page);
                return;
            }

            if (page.getAttribute('data-item-validation-matrix-built')){
                syncFamiliarityMatrix(page);
                return;
            }

            var matrixAnswers = familiarityAnswers.slice().reverse();
            var stemElements = page.querySelectorAll('.item-validation-question-stem');
            var rows = [];
            Array.prototype.forEach.call(stemElements, function(stem){
                var container = findQuestionContainer(stem);
                var options = container.querySelectorAll('.item-validation-choice-option');
                if (options.length === familiarityAnswers.length){
                    rows.push({stem: stem, container: container, options: options});
                }
            });
            if (rows.length !== 12) return;

            page.setAttribute('data-item-validation-matrix-built', 'true');
            var shell = document.createElement(rows[0].container.parentNode.tagName.toLowerCase() === 'ol' ? 'li' : 'div');
            shell.className = 'item-validation-matrix-shell';

            var instructions = rows[0].container.querySelector('.item-validation-familiarity-instructions');
            if (instructions) shell.appendChild(instructions.cloneNode(true));

            var matrix = document.createElement('div');
            matrix.className = 'item-validation-matrix';
            matrix.setAttribute('role', 'radiogroup');

            var header = document.createElement('div');
            header.className = 'item-validation-matrix-header';
            var heading = document.createElement('div');
            heading.className = 'item-validation-matrix-heading';
            heading.textContent = 'Word';
            header.appendChild(heading);
            matrixAnswers.forEach(function(answer){
                var column = document.createElement('div');
                column.className = 'item-validation-matrix-column';
                column.textContent = answer;
                header.appendChild(column);
            });
            matrix.appendChild(header);

            rows.forEach(function(rowData){
                var row = document.createElement('div');
                row.className = 'item-validation-matrix-row';
                row._sourceContainer = rowData.container;

                var questionText = cleanText(rowData.stem).replace(/^\*\s*/, '');
                var question = document.createElement('div');
                question.className = 'item-validation-matrix-question';
                question.innerHTML = '<span class="item-validation-matrix-required">*</span><span>' + questionText + '</span><span class="item-validation-matrix-error">This question is required.</span>';
                row.appendChild(question);

                matrixAnswers.forEach(function(answer){
                    var option = null;
                    Array.prototype.forEach.call(rowData.options, function(candidate){
                        if (cleanText(candidate) === answer) option = candidate;
                    });
                    if (!option) return;

                    var choice = document.createElement('button');
                    choice.type = 'button';
                    choice.className = 'item-validation-matrix-choice';
                    choice.setAttribute('role', 'radio');
                    choice.setAttribute('aria-label', questionText + ': ' + answer);
                    choice._sourceOption = option;
                    choice.addEventListener('click', function(){
                        option.click();
                        setTimeout(function(){ syncFamiliarityMatrix(page); }, 0);
                    });
                    row.appendChild(choice);
                });

                matrix.appendChild(row);
                rowData.container.classList.add('item-validation-matrix-source');
            });

            shell.appendChild(matrix);
            rows[0].container.parentNode.insertBefore(shell, rows[0].container);
            syncFamiliarityMatrix(page);
        }
        function updateSubmitButtonText(){
            var page = document.querySelector('[piq-page]');
            if (!page) return;

            var pageText = cleanText(page);
            var submitText = pageText.indexOf('Instructions: Please rate your familiarity') !== -1 ? 'Next' : 'Submit';
            var candidates = page.querySelectorAll('[ng-click], [data-ng-click], button, .btn');
            Array.prototype.forEach.call(candidates, function(button){
                var action = button.getAttribute('ng-click') || button.getAttribute('data-ng-click') || '';
                var text = cleanText(button).toLowerCase();
                if (action.indexOf('submit') === -1 && text !== 'submit' && text !== 'next') return;
                if (button.textContent !== submitText) button.textContent = submitText;
            });
        }

        function watchSelectedOptions(){
            if (document.documentElement.getAttribute('data-item-validation-radio-watch')) return;
            document.documentElement.setAttribute('data-item-validation-radio-watch', 'true');

            document.addEventListener('click', function(event){
                var option = event.target.closest('.item-validation-choice-option');
                if (!option || !option.closest('[piq-page]')) return;
                if (!selected(option)) return;

                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }, true);
        }

        function watchSubmitForIncompleteQuestions(){
            if (document.documentElement.getAttribute('data-item-validation-submit-scroll')) return;
            document.documentElement.setAttribute('data-item-validation-submit-scroll', 'true');

            document.addEventListener('click', function(event){
                var submit = event.target.closest('[ng-click], [data-ng-click], button, .btn');
                if (!submit || !submit.closest('[piq-page]')) return;

                var action = submit.getAttribute('ng-click') || submit.getAttribute('data-ng-click') || '';
                var text = cleanText(submit).toLowerCase();
                if (action.indexOf('submit') === -1 && text !== 'submit') return;

                markFamiliarityMatrixIncompleteRows(submit.closest('[piq-page]'));
                var incompleteBeforeSubmit = firstIncompleteStem();
                if (!incompleteBeforeSubmit) return;

                setTimeout(function(){
                    scrollToElement(incompleteBeforeSubmit);
                }, 100);
                setTimeout(function(){
                    scrollToElement(incompleteBeforeSubmit);
                }, 300);
            }, true);
        }

        function enhance(){
            markStems();
            markChoiceOptions();
            renderFamiliarityMatrix();
            updateSubmitButtonText();
            watchSelectedOptions();
            watchSubmitForIncompleteQuestions();
        }

        var observer = new MutationObserver(enhance);
        observer.observe(document.body, {childList: true, subtree: true});
        var resizeTimer = null;
        window.addEventListener('resize', function(){
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(enhance, 120);
        });
        window.addEventListener('orientationchange', function(){
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(enhance, 180);
        });
        enhance();
    }

    enhanceItemValidationUi();

    API.addPagesSet('basicPage',{
        noSubmit: false,
        header: 'Questionnaire',
        decline: false
    });

    API.addPagesSet('itemValidationPage',{
        inherit: 'basicPage',
        autoFocus: false,
        header: 'Questionnaire'
    });

    API.addQuestionsSet('basicQ',{
        decline: false,
        required: true,
        errorMsg: {
            required: 'This question is required.'
        },
        autoSubmit: 'true',
        numericValues: 'true',
        onSubmit: function(log){
            log.participant_id = window.getIatParticipantId ? window.getIatParticipantId() : (window.iatParticipantId || 'unknown');
        }
    });

    API.addQuestionsSet('basicSelect',{
        inherit: 'basicQ',
        type: 'selectOne'
    });

    API.addQuestionsSet('familiarityScale',{
        inherit: 'basicSelect',
        answers: [
            {text: 'Extremely Familiar', value: 7},
            {text: 'Very Familiar', value: 6},
            {text: 'Familiar', value: 5},
            {text: 'Moderately Familiar', value: 4},
            {text: 'Somewhat Familiar', value: 3},
            {text: 'Slightly Familiar', value: 2},
            {text: 'Not At All Familiar', value: 1}
        ]
    });

    API.addQuestionsSet('meaningSuccessfulScale',{
        inherit: 'basicSelect',
        answers: [
            {text: 'Talks a lot', value: -1},
            {text: 'Fails often', value: -2},
            {text: 'Does well', value: 1},
            {text: 'Breaks rules', value: -3}
        ]
    });

    API.addQuestionsSet('meaningRebelliousScale',{
        inherit: 'basicSelect',
        answers: [
            {text: 'Studies often', value: -1},
            {text: 'Resists rules', value: 1},
            {text: 'Works hard', value: -2},
            {text: 'Follows rules', value: -3}
        ]
    });

    API.addQuestionsSet('meaningHardWorkingScale',{
        inherit: 'basicSelect',
        answers: [
            {text: 'Gets distracted', value: -1},
            {text: 'Works hard', value: 1},
            {text: 'Avoids effort', value: -2},
            {text: 'Makes noise', value: -3}
        ]
    });

    API.addQuestionsSet('meaningLazyScale',{
        inherit: 'basicSelect',
        answers: [
            {text: 'Follows rules', value: -1},
            {text: 'Pays attention', value: -2},
            {text: 'Avoids work', value: 1},
            {text: 'Full of energy', value: -3}
        ]
    });

    API.addQuestionsSet('meaningIntelligentScale',{
        inherit: 'basicSelect',
        answers: [
            {text: 'Learns quickly', value: 1},
            {text: 'Not interested', value: -1},
            {text: 'Breaks rules', value: -2},
            {text: 'Makes mistakes', value: -3}
        ]
    });

    API.addQuestionsSet('meaningStudiousScale',{
        inherit: 'basicSelect',
        answers: [
            {text: 'Avoids work', value: -1},
            {text: 'Talks loudly', value: -2},
            {text: 'Studies often', value: 1},
            {text: 'Causes trouble', value: -3}
        ]
    });

    API.addQuestionsSet('meaningDistractedScale',{
        inherit: 'basicSelect',
        answers: [
            {text: 'Works hard', value: -1},
            {text: 'Cannot focus', value: 1},
            {text: 'Pays attention', value: -2},
            {text: 'Follows rules', value: -3}
        ]
    });

    API.addQuestionsSet('meaningFocusedScale',{
        inherit: 'basicSelect',
        answers: [
            {text: 'Not interested', value: -1},
            {text: 'Lazy', value: -2},
            {text: 'Breaks rules', value: -3},
            {text: 'Pays attention', value: 1}
        ]
    });

    API.addQuestionsSet('meaningIrresponsibleScale',{
        inherit: 'basicSelect',
        answers: [
            {text: 'Quiet and calm', value: -1},
            {text: 'Studies often', value: -2},
            {text: 'Not reliable', value: 1},
            {text: 'Very reliable', value: -3}
        ]
    });

    API.addQuestionsSet('meaningDisengagedScale',{
        inherit: 'basicSelect',
        answers: [
            {text: 'Not involved', value: 1},
            {text: 'Very interested', value: -1},
            {text: 'Follows rules', value: -2},
            {text: 'Works hard', value: -3}
        ]
    });

    API.addQuestionsSet('meaningSmartScale',{
        inherit: 'basicSelect',
        answers: [
            {text: 'Careless', value: -1},
            {text: 'Thinks quickly', value: 1},
            {text: 'Lazy', value: -2},
            {text: 'Loud', value: -3}
        ]
    });

    API.addQuestionsSet('meaningSlackerScale',{
        inherit: 'basicSelect',
        answers: [
            {text: 'Studies often', value: -1},
            {text: 'Very focused', value: -2},
            {text: 'Lacks effort', value: 1},
            {text: 'Follows rules', value: -3}
        ]
    });

    var itemValidationInstructionsHtml = [
        '<div class="item-validation-familiarity-instructions" style="margin: 0 0 18px; padding: 14px 16px; border: 1px solid #d9d9d9; border-left: 5px solid #222; background: #f7f7f7; border-radius: 4px;">',
        '<div style="font-weight: 700; font-size: 1.05em;">Instructions: Please rate your familiarity with each word on a scale from &lsquo;Not At All Familiar&rsquo; to &lsquo;Extremely Familiar.&rsquo;</div>',
        '</div>'
    ].join('');

    var itemValidationMeaningInstructionsHtml = [
        '<div style="margin: 0 0 18px; padding: 14px 16px; border: 1px solid #d9d9d9; border-left: 5px solid #222; background: #f7f7f7; border-radius: 4px;">',
        '<div style="font-weight: 700; font-size: 1.05em;">Instructions: Please select the best meaning of each word listed below.</div>',
        '</div>'
    ].join('');

    function questionStem(text){
        return '<span class="item-validation-question-stem"><span class="item-validation-required-star">*</span>' + text + '</span>';
    }

    API.addQuestionsSet('successful',{
        inherit: 'familiarityScale',
        name: 'item_validation_successful',
        stem: itemValidationInstructionsHtml + questionStem('Successful')
    });

    API.addQuestionsSet('rebellious',{
        inherit: 'familiarityScale',
        name: 'item_validation_rebellious',
        stem: questionStem('Rebellious')
    });

    API.addQuestionsSet('hardWorking',{
        inherit: 'familiarityScale',
        name: 'item_validation_hard_working',
        stem: questionStem('Hard-working')
    });

    API.addQuestionsSet('lazy',{
        inherit: 'familiarityScale',
        name: 'item_validation_lazy',
        stem: questionStem('Lazy')
    });

    API.addQuestionsSet('intelligent',{
        inherit: 'familiarityScale',
        name: 'item_validation_intelligent',
        stem: questionStem('Intelligent')
    });

    API.addQuestionsSet('studious',{
        inherit: 'familiarityScale',
        name: 'item_validation_studious',
        stem: questionStem('Studious')
    });

    API.addQuestionsSet('distracted',{
        inherit: 'familiarityScale',
        name: 'item_validation_distracted',
        stem: questionStem('Distracted')
    });

    API.addQuestionsSet('focused',{
        inherit: 'familiarityScale',
        name: 'item_validation_focused',
        stem: questionStem('Focused')
    });

    API.addQuestionsSet('irresponsible',{
        inherit: 'familiarityScale',
        name: 'item_validation_irresponsible',
        stem: questionStem('Irresponsible')
    });

    API.addQuestionsSet('disengaged',{
        inherit: 'familiarityScale',
        name: 'item_validation_disengaged',
        stem: questionStem('Disengaged')
    });

    API.addQuestionsSet('smart',{
        inherit: 'familiarityScale',
        name: 'item_validation_smart',
        stem: questionStem('Smart')
    });

    API.addQuestionsSet('slacker',{
        inherit: 'familiarityScale',
        name: 'item_validation_slacker',
        stem: questionStem('Slacker')
    });

    API.addQuestionsSet('meaningSuccessful',{
        inherit: 'meaningSuccessfulScale',
        name: 'item_validation_meaning_successful',
        stem: itemValidationMeaningInstructionsHtml + questionStem('Successful')
    });

    API.addQuestionsSet('meaningRebellious',{
        inherit: 'meaningRebelliousScale',
        name: 'item_validation_meaning_rebellious',
        stem: questionStem('Rebellious')
    });

    API.addQuestionsSet('meaningHardWorking',{
        inherit: 'meaningHardWorkingScale',
        name: 'item_validation_meaning_hard_working',
        stem: questionStem('Hard-working')
    });

    API.addQuestionsSet('meaningLazy',{
        inherit: 'meaningLazyScale',
        name: 'item_validation_meaning_lazy',
        stem: questionStem('Lazy')
    });

    API.addQuestionsSet('meaningIntelligent',{
        inherit: 'meaningIntelligentScale',
        name: 'item_validation_meaning_intelligent',
        stem: questionStem('Intelligent')
    });

    API.addQuestionsSet('meaningStudious',{
        inherit: 'meaningStudiousScale',
        name: 'item_validation_meaning_studious',
        stem: questionStem('Studious')
    });

    API.addQuestionsSet('meaningDistracted',{
        inherit: 'meaningDistractedScale',
        name: 'item_validation_meaning_distracted',
        stem: questionStem('Distracted')
    });

    API.addQuestionsSet('meaningFocused',{
        inherit: 'meaningFocusedScale',
        name: 'item_validation_meaning_focused',
        stem: questionStem('Focused')
    });

    API.addQuestionsSet('meaningIrresponsible',{
        inherit: 'meaningIrresponsibleScale',
        name: 'item_validation_meaning_irresponsible',
        stem: questionStem('Irresponsible')
    });

    API.addQuestionsSet('meaningDisengaged',{
        inherit: 'meaningDisengagedScale',
        name: 'item_validation_meaning_disengaged',
        stem: questionStem('Disengaged')
    });

    API.addQuestionsSet('meaningSmart',{
        inherit: 'meaningSmartScale',
        name: 'item_validation_meaning_smart',
        stem: questionStem('Smart')
    });

    API.addQuestionsSet('meaningSlacker',{
        inherit: 'meaningSlackerScale',
        name: 'item_validation_meaning_slacker',
        stem: questionStem('Slacker')
    });

    API.addSequence([{
        inherit: 'itemValidationPage',
        questions: [
            {inherit: 'successful'},
            {inherit: 'rebellious'},
            {inherit: 'hardWorking'},
            {inherit: 'lazy'},
            {inherit: 'intelligent'},
            {inherit: 'studious'},
            {inherit: 'distracted'},
            {inherit: 'focused'},
            {inherit: 'irresponsible'},
            {inherit: 'disengaged'},
            {inherit: 'smart'},
            {inherit: 'slacker'}
        ]
    },
    {
        inherit: 'itemValidationPage',
        questions: [
            {inherit: 'meaningSuccessful'},
            {inherit: 'meaningRebellious'},
            {inherit: 'meaningHardWorking'},
            {inherit: 'meaningLazy'},
            {inherit: 'meaningIntelligent'},
            {inherit: 'meaningStudious'},
            {inherit: 'meaningDistracted'},
            {inherit: 'meaningFocused'},
            {inherit: 'meaningIrresponsible'},
            {inherit: 'meaningDisengaged'},
            {inherit: 'meaningSmart'},
            {inherit: 'meaningSlacker'}
        ]
    }]);

    return API.script;
});
