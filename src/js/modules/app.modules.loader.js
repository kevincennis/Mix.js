App.module('Loader', function( Loader, App, Backbone, Marionette, $, _ ) {

  var

  // jQuery objects
  $elem, $bar,

  // Methods
  init, bindEvents, updatePercent;

  init = function() {
    $elem = $('#loader');
    $bar = $elem.find('.loader-bar');
    bindEvents();
  };

  bindEvents = function() {
    App.vent.on('loaded', updatePercent);
    App.vent.on('ready', function(){
      $elem.hide();
    });
  };

  updatePercent = function() {
    var percent = ( ( App.loaded + 1 ) / App.tracks ) * 100;
    percent = Math.min(percent, 100);
    $bar.css('width', percent + '%');
  };

  init();

});
