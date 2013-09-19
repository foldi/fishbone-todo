/**
 * @requires Model
 */
var ClearCompleted = Model({
	init: function(id, props) {
    this.id = id;
	this.total = props.total;
	this.trigger('create');
	},
  update: function(attr, val) {
    this[attr] = val;
    this.trigger('update', this);
  }
});