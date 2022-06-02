"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CordovaPluginConfiguration = void 0;
var CordovaPluginConfiguration = (function () {
    function CordovaPluginConfiguration(debugEnabled, cookieProxy, cspUrl) {
        this.debugEnabled = debugEnabled;
        this.cookieProxy = cookieProxy;
        this.cspUrl = cspUrl;
    }
    CordovaPluginConfiguration.prototype.isDebugEnabled = function () {
        return this.debugEnabled;
    };
    CordovaPluginConfiguration.prototype.isCSPUrlAvailable = function () {
        return this.cspUrl != undefined;
    };
    CordovaPluginConfiguration.prototype.getCSPUrl = function () {
        return this.cspUrl;
    };
    CordovaPluginConfiguration.prototype.isCookieProxyEnabled = function () {
        return this.cookieProxy;
    };
    return CordovaPluginConfiguration;
}());
exports.CordovaPluginConfiguration = CordovaPluginConfiguration;
