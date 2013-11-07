// create the Marionette application
var App = window.App = new Backbone.Marionette.Application();

// use mustache
Backbone.Marionette.TemplateCache.prototype.compileTemplate = function( rawTemplate ) {
    return Mustache.compile(rawTemplate);
};

function bindEvents() {
  $(document).on('keyup', function( ev ) {
    var playing = App.mix.get('playing'),
      position = App.mix.get('position');
    switch ( ev.keyCode ) {
      // spacebar
      case 32:
        if ( !playing ) {
          App.mix.play();
        } else {
          App.mix.pause();
        }
        break;
      // r
      case 82:
        App.mix.play(0);
        if ( !playing ) {
          App.mix.pause();
        }
        break;
      // left arrow
      case 37:
        if ( playing ) {
          App.mix.play(position - 10);
        }
        break;
      case 39:
        if ( playing ) {
          App.mix.play(position + 10);
        }
        break;
    }
  });
  $(window).on('mousemove', function( ev ) {
    App.vent.trigger('mixer-mousemove', ev);
  });
  $(window).on('mouseup', function( ev ) {
    App.vent.trigger('mixer-mouseup', ev);
  });
}

// config
App.tracks = 0;
App.loaded = 0;
App.ready = false;

// add an AudioContext
App.ac = new (
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext
)();

// wait for all tracks to be loaded
App.vent.on('loaded', function() {
  if ( ++App.loaded == App.tracks ) {
    App.ready = true;
    App.vent.trigger('ready');
    console.log('App ready');
  }
});

// Build tracks collection view
App.vent.on('ready', function() {
  App.trackViews = new App.Views.Tracks({
    collection: App.mix.attributes.tracks
  });
  App.controlsView = new App.Views.Controls({
    model: App.mix
  });
  App.vuLeft = $('.needle.left');
  App.vuRight = $('.needle.right');
  App.trackViews.render();
  bindEvents();
  App.mix.play();
});

// rAF loop for meters
App.vent.on('anim-tick', function() {
  var left, right;
  if ( !App.vuLeft || !App.vuRight ) {
    return;
  }
  App.mix.levels();
  left = App.mix.get('rmsLeft');
  right = App.mix.get('rmsRight');
  left = Math.max(0, App.util.scale(left, -48, 0, 0, 60));
  right = Math.max(0, App.util.scale(right, -48, 0, 0, 60));
  App.vuLeft.css('transform', 'rotate(' + left + 'deg)');
  App.vuRight.css('transform', 'rotate(' + right + 'deg)');
});

// create the mix and start the app on DOM ready
$(function() {
  App.mix = new App.Models.Mix();
  App.mix.fetch();
  App.start();
});
