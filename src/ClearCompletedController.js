/**
 * @requires ClearCompleted, Task
 * @extends {Controller}
 */
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