"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeGradleConfig = exports.instrumentAndroidPlatform = exports.getGradleApplyBuildScript = exports.getGradleApplyDynatraceScript = void 0;
var fileHelper_1 = require("./helpers/fileHelper");
var Logger_1 = require("./logger/Logger");
var path_1 = require("path");
var pathHelper_1 = require("./helpers/pathHelper");
var GRADLE_CONFIG_IDENTIFIER = "// AUTO - INSERTED";
var GRADLE_BUILDSCRIPT_IDENTIFIER = "buildscript";
function getGradleApplyDynatraceScript() {
    return "apply from: \"" + pathHelper_1.getDynatraceGradleFile().split(path_1.sep).join("" + (path_1.sep + path_1.sep)) + "\"";
}
exports.getGradleApplyDynatraceScript = getGradleApplyDynatraceScript;
function getGradleApplyBuildScript() {
    return "apply from: \"" + pathHelper_1.getDynatracePluginGradleFile().split(path_1.sep).join("" + (path_1.sep + path_1.sep)) + "\", to: buildscript";
}
exports.getGradleApplyBuildScript = getGradleApplyBuildScript;
function instrumentAndroidPlatform(pathToGradle, remove) {
    var path = fileHelper_1.checkIfFileExistsSync(pathToGradle);
    if (!path.endsWith(".gradle")) {
        throw new Error("Can't find .gradle file. gradle path must also include the gradle file!");
    }
    changeCordovaBuildGradleFile(path, remove);
}
exports.instrumentAndroidPlatform = instrumentAndroidPlatform;
function changeCordovaBuildGradleFile(pathToGradle, remove) {
    var gradleFileContent = fileHelper_1.readTextFromFileSync(pathToGradle);
    var gradleFileContentLines = gradleFileContent.split("\n");
    var gradlePluginFileIndex = -1;
    var gradleDynatraceFileIndex = -1;
    for (var i = 0; i < gradleFileContentLines.length && (gradleDynatraceFileIndex === -1 || gradlePluginFileIndex === -1); i++) {
        if (gradleFileContentLines[i].indexOf("plugin.gradle") > -1) {
            gradlePluginFileIndex = i;
        }
        else if (gradleFileContentLines[i].indexOf("dynatrace.gradle") > -1) {
            gradleDynatraceFileIndex = i;
        }
    }
    var modified = false;
    if (remove) {
        if (gradlePluginFileIndex !== -1) {
            gradleFileContentLines.splice(gradlePluginFileIndex, 1);
            modified = true;
        }
        if (gradleDynatraceFileIndex !== -1) {
            gradleFileContentLines.splice(gradleDynatraceFileIndex - (modified ? 1 : 0), 1);
            modified = true;
        }
        if (modified) {
            Logger_1.Logger.getInstance().logInfo("Removed Dynatrace modifications from build.gradle: " + pathToGradle);
        }
    }
    else {
        if (gradlePluginFileIndex === -1) {
            var gradleFileCordovaIndex = -1;
            for (var i = 0; i < gradleFileContentLines.length; i++) {
                if (gradleFileContentLines[i].startsWith(GRADLE_BUILDSCRIPT_IDENTIFIER)) {
                    gradleFileCordovaIndex = i;
                    break;
                }
            }
            if (gradleFileCordovaIndex === -1) {
                throw new Error("Could not find Buildscript block in build.gradle.");
            }
            gradleFileContentLines.splice(gradleFileCordovaIndex + 1, 0, getGradleApplyBuildScript());
            modified = true;
        }
        if (gradleDynatraceFileIndex === -1) {
            gradleFileContentLines.splice(gradleFileContentLines.length, 0, getGradleApplyDynatraceScript());
            modified = true;
        }
        if (modified) {
            Logger_1.Logger.getInstance().logInfo("Added Dynatrace plugin.gradle to the build.gradle: " + pathToGradle);
        }
        else {
            Logger_1.Logger.getInstance().logInfo("Dynatrace plugin & agent already added to build.gradle");
        }
    }
    if (modified) {
        var fullGradleFile = gradleFileContentLines.join("\n");
        fileHelper_1.writeTextToFileSync(pathToGradle, fullGradleFile);
    }
}
function writeGradleConfig(androidConfig) {
    if (!androidConfig.isConfigurationAvailable()) {
        Logger_1.Logger.getInstance().logWarning("Can't write configuration of Android agent because it is missing!");
        return;
    }
    var gradleFileContent = fileHelper_1.readTextFromFileSync(pathHelper_1.getDynatraceGradleFile());
    var gradleFileContentLines = removeOldGradleConfig(gradleFileContent);
    var gradleFileIndex = -1;
    for (var i = 0; i < gradleFileContentLines.length; i++) {
        if (gradleFileContentLines[i].indexOf(GRADLE_CONFIG_IDENTIFIER) > -1) {
            gradleFileIndex = i;
            break;
        }
    }
    gradleFileContentLines.splice(gradleFileIndex + 1, 0, androidConfig.getConfiguration());
    var fullGradleFile = gradleFileContentLines.join("\n");
    fileHelper_1.writeTextToFileSync(pathHelper_1.getDynatraceGradleFile(), fullGradleFile);
    Logger_1.Logger.getInstance().logInfo("Replaced old configuration with current configuration in dynatrace.gradle");
}
exports.writeGradleConfig = writeGradleConfig;
function removeOldGradleConfig(gradleFileContent) {
    var gradleFileContentLines = gradleFileContent.split("\n");
    var gradleConfigIndex = [];
    for (var i = 0; i < gradleFileContentLines.length && gradleConfigIndex.length < 2; i++) {
        if (gradleFileContentLines[i].indexOf(GRADLE_CONFIG_IDENTIFIER) > -1) {
            gradleConfigIndex.push(i);
        }
    }
    if (gradleConfigIndex.length != 2) {
        throw new Error("Could not find identifier in internal gradle file. Please re-install.");
    }
    gradleFileContentLines.splice(gradleConfigIndex[0] + 1, gradleConfigIndex[1] - (gradleConfigIndex[0] + 1));
    return gradleFileContentLines;
}
