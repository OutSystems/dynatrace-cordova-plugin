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
exports.isCapacitorApp = exports.getCapacitorConfig = exports.getCapCliPackage = exports.getIosAssetsPathCapacitor = exports.getAndroidAssetsPathCapacitor = exports.getIosPlistPathCapacitor = exports.getAndroidPathCapacitor = exports.getIosPathCapacitor = exports.getDynatracePluginGradleFile = exports.getDynatraceGradleFile = exports.getLogPath = exports.getCurrentLogPath = exports.getCookieProxyPath = exports.getSwallowApiPath = exports.getDownloadJSAgentPath = exports.getIOSAssetsPath = exports.getAndroidAssetsPath = exports.getConfigFilePath = exports.getDefaultConfig = exports.getAndroidGradleVersion = exports.dynatraceConfigExists = exports.isIonic = exports.getIonicConfig = exports.getDoctorLogPath = exports.getAndroidGradleFile = exports.getPluginPath = exports.getPluginPackage = exports.getAndroidPath = exports.getIosPath = exports.getApplicationPackage = exports.getApplicationPath = exports.setRoot = exports.FILE_COOKIE_PROXY = exports.FILE_SWALLOW_API = exports.FILE_JSAGENT = exports.FOLDER_ASSETS = void 0;
var path_1 = require("path");
var fs_1 = require("fs");
var FileHelper_1 = require("./FileHelper");
var FOLDER_PLATFORMS = 'platforms';
exports.FOLDER_ASSETS = 'assets';
var FOLDER_WWW = 'www';
var FOLDER_SCRIPTS = 'scripts';
var FOLDER_FILES = 'files';
var FOLDER_LOGS = 'logs';
var FOLDER_ANDROID_APP = 'app';
var FOLDER_NODE_MODULES = 'node_modules';
var FILE_PACKAGE = 'package.json';
var FILE_CONFIG = 'dynatrace.config.js';
var FILE_CURRENT_LOG = 'currentLog.txt';
exports.FILE_JSAGENT = 'dtAgent.js';
exports.FILE_SWALLOW_API = 'dtrum-swallow-api.js';
exports.FILE_COOKIE_PROXY = 'dt-cookie-proxy.js';
var rootPath = __dirname;
var setRoot = function (newRoot) {
    rootPath = (0, path_1.resolve)(newRoot);
};
exports.setRoot = setRoot;
var getPluginPath = function () { return (0, path_1.join)(rootPath, '..', '..'); };
exports.getPluginPath = getPluginPath;
var getDefaultConfig = function () { return (0, path_1.join)(getPluginPath(), FOLDER_FILES, 'default.config.js'); };
exports.getDefaultConfig = getDefaultConfig;
var getDynatraceGradleFile = function () { return (0, path_1.join)(getPluginPath(), FOLDER_FILES, 'dynatrace.gradle'); };
exports.getDynatraceGradleFile = getDynatraceGradleFile;
var getDynatracePluginGradleFile = function () { return (0, path_1.join)(getPluginPath(), FOLDER_FILES, 'plugin.gradle'); };
exports.getDynatracePluginGradleFile = getDynatracePluginGradleFile;
var getApplicationPath = function () {
    return isCapacitorApp() ? (0, path_1.join)(getPluginPath(), '..', '..', '..') : (0, path_1.join)(getPluginPath(), '..', '..');
};
exports.getApplicationPath = getApplicationPath;
var getPluginPackage = function () { return (0, path_1.join)(getPluginPath(), FILE_PACKAGE); };
exports.getPluginPackage = getPluginPackage;
var getApplicationPackage = function () { return (0, path_1.join)(getApplicationPath(), FILE_PACKAGE); };
exports.getApplicationPackage = getApplicationPackage;
var getCapCliPackage = function () { return (0, path_1.join)(getApplicationPath(), FOLDER_NODE_MODULES, "@capacitor", "cli", FILE_PACKAGE); };
exports.getCapCliPackage = getCapCliPackage;
var getIosPath = function () { return isCapacitorApp() ? getIosPathCapacitor() : (0, path_1.join)(getApplicationPath(), FOLDER_PLATFORMS, 'ios'); };
exports.getIosPath = getIosPath;
var getAndroidPath = function () { return (0, path_1.join)(getApplicationPath(), FOLDER_PLATFORMS, 'android'); };
exports.getAndroidPath = getAndroidPath;
var getAndroidGradleFile = function (androidFolder) { return (0, path_1.join)(androidFolder, 'build.gradle'); };
exports.getAndroidGradleFile = getAndroidGradleFile;
var getConfigFilePath = function () { return (0, path_1.join)(getApplicationPath(), FILE_CONFIG); };
exports.getConfigFilePath = getConfigFilePath;
var getAndroidAssetsPath = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!isCapacitorApp()) return [3, 2];
                return [4, (0, FileHelper_1.checkIfFileExists)((0, path_1.join)(getAndroidPathCapacitor(), FOLDER_ANDROID_APP, 'src', 'main', exports.FOLDER_ASSETS, 'public'))];
            case 1: return [2, _a.sent()];
            case 2: return [4, (0, FileHelper_1.checkIfFileExists)((0, path_1.join)(getAndroidPath(), exports.FOLDER_ASSETS, FOLDER_WWW))];
            case 3: return [2, _a.sent()];
            case 4: return [3, 6];
            case 5:
                e_1 = _a.sent();
                if (isCapacitorApp()) {
                    return [2, (0, path_1.join)(getAndroidPathCapacitor(), FOLDER_ANDROID_APP, 'src', 'main', exports.FOLDER_ASSETS, 'public')];
                }
                else {
                    return [2, (0, path_1.join)(getAndroidPath(), FOLDER_ANDROID_APP, 'src', 'main', exports.FOLDER_ASSETS, FOLDER_WWW)];
                }
                return [3, 6];
            case 6: return [2];
        }
    });
}); };
exports.getAndroidAssetsPath = getAndroidAssetsPath;
var getIOSAssetsPath = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                if (!isCapacitorApp()) return [3, 1];
                _a = getIosAssetsPathCapacitor();
                return [3, 3];
            case 1: return [4, (0, FileHelper_1.checkIfFileExists)((0, path_1.join)(getIosPath(), FOLDER_WWW))];
            case 2:
                _a = _b.sent();
                _b.label = 3;
            case 3: return [2, _a];
            case 4:
                e_2 = _b.sent();
                return [2, isCapacitorApp() ? getIosAssetsPathCapacitor() : (0, path_1.join)(getIosPath(), FOLDER_WWW)];
            case 5: return [2];
        }
    });
}); };
exports.getIOSAssetsPath = getIOSAssetsPath;
var getDownloadJSAgentPath = function () { return (0, path_1.join)(getPluginPath(), FOLDER_FILES, exports.FILE_JSAGENT); };
exports.getDownloadJSAgentPath = getDownloadJSAgentPath;
var getSwallowApiPath = function () { return (0, path_1.join)(getPluginPath(), FOLDER_SCRIPTS, exports.FILE_SWALLOW_API); };
exports.getSwallowApiPath = getSwallowApiPath;
var getCookieProxyPath = function () { return (0, path_1.join)(getPluginPath(), FOLDER_SCRIPTS, 'snippets', exports.FILE_COOKIE_PROXY); };
exports.getCookieProxyPath = getCookieProxyPath;
var getCurrentLogPath = function () { return (0, path_1.join)(getLogPath(), FILE_CURRENT_LOG); };
exports.getCurrentLogPath = getCurrentLogPath;
var getLogPath = function () { return (0, path_1.join)(getPluginPath(), FOLDER_LOGS); };
exports.getLogPath = getLogPath;
var getDoctorLogPath = function () { return (0, path_1.join)(getPluginPath(), FOLDER_LOGS, 'currentDoctorDynatrace.txt'); };
exports.getDoctorLogPath = getDoctorLogPath;
var getAndroidGradleVersion = function () { return (0, path_1.join)(getAndroidPath(), 'cordova', 'lib', 'builders', 'ProjectBuilder.js'); };
exports.getAndroidGradleVersion = getAndroidGradleVersion;
var getIonicConfig = function () { return (0, path_1.join)(getApplicationPath(), 'ionic.config.json'); };
exports.getIonicConfig = getIonicConfig;
var isIonic = function () { return (0, FileHelper_1.checkIfFileExistsSync)(getIonicConfig()) ? true : false; };
exports.isIonic = isIonic;
var dynatraceConfigExists = function () { return (0, FileHelper_1.checkIfFileExistsSync)(getConfigFilePath()) ? true : false; };
exports.dynatraceConfigExists = dynatraceConfigExists;
var getIosPathCapacitor = function () { return (0, path_1.join)(getApplicationPath(), 'ios', 'App'); };
exports.getIosPathCapacitor = getIosPathCapacitor;
var getAndroidPathCapacitor = function () { return (0, path_1.join)(getApplicationPath(), 'android'); };
exports.getAndroidPathCapacitor = getAndroidPathCapacitor;
var getIosPlistPathCapacitor = function () { return (0, path_1.join)(getIosPathCapacitor(), 'App', 'Info.plist'); };
exports.getIosPlistPathCapacitor = getIosPlistPathCapacitor;
var getAndroidAssetsPathCapacitor = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            return [2, (0, FileHelper_1.checkIfFileExists)((0, path_1.join)(getAndroidPathCapacitor(), FOLDER_ANDROID_APP, 'src', 'main', exports.FOLDER_ASSETS, 'public'))];
        }
        catch (e) {
            return [2, (0, path_1.join)(getAndroidPathCapacitor(), FOLDER_ANDROID_APP, 'src', 'main', exports.FOLDER_ASSETS, 'public')];
        }
        return [2];
    });
}); };
exports.getAndroidAssetsPathCapacitor = getAndroidAssetsPathCapacitor;
var getIosAssetsPathCapacitor = function () {
    if ((0, fs_1.existsSync)((0, path_1.join)(getIosPathCapacitor(), 'public'))) {
        return (0, path_1.join)(getIosPathCapacitor(), 'public');
    }
    else if ((0, fs_1.existsSync)((0, path_1.join)(getIosPathCapacitor(), 'App', 'public'))) {
        return (0, path_1.join)(getIosPathCapacitor(), 'App', 'public');
    }
    return undefined;
};
exports.getIosAssetsPathCapacitor = getIosAssetsPathCapacitor;
var getCapacitorConfig = function (checkForTs) {
    return (checkForTs === true) ? (0, path_1.join)(__dirname, '..', '..', '..', '..', '..', 'capacitor.config.ts')
        : (0, path_1.join)(__dirname, '..', '..', '..', '..', '..', 'capacitor.config.json');
};
exports.getCapacitorConfig = getCapacitorConfig;
var isCapacitorApp = function () { return (0, fs_1.existsSync)(getCapacitorConfig()) || (0, fs_1.existsSync)(getCapacitorConfig(true)) ? true : false; };
exports.isCapacitorApp = isCapacitorApp;
