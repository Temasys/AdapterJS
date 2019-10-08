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
    elem['on'+evnt] = func;
  }
};


export function documentReady() {
  return (document.readyState === 'interactive' && !!document.body) || document.readyState === 'complete';
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

export function renderNotificationBar(message, buttonText, buttonCallback) {
  // only inject once the page is ready
  if (!documentReady()) {
    return;
  }

  var w = window;
  var i = document.createElement('iframe');
  i.name = 'adapterjs-alert';
  i.style.position = 'fixed';
  i.style.top = '-41px';
  i.style.left = 0;
  i.style.right = 0;
  i.style.width = '100%';
  i.style.height = '40px';
  i.style.backgroundColor = '#ffffe1';
  i.style.border = 'none';
  i.style.borderBottom = '1px solid #888888';
  i.style.zIndex = '9999999';
  if(typeof i.style.webkitTransition === 'string') {
    i.style.webkitTransition = 'all .5s ease-out';
  } else if(typeof i.style.transition === 'string') {
    i.style.transition = 'all .5s ease-out';
  }
  document.body.appendChild(i);
  var c = (i.contentWindow) ? i.contentWindow :
    (i.contentDocument.document) ? i.contentDocument.document : i.contentDocument;
  c.document.open();
  c.document.write('<span style="display: inline-block; font-family: Helvetica, Arial,' +
    'sans-serif; font-size: .9rem; padding: 4px; vertical-align: ' +
    'middle; cursor: default;">' + message + '</span>');
  if(buttonText && typeof buttonCallback === 'function') {
    c.document.write('<button id="okay">' + buttonText + '</button><button id="cancel">Cancel</button>');
    c.document.close();

    // On click on okay
    addEvent(c.document.getElementById('okay'), 'click', function (e) {
      e.preventDefault();
      try {
        e.cancelBubble = true;
      } catch(error) { }
      buttonCallback(e);
    });

    // On click on Cancel - all bars has same logic so keeping it that way for now
    addEvent(c.document.getElementById('cancel'), 'click', function(e) {
      w.document.body.removeChild(i);
    });
  } else {
    c.document.close();
  }
  setTimeout(function() {
    if(typeof i.style.webkitTransform === 'string') {
      i.style.webkitTransform = 'translateY(40px)';
    } else if(typeof i.style.transform === 'string') {
      i.style.transform = 'translateY(40px)';
    } else {
      i.style.top = '0px';
    }
  }, 300);
};

export function versionCompare(v1, v2, options) {
  var lexicographical = options && options.lexicographical,
  zeroExtend = options && options.zeroExtend,
  v1parts = v1.split('.'),
  v2parts = v2.split('.');

  function isValidPart(x) {
    return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
  }

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN;
  }

  if (zeroExtend) {
    while (v1parts.length < v2parts.length) v1parts.push("0");
    while (v2parts.length < v1parts.length) v2parts.push("0");
  }

  if (!lexicographical) {
    v1parts = v1parts.map(Number);
    v2parts = v2parts.map(Number);
  }

  for (var i = 0; i < v1parts.length; ++i) {
    if (v2parts.length == i) {
      return 1;
    }

    if (v1parts[i] == v2parts[i]) {
      continue;
    }
    else if (v1parts[i] > v2parts[i]) {
      return 1;
    }
    else {
      return -1;
    }
  }

  if (v1parts.length != v2parts.length) {
    return -1;
  }

  return 0;
}
