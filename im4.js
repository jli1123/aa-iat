define(['questAPI'], function(Quest){
    var API = new Quest();
    var isTouch = API.getGlobal().$isTouch;

    function enhanceIM4Ui(){
        if (typeof document === 'undefined') return;

        if (!document.getElementById('im4-style')){
            var style = document.createElement('style');
            style.id = 'im4-style';
            style.textContent = [
                '[piq-page] li { list-style-type: none; }',
                '[piq-page] li::marker { content: ""; font-size: 0; }',
                '[piq-page] .im4-header-title { display: block; text-align: center; }',
                '[piq-page] .im4-header-citation { display: block; margin-top: 0.2em; text-align: center; font-size: 0.72em; line-height: 1.25; }',
                '[piq-page] [ng-click="decline($event)"], [piq-page] [data-ng-click="decline($event)"] { display: none !important; }',
                '[piq-page] .im4-question-stem, [piq-page] .im4-required-stem, [piq-page] .im4-question-stem.demographics-choice-option, [piq-page] .im4-required-stem.demographics-choice-option { display: block; width: auto; margin: 0 0 0.5em; padding: 0 !important; color: #222 !important; background: transparent !important; border: 0 !important; box-shadow: none !important; text-align: left; white-space: normal; position: static; font-weight: 700 !important; }',
                '[piq-page] .im4-question-stem::before, [piq-page] .im4-required-stem::before, [piq-page] .im4-question-stem::after, [piq-page] .im4-required-stem::after { content: none !important; display: none !important; }',
                '[piq-page] .im4-required-star { display: inline-block; margin-right: 6px; color: #c9302c; font-weight: 700; }',
                '[piq-page] .im4-choice-option, [piq-page] .im4-choice-option:hover, [piq-page] .im4-choice-option:focus, [piq-page] .im4-choice-option:active, [piq-page] .im4-choice-option.active, [piq-page] .im4-choice-option.btn-primary, [piq-page] .im4-choice-option.btn-info { display: block; width: 100%; margin: 6px 0; padding: 6px 10px 6px 34px !important; color: #222 !important; background: #fff !important; border: 0 !important; box-shadow: none !important; text-align: left; white-space: normal; position: relative; }',
                '[piq-page] .im4-choice-option::before { content: ""; position: absolute; left: 8px; top: 50%; width: 16px; height: 16px; margin-top: -8px; border: 1.5px solid #777; border-radius: 50%; background: #fff; }',
                '[piq-page] .im4-choice-option.active::after, [piq-page] .im4-choice-option.btn-primary::after, [piq-page] .im4-choice-option.btn-info::after, [piq-page] .im4-choice-option[aria-pressed="true"]::after, [piq-page] .im4-choice-option[aria-checked="true"]::after { content: ""; position: absolute; left: 12px; top: 50%; width: 8px; height: 8px; margin-top: -4px; border-radius: 50%; background: #337ab7; }',
                '[piq-page] .glyphicon-warning-sign, [piq-page] .glyphicon-exclamation-sign, [piq-page] .text-danger::before, [piq-page] .alert-danger::before, [piq-page] .help-block::before { content: none !important; display: none !important; }',
                '.im4-scroll-target { outline: 2px solid rgba(201, 48, 44, 0.35); outline-offset: 4px; }',
                '@media (min-width: 700px) { [piq-page] .im4-matrix-source { display: none !important; } }',
                '.im4-matrix-shell { margin: 0 0 20px; overflow-x: auto; }',
                '.im4-matrix { min-width: 680px; border: 1px solid #d7dde3; border-radius: 4px; overflow: hidden; }',
                '.im4-matrix-header, .im4-matrix-row { display: grid; grid-template-columns: minmax(300px, 2.7fr) repeat(7, minmax(72px, 1fr)); align-items: stretch; }',
                '.im4-matrix-header { position: sticky; top: 0; z-index: 2; background: #eef5f8; border-bottom: 1px solid #c8d5dc; }',
                '.im4-matrix-heading, .im4-matrix-column, .im4-matrix-question { padding: 12px 10px; }',
                '.im4-matrix-heading { font-weight: 700; }',
                '.im4-matrix-column { display: flex; align-items: center; justify-content: center; min-height: 70px; text-align: center; line-height: 1.2; font-size: 0.92em; }',
                '.im4-matrix-row { border-bottom: 1px solid #e2e6e9; background: #fff; }',
                '.im4-matrix-row:last-child { border-bottom: 0; }',
                '.im4-matrix-row:nth-child(odd) { background: #fafbfc; }',
                '.im4-matrix-question { display: flex; align-items: center; line-height: 1.35; font-weight: 600; }',
                '.im4-matrix-required { margin-right: 6px; color: #c9302c; font-weight: 700; }',
                '.im4-matrix-choice { position: relative; min-height: 58px; padding: 0; border: 0; border-left: 1px solid #edf0f2; border-radius: 0; background: transparent; }',
                '.im4-matrix-choice:hover, .im4-matrix-choice:focus { background: #eef6fb; outline: 0; }',
                '.im4-matrix-choice::before { content: ""; position: absolute; left: 50%; top: 50%; width: 18px; height: 18px; margin: -9px 0 0 -9px; border: 1.5px solid #666; border-radius: 50%; background: #fff; }',
                '.im4-matrix-choice.is-selected::after { content: ""; position: absolute; left: 50%; top: 50%; width: 10px; height: 10px; margin: -5px 0 0 -5px; border-radius: 50%; background: #337ab7; }',
                '.im4-matrix-row.is-incomplete { background: #f9e5e5; box-shadow: inset 4px 0 0 #c9302c; }',
                '.im4-matrix-error { display: none; margin-left: 8px; color: #c9302c; font-weight: 400; font-size: 0.9em; }',
                '.im4-matrix-row.is-incomplete .im4-matrix-error { display: inline; }',
                '@media (min-width: 700px) and (max-width: 999px) { .im4-matrix-header, .im4-matrix-row { grid-template-columns: minmax(260px, 2.5fr) repeat(7, minmax(62px, 1fr)); } .im4-matrix-column { min-height: 82px; padding: 8px 4px; font-size: 0.78em; } .im4-matrix-question { padding: 9px 8px; font-size: 0.9em; } .im4-matrix-choice { min-height: 54px; } }',
                '@media (max-width: 699px) { .im4-matrix-shell { display: none !important; } }'
            ].join('\n');
            document.head.appendChild(style);
        }

        var likertAnswers = [
            'Strongly disagree',
            'Disagree',
            'Slightly disagree',
            'Neither agree nor disagree',
            'Slightly agree',
            'Agree',
            'Strongly agree'
        ];

        var stems = [
            '1. Asian Americans generally perform better on standardized exams',
            '2. Asian Americans are less likely to face barriers at work.',
            '3. Asian Americans make more money because they work harder.',
            '4. Asian Americans are more likely to persist through tough situations.',
            '5. Asian Americans are more likely to be treated as equal to European Americans.',
            '6. Asian Americans are more likely to be good at math and science.',
            '7. Asian Americans get better grades in school because they study harder.',
            '8. Asian Americans are less likely to experience racism in the United States.',
            '9. Asian Americans are harder workers.',
            '10. Despite experiences with racism, Asian Americans are more likely to achieve academic and economic success.',
            '11. Asian Americans are more motivated to be successful.',
            '12. Asian Americans have stronger work ethics.',
            '13. It is easier for Asian Americans to climb the corporate ladder.',
            '14. Asian Americans generally have higher grade point averages in school because academic success is more important.',
            '15. Asian Americans are less likely to encounter racial prejudice and discrimination.'
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

        function isStemText(text){
            for (var i = 0; i < stems.length; i++){
                if (text.indexOf(stems[i]) === 0){
                    return true;
                }
            }
            return false;
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
            var options = container.querySelectorAll('.im4-choice-option');
            for (var i = 0; i < options.length; i++){
                if (selected(options[i])) return true;
            }
            return false;
        }

        function firstIncompleteStem(){
            var matrixRows = document.querySelectorAll('[piq-page] .im4-matrix-row');
            for (var matrixIndex = 0; matrixIndex < matrixRows.length; matrixIndex++){
                if (!questionAnswered(matrixRows[matrixIndex]._sourceContainer)) return matrixRows[matrixIndex];
            }

            var stemsInPage = document.querySelectorAll('[piq-page] .im4-question-stem, [piq-page] .im4-required-stem');
            for (var i = 0; i < stemsInPage.length; i++){
                if (!visible(stemsInPage[i])) continue;
                if (!questionAnswered(findQuestionContainer(stemsInPage[i]))) return stemsInPage[i];
            }
            return null;
        }

        function scrollToElement(element){
            if (!element) return;

            element.scrollIntoView({behavior: 'smooth', block: 'center'});
            element.classList.add('im4-scroll-target');
            setTimeout(function(){
                element.classList.remove('im4-scroll-target');
            }, 1200);
        }

        function markStems(){
            var candidates = document.querySelectorAll('[piq-page] .im4-question-stem, [piq-page] label, [piq-page] p, [piq-page] span, [piq-page] div');
            Array.prototype.forEach.call(candidates, function(candidate){
                if (!visible(candidate) || controlCount(candidate) !== 0) return;
                if (candidate.classList.contains('im4-question-stem') || isStemText(cleanText(candidate))){
                    candidate.classList.remove('demographics-choice-option', 'radio-choice-option', 'multi-choice-option');
                    candidate.classList.add('im4-required-stem');
                }
            });
        }

        function markChoiceOptions(){
            var candidates = document.querySelectorAll('[piq-page] .btn, [piq-page] button, [piq-page] label, [piq-page] [role="button"]');
            Array.prototype.forEach.call(candidates, function(option){
                var action = option.getAttribute('ng-click') || option.getAttribute('data-ng-click') || '';
                if (action.indexOf('submit') !== -1 || !visible(option)) return;
                if (!textIsOneOf(cleanText(option), likertAnswers)) return;

                option.classList.remove('demographics-choice-option', 'radio-choice-option', 'multi-choice-option');
                option.classList.add('im4-choice-option');
            });
        }

        function syncMatrixSelections(page){
            var choices = page.querySelectorAll('.im4-matrix-choice');
            Array.prototype.forEach.call(choices, function(choice){
                var isSelected = selected(choice._sourceOption);
                choice.classList.toggle('is-selected', isSelected);
                choice.setAttribute('aria-checked', isSelected ? 'true' : 'false');
                if (isSelected && choice.closest('.im4-matrix-row')){
                    choice.closest('.im4-matrix-row').classList.remove('is-incomplete');
                }
            });
        }

        function markMatrixIncompleteRows(page){
            var rows = page.querySelectorAll('.im4-matrix-row');
            Array.prototype.forEach.call(rows, function(row){
                row.classList.toggle('is-incomplete', !questionAnswered(row._sourceContainer));
            });
        }

        function removeMatrix(page){
            var shell = page.querySelector('.im4-matrix-shell');
            if (shell && shell.parentNode) shell.parentNode.removeChild(shell);
            var sources = page.querySelectorAll('.im4-matrix-source');
            Array.prototype.forEach.call(sources, function(source){ source.classList.remove('im4-matrix-source'); });
            page.removeAttribute('data-im4-matrix-built');
        }

        function renderMatrix(){
            var page = document.querySelector('[piq-page]');
            if (!page) return;

            if (!window.matchMedia('(min-width: 700px)').matches){
                removeMatrix(page);
                return;
            }

            if (page.getAttribute('data-im4-matrix-built')){
                syncMatrixSelections(page);
                return;
            }

            var stemElements = page.querySelectorAll('.im4-question-stem');
            var rows = [];
            Array.prototype.forEach.call(stemElements, function(stem){
                var container = findQuestionContainer(stem);
                var options = container.querySelectorAll('.im4-choice-option');
                if (options.length === likertAnswers.length){
                    rows.push({stem: stem, container: container, options: options});
                }
            });
            if (rows.length !== stems.length) return;

            page.setAttribute('data-im4-matrix-built', 'true');
            var shell = document.createElement(rows[0].container.parentNode.tagName.toLowerCase() === 'ol' ? 'li' : 'div');
            shell.className = 'im4-matrix-shell';

            var instructions = rows[0].container.querySelector('.im4-instructions');
            if (instructions) shell.appendChild(instructions.cloneNode(true));

            var matrix = document.createElement('div');
            matrix.className = 'im4-matrix';
            matrix.setAttribute('role', 'radiogroup');

            var header = document.createElement('div');
            header.className = 'im4-matrix-header';
            var heading = document.createElement('div');
            heading.className = 'im4-matrix-heading';
            heading.textContent = 'Item';
            header.appendChild(heading);
            likertAnswers.forEach(function(answer){
                var column = document.createElement('div');
                column.className = 'im4-matrix-column';
                column.textContent = answer;
                header.appendChild(column);
            });
            matrix.appendChild(header);

            rows.forEach(function(rowData){
                var row = document.createElement('div');
                row.className = 'im4-matrix-row';
                row._sourceContainer = rowData.container;

                var question = document.createElement('div');
                question.className = 'im4-matrix-question';
                question.innerHTML = '<span class="im4-matrix-required">*</span><span>' + cleanText(rowData.stem).replace(/^\*\s*/, '') + '</span><span class="im4-matrix-error">This question is required.</span>';
                row.appendChild(question);

                Array.prototype.forEach.call(rowData.options, function(option, optionIndex){
                    var choice = document.createElement('button');
                    choice.type = 'button';
                    choice.className = 'im4-matrix-choice';
                    choice.setAttribute('role', 'radio');
                    choice.setAttribute('aria-label', cleanText(rowData.stem).replace(/^\*\s*/, '') + ': ' + likertAnswers[optionIndex]);
                    choice._sourceOption = option;
                    choice.addEventListener('click', function(){
                        option.click();
                        setTimeout(function(){ syncMatrixSelections(page); }, 0);
                    });
                    row.appendChild(choice);
                });

                matrix.appendChild(row);
                rowData.container.classList.add('im4-matrix-source');
            });

            shell.appendChild(matrix);
            rows[0].container.parentNode.insertBefore(shell, rows[0].container);
            syncMatrixSelections(page);
        }
        function watchSelectedOptions(){
            if (document.documentElement.getAttribute('data-im4-radio-watch')) return;
            document.documentElement.setAttribute('data-im4-radio-watch', 'true');

            document.addEventListener('click', function(event){
                var option = event.target.closest('.im4-choice-option');
                if (!option || !option.closest('[piq-page]')) return;
                if (!selected(option)) return;

                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }, true);
        }

        function watchSubmitForIncompleteQuestions(){
            if (document.documentElement.getAttribute('data-im4-submit-scroll')) return;
            document.documentElement.setAttribute('data-im4-submit-scroll', 'true');

            document.addEventListener('click', function(event){
                var submit = event.target.closest('[ng-click], [data-ng-click], button, .btn');
                if (!submit || !submit.closest('[piq-page]')) return;

                var action = submit.getAttribute('ng-click') || submit.getAttribute('data-ng-click') || '';
                var text = cleanText(submit).toLowerCase();
                if (action.indexOf('submit') === -1 && text !== 'submit') return;

                markMatrixIncompleteRows(submit.closest('[piq-page]'));
                setTimeout(function(){
                    scrollToElement(firstIncompleteStem());
                }, 100);
                setTimeout(function(){
                    scrollToElement(firstIncompleteStem());
                }, 300);
            }, true);
        }

        function enhance(){
            markStems();
            markChoiceOptions();
            renderMatrix();
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

    enhanceIM4Ui();

    API.addPagesSet('basicPage',{
        noSubmit: false,
        header: 'Questionnaire',
        decline: false
    });

    API.addPagesSet('im4Page',{
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
        },
        help: '<%= pagesMeta.number < 3 %>'
    });

    API.addQuestionsSet('basicSelect',{
        inherit: 'basicQ',
        type: 'selectOne'
    });

    API.addQuestionsSet('im4Likert7',{
        inherit: 'basicSelect',
        answers: [
            {text: 'Strongly disagree', value: 1},
            {text: 'Disagree', value: 2},
            {text: 'Slightly disagree', value: 3},
            {text: 'Neither agree nor disagree', value: 4},
            {text: 'Slightly agree', value: 5},
            {text: 'Agree', value: 6},
            {text: 'Strongly agree', value: 7}
        ]
    });

    var im4InstructionsHtml = [
        '<div class="im4-instructions" style="margin: 0 0 18px; padding: 14px 16px; border: 1px solid #d9d9d9; border-left: 5px solid #222; background: #f7f7f7; border-radius: 4px;">',
        '<div style="font-weight: 700; font-size: 1.05em; margin-bottom: 8px;">Instructions: Using the scale below, indicate the extent to which you agree or disagree with each item. Please be open and honest in your responding.</div>',
        '<div style="font-size: 0.98em; line-height: 1.5;"><strong>In comparison to other racial minorities (e.g., African American, Hispanics, Native Americans)...</strong></div>',
        '</div>'
    ].join('');

    function questionStem(text){
        return '<span class="im4-question-stem"><span class="im4-required-star">*</span>' + text + '</span>';
    }

    API.addQuestionsSet('mm18',{
        inherit: 'im4Likert7',
        name: 'mm18_work_ethic',
        stem: im4InstructionsHtml + questionStem('1. Asian Americans generally perform better on standardized exams (i.e., SAT) because of their values in academic achievement.')
    });

    API.addQuestionsSet('mm13',{
        inherit: 'im4Likert7',
        name: 'mm13_harder_workers',
        stem: questionStem('2. Asian Americans are less likely to face barriers at work.')
    });

    API.addQuestionsSet('mm16',{
        inherit: 'im4Likert7',
        name: 'mm16_success_despite_racism',
        stem: questionStem('3. Asian Americans make more money because they work harder.')
    });

    API.addQuestionsSet('mm17',{
        inherit: 'im4Likert7',
        name: 'mm17_motivated_success',
        stem: questionStem('4. Asian Americans are more likely to persist through tough situations.')
    });

    API.addQuestionsSet('mm29',{
        inherit: 'im4Likert7',
        name: 'mm29_higher_gpa',
        stem: questionStem('5. Asian Americans are more likely to be treated as equal to European Americans.')
    });

    API.addQuestionsSet('mm9',{
        inherit: 'im4Likert7',
        name: 'mm9_better_grades',
        stem: questionStem('6. Asian Americans are more likely to be good at math and science.')
    });

    API.addQuestionsSet('mm3',{
        inherit: 'im4Likert7',
        name: 'mm3_standardized_exams',
        stem: questionStem('7. Asian Americans get better grades in school because they study harder.')
    });

    API.addQuestionsSet('mm5',{
        inherit: 'im4Likert7',
        name: 'mm5_more_money',
        stem: questionStem('8. Asian Americans are less likely to experience racism in the United States.')
    });

    API.addQuestionsSet('mm8',{
        inherit: 'im4Likert7',
        name: 'mm8_math_science',
        stem: questionStem('9. Asian Americans are harder workers.')
    });

    API.addQuestionsSet('mm7',{
        inherit: 'im4Likert7',
        name: 'mm7_persist_tough',
        stem: questionStem('10. Despite experiences with racism, Asian Americans are more likely to achieve academic and economic success.')
    });

    API.addQuestionsSet('mm20',{
        inherit: 'im4Likert7',
        name: 'mm20_less_work_barriers',
        stem: questionStem('11. Asian Americans are more motivated to be successful.')
    });

    API.addQuestionsSet('mm32',{
        inherit: 'im4Likert7',
        name: 'mm32_less_prejudice',
        stem: questionStem('12. Asian Americans have stronger work ethics.')
    });

    API.addQuestionsSet('mm10',{
        inherit: 'im4Likert7',
        name: 'mm10_less_racism',
        stem: questionStem('13. It is easier for Asian Americans to climb the corporate ladder.')
    });

    API.addQuestionsSet('mm11',{
        inherit: 'im4Likert7',
        name: 'mm11_treated_as_equals',
        stem: questionStem('14. Asian Americans generally have higher grade point averages in school because academic success is more important.')
    });

    API.addQuestionsSet('mm23',{
        inherit: 'im4Likert7',
        name: 'mm23_easier_ladder',
        stem: questionStem('15. Asian Americans are less likely to encounter racial prejudice and discrimination.')
    });

    API.addSequence([{
        inherit: 'im4Page',
        questions: [
            {inherit: 'mm18'},
            {inherit: 'mm13'},
            {inherit: 'mm16'},
            {inherit: 'mm17'},
            {inherit: 'mm29'},
            {inherit: 'mm9'},
            {inherit: 'mm3'},
            {inherit: 'mm5'},
            {inherit: 'mm8'},
            {inherit: 'mm7'},
            {inherit: 'mm20'},
            {inherit: 'mm32'},
            {inherit: 'mm10'},
            {inherit: 'mm11'},
            {inherit: 'mm23'}
        ]
    }]);

    return API.script;
});
