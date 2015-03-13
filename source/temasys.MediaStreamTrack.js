if (navigator.mozGetUserMedia) {

	setMediaTrack = function (track) {

    track.polystop = function () {
      track.stop();
      track.ended = true;

      if (typeof track.onended === 'function') {
        track.onended();
      }
    };

    track.polyenable = function () {
      track.enabled = true;

      if (typeof track.onenable === 'function') {
        track.onenable();
      }
    };

    track.polydisable = function () {
      track.enabled = false;

      if (typeof track.ondisable === 'function') {
        track.ondisable();
      }
    };

    track.muted = typeof track.muted === 'boolean' ? track.muted : false;
    track.readyState = typeof track.readyState === 'string' ? track.readyState : 'live';
    track.ended = false;

  };


} else if (navigator.webkitGetUserMedia) {

  setMediaTrack = function (track) {

    track.polystop = function () {
      track.stop();
      track.ended = true;

      if (typeof track.onended === 'function') {
        track.onended();
      }
    };

    track.polyenable = function () {
      track.enabled = true;

      if (typeof track.onenable === 'function') {
        track.onenable();
      }
    };

    track.polydisable = function () {
      track.enabled = false;

      if (typeof track.ondisable === 'function') {
        track.ondisable();
      }
    };

    track.muted = typeof track.muted === 'boolean' ? track.muted : false;
    track.readyState = typeof track.readyState === 'string' ? track.readyState : 'live';
    track.ended = false;

  };

} else {

  setMediaTrack = function (track) {

    track.polystop = function () {
      track.stop();
      track.ended = true;

      if (typeof track.onended === 'function') {
        track.onended();
      }
    };

    track.polyenable = function () {
      track.enabled = true;

      if (typeof track.onenable === 'function') {
        track.onenable();
      }
    };

    track.polydisable = function () {
      track.enabled = false;

      if (typeof track.ondisable === 'function') {
        track.ondisable();
      }
    };

    track.muted = typeof track.muted === 'boolean' ? track.muted : false;
    track.readyState = typeof track.readyState === 'string' ? track.readyState : 'live';
    track.ended = false;
  };
}