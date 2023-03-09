"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBuildProperties = exports.setCliBuildArgs = void 0;
var path_1 = require("path");
var FileHelper_1 = require("../helpers/FileHelper");
var PathHelper_1 = require("../helpers/PathHelper");
var ConfigurationReader_1 = require("../config/ConfigurationReader");
var setCliBuildArgs = function (process) {
    var buildArgs = {};
    var commandArgs = process.argv.slice(2);
    if ((0, PathHelper_1.isCapacitorApp)()) {
        if (process.env.CAPACITOR_PLATFORM_NAME !== undefined) {
            buildArgs.capacitor = process.env.CAPACITOR_PLATFORM_NAME;
        }
        else if (process.env.IONIC_CLI_HOOK_CTX_BUILD_PLATFORM) {
            buildArgs.capacitor = process.env.IONIC_CLI_HOOK_CTX_BUILD_PLATFORM;
        }
    }
    if (commandArgs.includes('android') || buildArgs.capacitor === 'android') {
        buildArgs.android = true;
    }
    if (commandArgs.includes('ios') || buildArgs.capacitor === 'ios') {
        buildArgs.ios = true;
    }
    return buildArgs;
};
exports.setCliBuildArgs = setCliBuildArgs;
var setBuildProperties = function (argv) {
    var buildProperties = {};
    var configJson;
    buildProperties.isCapacitor = (0, PathHelper_1.isCapacitorApp)();
    buildProperties.pathToConfig = (0, PathHelper_1.getConfigFilePath)();
    if (argv.config !== undefined) {
        buildProperties.pathToConfig = argv.config;
    }
    configJson = new ConfigurationReader_1.ConfigurationReader().readConfiguration(buildProperties.pathToConfig);
    if (argv.gradle !== undefined) {
        buildProperties.pathToGradle = (0, path_1.resolve)(argv.gradle);
        buildProperties.androidAvailable = (0, FileHelper_1.isPlatformAvailable)(buildProperties.pathToGradle, 'Android');
    }
    else if (configJson.getCordovaPluginConfiguration().isGradlePathAvailable()) {
        buildProperties.pathToGradle = (0, path_1.resolve)(configJson.getCordovaPluginConfiguration().getGradlePath());
        buildProperties.androidAvailable = (0, FileHelper_1.isPlatformAvailable)(buildProperties.pathToGradle, 'Android');
    }
    else {
        buildProperties.pathToGradle = buildProperties.isCapacitor ?
            (0, PathHelper_1.getAndroidGradleFile)((0, PathHelper_1.getAndroidPathCapacitor)()) : (0, PathHelper_1.getAndroidGradleFile)((0, PathHelper_1.getAndroidPath)());
        buildProperties.androidAvailable = buildProperties.isCapacitor ?
            (0, FileHelper_1.isPlatformAvailable)((0, PathHelper_1.getAndroidPathCapacitor)(), 'Android') : (0, FileHelper_1.isPlatformAvailable)((0, PathHelper_1.getAndroidPath)(), 'Android');
    }
    if (argv.plist !== undefined) {
        buildProperties.pathToPList = (0, path_1.resolve)(argv.plist);
        buildProperties.iosAvailable = (0, FileHelper_1.isPlatformAvailable)(buildProperties.pathToPList, 'iOS');
    }
    else if (configJson.getCordovaPluginConfiguration().isPlistPathAvailable()) {
        buildProperties.pathToPList = (0, path_1.resolve)(configJson.getCordovaPluginConfiguration().getPlistPath());
        buildProperties.iosAvailable = (0, FileHelper_1.isPlatformAvailable)(buildProperties.pathToPList, 'iOS');
    }
    else {
        buildProperties.pathToPList = buildProperties.isCapacitor ? (0, PathHelper_1.getIosPlistPathCapacitor)() : buildProperties.pathToPList;
        buildProperties.iosAvailable = (0, FileHelper_1.isPlatformAvailable)((0, PathHelper_1.getIosPath)(), 'iOS');
    }
    if (argv.jsagent !== undefined) {
        buildProperties.pathToJsAgent = (0, path_1.resolve)(argv.jsagent);
    }
    else if (configJson.getCordovaPluginConfiguration().isJsAgentPathAvailable()) {
        buildProperties.pathToJsAgent = (0, path_1.resolve)(configJson.getCordovaPluginConfiguration().getJsAgentPath());
    }
    buildProperties.pathToConfig = (0, path_1.resolve)(buildProperties.pathToConfig);
    buildProperties.pathToGradle = (0, path_1.resolve)(buildProperties.pathToGradle);
    return buildProperties;
};
exports.setBuildProperties = setBuildProperties;
