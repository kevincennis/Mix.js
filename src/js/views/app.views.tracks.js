import App from '../appInstance'
import { CollectionView } from 'backbone.marionette'
import _ from 'lodash'
import Track from './app.views.track'

const Tracks = CollectionView.extend({
    childView: Track,

    el: '#mixer',

    initialize: function() {
      this.animTick();
      this.unhide();
    },

    animTick: function() {
      App.vent.trigger('anim-tick');
      window.requestAnimationFrame(this.animTick.bind(this));
    },

    unhide: function() {
      this.$el.css('visibility', 'visible');
    }

  });

export default Tracks