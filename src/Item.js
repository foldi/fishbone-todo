var Item = Model({
	init: function(id, name, app) {
    this.id = id;
		this.name = name;
    this.app = app;
    this.done = false;
	},
  update: function(attr, val) {
    this[attr] = val;
    this.trigger('update', this);
  }
});