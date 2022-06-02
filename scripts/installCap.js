"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigurationUtil_1 = require("./config/ConfigurationUtil");
var installHelper_1 = require("./helpers/installHelper");
var pathHelper_1 = require("./helpers/pathHelper");
module.exports = (function (context) {
    if (pathHelper_1.isCapacitorApp()) {
        return new Promise(function (resolve) {
            installHelper_1.modifyPackageJsonCap(true).then(function () {
                ConfigurationUtil_1.checkConfiguration().then(function () {
                    resolve("");
                });
            });
        });
    }
})();
