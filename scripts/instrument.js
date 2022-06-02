"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var instrumentHelper_1 = require("./helpers/instrumentHelper");
module.exports = function (context) {
    return new Promise(function (resolve) {
        instrumentHelper_1.instrument(process).then(function () {
            resolve("");
        });
    });
};
