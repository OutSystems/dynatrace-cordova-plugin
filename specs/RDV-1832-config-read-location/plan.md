# Implementation Plan: RDV-1832 - Configuration switch for Dynatrace mobile

**Created**: 2026-09-03
**Spec**: None (planned directly from JIRA RDV-1832)
**Branch**: `feature/rdv-1832/ModifyDynatraceconfigRead`
**Status**: Ready for Review

---

## Executive Summary

### Goal

Let an OutSystems 11 mobile app supply a different `dynatrace.config.js` per environment (Dev / UAT /
Prod) through the MABS extensibility configuration, without editing the app or the Forge module
before each deployment. Today the extensibility override lands in the platform folder while the
plugin reads from the project root, so the override is silently ignored and the build ships whatever
config was baked into the module at compile time.

### Root cause (already proven, four independent levels)

| Level         | Evidence                                                                            |
|---------------|-------------------------------------------------------------------------------------|
| Behaviour     | 4 MABS builds across 3 days; override present in log, never read                     |
| Error code    | `OS-MABS-CNF-40011` when the resource target uses `../..` to reach the root          |
| Source code   | `copyConfig.js:21-25` writes root; `PathHelper.js:56` reads root; override goes elsewhere |
| Documentation | OutSystems schema doc: *"For Android, the path is relative to `<project_root>/platforms/android`"* |

**One line:** the override writes to one folder; Dynatrace reads from a different folder.

### The unblocking discovery

`TestDynatraceWithExtConfig2_3_0.1.log` shows MABS applies the resource override **inside** `prepare`,
19 ms before the plugin's `after_prepare` hook runs — and it does so in **every** prepare cycle (MABS
runs three):

| Line | Time         | Event                                                                            |
|-----:|--------------|----------------------------------------------------------------------------------|
|  247 | 21:38:56.425 | override → `platforms/android/app/src/main/assets/www/dynatraceConfig/…` (cycle 1) |
|  380 | 21:39:18.541 | override → same path (cycle 2)                                                     |
|  415 | 21:39:54.318 | `copyConfig.js` runs (`before_prepare`, cycle 3)                                   |
|  443 | 21:39:54.519 | override → same path (cycle 3)                                                     |
|  445 | 21:39:54.538 | `Instrument.js` runs (`after_prepare`)                                            |
|  449 | 21:39:55.227 | `Trying to read configuration file: …/source/dynatrace.config.js`  ← **wrong path** |

Two consequences:

1. **Timing is not a blocker.** An earlier concern that the override arrives too late is disproven.
2. **The overridden file already exists when `copyConfig.js` runs** (written in cycle 2), which makes a
   fix possible entirely inside OutSystems-owned code.

### Scope

**In scope**

- Change where the per-environment `dynatrace.config.js` is read from, so the MABS extensibility
  override is honoured on Android.
- Keep the write location exactly as-is (no extensibility-config change for the app team).
- Preserve current behaviour when no override is declared (backwards compatible).
- Emit a log line naming which config source was used, for diagnosis in MABS logs.

**Out of scope**

- iOS support (no reachable path — see Risk R3). Behaviour must stay unchanged, not break.
- Changing MABS, the OutSystems platform, or the extensibility schema.
- Exposing `applicationId` / `beaconUrl` as plugin variables (the fallback plan if this fails).
- Runtime/manual agent startup via a Site Property.
- Fixing the unrelated `ENOENT` crash in `copyConfig.js:23` beyond what Task 1.1 covers.

### Affected components

| Component                         | Path                                     | Owner      | Impact |
|-----------------------------------|------------------------------------------|------------|--------|
| OutSystems config-copy hook       | `scripts/Outsystems/copyConfig.js`       | OutSystems | High   |
| Upstream build-property resolution| `scripts/utils/InstrumentUtil.js`        | Dynatrace  | Medium (Approach B only) |
| Update procedure                  | `CONTRIBUTING.md`                        | OutSystems | Low (Approach B only) |
| Architecture tenets              | `ARCHITECTURE.md`                        | OutSystems | Low (documentation) |

---

## Key Decisions — discuss with the team before implementing

