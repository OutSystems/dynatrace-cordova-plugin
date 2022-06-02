"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBuildProperties = exports.setCliBuildArgs = void 0;
var fileHelper_1 = require("../helpers/fileHelper");
var Logger_1 = require("../logger/Logger");
var path_1 = require("path");
var pathHelper_1 = require("../helpers/pathHelper");
function setCliBuildArgs(process) {
    var buildArgs = {};
    var commandArgs = process.argv.slice(2);
    var capacitorPlatformArg = process.env ? process.env.IONIC_CLI_HOOK_CTX_BUILD_PLATFORM : undefined;
    if (capacitorPlatformArg !== undefined) {
        buildArgs.capacitor = capacitorPlatformArg;
    }
    if (commandArgs.includes("android") || capacitorPlatformArg === "android") {
        buildArgs.android = true;
    }
    if (commandArgs.includes("ios") || capacitorPlatformArg === "ios") {
        buildArgs.ios = true;
    }
    return buildArgs;
}
exports.setCliBuildArgs = setCliBuildArgs;
function setBuildProperties(argv) {
    var buildProperties = {};
    buildProperties.isCapacitor = pathHelper_1.isCapacitorApp();
    buildProperties.pathToConfig = pathHelper_1.getConfigFilePath();
    if (argv.config !== undefined) {
        buildProperties.pathToConfig = argv.config;
    }
    if (argv.gradle !== undefined) {
        buildProperties.pathToGradle = path_1.resolve(argv.gradle);
        buildProperties.androidAvailable = fileHelper_1.isPlatformAvailable(buildProperties.pathToGradle, "Android");
    }
    else {
        buildProperties.pathToGradle = buildProperties.isCapacitor ? pathHelper_1.getAndroidGradleFile(pathHelper_1.getAndroidPathCapacitor()) : pathHelper_1.getAndroidGradleFile(pathHelper_1.getAndroidPath());
        buildProperties.androidAvailable = buildProperties.isCapacitor ? fileHelper_1.isPlatformAvailable(pathHelper_1.getAndroidPathCapacitor(), "Android") : fileHelper_1.isPlatformAvailable(pathHelper_1.getAndroidPath(), "Android");
    }
    if (argv.plist !== undefined) {
        buildProperties.pathToPList = path_1.resolve(argv.plist);
        buildProperties.iosAvailable = fileHelper_1.isPlatformAvailable(buildProperties.pathToPList, "iOS");
    }
    else {
        buildProperties.pathToPList = buildProperties.isCapacitor ? pathHelper_1.getIosPlistPathCapacitor() : buildProperties.pathToPList;
        buildProperties.iosAvailable = fileHelper_1.isPlatformAvailable(pathHelper_1.getIosPath(), "iOS");
    }
    if (argv.jsagent !== undefined) {
        try {
            Logger_1.Logger.getInstance().logInfo("Checking if JSAgent file exists ..");
            buildProperties.pathToJsAgent = fileHelper_1.checkIfFileExistsSync(argv.jsagent);
            Logger_1.Logger.getInstance().logInfo("JSAgent found at: " + buildProperties.pathToJsAgent);
        }
        catch (ex) {
            Logger_1.Logger.getInstance().logWarning("JSAgent not found: " + ex);
        }
    }
    buildProperties.pathToConfig = path_1.resolve(buildProperties.pathToConfig);
    buildProperties.pathToGradle = path_1.resolve(buildProperties.pathToGradle);
    return buildProperties;
}
exports.setBuildProperties = setBuildProperties;
