"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigurationUtil_1 = require("./config/ConfigurationUtil");
var installHelper_1 = require("./helpers/installHelper");
module.exports = function (context) {
    return new Promise(function (resolve) {
        installHelper_1.modifyPackageJson(true).then(function () {
            installHelper_1.modifyConfigXmlInstall();
            ConfigurationUtil_1.checkConfiguration().then(function () {
                resolve("");
            });
        });
    });
};
