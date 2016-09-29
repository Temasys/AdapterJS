#![AdapterJS](http://temasys.github.io/resources/img/adapterjs.svg)

> Creating a common API for WebRTC in the browser

Find the most recent version hosted on our CDN.

- Minified version: `//cdn.temasys.com.sg/adapterjs/0.13.x/adapter.min.js`
- Debug version `//cdn.temasys.com.sg/adapterjs/0.13.x/adapter.debug.js`
- Minified version (with screensharing changes): `//cdn.temasys.com.sg/adapterjs/0.13.x/adapter.screenshare.min.js`
- Debug version (with screensharing changes)`//cdn.temasys.com.sg/adapterjs/0.13.x/adapter.screenshare.js`

Part of the [Skylink WebRTC](http://skylink.io/web) toolkit.


## Compatibility

AdapterJS provides polyfills and cross-browser helpers for WebRTC. It wraps around the native APIs in Chrome, Opera and Firefox and provides support for WebRTC in Internet Explorer and Safari on Mac and Windows through the available [Temasys Browser Plugins](http://skylink.io/plugin/).

- [AdapterJS browser compatibility table](https://temasys.atlassian.net/wiki/display/TPD/AdapterJS+-+Browser+support+and+compatibility)

![Plugin Install Bar in IE and Safari](http://temasys.github.io/resources/img/adapterheader.png)
> In versions of IE and Safari that don't support WebRTC natively, AdapterJS will suggest to the user to install the [Temasys WebRTC plugin](http://skylink.io/plugin/) for Mac or Windows when you try to access getUserMedia or RTCPeerConnection.


## Functionality

### Polyfills

`RTCPeerConnection`, `RTCIceCandidate`, `RTCSessionDescription`, `MediaStreamTrack`, `navigator.getUserMedia`, `navigator.mediaDevices.getUserMedia`, `navigator.mediaDevices.enumerateDevices`


## Using AdapterJS

### Working with AdapterJS

We **strongly** recommend only executing any WebRTC related code in the callback of the `AdapterJS.webRTCReady` function. It is triggered whenever the browser or our Temasys WebRTC plugin is ready to be used.

```javascript
AdapterJS.webRTCReady(function(isUsingPlugin) {
    // The WebRTC API is ready.
    //isUsingPlugin: true is the WebRTC plugin is being used, false otherwise
    getUserMedia(constraints, successCb, failCb);
});
```

Note that `AdapterJS.onwebrtcready` is now deprecated.

Find more information about how to optimize your application for the Temasys WebRTC Plugin in the [Temasys WebRTC Plugin Documentation](https://temasys.atlassian.net/wiki/display/TWPP/How+to+integrate+the+Temasys+WebRTC+Plugin+into+your+website).

----

### Helper functions

#### `attachMediaStream(element, stream)`
This is taken over for compatibility with the original `adapter.js` from Google. Feeds a `MediaStream` object into video and audio tags.
Calling `attachMediaStream(element, null)` will detach any existing stream from the element. The stream will still be running and available to be attached to any rendering element.

- Expected parameters:

    - `element`: The `<video>` or `<audio>` DOM element.
    - `stream`: The `MediaStream` object.

#### `reattachMediaStream(elementFrom, elementTo)`
This is taken over for compatibility with adapter.js from Google. Feeds a `MediaStream` from one video or audio tag into another.

- Expected parameters:

    - `elementFrom`: The `<video>` or `<audio>` DOM element that has been attached with an existing `MediaStream` from `attachMediaStream()` API.
    - `elementTo`: The `<video>` or `<audio>` DOM element to copy the `MediaStream` from the `elementFrom` DOM element parameter.

#### `createIceServer(url, username, password)`
This creates a valid iceServer from one url, username and password

- Expected parameters:

    - `url`: The iceServer url.
    - `username`: The username.
    - `password`: The credential password.

- Expected return values:

    - `iceServer`: The iceServer object.
        - `url`: The iceServer url.
        - `username`: The username.
        - `credential`: The credetial password.

#### `createIceServers(urls, username, password)`
This creates a valid iceServers array for the specific browser and version.

- Expected parameters:

    - `urls`: The array of iceServer urls.
    - `username`: The username.
    - `password`: The credential password.

- Expected return values:

    - `iceServersList`: The array of iceServer objects.
        - `iceServer`: The iceServer object.
            - `url`: The iceServer url.
            - `username`: The username.
            - `credential`: The credential password.

#### `checkIceConnectionState(peerId, iceConnectionState, callback)`
This handles all the `iceConnectionState` return value differences cross-browsers when `RTCPeerConnection.oniceconnectionstate` is fired.

Expected outcome should be: `checking > connected > completed`. What was received in Chrome/Opera as offerer:  `checking > completed > completed`. What was received in Chrome/Opera as answerer: `checking > connected`. What was received in Firefox as offerer: `checking > connected`. What was received in Firefox as answerer: `checking > connected`.

- Expected parameters:

    - `peerId`: The unique identifier for the peer to store all fired states tied specifically to this peer.
    - `iceConnectionState`: The `iceConnectionState` received.
    - `callback`: The callback fired once the parsing is completed.

- Expected return values:

    - `updatedIceConnectionState`: The `iceConnectionState` that user should be expecting.

```javascript
peerConnection.oniceconnectionstatechange = function () {
  checkICEConnectionState(peerId, peerConnection.iceConnectionState, function (updatedIceConnectionState) {
    // do Something every time there's a new state ['checking', 'connected', 'completed']
  });
};
```

#### `checkMediaDataChannelSettings(peerAgentBrowser, peerAgentVersion, callback, constraints)`
This handles all `MediaStream` and `DataChannel` differences for interopability cross-browsers.
method has to be called before creating the offer to check if peer should create the offer.

For some older (20+) versions of Firefox and Chrome `MediaStream` interopability, `MozDontOfferDataChannel` has to be used, and hence Firefox cannot establish a `DataChannel` connection as an offerer, and results in no DataChannel connection.
- To achieve both `MediaStream` and `DataChannel` connection interopability, Chrome or other browsers has to be the one creating the offer.

- Expected parameters:

    - `peerAgentBrowser`: The browser agent or name. *E.g. Chrome*.
    - `peerAgentVersion`: The browser agent version. *E.g. 35*.
    - `callback`: The callback fired after the check has been made.
    - `constraints`: The offer constraints.
- Expected return values:
    - `beOfferrer`: Returns a `true` or a `false`. If `true`, user should do the offer. If `false`, inform the other peer to do the offer.
    - `unifiedConstraints`: The updated constraints for interoperability.

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

----

### Helper variables

#### `webrtcDetectedBrowser` _(String)_
This displays the browser WebRTC browser agent name. Defined as `null` when it's an unknown WebRTC supported browser.

- Expected values:

    - `"chrome"`: Chrome or Chromium implemented browser.
    - `"firefox"`: Firefox browser.
    - `"safari"`: Safari browser.
    - `"edge"`: Edge browser.
    - `"opera"`: Opera browser.
    - `"IE"`: IE browser.
    - `"bowser"`: Bowser browser.
    
#### `webrtcDetectedVersion` _(Number)_
This displays the browser WebRTC browser agent version. Defined as `null` when it's an unknown WebRTC supported browser.

#### `webrtcMinimumVersion` _(Number)_
This displays the browser WebRTC browser agent version. Defined as `null` when it's an unknown WebRTC supported browser.

#### `webrtcDetectedType` _(String)_
This displays the browser WebRTC implementation type. Defined as `null` when it's an unknown WebRTC supported browser.

- Expected values:

    - `"webkit"`: Webkit implementation of webrtc.
    - `"moz"`: Mozilla implementation of webrtc.
    - `"plugin"`: Temasys plugin implementation of webrtc.
    - `"ms"`: Edge implementation of webrtc (polyfilled from ORTC).

#### `webrtcDetectedDCSupport` _(String)_
This displays the browser WebRTC `Datachannel` support type. Defined as `null` when it's an unknown WebRTC supported browser or when WebRTC supported browser does not support the `Datachannel` API.

- Expected values:

    - `"SCTP"`: SCTP enabled datachannel.
    - `"RTP"`: RTP enabled datachannel.

----

### Using Screensharing functionality (`video.mediaSource`)

> **Note** that the Firefox add-on not installed detection will not work with `window.navigator.mediaDevices` on Firefox browsers to prevent errors.

AdapterJS `0.12.0`+ offers cross-browser screensharing in Chrome `34`+, Firefox `33`+ and with a licensed copy of our [Temasys WebRTC Plugin](http://skylink.io/plugin) in IE `9`+ and Safari `7.1`+. (For plugin licensing interest please contact sales (a) temasys.com.sg)

To use the screensharing functionality, reference `publish/adapter.screenshare.js` and add the `mediaSource: 'window'` setting to the video media constraints. This requires HTTPS!

**Example:**

```javascript
window.navigator.getUserMedia({
  video: {
    mediaSource: 'window' || 'screen'
  }
}, function (stream) {
  console.log('Received stream', stream);
}, function (error) {
  console.log('Failed getting stream', error);
});
```

## Setup this project
1. Copy this repository with submodules (`git clone --recursive ...`), or run `git submodule init` and `git submodule update`.
2. Install or update to at lest version `0.10.26` of node and version `1.4.6 `of npm.
3. Install `grunt-cli`. (See: http://gruntjs.com/getting-started)
4. Run `npm install` to install dev dependencies.
5. Run `npm install -g browserify` and `npm install -g testling` (might require sudo) to install the necessary tools to test locally


## Development
- Run `grunt jshint` to run jshint on its own.
- Run `grunt publish` to create production debug and minified copies of the `source/` files with the `webrtc/adapter` dependency compiled in the `publish/` folder.

## Folders
#### `publish/`
Contains the debug version of the library and a minified copy of it.

- Expected Files:

    - `adapter.debug.js`: Contains the compiled AdapterJS with `webrtc/adapter` dependency.
    - `adapter.min.js`: Contains the minified and production ready version of `adapter.debug.js`.
    - `adapter.screenshare.js`: Contains the compiled `adapter.debug.js` with Screensharing polyfill changes.
    - `adapter.screenshare.min.js`: Contains the minified and production ready version of `adapter.screenshare.js`. 

#### `source/`
Contains the AdapterJS library development files.

- Expected Files:

    - `adapter.js`: Contains the polyfills and APIs for Temasys Plugin WebRTC interface.
    - `adapter.screenshare.js`: Contains the polyfills for Screensharing changes.
    - `pluginInfo.js`: Contains the Temasys Plugin information. Modify this for your custom Temasys Plugin.

#### `tests/`
Run `grunt test` to generate the published versions of adapter.js (same as `grunt publish`) and run the automated test suite on it.
You can configure the browser to test in `Gruntfile.js` (see the karma target).
You can also run `grunt karma` to run the test and bypass the publish step.

(Mac only) If you are testing the Temasys WebRTC Plugin, you can run `osascript tests/mac.watcher.scpt` to automatically validate the permission popup.

#### `third_party/`
The `webrtc/adapter` dependency linked repo at commit version.

## License
APACHE 2.0 - http://www.apache.org/licenses/LICENSE-2.0.html
