//
//  OSWKWebViewEngine+Dynatrace.h
//  ANB Dynatrace Sample
//
//  Created by André Gonçalves on 14/01/2022.
//

#import "OSWKWebViewEngine.h"

@interface OSWKWebViewEngine (Dynatrace)
- (void) webView: (WKWebView *) webView decidePolicyForNavigationAction: (WKNavigationAction*) navigationAction decisionHandler: (void (^)(WKNavigationActionPolicy)) decisionHandler;
@end
