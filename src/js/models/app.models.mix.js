App.module('Models', function( Models, App, Backbone, Marionette, $, _ ) {

  var Mix = Models.Mix = Backbone.Model.extend({

    url: 'mix.json',

    defaults: {
      name      : 'Mix',
      gain      : 1,
      position  : 0,
      minTime   : 3,
      maxTime   : Infinity,
      startTime : 0,
      playing   : false,
      rmsLeft   : -48,
      rmsRight  : -48
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
      if ( typeof pos == 'number' ) {
        this.set('position', time = Math.max(pos, this.get('minTime')));
      }
      this.set({startTime: now - time, playing: true, duration: max});
      this.get('tracks').play();
      return this;
    },

    // pause all tracks
    pause: function() {
      this.get('tracks').pause();
      this.set('playing', false);
      App.vent.trigger("mix-pause");
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
        this.play(0);
      } else {
        this.set('position', position, {silent: true});
      }
      return this;
    },

    // selectively apply/remove mutes depending on which tracks
    // are soloed and unsoloed
    soloMute: function() {
      var unsoloed = this.get('tracks').where({soloed: false}),
        soloed = this.get('tracks').where({soloed: true}),
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
      return this;
    },

    // get rms values
    levels: function( e ) {
      var left, right;
      this.nodes.analyserL.getByteTimeDomainData(this.timeDataL);
      this.nodes.analyserR.getByteTimeDomainData(this.timeDataR);
      left = Array.prototype.map.call(this.timeDataL, function( val ) {
        return App.util.scale(val, 0, 255, -1, 1);
      });
      right = Array.prototype.map.call(this.timeDataR, function( val ) {
        return App.util.scale(val, 0, 255, -1, 1);
      });
      left = App.util.rms(left);
      right = App.util.rms(right);
      this.set({
        rmsLeft: this.get('playing') ? left : this.get('rmsLeft') - 0.8,
        rmsRight: this.get('playing') ? right : this.get('rmsRight') - 0.8
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
      delete out.rmsLeft;
      delete out.rmsRight;
      delete out.playing;
      delete out.startTime;
      return out;
    }

  });

});
