# AdapterJS

> Creating a common API for WebRTC in the browser

Find the most recent version hosted on our CDN. SSL versions are in the works.

- Minified version: `http://cdn.temasys.com.sg/adapterjs/latest/adapter.min.js`
- Debug version `http://cdn.temasys.com.sg/adapterjs/latest/adapter.debug.js`


## Compatibility

AdapterJS provides polyfills and cross-browser helpers for WebRTC. It wraps around the native APIs in Chrome, Opera and Firefox and provides support for WebRTC in Internet Explorer and Safari on Mac and Windows through the available [Temasys Browser Plugins](https://temasys.atlassian.net/wiki/display/TWPP/WebRTC+Plugins).


## Functionality

#### Polyfills

`RTCPeerConnection`, `RTCDataChannel` and `navigator.getUserMedia`

## Using AdapterJS 

#### Starting out

```javascript
AdapterJS.variable;
AdapterJS.function();
```

#### Helper functions

##### `attachMediaStream(videoelement, stream)`

universally adds a stream object to a video element

##### `reattachMediaStream(videoelement, videoelement)`

universally copies a stream object from one video element to another

##### `createIceServer(url, username, password)`

creates a valid iceServer from one url, username and password

##### `createIceServers(urls, username, password)`

creates a valid iceServers array for the specific browser and version.

##### `checkIceConnectionState(peerID, iceConnectionState, callback, returnStateAlways)`

handles all the iceConnectionState differences cross-browsers. Order of return values are 'checking' > 'connected' > 'completed'.
tested outcomes in Firefox returns 'checking' > 'connected' for both offerer and answerer.

> __Tested outcomes__
> - __Chrome (offerer)__   : 'checking' > 'completed' > 'completed'
> - __Chrome (answerer)__  : 'checking' > 'connected'
> - __Firefox (offerer)__  : 'checking' > 'connected'
> - __Firefox (answerer)__ : 'checking' > 'connected'

```javascript
peerConnection.oniceconnectionstatechange = function () {
  checkICEConnectionState(peerID, peerConnection.iceConnectionState, function (iceConnectionState) {
    // do Something every time there's a new state ['checking', 'connected', 'completed']
  });
};
```

##### `checkMediaDataChannelSettings(isOffer, peerBrowserAgent, callback, constraints)`

handles all MediaStream and DataChannel differences for interopability cross-browsers.
method has to be called before sending the acknowledge to create the offer and before creating the offer.

> __Check which Peer creates the Offer__
> 
> For Firefox (not 30+) and Chrome MediaStream interopability, _``MozDontOfferDataChannel``_ has to be used, and hence 
> Firefox cannot establish a DataChannel connection as an offerer, and results in no DataChannel connection.
> To achieve both MediaStream and DataChannel connection interopability, Chrome or other browsers has to be the one 
> creating the offer. 

```javascript
// Right now we are not yet doing the offer. We are just checking if we should be the offerer instead of
// the other peer
// You may use "webrtcDetectedBrowser" Helper function to get the peer to send browser information
var peerAgentBrowser = peerBrowserName + '|' + peerBrowserVersion;
checkMediaDataChannelSettings(false, peerAgentBrowser, function (beOfferer) {
  if (beOfferer) {
    // be the one who does the offer
  } else {
    // your peer does the offer
  }
});
```
> __Check Offer constraints__
> 
> For Firefox to Firefox MediaStream and DataChannel connection interopability, _``MozDontOfferDataChannel``_ has to be removed.

```javascript
// We are going to do the offer so we need to check the constraints first.
// You may use "webrtcDetectedBrowser" Helper variable to get the peer to send browser information
var peerAgentBrowser = peerBrowserName + '|' + peerBrowserVersion;
checkMediaDataChannelSettings(true, peerAgentBrowser, function (offerConstraints) {
  peerConnection.createOffer(function (offer) {
    // success
  }, function (error) {
    // failure
  }, offerConstraints);
}, constraints);
```

#### Helper variables

##### `webrtcDetectedBrowser`

displays all the browser information and the webrtc type of support


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
