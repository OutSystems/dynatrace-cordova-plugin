"use strict";
var cookieList = ['dtCookie', 'dtLatC', 'dtPC', 'dtSa', 'dtValidationCookie', 'rxVisitor', 'rxvt', 'dtAdk', 'dtAdkSettings'];
var sessionStoragePrefix = '_dt.';
if (typeof Document !== 'undefined') {
    var cookieDesc_1 = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
        Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
    if (cookieDesc_1 !== undefined && (cookieDesc_1.configurable === true)) {
        Object.defineProperty(document, 'cookie', {
            get: function () {
                var cookies = cookieDesc_1.get.call(document);
                return patchCookies(cookies);
            },
            set: function (val) {
                cookieDesc_1.set.call(document, val);
                setCookie(val);
            },
        });
    }
}
var setCookie = function (value) {
    if (value !== undefined) {
        var cookieParts = value.split(';');
        var values = cookieParts[0].split(/=(.+)/);
        if (values.length > 1 && isCookieImportant(values[0])) {
            if (values[0] !== undefined && values[1] !== undefined && sessionStorage !== undefined) {
                sessionStorage.setItem(sessionStoragePrefix + values[0], values[1]);
            }
        }
    }
};
var patchCookies = function (allCookies) {
    if (allCookies === undefined || allCookies.length === 0) {
        return getAllCookies();
    }
    return allCookies;
};
var getAllCookies = function () {
    var cookieString = '';
    for (var _i = 0, cookieList_1 = cookieList; _i < cookieList_1.length; _i++) {
        var cookieName = cookieList_1[_i];
        var cookie = getCookie(cookieName);
        if (cookie !== undefined && cookie !== null) {
            if (cookieString.length === 0) {
                cookieString += "".concat(cookieName, "=").concat(cookie);
            }
            else {
                cookieString += "; ".concat(cookieName, "=").concat(cookie);
            }
        }
    }
    return cookieString;
};
var getCookie = function (name) {
    if (name !== undefined && sessionStorage !== undefined) {
        return sessionStorage.getItem(sessionStoragePrefix + name);
    }
};
var isCookieImportant = function (name) {
    if (name !== undefined && name.length > 0) {
        return cookieList.includes(name);
    }
    return false;
};
if (typeof exports !== 'undefined') {
    exports.setCookie = setCookie;
    exports.patchCookies = patchCookies;
    exports.sessionStoragePrefix = sessionStoragePrefix;
}
