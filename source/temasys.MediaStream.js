(function () {

'use strict';


if (navigator.mozGetUserMedia) {

	/**
	 * The polyfilled MediaStream class.
	 * @class MediaStream
	 * @since 0.10.5
	 */
	var polyfillMedia = function (stream, checkEnded) {

		/**
	   * Event triggered when MediaStream has ended streaming.
	   * @event onended
	   * @for MediaStream
	   * @since 0.10.6
	   */
		stream.onended = function () { };

		/**
	   * Event triggered when MediaStream has added a new track.
	   * @event onaddtrack
	   * @for MediaStream
	   * @since 0.10.6
	   */
		stream.onaddtrack = function () { };

		/**
	   * Event triggered when MediaStream has removed an existing track.
	   * @event onremovetrack
	   * @for MediaStream
	   * @since 0.10.6
	   */
		stream.onremovetrack = function () { };

		/**
	   * Event triggered when a feature in the MediaStream is not supported
	   *   but used.
	   * @event onunsupported
	   * @param {String} type The feature that is not supported.
	   * @param {Error} error The error received natively.
	   * @for MediaStream
	   * @since 0.10.6
	   */
		stream.onunsupported = function () { };



		// Checks if event is subscribed before triggering them
		var runFn = function (event, error) {
			if (typeof stream[event] === 'function') {
				stream[event]({
        	bubbles: false,
        	cancelBubble: false,
        	cancelable: false,
        	currentTarget: stream,
        	defaultPrevented: false,
        	eventPhase: 0,
        	returnValue: true,
        	srcElement: stream,
        	target: stream,
        	error: error,
        	timeStamp: stream.currentTime,
        	type: 'ended'
        });
			}
		};

		/**
		 * Stops a MediaStream streaming.
		 * @method polystop
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polystop = function () {
			stream.stop();
		};

		/**
		 * Gets the list of audio MediaStreamTracks of a MediaStream.
		 * @method polyGetAudioTracks
		 * @return {Array} Returns a list of the audio MediaStreamTracks
		 *   available for the MediaStream.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polyGetAudioTracks = stream.getAudioTracks;

		/**
		 * Gets the list of video MediaStreamTracks of a MediaStream.
		 * @method polyGetVideoTracks
		 * @return {Array} Returns a list of the video MediaStreamTracks
		 *   available for the MediaStream.
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polyGetVideoTracks = stream.getVideoTracks;

		/**
		 * Listens and waits to check if all MediaStreamTracks of a MediaStream
		 *   has ended. Once ended, this invokes the ended flag of the MediaStream.
		 * This loops every second.
		 * @method _polyOnTracksEndedListener
		 * @private
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream._polyOnTracksEndedListener = setInterval(function () {
	    var i, j;

	    var audios = stream.getAudioTracks();
	    var videos = stream.getVideoTracks();

	    var audioEnded = true;
	    var videoEnded = true;

	    // Check for all tracks if ended
	    for (i = 0; i < audios.length; i += 1) {
	      if (audios[i].ended !== true) {
	        audioEnded = false;
	        break;
	      }
	    }

	    for (j = 0; j < videos.length; j += 1) {
	      if (videos[j].ended !== true) {
	        videoEnded = false;
	        break;
	      }
	    }

	    if (audioEnded && videoEnded) {
	      clearInterval(stream._polyOnTracksEndedListener);
	      stream.ended = true;
	    }
	  }, 1000);

	  /**
		 * Listens and waits to check if all MediaStream has ended.
		 * This loops every second.
		 * @method _polyOnEndedListener
		 * @private
		 * @for MediaStream
		 * @since 0.10.6
		 */
		 stream._polyOnEndedListener = checkEnded();

		/**
		 * The flag that indicates if a MediaStream object has ended.
		 * @attribute ended
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.ended = false;

		/**
		 * Adds a MediaStreamTrack to an object.
		 * @method polyAddTrack
		 * @private
		 * @for MediaStream
		 * @since 0.10.6
		 */
		stream.polyAddTrack = function (track) {
			try {
				stream.addTrack(track);
			} catch (error) {
				runFn('onnotsupported', error);
			}
		};

	};

	var checkMediaTracksEnded = function (stream) {
		
	};



	getUserMedia = function (constraints, successCb, failureCb) {

		var polyfillMedia = function (stream) {

			stream.polystop = function () {
      	stream.stop();
      };

      stream._onendedListener = setInterval(function () {
				// If stream has flag ended because of media tracks being stopped
        if (stream.ended) {
          clearInterval(stream._onendedListener);

          // trigger that it has ended
          if (typeof stream.onended === 'function') {
            stream.onended({
            	bubbles: false,
            	cancelBubble: false,
            	cancelable: false,
            	currentTarget: stream,
            	defaultPrevented: false,
            	eventPhase: 0,
            	returnValue: true,
            	srcElement: stream,
            	target: stream,
            	timeStamp: stream.currentTime,
            	type: 'ended'
            });
          }
        }

        if (typeof stream.recordedTime === 'undefined') {
          stream.recordedTime = 0;
        }

        if (stream.recordedTime === stream.currentTime) {
          clearInterval(stream._onendedListener);

          stream.ended = true;

          // trigger that it has ended
          if (typeof stream.onended === 'function') {
            stream.onended({
            	bubbles: false,
            	cancelBubble: false,
            	cancelable: false,
            	currentTarget: stream,
            	defaultPrevented: false,
            	eventPhase: 0,
            	returnValue: true,
            	srcElement: stream,
            	target: stream,
            	timeStamp: stream.currentTime,
            	type: 'ended'
            });
          }

        } else {
          stream.recordedTime = stream.currentTime;
        }
			}, 1000);

			stream.ended = false;

			checkMediaTracksEnded(stream);

			successCb(stream);
		};

		navigator.mozGetUserMedia(constraints, polyfillMedia, failureCb);
	};


	setRemoteMedia = function (stream) {
		// Use a video to attach to check if stream has ended
    var video = document.createElement('video');

    var i, j;

		var audioTracks = stream.getAudioTracks();
    var videoTracks = stream.getVideoTracks();

    // Check for all tracks if ended
    for (i = 0; i < audioTracks.length; i += 1) {
      setMediaTrack( audioTracks[i] );
    }

    for (j = 0; j < videoTracks.length; j += 1) {
      setMediaTrack( videoTracks[j] );
    }

    stream.polystop = function () {
    	try {
    		stream.stop();
    	} catch () {
    		console.warn('MediaStream.stop is current not yet supported. Fallback to stopping all tracks.');

    		var k, l;

    		// Check for all tracks if ended
		    for (k = 0; k < audioTracks.length; k += 1) {
		      audioTracks[k].stop();
		    }

		    for (l = 0; l < videoTracks.length; l += 1) {
		      videoTracks[l].stop();
		    }
    	}
    };

    /**
		 * Checks if MediaStream has ended
		 * @attribute _onendedListener
		 * @type Object
		 * @for MediaStream
		 * @since 0.10.6
		 */
    video._onendedListener = setInterval(function () {
      // If stream has flag ended because of media tracks being stopped
      if (stream.ended) {
        clearInterval(video._onendedListener);

        // trigger that it has ended
        if (typeof stream.onended === 'function') {
          stream.onended({
            	bubbles: false,
            	cancelBubble: false,
            	cancelable: false,
            	currentTarget: stream,
            	defaultPrevented: false,
            	eventPhase: 0,
            	returnValue: true,
            	srcElement: stream,
            	target: stream,
            	timeStamp: stream.currentTime,
            	type: 'ended'
            });
        }
      }

      // Check if mozSrcObject is not empty
      if (typeof video.mozSrcObject === 'object' &&
          video.mozSrcObject !== null) {

        if (video.mozSrcObject.ended === true) {
          clearInterval(video._onendedListener);

          stream.ended = true;

          // trigger that it has ended
          if (typeof stream.onended === 'function') {
            stream.onended({
            	bubbles: false,
            	cancelBubble: false,
            	cancelable: false,
            	currentTarget: stream,
            	defaultPrevented: false,
            	eventPhase: 0,
            	returnValue: true,
            	srcElement: stream,
            	target: stream,
            	timeStamp: stream.currentTime,
            	type: 'ended'
            });
          }
        }
      }
    }, 1000);

		stream.ended = false;

    // Bind the video element to MediaStream object
    stream._onendedListenerObj = video;

    checkMediaTracksEnded(stream);

    window.attachMediaStream(video, stream);
	};

	attachMediaStream = function (element, stream) {
    // If there's an element used for checking stream stop
    // for an instance remote MediaStream for firefox
    // reattachmediastream instead
    if (typeof stream._onendedListenerObj !== 'undefined' &&
      stream instanceof LocalMediaStream === false) {
      window.reattachMediaStream(element, bind._onendedListenerObj);

    // LocalMediaStream
    } else {
      console.log('Attaching media stream');
    	element.mozSrcObject = stream;
    }
  };

} else if (navigator.webkitGetUserMedia) {

	getUserMedia = function (constraints, successCb, failureCb) {
		navigator.webkitGetUserMedia(constraints, function (stream) {

			var i, j;

			var audioTracks = stream.getAudioTracks();
      var videoTracks = stream.getVideoTracks();

      // Check for all tracks if ended
      for (i = 0; i < audioTracks.length; i += 1) {
        setMediaTrack( audioTracks[i] );
      }

      for (j = 0; j < videoTracks.length; j += 1) {
        setMediaTrack( videoTracks[j] );
      }

      stream.polystop = function () {
      	stream.stop();
      };

			successCb(stream);
		}, failureCb);

	};

} else {

	getUserMedia = function (constraints, successCb, failureCb) {
		navigator.getUserMedia(constraints, function(stream) {
      var audioTracks = stream.getAudioTracks();
      var videoTracks = stream.getVideoTracks();

      // Check for all tracks if ended
      for (i = 0; i < audioTracks.length; i += 1) {
        setMediaTrack( audioTracks[i] );
      }

      for (i = 0; i < videoTracks.length; i += 1) {
        setMediaTrack( videoTracks[i] );
      }

      stream.polystop = function () {
      	stream.stop();
      };

     	successCb(stream);
    }, failureCb);
  };
}


})();