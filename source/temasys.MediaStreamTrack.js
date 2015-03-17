// Polyfill all MediaStream objects
var polyfillMediaStreamTrack = null;

// Return the event payload
var returnEventPayloadFn = function (track) {
  return {
    bubbles: false,
    cancelBubble: false,
    cancelable: false,
    currentTarget: track,
    defaultPrevented: false,
    eventPhase: 0,
    returnValue: true,
    srcElement: track,
    target: track,
    timeStamp: (new Date()).getTime()
  };
};

if (navigator.mozGetUserMedia) {

  /**
   * The polyfilled MediaStreamTrack class.
   * @class MediaStreamTrack
   * @since 0.10.5
   */
	polyfillMediaStreamTrack = function (track) {

    /**
     * The MediaStreamTrack object id.
     * @attribute id
     * @type String
     * @readOnly
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    //track.id = track.id || (new Date()).getTime().toString();

    /**
     * The MediaStreamTrack object label.
     * @attribute label
     * @type String
     * @readOnly
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    //track.label = track.label || track.kind + '-' + track.id;

    /**
     * The flag that indicates if a MediaStreamTrack object has ended.
     * @attribute ended
     * @type Boolean
     * @readOnly
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.ended = false;

    /**
     * The flag that indicates if a MediaStreamTrack object is enabled.
     * - Set it to <code>true</code> for enabled track stream or set it to
     *   <code>false</code> for disable track stream.
     * @attribute enabled
     * @type Boolean
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.enabled = true;

    /**
     * The flag that indicates if a MediaStreamTrack object is muted.
     * @attribute muted
     * @type Boolean
     * @readOnly
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.muted = typeof track.muted === 'boolean' ? track.muted : false;

    /**
     * The ready state status of a MediaStreamTrack object.
     * @attribute readyState
     * @type String
     * @readOnly
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.readyState = typeof track.readyState === 'string' ? track.readyState : 'live';

    /**
     * The MediaStreamTrack object type.
     * - <code>"audio"</code>: The MediaStreamTrack object type is an audio track.
     * - <code>"video"</code>: The MediaStreamTrack object type is an video track.
     * @attribute kind
     * @type String
     * @readOnly
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    //track.kind = track.kind;

    /**
     * The status if a MediaStreamTrack object is read only and cannot to be overwritten.
     * @attribute readOnly
     * @type Boolean
     * @readOnly
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.readOnly = typeof track.readOnly === 'boolean' ? track.readOnly : false;

    /**
     * Event triggered when MediaStreamTrack has ended streaming.
     * @event onended
     * @param {String} type The type of event: <code>"ended"</code>.
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.onended = null;

    /**
     * Event triggered when MediaStreamTrack has started streaming.
     * @event onstarted
     * @param {String} type The type of event: <code>"started"</code>.
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.onstarted = null;

    /**
     * Event triggered when MediaStreamTrack has been muted.
     * @event onmute
     * @param {String} type The type of event: <code>"mute"</code>.
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.onmute = null;

    /**
     * Event triggered when MediaStreamTrack has been unmuted.
     * @event onunmute
     * @param {String} type The type of event: <code>"unmute"</code>.
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.onunmute = null;

    /**
     * Event triggered when MediaStreamTrack is over constrained.
     * @event onoverconstrained
     * @param {String} type The type of event: <code>"overconstrained"</code>.
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.onoverconstrained = null;

    /**
     * Event triggered when a feature in the MediaStreamTrack is not supported
     *   but used.
     * @event onunsupported
     * @param {String} feature The feature that is not supported. <i>Eg. <code>"stop"</code></i>.
     * @param {Object} error The error received natively.
     * @param {String} type The type of event: <code>"unsupported"</code>.
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.onunsupported = null;

    /**
     * Stops a MediaStreamTrack streaming.
     * @method polystop
     * @for MediaStreamTrack
     * @since 0.10.6
     */
    track.polystop = function () {
      track.stop();
      track.ended = true;

      if (typeof track.onended === 'function') {
        var eventPayload = returnEventPayloadFn(track);
        eventPayload.type = 'ended';
        track.onended(eventPayload);
      }
    };


    setTimeout(function () {
      if (typeof track.onstarted === 'function') {
        var eventPayload = returnEventPayloadFn(track);
        eventPayload.type = 'started';
        track.onstarted(eventPayload);
      }
    }, 1000);
  };


} else if (navigator.webkitGetUserMedia) {

  polyfillMediaStreamTrack = function (track) {

    //track.id = track.id || (new Date()).getTime().toString();

    track.label = track.label || track.kind + '-' + track.id;

    track.ended = false;

    track.enabled = true;

    track.muted = typeof track.muted === 'boolean' ? track.muted : false;

    track.readyState = typeof track.readyState === 'string' ? track.readyState : 'live';

    //track.kind = track.kind;

    track.readOnly = typeof track.readOnly === 'boolean' ? track.readOnly : false;

    track.onended = null;

    track.onstarted = null;

    track.onmute = null;

    track.onunmute = null;

    track.onoverconstrained = null;

    track.onunsupported = null;

    track.polystop = function () {
      track.stop();
      track.ended = true;

      if (typeof track.onended === 'function') {
        var eventPayload = returnEventPayloadFn(track);
        eventPayload.type = 'ended';
        track.onended(eventPayload);
      }
    };


    setTimeout(function () {
      if (typeof track.onstarted === 'function') {
        var eventPayload = returnEventPayloadFn(track);
        eventPayload.type = 'started';
        track.onstarted(eventPayload);
      }
    }, 1000);
  };

} else {

  polyfillMediaStreamTrack = function (track) {

    //track.id = track.id || (new Date()).getTime().toString();

    track.label = track.label || track.kind + '-' + track.id;

    track.ended = false;

    track.enabled = true;

    track.muted = typeof track.muted === 'boolean' ? track.muted : false;

    track.readyState = typeof track.readyState === 'string' ? track.readyState : 'live';

    //track.kind = track.kind;

    track.readOnly = typeof track.readOnly === 'boolean' ? track.readOnly : false;

    track.onended = null;

    track.onstarted = null;

    track.onmute = null;

    track.onunmute = null;

    track.onoverconstrained = null;

    track.onunsupported = null;

    track.polystop = function () {
      if (typeof track.onunsupported === 'function') {
        var eventPayload = returnEventPayloadFn(track);
        eventPayload.type = 'unsupported';
        eventPayload.error = error;
        eventPayload.feature = 'stop';
        track.onunsupported(eventPayload);
      }
    };

    setTimeout(function () {
      if (typeof track.onstarted === 'function') {
        var eventPayload = returnEventPayloadFn(track);
        eventPayload.type = 'started';
        track.onstarted(eventPayload);
      }
    }, 1000);

    return track;
  };
}