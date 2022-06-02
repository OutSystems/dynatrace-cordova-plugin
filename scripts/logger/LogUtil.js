"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentDate = exports.convertDateToString = void 0;
function convertDateToString(date) {
    var localISOTime = date.toISOString().slice(0, -5);
    return localISOTime.replace("T", " ");
}
exports.convertDateToString = convertDateToString;
function currentDate() {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return this.convertDateToString(new Date(Date.now() - tzoffset));
}
exports.currentDate = currentDate;
