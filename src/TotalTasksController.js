/**
 * @requires TotalTasks, Task
 * @extends {Controller}
 */
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