# AdapterJS

> Creating a common API for WebRTC in the browser

Find the most recent version hosted on our CDN. SSL versions are in the works.

- Minified version: `http://cdn.temasys.com.sg/adapterjs/latest/adapter.min.js`
- Debug version `http://cdn.temasys.com.sg/adapterjs/latest/adapter.debug.js`


## Compatibility

AdapterJS provides polyfills and cross-browser helpers for WebRTC. It wraps around the native APIs in Chrome, Opera and Firefox and provides support for WebRTC in Internet Explorer and Safari on Mac and Windows through the available [Temasys Browser Plugins](https://temasys.atlassian.net/wiki/display/TWPP/WebRTC+Plugins).


## Functionality

#### Polyfills

`RTCPeerConnection`, `RTCIceCandidate`, `RTCSessionDescription`, `MediaStreamTrack`, `navigator.getUserMedia`, `attachMediaStream`, `reattachMediaStream`

## Using AdapterJS

#### Helper functions

##### `createIceServer(url, username, password)`

creates a valid iceServer from one url, username and password

##### `createIceServers(urls, username, password)`

creates a valid iceServers array for the specific browser and version.

##### `maybeFixConfiguration(pcConfig)`

Fixes the incompability of `urls` attribute in some browsers.



##### `checkIceConnectionState(peerId, iceConnectionState, callback)`

handles all the iceConnectionState differences cross-browsers. Order of return values are `'checking' > 'connected' > 'completed'`.
tested outcomes in Firefox returns `'checking' > 'connected'` for both offerer and answerer.

Tested outcomes:
- Chrome (offerer) : `'checking' > 'completed' > 'completed'`
- Chrome (answerer) : `'checking' > 'connected'`
- Firefox (offerer) : `'checking' > 'connected'`
- Firefox (answerer) : `'checking' > 'connected'`

```javascript
peerConnection.oniceconnectionstatechange = function () {
  checkICEConnectionState(peerId, peerConnection.iceConnectionState, function (updatedIceConnectionState) {
    // do Something every time there's a new state ['checking', 'connected', 'completed']
  });
};
```

##### `checkMediaDataChannelSettings(peerAgentBrowser, peerAgentVersion, callback, constraints)`

handles all MediaStream and DataChannel differences for interopability cross-browsers.
method has to be called before creating the offer to check if peer should create the offer.

For some older (20+) versions of Firefox and Chrome MediaStream interopability, `MozDontOfferDataChannel` has to be used, and hence Firefox cannot establish a DataChannel connection as an offerer, and results in no DataChannel connection. To achieve both MediaStream and DataChannel connection interopability, Chrome or other browsers has to be the one creating the offer.

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

#### Helper variables

##### `webrtcDetectedType`

displays the browser webrtc implementation type.

##### `webrtcDetectedDCSupport`

displays the browser webrtc datachannel support type.


## Setup this project

- Install or update to at lest version 0.10.26 of node and version 1.4.6 of npm
- Install `grunt-cli` (See: http://gruntjs.com/getting-started)
- Run `npm install` to install dev dependencies.
- Run `npm install -g browserify` and `npm install -g testling` (might require sudo) to install the necessary tools to test locally


## Development

- Run `npm test` to execute jshint and run the tests in your local Chrome (Mac). You can configure this in the `test.sh` file.
- Run `grunt jshint` to run jshint on its own.
- Run `grunt publish` to create production debug and minified copies of adapter.js in `publish` folder


## Folders

##### publish

The debug version of the library and a minified copy of it

##### source

The adapter.js library development file

##### tests

Tape tests


## License

APACHE 2.0 - http://www.apache.org/licenses/LICENSE-2.0.html