"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLModifier = void 0;
var path_1 = require("path");
var Logger_1 = require("../logger/Logger");
var HtmlConstants_1 = require("./HtmlConstants");
var HtmlUtil_1 = require("./HtmlUtil");
var HTMLModifier = (function () {
    function HTMLModifier(htmlFile) {
        this.htmlFile = htmlFile;
        this.swallowAPIEnabled = HtmlConstants_1.DEFAULT_SWALLOW_API_INJECTION;
        this.cookieProxyScript = HtmlConstants_1.DEFAULT_COOKIE_PROXY_INJECTION;
    }
    HTMLModifier.prototype.setJSAgentContent = function (jsAgentContent) {
        this.jsAgentContent = jsAgentContent;
        return this;
    };
    HTMLModifier.prototype.setCookieProxyEnabled = function (cookieProxy) {
        this.cookieProxyScript = cookieProxy;
        return this;
    };
    HTMLModifier.prototype.setSwallowAPIEnabled = function (swallowAPI) {
        this.swallowAPIEnabled = swallowAPI;
        return this;
    };
    HTMLModifier.prototype.removeAgentFromHTMLDom = function () {
        var scripts = this.htmlFile.getDOM().window.document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var item = scripts.item(i);
            if (item !== null && item.src.includes(HtmlConstants_1.OLD_AGENT_SRC) && item.parentNode !== null) {
                item.parentNode.removeChild(item);
                return true;
            }
        }
        return false;
    };
    HTMLModifier.prototype.modify = function () {
        return __awaiter(this, void 0, void 0, function () {
            var head, scriptTag;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.removeAgentFromHTMLDom()) {
                            Logger_1.Logger.getInstance().logDebug('Old JavaScript agent was removed from HTML.');
                        }
                        head = this.getHead();
                        if (!(this.jsAgentContent !== undefined && head != null)) return [3, 6];
                        if (!this.swallowAPIEnabled) return [3, 2];
                        head.prepend(this.createScriptTag(HtmlConstants_1.SWALLOW_API_SRC));
                        return [4, (0, HtmlUtil_1.copySwallowAPI)((0, path_1.join)(this.htmlFile.getPath(), '..'))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        scriptTag = this.htmlFile.getDOM().window.document.createElement('template');
                        scriptTag.innerHTML = this.jsAgentContent;
                        if (scriptTag.content.firstChild !== null) {
                            head.prepend(scriptTag.content.firstChild);
                        }
                        if (!(this.cookieProxyScript === true)) return [3, 4];
                        head.prepend(this.createScriptTag(HtmlConstants_1.COOKIE_PROXY_SRC));
                        return [4, (0, HtmlUtil_1.copyCookieProxy)((0, path_1.join)(this.htmlFile.getPath(), '..'))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4, this.htmlFile.write()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2];
                }
            });
        });
    };
    HTMLModifier.prototype.getHead = function () {
        var heads = this.htmlFile.getDOM().window.document.getElementsByTagName('head');
        if (heads.length === 0) {
            var head = this.htmlFile.getDOM().window.document.createElement('head');
            this.htmlFile.getDOM().window.document.appendChild(head);
            return head;
        }
        else {
            return heads.item(0);
        }
    };
    HTMLModifier.prototype.createScriptTag = function (location) {
        var scriptTag = this.htmlFile.getDOM().window.document.createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.src = location;
        return scriptTag;
    };
    return HTMLModifier;
}());
exports.HTMLModifier = HTMLModifier;
