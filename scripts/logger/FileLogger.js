"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileLogger = void 0;
var BaseLogger_1 = require("./BaseLogger");
var fileHelper_1 = require("../helpers/fileHelper");
var pathHelper_1 = require("../helpers/pathHelper");
var LogUtil_1 = require("./LogUtil");
var path_1 = require("path");
var LogLevel_1 = require("./LogLevel");
var FileLogger = (function (_super) {
    __extends(FileLogger, _super);
    function FileLogger(debugEnabled) {
        return _super.call(this, debugEnabled) || this;
    }
    FileLogger.prototype.logInfo = function (message) {
        return this.log(message, LogLevel_1.LogLevel.INFO);
    };
    FileLogger.prototype.logWarning = function (message) {
        return this.log(message, LogLevel_1.LogLevel.WARNING);
    };
    FileLogger.prototype.logError = function (message) {
        return this.log(message, LogLevel_1.LogLevel.ERROR);
    };
    FileLogger.prototype.log = function (message, logLevel) {
        var logMessage = _super.prototype.log.call(this, message, logLevel);
        try {
            this.createLogPath();
            fileHelper_1.appendFileSync(this.getFileLocation(), logMessage + "\r\n");
        }
        catch (error) {
            _super.prototype.log.call(this, "Could not log to File: " + pathHelper_1.getCurrentLogPath(), LogLevel_1.LogLevel.WARNING);
        }
        return logMessage;
    };
    FileLogger.prototype.logDebug = function (message, logLevel) {
        if (this.debugEnabled) {
            return this.log(message, logLevel);
        }
    };
    FileLogger.prototype.getFileLocation = function () {
        return pathHelper_1.getCurrentLogPath();
    };
    FileLogger.prototype.closeLogger = function () {
        try {
            fileHelper_1.checkIfFileExistsSync(pathHelper_1.getCurrentLogPath());
            var logFileName = LogUtil_1.currentDate().split(":").join("-") + ".txt";
            fileHelper_1.checkIfFileExistsSync(path_1.join(pathHelper_1.getLogPath(), logFileName));
            fileHelper_1.renameFileSync(pathHelper_1.getCurrentLogPath(), path_1.join(pathHelper_1.getLogPath(), logFileName));
        }
        catch (e) {
        }
    };
    FileLogger.prototype.createLogPath = function () {
        try {
            fileHelper_1.checkIfFileExistsSync(pathHelper_1.getLogPath());
        }
        catch (error) {
            fileHelper_1.createDirectorySync(pathHelper_1.getLogPath());
        }
    };
    return FileLogger;
}(BaseLogger_1.BaseLogger));
exports.FileLogger = FileLogger;
