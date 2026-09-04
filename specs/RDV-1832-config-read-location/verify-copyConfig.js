/*
 * Verification harness for scripts/Outsystems/copyConfig.js (RDV-1832).
 *
 * Runs the real before_prepare hook against real temporary directory trees and asserts which
 * dynatraceConfig folder it copies into the project root. No Jest wiring is required, because the
 * repository has no working `npm test` script (see plan.md, KD4).
 *
 *   node specs/RDV-1832-config-read-location/verify-copyConfig.js
 *
 * `q` is stubbed: copyConfig.js requires it when Cordova >= 8, but it is not a dependency of this
 * package - inside MABS it resolves because Cordova provides it.
 */

'use strict';

var assert = require('assert');
var fs = require('fs');
var os = require('os');
var path = require('path');
var Module = require('module');

var HOOK = path.resolve(__dirname, '../../scripts/Outsystems/copyConfig.js');

var FILE_CONFIG = 'dynatrace.config.js';
var PLATFORM_MODERN = ['platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'dynatraceConfig'];
var PLATFORM_LEGACY = ['platforms', 'android', 'assets', 'www', 'dynatraceConfig'];
var MODULE_WWW = ['www', 'dynatraceConfig'];

// --- stub `q` so the hook can be required outside a Cordova install -------------------------
var realLoad = Module._load;
Module._load = function (request, parent, isMain) {
    if (request === 'q') {
        return { defer: function () {
            var d = { promise: null, resolve: null, reject: null };
            d.promise = new Promise(function (res, rej) { d.resolve = res; d.reject = rej; });
            return d;
        } };
    }
    return realLoad.apply(this, arguments);
};

// --- helpers -------------------------------------------------------------------------------
function seed (root, segments, contents) {
    var dir = path.join.apply(path, [root].concat(segments));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, FILE_CONFIG), contents);
}

function runHook (projectRoot) {
    delete require.cache[HOOK];
    var logs = [];
    var realLog = console.log;
    console.log = function () { logs.push(Array.prototype.join.call(arguments, ' ')); };
    try {
        var promise = require(HOOK)({
            opts: { projectRoot: projectRoot, cordova: { version: '12.0.0' } }
        });
        return { promise: promise, logs: logs };
    } finally {
        console.log = realLog;
    }
}

function rootConfig (projectRoot) {
    var p = path.join(projectRoot, FILE_CONFIG);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : undefined;
}

// --- cases ---------------------------------------------------------------------------------
var CASES = [
    {
        name: 'platform override present -> platform copy wins over module www',
        seed: function (r) {
            seed(r, MODULE_WWW, 'BAKED_IN');
            seed(r, PLATFORM_MODERN, 'ENV_SPECIFIC');
        },
        expect: 'ENV_SPECIFIC',
        expectPlatform: true
    },
    {
        name: 'legacy platform layout only -> legacy platform copy used',
        seed: function (r) {
            seed(r, MODULE_WWW, 'BAKED_IN');
            seed(r, PLATFORM_LEGACY, 'ENV_SPECIFIC_LEGACY');
        },
        expect: 'ENV_SPECIFIC_LEGACY',
        expectPlatform: true
    },
    {
        name: 'both platform layouts present -> modern layout takes precedence',
        seed: function (r) {
            seed(r, MODULE_WWW, 'BAKED_IN');
            seed(r, PLATFORM_LEGACY, 'LEGACY');
            seed(r, PLATFORM_MODERN, 'MODERN');
        },
        expect: 'MODERN',
        expectPlatform: true
    },
    {
        name: 'no platform folder (e.g. iOS-only build) -> unchanged behaviour, module www used',
        seed: function (r) { seed(r, MODULE_WWW, 'BAKED_IN'); },
        expect: 'BAKED_IN',
        expectPlatform: false
    },
    {
        name: 'regression: no dynatraceConfig anywhere -> resolves instead of throwing ENOENT',
        seed: function (r) { fs.mkdirSync(path.join(r, 'www'), { recursive: true }); },
        expect: undefined,
        expectPlatform: null
    }
];

// --- run -----------------------------------------------------------------------------------
(async function main () {
    var failures = 0;

    for (var i = 0; i < CASES.length; i++) {
        var testCase = CASES[i];
        // Arrange
        var projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rdv1832-'));
        testCase.seed(projectRoot);

        try {
            // Act
            var result = runHook(projectRoot);
            await result.promise;

            // Assert
            assert.strictEqual(rootConfig(projectRoot), testCase.expect,
                'config copied into project root');

            var sourceLog = result.logs.filter(function (l) {
                return l.indexOf('[Dynatrace][OutSystems] config source:') === 0;
            });

            if (testCase.expectPlatform === null) {
                assert.strictEqual(sourceLog.length, 0, 'no config-source line when nothing resolved');
                assert.ok(result.logs.some(function (l) {
                    return l.indexOf('Failed to handle plugin resources') !== -1;
                }), 'logs a failure line');
            } else {
                assert.strictEqual(sourceLog.length, 1, 'exactly one config-source line per build');
                assert.ok(sourceLog[0].indexOf(
                    testCase.expectPlatform ? 'platform override' : 'module www') !== -1,
                    'log names the correct origin');
            }

            console.log('  PASS  ' + testCase.name);
        } catch (e) {
            failures++;
            console.log('  FAIL  ' + testCase.name);
            console.log('        ' + (e && e.message ? e.message : e));
        } finally {
            fs.rmSync(projectRoot, { recursive: true, force: true });
        }
    }

    console.log('\n' + (CASES.length - failures) + '/' + CASES.length + ' passed');
    process.exit(failures === 0 ? 0 : 1);
})();
