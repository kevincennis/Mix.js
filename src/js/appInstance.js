import { Application } from 'backbone.marionette'

var App = new Application();

// add an AudioContext
App.ac = (function( w ) {
	var Ac = w.AudioContext || w.webkitAudioContext || w.mozAudioContext;
	return new Ac();
}(window));

export default App