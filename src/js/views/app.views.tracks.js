App.module('Views', function( Views, App, Backbone, Marionette, $, _ ) {

  var Tracks = Views.Tracks = Marionette.CollectionView.extend({
    itemView: Views.Track,

    el: '#mixer',

    initialize: function() {
      this.animTick();
      this.unhide();
    },

    animTick: function() {
      App.vent.trigger('anim-tick');
      requestAnimationFrame(this.animTick.bind(this));
    },

    unhide: function() {
      this.$el.css('visibility', 'visible');
    }

  });

});
