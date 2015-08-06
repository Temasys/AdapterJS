/**
 * The Temasys AdapterJS Plugin interface.
 * @class WebRTCPlugin
 * @for AdapterJS
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin = AdapterJS.WebRTCPlugin || {};

/**
 * Contains the plugin information.
 * @property pluginInfo
 * @param {String} prefix The plugin prefix name.
 * @param {String} plugName The plugin object name.
 * @param {String} pluginId The plugin object id.
 * @param {String} type The plugin object type.
 * @param {String} onload The Javascript function to trigger when
 *   the plugin object has loaded.
 * @param {String} portalLink The plugin website url.
 * @param {String} downloadLink The link to download new versions
 *   of the plugin.
 * @param {String} companyName The plugin company name.
 * @type JSON
 * @private
 * @readOnly
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.pluginInfo = {
  prefix : 'Tem',
  plugName : 'TemWebRTCPlugin',
  pluginId : 'plugin0',
  type : 'application/x-temwebrtcplugin',
  onload : '__TemWebRTCReady0',
  portalLink : 'http://skylink.io/plugin/',
  downloadLink : (function () {
    // Placed on-top to return the url string directly instead
    if (!!navigator.platform.match(/^Mac/i)) {
      return 'http://bit.ly/1n77hco';
    } else if (!!navigator.platform.match(/^Win/i)) {
      return 'http://bit.ly/1kkS4FN';
    }
    return null;
  })(),
  companyName: 'Temasys'
};

/**
 * Contains the unique identifier of each opened page
 * @property pageId
 * @type String
 * @private
 * @readOnly
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.pageId = Math.random().toString(36).slice(2);

/**
 * Use this whenever you want to call the plugin.
 * @property plugin
 * @type Object
 * @private
 * @readOnly
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.plugin = null;

/**
 * Sets log level for the plugin once it is ready.
 * This is an asynchronous function that will run when the plugin is ready
 * @property setLogLevel
 * @type Function
 * @private
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.setLogLevel = null; //function (logLevel) {};

/**
 * Defines webrtc's JS interface according to the plugin's implementation.
 * Define plugin Browsers as WebRTC Interface.
 * @property defineWebRTCInterface
 * @type Function
 * @private
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.defineWebRTCInterface = null; //function () { };

/**
 * This function detects whether or not a plugin is installed.
 *   we're running IE and do something. If not it is not supported.
 * @property isPluginInstalled
 * @type Function
 * @readOnly
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.isPluginInstalled = null; // function () { };

/**
 * Lets adapter.js wait until the the document is ready before injecting the plugin.
 * @property pluginInjectionInterval
 * @type Object
 * @private
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.pluginInjectionInterval = null;

/**
 * Injects the HTML DOM object element into the page.
 * @property injectPlugin
 * @type Function
 * @private
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.injectPlugin = null;

/**
 * States of readiness that the plugin goes through when being injected and stated.
 * @property PLUGIN_STATES
 * @param {Integer} NONE No plugin use
 * @param {Integer} INITIALIZING Detected need for plugin
 * @param {Integer} INJECTING Injecting plugin
 * @param {Integer} INJECTED Plugin element injected but not usable yet
 * @param {Integer} READY Plugin ready to be used
 * @type JSON
 * @readOnly
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.PLUGIN_STATES = {
  NONE : 0,
  INITIALIZING : 1,
  INJECTING : 2,
  INJECTED: 3,
  READY: 4
};

/**
 * Current state of the plugin. You cannot use the plugin before this is
 *  equal to AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY.
 * @property pluginState
 * @type Integer
 * @private
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.pluginState = AdapterJS.WebRTCPlugin.PLUGIN_STATES.NONE;

/**
 * True is AdapterJS.onwebrtcready was already called, false otherwise.
 * Used to make sure AdapterJS.onwebrtcready is only called once.
 * @property onwebrtcreadyDone
 * @type Boolean
 * @readOnly
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.onwebrtcreadyDone = false;

/**
 * Log levels for the plugin.
 * Log outputs are prefixed in some cases.
 * From the least verbose to the most verbose
 * @property PLUGIN_LOG_LEVELS
 * @param {String} NONE No log level.
 * @param {String} ERROR Errors originating from within the plugin.
 * @param {String} INFO Information reported by the plugin.
 * @param {String} VERBOSE Verbose mode.
 * @param {String} SENSITIVE Sensitive mode.
 * @type JSON
 * @readOnly
 * @private
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.PLUGIN_LOG_LEVELS = {
  NONE : 'NONE',
  ERROR : 'ERROR',
  WARNING : 'WARNING',
  INFO: 'INFO',
  VERBOSE: 'VERBOSE',
  SENSITIVE: 'SENSITIVE'
};

/**
 * Does a waiting check before proceeding to load the plugin.
 * @property WaitForPluginReady
 * @type Function
 * @private
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.WaitForPluginReady = null;

/**
 * This method will use an interval to wait for the plugin to be ready.
 * @property callWhenPluginReady
 * @type Function
 * @private
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.callWhenPluginReady = null;

/**
 * This function will be called if the plugin is needed (browser different
 *   from Chrome or Firefox), but the plugin is not installed.
 * Override it according to your application logic.
 * @property pluginNeededButNotInstalledCb
 * @type Function
 * @for WebRTCPlugin
 * @since 0.10.5
 */
AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCb = null;

/**
 * !!!! WARNING: DO NOT OVERRIDE THIS FUNCTION. !!!
 * This function will be called when plugin is ready. It sends necessary
 *   details to the plugin.
 * The function will wait for the document to be ready and the set the
 *   plugin state to AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY,
 *   indicating that it can start being requested.
 * This function is not in the IE/Safari condition brackets so that
 *   TemPluginLoaded function might be called on Chrome/Firefox.
 * This function is the only private function that is not encapsulated to
 *   allow the plugin method to be called.
 * @method pluginNeededButNotInstalledCb
 * @private
 * @global true
 * @for WebRTCPlugin
 * @since 0.10.5
 */
window.__TemWebRTCReady0 = function () {
  if (document.readyState === 'complete') {
    AdapterJS.WebRTCPlugin.pluginState = AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY;

    AdapterJS.maybeThroughWebRTCReady();
  } else {
    AdapterJS.WebRTCPlugin.documentReadyInterval = setInterval(function () {
      if (document.readyState === 'complete') {
        // TODO: update comments, we wait for the document to be ready
        clearInterval(AdapterJS.WebRTCPlugin.documentReadyInterval);
        AdapterJS.WebRTCPlugin.pluginState = AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY;

        AdapterJS.maybeThroughWebRTCReady();
      }
    }, 100);
  }
};