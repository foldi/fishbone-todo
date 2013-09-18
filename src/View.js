var View = Model({
	init: function(id, template) {
    this.el = document.createElement('div');
    this.el.id = id;
    this.el.className = 'view';
    this.template = doT.template(template);
	},
  render: function(data) {
    this.el.innerHTML = this.template(data);
  },
  remove: function() {
    if (this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  }
});