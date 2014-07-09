# AdapterJS

> Creating a common API for WebRTC in the browser

## Compatibility

[![browser support](https://ci.testling.com/Temasys/AdapterJS.png)
](https://ci.testling.com/Temasys/AdapterJS)

AdapterJS provides shims and cross-browser helpers for WebRTC. It wraps around the native APIs in Chrome, Opera and Firefox and provides support for WebRTC in Internet Explorer and Safari through the available [Temasys Browser Plugins](https://temasys.atlassian.net/wiki/display/TWPP/WebRTC+Plugins).


## Polyfills

`RTCPeerConnection`, `RTCDataChannel` and `navigator.getUserMedia`


## Helper functions

#### `attachMediaStream(videoelement, stream)`

universally adds a stream object to a video element

#### `reattachMediaStream(videoelement, videoelement)`

universally copies a stream object from one video element to another

#### `createIceServer(url, username, password)`

creates a valid iceServer from one url, username and password

#### `createIceServers(urls, username, password)`

creates a valid iceServers array for the specific browser and version.

#### `checkIceConnectionState(peerID, iceConnectionState, callback, returnStateAlways)`

handles all the iceConnectionState differences cross-browsers. Order of return values are 'checking' > 'connected' > 'completed'.

```javascript
peerConnection.oniceconnectionstatechange = function () {
  checkICEConnectionState(peerID, peerConnection.iceConnectionState, function (iceConnectionState) {
    // do Something every time there's a new state ['checking', 'connected', 'completed']
  });
};
```

## Setup this project

- Install or update to the latest version of node and npm
- Install `grunt-cli` (See: http://gruntjs.com/getting-started)
- Run `npm install` to install dev dependencies.
- Run `npm install -g browserify` and `npm install -g testling` (might require sudo) to install the necessary tools to test locally
- Run `npm start` to start a local webserver to be able access the demo and doc folders (WebRTC won't work from your local file-system). This will popup Chrome (Mac). You can configure a different browsers in the `start.sh` file.


## Development

- Run `npm test` to execute jshint and run the tests in your local Chrome (Mac). You can configure this in the `test.sh` file.
- Run `grunt jshint` to run jshint on its own.
- Run `grunt publish` to create production version in `publish` folder


## Folders

#### publish

The debug version of the library and a minified copy of it

#### source

The adapter.js library development file

#### tests

Tape tests


## License

APACHE 2.0 - http://www.apache.org/licenses/LICENSE-2.0.html
