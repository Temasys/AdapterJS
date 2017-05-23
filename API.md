## Attributes

#### `webrtcDetectedBrowser` : String (Readonly|Global Scope)
The client's browser name.

Defined as `null` when it is an unknown browser.

**Expected values:**

- `"chrome"`: Chrome or Chromium implemented browser.
- `"firefox"`: Firefox browser.
- `"safari"`: Safari browser.
- `"edge"`: Edge browser.
- `"opera"`: Opera browser.
- `"IE"`: IE browser.
- `"bowser"`: Bowser browser.

---

#### `webrtcDetectedVersion` : Number (Readonly|Global Scope)
The client's browser version.

Defined as `null` when it is an unknown browser.

---

#### `webrtcMinimumVersion` : Number (Readonly|Global Scope)
The client's minimum supported browser version required.

Defined as `null` when it is an unknown browser. 

---

#### `webrtcDetectedType` : String (Readonly|Global Scope|Deprecated)
The client's WebRTC prefix `RTCPeerConnection` implemented type.

Defined as `null` when it is an unknown browser.

**Expected values:**

- `"webkit"`: Chrome webkit implementation of webrtc.
- `"moz"`: Mozilla implementation of webrtc.
- `"plugin"`: Temasys plugin implementation of webrtc.
- `"ms"`: Edge implementation of webrtc (polyfilled from ORTC).

---

#### `webrtcDetectedDCSupport` : String (Readonly|Global Scope|Deprecated)
The client's `RTCDataChannel` supported protocol type.

Defined as `null` when it is an unknown browser.

**Expected values:**

- `"SCTP"`: SCTP enabled datachannel.
- `"RTP"`: RTP enabled datachannel.

---

#### `AdapterJS.options` : JSON
The Temasys WebRTC plugin options.

**Properties:**

 - `getAllCams` : Boolean - defaults to `false`
 
   The flag if all cameras including virtual cameras should be retrieved.
   
 - `hidePluginInstallPrompt` : Boolean - defaults to `false`

   The flag if installation bar should be prompted when plugin is not installed.
   
   This invokes `AdapterJS.renderNotificationBar()`.
   
---

#### `AdapterJS.TEXT` : JSON
The notification bar text.

**Properties:**

  - `PLUGIN` : JSON

    The Temasys WebRTC plugin installation bar text.
    
    - `REQUIRE_INSTALLATION` : String

      The text when plugin is required for installation.
      
    - `NOT_SUPPORTED` : String

      The text when plugin does not support current browser.
      
      This does not display the button.
      
    - `BUTTON` : String

      The button text.
 
 - `REFRESH` : JSON

   The refresh page text when plugin has just been installed.
   
   - `REQUIRE_REFRESH` : String

     The text to refresh page after installation.
     
   - `BUTTON` : String

     The button text.

---

#### `AdapterJS.WebRTCPlugin.pageId` : String (Readonly)

The unique ID of each tab as an identification for the Temasys WebRTC plugin. 
   
---

#### `AdapterJS.WebRTCPlugin.pluginState` : String (Readonly)

The current Temasys WebRTC plugin initialising state.

Reference `AdapterJS.WebRTCPlugin.PLUGIN_STATES` for the list of available states.
   
---

#### `AdapterJS.VERSION` : String (Readonly)
The Temasys AdapterJS version.

---
   
#### `AdapterJS.WebRTCPlugin.TAGS` : JSON (Readonly)
The enum of element DOM types before rendered into Temasys WebRTC plugin `<object>` element.

**Properties:**

  - `NONE` : String

    The type is unidentified element for rendering.
    
  - `VIDEO` : String

    The type is `<video>` element.
    
  - `AUDIO` : String

    The type is `<audio>` element.
    
---

#### `AdapterJS.WebRTCPlugin.PLUGIN_STATES` : JSON (Readonly)
The enum of Temasys WebRTC loading states.

**Properties:**

  - `NONE` : Number

     Tab does not require Temasys WebRTC plugin for WebRTC functionalities.
     
  - `INITIALIZING` : Number

     Tab has been detected for a required need for Temasys WebRTC plugin to enable WebRTC functionalities.
     
  - `INJECTING` : Number

     Tab is loading Temasys WebRTC into tab HTML page.
     
  - `INJECTED` : Number

     Tab has loading Temasys WebRTC into tab HTML page.
     
  - `READY` : Number

     Temasys WebRTC in tab HTML page is ready for usage.
 
---

#### `AdapterJS.WebRTCPlugin.PLUGIN_LOG_LEVELS` : JSON (Readonly)
The enum of Temasys WebRTC plugin log levels.

For more information on configuration logging, [please click here](https://confluence.temasys.com.sg/pages/viewpage.action?pageId=7572411).

**Prefix values:**

  - `INFO`: Information reported by the plugin.
  - `ERROR`: Errors originating from within the plugin.
  - `WEBRTC`: Error originating from within the libWebRTC library

**Properties:**

   - `NONE` : String
      
     Print no logs.
     
   - `ERROR` : String
    
     Print error logs.
     
   - `WARNING` : String
   
     Print error and warning logs.
     
   - `INFO` : String
   
     Print info, error and warning logs.
     
   - `VERBOSE` : String
    
     Print verbose (log), info, error and warning logs.
     
   - `SENSITIVE` : String
    
     Print all logs even if it might contain sensitive information.

---

#### `AdapterJS.WebRTCPlugin.plugin` : DOM (Readonly)
> **Note**: Please do not set `<object>` element style display to `"none"` as this may prevent the Temasys WebRTC plugin object from being rendered.
 
The Temasys WebRTC plugin object.




## Methods
#### `AdapterJS.WebRTCPlugin.setLogLevel` : None

Sets the Temasys WebRTC plugin log level.

**Parameters:**

- `level` : String

  The log level.
  
  Reference `AdapterJS.WebRTCPlugin.LOG_LEVEL` for the list of available states.
   

#### `AdapterJS.webRTCReady` : None
> **Note**: This is mandatory and REQUIRED for Temasys WebRTC plugin or extensions initialisation. Plase invoke this before using any WebRTC functionalities.

Initialises the 