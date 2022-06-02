"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationReader = void 0;
var ConfigurationDefaults_1 = require("./ConfigurationDefaults");
var downloadAgent_1 = require("../downloadAgent");
var CordovaPluginConfigurationBuilder_1 = require("./cordova/CordovaPluginConfigurationBuilder");
var MobileAgentConfiguration_1 = require("./mobile/MobileAgentConfiguration");
var JavaScriptAgentConfigurationBuilder_1 = require("./javascript/JavaScriptAgentConfigurationBuilder");
var ConfigurationBuilder_1 = require("./ConfigurationBuilder");
var ConfigurationReader = (function () {
    function ConfigurationReader() {
    }
    ConfigurationReader.prototype.readConfiguration = function (pathToConfiguration) {
        var readConfig;
        try {
            readConfig = require(pathToConfiguration);
        }
        catch (e) {
            throw new downloadAgent_1.StopBuildError(ConfigurationDefaults_1.ERROR_CONFIG_NOT_AVAILABLE);
        }
        if (readConfig === undefined) {
            throw new downloadAgent_1.StopBuildError(ConfigurationDefaults_1.ERROR_CONFIG_NOT_AVAILABLE);
        }
        return this.parseConfiguration(readConfig);
    };
    ConfigurationReader.prototype.parseConfiguration = function (rawConfiguration) {
        var configurationBuilder = new ConfigurationBuilder_1.ConfigurationBuilder(this.parseCordovaConfiguration(rawConfiguration));
        configurationBuilder.setAndroidAgentConfiguration(this.parseAndroidConfiguration(rawConfiguration));
        configurationBuilder.setIosAgentConfiguration(this.parseIosConfiguration(rawConfiguration));
        configurationBuilder.setJavaScriptAgentConfiguration(this.parseJavaScriptConfiguration(rawConfiguration));
        return configurationBuilder.build();
    };
    ConfigurationReader.prototype.parseCordovaConfiguration = function (rawConfig) {
        var cordovaConfigurationBuilder = new CordovaPluginConfigurationBuilder_1.CordovaPluginConfigurationBuilder();
        if (rawConfig.cordova != undefined) {
            cordovaConfigurationBuilder.setDebugMode(Boolean(rawConfig.cordova.debug));
            cordovaConfigurationBuilder.setCSPUrl(rawConfig.cordova.cspURL);
            cordovaConfigurationBuilder.setCookieProxy(Boolean(rawConfig.cordova.cookieProxy));
        }
        return cordovaConfigurationBuilder.build();
    };
    ConfigurationReader.prototype.parseAndroidConfiguration = function (rawConfig) {
        if (rawConfig.android && rawConfig.android.config) {
            return new MobileAgentConfiguration_1.MobileAgentConfiguration(rawConfig.android.config);
        }
        return new MobileAgentConfiguration_1.MobileAgentConfiguration(undefined);
    };
    ConfigurationReader.prototype.parseIosConfiguration = function (rawConfig) {
        if (rawConfig.ios && rawConfig.ios.config) {
            return new MobileAgentConfiguration_1.MobileAgentConfiguration(rawConfig.ios.config);
        }
        return new MobileAgentConfiguration_1.MobileAgentConfiguration(undefined);
    };
    ConfigurationReader.prototype.parseJavaScriptConfiguration = function (rawConfig) {
        if (rawConfig.js && rawConfig.js.url) {
            var javascriptConfigurationBuilder = new JavaScriptAgentConfigurationBuilder_1.JavaScriptAgentConfigurationBuilder(rawConfig.js.url);
            javascriptConfigurationBuilder.setAgentMode(rawConfig.js.mode);
            javascriptConfigurationBuilder.setAnyCertificateAllowed(Boolean(rawConfig.js.allowanycert));
            return javascriptConfigurationBuilder.build();
        }
        return undefined;
    };
    return ConfigurationReader;
}());
exports.ConfigurationReader = ConfigurationReader;
