'use strict';

////////////////////////////////////////////////////////////////////////////
/// 
/// local variables
/// 
////////////////////////////////////////////////////////////////////////////

let pluginManager = null;

////////////////////////////////////////////////////////////////////////////
/// 
/// Internal functions
/// 
////////////////////////////////////////////////////////////////////////////

function constraintsToPlugin(c) {
  if (typeof c !== 'object' || c.mandatory || c.optional) {
    return c;
  }
  var cc = {};
  Object.keys(c).forEach(function(key) {
    if (key === 'require' || key === 'advanced') {
      return;
    }
    if (typeof c[key] === 'string') {
      cc[key] = c[key];
      return;
    }
    var r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
    if (r.exact !== undefined && typeof r.exact === 'number') {
      r.min = r.max = r.exact;
    }
    var oldname = function(prefix, name) {
      if (prefix) {
        return prefix + name.charAt(0).toUpperCase() + name.slice(1);
      }
      return (name === 'deviceId') ? 'sourceId' : name;
    };

    // HACK : Specially handling: if deviceId is an object with exact property,
    //          change it such that deviceId value is not in exact property
    // Reason : AJS-286 (deviceId in WebRTC samples not in the format specified as specifications)
    if ( oldname('', key) === 'sourceId' && r.exact !== undefined ) {
      r.ideal = r.exact;
      r.exact = undefined;
    }

    if (r.ideal !== undefined) {
      cc.optional = cc.optional || [];
      var oc = {};
      if (typeof r.ideal === 'number') {
        oc[oldname('min', key)] = r.ideal;
        cc.optional.push(oc);
        oc = {};
        oc[oldname('max', key)] = r.ideal;
        cc.optional.push(oc);
      } else {
        oc[oldname('', key)] = r.ideal;
        cc.optional.push(oc);
      }
    }
    if (r.exact !== undefined && typeof r.exact !== 'number') {
      cc.mandatory = cc.mandatory || {};
      cc.mandatory[oldname('', key)] = r.exact;
    } else {
      ['min', 'max'].forEach(function(mix) {
        if (r[mix] !== undefined) {
          cc.mandatory = cc.mandatory || {};
          cc.mandatory[oldname(mix, key)] = r[mix];
        }
      });
    }
  });
  if (c.advanced) {
    cc.optional = (cc.optional || []).concat(c.advanced);
  }
  return cc;
};

function getUserMedia(constraints) {
  var cc = {};
  cc.audio = constraints.audio ? constraintsToPlugin(constraints.audio) : false;
  cc.video = constraints.video ? constraintsToPlugin(constraints.video) : false;

  return new Promise((resolve, reject) => {  
    pluginManager.callWhenPluginReady(() => {
      pluginManager.plugin().getUserMedia(cc, resolve, reject);
    });
  })
};

function getDisplayMedia(constraints) {
  const defaultScreenshareVideo = {mediaSource: 'screensharing'}
  if(!constraints)
    constraints = { video: defaultScreenshareVideo };
  else if(!constraints.video
    || typeof constraints.video !== 'object' /* {video:true} scenario */
  )
    constraints.video = defaultScreenshareVideo;

  if(constraints.video.displaySurface) {
    switch (constraints.video.displaySurface) {
      case 'monitor':
        constraints.video.mediaSource = "screen";
        break;
      case 'window':
        constraints.video.mediaSource = "window";
        break;
      default:
        console.warn(`Plugin doesn't support the provided getDisplayMedia video constraint: ${constraints.video.displaySurface}, So defaulting to screenOrWindow.`);
        constraints.video.mediaSource = "screensharing"; // screen or window
        break;
    }
  }

  return getUserMedia(constraints);
};

function enumerateDevices() {
  return new Promise((resolve, reject) => {
    pluginManager.callWhenPluginReady(() => {
      pluginManager.plugin().GetSources((devices) => {
        var kinds = {audio: 'audioinput', video: 'videoinput'}; // TODO: support audio output
        var formatted = devices.map((d) => {
          return {
            label:      d.label,
            kind:       kinds[d.kind],
            id:         d.id,
            deviceId:   d.id,
            groupId:    ''
          };
        });
        resolve(formatted);
      });
    });
  });
}

////////////////////////////////////////////////////////////////////////////
/// 
/// exports
/// 
////////////////////////////////////////////////////////////////////////////

export function shimGetUserMedia(window, pm) {
  pluginManager = pm;
  
  window.navigator.getUserMedia = getUserMedia;
  window.navigator.mediaDevices = {
    getUserMedia: getUserMedia,
    enumerateDevices: enumerateDevices,
  };
}
