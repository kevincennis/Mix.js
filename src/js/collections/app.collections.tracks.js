App.module('Collections', function( Collections, App, Backbone, Marionette, $, _ ) {

  var Tracks = Collections.Tracks = Backbone.Collection.extend({

    model: App.Models.Track,

    // begin playback of all tracks
    play: function() {
      this.each(function( track ) {
        track.play();
      });
      return this;
    },

    // pause all tracks
    pause: function() {
      this.each(function( track ) {
        track.pause();
      });
      return this;
    }

  });

});
