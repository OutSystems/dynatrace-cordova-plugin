"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var installHelper_1 = require("./helpers/installHelper");
var pathHelper_1 = require("./helpers/pathHelper");
module.exports = (function (context) {
    if (pathHelper_1.isCapacitorApp()) {
        return new Promise(function (resolve) {
            installHelper_1.modifyPackageJsonCap(false).then(function () {
                return installHelper_1.removeGradleModification();
            }).then(function () {
                return installHelper_1.removePListModification();
            }).then(function () {
                resolve("");
            });
        });
    }
})();
