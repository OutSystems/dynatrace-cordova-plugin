"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptAgentConfiguration = void 0;
var JavaScriptAgentMode_1 = require("./JavaScriptAgentMode");
var JavaScriptAgentConfiguration = (function () {
    function JavaScriptAgentConfiguration(agentUrl, agentMode, allowAnyCertificate) {
        this.agentUrl = agentUrl.replace(JavaScriptAgentMode_1.JAVA_SCRIPT_AGENT_MODE_NAMES[0], JavaScriptAgentMode_1.JAVA_SCRIPT_AGENT_MODE_NAMES[agentMode]);
        this.agentMode = agentMode;
        this.allowAnyCertificate = allowAnyCertificate;
    }
    JavaScriptAgentConfiguration.prototype.getAgentUrl = function () {
        return this.agentUrl;
    };
    JavaScriptAgentConfiguration.prototype.getMode = function () {
        return this.agentMode;
    };
    JavaScriptAgentConfiguration.prototype.isAnyCertificateAllowed = function () {
        return this.allowAnyCertificate;
    };
    JavaScriptAgentConfiguration.prototype.isAgentUrlValid = function () {
        if (this.agentUrl == undefined || this.agentUrl.length == 0) {
            return false;
        }
        for (var i = 0; i < JavaScriptAgentMode_1.JAVA_SCRIPT_AGENT_MODE_NAMES.length; i++) {
            if (this.agentUrl.indexOf(JavaScriptAgentMode_1.JAVA_SCRIPT_AGENT_MODE_NAMES[i]) >= 0) {
                return true;
            }
        }
        return false;
    };
    return JavaScriptAgentConfiguration;
}());
exports.JavaScriptAgentConfiguration = JavaScriptAgentConfiguration;