> Flagged per the koda `alert-about-key-decisions` rule. Two of these are architectural.

### KD1. Which file to change — this reverses the earlier recommendation

Tenet **T5** ([ARCHITECTURE.md:93](../../ARCHITECTURE.md)) states the OutSystems layer handles
*"configuration file management without modifying the core instrumentation logic"*, and names
`scripts/Outsystems/copyConfig.js` as that component.

| | **Approach A** — `copyConfig.js` | **Approach B** — `InstrumentUtil.js` |
|---|---|---|
| Files touched            | 1 (OutSystems-owned)                    | 1 (Dynatrace-owned) + `CONTRIBUTING.md` |
| Complies with T5         | **Yes** — T5 names this exact file      | **No** — modifies core instrumentation |
| Survives a version bump  | **Yes** — `CONTRIBUTING.md:174` copies `scripts/Outsystems/` wholesale | No — `CONTRIBUTING.md:209` overwrites it |
| New update instructions  | None                                     | Yes, a hand-applied step |
| If the step is forgotten | N/A                                      | **Silent** revert to baked-in config |
| Determinism              | Relies on MABS running ≥2 prepare cycles | Deterministic (19 ms margin, proven)  |

Approach A is architecturally correct and maintenance-free but rests on observed MABS behaviour.
Approach B is deterministic but violates T5 and reintroduces the silent-revert risk. **Recommendation:
implement A, and hold B ready as the fallback if A's assumption fails.** Both are "change the read
location", so either satisfies the team's stated constraint.

Prior guidance in discussion ranked B first. T5 plus the multi-cycle log evidence reverses that.

### KD2. Android-only outcome

The fix works on Android and cannot work on iOS (Risk R3). Shipping an Android-only per-environment
switch is a partial solution. The team should decide whether that is acceptable for RDV-1832's
discovery outcome, or whether the plugin-variables approach — which does work on both platforms — is
the better target from the start.

### KD3. Ticket is a Discovery epic, not a delivery ticket

RDV-1832 status is `Discovery`; the Outcome field asks for *"a discovery on what options may be
suitable"*. This plan produces a working spike plus evidence. It does **not** include a plugin
release, version bumps, or a Forge publish. Confirm that matches the expectation before treating the
branch as shippable.

### KD4. Repository has zero tests, and its quality tooling does not run at all

Verified by execution on 2026-09-04 with Node v24.20.0 / npm 11.19.0 after `npm install` (664 packages,
exit 0). Every quality command the docs advertise is broken — not by a missing toolchain, but because
the scripts were inherited verbatim from the upstream TypeScript package and never repointed at this
JavaScript-only fork:

| Documented command                         | Actual result                                              |
|--------------------------------------------|------------------------------------------------------------|
| `npm test` (CLAUDE.md:38, CONTRIBUTING:96) | `npm error Missing script: "test"` — **no `test` script exists**, only `test:debug` |
| `npm run lint` (CLAUDE.md:25)              | exit 2 — `No files matching the pattern "src/**/*.ts"`; there is no `src/` and no `.ts` source |
| `npm run prettier:check`                   | exit 2 — `No files matching the pattern: "./src"`, yet still prints `All matched files use Prettier code style!` — a **false green** |
| `npx eslint <any file>`                    | `ESLint couldn't find an eslint.config.(js\|mjs\|cjs) file` — no flat config, no `.eslintrc*`, no `eslintConfig` key. **ESLint 9 cannot lint this repo at all.** |
| Husky pre-commit (CLAUDE.md:149, CONTRIBUTING:126) | `core.hooksPath=.husky/_` is set and the shims exist, but there is **no `.husky/pre-commit` script**, so `lint-staged` never fires. No enforcement on commit. |

Two further consequences:

- `scripts/Outsystems/copyConfig.js` **already fails `prettier --check`** in its committed state. So do
  not run `prettier --write` on it: that would bury a 3-line behavioural change in whole-file
  reformatting. Keep the diff minimal and match the surrounding style by hand.
- `mock-fs@^5.5.0` and `@types/mock-fs` are **already devDependencies** (package.json:66, :51). The
  tool for testing a filesystem candidate chain is therefore already vendored — no new dependency is
  needed to make Task 1.2 testable.

