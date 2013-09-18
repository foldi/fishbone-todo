/*! ToDo v1.0.0 - 2013-09-18 01:09:56 
 *  Vince Allen 
 *  Brooklyn, NY 
 *  vince@vinceallen.com 
 *  @vinceallenvince 
 *  License: MIT */

var ToDo = {}, exports = ToDo;

(function(exports) {

"use strict";

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
exports.Item = Item;

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
exports.View = View;

var App = Model({
  records: {
    list: [],
    lookup: {}
  },
  idCount: 0,
	init: function(router, doT, form, results, menu) {

    var i, max, result, anchors;

    this.router = router;
    this.doT = doT;
		this.form = form;
    this.form.addEventListener('submit', this.formSubmit);
    this.results = results;
    this.menu = menu;

    // total view
    this.totalView = new View('totalView', Templates.total);
    this.totalView.render({total: this.records.list.length});
    this.menu.querySelector('.left').appendChild(this.totalView.el);

    // events
    this.results.addEventListener('click', this.handleItemClick);
    anchors = document.querySelectorAll('.menuLink');
    for (i = 0, max = anchors.length; i < max; i++) {
      anchors[i].addEventListener('click', this.filter);
    }

    // routes
    this.router.add([
      {path: '#show/:type', handler: this.refresh}
    ]);
    result = this.router.recognize(window.location.hash);
    for (i = 0, max = result.length; i < max; i++) {
      result[i].handler.call(this, result[i].params.type);
    }
	},
  formSubmit: function(e) {
    e.preventDefault();
    var input = e.target.querySelector('input');
    if (input.value) {
      this.createItem(input.value);
      input.value = '';
    }
  },
  createItem: function(name) {
    this.idCount++;
    var item = new Item(this.idCount, name);
    this.records.list.push(item);
    this.records.lookup[this.idCount] = item;
    this.renderItem(item);
    this.totalView.render({total: this.records.list.length});
  },
  updateItem: function(id, attr, val) {
    this.records.lookup[id].update(attr, val);
  },
  deleteItem: function(id) {
    var i, max, rec;
    this.records.lookup[id].delete(id); // removes view from dom
    for (i = 0, max = this.records.list.length; i < max; i++) {
      rec = this.records.list[i];
      if (rec.id === parseInt(id, 10)) {
        rec.off('update', rec.view.render.bind(rec.view, rec)); // remove event listeners
        rec.off('delete', rec.view.remove.bind(rec.view));
        this.records.list.splice(i, 1); // removes ref from list
        delete this.records.lookup[id]; // removes ref from cache
        break;
      }
    }
    this.totalView.render({
      total: this.records.list.length
    });
  },
  renderItem: function(item) {
    item.view = new View(item.id, Templates.item);
    item.view.render({name: item.name});
    this.results.appendChild(item.view.el);
    item.on('update', item.view.render.bind(item.view, item));
    item.on('delete', item.view.remove.bind(item.view));
  },
  handleItemClick: function(e) {
    var id = e.target.parentNode.parentNode.parentNode.parentNode.id,
        rel = e.target.getAttribute('rel');
    if (rel === 'done') {
      this.updateItem(id, 'done', !this.getItemById(id).done);
    } else if (rel === 'delete') {
      this.deleteItem(id);
    }
  },
  filter: function(e) {
    e.preventDefault();
    var i, max, result, url = '#show/' + e.target.rel;
    window.history.pushState(e.target.rel, 'Title', url);
    result = this.router.recognize(url);
    for (i = 0, max = result.length; i < max; i++) {
      result[i].handler.call(this, result[i].params.type);
    }
  },
  refresh: function(filter) {
    var i, max, rec, recs;
    for (i = this.records.list.length - 1; i >= 0; i--) {
      this.records.list[i].view.remove();
    }
    if (filter === 'all') {
      recs = this.records.list;
    } else {
      if (filter === 'active') {
        recs = this.getItemsByAttribute('done', false);
      } else {
        recs = this.getItemsByAttribute('done', true);
      }
    }
    for (i = 0, max = recs.length; i < max; i++) {
      this.renderItem(recs[i]);
    }
  },
  getItemById: function(id) {
    return this.records.lookup[id];
  },
  getItemsByAttribute: function(attr, val) {
    var i, max, rec, recs = [];
    for (i = 0, max = this.records.list.length; i < max; i++) {
      rec = this.records.list[i];
      if (rec[attr] === val) {
        recs.push(rec);
      }
    }
    return recs;
  }
});
exports.App = App;

var Templates = {
	total: '<div id="totalView" class="view">{{? it.total}}{{=it.total}} {{? it.total === 1}}item {{?? }}items {{?}} left{{?}}</div>',
	item: '<table class="item"><tr><td class="detail left" rel="done">done</td><td class="detail middle {{? it.done}}done{{?}}">{{=it.name}}</td><td class="detail right" rel="delete">del</td></tr></table>'
};
exports.Templates = Templates;

}(exports));