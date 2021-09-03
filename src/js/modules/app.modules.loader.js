import App from '../appInstance'
import $ from 'jquery'
class Loader {
	constructor() {
		this.$bar = null
		this.$elem = null

		this.updatePercent = this.updatePercent.bind(this)
	}

	init() {
		this.$elem = $('#loader');
		this.$bar = this.$elem.find('.loader-bar');
		this.bindEvents();
	}
  
	bindEvents() {
		App.on('loaded', this.updatePercent);
		App.on('ready', () => {
			this.$elem.hide();
		});
	}
  
	updatePercent() {
		var percent = ( ( App.loaded + 1 ) / App.tracks ) * 100;
		percent = Math.min(percent, 100);
		this.$bar.css('width', percent + '%');
	} 
}

export default Loader