So KD4 is now two decisions, not one: (a) add the repo's first test, and (b) whether fixing the
tooling (a `test` script, an `eslint.config.mjs`, a `.husky/pre-commit`, prettier scripts pointing at
real directories) belongs in this ticket or a separate one. **Recommendation: separate ticket.** It is
unrelated to RDV-1832, touches release-critical config, and would dwarf a 3-line hook change.

---

## Acceptance Criteria Mapping

| AC  | Description                                                                                    | Verified by                          | Tasks         |
|-----|------------------------------------------------------------------------------------------------|--------------------------------------|---------------|
| AC1 | With an extensibility override declared, the build reads the override's `applicationId`/`beaconUrl` | MABS log line + generated Gradle block | 1.2, 3.1      |
| AC2 | With no override declared, behaviour is byte-identical to today                                 | MABS log + APK comparison            | 1.2, 3.2      |
| AC3 | With no `www/dynatraceConfig` folder, the build does not crash (`ENOENT` regression)            | MABS build completes                 | 1.1, 3.3      |
| AC4 | The MABS log states which config source was used                                                | `grep` the log                       | 1.3, 3.1      |
| AC5 | iOS behaviour is unchanged (still skipped, no new failure)                                      | MABS log iOS lines                   | 1.2, 3.4      |
| AC6 | The change survives an upstream Dynatrace version bump without manual re-application           | Dry-run of `CONTRIBUTING.md:164-210` | 4.1           |

---

## Codebase Context

### Patterns to follow

| Pattern                        | Reference                                    | Why it matters                                    |
|--------------------------------|----------------------------------------------|---------------------------------------------------|
| Candidate-path fallback chain  | `scripts/helpers/PathHelper.js:58-70`        | `getAndroidAssetsPath()` — `existsSync` then fall back |
| Same, iOS variant              | `scripts/helpers/PathHelper.js:120-129`      | `getIosAssetsPathCapacitor()` — two candidates, then default |
| Cordova-version branching      | `scripts/Outsystems/copyConfig.js:4-19`      | `isCordovaAbove(context, 8)` gate for `require` vs `requireCordovaModule` |
| Deferral/promise hook contract | `scripts/Outsystems/copyConfig.js:20-33`     | `deferral.resolve()` on both success and failure paths |
| Recursive copy helpers         | `scripts/Outsystems/copyConfig.js:35-64`     | `copyFileSync` / `copyFolderRecursiveSync`        |

### Key files of interest

| File                                     | Current state                                                                        |
|------------------------------------------|--------------------------------------------------------------------------------------|
| `scripts/Outsystems/copyConfig.js`       | 65 lines. Reads `<projectRoot>/www/dynatraceConfig`, copies to `<projectRoot>`. No `existsSync` guard on line 23; `files` missing `var`. |
| `scripts/utils/InstrumentUtil.js`        | 91 lines. Line 32 sets `pathToConfig = getConfigFilePath()`; line 33 lets `--config` win. |
| `scripts/helpers/PathHelper.js`          | Line 56 `getConfigFilePath()` → `<projectRoot>/dynatrace.config.js`. Line 58 `getAndroidAssetsPath()`. Line 72 `getIOSAssetsPath()`. |
| `scripts/config/ConfigurationReader.js`  | `readConfiguration(path)` uses `require(path)`; any failure → `StopBuildError("Couldn't find Configuration!")`. Receives the path, never chooses it. |
| `plugin.xml`                             | Hooks: `copyConfig.js` at `before_prepare` (line 11), `Instrument.js` at `after_prepare` (line 14). |

### Data flow (Android build, current)

```
module www/dynatraceConfig/dynatrace.config.js   (baked at compile time — Dev values)
        │
        ├─ Cordova prepare ─────────────► platforms/android/app/src/main/assets/www/dynatraceConfig/
        │                                        ▲
        │   MABS extensibility resource ─────────┘  (override — CORRECT values, ignored today)
        │
        └─ copyConfig.js (before_prepare) ──────► <projectRoot>/dynatrace.config.js
                                                         │
                                    Instrument.js ───────┘  reads HERE  ← the defect
```

