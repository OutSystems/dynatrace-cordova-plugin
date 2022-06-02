"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var installHelper_1 = require("./helpers/installHelper");
module.exports = function (context) {
    if (context !== undefined && context.opts !== undefined && context.opts.plugins !== undefined) {
        var plugins = context.opts.plugins;
        if (plugins.includes("@dynatrace/cordova-plugin")) {
            var index = plugins.indexOf("@dynatrace/cordova-plugin");
            plugins[index] = "dynatrace-cordova-plugin";
            return new Promise(function (resolve) {
                installHelper_1.modifyPackageJson(false).then(function () {
                    return installHelper_1.removeGradleModification();
                }).then(function () {
                    return installHelper_1.removePListModification();
                }).then(function () {
                    installHelper_1.modifyConfigXmlUninstall();
                    resolve("");
                });
            });
        }
    }
};
