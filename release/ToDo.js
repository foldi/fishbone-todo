/*! ToDo v1.1.0 - 2013-09-19 04:09:59 
 *  Vince Allen 
 *  Brooklyn, NY 
 *  vince@vinceallen.com 
 *  @vinceallenvince 
 *  License: MIT */

var ToDo = {}, exports = ToDo;

(function(exports) {

"use strict";

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
exports.Controller = Controller;

var Templates = {
	task: '<table class="item"><tr><td class="detail left"><a class="action" rel="done">done</a></td><td class="detail middle {{? it.done}}done{{?}}">{{=it.name}}</td><td class="detail right"><a class="action" rel="remove">del</a></td></tr></table>',
	menuItem: '<a id="{{=it.id}}" class="menuItem {{? it.selected}}selected{{?}}" rel="{{=it.type}}" href="#">{{=it.name}}</a>',
	totalTasks: '<span>{{? it.total}}{{=it.total}} {{? it.total === 1}}item {{?? }}items {{?}} left{{?}}</span>',
	clearCompleted: '{{? it.total}}<a class="clearCompletedItem">clear done ({{=it.total}})</a>{{?}}'
};
exports.Templates = Templates;

var App = Model({
  records: {
    list: [],
    lookup: {}
  },
  idCount: 0,
	init: function(router, doT, form) {

    var i, max, result, anchors;

    this.router = router;
    this.doT = doT;
		this.form = form;
    this.form.addEventListener('submit', this.formSubmit);

    // CONTROLLERS

    //// totalTasks
    this.totalTasksController = new TotalTasksController(this, document.getElementById('totalTasks'));
    var totalTasks = this.totalTasksController.create({
      total: this.totalTasksController.getTotalTasks()
    });
    this.totalTasksController.render(totalTasks, Templates.totalTasks);

    //// clearCompleted
    this.clearCompletedController = new ClearCompletedController(this, document.getElementById('clearCompleted'), {
      'click': 'click'
    });
    var clearCompleted = this.clearCompletedController.create({
      total: this.clearCompletedController.getTotalCompleted()
    });
    this.clearCompletedController.render(clearCompleted, Templates.clearCompleted);
    this.clearCompletedController.on('removeItem', this.totalTasksController.updateTotal.bind(this.totalTasksController, totalTasks));

    //// task
    this.taskController = new TaskController(this, document.getElementById('tasks'), {
      'click': 'click'
    });
    this.taskController.on('createItem', this.totalTasksController.updateTotal.bind(this.totalTasksController, totalTasks));
    this.taskController.on('updateItem', this.clearCompletedController.updateTotal.bind(this.clearCompletedController, clearCompleted));
    this.taskController.on('removeItem', this.totalTasksController.updateTotal.bind(this.totalTasksController, totalTasks));
    
    //// menuItem
    this.menuItemController = new MenuItemController(this, document.getElementById('menuItems'), {
      'click': 'click'
    });
    var all = this.menuItemController.create({
      name: 'all',
      type: 'all',
      selected: true
    });
    this.menuItemController.render(all, Templates.menuItem);

    var active = this.menuItemController.create({
      name: 'active',
      type: 'active'
    });
    this.menuItemController.render(active, Templates.menuItem);

    var complete = this.menuItemController.create({
      name: 'complete',
      type: 'complete'
    });
    this.menuItemController.render(complete, Templates.menuItem);

    // ROUTES
    
    this.router.add([
      {path: '#/show/:type', handler: this.taskController.refresh}
    ]);
    result = this.router.recognize(window.location.hash);
    if (result) {
      for (i = 0, max = result.length; i < max; i++) {
        result[i].handler.call(this, result[i].params.type);
      }
    }

	},
  formSubmit: function(e) {
    e.preventDefault();
    var input = e.target.querySelector('input');
    if (input.value) {
      var task = this.taskController.create({
        name: input.value
      });
      this.taskController.render(task, Templates.task);
      input.value = '';
    }
  }
});
exports.App = App;

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
exports.ClearCompleted = ClearCompleted;

var ClearCompletedController = Controller.extend({
  create: function(props) {
    var inst = new ClearCompleted(++this.app.idCount, props);
    inst.on('update', this.updateView);
    inst.on('remove', this.removeView);
    this.app.records.list.push(inst);
    this.app.records.lookup[inst.id] = inst;
    this.trigger('createItem');
    return inst;
  },
  getTotalCompleted: function() {
    var i, record, records = this.app.records, total = 0;
    for (i = records.list.length - 1; i >= 0; i--) {
      record = records.list[i];
      if (record instanceof Task && record.done) {
        total++;
      }
    }
    return total;
  },
  updateTotal: function(item) {
    this.updateItem(item.id, 'total', this.getTotalCompleted());
  },
  click: function() {
    var i, record, records = this.app.records, clearCompleted;
    for (i = records.list.length - 1; i >= 0; i--) {
      record = records.list[i];
      if (record instanceof Task && record.done) {
        this.removeItem(record.id);
      } else if (record instanceof ClearCompleted) {
        clearCompleted = record;
      }
    }
    this.updateTotal(clearCompleted);
    this.trigger('removeItem');
  }
});
exports.ClearCompletedController = ClearCompletedController;

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
exports.MenuItem = MenuItem;

var MenuItemController = Controller.extend({
  create: function(props) {
    var inst = new MenuItem(++this.app.idCount, props);
    inst.on('update', this.updateView);
    inst.on('remove', this.removeView);
    this.app.records.list.push(inst);
    this.app.records.lookup[inst.id] = inst;
    this.trigger('createItem');
    return inst;
  },
  click: function(e) {
    var i, max, record, records = this.app.records,
        recs, id = this.getItemIdByDOMNode(e.target),
        rel = e.target.getAttribute('rel');

    // get all menu items and set selected = false
    for (i = records.list.length - 1; i >= 0; i--) {
      record = records.list[i];
      if (record instanceof MenuItem) {
        this.updateItem(record.id, 'selected', false);
      }
    }

    // set this selected = true
    this.updateItem(id, 'selected', true);

    // build a url and push it to the history
    e.preventDefault();
    var result, url = '#/show/' + e.target.rel;
    window.history.pushState(e.target.rel, 'ToDo', url);
    result = this.app.router.recognize(url);
    for (i = 0, max = result.length; i < max; i++) {
      result[i].handler.call(this, result[i].params.type);
    }
  }
});
exports.MenuItemController = MenuItemController;

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
exports.Task = Task;

var TaskController = Controller.extend({
  create: function(props) {
    var inst = new Task(++this.app.idCount, props);
    inst.on('update', this.updateView);
    inst.on('remove', this.removeView);
    this.app.records.list.push(inst);
    this.app.records.lookup[inst.id] = inst;
    this.trigger('createItem');
    return inst;
  },
  click: function(e) {
    var id = this.getItemIdByDOMNode(e.target),
        rel = e.target.getAttribute('rel');
    if (rel === 'done') {
      this.updateItem(id, 'done', !this.getItemById(id).done);
    } else if (rel === 'remove') {
      this.removeItem(id);
    }
  },
  refresh: function(filter) {
    var i, max, record, records = this.app.records, rec, recs;
    for (i = records.list.length - 1; i >= 0; i--) {
      record = records.list[i];
      if (record instanceof Task) {
        record.view.remove();
      }
    }
    if (filter === 'all') {
      recs = records.list;
    } else {
      if (filter === 'active') {
        recs = this.getItemsByAttribute('done', false);
      } else {
        recs = this.getItemsByAttribute('done', true);
      }
    }
    for (i = 0, max = recs.length; i < max; i++) {
      rec = recs[i];
      if (rec instanceof Task) {
        this.render(rec, Templates.task);
      }
    }
  }
});
exports.TaskController = TaskController;

var TotalTasks = Model({
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
exports.TotalTasks = TotalTasks;

var TotalTasksController = Controller.extend({
  create: function(props) {
    var inst = new TotalTasks(++this.app.idCount, props);
    inst.on('update', this.updateView);
    inst.on('remove', this.removeView);
    this.app.records.list.push(inst);
    this.app.records.lookup[inst.id] = inst;
    this.trigger('createItem');
    return inst;
  },
  getTotalTasks: function() {
    var i, record, records = this.app.records, total = 0;
    for (i = records.list.length - 1; i >= 0; i--) {
      record = records.list[i];
      if (record instanceof Task) {
        total++;
      }
    }
    return total;
  },
  updateTotal: function(item) {
    this.updateItem(item.id, 'total', this.getTotalTasks());
  }
});
exports.TotalTasksController = TotalTasksController;

}(exports));