After the change, the arrow into `Instrument.js` originates from the platform folder instead.

### Exploration questions resolved

- **Entry points**: `plugin.xml` hooks — `copyConfig.js` (`before_prepare`), `Instrument.js` (`after_prepare`).
- **Data flow**: as diagrammed above.
- **Dependencies**: `ConfigurationReader` ← `InstrumentUtil.setBuildProperties` ← `InstrumentHelper.instrument`.
  Also `DoctorCommand.js:69` (diagnostic CLI only).
- **Side effects**: writes `files/dynatrace.gradle` (Android) and the iOS plist; both derive from the
  single `configJson`.
- **Error paths**: `require()` failure → `StopBuildError`. `copyConfig.js:23` `readdirSync` on a missing
  folder → uncaught `ENOENT` (observed in `TestDynatraceAppWithExtConfig4_1_0.1.log:416-418`).
- **Test coverage**: none. Zero test files in the repository.

### Local toolchain — available, but the repo's quality scripts are broken

**Corrected 2026-09-04.** An earlier revision of this plan said `node`/`npm`/`npx` were unavailable.
They were installed the whole time at `C:\Program Files\nodejs` and already on the machine `PATH`; only
the shell session had a stale environment snapshot. Confirmed working:

| Tool | Version   | Note                                                    |
|------|-----------|---------------------------------------------------------|
| node | v24.20.0  | satisfies `engines.node >= 20` (package.json:104)       |
| npm  | 11.19.0   | `npm install` → 664 packages, exit 0                    |

MABS itself runs Node v22.17.1 (per `TestDynatraceWithExtConfig2_3_0.1.log:449`), so local v24 is for
tooling only and is not a fidelity risk for a hook that uses nothing newer than `fs`/`path`.

The real limitation is different, and installing a toolchain does not fix it: **the repo's own lint and
test scripts point at directories that do not exist, and ESLint has no config file.** See KD4 for the
verified command-by-command breakdown. What this means for the tasks below:

- **Works now**: `node --check <file>` (real syntax validation), executing the resolver directly against
  a fixture tree, `npx jest` with an explicit config, `npx prettier --check <file>`.
- **Does not work, at any effort**: `npm test`, `npm run lint`, `npm run prettier:check`, `npx eslint`.
  Do not list these as acceptance gates.
- **Still required**: a real MABS build. The behaviour under change only manifests inside MABS, which
  owns both the filesystem layout and the number of `prepare` cycles.

---

## Implementation Phases

### Phase 1 — Approach A: read the override from the platform folder (OutSystems-owned)

**Objective**: make `copyConfig.js` prefer the post-override platform copy, keeping current behaviour
as the fallback.
**Prerequisite**: none.

- [ ] **Task 1.1**: Add an `existsSync` guard and fix the implicit global in `copyConfig.js`
  - **Files**: `scripts/Outsystems/copyConfig.js` (modify)
  - **Pattern**: guard style per `scripts/helpers/PathHelper.js:63`
  - **Acceptance**: a missing `www/dynatraceConfig` folder logs and resolves instead of throwing
    `ENOENT`; `files` is declared with `var`
  - **Verify**: static review — no `readdirSync` call is reachable without a preceding `existsSync`;
    `grep -n "var files" scripts/Outsystems/copyConfig.js` returns a match
  - **Depends**: None
  - **Complexity**: S

