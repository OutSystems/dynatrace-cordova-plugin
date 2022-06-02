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
exports.getProjectBuilderAsString = exports.getDynatraceConfigAsObject = exports.getPlistAsPath = exports.isGradleAvailable = exports.isPlatformAvailable = exports.copyFileSync = exports.copyFile = exports.renameFileSync = exports.renameFile = exports.deleteFileSync = exports.deleteFile = exports.deleteDirectory = exports.createDirectorySync = exports.createDirectory = exports.writeTextToFileSync = exports.writeTextToFile = exports.readTextFromFile = exports.readTextFromFileSync = exports.checkIfFileExistsSync = exports.checkIfFileExists = exports.appendFileSync = exports.searchFileExtInDirectoryNonRecursive = exports.searchFileExtInDirectoryRecursive = exports.searchFilesInDirectoryRecursive = void 0;
var fs_1 = require("fs");
var Logger_1 = require("../logger/Logger");
var path_1 = require("path");
var pathHelper_1 = require("./pathHelper");
var ios_1 = require("../ios");
function searchFilesInDirectoryRecursive(searchPath, fileExt, filteredDirectories) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, _searchFilePatternInDirectory(searchPath, [], fileExt, filteredDirectories, true, compareFileNames)];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
exports.searchFilesInDirectoryRecursive = searchFilesInDirectoryRecursive;
function searchFileExtInDirectoryRecursive(searchPath, fileExt, filteredDirectories) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, _searchFilePatternInDirectory(searchPath, [], fileExt, filteredDirectories, true, compareExt)];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
exports.searchFileExtInDirectoryRecursive = searchFileExtInDirectoryRecursive;
function searchFileExtInDirectoryNonRecursive(searchPath, fileExt, filteredDirectories) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, _searchFilePatternInDirectory(searchPath, [], fileExt, filteredDirectories, false, compareExt)];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
exports.searchFileExtInDirectoryNonRecursive = searchFileExtInDirectoryNonRecursive;
function compareFileNames(file, filePattern) {
    var fileName = path_1.basename(file);
    return fileName.indexOf(filePattern) > -1;
}
function compareExt(file, ext) {
    var extName = path_1.extname(file);
    return extName == ext;
}
function _searchFilePatternInDirectory(searchPath, foundFiles, pattern, filteredDirectories, recursive, fileCompare) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    fs_1.readdir(searchPath, function (err, files) {
                        if (err) {
                            reject("Directory could not be read: " + path_1.resolve(searchPath));
                            return;
                        }
                        var promiseArr = [];
                        for (var i = 0; i < files.length; i++) {
                            var dirInfo = isDirectory(path_1.join(searchPath, files[i]));
                            if (dirInfo) {
                                promiseArr.push(dirInfo);
                            }
                        }
                        Promise.all(promiseArr).then(function (values) {
                            var dirArr = [];
                            for (var i = 0; i < promiseArr.length; i++) {
                                if (values[i].isDirectory) {
                                    if (!isDirectoryFiltered(values[i].path, filteredDirectories) && recursive) {
                                        dirArr.push(values[i].path);
                                    }
                                }
                                else {
                                    if (fileCompare(values[i].path, pattern)) {
                                        foundFiles.push(values[i].path);
                                    }
                                }
                            }
                            var anotherPromise = Promise.resolve(foundFiles);
                            var _loop_1 = function (ii) {
                                anotherPromise = anotherPromise.then(function (foundFiles) {
                                    return _searchFilePatternInDirectory(dirArr[ii], foundFiles, pattern, filteredDirectories, recursive, fileCompare);
                                });
                            };
                            for (var ii = 0; ii < dirArr.length; ii++) {
                                _loop_1(ii);
                            }
                            if (dirArr.length == 0) {
                                resolve(foundFiles);
                            }
                            else {
                                resolve(anotherPromise);
                            }
                        });
                    });
                })];
        });
    });
}
function isDirectory(checkPath) {
    try {
        var stats = fs_1.statSync(checkPath);
        return {
            isDirectory: stats.isDirectory(),
            path: checkPath
        };
    }
    catch (e) {
        Logger_1.Logger.getInstance().logWarning("Directory or File could not be read: " + path_1.resolve(checkPath));
        return undefined;
    }
}
function isDirectoryFiltered(dirPath, filteredDirectories) {
    var dirName = path_1.basename(dirPath);
    for (var i = 0; i < filteredDirectories.length; i++) {
        if (dirName == filteredDirectories[i]) {
            return true;
        }
    }
    return false;
}
function appendFileSync(file, text) {
    fs_1.appendFileSync(file, text);
}
exports.appendFileSync = appendFileSync;
function checkIfFileExists(_file) {
    return new Promise(function (resolve, reject) {
        fs_1.stat(_file, function (err) {
            if (err) {
                reject(err + " - File doesn't exist: " + path_1.resolve(_file));
            }
            resolve(_file);
        });
    });
}
exports.checkIfFileExists = checkIfFileExists;
function checkIfFileExistsSync(_file) {
    fs_1.statSync(_file);
    return _file;
}
exports.checkIfFileExistsSync = checkIfFileExistsSync;
function readTextFromFileSync(_file) {
    return fs_1.readFileSync(_file, "utf8");
}
exports.readTextFromFileSync = readTextFromFileSync;
function readTextFromFile(_file) {
    return new Promise(function (resolve, reject) {
        fs_1.readFile(_file, "utf8", function (err, data) {
            if (err) {
                reject(err + "Could not read the file: " + path_1.resolve(_file));
            }
            resolve(data);
        });
    });
}
exports.readTextFromFile = readTextFromFile;
function writeTextToFile(_file, _text) {
    return new Promise(function (resolve, reject) {
        fs_1.writeFile(_file, _text, function (err) {
            if (err) {
                reject(err + " Could not write to file: " + path_1.resolve(_file));
            }
            resolve(_file);
        });
    });
}
exports.writeTextToFile = writeTextToFile;
function writeTextToFileSync(_file, _text) {
    try {
        fs_1.writeFileSync(_file, _text);
        return _file;
    }
    catch (err) {
        throw new Error(err + " Could not write to file: " + path_1.resolve(_file));
    }
}
exports.writeTextToFileSync = writeTextToFileSync;
function createDirectory(directory) {
    return new Promise(function (resolve, reject) {
        fs_1.mkdir(directory, function (err) {
            if (err) {
                resolve(false);
            }
            resolve(true);
        });
    });
}
exports.createDirectory = createDirectory;
function createDirectorySync(directory) {
    try {
        mkdirSyncRecursive(directory);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.createDirectorySync = createDirectorySync;
function mkdirSyncRecursive(directory) {
    var pathParts = directory.split(path_1.sep);
    for (var i = 1; i <= pathParts.length; i++) {
        var segment = pathParts.slice(0, i).join(path_1.sep);
        if (segment.length > 0) {
            !fs_1.existsSync(segment) ? fs_1.mkdirSync(segment) : null;
        }
    }
}
function deleteDirectory(dir) {
    return new Promise(function (resolve, reject) {
        fs_1.access(dir, function (err) {
            if (err) {
                return reject(err);
            }
            fs_1.readdir(dir, function (err, files) {
                if (err) {
                    return reject(err);
                }
                Promise.all(files.map(function (file) {
                    return deleteFile(path_1.join(dir, file));
                })).then(function () {
                    fs_1.rmdir(dir, function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                }).catch(reject);
            });
        });
    });
}
exports.deleteDirectory = deleteDirectory;
function deleteDirectorySync(dir) {
    fs_1.accessSync(dir);
    var files = fs_1.readdirSync(dir);
    files.map(function (file) {
        return deleteFileSync(path_1.join(dir, file));
    });
    fs_1.rmdirSync(dir);
}
function deleteFile(filePath) {
    return new Promise(function (resolve, reject) {
        fs_1.lstat(filePath, function (err, stats) {
            if (err) {
                return reject(err);
            }
            if (stats.isDirectory()) {
                resolve(deleteDirectory(filePath));
            }
            else {
                fs_1.unlink(filePath, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }
        });
    });
}
exports.deleteFile = deleteFile;
function deleteFileSync(filePath) {
    var stats = fs_1.lstatSync(filePath);
    if (stats.isDirectory()) {
        deleteDirectorySync(filePath);
    }
    else {
        fs_1.unlinkSync(filePath);
    }
}
exports.deleteFileSync = deleteFileSync;
function renameFile(fileOld, fileNew) {
    return new Promise(function (resolve, reject) {
        fs_1.rename(fileOld, fileNew, function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}
exports.renameFile = renameFile;
function renameFileSync(fileOld, fileNew) {
    fs_1.renameSync(fileOld, fileNew);
}
exports.renameFileSync = renameFileSync;
function copyFile(filePath, destPath) {
    return new Promise(function (resolve, reject) {
        fs_1.copyFile(filePath, destPath, function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}
exports.copyFile = copyFile;
function copyFileSync(filePath, destPath) {
    fs_1.copyFileSync(filePath, destPath);
}
exports.copyFileSync = copyFileSync;
function isPlatformAvailable(path, platform) {
    try {
        checkIfFileExistsSync(path);
        return true;
    }
    catch (e) {
        Logger_1.Logger.getInstance().logWarning(platform + " Location doesn't exist - Skip " + platform + " instrumentation and configuration.");
        return false;
    }
}
exports.isPlatformAvailable = isPlatformAvailable;
function isGradleAvailable(isCap) {
    return isCap
        ? fs_1.existsSync(pathHelper_1.getAndroidGradleFile(pathHelper_1.getAndroidPathCapacitor()))
        : fs_1.existsSync(pathHelper_1.getAndroidGradleFile(pathHelper_1.getAndroidPath()));
}
exports.isGradleAvailable = isGradleAvailable;
function getPlistAsPath(isCap) {
    return __awaiter(this, void 0, void 0, function () {
        var result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = undefined;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, ios_1.searchForPListFile()];
                case 2:
                    result = _a.sent();
                    return [3, 4];
                case 3:
                    e_1 = _a.sent();
                    if (isCap && fs_1.existsSync(pathHelper_1.getIosPlistPathCapacitor())) {
                        result = pathHelper_1.getIosPlistPathCapacitor();
                    }
                    return [3, 4];
                case 4: return [2, result];
            }
        });
    });
}
exports.getPlistAsPath = getPlistAsPath;
function getDynatraceConfigAsObject() {
    try {
        checkIfFileExistsSync(pathHelper_1.getConfigFilePath());
        return require(pathHelper_1.getConfigFilePath());
    }
    catch (e) {
        return undefined;
    }
}
exports.getDynatraceConfigAsObject = getDynatraceConfigAsObject;
function getProjectBuilderAsString() {
    try {
        checkIfFileExistsSync(pathHelper_1.getAndroidGradleVersion());
        return readTextFromFileSync(pathHelper_1.getAndroidGradleVersion());
    }
    catch (e) {
        return undefined;
    }
}
exports.getProjectBuilderAsString = getProjectBuilderAsString;
