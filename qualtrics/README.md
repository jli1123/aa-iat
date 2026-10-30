# Race IAT in Qualtrics

Use the existing Qualtrics JavaScript with this task URL:

```javascript
minnoJS(canvas, 'https://jli1123.github.io/aa-iat/qualtrics/raceiat.js');
```

The host must supply `minnoJS.logger(csv)` and `minnoJS.onEnd`, as described in the [official MinnoJS guide](https://minnojs.github.io/minnojs-blog/qualtrics-iat/). Put the IAT alone on a page in a **multiline Text Entry** question. The logger writes the CSV to its textarea; the host's `onEnd` advances after the documented delay. Deploy both JavaScript files together. This folder does not load `mgr.js`, DataPipe, uploading tasks, or redirects. Survey consent, screening, and other survey content belong in Qualtrics.

The task defines its own race-label draw, labels, shuffled six-word attribute sets, image configuration, and touch detection. All 12 image filenames remain unchanged and use `https://jli1123.github.io/aa-iat/images/`. The sorting counts remain **12, 12, 24, 48, 24, 24, 48** (192 total). Trial generation, instructions, starting-side randomization, error correction, timing, and D-score parameters are preserved. The existing scorer runs when the final instruction screen initializes, before logger finalization. There is no server scoring/upload request. The Qualtrics response identifies the participant; there is no dependency on the original manager's participant ID or local storage.

## CSV format

The logger retains every received log, including practice and instruction logs, followed by dictionary rows and a summary. Columns:

| Column | Meaning |
| --- | --- |
| record | `trial`, `condition`, `category`, `stimulus`, or `summary` |
| block, trial | Original block and trial ID on trial rows |
| cond | Condition reference, e.g. `C0` |
| type | Original logged trial name |
| cat, stim | Category/stimulus references, e.g. `K0`, `S0` |
| resp | Logged response handle (`left`, `right`, or instruction response) |
| err | Original error score: 1 if an error occurred, even after correction |
| rt | Original logged latency in milliseconds, including correction time |
| corResp, parcel | Correct response and original scoring parcel |
| d, fb | Final D-score and scorer feedback/status on the summary row |
| bOrd | Original full block-3 pairing on the summary row |
| raceSet, touch | Label-set draw and touch mode on the summary row |

Decode references by joining the trial's reference to the dictionary row's `trial` column. A `condition` row stores its full value in `cond`; a `category` row stores the original `log.stimuli` array as JSON in `cat`; a `stimulus` row stores the original `log.media` array as JSON in `stim`. Parse the CSV first, then JSON-decode these array cells. Every array element is retained. Dictionary encoding is reversible and saves repeated text; it does not remove trials or shorten variable values. The official example's R/Excel processing may need adapting for these dictionary rows.

With error correction enabled, `resp` is the final logged response and `err` indicates whether a mistake occurred; this preserves the original trial logging semantics rather than introducing a new keypress history. Missing/unavailable scores retain the scorer's result and feedback; no replacement D-score is invented.

## Size and verification

[Qualtrics documents a default 20,000-character limit per Text Entry field](https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/standard-content/text-entry/). Custom validation can lower that limit. The synthetic full-session check produces at most **13,892 characters** with four-digit RTs; a stress fixture with full image URLs and RTs of `123456.789` produces **15,572 characters**. These are estimates, not a guarantee of actual browser output length.

At send time the complete CSV and its character count are exposed as `minnoJS.iatCSV` and `minnoJS.iatCSVLength`. Above 20,000 characters, saving throws an explicit error and advancement is blocked. Nothing is truncated. The payload is only retained in browser memory, so do not close/reload that page if recovery is needed. If real sessions exceed the limit, configure additional storage in the host before collecting data; splitting across fields would require changing the current single-textarea host. Also check for lower field validation limits and successful textarea persistence in your survey.

Run from the repository root:

```text
node --check qualtrics/raceiat.js
node --check qualtrics/iat10lib.js
node qualtrics/verify.cjs
```

The verification uses mocked Minno APIs and a stub scorer. It compares generated sequences, instructions, stimuli, error correction, and scoring settings with the original root library for four starting-side combinations in keyboard and touch modes. It checks counts, image-file existence, all 200 expected log rows, dictionary round-tripping, CSV escaping, callback ordering, and overflow behavior. It does not execute the real Minno runtime or independently validate D-score computation.

Before data collection, test in a published Qualtrics survey:

- Both hosted modules and all images load without browser/network errors.
- Keyboard and supported touch devices show the correct instructions and responsive layout; touch detection works on the intended devices.
- Complete all seven blocks with some deliberate mistakes. Verify correction behavior, RTs, error flags, stimuli, responses, and pairing order in the exported CSV.
- Confirm a valid D-score and invalid/too-fast session status using the real scorer; compare valid scores with the original task or an independent analysis.
- Confirm the final score is saved, the textarea contains the entire CSV, the exported response matches it, and the survey advances exactly once after saving.
- Measure actual CSV length, check Text Entry validation, and test overflow handling. Esc then Enter skips blocks for debugging, so do not use skipped runs to assess normal counts or scoring.

No commit, push, or deployment is performed by these changes.
