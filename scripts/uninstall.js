"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InstallHelper_1 = require("./helpers/InstallHelper");
module.exports = function (context) {
    if (context !== undefined && context.opts !== undefined && context.opts.plugins !== undefined) {
        var plugins = context.opts.plugins;
        if (plugins.includes('@dynatrace/cordova-plugin')) {
            var index = plugins.indexOf('@dynatrace/cordova-plugin');
            plugins[index] = 'dynatrace-cordova-plugin';
            return new Promise(function (resolve) {
                (0, InstallHelper_1.modifyPackageJson)(false).then(function () { return (0, InstallHelper_1.removeGradleModification)(); }).then(function () { return (0, InstallHelper_1.removePListModification)(); }).then(function () {
                    (0, InstallHelper_1.modifyConfigXmlUninstall)();
                    resolve('');
                });
            });
        }
    }
};
