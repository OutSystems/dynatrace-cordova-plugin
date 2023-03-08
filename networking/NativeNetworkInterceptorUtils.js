"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeNetworkInterceptorUtils = void 0;
var sessionStoragePrefix = '_dt.';
var getDTC = function (actionId) {
    var referer = getReferer(actionId);
    var dtAdk = getCookieValue('dtAdk');
    if (dtAdk === '') {
        dtAdk = getLocalStorageValue('dtAdk');
    }
    return "sn=\"".concat(getCookieValue('dtCookie'), "\", pc=\"").concat(getCookieValue('dtPC'), "\"")
        + ", v=\"".concat(getCookieValue('rxVisitor'), "\", r=\"").concat(referer, "\", adk=\"").concat(dtAdk, "\"");
};
var getReferer = function (actionId) {
    var referer = '';
    if (typeof dT_ !== 'undefined' && typeof dT_.gAR !== 'undefined') {
        referer = dT_.gAR(actionId);
    }
    if (referer === '') {
        referer = location.href;
    }
    return referer;
};
var getCookieValue = function (cookieName) {
    var b = document.cookie.match('(^|[^;]+)\\s*' + cookieName + '\\s*=\\s*([^;]+)');
    var cookie = b ? b.pop() : '';
    if (cookie === undefined || cookie.length === 0) {
        return getSessionStorageValue(cookieName);
    }
    return cookie;
};
var getLocalStorageValue = function (key) {
    if (typeof localStorage !== 'undefined') {
        var b = localStorage.getItem(key);
        return (b != null) ? b : '';
    }
};
var getSessionStorageValue = function (key) {
    if (typeof sessionStorage !== 'undefined') {
        var b = sessionStorage.getItem(sessionStoragePrefix + key);
        return (b != null) ? b : '';
    }
};
exports.NativeNetworkInterceptorUtils = {
    getHeadersForNativeRequest: function (actionId) {
        var headers = {};
        if (typeof dT_ === 'undefined') {
            console.log('Missing Dynatrace Javascript Agent API!');
            return headers;
        }
        headers['x-dynatrace'] = '';
        headers['x-dtc'] = getDTC(actionId);
        return headers;
    },
    enterNativeRequestAction: function (url, webRequestFrameworkName, actionNameFallback) {
        if (typeof dtrum === 'undefined') {
            console.log('Missing Dynatrace Javascript Agent API!');
            return -1;
        }
        webRequestFrameworkName = !webRequestFrameworkName
            ? 'Native Web Request: ' + url
            : webRequestFrameworkName;
        actionNameFallback = (actionNameFallback == null)
            ? 'Request: ' + url
            : actionNameFallback;
        var actionId = dtrum.enterXhrAction(webRequestFrameworkName, 3, url);
        if (actionId === 0) {
            var userInput = dtrum.beginUserInput('Request', 'click', url);
            actionId = dtrum.enterXhrAction(actionNameFallback, 3, url);
            dtrum.actionName(actionNameFallback);
            dtrum.endUserInput(userInput);
        }
        return actionId;
    },
    leaveNativeRequestAction: function (actionId) {
        if (typeof dtrum === 'undefined') {
            console.log('Missing Dynatrace Javascript Agent API!');
        }
        else {
            dtrum.leaveAction(actionId);
        }
    },
};
