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
        while (_) try {
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
exports.parsedPluginPackageJson = exports.parsedApplicationPackageJson = exports.modifyConfigXmlUninstall = exports.modifyConfigXmlInstall = exports.removePListModification = exports.removeGradleModification = exports.modifyPackageJson = exports.modifyPackageJsonCap = void 0;
var android_1 = require("../android");
var fileHelper_1 = require("./fileHelper");
var ios_1 = require("../ios");
var Logger_1 = require("../logger/Logger");
var path_1 = require("path");
var pathHelper_1 = require("./pathHelper");
var ConfigParser = require('cordova-common').ConfigParser;
function modifyPackageJsonCap(install, path) {
    return __awaiter(this, void 0, void 0, function () {
        var packageJsonParsed, _a, capHookValue, doctorValue, _b, e_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 9, , 10]);
                    if (!path) return [3, 2];
                    return [4, parsedPackageJson(path)];
                case 1:
                    _a = _c.sent();
                    return [3, 4];
                case 2: return [4, parsedApplicationPackageJson()];
                case 3:
                    _a = _c.sent();
                    _c.label = 4;
                case 4:
                    packageJsonParsed = _a;
                    if (install) {
                        capHookValue = "node " + path_1.relative(path_1.join((pathHelper_1.getApplicationPath())), path_1.join(__dirname, "..", "instrumentCap.js"));
                        doctorValue = "node " + path_1.relative(path_1.join((pathHelper_1.getApplicationPath())), path_1.join(__dirname, "..", "doctor.js"));
                        if (packageJsonParsed.scripts == undefined) {
                            packageJsonParsed.scripts = {};
                        }
                        if (packageJsonParsed.scripts["ionic:capacitor:build:before"] !== capHookValue) {
                            packageJsonParsed.scripts["ionic:capacitor:build:before"] = capHookValue;
                        }
                        if (packageJsonParsed.scripts["doctorDynatrace"] !== doctorValue) {
                            packageJsonParsed.scripts["doctorDynatrace"] = doctorValue;
                        }
                    }
                    else {
                        if (packageJsonParsed.dependencies !== undefined) {
                            delete packageJsonParsed.dependencies["@dynatrace/cordova-plugin"];
                        }
                        if (packageJsonParsed.devDependencies !== undefined) {
                            delete packageJsonParsed.devDependencies["@dynatrace/cordova-plugin"];
                        }
                        delete packageJsonParsed.scripts["ionic:capacitor:build:before"];
                        delete packageJsonParsed.scripts["doctorDynatrace"];
                    }
                    if (!path) return [3, 6];
                    return [4, fileHelper_1.writeTextToFile(path, JSON.stringify(packageJsonParsed, null, "\t"))];
                case 5:
                    _b = _c.sent();
                    return [3, 8];
                case 6: return [4, fileHelper_1.writeTextToFile(pathHelper_1.getApplicationPackage(), JSON.stringify(packageJsonParsed, null, "\t"))];
                case 7:
                    _b = _c.sent();
                    _c.label = 8;
                case 8:
                    _b;
                    return [3, 10];
                case 9:
                    e_1 = _c.sent();
                    console.log(e_1);
                    Logger_1.Logger.getInstance().logWarning("Could not find package.json!");
                    return [3, 10];
                case 10: return [2];
            }
        });
    });
}
exports.modifyPackageJsonCap = modifyPackageJsonCap;
function modifyPackageJson(install) {
    return __awaiter(this, void 0, void 0, function () {
        var packageJsonParsed, doctorValue, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4, parsedApplicationPackageJson()];
                case 1:
                    packageJsonParsed = _a.sent();
                    if (install) {
                        doctorValue = "node " + path_1.relative(path_1.join((pathHelper_1.getApplicationPath())), path_1.join(__dirname, "..", "doctor.js"));
                        if (packageJsonParsed.scripts == undefined) {
                            packageJsonParsed.scripts = {};
                        }
                        packageJsonParsed.cordova.plugins["@dynatrace/cordova-plugin"] = {};
                        delete packageJsonParsed.cordova.plugins["dynatrace-cordova-plugin"];
                        if (packageJsonParsed.scripts["doctorDynatrace"] !== doctorValue) {
                            packageJsonParsed.scripts["doctorDynatrace"] = doctorValue;
                        }
                    }
                    else {
                        if (packageJsonParsed.cordova && packageJsonParsed.cordova.plugins) {
                            delete packageJsonParsed.cordova.plugins["@dynatrace/cordova-plugin"];
                            delete packageJsonParsed.cordova.plugins["dynatrace-cordova-plugin"];
                        }
                        if (packageJsonParsed.dependencies) {
                            delete packageJsonParsed.dependencies["@dynatrace/cordova-plugin"];
                        }
                        if (packageJsonParsed.devDependencies) {
                            delete packageJsonParsed.devDependencies["@dynatrace/cordova-plugin"];
                        }
                        if (packageJsonParsed.scripts) {
                            delete packageJsonParsed.scripts["doctorDynatrace"];
                        }
                    }
                    return [4, fileHelper_1.writeTextToFile(pathHelper_1.getApplicationPackage(), JSON.stringify(packageJsonParsed, null, "\t"))];
                case 2:
                    _a.sent();
                    return [3, 4];
                case 3:
                    e_2 = _a.sent();
                    Logger_1.Logger.getInstance().logWarning("Could not find package.json!");
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
exports.modifyPackageJson = modifyPackageJson;
function removeGradleModification() {
    return __awaiter(this, void 0, void 0, function () {
        var path, _a, e_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    if (!pathHelper_1.isCapacitorApp()) return [3, 2];
                    return [4, fileHelper_1.checkIfFileExists(pathHelper_1.getAndroidGradleFile(pathHelper_1.getAndroidPathCapacitor()))];
                case 1:
                    _a = _b.sent();
                    return [3, 4];
                case 2: return [4, fileHelper_1.checkIfFileExists(pathHelper_1.getAndroidGradleFile(pathHelper_1.getAndroidPath()))];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    path = _a;
                    try {
                        android_1.instrumentAndroidPlatform(path, true);
                    }
                    catch (e) {
                        Logger_1.Logger.getInstance().logError("Removal of Gradle modification didn't work!");
                    }
                    return [3, 6];
                case 5:
                    e_3 = _b.sent();
                    return [3, 6];
                case 6: return [2];
            }
        });
    });
}
exports.removeGradleModification = removeGradleModification;
function removePListModification() {
    return __awaiter(this, void 0, void 0, function () {
        var isCapacitor, _a, _b, e_4, e_5;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 12, , 13]);
                    isCapacitor = pathHelper_1.isCapacitorApp();
                    if (!isCapacitor) return [3, 2];
                    return [4, fileHelper_1.checkIfFileExists(pathHelper_1.getIosPlistPathCapacitor())];
                case 1:
                    _a = _c.sent();
                    return [3, 4];
                case 2: return [4, fileHelper_1.checkIfFileExists(pathHelper_1.getIosPath())];
                case 3:
                    _a = _c.sent();
                    _c.label = 4;
                case 4:
                    _a;
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, 10, , 11]);
                    if (!isCapacitor) return [3, 7];
                    return [4, ios_1.modifyPListFile(pathHelper_1.getIosPlistPathCapacitor(), undefined, true)];
                case 6:
                    _b = _c.sent();
                    return [3, 9];
                case 7: return [4, ios_1.modifyPListFile(undefined, undefined, true)];
                case 8:
                    _b = _c.sent();
                    _c.label = 9;
                case 9:
                    _b;
                    return [3, 11];
                case 10:
                    e_4 = _c.sent();
                    Logger_1.Logger.getInstance().logError("Removal of PList modification didn't work!");
                    return [3, 11];
                case 11: return [3, 13];
                case 12:
                    e_5 = _c.sent();
                    return [3, 13];
                case 13: return [2];
            }
        });
    });
}
exports.removePListModification = removePListModification;
function modifyConfigXmlInstall() {
    try {
        var ConfigParser_1 = require('cordova-common').ConfigParser;
        var cfg = new ConfigParser_1(path_1.join(pathHelper_1.getApplicationPath(), "config.xml"));
        var plugin = cfg.getPlugin("dynatrace-cordova-plugin");
        if (plugin === undefined) {
            return;
        }
        var pluginWithAt = cfg.getPlugin("@dynatrace/cordova-plugin");
        if (pluginWithAt === undefined) {
            cfg.addPlugin({ name: "@dynatrace/cordova-plugin", spec: plugin.spec });
        }
        cfg.removePlugin("dynatrace-cordova-plugin");
        cfg.write();
    }
    catch (e) {
        Logger_1.Logger.getInstance().logWarning("Config.xml is not available - Can not modify Dynatrace dependency");
    }
}
exports.modifyConfigXmlInstall = modifyConfigXmlInstall;
function modifyConfigXmlUninstall() {
    try {
        var cfg = new ConfigParser(path_1.join(pathHelper_1.getApplicationPath(), "config.xml"));
        cfg.removePlugin("@dynatrace/cordova-plugin");
        cfg.write();
    }
    catch (e) {
        Logger_1.Logger.getInstance().logWarning("Config.xml is not available - Can not modify Dynatrace dependency");
    }
}
exports.modifyConfigXmlUninstall = modifyConfigXmlUninstall;
function parsedPackageJson(path) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, e_6;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = JSON).parse;
                    return [4, fileHelper_1.readTextFromFile(path)];
                case 1: return [2, _b.apply(_a, [_c.sent()])];
                case 2:
                    e_6 = _c.sent();
                    console.log(e_6);
                    Logger_1.Logger.getInstance().logWarning("Could not find package.json!");
                    return [3, 3];
                case 3: return [2];
            }
        });
    });
}
function parsedApplicationPackageJson() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, parsedPackageJson(pathHelper_1.getApplicationPackage())];
        });
    });
}
exports.parsedApplicationPackageJson = parsedApplicationPackageJson;
function parsedPluginPackageJson() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, parsedPackageJson(pathHelper_1.getPluginPackage())];
        });
    });
}
exports.parsedPluginPackageJson = parsedPluginPackageJson;
