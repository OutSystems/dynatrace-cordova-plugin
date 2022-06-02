"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLVerifier = void 0;
var HTMLConstants_1 = require("./HTMLConstants");
var path_1 = require("path");
var HTMLVerifier = (function () {
    function HTMLVerifier(htmlFile) {
        this.htmlFile = htmlFile;
    }
    HTMLVerifier.prototype.isQualified = function () {
        return this.isHTMLCordova() || this.isHTMLIonic();
    };
    HTMLVerifier.prototype.isHTMLCordova = function () {
        var scripts = this.htmlFile.getDOM().window.document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            var item = scripts.item(i);
            if (item !== null && path_1.basename(item.src) === "cordova.js") {
                return true;
            }
        }
        return false;
    };
    HTMLVerifier.prototype.isHTMLIonic = function () {
        for (var i = 0; i < HTMLConstants_1.HTML_IDENTIFIER.length; i++) {
            var tags = this.htmlFile.getDOM().window.document.getElementsByTagName(HTMLConstants_1.HTML_IDENTIFIER[i]);
            if (tags.length > 0) {
                return true;
            }
        }
        return false;
    };
    return HTMLVerifier;
}());
exports.HTMLVerifier = HTMLVerifier;
