App.module('Collections', function( Collections, App, Backbone,
  Marionette, $, _ ) {

  'use strict';

  var Tracks = Collections.Tracks = Backbone.Collection.extend({

    model: App.Models.Track,

    // begin playback of all tracks
    play: function( time ) {
      this.each(function( track ) {
        track.play(time);
      });
      return this;
    },

    // pause all tracks
    pause: function() {
      this.each(function( track ) {
        track.pause();
      });
      return this;
    },

    // get max track duration (essentially song length)
    maxLength: function() {
      var durations = App.mix.get('tracks').map(function( track ) {
        return track.get('duration');
      });
      return Math.max.apply(Math, durations);
    }

  });

});
