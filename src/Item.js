var Item = Model({
	init: function(id, name) {
    this.id = id;
		this.name = name;
    this.done = false;
	},
  update: function(attr, val) {
    this[attr] = val;
    this.trigger('update', this);
  },
  delete: function(id) {
    this.trigger('delete', this);
  }
});