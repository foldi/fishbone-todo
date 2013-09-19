/**
 * @requires Model
 */
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