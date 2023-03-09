"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logPluginVersion = void 0;
var Logger_1 = require("../logger/Logger");
var logPluginVersion = function (packageJson) {
    if (packageJson !== undefined && packageJson.version !== undefined) {
        Logger_1.Logger.getInstance().logInfo('Dynatrace Cordova Plugin - Version ' + packageJson.version);
    }
    else {
        Logger_1.Logger.getInstance().logWarning('Dynatrace Cordova Plugin - Version NOT READABLE');
    }
};
exports.logPluginVersion = logPluginVersion;
