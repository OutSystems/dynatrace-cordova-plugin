"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var emptyFunction = function () { };
var pluginId = module.id.slice(0, module.id.lastIndexOf('.'));
var MobileFirstRequestInterceptor = require(pluginId + '.mobile-first-network-interceptor').MobileFirstRequestInterceptor;
var NativeNetworkInterceptorUtils = require(pluginId + '.native-network-interceptor-utils').NativeNetworkInterceptorUtils;
var exec = require('cordova/exec');
module.exports = {
    endVisit: function (success, error) {
        success = success !== null && success !== void 0 ? success : emptyFunction;
        error = error !== null && error !== void 0 ? error : emptyFunction;
        exec(success, error, 'DynatraceCordovaPlugin', 'endVisit', []);
    },
    getMobileFirstNetworkInterceptor: function () { return MobileFirstRequestInterceptor; },
    getNativeNetworkInterceptorUtils: function () { return NativeNetworkInterceptorUtils; },
    getUserPrivacyOptions: function (success, error) {
        success = success !== null && success !== void 0 ? success : emptyFunction;
        error = error !== null && error !== void 0 ? error : emptyFunction;
        exec(success, error, 'DynatraceCordovaPlugin', 'getUserPrivacyOptions', []);
    },
    applyUserPrivacyOptions: function (dataCollectionLevel, crashReportingOptedIn, success, error) {
        if (crashReportingOptedIn !== undefined && dataCollectionLevel !== undefined) {
            success = success !== null && success !== void 0 ? success : emptyFunction;
            error = error !== null && error !== void 0 ? error : emptyFunction;
            var options = { dataCollectionLevel: dataCollectionLevel, crashReportingOptedIn: crashReportingOptedIn };
            exec(success, error, 'DynatraceCordovaPlugin', 'applyUserPrivacyOptions', [options]);
        }
        else if (error !== undefined) {
            error('UserPrivacyOptions missing properties.');
        }
    },
};
