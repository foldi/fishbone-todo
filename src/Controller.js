/**
 * @requires Model
 */
var Controller = Model({
	init: function(app, el, opt_events) {
    this.app = app;
    this.el = el;
    this.events = opt_events || [];
	},
  addEvents: function(view) {
    for (var i in this.events) {
      if (this.events.hasOwnProperty(i)) {
        view.el.addEventListener(i, this[this.events[i]]);
      }
    }
  },
  removeEvents: function(view) {
    for (var i in this.events) {
      if (this.events.hasOwnProperty(i)) {
        view.el.removeEventListener(i, this[this.events[i]]);
      }
    }
  },
  create: function() {
    throw new Error('create() is not implemented.');
  },
  render: function(item, template) { // initial render
    item.view = new View(item.id, template);
    item.view.render(item);
    this.addEvents(item.view);
    item.view.el.innerHTML = item.view.template(item);
    this.el.appendChild(item.view.el);
  },
  updateView: function(item) {
    item.view.render(item);
  },
  removeView: function(item) {
    this.removeEvents(item.view);
    item.view.remove();
  },
  updateItem: function(id, attr, val) {
    this.app.records.lookup[id].update(attr, val);
    this.trigger('updateItem');
  },
  removeItem: function(id) {
    this.app.records.lookup[id].remove(this.app.records);
    this.trigger('removeItem');
  },
  getItemIdByDOMNode: function(target) {
    var id = null,
        node = target;
    if (node.id) {
      return node.id;
    }
    while(!id) {
      if (node.parentNode.id || node.parentNode === document.body) {
        id = node.parentNode.id;
      } else {
        node = node.parentNode;
      }
    }
    return id;
  },
  getItemById: function(id) {
    return this.app.records.lookup[id];
  },
  getItemsByAttribute: function(attr, val) {
    var i, max, records = this.app.records, rec, recs = [];
    for (i = 0, max = records.list.length; i < max; i++) {
      rec = records.list[i];
      if (rec[attr] === val) {
        recs.push(rec);
      }
    }
    return recs;
  }
});