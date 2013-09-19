/**
 * @requires Task, Templates
 * @extends {Controller}
 */
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