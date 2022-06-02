var cookieList = ["dtCookie", "dtLatC", "dtPC", "dtSa", "dtValidationCookie", "rxVisitor", "rxvt", "dtAdk", "dtAdkSettings"];
var sessionStoragePrefix = "_dt.";
if (typeof Document !== "undefined") {
    var cookieDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
        Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
    if (cookieDesc && cookieDesc.configurable) {
        Object.defineProperty(document, 'cookie', {
            get: function () {
                var cookies = cookieDesc.get.call(document);
                return patchCookies(cookies);
            },
            set: function (val) {
                cookieDesc.set.call(document, val);
                setCookie(val);
            }
        });
    }
}
function setCookie(value) {
    if (value !== undefined) {
        var cookieParts = value.split(";");
        var values = cookieParts[0].split(/=(.+)/);
        if (values && values.length > 1 && isCookieImportant(values[0])) {
            if (values[0] !== undefined && values[1] !== undefined && sessionStorage !== undefined) {
                sessionStorage.setItem(sessionStoragePrefix + values[0], values[1]);
            }
        }
    }
}
function patchCookies(allCookies) {
    if (allCookies === undefined || allCookies.length === 0) {
        return getAllCookies();
    }
    return allCookies;
}
function getAllCookies() {
    var cookieString = "";
    for (var i = 0; i < cookieList.length; i++) {
        var cookie = getCookie(cookieList[i]);
        if (cookie !== undefined && cookie !== null) {
            if (cookieString.length == 0) {
                cookieString += cookieList[i] + "=" + cookie;
            }
            else {
                cookieString += "; " + cookieList[i] + "=" + cookie;
            }
        }
    }
    return cookieString;
}
function getCookie(name) {
    if (name !== undefined && sessionStorage !== undefined) {
        return sessionStorage.getItem(sessionStoragePrefix + name);
    }
}
function isCookieImportant(name) {
    if (name !== undefined && name.length > 0) {
        return cookieList.includes(name);
    }
    return false;
}
if (typeof exports !== "undefined") {
    exports.setCookie = setCookie;
    exports.patchCookies = patchCookies;
    exports.sessionStoragePrefix = sessionStoragePrefix;
}
