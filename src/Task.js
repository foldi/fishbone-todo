/**
 * @requires Model
 */
var Task = Model({
	init: function(id, props) {
    this.id = id;
		this.name = props.name;
    this.done = false;
	},
  update: function(attr, val) {
    this[attr] = val;
    this.trigger('update', this);
  },
  remove: function(records) {
    for (var i = 0, max = records.list.length; i < max; i++) {
      if (this === records.list[i]) {
        records.list.splice(i, 1); // removes ref from list
        break;
      }
    }
    delete records.lookup[this.id]; // removes ref from cache
    this.trigger('remove', this);
    this.off('update', this.updateView); // remove event listeners
    this.off('remove', this.removeView);
  }
});