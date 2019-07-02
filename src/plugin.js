'use strict';

import * as utils from 'webrtc-adapter/dist/utils';
import config from './config';

////////////////////////////////////////////////////////////////////////////
/// 
/// enums
/// 
////////////////////////////////////////////////////////////////////////////

const PLUGIN_STATES = {
  NONE : 0,           // no plugin use
  INITIALIZING : 1,   // Detected need for plugin
  INJECTING : 2,      // Injecting plugin
  INJECTED: 3,        // Plugin element injected but not usable yet
  READY: 4            // Plugin ready to be used
};

const PLUGIN_TAGS = {
  NONE  : 'none',
  AUDIO : 'audio',
  VIDEO : 'video'
};

const TEXT = {
  PLUGIN: {
    REQUIRE_INSTALLATION: 'This website requires you to install a WebRTC-enabling plugin ' +
      'to work on this browser.',
    REQUIRE_RESTART: 'Your plugin is being downloaded. Please run the installer, and restart your browser to begin using it.',
    NOT_SUPPORTED: 'Your browser does not support WebRTC.',
    BUTTON: 'Install Now'
  },
  REFRESH: {
    REQUIRE_REFRESH: 'Please refresh page',
    BUTTON: 'Refresh Page'
  }
};

////////////////////////////////////////////////////////////////////////////
/// 
/// local variables
/// 
////////////////////////////////////////////////////////////////////////////

let pluginState = PLUGIN_STATES.NONE;
let pluginId = config.pluginId;
let plugin = null;
let pageId = Math.random().toString(36).slice(2);
var browserDetails = null;
var options = { // TODO: make this configurable
  getAllCams: false,
  hidePluginInstallPrompt: false
};
let w = null;

////////////////////////////////////////////////////////////////////////////
/// 
/// Internet functions
/// 
////////////////////////////////////////////////////////////////////////////

function init(window) {
  w = window;
  browserDetails = detectBrowser(window);
  pluginState = PLUGIN_STATES.INITIALIZING;
}

function documentReady() {
  return (document.readyState === 'interactive' && !!document.body) || document.readyState === 'complete';
}

function detectBrowser(window) {
  var result = utils.detectBrowser(window);

  if (/*@cc_on!@*/false || !!document.documentMode) {
    var hasMatch = /\brv[ :]+(\d+)/g.exec(navigator.userAgent) || [];

    result.browser = 'IE';
    result.version   = parseInt(hasMatch[1], 10);

    // window.webrtcDetectedBrowser   = 'IE';
    // window.webrtcDetectedVersion   = parseInt(hasMatch[1], 10);
    // window.webrtcMinimumVersion    = 9;
    // window.webrtcDetectedType      = 'plugin';
    // window.webrtcDetectedDCSupport = 'SCTP';

    if (!result.version) {
      hasMatch = /\bMSIE[ :]+(\d+)/g.exec(navigator.userAgent) || [];
      result.version = parseInt(hasMatch[1] || '0', 10);
    }
  }

  return result;
}

 
function addEvent(elem, evnt, func) {
  if (elem.addEventListener) { // W3C DOM
    elem.addEventListener(evnt, func, false);
  } else if (elem.attachEvent) {// OLD IE DOM
    elem.attachEvent('on'+evnt, func);
  } else { // No much to do
    elem[evnt] = func;
  }
};

// !!!! WARNING: DO NOT OVERRIDE THIS FUNCTION. !!!
// This function will be called when plugin is ready. It sends necessary
// details to the plugin.
// The function will wait for the document to be ready and the set the
// plugin state to AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY,
// indicating that it can start being requested.
// This function is not in the IE/Safari condition brackets so that
// TemPluginLoaded function might be called on Chrome/Firefox.
// This function is the only private function that is not encapsulated to
// allow the plugin method to be called.
function onPluginLoaded() {
  if (documentReady()) {
    pluginState = PLUGIN_STATES.READY;
    AdapterJS.maybeThroughWebRTCReady();
  } else {
    // Try again in 100ms
    setTimeout(__TemWebRTCReady0, 100);
  }
}

// Bind arguments starting after however many are passed in.
function bind_trailing_args(fn, ...bound_args) {
    return function(...args) {
        return fn(...args, ...bound_args);
    };
}


