// Run from the repository root: node qualtrics/verify.cjs
// API-contract tests; a published Qualtrics survey still needs end-to-end testing.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const _ = {
    defaults(target, ...sources) { for (const source of sources) for (const k in source) if (target[k] === undefined) target[k] = source[k]; return target; },
    extend: Object.assign,
    shuffle: a => a.slice().reverse(),
    contains: (a, v) => (a || []).includes(v),
    isString: v => typeof v === 'string',
    escape: v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    get: (o, p) => p.split('.').reduce((v, k) => v == null ? undefined : v[k], o)
};
function load(file, dependencies, touch, random) {
    let result;
    const math = Object.create(Math);
    math.random = random;
    vm.runInNewContext(fs.readFileSync(file, 'utf8'), {
        define: (names, factory) => { result = factory(...dependencies); },
        window: { innerWidth: 1000, innerHeight: 800, minnoJS: {} },
        document: { documentElement: {clientWidth: 1000, clientHeight: 800} },
        navigator: {userAgent: '', platform: '', maxTouchPoints: touch ? 1 : 0},
        Math: math
    }, {filename: file});
    return result;
}
function makeAPI() {
    return class API {
        constructor() { this.script = {settings: {}, trials: {}, stimuli: {}, media: {}}; this.current = {}; }
        getCurrent() { return this.current; }
        shuffle(a) { return _.shuffle(a); }
        addSettings(k, v) { this.script.settings[k] = v; }
        addTrialSets(k, v) { if (typeof k === 'string') this.script.trials[k] = v; else Object.assign(this.script.trials, k); }
        addStimulusSets(v) { Object.assign(this.script.stimuli, v); }
        addMediaSets(v) { Object.assign(this.script.media, v); }
        addSequence(v) { this.script.sequence = v; }
    };
}
const plain = v => JSON.parse(JSON.stringify(v));
function parseCSV(csv) {
    const rows = []; let row = [], cell = '', quoted = false;
    for (let i = 0; i < csv.length; i++) {
        const c = csv[i];
        if (c === '"') {
            if (quoted && csv[i + 1] === '"') { cell += '"'; i++; }
            else quoted = !quoted;
        } else if (!quoted && (c === ',' || c === '\n')) {
            row.push(cell); cell = '';
            if (c === '\n') { rows.push(row); row = []; }
        } else cell += c;
    }
    row.push(cell); rows.push(row);
    return rows;
}
let maxSize = 0;
let stressSize = 0;
for (const touch of [false, true]) for (let permutation = 0; permutation < 4; permutation++) {
    const API = makeAPI();
    const options = load('qualtrics/raceiat.js', [API, o => o], touch, () => 0.25);
    assert.equal(options.isTouch, touch);
    assert.equal(options.base_url.image, 'https://jli1123.github.io/aa-iat/images/');
    for (const c of ['category1', 'category2']) for (const m of options[c].stimulusMedia) assert.ok(fs.existsSync('images/' + m.image));
    let settings;
    class Scorer {
        addSettings(k, v) { if (k === 'compute') settings = v; }
        computeD() { return {DScore: -0.321, FBMsg: 'Feedback, with "quotes"\nand newline'}; }
    }
    function randomSequence() { let n = 0; return () => ((permutation >> (n++ % 2)) & 1) ? 0.75 : 0.25; }
    const original = load('iat10lib.js', [API, Scorer, _], touch, randomSequence())(options);
    const originalSettings = plain(settings);
    const adapted = load('qualtrics/iat10lib.js', [API, Scorer, _], touch, randomSequence())(options);
    delete originalSettings.postSettings;
    assert.deepEqual(plain(settings), originalSettings, 'D-score settings changed');
    assert.deepEqual(plain(adapted.sequence), plain(original.sequence), 'Trial generation/instructions changed');
    const originalSort = plain(original.trials.sort);
    delete originalSort.data.participant_id;
    assert.deepEqual(plain(adapted.trials.sort), originalSort, 'Error correction changed');
    assert.deepEqual(plain(adapted.stimuli), plain(original.stimuli));
    assert.deepEqual(plain(adapted.media), plain(original.media));
    function expand(items) {
        return items.flatMap(item => item.mixer
            ? Array.from({length: item.mixer === 'repeat' ? item.times : 1}, () => expand(item.data)).flat()
            : [item]);
    }
    const trials = expand(adapted.sequence);
    const counts = Array(7).fill(0);
    const mediaIndex = {};
    const logs = trials.map((trial, i) => {
        const sort = trial.inherit !== 'instructions';
        const data = Object.assign({}, sort ? adapted.trials.sort.data : adapted.trials.instructions[0].data, trial.data);
        let name = trial.inherit;
        let cat = 'dummy', stim = ' ';
        if (sort) {
            counts[data.block - 1]++;
            const basic = adapted.trials[name][0];
            Object.assign(data, basic.data);
            const set = name.slice(0, 4);
            cat = options[set.startsWith('cat') ? 'category' + set[3] : 'attribute' + set[3]].name;
            const media = adapted.media[set];
            mediaIndex[set] = (mediaIndex[set] || 0) + 1;
            const m = media[mediaIndex[set] % media.length];
            stim = m.image || m.word;
            data.score = i % 5 === 0 ? 1 : 0;
        } else if (i === trials.length - 1) stim = touch ? 'Touch the bottom green area to continue to the next task' : 'Press space to continue to the next task';
        return {trial_id: i + 1, name, data, stimuli: [cat], media: [stim], responseHandle: sort ? data.corResp : 'space', latency: 1234};
    });
    assert.deepEqual(counts, [12, 12, 24, 48, 24, 24, 48]);
    assert.equal(logs.length, 200); // 192 sorting trials + 7 instructions + final screen.
    trials.at(-1).customize();
    const logger = adapted.settings.logger;
    const ctx = {};
    logs.forEach(log => logger.onRow('iat', log, {}, ctx));
    const csv = logger.serialize('iat', logger.onEnd('iat', {}, ctx));
    assert.equal((csv.match(/^trial,/gm) || []).length, 200);
    assert.ok(csv.includes('-0.321'));
    assert.ok(csv.includes('"Feedback, with ""quotes""\nand newline"'));
    assert.ok(csv.includes('condition,,C0,'));
    assert.ok(csv.length < 20000, `Payload too large: ${csv.length}`);
    const parsed = parseCSV(csv);
    assert.ok(parsed.every(row => row.length === parsed[0].length));
    const dictionary = new Map(parsed.filter(row => ['condition', 'category', 'stimulus'].includes(row[0])).map(row => [row[2], row]));
    parsed.filter(row => row[0] === 'trial').forEach((row, i) => {
        assert.equal(dictionary.get(row[3])[3], logs[i].data.condition);
        assert.deepEqual(JSON.parse(dictionary.get(row[5])[5]), plain(logs[i].stimuli));
        assert.deepEqual(JSON.parse(dictionary.get(row[6])[6]), plain(logs[i].media));
        assert.equal(row[8], String(logs[i].data.score));
        assert.equal(row[9], String(logs[i].latency));
    });
    maxSize = Math.max(maxSize, csv.length);
    const stressLogs = plain(logs);
    stressLogs.forEach(log => {
        log.latency = 123456.789;
        log.media = log.media.map(m => /\.jpg$/.test(m) ? options.base_url.image + m : m);
    });
    stressSize = Math.max(stressSize, logger.serialize('iat', stressLogs).length);
    assert.ok(stressSize < 20000);
    // Check source lifecycle and size failure paths in the same VM through a captured host.
    // Obtain the host object from a callback's realm without changing production code.
    const host = logger.send.constructor('return window.minnoJS')();
    let saved, ended = 0;
    host.logger = value => { saved = value; };
    host.onEnd = () => { ended++; };
    assert.throws(() => adapted.settings.onEnd(), /not saved/);
    assert.throws(() => logger.send('iat', 'x'.repeat(20001)), /exceeds/);
    assert.equal(host.iatCSV.length, 20001);
    assert.throws(() => adapted.settings.onEnd(), /not saved/);
    assert.equal(ended, 0);
    logger.send('iat', csv);
    adapted.settings.onEnd();
    assert.equal(saved, csv);
    assert.equal(ended, 1);
    // Undefined fields, empty sessions, and multi-stimulus logs must remain serializable.
    assert.ok(logger.serialize('iat', []).includes('summary,'));
    assert.ok(logger.serialize('iat', [{data: {}, media: ['a,b', 'c"d'], stimuli: []}]).includes('trial,'));
}
console.log(`PASS: 8 keyboard/touch/order scenarios; unchanged 7-block design and scoring settings; 200/200 logs retained; CSV round-trip, escaping and logger/onEnd/overflow checked. Maximum synthetic CSV: ${maxSize} characters; full image URLs + longer RTs: ${stressSize}.`);
