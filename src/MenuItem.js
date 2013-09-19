/**
 * @requires Model
 */
var MenuItem = Model({
	init: function(id, props) {
    this.id = id;
	this.name = props.name;
	this.type = props.type;
	this.selected = !!props.selected;
	this.trigger('create');
	},
  update: function(attr, val) {
    this[attr] = val;
    this.trigger('update', this);
  }
});