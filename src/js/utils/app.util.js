App.module('util', function( util, App, Backbone, Marionette, $, _ ) {

  'use strict';

  // convert a value from one scale to another
  // e.g. App.util.scale(-96, -192, 0, 0, 100) to convert
  // -96 from dB (-192 - 0) to percentage (0 - 100)
  util.scale = function( val, f0, f1, t0, t1 ) {
    return (val - f0) * (t1 - t0) / (f1 - f0) + t0;
  };

  // convert dBFS to a percentage
  util.dBToPercent = function( dB ) {
    return util.scale(dB, -192, 0, 0, 100);
  };

  // convert percentage to dBFS
  util.percentTodB = function( percent ) {
    return util.scale(percent, 0, 100, -192, 0);
  };

  // convert samples to seconds
  util.samplesToSeconds = function( samples ) {
    return samples / App.ac.sampleRate;
  };

  // convert seconds to samples
  util.secondsToSamples = function( time, sampleRate ) {
    return time * App.ac.sampleRate;
  };

  // clone a Float32Array
  util.cloneFloat32Array = function( ab ) {
    var f32 = new Float32Array(ab.length);
    f32.set(ab);
    return f32;
  };

  // create an AudioBuffer from an ArrayBuffer
  // requires one or more ArrayBuffers
  util.createAudioBuffer = function() {
    var args = _.toArray(arguments),
      sr = App.ac.sampleRate,
      channels = args.length,
      len = Math.max.apply(Math, _.map(args, function( ab ) {
        return ab.length;
      })),
      buf = App.ac.createBuffer(channels, len, sr);
    while ( channels-- ) {
      buf.getChannelData(channels).set(args[channels]);
    }
    return buf;
  };

  // clone an AudioBuffer instance
  // requires an AudioBuffer
  // optionally accepts from and to (both integers) for slicing
  util.cloneAudioBuffer = function( ab, from, to ) {
    var channels = ab.numberOfChannels,
      sr = App.ac.sampleRate,
      start = from || 0,
      end = to || ab.length,
      len = end - start,
      buf = App.ac.createBuffer(channels, len, sr),
      clone;
    while ( channels-- ) {
      clone = ab.getChannelData(channels).subarray(from, to);
      buf.getChannelData(channels).set(clone);
    }
    return buf;
  };

  // create a new BufferSource from an AudioBuffer instance
  // requires an AudioBuffer
  util.createBufferSource = function( ab ) {
    var src = App.ac.createBufferSource();
    src.buffer = ab;
    return src;
  };

  // fetch and decode an audio asset, then pass the AudioBuffer
  // to the supplied callback
  util.fetchAudioAsset = function( path, callback ) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.responseType = 'arraybuffer';
    xhr.addEventListener('load', function() {
      App.ac.decodeAudioData(xhr.response, function( buffer ){
        callback(buffer);
      });
    }, false);
    xhr.send();
  };

  // calculate the dBFS value of an ArrayBuffer
  util.dBFS = function( buffer ) {
    var len = buffer.length,
      total = 0,
      i = 0,
      rms,
      db;

    while ( i < len ) {
      total += ( buffer[i] * buffer[i++] );
    }

    rms = Math.sqrt( total / len );
    db  = 20 * ( Math.log(rms) / Math.LN10 );
    return Math.max(-192, db);
  };

  // format seconds as 00:00:00
  util.formatTime = function( seconds ) {
    var ms = Math.floor( ( seconds * 1000 ) % 1000 ),
      s = Math.floor( seconds % 60 ),
      m = Math.floor( ( seconds * 1000 / ( 1000 * 60 ) ) % 60 ),
      str = '';
    s = s < 10 ? '0' + s : s;
    m = m < 10 ? '0' + m : m;
    ms = ms < 10  ? '0' + ms : ms;
    str += ( m + ':' );
    str += ( s + ':');
    str += ms.toString().slice(0,2);
    return str;
  };

});
