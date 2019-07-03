'use strict';

import * as webrtcUtils from 'webrtc-adapter/dist/utils';
import * as utils       from './../utils';
import config           from './../config';
import { PLUGIN_TAGS }  from './plugin_enum';

////////////////////////////////////////////////////////////////////////////
/// 
/// local variables
/// 
////////////////////////////////////////////////////////////////////////////

let pageId              = null;
let pluginManager       = null;
let browserDetails      = utils.detectBrowser(window);

////////////////////////////////////////////////////////////////////////////
/// 
/// Internal functions
/// 
////////////////////////////////////////////////////////////////////////////

function forwardEventHandlers(destElem, srcElem, prototype) {
  var properties = Object.getOwnPropertyNames( prototype );
  for(var prop in properties) {
    if (prop) {
      var propName = properties[prop];

      if (typeof propName.slice === 'function' &&
          propName.slice(0,2) === 'on' &&
          typeof srcElem[propName] === 'function') {
          utils.addEvent(destElem, propName.slice(2), srcElem[propName]);
      }
    }
  }
  var subPrototype = Object.getPrototypeOf(prototype);
  if(!!subPrototype) {
    forwardEventHandlers(destElem, srcElem, subPrototype);
  }
};

function attachMediaStream(element, stream) {
  if (!element || !element.parentNode) {
    return;
  }

  var streamId;
  if (stream === null) {
    streamId = '';
  } else {
    if (typeof stream.enableSoundTracks !== 'undefined') {
      stream.enableSoundTracks(true);
    }
    streamId = stream.id;
  }

  var elementId = element.id.length === 0 ? Math.random().toString(36).slice(2) : element.id;
  var nodeName = element.nodeName.toLowerCase();
  if (nodeName !== 'object') { // not a plugin <object> tag yet
    var tag;
    switch(nodeName) {
      case 'audio':
        tag = PLUGIN_TAGS.AUDIO;
        break;
      case 'video':
        tag = PLUGIN_TAGS.VIDEO;
        break;
      default:
        tag = PLUGIN_TAGS.NONE;
      }

    var frag = document.createDocumentFragment();
    var temp = document.createElement('div');
    var classHTML = '';
    if (element.className) {
      classHTML = 'class="' + element.className + '" ';
    } else if (element.attributes && element.attributes['class']) {
      classHTML = 'class="' + element.attributes['class'].value + '" ';
    }

    temp.innerHTML = '<object id="' + elementId + '" ' + classHTML +
      'type="' + config.type + '">' +
      '<param name="pluginId" value="' + elementId + '" /> ' +
      '<param name="pageId" value="' + pageId + '" /> ' +
      '<param name="windowless" value="true" /> ' +
      '<param name="streamId" value="' + streamId + '" /> ' +
      '<param name="tag" value="' + tag + '" /> ' +
      '</object>';
    while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
    }

    var height = '';
    var width = '';
    if (element.clientWidth || element.clientHeight) {
      width = element.clientWidth;
      height = element.clientHeight;
    }
    else if (element.width || element.height) {
      width = element.width;
      height = element.height;
    }

    element.parentNode.insertBefore(frag, element);
    frag = document.getElementById(elementId);
    frag.width = width;
    frag.height = height;
    element.parentNode.removeChild(element);
  } else { // already an <object> tag, just change the stream id
    var children = element.children;
    for (var i = 0; i !== children.length; ++i) {
      if (children[i].name === 'streamId') {
        children[i].value = streamId;
        break;
      }
    }
    element.setStreamId(streamId);
  }
  var newElement = document.getElementById(elementId);
  forwardEventHandlers(newElement, element, Object.getPrototypeOf(element));

  return newElement;
};

function reattachMediaStream(to, from) {
  var stream = null;
  var children = from.children;
  for (var i = 0; i !== children.length; ++i) {
    if (children[i].name === 'streamId') {
      pluginManager.WaitForPluginReady();
      stream = pluginManager.plugin().getStreamWithId(pageId, children[i].value);
      break;
    }
  }
  if (stream !== null) {
    return attachMediaStream(to, stream);
  } else {
    console.log('Could not find the stream associated with this element');
  }
};

////////////////////////////////////////////////////////////////////////////
/// 
/// exports
/// 
////////////////////////////////////////////////////////////////////////////

export function shimAttachMediaStream(window, pm, pageid) {
  pageId        = pageid;
  pluginManager = pm;
  // attachMediaStream_    = bind_trailing_args(attachMediaStream,   pageId);
  // reattachMediaStream_  = bind_trailing_args(reattachMediaStream, pageId);

  // Propagate attachMediaStream in window
  window.attachMediaStream    = attachMediaStream;
  window.reattachMediaStream  = reattachMediaStream;  
}
