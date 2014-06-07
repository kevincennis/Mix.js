App.module('Views', function( Views, App, Backbone, Marionette, $, _ ) {

  'use strict';

  var Track = Views.Track = Marionette.ItemView.extend({
    template: '#tmpl-track',

    events: {
      'mousedown .fader'   : 'enableDrag',
      'touchstart .fader'  : 'enableDrag',
      'dblclick .fader'    : 'resetFader',
      'mousedown .panner'  : 'enableDrag',
      'touchstart .panner' : 'enableDrag',
      'dblclick .panner'   : 'resetPanner',
      'click .mute'        : 'mute',
      'touchstart .mute'   : 'mute',
      'click .solo'        : 'solo',
      'touchstart .solo'   : 'solo',
      'click .afl'         : 'afl',
      'touchstart .afl'    : 'afl'
    },

    ui: {
      canvas: '.meter'
    },

    modelEvents: {
      'change:muted': 'render',
      'change:soloed': 'render',
      'change:afl': 'render'
    },

    initialize: function() {
      App.vent.on('mixer-mouseup', this.disableDrag.bind(this));
      App.vent.on('mixer-mousemove', this.dragHandler.bind(this));
      App.vent.on('anim-tick', this.drawMeter.bind(this));
      App.vent.on('mix-pause', function() {
        setTimeout(function(){
          this.drawMeter();
        }.bind(this), 50);
      }.bind(this));
    },

    onBeforeRender: function() {
      this.$el.addClass('channel');
    },

    onRender: function() {
      var canvas = this.ui.canvas[0],
        height = canvas.height,
        width = canvas.width,
        hue = 180,
        i = 0,
        ctx;
      this.offscreen = document.createElement('canvas');
      this.offscreen.width = canvas.width;
      this.offscreen.height = canvas.height;
      ctx = this.offscreen.getContext('2d');
      ctx.fillStyle = 'hsl(' + hue + ', 100%, 40%)';
      while ( i < height ) {
        hue += ( ( 1 - i / height ) * 0.6 );
        ctx.fillStyle = 'hsl(' + hue + ', 100%, 40%)';
        ctx.fillRect(0, height - i, width, 2);
        i += 3;
      }
    },

    serializeData: function() {
      var data = this.model.toJSON();
      data.gain = App.util.scale(Math.sqrt(data.gain), 0, 1.15, 220, 0);
      data.pan = App.util.scale(data.pan, -1, 1, -150, 150);
      data.muted = data.muted ? 'active' : '';
      data.soloed = data.soloed ? 'active' : '';
      data.afl = data.afl ? '' : 'active';
      return data;
    },

    faderCanDrag: false,

    pannerCanDrag: false,

    dragState: {
      x: null,
      y: null,
      px: null,
      prop: null,
      $target: null
    },

    enableDrag: function( ev ) {
      var $elem = $(ev.currentTarget), deg, touch;
      if ( $elem.hasClass('fader') ) {
        this.faderCanDrag = true;
        this.dragState.px = parseInt($elem.css('top'), 10);
      } else if ( $elem.hasClass('panner') ) {
        this.pannerCanDrag = true;
        this.dragState.width = parseInt($elem.width());
        this.dragState.height = parseInt($elem.height());
        this.dragState.offset = $elem.offset();
      }
      if ( ev.type === 'touchstart' && ev.originalEvent.changedTouches ) {
        touch = ev.originalEvent.changedTouches[0];
        this.dragState.x = touch.pageX;
        this.dragState.y = touch.pageY;
      } else {
        this.dragState.x = ev.pageX;
        this.dragState.y = ev.pageY;
      }
      this.dragState.$target = $elem;
    },

    disableDrag: function( ev ) {
      if ( this.faderCanDrag || this.pannerCanDrag ) {
        this.faderCanDrag = false;
        this.pannerCanDrag = false;
      }
    },

    dragFader: function( ev, max ) {
      var touch = ev.type === 'touchmove' && ev.originalEvent.changedTouches,
        pos = touch && touch[0] ? touch[0].pageY : ev.pageY,
        state = this.dragState.y,
        delta = pos - state,
        css = this.dragState.px + delta;
      css = Math.min(max, css);
      css = Math.max(0, css);
      this.dragState.$target.css('top', css + 'px');
      this.model.set('gain', Math.pow(App.util.scale(css, 0, 220, 1.15, 0), 2));
    },

    dragPanner: function( ev ) {
      var touch = ev.type === 'touchmove' && ev.originalEvent.changedTouches,
        width = this.dragState.width,
        height = this.dragState.height,
        offset = this.dragState.offset,
        top = touch && touch[0] ? touch[0].pageY : ev.pageY,
        left = touch && touch[0] ? touch[0].pageX : ev.pageX,
        a = offset.left + ( width / 2 ) - left,
        b = offset.top + ( height / 2 ) - top,
        deg = -1 * Math.atan2( a, b ) * ( 180 / Math.PI );
      if ( deg >= -150 && deg <= 150 ) {
        this.dragState.$target.css('transform', 'rotate(' + deg + 'deg)');
        this.model.set('pan', App.util.scale(deg, -150, 150, -1, 1));
      }
    },

    dragHandler: function( ev ) {
      if ( this.faderCanDrag ) {
        this.dragFader(ev, 220);
      } else if ( this.pannerCanDrag ) {
        this.dragPanner(ev);
      }
    },

    resetFader: function() {
      var top = App.util.scale(1, 0, 1.15, 220, 0);
      this.$el.find('.fader').css('top', top + 'px');
      this.model.set('gain', 1);
    },

    resetPanner: function() {
      this.$el.find('.panner').css('transform', 'rotate(0deg)');
      this.model.set('pan', 0);
    },

    mute: function( ev ) {
      var muted;
      if ( ev && 'ontouchstart' in window && ev.type === 'click' ) {
        return;
      }
      muted = this.model.get('muted');
      if ( muted ) {
        this.model.unmute();
      } else {
        this.model.mute();
      }
    },

    solo: function( ev ) {
      var soloed;
      if ( ev && 'ontouchstart' in window && ev.type === 'click' ) {
        return;
      }
      soloed = this.model.get('soloed');
      if ( soloed ) {
        this.model.unsolo();
      } else {
        this.model.solo();
      }
    },

    afl: function( ev ) {
      if ( ev && 'ontouchstart' in window && ev.type === 'click' ) {
        return;
      }
      this.model.set('afl', !this.model.get('afl'));
    },

    drawMeter: function() {
      if ( typeof this.ui.canvas !== 'string' ) {
        this.model.levels();
        var canvas = this.ui.canvas[0],
          ctx = canvas.getContext('2d'),
          dBFS = this.model.attributes.dBFS,
          gain = this.model.attributes.gain,
          afl = this.model.attributes.afl,
          height = this.cHeight || ( this.cHeight = canvas.height ),
          width = this.cWidth || ( this.cWidth = canvas.width ),
          scaled = App.util.scale(-dBFS, 48, 0, 0, height),
          now = Date.now(),
          peakTime = this.peakTime || -Infinity,
          peak = this.peak || 0,
          timeDiff = now - peakTime,
          freshness;
        if ( afl ) {
          scaled = scaled * gain;
        }
        scaled = Math.max(0, scaled - ( scaled % 3 ));
        if ( this.dirty ) {
          ctx.clearRect(0, 0, width, height);
          this.dirty = false;
        }
        if ( scaled >= 3 ) {
          ctx.drawImage(this.offscreen, 0, height - scaled, width, scaled,
            0, height - scaled, width, scaled
          );
          this.dirty = true;
        }
        // save new peak
        if ( scaled >= peak ) {
          peak = this.peak = scaled;
          this.peakTime = now;
          timeDiff = 0;
        }
        // draw existing peak
        if ( timeDiff < 1000 && peak >= 1 ) {
          // for first 650 ms, use full alpha, then fade out
          freshness = timeDiff < 650 ? 1 : 1 - ( ( timeDiff - 650 ) / 350 );
          ctx.fillStyle = 'rgba(238,119,85,' + freshness + ')';
          ctx.fillRect(0, height - peak - 1, width, 1);
          this.dirty = true;
        // clear peak
        } else {
          this.peak = 0;
          this.peakTime = now;
        }
      }
    }

  });

});
