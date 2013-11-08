/**
 * Unit tests for App.util
 */

(function(){

  test('app.util.scale', function() {
    var scaled;

    scaled = App.util.scale(-96, -192, 0, 0, 100);
    equal(scaled, 50, '-96(dB) should be scaled to 50(%).');

    scaled = App.util.scale(0, -150, 150, 0, 100);
    equal(scaled, 50,
      '0 should be scaled to 50(%) in a range of -150 to 150.'
    );
  });


  test('app.util.dBToPercent', function() {
    var converted = App.util.dBToPercent(-96);
    equal(converted, 50, '-96(dB) should be converted to 50(%).');
  });


  test('app.util.percentTodB', function() {
    var converted = App.util.percentTodB(50);
    equal(converted, -96, '50(%) should be converted to -96(dB).');
  });

})();
