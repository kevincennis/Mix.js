App.module('Views', function( Views, App, Backbone, Marionette, $, _ ) {

  'use strict';

  var Controls = Views.Controls = Marionette.ItemView.extend({
    template: '#tmpl-controls',

    el: '#controls',

    events: {
      'click .play'       : 'toggle',
      'touchstart .play'  : 'toggle',
      'click .start'      : 'start',
      'touchstart .start' : 'start',
      'click .rw'         : 'rewind',
      'touchstart .rw'    : 'rewind',
      'click .ff'         : 'fastForward',
      'touchstart .ff'    : 'fastForward'
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
      this.render();
    },

    serializeData: function() {
      var data = this.model.toJSON();
      data.playing = data.playing ? '' : 'paused';
      return data;
    },

    toggle: function( ev ) {
      if ( ev && 'ontouchstart' in window && ev.type === 'click' ) {
        return;
      }
      if ( this.model.get('playing') ) {
        this.model.pause();
      } else {
        this.model.play();
      }
    },

    start: function( ev ) {
      if ( ev && 'ontouchstart' in window && ev.type === 'click' ) {
        return;
      }
      this.model.play(0);
      if ( !this.model.get('playing') ) {
        this.model.pause();
      }
    },

    rewind: function( ev ) {
      var pos;
      if ( ev && 'ontouchstart' in window && ev.type === 'click' ) {
        return;
      }
      pos = this.model.get('position');
      if ( this.model.get('playing') ) {
        this.model.play(pos - 10);
      }  else {
        this.model.set('position', pos - 10);
      }
    },

    fastForward: function( ev ) {
      var pos;
      if ( ev && 'ontouchstart' in window && ev.type === 'click' ) {
        return;
      }
      pos = this.model.get('position');
      if ( this.model.get('playing') ) {
        this.model.play(pos + 10);
      }  else {
        this.model.set('position', pos + 10);
      }
    },

    updatePosition: function() {
      var canvas = this.ui.clock[0],
        ctx = canvas.getContext('2d'),
        pos = this.model.attributes.position,
        str = App.util.formatTime(pos),
        ghost = ['8', '8', ':', '8', '8', ':', '8', '8'],
        arr = str.split(''),
        i = 0,
        x = 78;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '76px "digital-7"';
      ctx.textAlign = 'right';
      // draw ghost 7-segment
      // faster to loop twice than to keep changing fillStyle
      ctx.fillStyle = 'hsla(215, 77%, 76%, 0.085)';
      while ( i < 8 ) {
        ctx.fillText(ghost[i], x, 88);
        x += ( ghost[++i] === ':' ? 20 : 40 );
      }
      i = 0;
      x = 78;
      // draw actual position
      ctx.fillStyle = 'hsl(215, 77%, 76%)';
      while ( i < 8 ) {
        ctx.fillText(arr[i], x, 88);
        x += ( arr[++i] === ':' ? 20 : 40 );
      }
    },

    unhide: function() {
      this.$el.show();
    }

  });

});
