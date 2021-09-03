import { Collection } from 'backbone'
import Track from '../models/app.models.track'
import Mix from '../models/app.models.mix'

var Tracks = Collection.extend({

	model: Track,

	// begin playback of all tracks
	play: function( time ) {
		this.each(function( track ) {
			track.play(time);
		});
		return this;
	},

	// pause all tracks
	pause: function() {
		this.each(function( track ) {
			track.pause();
		});
		return this;
	},

	// get max track duration (essentially song length)
	maxLength: function() {
		var durations = Mix.get('tracks').map(function( track ) {
			return track.get('duration');
		});
		return Math.max.apply(Math, durations);
	}

});

export default Tracks