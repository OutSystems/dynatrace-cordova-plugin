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
    return "sn=\"".concat(getSessionNumber(getCookieValue('dtCookie')), "\", pc=\"").concat(patchPageContext(getCookieValue('dtPC'), actionId), "\"")
        + ", v=\"".concat(getCookieValue('rxVisitor'), "\", r=\"").concat(referer, "\", app=\"").concat(getApplicationId(), "\", adk=\"").concat(dtAdk, "\"");
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
var patchPageContext = function (pcCookie, actionId) {
    if (pcCookie != null && pcCookie.length > 0) {
        var groups = pcCookie.match(/(.+)[h](.+)[v](.+)/);
        if (groups != null && groups.length === 4) {
            return "".concat(groups[1], "h").concat(actionId, "v").concat(groups[3]);
        }
        else {
            console.log('Regex for page context cookie failed - Returning default values!');
        }
    }
    return pcCookie;
};
var getApplicationId = function () {
    return typeof dT_ !== 'undefined' && typeof dT_.scv !== 'undefined' ? dT_.scv('app') : '';
};
var getSessionNumber = function (dtCookie) {
    if (dtCookie !== undefined) {
        var groups = dtCookie.match(/v_(.+)_srv_(.+)_sn_(.+?)[_](.+)/);
        if (groups != null && groups.length === 5) {
            return "v_".concat(groups[1], "_srv_").concat(groups[2], "_sn_").concat(groups[3]);
        }
        else {
            console.log('Regex for session number failed - Returning default values!');
        }
    }
    return 'v_4_srv__sn_';
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
