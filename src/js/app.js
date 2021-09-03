import App from './appInstance'
import * as Marionette from 'backbone.marionette'
import Tracks from './views/app.views.tracks'
import Controls from './views/app.views.controls'
import Mustache from 'mustache'
import Mix from './models/app.models.mix'
import * as Utils from './utils/app.util'
import $ from 'jquery'

// use mustache
var tmplCache = Marionette.TemplateCache;
tmplCache.prototype.compileTemplate = function( rawTemplate ) {
  return Mustache.render.bind(this, rawTemplate)
};

function bindEvents() {
  $(document).on('keyup', function( ev ) {
    var playing = Mix.get('playing'),
      position = Mix.get('position');
    switch ( ev.keyCode ) {
      // spacebar
      case 32:
        if ( !playing ) {
          Mix.play();
        } else {
          Mix.pause();
        }
        break;
      // r
      case 82:
        Mix.play(0);
        if ( !playing ) {
          Mix.pause();
        }
        break;
      // left arrow
      case 37:
        if ( playing ) {
          Mix.play(position - 10);
        }
        break;
      case 39:
        if ( playing ) {
          Mix.play(position + 10);
        }
        break;
    }
  });
  $(window).on('mousemove touchmove', function( ev ) {
    App.vent.trigger('mixer-mousemove', ev);
    if ( ev.type === 'touchmove' ) {
      ev.preventDefault();
    }
  });
  $(window).on('mouseup touchend', function( ev ) {
    App.vent.trigger('mixer-mouseup', ev);
  });
  $('#master .fader').on( 'mousedown touchstart', App.enableDrag );
  $('#master .fader').on( 'dblclick', App.resetFader );
  App.vent.on('mixer-mouseup', App.disableDrag );
  App.vent.on('mixer-mousemove', App.dragHandler );
}

// config
App.tracks = 0;
App.loaded = 0;
App.ready = false;

App.vuLeftData = [];
App.vuRightData = [];

// wait for all tracks to be loaded
App.vent.on('loaded', function() {
  var top;
  if ( ++App.loaded === App.tracks ) {
    App.ready = true;
    App.vent.trigger('ready');
    top = Utils.scale( Mix.get('gain'), 0, 1.5, 314, 0 );
    $('#master .fader').css( 'top', top + 'px' );
  }
});

// Build tracks collection view
App.vent.on('ready', function() {
  App.trackViews = new Tracks({
    collection: Mix.attributes.tracks
  });
  App.controlsView = new Controls({
    model: Mix
  });
  App.vuLeft = $('.needle.left');
  App.vuRight = $('.needle.right');
  App.trackViews.render();
  bindEvents();
  if ( !('ontouchstart' in window) ) {
    Mix.play();
  }
});

// rAF loop for meters
App.vent.on('anim-tick', function() {
  var left, right;
  if ( !App.vuLeft || !App.vuRight || window.innerWidth <= 1200 ) {
    return;
  }
  Mix.levels();
  left = Mix.get('dBFSLeft');
  right = Mix.get('dBFSRight');
  left = Math.max( -20, Utils.scale(left + 20, -20, 0, 0, 60 ) );
  right = Math.max( -20, Utils.scale(right + 20, -20, 0, 0, 60 ) );

  App.vuLeftData.unshift( left );
  App.vuRightData.unshift( right );

  if ( App.vuLeftData.length >= 18 ) {
    App.vuLeftData.length = 18;
  }

  if ( App.vuRightData.length > 18 ) {
    App.vuRightData.length = 18;
  }

  left = App.vuLeftData.reduce(function( sum, curr ) {
    return sum + curr;
  }, 0 ) / App.vuLeftData.length;

  right = App.vuRightData.reduce(function( sum, curr ) {
    return sum + curr;
  }, 0 ) / App.vuRightData.length;

  App.vuLeft.css('transform', 'rotate(' + left + 'deg)');
  App.vuRight.css('transform', 'rotate(' + right + 'deg)');
});

App.dragState = {
  x: null,
  y: null,
  px: null,
  prop: null,
  $target: null
};

App.enableDrag = function( ev ) {
  var $elem = $( ev.currentTarget ), deg, touch;
  if ( $elem.hasClass('fader') ) {
    App.faderCanDrag = true;
    App.dragState.px = parseInt( $elem.css('top'), 10 );
  }
  if ( ev.type === 'touchstart' && ev.originalEvent.changedTouches ) {
    touch = ev.originalEvent.changedTouches[ 0 ];
    App.dragState.x = touch.pageX;
    App.dragState.y = touch.pageY;
  } else {
    App.dragState.x = ev.pageX;
    App.dragState.y = ev.pageY;
  }
  App.dragState.$target = $elem;
};

App.disableDrag = function() {
  if ( App.faderCanDrag ) {
    App.faderCanDrag = false;
  }
};

App.dragHandler = function( ev ) {
  if ( !App.faderCanDrag ) {
    return;
  }

  var touch = ev.type === 'touchmove' && ev.originalEvent.changedTouches,
    pos = touch && touch[ 0 ] ? touch[ 0 ].pageY : ev.pageY,
    state = App.dragState.y,
    delta = pos - state,
    css = App.dragState.px + delta;
  css = Math.min( 314, css );
  css = Math.max( 0, css );
  App.dragState.$target.css('top', css + 'px');
  Mix.set( 'gain', Utils.scale( css, 0, 314, 1.5, 0 ) );
};

App.resetFader = function() {
  var top = Utils.scale( 1, 0, 1.5, 314, 0 );
  $('#master .fader').css( 'top', top + 'px' );
  Mix.set( 'gain', 1 );
};

// create the mix and start the app on DOM ready
$(function() {
  var hash = location.hash.substr(1), blob, url;
  function startup() {
    Mix.fetch();
    App.start();
  }
  if ( location.hash ) {
    $.ajax({
      url: 'http://api.myjson.com/bins/' + hash,
      type: 'GET',
      dataType: 'json',
      success: function( json ) {
        try {
          blob = new Blob([JSON.stringify(json)]);
          url = window.URL.createObjectURL(blob);
          Mix.url = url;
        } catch ( e ) {}
        startup();
      },
      error: startup
    });
  } else {
    startup();
  }
});

export default App