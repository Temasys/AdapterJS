'use strict';

import * as webrtcUtils from 'webrtc-adapter/dist/utils';

////////////////////////////////////////////////////////////////////////////
/// 
/// local variables
/// 
////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////
/// 
/// Internal functions
/// 
////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////
/// 
/// exports
/// 
////////////////////////////////////////////////////////////////////////////

// Bind arguments starting after however many are passed in.
export function bind_trailing_args(fn, ...bound_args) {
    return function(...args) {
        return fn(...args, ...bound_args);
    };
}

export function addEvent(elem, evnt, func) {
  if (elem.addEventListener) { // W3C DOM
    elem.addEventListener(evnt, func, false);
  } else if (elem.attachEvent) {// OLD IE DOM
    elem.attachEvent('on'+evnt, func);
  } else { // No much to do
    elem[evnt] = func;
  }
};

export function detectBrowser(window) {
  var result = webrtcUtils.detectBrowser(window);

  if (/*@cc_on!@*/false || !!document.documentMode) {
    var hasMatch = /\brv[ :]+(\d+)/g.exec(navigator.userAgent) || [];

    result.browser = 'IE';
    result.version = parseInt(hasMatch[1], 10);

    // window.webrtcDetectedBrowser   = 'IE';
    // window.webrtcDetectedVersion   = parseInt(hasMatch[1], 10);
    // window.webrtcMinimumVersion    = 9;
    // window.webrtcDetectedType      = 'plugin';
    // window.webrtcDetectedDCSupport = 'SCTP';

    if (!result.version) {
      hasMatch = /\bMSIE[ :]+(\d+)/g.exec(navigator.userAgent) || [];
      result.version = parseInt(hasMatch[1] || '0', 10);
    }
  // Detect Safari
  } else if (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification) || navigator.userAgent.match(/AppleWebKit\/(\d+)\./) || navigator.userAgent.match(/Version\/(\d+).(\d+)/)) {
    hasMatch = navigator.userAgent.match(/version\/(\d+)\.(\d+)/i) || [];
    var AppleWebKitBuild = navigator.userAgent.match(/AppleWebKit\/(\d+)/i) || [];

    var isMobile      = navigator.userAgent.match(/(iPhone|iPad)/gi);
    var hasNativeImpl = AppleWebKitBuild.length >= 1 && AppleWebKitBuild[1] >= 604;

    var majorVersion  = parseInt(hasMatch[1] || '0', 10);
    var minorVersion  = parseInt(hasMatch[2] || '0', 10);
    var nativeImplIsOverridable = majorVersion == 11 && minorVersion < 2;

    if (!isMobile
      && (!hasNativeImpl || (AdapterJS.options.forceSafariPlugin && nativeImplIsOverridable))) {
      result.browser = 'safari-plugin';
      result.version = parseInt(hasMatch[1], 10);
    } else {
      // Managed by webrtc-adapter:detectBrowser
    }
  }

  return result;
}

