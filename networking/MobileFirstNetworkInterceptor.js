"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileFirstRequestInterceptor = void 0;
var pluginId = module.id.slice(0, module.id.lastIndexOf('.'));
var NativeNetworkInterceptorUtils = require(pluginId + '.native-network-interceptor-utils').NativeNetworkInterceptorUtils;
var origWLResourceRequest = undefined;
var isNetworkIntercepted = false;
function tagSendRequest(request) {
    if (request.getHeader("x-dynatrace") == undefined) {
        var actionId = NativeNetworkInterceptorUtils.enterNativeRequestAction(request.getUrl(), "Mobile First");
        var headers = NativeNetworkInterceptorUtils.getHeadersForNativeRequest(actionId);
        for (var headerProp in headers) {
            request.setHeader(headerProp, headers[headerProp]);
        }
        return actionId;
    }
    else {
        return -1;
    }
}
exports.MobileFirstRequestInterceptor = {
    isInterceptorEnabled: function () {
        return isNetworkIntercepted;
    },
    enableInterceptor: function () {
        if (typeof dT_ === "undefined" && typeof dtrum === "undefined") {
            console.log("Missing Dynatrace Javascript Agent API! MFP Interceptor not enabled!");
        }
        if (typeof WLResourceRequest === "undefined" && typeof WL === "undefined") {
            console.log("Missing Mobile First API! MFP Interceptor not enabled!");
            return;
        }
        if (isNetworkIntercepted) {
            console.log("MFP Interceptor already enabled!");
            return;
        }
        origWLResourceRequest = WLResourceRequest;
        WLResourceRequest = function WLResourceRequest() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var request = new (origWLResourceRequest.bind.apply(origWLResourceRequest, __spreadArrays([void 0], args)))();
            var originalSend = request.send;
            var originalSendFormParameters = request.sendFormParameters;
            request.send = function send(content) {
                var actionId = tagSendRequest(this);
                if (actionId != -1) {
                    return originalSend.apply(this, [content])
                        .then(function (response) {
                        NativeNetworkInterceptorUtils.leaveNativeRequestAction(actionId);
                        return response;
                    }, function (error) {
                        NativeNetworkInterceptorUtils.leaveNativeRequestAction(actionId);
                        return error;
                    });
                }
                else {
                    return originalSend.apply(this, [content]);
                }
            };
            request.sendFormParameters = function sendFormParameters(json) {
                var actionId = tagSendRequest(this);
                if (actionId != -1) {
                    return originalSendFormParameters.apply(this, [json])
                        .then(function (response) {
                        NativeNetworkInterceptorUtils.leaveNativeRequestAction(actionId);
                        return response;
                    }, function (error) {
                        NativeNetworkInterceptorUtils.leaveNativeRequestAction(actionId);
                        return error;
                    });
                }
                else {
                    return originalSendFormParameters.apply(this, [json]);
                }
            };
            return request;
        };
        for (var prop in origWLResourceRequest) {
            if (origWLResourceRequest.hasOwnProperty(prop)) {
                WLResourceRequest[prop] = origWLResourceRequest[prop];
            }
        }
        isNetworkIntercepted = true;
        console.log("Enabled MFP HTTP Interceptor!");
    },
    disableInterceptor: function () {
        if (!isNetworkIntercepted) {
            return;
        }
        WLResourceRequest = origWLResourceRequest;
        isNetworkIntercepted = false;
        console.log("Disabled MFP HTTP Interceptor!");
    }
};
