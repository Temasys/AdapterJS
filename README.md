<img src="https://cdn.temasys.io/branding/product/adapterjs/temasys-adapterjs.svg" alt="Temasys AdapterJS" width="450" />


Temasys AdapterJS builds on top of the [webrtc/adapter project](https://github.com/webrtc/adapter) to interact with the [Temasys Browser Plugins](https://temasys.io/plugin) to integrate WebRTC 1.0 API support in Internet Explorer and Safari on Mac and Windows. Additional screensharing and helpers are included to ensure cross compatibility.


Integrated webrtc/adapter version: `2.0.3`

## How it works

![Plugin Install Bar in IE and Safari](http://temasys.github.io/resources/img/adapterheader.png)

For IE and Safari users, when the user does not have WebRTC supported natively, AdapterJS will prompt the user with a top popup bar using the `AdapterJS.renderNotificationBar` method.

## Integrating AdapterJS

- Minified (Production ready) version:

  `<script src="//cdn.temasys.io/adapterjs/0.14.x/adapter.min.js"></script>`
 
- Debug version:

  `<script src="//cdn.temasys.io/adapterjs/0.14.x/adapter.debug.js"></script>`

- Minified (Production ready) + `mediaSource` polyfill version:

  `<script src="//cdn.temasys.io/adapterjs/0.14.x/adapter.screenshare.min.js"></script>`

- Debug + `mediaSource` polyfill version:

  `<script src="//cdn.temasys.io/adapterjs/0.14.x/adapter.screenshare.js"></script>`

**Example usage:**

```
<script>
  // For configuration to set own plugin or extension information
  var AdapterJS = {};
  // Define own extension settings
  AdapterJS.extensionInfo = { .. };
  // Define plugin settings
  AdapterJS.options = {};
  // Integrate own plugin 
  AdapterJS.pluginInfo = {};
</script>
<script src="//cdn.temasys.io/adapterjs/0.14.x/adapter.screenshare.js"></script>
<script>
  // Required initialisation
  AdapterJS.webRTCReady(function() {
    getUserMedia(constraints, successCb, failCb);
  });
</script>
```

## Supported Browsers

|                                           | Chrome | Firefox | Edge | IE  | Safari | Opera | Bowser | Android |
| ----------------------------------------- | ------ | ------- | ---- | --- | ------ | ----- | ------ | ------- |
| `RTCPeerConnection`                       | Yes    | Yes     | Yes  | Yes | Yes    | Yes   | Yes    | Yes     |
| `RTCIceCandidate`                         | Yes    | Yes     | Yes  | Yes | Yes    | Yes   | Yes    | Yes     |
| `RTCSessionDescription`                   | Yes    | Yes     | Yes  | Yes | Yes    | Yes   | Yes    | Yes     |
| `RTCDataChannel`                          | Yes    | Yes     | No   | Yes | Yes    | Yes   | Yes    | Yes     |
| `RTCRtpSender`                            | No     | Yes     | Yes  | No  | No     | No    | No     | No      |
| `RTCRtpReceiver`                          | No     | Yes     | Yes  | No  | No     | No    | No     | No      |
| `MediaStreamTrack`                        | Yes    | Yes     | No   | Yes | Yes    | Yes   | Yes    | Yes     |
| `navigator.getUserMedia`                  | Yes    | Yes     | Yes  | Yes | Yes    | Yes   | Yes    | Yes     |
| `navigator.mediaDevices.getUserMedia`     | Yes    | Yes     | Yes  | Yes | Yes    | Yes   | Yes    | Yes     |
| `navigator.mediaDevices.enumerateDevices` | Yes    | Yes     | Yes  | Yes | Yes    | Yes   | Yes    | Yes     |

Here are the list of minimum required versions for support.

| Chrome | Firefox | Edge | IE  | Safari | Opera | Bowser                      | Android                 |
| ------ | ------- | ---- | --- | ------ | ----- | --------------------------- | ----------------------- |
| `38`   | `33`    | `14` | `9` | `7`    | `26`  | `0.6.1` (iOS `9` and below) | `5`-`6` (`56` Chromium) |

Opera, Bowser, Android browser are based on Chromium WebRTC implementations. WebRTC API specification polyfills are dependent on the [webrtc/adapter version](https://github.com/webrtc/adapter/tree/v2.0.3) used.

To download plugin manually, or for more details on plugin WebRTC API supports, [click here](https://plugin.temasys.io).

## API Documentation
See [API Docs](API.md).

## Development
### Setup this project
1. Copy this repository with submodules (`git clone --recursive ...`), or run `git submodule init` and `git submodule update`.
2. Install or update to at lest version `0.10.26` of node and version `1.4.6 `of npm.
3. Install `grunt-cli`. (See: http://gruntjs.com/getting-started)
4. Run `npm install` to install dev dependencies.
5. Install `karma-cli`. 

For testing, we recommend you run the unit tests with `grunt test` and also manually with Temasys [Google WebRTC samples fork](https://github.com/Temasys/Google-WebRTC-Samples).

### Project Directories
- ##### `publish/`
  Contains the debug version of the library and a minified copy of it.
  - `adapter.debug.js`: Contains the compiled AdapterJS with `webrtc/adapter` dependency.
  - `adapter.min.js`: Contains the minified and production ready version of `adapter.debug.js`.
  - `adapter.screenshare.js`: Contains the compiled `adapter.debug.js` with Screensharing polyfill changes.
  - `adapter.screenshare.min.js`: Contains the minified and production ready version of `adapter.screenshare.js`. 

- ##### `source/`
  Contains the AdapterJS library development files.

  - `adapter.js`: Contains the polyfills and APIs for Temasys Plugin WebRTC interface.
  - `adapter.screenshare.js`: Contains the polyfills for Screensharing changes.
  - `pluginInfo.js`: Contains the Temasys Plugin information. Modify this for your custom Temasys Plugin.

- ##### `tests/`
  Run `grunt test` to generate the published versions of adapter.js (same as `grunt publish`) and run the automated test suite on it.
  You can configure the browser to test in `Gruntfile.js` (see the karma target).
  You can also run `grunt karma` to run the test and bypass the publish step.

  (Mac only) If you are testing the Temasys WebRTC Plugin, you can run `osascript tests/mac.watcher.scpt` to automatically validate the permission popup.

- ##### `third_party/`
  The `webrtc/adapter` dependency linked repo at commit version.

## License
APACHE 2.0 - http://www.apache.org/licenses/LICENSE-2.0.html


