"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instrument = exports.parseCommandLine = exports.CONFIG_JSAGENT_FILE = exports.CONFIG_FILE = exports.CONFIG_PLIST_FILE = exports.CONFIG_GRADLE_FILE = void 0;
var path_1 = require("path");
var Android_1 = require("../Android");
var ConfigurationReader_1 = require("../config/ConfigurationReader");
var DownloadAgent_1 = require("../DownloadAgent");
var HtmlUtil_1 = require("../html/HtmlUtil");
var HtmlInstrumentation_1 = require("../html/HtmlInstrumentation");
var InstrumentUtil_1 = require("../utils/InstrumentUtil");
var Ios_1 = require("../Ios");
var Logger_1 = require("../logger/Logger");
var UpdateSecurity_1 = require("../UpdateSecurity");
var LoggerType_1 = require("../logger/LoggerType");
var PluginUtil_1 = require("../utils/PluginUtil");
var InstallHelper_1 = require("./InstallHelper");
var PathHelper_1 = require("./PathHelper");
var FileHelper_1 = require("./FileHelper");
var instrumentHelper = require("./InstrumentHelper");
exports.CONFIG_GRADLE_FILE = '--gradle';
exports.CONFIG_PLIST_FILE = '--plist';
exports.CONFIG_FILE = '--config';
exports.CONFIG_JSAGENT_FILE = '--jsagent';
var parseCommandLine = function (inputArgs) {
    var parsedArgs = {};
    inputArgs.forEach(function (entry) {
        var parts = entry.split('=');
        if (parts.length === 2) {
            switch (parts[0]) {
                case exports.CONFIG_GRADLE_FILE:
                    parsedArgs.gradle = parts[1];
                    break;
                case exports.CONFIG_FILE:
                    parsedArgs.config = parts[1];
                    break;
                case exports.CONFIG_PLIST_FILE:
                    parsedArgs.plist = parts[1];
                    break;
                case exports.CONFIG_JSAGENT_FILE:
                    parsedArgs.jsagent = parts[1];
                    break;
            }
        }
    });
    return parsedArgs;
};
exports.parseCommandLine = parseCommandLine;
var instrument = function (process) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, cliBuildArgs, jsagentContent, configJson, buildProperties, htmlFiles, htmlInstrumentation, _b, e_1, htmlInstrumentation, _c, e_2, e_3;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                Logger_1.Logger.getInstance().logInfo('Starting Configuration of application ..');
                _a = PluginUtil_1.logPluginVersion;
                return [4, (0, InstallHelper_1.parsedPluginPackageJson)()];
            case 1:
                _a.apply(void 0, [_d.sent()]);
                cliBuildArgs = (0, InstrumentUtil_1.setCliBuildArgs)(process);
                buildProperties = (0, InstrumentUtil_1.setBuildProperties)(instrumentHelper.parseCommandLine(process.argv.slice(2)));
                if (!((buildProperties.iosAvailable === true) || (buildProperties.androidAvailable === true))) return [3, 26];
                if (buildProperties.isCapacitor === false) {
                    (0, HtmlUtil_1.removeOldDtAgent)((0, PathHelper_1.getDownloadJSAgentPath)());
                }
                _d.label = 2;
            case 2:
                _d.trys.push([2, 24, , 25]);
                Logger_1.Logger.getInstance().logInfo('Trying to read configuration file: ' + buildProperties.pathToConfig);
                if (!(buildProperties.pathToConfig !== undefined)) return [3, 23];
                configJson = new ConfigurationReader_1.ConfigurationReader().readConfiguration(buildProperties.pathToConfig);
                Logger_1.Logger.setType(LoggerType_1.LoggerType.FileLogger, configJson.getCordovaPluginConfiguration().isDebugEnabled());
                if (!(buildProperties.pathToJsAgent !== undefined)) return [3, 4];
                Logger_1.Logger.getInstance().logInfo('Checking if JSAgent file exists at custom path ..');
                return [4, (0, FileHelper_1.readTextFromFile)(buildProperties.pathToJsAgent)];
            case 3:
                jsagentContent = _d.sent();
                return [3, 6];
            case 4: return [4, (0, DownloadAgent_1.downloadAgent)(configJson)];
            case 5:
                jsagentContent = _d.sent();
                _d.label = 6;
            case 6:
                htmlFiles = [];
                if (configJson.getJavaScriptAgentConfiguration() !== undefined) {
                    htmlFiles = configJson.getJavaScriptAgentConfiguration().getHtmlFiles();
                }
                if (!((buildProperties.androidAvailable === true) &&
                    ((cliBuildArgs.android === true) || cliBuildArgs.capacitor === 'android'))) return [3, 14];
                _d.label = 7;
            case 7:
                _d.trys.push([7, 12, 13, 14]);
                Logger_1.Logger.getInstance().logInfo('Starting Android Configuration with Dynatrace!');
                if (buildProperties.pathToGradle != null) {
                    (0, Android_1.instrumentAndroidPlatform)(buildProperties.pathToGradle, false);
                }
                (0, Android_1.writeGradleConfig)(configJson.getAndroidConfiguration());
                buildProperties.androidAssetPath = (buildProperties.isCapacitor === true) ?
                    (0, PathHelper_1.getAndroidAssetsPathCapacitor)() : (0, PathHelper_1.getAndroidAssetsPath)();
                if ((buildProperties.isCapacitor === false) && buildProperties.androidAssetPath) {
                    (0, HtmlUtil_1.removeOldDtAgent)((0, path_1.join)(buildProperties.androidAssetPath, 'assets', 'dtAgent.js'));
                }
                if (!(jsagentContent === undefined)) return [3, 8];
                Logger_1.Logger.getInstance()
                    .logWarning('Not instrumenting HTML files since there is no available JSAgent to inject!');
                return [3, 11];
            case 8:
                htmlInstrumentation = new HtmlInstrumentation_1.HTMLInstrumentation(buildProperties.androidAssetPath, jsagentContent, configJson.getCordovaPluginConfiguration().isCookieProxyEnabled(), htmlFiles);
                _b = UpdateSecurity_1.updateSecurity;
                return [4, htmlInstrumentation.instrument()];
            case 9: return [4, _b.apply(void 0, [_d.sent(), configJson])];
            case 10:
                _d.sent();
                _d.label = 11;
            case 11: return [3, 14];
            case 12:
                e_1 = _d.sent();
                if (e_1 instanceof Error) {
                    Logger_1.Logger.getInstance().logError(e_1.message);
                }
                return [3, 14];
            case 13:
                Logger_1.Logger.getInstance().logInfo('Finished Android Configuration with Dynatrace!');
                return [7];
            case 14:
                if (!((buildProperties.iosAvailable === true) && ((cliBuildArgs.ios === true) || cliBuildArgs.capacitor === 'ios'))) return [3, 23];
                _d.label = 15;
            case 15:
                _d.trys.push([15, 21, 22, 23]);
                Logger_1.Logger.getInstance().logInfo('Starting iOS Configuration with Dynatrace!');
                return [4, (0, Ios_1.modifyPListFile)(buildProperties.pathToPList, configJson.getIosConfiguration(), false)];
            case 16:
                _d.sent();
                buildProperties.iosAssetsPath = (0, PathHelper_1.getIOSAssetsPath)();
                if ((buildProperties.isCapacitor === false) && buildProperties.iosAssetsPath !== undefined) {
                    (0, HtmlUtil_1.removeOldDtAgent)((0, path_1.join)(buildProperties.iosAssetsPath, 'assets', 'dtAgent.js'));
                }
                if (!(jsagentContent === undefined)) return [3, 17];
                Logger_1.Logger.getInstance().
                    logWarning('Not instrumenting HTML files since there is no available JSAgent to inject!');
                return [3, 20];
            case 17:
                if (!(buildProperties.iosAssetsPath !== undefined)) return [3, 20];
                htmlInstrumentation = new HtmlInstrumentation_1.HTMLInstrumentation(buildProperties.iosAssetsPath, jsagentContent, configJson.getCordovaPluginConfiguration().isCookieProxyEnabled(), htmlFiles);
                _c = UpdateSecurity_1.updateSecurity;
                return [4, htmlInstrumentation.instrument()];
            case 18: return [4, _c.apply(void 0, [_d.sent(), configJson])];
            case 19:
                _d.sent();
                _d.label = 20;
            case 20: return [3, 23];
            case 21:
                e_2 = _d.sent();
                if (e_2 instanceof Error) {
                    Logger_1.Logger.getInstance().logError(e_2.message);
                }
                return [3, 23];
            case 22:
                Logger_1.Logger.getInstance().logInfo('Finished iOS Configuration with Dynatrace!');
                return [7];
            case 23: return [3, 25];
            case 24:
                e_3 = _d.sent();
                if (e_3 instanceof Error) {
                    Logger_1.Logger.getInstance().logError(e_3.message);
                }
                if (e_3 instanceof DownloadAgent_1.StopBuildError) {
                    throw e_3;
                }
                return [3, 25];
            case 25: return [3, 27];
            case 26:
                Logger_1.Logger.getInstance().logWarning('Both Android and iOS Folder are not available - Skip Configuration.');
                _d.label = 27;
            case 27:
                Logger_1.Logger.getInstance().logInfo('Finished Configuration of Cordova application ..');
                Logger_1.Logger.getInstance().closeLogger();
                return [2];
        }
    });
}); };
exports.instrument = instrument;
