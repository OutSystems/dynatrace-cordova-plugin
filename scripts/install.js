"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigurationUtil_1 = require("./config/ConfigurationUtil");
var InstallHelper_1 = require("./helpers/InstallHelper");
module.exports = function (context) { return new Promise(function (resolve) {
    (0, InstallHelper_1.modifyPackageJson)(true).then(function () {
        (0, InstallHelper_1.modifyConfigXmlInstall)();
        (0, ConfigurationUtil_1.checkConfiguration)().then(function () {
            resolve('');
        });
    });
}); };