////////////////////////////////////////////////////////////////////////////
/// 
/// exports
/// 
////////////////////////////////////////////////////////////////////////////


/* jshint -W035 */
export function WaitForPluginReady() {
  while (pluginState !== PLUGIN_STATES.READY) {
    /* empty because it needs to prevent the function from running. */
  }
};
/* jshint +W035 */

export function callWhenPluginReady(callback) {
  if (pluginState === PLUGIN_STATES.READY) {
    // Call immediately if possible
    // Once the plugin is set, the code will always take this path
    callback();
  } else {
    // otherwise start a 100ms interval
    var checkPluginReadyState = setInterval(function () {
      if (pluginState === PLUGIN_STATES.READY) {
        clearInterval(checkPluginReadyState);
        callback();
      }
    }, 100);
  }
};

export function injectPlugin(window) {
  init(window); // TODO: move me

  // only inject once the page is ready
  if (!documentReady()) {
    addEvent(document
          , 'readystatechange'
          , bind_trailing_args(injectPlugin, w));
    return;
  }

  // Prevent multiple injections
  if (pluginState !== PLUGIN_STATES.INITIALIZING) {
    return;
  }
  pluginState = PLUGIN_STATES.INJECTING;

  window.__TemWebRTCReady0 = onPluginLoaded;

  var existing = document.getElementById(config.pluginId);
  if (!!existing) {
    // There is already a plugin injected in the DOM.
    // Probably from multiple calls to node's require(AJS);
    // Take the existing one, and make it this AJS's plugin
    plugin = existing;
    pluginState = PLUGIN_STATES.INJECTED;
    if (plugin.valid) {
      window[config.onload](); // call onload function to unlock AJS
    } else {
      // wait for plugin.valid with an interval
      var pluginValidInterval = setInterval(function () {
        if (plugin.valid) {
          clearInterval(pluginValidInterval);
          window[config.onload](); // call onload function to unlock AJS
        }
      }, 100);
    }
    return;
  }

  if (browserDetails.browser === 'IE' && browserDetails.version <= 10) {
    var frag = document.createDocumentFragment();
    plugin = document.createElement('div');
    plugin.innerHTML = '<object id="' +
      config.pluginId + '" type="' +
      config.type + '" ' + 'width="1" height="1">' +
      '<param name="pluginId" value="' +
      config.pluginId + '" /> ' +
      '<param name="windowless" value="false" /> ' +
      '<param name="pageId" value="' + pageId + '" /> ' +
      '<param name="onload" value="' + config.onload + '" />' +
      '<param name="tag" value="' + PLUGIN_TAGS.NONE + '" />' +
      // uncomment to be able to use virtual cams
      (options.getAllCams ? '<param name="forceGetAllCams" value="True" />':'') +

      '</object>';
    while (plugin.firstChild) {
      frag.appendChild(plugin.firstChild);
    }
    document.body.appendChild(frag);

    // Need to re-fetch the plugin
    plugin =
      document.getElementById(config.pluginId);
  } else {
    // Load Plugin
    plugin = document.createElement('object');
    plugin.id =
      config.pluginId;
    // IE will only start the plugin if it's ACTUALLY visible
    if (browserDetails.browser === 'IE') {
      plugin.width = '1px';
      plugin.height = '1px';
    } else { // The size of the plugin on Safari should be 0x0px
            // so that the autorisation prompt is at the top
      plugin.width = '0px';
      plugin.height = '0px';
    }
    plugin.type = config.type;
    plugin.innerHTML = '<param name="onload" value="' +
      config.onload + '">' +
      '<param name="pluginId" value="' +
      config.pluginId + '">' +
      '<param name="windowless" value="false" /> ' +
      (options.getAllCams ? '<param name="forceGetAllCams" value="True" />':'') +
      '<param name="pageId" value="' + pageId + '">' +
      '<param name="tag" value="' + PLUGIN_TAGS.NONE + '" />';
    document.body.appendChild(plugin);
  }

  pluginState = PLUGIN_STATES.INJECTED;
};

export function setLogLevel(logLevel) {
    AdapterJS.WebRTCPlugin.callWhenPluginReady(function() {
      plugin.setLogLevel(logLevel);
    });
  };