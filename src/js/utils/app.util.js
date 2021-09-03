import App from '../appInstance'

// convert a value from one scale to another
// e.g. scale(-96, -192, 0, 0, 100) to convert
// -96 from dB (-192 - 0) to percentage (0 - 100)
export function scale( val, f0, f1, t0, t1 ) {
	return (val - f0) * (t1 - t0) / (f1 - f0) + t0;
};

// convert dBFS to a percentage
export function dBToPercent( dB ) {
	return scale(dB, -192, 0, 0, 100);
}

// convert percentage to dBFS
export function percentTodB( percent ) {
	return scale(percent, 0, 100, -192, 0);
};

// convert samples to seconds
export function samplesToSeconds( samples ) {
	return samples / App.ac.sampleRate;
};

// convert seconds to samples
export function secondsToSamples( time, sampleRate ) {
	return time * App.ac.sampleRate;
};

// clone a Float32Array
export function cloneFloat32Array( ab ) {
	var f32 = new Float32Array(ab.length);
	f32.set(ab);
	return f32;
};

// create an AudioBuffer from an ArrayBuffer
// requires one or more ArrayBuffers
export function createAudioBuffer() {
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
export function cloneAudioBuffer( ab, from, to ) {
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
export function createBufferSource( ab ) {
	var src = App.ac.createBufferSource();
	src.buffer = ab;
	return src;
};

// fetch and decode an audio asset, then pass the AudioBuffer
// to the supplied callback
export function fetchAudioAsset( path, callback ) {
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
export function dBFS( buffer ) {
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
export function formatTime( seconds ) {
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