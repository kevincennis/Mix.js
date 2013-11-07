App.module('Views', function( Views, App, Backbone, Marionette, $, _ ) {

  var Controls = Views.Controls = Marionette.ItemView.extend({
    template: '#tmpl-controls',

    el: '#controls',

    events: {
      'click .play'  : 'toggle',
      'click .start' : 'start',
      'click .rw'    : 'rewind',
      'click .ff'    : 'fastForward'
    },

    ui: {
      clock : '.clock'
    },

    modelEvents: {
      'change:playing': 'render'
    },

    initialize: function() {
      this.unhide();
      App.vent.on('anim-tick', function() {
        this.updatePosition();
      }.bind(this));
    },

    serializeData: function() {
      var data = this.model.toJSON();
      data.playing = data.playing ? '' : 'paused';
      return data;
    },

    toggle: function( ev ) {
      if ( this.model.get('playing') ) {
        this.model.pause();
      } else {
        this.model.play();
      }
    },

    start: function() {
      this.model.play(0);
      if ( !this.model.get('playing') ) {
        this.model.pause();
      }
    },

    rewind: function() {
      var pos = this.model.get('position');
      if ( this.model.get('playing') ) {
        this.model.play(pos - 10);
      }  else {
        this.model.set('position', pos - 10);
      }
    },

    fastForward: function() {
      var pos = this.model.get('position');
      if ( this.model.get('playing') ) {
        this.model.play(pos + 10);
      }  else {
        this.model.set('position', pos + 10);
      }
    },

    updatePosition: function() {
      var canvas = this.ui.clock[0],
        ctx = canvas.getContext('2d'),
        pos = this.model.get('position'),
        str = App.util.formatTime(pos),
        ghost = ('88:88:88').split(''),
        arr = str.split('');
        i = 0,
        x = 39;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '38px "digital-7"';
      ctx.textAlign = 'right';
      // draw ghost 7-segment
      // faster to loop twice than to keep changing fillStyle
      while ( i < 8 ) {
        ctx.fillStyle = 'hsla(215, 77%, 76%, 0.085)';
        ctx.fillText(ghost[i], x, 44);
        x += ( ghost[++i] === ':' ? 10 : 20 );
      }
      i = 0;
      x = 39;
      // draw actual position
      while ( i < 8 ) {
        ctx.fillStyle = 'hsl(215, 77%, 76%)';
        ctx.fillText(arr[i], x, 44);
        x += ( arr[++i] === ':' ? 10 : 20 );
      }
    },

    unhide: function() {
      this.$el.show();
    }

  });

});
