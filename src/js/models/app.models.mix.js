App.module('Models', function( Models, App, Backbone, Marionette, $, _ ) {

  'use strict';

  var Mix = Models.Mix = Backbone.Model.extend({

    url: 'mix.json',

    defaults: {
      // mix name
      name      : 'Mix',
      // master gain (0 - 1)
      gain      : 1,
      // playback position (in seconds)
      position  : 0,
      // minimum allowed playback position
      minTime   : 0,
      // maximum allowed playback position
      maxTime   : Infinity,
      // internal value for playback scheduling
      startTime : 0,
      // are we currently playing?
      playing   : false,
      // internal value for VU meters
      dBFSLeft   : -48,
      // internal value for VU meters
      dBFSRight  : -48,
      // internally calculated song duration
      duration  : Infinity
    },

    initialize: function() {
      this.nodes = {};
      this.createNodes();
      this.setGain();
      this.updatePosition();
      App.vent.on('solo', this.soloMute.bind(this));
      App.vent.on('unsolo', this.soloMute.bind(this));
      App.vent.on('anim-tick', this.updatePosition.bind(this));
      this.on('change:gain', this.setGain, this);
      this.on('change:gain', this.persist, this);
    },

    // create audio nodes
    createNodes: function() {
      this.fftSize = 2048;
      this.timeDataL = new Uint8Array(this.fftSize);
      this.timeDataR = new Uint8Array(this.fftSize);
      this.nodes.gain = App.ac.createGain();
      this.nodes.splitter = App.ac.createChannelSplitter(2);
      this.nodes.analyserL = App.ac.createAnalyser();
      this.nodes.analyserR = App.ac.createAnalyser();
      this.nodes.gain.connect(this.nodes.splitter);
      this.nodes.splitter.connect(this.nodes.analyserL, 0, 0);
      this.nodes.splitter.connect(this.nodes.analyserR, 1, 0);
      this.nodes.gain.connect(App.ac.destination);
      this.nodes.analyserL.smoothingTimeConstant = 1;
      this.nodes.analyserR.smoothingTimeConstant = 1;
      return this;
    },

    // set gain
    setGain: function() {
      this.nodes.gain.gain.value = this.get('gain');
      return this;
    },

    // begin playback of all tracks
    // optionally accepts a playback position in seconds
    play: function( pos ) {
      var now = App.ac.currentTime,
        time = this.get('position'),
        max = this.get('tracks').maxLength();
      if ( !App.ready ) {
        throw new Error('Cannot play before App.ready');
      }
      if ( typeof pos === 'number' ) {
        this.set('position', time = Math.max(pos, this.get('minTime')));
      }
      this.set({startTime: now - time, playing: true, duration: max});
      this.get('tracks').play(time);
      return this;
    },

    // pause all tracks
    pause: function() {
      this.get('tracks').pause();
      this.set('playing', false);
      App.vent.trigger('mix-pause');
      return this;
    },

    // get the exact, up-to-date playback position
    exactTime: function(){
      var now = App.ac.currentTime,
        playing = this.get('playing'),
        start = this.get('startTime'),
        position = this.get('position'),
        delta = now - start;
      return playing ? delta : position;
    },

    // periodically update the position attribute (for UI)
    updatePosition: function(){
      var position = this.exactTime(),
        playing = this.get('playing');
      if ( position > Math.min(this.get('maxTime'), this.get('duration')) ) {
        this.play(0).pause();
      } else {
        this.set('position', position, {silent: true});
      }
      return this;
    },

    // selectively apply/remove mutes depending on which tracks
    // are soloed and unsoloed
    soloMute: function() {
      var unsoloed, soloed, _muted;
      if ( this.get('tracks') ) {
        unsoloed = this.get('tracks').where({soloed: false});
        soloed = this.get('tracks').where({soloed: true});
        _muted = this.get('tracks').where({_muted: true});
        // apply _mute to non-soloed tracks
        if ( soloed.length ){
          unsoloed.forEach(function( track ){
            track._mute();
          });
        }
        // remove _mute when nothing is soloed
        if ( !soloed.length ) {
          _muted.forEach(function( track ) {
            track._unmute();
          });
        }
      }
      return this;
    },

    // get dBFS values
    levels: function( e ) {
      var playing = this.get('playing'),
        len = this.timeDataL.length,
        right = new Array(len),
        left = new Array(len),
        i = 0;
      this.nodes.analyserL.getByteTimeDomainData(this.timeDataL);
      this.nodes.analyserR.getByteTimeDomainData(this.timeDataR);
      for ( ; i < len; ++i ) {
        left[i] = ( this.timeDataL[i] * 2 / 255 ) - 1;
        right[i] = ( this.timeDataR[i] * 2 / 255 ) - 1;
      }
      left = App.util.dBFS(left);
      right = App.util.dBFS(right);
      this.set({
        dBFSLeft: playing ? left : -192,
        dBFSRight: playing ? right : -192
      });
      return this;
    },

    // override default parsing to create `tracks` collection
    parse: function( data ) {
      data.tracks = new App.Collections.Tracks(data.tracks);
      data.position = data.position || data.minTime || 0;
      App.tracks = data.tracks.length;
      return _.extend({}, data);
    },

    toJSON: function() {
      var out = _.extend({}, this.attributes),
        tracks = _.map(this.get('tracks').models, function( track ) {
          return track.toJSON();
        });
      out.tracks = tracks;
      delete out.dBFSLeft;
      delete out.dBFSRight;
      delete out.startTime;
      delete out.binURI;
      return out;
    },

    persist: _.debounce(function() {
      var self = App.mix,
        data = self.toJSON(),
        binURI = self.get('binURI');
      delete data.position;
      delete data.playing;
      delete data.duration;
      delete data.binURI;
      data = JSON.stringify(data);
      $.ajax({
        type: binURI ? 'PUT' : 'POST',
        url: binURI || 'http://api.myjson.com/bins',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: data,
        success: function( response ) {
          if ( response.uri ) {
            self.set('binURI', response.uri, {silent: true});
            location.hash = response.uri.split('/').pop();
          }
        }
      });
    }, 500)

  });

});
