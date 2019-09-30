'use strict';

import * as utils       from './../utils';
import config           from './../config';
import { PLUGIN_TAGS }  from './plugin_enum';

// TODO: test on IE 9 that console.* exists

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

const TEXT = {
  PLUGIN: {
    REQUIRE_INSTALLATION: 'This website requires you to install a WebRTC-enabling plugin ' +
      'to work on this browser.',
    REQUIRE_RESTART: 'Your plugin is being downloaded. Please run the installer, and restart your browser to start using it.',
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

let window_             = null;
var browserDetails      = null;
let pageId              = null;
let pluginObject        = null;
let pluginId            = config.pluginId;
let pluginState         = PLUGIN_STATES.NONE;
var options             = { // TODO: make this configurable
                            getAllCams: false,
                            hidePluginInstallPrompt: false
                          };
let onwebrtcreadyDone   = false; // TODO can we just use onwebrtcreadies and onwebrtcreadies.length ?
let onwebrtcreadies     = []; // TODO rename to onWebRTCReadyCallbacks


////////////////////////////////////////////////////////////////////////////
/// 
/// Internal functions
/// 
////////////////////////////////////////////////////////////////////////////

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
  if (utils.documentReady()) {
    pluginState = PLUGIN_STATES.READY;
    maybeThroughWebRTCReady();
  } else {
    // Try again in 100ms
    setTimeout(__TemWebRTCReady0, 100);
  }
}

function maybeThroughWebRTCReady() {
  if (onwebrtcreadyDone) return;
  onwebrtcreadyDone = true;

  onwebrtcreadies.forEach(function (callback) {
    if (typeof(callback) === 'function') {
      callback(pluginObject !== null);
    }
  });
};

////////////////////////////////////////////////////////////////////////////
/// 
/// exports
/// 
////////////////////////////////////////////////////////////////////////////

export function init(window, pageid) {
  window_ = window;
  pageId = pageid;
  browserDetails = utils.detectBrowser(window);
  pluginState = PLUGIN_STATES.INITIALIZING;
}

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


export function isPluginInstalled() {
  if (browserDetails.browser === 'IE') {
    try {
      let axo = new ActiveXObject(config.prefix + '.' + config.pluginName);
      return true; // will fall into catch if plugin is not installed
    } catch (e) {
      return false;
    }
  }else if (browserDetails.browser === 'safari-plugin') {
    let pluginArray = navigator.mimeTypes;
    if (typeof pluginArray !== 'undefined') {
      for (var i = 0; i < pluginArray.length; i++) {
        if (pluginArray[i].type.indexOf(config.mimetype) >= 0) {
          return true;
        }
      }
    }
    return false;
  } else 
    return false; // other browsers would not support plugins
};

export function getDownloadLink() {
  if(!!navigator.platform.match(/^Mac/i))
    return config.downloadLinks.mac;
  else if(!!navigator.platform.match(/^Win/i))
    return config.downloadLinks.win;
};

export function downloadPlugin(callback) {
  // Download
  window.open(getDownloadLink(), '_top');

  if (browserDetails.browser === 'safari-plugin' && browserDetails.version == 11) {
    // Safari 11 doesn't have a way to reload the list of plugins. Ask user to restart their browser
    utils.renderNotificationBar(TEXT.PLUGIN.REQUIRE_RESTART);
  } else {
    // Reload the list of plugins,
    var interval = setInterval(()=>{
      navigator.plugins.refresh(false);
      if (isPluginInstalled()) {
        clearInterval(interval);
        callback();
      }
    } , 500);
  }
};

export function getLatestVersionNumber() {
  var request = new XMLHttpRequest();
  request.open('GET', config.versionURL +'?cacheBreaker='+new Date().getTime(), false);
  request.send(null);
  return request.responseText;
  // request.onreadystatechange = function () {
  //   if (request.readyState === 4 && request.status === 200) {
  //     return request.responseText;
  //   }
  // }
}

export function isUpdateAvailable() {
  if (!pluginObject) return;
  let current = pluginObject.VERSION;
  let latest  = getLatestVersionNumber();
  return utils.versionCompare(latest, current) > 0;
}

export function injectPlugin() {
  if (!window_) {
    console.error('plugin_manager needs init() to be called before injectPlugin');
    return;
  }

  // only inject once the page is ready
  if (!utils.documentReady()) {
    utils.addEvent(document
          , 'readystatechange'
          , utils.bind_trailing_args(injectPlugin, window_));
    return;
  }

  // Prevent multiple injections
  if (pluginState !== PLUGIN_STATES.INITIALIZING) {
    return;
  }
  pluginState = PLUGIN_STATES.INJECTING;

  window_.__TemWebRTCReady0 = onPluginLoaded;

  var existing = document.getElementById(config.pluginId);
  if (!!existing) {
    // There is already a plugin injected in the DOM.
    // Probably from multiple calls to node's require(AJS);
    // Take the existing one, and make it this AJS's plugin
    pluginObject = existing;
    pluginState = PLUGIN_STATES.INJECTED;
    if (pluginObject.valid) {
      window_[config.onload](); // call onload function to unlock AJS
    } else {
      // wait for plugin.valid with an interval
      var pluginValidInterval = setInterval(function () {
        if (pluginObject.valid) {
          clearInterval(pluginValidInterval);
          window_[config.onload](); // call onload function to unlock AJS
        }
      }, 100);
    }
    return;
  }

  if (browserDetails.browser === 'IE' && browserDetails.version <= 10) {
    var frag = document.createDocumentFragment();
    pluginObject = document.createElement('div');
    pluginObject.innerHTML = '<object id="' +
      config.pluginId + '" type="' +
      config.mimetype + '" ' + 'width="1" height="1">' +
      '<param name="pluginId" value="' +
      config.pluginId + '" /> ' +
      '<param name="windowless" value="false" /> ' +
      '<param name="pageId" value="' + pageId + '" /> ' +
      '<param name="onload" value="' + config.onload + '" />' +
      '<param name="tag" value="' + PLUGIN_TAGS.NONE + '" />' +
      // uncomment to be able to use virtual cams
      (options.getAllCams ? '<param name="forceGetAllCams" value="True" />':'') +

      '</object>';
    while (pluginObject.firstChild) {
      frag.appendChild(pluginObject.firstChild);
    }
    document.body.appendChild(frag);

    // Need to re-fetch the plugin
    pluginObject = document.getElementById(config.pluginId);
  } else {
    // Load Plugin
    pluginObject = document.createElement('object');
    pluginObject.id = config.pluginId;
    // IE will only start the plugin if it's ACTUALLY visible
    if (browserDetails.browser === 'IE') {
      pluginObject.width = '1px';
      pluginObject.height = '1px';
    } else { // The size of the plugin on Safari should be 0x0px
            // so that the autorisation prompt is at the top
      pluginObject.width = '0px';
      pluginObject.height = '0px';
    }
    pluginObject.type = config.mimetype;
    pluginObject.innerHTML = '<param name="onload" value="' +
      config.onload + '">' +
      '<param name="pluginId" value="' +
      config.pluginId + '">' +
      '<param name="windowless" value="false" /> ' +
      (options.getAllCams ? '<param name="forceGetAllCams" value="True" />':'') +
      '<param name="pageId" value="' + pageId + '">' +
      '<param name="tag" value="' + PLUGIN_TAGS.NONE + '" />';
    document.body.appendChild(pluginObject);
  }

  pluginState = PLUGIN_STATES.INJECTED;
};

export function setLogLevel(logLevel) {
  callWhenPluginReady(function() {
    pluginObject.setLogLevel(logLevel);
  });
};

// Sets a callback function to be called when the WebRTC interface is ready.
// The first argument is the function to callback.\
// Throws an error if the first argument is not a function

export function webRTCReady(callback) {
  if (typeof callback !== 'function') {
    throw new Error('Callback provided is not a function');
  }

  var defineScreensharingAndCallback = function () {
    // Make users having requirejs to use the webRTCReady function to define first
    // When you set a setTimeout(definePolyfill, 0), it overrides the WebRTC function
    // This is be more than 0s
    // if (typeof window_.require === 'function' &&
    //   typeof AdapterJS._defineMediaSourcePolyfill === 'function') {
    //   AdapterJS._defineMediaSourcePolyfill(); // TODO: this is for screensharing
    // }

    // All WebRTC interfaces are ready, just call the callback
    callback(null !== pluginObject);
  };

  if (onwebrtcreadyDone) {
    defineScreensharingAndCallback();
  } else {
    // will be triggered automatically when your browser/plugin is ready.
    onwebrtcreadies.push(defineScreensharingAndCallback);
  }
};

export function plugin() {
  return pluginObject;
};