- [ ] **Task 1.2**: Add a candidate-chain config source resolver and use it as the copy source
  - **Files**: `scripts/Outsystems/copyConfig.js` (modify)
  - **Pattern**: `scripts/helpers/PathHelper.js:58-70` and `:120-129`
  - **Acceptance**: resolution order is (1) `platforms/android/app/src/main/assets/www/dynatraceConfig`,
    (2) `platforms/android/assets/www/dynatraceConfig`, (3) `www/dynatraceConfig` (today's behaviour).
    First existing candidate containing `dynatrace.config.js` wins. Destination stays `<projectRoot>`.
  - **Verify**: static review of the ordering; confirmed end-to-end by Task 3.1
  - **Depends**: 1.1
  - **Complexity**: M
  - **Example**:
    ```js
    // OUTSYSTEMS: prefer the platform copy, which MABS has already overwritten with the
    // per-environment resource from the extensibility configuration. Falls back to the
    // module's own www/dynatraceConfig so behaviour is unchanged when no override exists.
    function resolveConfigSource (projectRoot) {
        var candidates = [
            path.join(projectRoot, 'platforms', 'android', 'app', 'src', 'main',
                      'assets', 'www', 'dynatraceConfig'),
            path.join(projectRoot, 'platforms', 'android', 'assets', 'www', 'dynatraceConfig'),
            path.join(projectRoot, 'www', 'dynatraceConfig')
        ];
        for (var i = 0; i < candidates.length; i++) {
            if (fs.existsSync(path.join(candidates[i], 'dynatrace.config.js'))) {
                return { path: candidates[i], isPlatform: i < 2 };
            }
        }
        return undefined;
    }
    ```

- [ ] **Task 1.3**: Log the chosen source unambiguously
  - **Files**: `scripts/Outsystems/copyConfig.js` (modify)
  - **Pattern**: existing `console.log` usage at `scripts/Outsystems/copyConfig.js:29`
  - **Acceptance**: exactly one line per build, prefixed `[Dynatrace][OutSystems]`, naming the absolute
    resolved path and whether it came from the platform folder or the module
  - **Verify**: `grep -c "\[Dynatrace\]\[OutSystems\] config source" <mabs-log>` returns `1`
  - **Depends**: 1.2
  - **Complexity**: S

**Phase 1 Checkpoint**
- [ ] No reachable `readdirSync` / `readFileSync` without an `existsSync` guard
- [ ] Fallback chain ends at today's path, so a no-override build is unchanged
- [ ] `node --check scripts/Outsystems/copyConfig.js` passes *(replaces the `npm run lint` gate, which
      cannot pass — see KD4)*
- [ ] Resolver returns the expected candidate for all five cases in Test Strategy, run against a real
      fixture tree
- [ ] No whole-file reformatting: the file already fails `prettier --check` before the change, so the
      diff must stay confined to the lines that implement the fix
- [ ] Only `scripts/Outsystems/copyConfig.js` modified: `git diff --name-only` shows one file

---

### Phase 2 — Approach B: deterministic fallback (upstream-owned, only if Phase 3 fails)

**Objective**: if the MABS multi-prepare assumption does not hold, move the resolution into the
upstream read path where ordering is guaranteed.
**Prerequisite**: Task 3.1 failed. **Do not implement pre-emptively.**

- [ ] **Task 2.1**: Add the resolver to `InstrumentUtil.setBuildProperties`
  - **Files**: `scripts/utils/InstrumentUtil.js` (modify)
  - **Pattern**: `scripts/helpers/PathHelper.js:58-70`
  - **Acceptance**: line 32 becomes `buildProperties.pathToConfig = resolveConfigFilePath();`, preferring
    `getAndroidAssetsPath()/dynatraceConfig/dynatrace.config.js`, then the iOS assets equivalent, then
    `getConfigFilePath()`. The `--config` override on line 33 still wins. **`PathHelper.getConfigFilePath()`
    itself must not change** — `ConfigurationUtil.checkConfiguration()` uses it to *create* the file.
  - **Verify**: MABS log line 449 equivalent ends in `assets/www/dynatraceConfig/dynatrace.config.js`
  - **Depends**: 1.2 (reuse the same ordering)
  - **Complexity**: M

- [ ] **Task 2.2**: Record the edit in the upstream-update procedure
  - **Files**: `CONTRIBUTING.md` (modify)
  - **Pattern**: existing hand-applied steps at `CONTRIBUTING.md:177-206`
  - **Acceptance**: a new numbered step under "Updating the Plugin Wrapper", placed **before** the
    wholesale copy at line 209, stating the `InstrumentUtil.js` edit must be re-applied, why, and that
    forgetting it fails **silently**
  - **Verify**: `grep -n "InstrumentUtil" CONTRIBUTING.md` returns a match
  - **Depends**: 2.1
  - **Complexity**: S

**Phase 2 Checkpoint**
- [ ] `PathHelper.js` untouched — `git diff --name-only` does not list it
- [ ] `CONTRIBUTING.md` carry-forward step present and explicit about silent failure
- [ ] KD1's trade-off re-confirmed with the team before merging

---

### Phase 3 — Verification against real MABS builds

**Objective**: prove each AC with build evidence, not inspection.
**Prerequisite**: Phase 1 complete and the branch reachable by MABS.

To let MABS consume the branch, point the app's extensibility config at it — supported per
`using_cordova_plugins`, which recommends a fork or tagged ref:

```json
{ "plugin": { "url": "https://github.com/OutSystems/dynatrace-cordova-plugin#feature/rdv-1832/ModifyDynatraceconfigRead" } }
```

Note the same doc's warning: an untagged ref means two builds may differ. Tag before any comparison
that matters.

- [ ] **Task 3.1**: Build **with** an override declared → AC1, AC4
  - **Files**: none (build + log analysis)
  - **Acceptance**: log shows the platform folder as config source; the generated Gradle block carries
    the override's `applicationId`/`beaconUrl`, not the module's
  - **Verify**: `grep -n "config source\|Trying to read configuration file\|applicationId" <log>`
  - **Depends**: Phase 1
  - **Complexity**: M

- [ ] **Task 3.2**: Build **without** an override → AC2
  - **Acceptance**: log shows the `www/dynatraceConfig` fallback; resulting config identical to a
    pre-change build of the same app
  - **Verify**: diff the Gradle block against a baseline build's log
  - **Depends**: 3.1
  - **Complexity**: S

- [ ] **Task 3.3**: Build an app with the plugin but **no** `www/dynatraceConfig` → AC3
  - **Acceptance**: no `ENOENT`; build completes; log states no config source was found
  - **Verify**: `grep -c "ENOENT" <log>` returns `0`
  - **Depends**: 3.1
  - **Complexity**: S

- [ ] **Task 3.4**: Confirm iOS is unchanged → AC5
  - **Acceptance**: iOS lines match a pre-change build (currently
    `iOS Location doesn't exist - Skip iOS instrumentation and configuration.`)
  - **Verify**: `grep -n "iOS" <log>` compared against baseline
  - **Depends**: 3.1
  - **Complexity**: S

- [ ] **Task 3.5**: Runtime confirmation in Dynatrace
  - **Acceptance**: the app reports into the Dynatrace **mobile** application named by the override,
    not the baked-in one
  - **Verify**: session appears under the expected application in the Dynatrace UI
  - **Depends**: 3.1
  - **Complexity**: M

**Phase 3 Checkpoint**
- [ ] AC1-AC5 each backed by a named log file and line numbers
- [ ] The LifeTime "Custom" override confound explicitly ruled out for the tested build
- [ ] Any AC that cannot be evidenced is reported as unverified, not assumed

---

### Phase 4 — Durability and documentation

**Objective**: make sure the fix outlives the next Dynatrace version bump.
**Prerequisite**: Phase 3 green.

- [ ] **Task 4.1**: Dry-run the upstream update procedure → AC6
  - **Files**: none (procedure walkthrough)
  - **Pattern**: `CONTRIBUTING.md:164-210`
  - **Acceptance**: after simulating the wholesale copy at line 209, the Phase 1 change is still present
    (it lives under `scripts/Outsystems/`, copied forward by the step at line 174)
  - **Verify**: confirm `git status` shows no loss of the `copyConfig.js` change after the simulated copy
  - **Depends**: Phase 3
  - **Complexity**: S

- [ ] **Task 4.2**: Update `ARCHITECTURE.md` T5 evidence
  - **Files**: `ARCHITECTURE.md` (modify)
  - **Acceptance**: T5's `copyConfig.js` bullet (line 98) reflects that the source is now the platform
    folder when an extensibility override is present
  - **Verify**: `grep -n "dynatraceConfig" ARCHITECTURE.md`
  - **Depends**: 4.1
  - **Complexity**: S

- [ ] **Task 4.3**: Record the findings on RDV-1832
  - **Files**: none (JIRA comment)
  - **Acceptance**: comment states what worked, the Android-only limitation, the iOS gap, and the
    plugin-variables fallback — satisfying the Epic's "discovery" Outcome
  - **Verify**: comment visible on RDV-1832
  - **Depends**: 4.1
  - **Complexity**: S

**Phase 4 Checkpoint**
- [ ] Update procedure verified to preserve the change
- [ ] Architecture doc consistent with the code
- [ ] RDV-1832 carries the discovery outcome

---

## Test Strategy

**Current state: the repository has no tests and no working test command.** Corrected 2026-09-04 after
actually installing and running the toolchain. `jest`, `ts-jest` and `jest-junit` are devDependencies,
and package.json:91 holds a `jest-junit` **reporter-output** block — but there is **no `jest` config key
at all**, no `test` script (only `test:debug`), no `tests/` directory, and not one `*.spec.js` /
`*.test.js` file. `npm test` exits with `Missing script: "test"`.

So Jest is vendored but not wired up. Running a test requires supplying config explicitly, e.g.
`npx jest --config <path>` or adding a `jest` block. Any test added here establishes the repo's first
pattern — a decision for the team (KD4), not a given. See KD4 for the full tooling breakdown.

### Unit tests (recommended, optional)

`resolveConfigSource()` is pure apart from `fs.existsSync`, so it is cheap to test:

| Case                                    | Expected                                          |
|-----------------------------------------|---------------------------------------------------|
| Platform `app/src/main/assets` path only| returns that path, `isPlatform: true`             |
| Legacy platform `assets` path only      | returns that path, `isPlatform: true`             |
| Both platform paths present             | returns `app/src/main/assets` (first candidate)    |
| Only `www/dynatraceConfig`              | returns it, `isPlatform: false` (today's behaviour)|
| Nothing present                         | returns `undefined`, caller logs and resolves      |

Requires exporting the function for test access. For the filesystem, **use `mock-fs` — already a
devDependency at package.json:66 (`^5.5.0`, with `@types/mock-fs` at :51)** — rather than
`jest.mock('fs')`. It builds a real in-memory tree, so the candidate chain is exercised against actual
path resolution instead of an assertion about which mock got called. No new dependency needed.

Suggested location `spec/Outsystems/copyConfig.spec.js`, matching the `scripts/Outsystems/` layout.
Because no `jest` config exists, running it needs an explicit config (`npx jest --config …`) or a new
`jest` block plus a `test` script — which is the tooling question raised in KD4(b).

**Cheapest path that needs no Jest wiring at all**: because the resolver is pure apart from
`fs.existsSync`, a plain `node` script that builds a temp directory tree with `fs.mkdirSync` and asserts
with `node:assert` verifies all five cases today, with zero config. Worth doing regardless of KD4, since
it is the only executable check available before a MABS build.

### Integration / E2E

None possible locally — the behaviour only manifests inside MABS, which owns the filesystem layout and
the prepare cycles. **Phase 3 is the integration test**, and its evidence is MABS log lines.

### Regression risk

Low but non-zero, and concentrated in one place: if the fallback chain is ever reordered so a platform
candidate is checked *after* `www/dynatraceConfig`, the fix becomes a no-op while still appearing to
work. Task 1.3's log line is the guard against that.

---

## Risks

| ID | Risk                                                                                              | Likelihood | Impact | Mitigation                                                        |
|----|---------------------------------------------------------------------------------------------------|-----------:|--------|-------------------------------------------------------------------|
| R1 | MABS runs `prepare` only once for some build type, so no override exists when `copyConfig.js` runs | Low        | High   | Fallback keeps current behaviour; Task 1.3 log makes it obvious; Phase 2 is the deterministic answer |
| R2 | MABS changes when it applies extensibility resources                                              | Low        | High   | Task 1.3 log line surfaces it in the first affected build          |
| R3 | **iOS has no reachable path** — plugin reads `platforms/ios/www`, override lands in `platforms/ios/<app>/Resources`; `../..` is refused with `OS-MABS-CNF-40011` | Certain | Medium | Out of scope; fallback keeps iOS unchanged; escalate via KD2       |
| R4 | Approach B's edit is silently erased by the next version bump                                     | Medium     | High   | Prefer Approach A; if B ships, Task 2.2 documents it              |
| R5 | **Repo has no working lint or test command** — `npm test`, `npm run lint`, `npm run prettier:check` and `npx eslint` all fail regardless of toolchain (KD4). Husky's pre-commit hook is absent, so nothing is enforced on commit either. A regression can reach `main` with no automated gate. | Certain | Medium | `node --check` + a fixture-tree run of the resolver + MABS build as the real gate; raise tooling repair as a separate ticket |
| R6 | Stale platform copy read from an earlier prepare cycle                                            | Low        | Low    | Content cannot change mid-build; log line records the exact path   |
| R7 | `npm install` produces untracked `node_modules/` (664 packages) and `package-lock.json`, neither of which `.gitignore` covered — risk of committing them | Was certain | Medium | **Done**: `node_modules/`, `.eslintcache`, `junit.xml` added to `.gitignore`. `package-lock.json` deliberately left visible — committing a lockfile is a repo-wide decision (see Open Questions) |
| R8 | `prettier --write` on `copyConfig.js` would reformat the whole file, since it already fails `prettier --check` unmodified — hiding a 3-line change in formatting noise | Medium | Medium | Never run `prettier --write` on this file; hand-match surrounding style; Phase 1 checkpoint asserts a minimal diff |

---

## Open Questions

1. **KD2** — is an Android-only per-environment switch acceptable for RDV-1832, or should the
   plugin-variables approach (works on both platforms) be the target instead?
2. **KD1** — does the team accept Approach A's dependency on observed MABS behaviour in exchange for
   T5 compliance and zero maintenance, or is Approach B's determinism worth violating T5?
3. **KD3** — should this branch stay a spike, or be prepared for release (version bumps in
   `package.json` + `plugin.xml`, tag, Forge publish)?
4. **KD4(a)** — establish the repo's first Jest test, or verify by a fixture-tree `node` script plus the
   MABS build only?
5. **KD4(b)** — does repairing the repo's quality tooling (a `test` script, an `eslint.config.mjs`, a
   `.husky/pre-commit`, prettier/lint scripts pointing at real directories) belong in RDV-1832 or a
   separate ticket? **Recommendation: separate ticket** — unrelated scope, touches release config.
6. Should `package-lock.json` be committed? The repo has never had one and upstream Dynatrace does not
   ship one, so `npm install` just produced the first. Left untracked and unignored pending a decision;
   it is a repo-wide dependency-management choice, not this ticket's call.
7. Are CLAUDE.md and CONTRIBUTING.md worth correcting? Beyond the broken commands in KD4, CONTRIBUTING:9
   states Node >= 18 where `engines` says >= 20, CONTRIBUTING:109 claims ESLint config is "embedded in
   package.json" when no such key exists, and CLAUDE.md:7 says the wrapped upstream is 2.309.1 where
   `package.json:3` reads 2.335.1. Suggest folding into the KD4(b) ticket.
8. Does the `TestDynatraceWithExtConfig2` module Resource hold Dev or Test values? Needed to rule out
   the LifeTime "Custom" masking confound in Task 3.1.
9. Who owns the iOS gap (R3) — this team, or an OutSystems platform request to allow a resource target
   that the plugin can actually read?

---

## References

- JIRA: [RDV-1832](https://outsystemsrd.atlassian.net/browse/RDV-1832) — Epic, `Discovery`
- `ARCHITECTURE.md` — tenets T1, T3, T5
- `CLAUDE.md` — "Core Dynatrace functionality lives in the upstream package - do not modify"
- `CONTRIBUTING.md:160-210` — upstream update procedure
- MABS logs: `TestDynatraceWithExtConfig2_3_0.1.log` (ordering proof),
  `TestDynatraceAppWithExtConfig4_1_0.1.log` (ENOENT),
  `TestDynatraceAppWithExtCofig3_1_0.1.log` (`OS-MABS-CNF-40011`)
- OutSystems docs: `extensibility_configurations_json_schema`,
  `using_cordova_plugins`, `override_the_default_mobile_extensibility_configurations`
