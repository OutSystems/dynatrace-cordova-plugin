"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNumberToMode = exports.JAVA_SCRIPT_AGENT_MODE_NAMES = exports.DEFAULT_JAVASCRIPT_AGENT_MODE = exports.JavaScriptAgentMode = void 0;
var JavaScriptAgentMode;
(function (JavaScriptAgentMode) {
    JavaScriptAgentMode[JavaScriptAgentMode["JS_INLINE_SCRIPT"] = 0] = "JS_INLINE_SCRIPT";
    JavaScriptAgentMode[JavaScriptAgentMode["JS_TAG_COMPLETE"] = 1] = "JS_TAG_COMPLETE";
    JavaScriptAgentMode[JavaScriptAgentMode["SYNC_CS"] = 2] = "SYNC_CS";
    JavaScriptAgentMode[JavaScriptAgentMode["ASYNC_CS"] = 3] = "ASYNC_CS";
    JavaScriptAgentMode[JavaScriptAgentMode["JS_TAG"] = 4] = "JS_TAG";
})(JavaScriptAgentMode = exports.JavaScriptAgentMode || (exports.JavaScriptAgentMode = {}));
exports.DEFAULT_JAVASCRIPT_AGENT_MODE = JavaScriptAgentMode.SYNC_CS;
exports.JAVA_SCRIPT_AGENT_MODE_NAMES = ['jsInlineScript', 'jsTagComplete', 'syncCS', 'asyncCS', 'jsTag'];
function parseNumberToMode(mode) {
    switch (mode) {
        case 0:
            return JavaScriptAgentMode.JS_INLINE_SCRIPT;
        case 1:
            return JavaScriptAgentMode.JS_TAG_COMPLETE;
        case 2:
            return JavaScriptAgentMode.SYNC_CS;
        case 3:
            return JavaScriptAgentMode.ASYNC_CS;
        case 4:
            return JavaScriptAgentMode.JS_TAG;
        default:
            return exports.DEFAULT_JAVASCRIPT_AGENT_MODE;
    }
}
exports.parseNumberToMode = parseNumberToMode;
