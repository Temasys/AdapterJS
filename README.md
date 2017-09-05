<img src="https://cdn.temasys.io/branding/product/adapterjs/temasys-adapterjs.svg" alt="Temasys AdapterJS" width="450" />

> Creating a common API for WebRTC in the browser

Find the most recent version hosted on our CDN.

- Minified version: `//cdn.temasys.io/adapterjs/0.15.x/adapter.min.js`
- Debug version `//cdn.temasys.io/adapterjs/0.15.x/adapter.debug.js`
- Minified version (with screensharing changes): `//cdn.temasys.io/adapterjs/0.15.x/adapter.screenshare.min.js`
- Debug version (with screensharing changes)`//cdn.temasys.io/adapterjs/0.15.x/adapter.screenshare.js`

Part of the [Skylink WebRTC](http://skylink.io/web) toolkit.


## Compatibility

AdapterJS provides polyfills and cross-browser helpers for WebRTC. It wraps around the native APIs in Chrome, Opera and Firefox and provides support for WebRTC in Internet Explorer and Safari on Mac and Windows through the available [Temasys Browser Plugins](http://skylink.io/plugin/).

### Supported Browsers & Platform functionality

| Browsers          | Min. Version | OS Platform              | Screensharing             | 
| ----------------- | ------------ | ------------------------ | ------------------------- | 
| Chrome \ Chromium | `38`         | MacOS / Win / Ubuntu / Android | Yes (w [Extension](https://chrome.google.com/webstore/detail/skylink-webrtc-tools/ljckddiekopnnjoeaiofddfhgnbdoafc))         |
| Firefox           | `33`         | MacOS / Win / Ubuntu / Android | Yes (w [Extension for `51` and below](https://addons.mozilla.org/en-US/firefox/addon/skylink-webrtc-tools/))         |
| Opera             | `26`         | MacOS / Win / Ubuntu / Android |  Yes (if configured with extension)                       | 
| Edge              | `13.10547`^  | Win                      |  -                        |
| Bowser            | `0.6.1`      | iOS 9.x only**           |  -                        |
| Safari (Native)   | `11`         | MacOS 10.13.x and iOS 11 |  No. Use Safari with the Temasys plugin*** |
| Safari (Plugin)   | `7`          | MacOS                    | Yes ([custom build Plugin](https://temasys.io/plugin/#commercial-licensing)) |
| IE (Plugin)       | `9`          | Win                      | Yes ([custom build Plugin](https://temasys.io/plugin/#commercial-licensing)) |

*Note that currently Edge doesn't support `RTCDataChannel` API.

**There seems to be issues for Bowser version `0.6.1` working with iOS 10.x version.

*** To use the Temasys plugin on Safari 11 and above, set the flag ```AdapterJS.options.forceSafariPlugin = true``` BEFORE including AdapterJS.

### How it looks like if WebRTC is not supported by browser
![Plugin Install Bar in IE and Safari](http://temasys.github.io/resources/img/adapterheader.png)
In versions of IE and Safari that don't support WebRTC natively, AdapterJS will suggest to the user to install the [Temasys WebRTC plugin](http://skylink.io/plugin/) for Mac or Windows when you try to access the `getUserMedia` or `RTCPeerConnection` API.

## Using and setting up the AdapterJS dependency

### Required initialization 
In order to execute any WebRTC related code, you have to wait for the `AdapterJS.webRTCReady` function to trigger the `callback` parameter as it is triggered when the WebRTC interfaces is ready to be used by the browser.

> **Note** that `AdapterJS.onwebrtcready` is deprecated.

```javascript
AdapterJS.webRTCReady(function(isUsingPlugin) {
    // The WebRTC API is ready.
    //isUsingPlugin: true is the WebRTC plugin is being used, false otherwise
    getUserMedia(constraints, successCb, failCb);
});
```

To find more information about how to optimize your application for the Temasys WebRTC Plugin, read it more in the [Temasys WebRTC Plugin Documentation](https://confluence.temasys.com.sg/display/TWPP/How+to+integrate+the+Temasys+WebRTC+Plugin+into+your+website).

----
## Functionality
### Polyfills
- `RTCPeerConnection`
- `RTCIceCandidate`
- `RTCSessionDescription`
- `MediaStreamTrack`
- `navigator.getUserMedia`
- `navigator.mediaDevices.getUserMedia`
- `navigator.mediaDevices.enumerateDevices`


### Helper functions
##### `attachMediaStream(element, stream)` : None
```javascript
  getUserMedia({ audio: true, video: true }, function (stream) {
    attachMediaStream(videoElm, stream);
  }, ...);
```
This is taken over for compatibility with the original `adapter.js` from Google. Feeds a `MediaStream` object into video and audio tags. Calling `attachMediaStream(element, null)` will detach any existing stream from the element. The stream will still be running and available to be attached to any rendering element.

- **Parameters:**

    - **`element`**: (DOM Element) The `<video>` or `<audio>` DOM element.
    - **`stream`**: (DOM Element) The `MediaStream` object.
    
- **Returns: None**

##### `reattachMediaStream(elementFrom, elementTo)` : None
```javascript
  reattachMediaStream(videoWithStreamElm, videoElm);
```
This is taken over for compatibility with adapter.js from Google. Feeds a `MediaStream` from one video or audio tag into another.

- **Parameters:**

    - **`elementFrom`**: (DOM Element) The `<video>` or `<audio>` DOM element that has been attached with an existing `MediaStream` from `attachMediaStream()` API.
    - **`elementTo`**: (DOM Element) The `<video>` or `<audio>` DOM element to copy the `MediaStream` from the `elementFrom` DOM element parameter.

- **Returns: None**

##### `createIceServer(url, username, password)` : JSON
```javascript
  createIceServers('turn:ice.com', 'xxx', 'xxxx');
```
This creates a valid `RTCIceServer` object from one `url`, `username` and `password`.

- **Parameters:**

    - **`url`**: (String) The ICE server url.
    - **`username`**: (String) The ICE server username only for TURN.
    - **`password`**: (String) The ICE server credential password only for TURN.

- **Returns: JSON**
    - **`url`**: (String) The ICE server url.
    - **`username`**: (String) The ICE server username only for TURN.
    - **`credential`**: (String) The ICE server credential password only for TURN.

##### `createIceServers(urls, username, password)` : JSON
```javascript
  createIceServers(['turn:ice.com', 'stun:ice.com'], 'xxx', 'xxxx');
```

This creates a valid an Array of `RTCIceServer` objects for browsers that supports the `.url` format only when constructing `new RTCPeerConnection({ iceServers: [xx] })`.

- **Parameters:**

    - **`urls`**: (Array) The array of ICE server urls.
        - **`#index`**: (String) The ICE server url.
    - **`username`**: (String) The ICE server username only for TURN.
    - **`password`**: (String) The ICE server credential password only for TURN.

- **Returns: Array**
    - **`#index`**: (JSON) The ICE server object.
        - **`url`**: (String) The ICE server url.
        - **`username`**: (String) The TURN ICE server username.
        - **`credential`**: (String) The TURN ICE server credential password.

##### `checkIceConnectionState(peerId, iceConnectionState, callback)` : None
> **Note** that this function has been deprecated since expected triggering of ICE connection states should not be handled.

```javascript
peerConnection.oniceconnectionstatechange = function () {
  checkICEConnectionState(peerId, peerConnection.iceConnectionState, function (updatedIceConnectionState) {
    // do Something every time there's a new state ['checking', 'connected', 'completed']
  });
};
```

This handles all the `iceConnectionState` return value differences cross-browsers when `RTCPeerConnection.oniceconnectionstate` is fired.

Expected outcome should be: `checking > connected > completed`. What was received in Chrome/Opera as offerer:  `checking > completed > completed`. What was received in Chrome/Opera as answerer: `checking > connected`. What was received in Firefox as offerer: `checking > connected`. What was received in Firefox as answerer: `checking > connected`.

- **Parameters:**

    - **`peerId`**: (String) The unique identifier for the peer to store all fired states tied specifically to this peer.
    - **`iceConnectionState`**: (String) The `RTCPeerConnection.iceConnectionState` received.
    - **`callback`**: (Function) The callback fired once the parsing is completed.
        - **Returned `callback` parameters:**
            - **`updatedIceConnectionState`**: (String) The updated `RTCPeerConnection.iceConnectionState` that Peer should trigger.

- **Returns: None**


##### `checkMediaDataChannelSettings(peerAgentBrowser, peerAgentVersion, callback, constraints)` : None
> **Note** that this function has been deprecated as this is based off older versions of browsers interoperability in which is lower than our minimum supported browser versions.

```javascript
// Right now we are not yet doing the offer. We are just checking if we should be the offerer instead of the other peer
checkMediaDataChannelSettings(peerAgentBrowser, peerAgentVersion
  function (beOfferer, unifiedOfferConstraints) {
  if (beOfferer) {
    peerConnection.createOffer(function (offer) {
      // success
    }, function (error) {
      // failure
    }, unifiedOfferConstraints);
  } else {
    // let the other peer do the offer instead.
  }
}, inputConstraints);
```

This handles all `MediaStream` and `DataChannel` differences for interoperability cross-browsers. The method has to be called before creating the offer to check if peer should create the offer.

For some older (`20`+) versions of Firefox and Chrome `MediaStream` interoperability, `MozDontOfferDataChannel` has to be used, and hence Firefox cannot establish a `DataChannel` connection as an offerer, and results in no DataChannel connection. To achieve both `MediaStream` and `DataChannel` connection interoperability, Chrome or other browsers has to be the one creating the offer.

- **Parameters:**

    - **`peerAgentBrowser`**: (String) The browser agent or name. *E.g. Chrome*.
    - **`peerAgentVersion`**: (Number) The browser agent version. *E.g. `35`*.
    - **`callback`**: (Function) The callback fired after the check has been made.
        - **Returned `callback` parameters:**
            - **`beOfferrer`**: (Boolean) Returns a `true` or a `false`. If `true`, user should do the offer. If `false`, inform the other peer to do the offer.
            - **`unifiedConstraints`**: (JSON) The updated `RTCOfferOptions` offer constraints for interoperability. 
    - **`constraints`:** (JSON) The `RTCOfferOptions` offer constraints.

- **Returns: None**

----

### Helper variables

##### `webrtcDetectedBrowser` : String
This displays the browser WebRTC browser agent name. Defined as `null` when it's an unknown WebRTC supported browser.

- **Expected values:**

    - **`"chrome"`:** Chrome or Chromium implemented browser.
    - **`"firefox"`:** Firefox browser.
    - **`"safari"`:** Safari browser.
    - **`"edge"`:** Edge browser.
    - **`"opera"`:** Opera browser.
    - **`"IE"`:** IE browser.
    - **`"bowser"`:** Bowser browser.
    
##### `webrtcDetectedVersion` : Number
This displays the browser WebRTC browser agent version. Defined as `null` when it's an unknown WebRTC supported browser.

##### `webrtcMinimumVersion` : Number
This displays the browser WebRTC browser agent version. Defined as `null` when it's an unknown WebRTC supported browser. The values follows the Supported Browsers minimum versions section.

##### `webrtcDetectedType` : String
This displays the browser WebRTC implementation type. Defined as `null` when it's an unknown WebRTC supported browser.

- **Expected values:**

    - **`"webkit"`:** Webkit implementation of webrtc.
    - **`"moz"`:** Mozilla implementation of webrtc.
    - **`"plugin"`:** Temasys plugin implementation of webrtc.
    - **`"ms"`:** Edge implementation of webrtc (polyfilled from ORTC).

##### `webrtcDetectedDCSupport` : String
This displays the browser WebRTC `Datachannel` support type. Defined as `null` when it's an unknown WebRTC supported browser or when WebRTC supported browser does not support the `Datachannel` API.

- **Expected values:**

    - **`"SCTP"`:** SCTP enabled datachannel.
    - **`"RTP"`:** RTP enabled datachannel.

----

### Using Screensharing functionality

> **Note** that the Firefox add-on not installed detection will not work with `window.navigator.mediaDevices` on Firefox browsers to prevent errors.

AdapterJS `0.12.0`+ offers cross-browser screensharing in Chrome `34`+, Firefox `33`+ and with a licensed copy of our [Temasys WebRTC Plugin](http://temasys.io/plugin) in IE `9`+ and Safari `7.1`+. (For plugin licensing interest please contact sales (a) temasys.com.sg)

To use the screensharing functionality, reference `publish/adapter.screenshare.js` and add the `mediaSource: 'window'` setting to the video media constraints. This requires HTTPS!

Note that the the `mediaSource` property takes in String, or Array in which multiple sources is supported for Chrome / Opera sources. For Firefox, if an Array is provided, it takes the first item in the Array.

**Example:**

```javascript
window.navigator.getUserMedia({
  video: {
    mediaSource: 'window' || 'screen' || ['tab', 'audio'] || ['window' || 'screen']
  }
}, function (stream) {
  console.log('Received stream', stream);
}, function (error) {
  console.log('Failed getting stream', error);
});
```

**List of valid screensharing (`mediaSource`) sources:**

| Sources | Description | Browsers that supports it |
| ------- | ----------- | --------- |
| `"window"`  | Fetches the list of application windows | Chrome, Opera, Firefox, IE, Safari |
| `"screen"`  | Fetches the list of display screens     | Chrome, Opera, Firefox, IE, Safari |
| `"tab"`  | Fetches the list of browser tabs | Chrome, Opera |
| `"browser"`  | Fetches the list of browser windows | Firefox (Requires to configure `about:config` to enable `media.getusermedia.browser.enabled`)  |
| `"application"`  | Fetches the list of applications | Firefox |
| `"camera"`  | Fetches the list of cameras | Firefox |
| `["tab", "audio"]`  | Fetches `"tab"` with its audio | Chrome, Opera (Enable `constraints.audio` to retrieve tab audio) |
| `["window", "screen"]`  | Fetches `"screen"` and `"window"` | Chrome, Opera, IE, Safari |
| `["window", "screen", "tab"]` | Fetches `"screen"`, `"window"` and `"tab"` | Chrome, Opera |
| `["window", "tab"]` | Fetches `"window"` and `"tab"` | Chrome, Opera |
| `["screen", "tab"]` | Fetches `"screen"` and `"tab"` | Chrome, Opera |
| `AdapterJS.WebRTCPlugin.plugin.screensharingKeys.screenOrWindow`  | Same as `["window","screen"]` | IE, Safari |
| `AdapterJS.WebRTCPlugin.plugin.screensharingKeys.screensharingKey` | Deprecated. Same as `["window","screen"]`. | IE, Safari |
| `AdapterJS.WebRTCPlugin.plugin.screensharingKeys.screen`  | Same as `"screen"` | IE, Safari |
| `AdapterJS.WebRTCPlugin.plugin.screensharingKeys.window` | Deprecated. Same as `"window"`. | IE, Safari |


**Configuring extension settings:**

To configure your AdapterJS screensharing extensions, configure this before referencing the script for `adapter.screenshare.js` as an example:

```
var AdapterJS = {};

/**
 * Configure extension settings. For developers using "adapter.screenshare.js"
 */
AdapterJS.extensionInfo = {
  chrome: {
    // Configure the extension ID for Chrome
    extensionId: 'xxx',
    // Configure the extension webstore link for Chrome
    extensionLink: 'xxx',
    // Configure the extension iframe link (detectRTC) for Chrome - for older Chrome extension codebase
    iframeLink: 'xxx'
  },
  firefox: {
    // Configure the addon link (legacy if available and uploaded before restriction) for Firefox 51 and below
    extensionLink: 'xxx'
  },
  opera: {
    // Configure the extension ID for Opera
    extensionId: 'xxx',
    // Configure the extension webstore link for Opera
    extensionLink: 'xxx'
  }
};
```

## Setup this project
1. Install or update to at lest version `0.10.26` of node and version `1.4.6 `of npm.
2. Install `grunt-cli`. (See: http://gruntjs.com/getting-started)
3. Run `npm install` to install dev dependencies.
4. Run `npm install -g browserify` and `npm install -g testling` (might require sudo) to install the necessary tools to test locally


## Development
- Run `grunt jshint` to run jshint on its own.
- Run `grunt publish` to create production debug and minified copies of the `source/` files with the `webrtc/adapter` dependency compiled in the `publish/` folder.

## Folders
##### `publish/`
Contains the debug version of the library and a minified copy of it.
- `adapter.debug.js`: Contains the compiled AdapterJS with `webrtc/adapter` dependency.
- `adapter.min.js`: Contains the minified and production ready version of `adapter.debug.js`.
- `adapter.screenshare.js`: Contains the compiled `adapter.debug.js` with Screensharing polyfill changes.
- `adapter.screenshare.min.js`: Contains the minified and production ready version of `adapter.screenshare.js`. 

##### `source/`
Contains the AdapterJS library development files.

- `adapter.js`: Contains the polyfills and APIs for Temasys Plugin WebRTC interface.
- `adapter.screenshare.js`: Contains the polyfills for Screensharing changes.
- `pluginInfo.js`: Contains the Temasys Plugin information. Modify this for your custom Temasys Plugin.

##### `tests/`
Run `grunt test` to generate the published versions of adapter.js (same as `grunt publish`) and run the automated test suite on it.
You can configure the browser to test in `Gruntfile.js` (see the karma target).
You can also run `grunt karma` to run the test and bypass the publish step.

(Mac only) If you are testing the Temasys WebRTC Plugin, you can run `osascript tests/mac.watcher.scpt` to automatically validate the permission popup.

## License
APACHE 2.0 - http://www.apache.org/licenses/LICENSE-2.0.html
